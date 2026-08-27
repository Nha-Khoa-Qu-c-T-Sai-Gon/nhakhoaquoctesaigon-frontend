/**
 * Chat Socket Service
 *
 * Native WebSocket service for the Dental AI Assistant chat widget.
 * Handles connect/disconnect/reconnect, message sending, and streaming events.
 *
 * Event protocol (matches chatbox.md spec):
 *   Server → Client:
 *     { type: 'execution_started' }
 *     { type: 'agent_thinking',    data: { message: string } }
 *     { type: 'response_chunk',    data: { chunk: string } }
 *     { type: 'execution_complete', data: { result: { llmOutput: string } } }
 *     { type: 'execution_error',   data: { message: string } }
 *
 *   Client → Server (raw JSON over WebSocket at /api/ws):
 *     {
 *       type: 'execute',
 *       version: 'v1.0',
 *       query: string,
 *       session_id: string,
 *       user_id: string,
 *       channel_id: string,
 *       available_files: [],
 *       llm_model: string,
 *       user_info: { firstName: string, lastName: string }
 *     }
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export interface ChatExecutePayload {
  query: string;
  session_id: string;
  user_id?: string;
  channel_id?: string;
  llm_model?: string;
  user_info?: { firstName?: string; lastName?: string };
  available_files?: string[];
  images?: string[];
}

type Callback<T = void> = (data: T) => void;

interface ServerMessage {
  type:
    | "execution_started"
    | "agent_thinking"
    | "response_chunk"
    | "execution_complete"
    | "execution_error";
  data?: {
    message?: string;
    chunk?: string;
    result?: { llmOutput: string };
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

const RECONNECT_DELAYS_MS = [2_000, 5_000, 10_000]; // exponential-ish backoff
const MAX_RETRIES = 3;
const CONNECTION_TIMEOUT_MS = 10_000; // give up connecting after 10s

class ChatSocketService {
  private ws: WebSocket | null = null;
  private wsUrl: string | null = null;
  private retryCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = false;

  // ── Callbacks ──────────────────────────────────────────────────────────────
  private _onStatusChange: Callback<ConnectionStatus> = () => {};
  private _onExecutionStarted: Callback = () => {};
  private _onAgentThinking: Callback<{ message: string }> = () => {};
  private _onResponseChunk: Callback<{ chunk: string }> = () => {};
  private _onExecutionComplete: Callback<{ result: { llmOutput: string } }> =
    () => {};
  private _onExecutionError: Callback<{ message: string }> = () => {};

  // ── Public Listener Registration ───────────────────────────────────────────

  onStatusChange(cb: Callback<ConnectionStatus>) {
    this._onStatusChange = cb;
  }
  onExecutionStarted(cb: Callback) {
    this._onExecutionStarted = cb;
  }
  onAgentThinking(cb: Callback<{ message: string }>) {
    this._onAgentThinking = cb;
  }
  onResponseChunk(cb: Callback<{ chunk: string }>) {
    this._onResponseChunk = cb;
  }
  onExecutionComplete(cb: Callback<{ result: { llmOutput: string } }>) {
    this._onExecutionComplete = cb;
  }
  onExecutionError(cb: Callback<{ message: string }>) {
    this._onExecutionError = cb;
  }

  // ── Connection ─────────────────────────────────────────────────────────────

  connect(url: string): Promise<void> {
    this.wsUrl = url;
    this.manuallyClosed = false;
    return this._open(url);
  }

  private _open(url: string): Promise<void> {
    // If the URL contains /api/ws or /ws, rewrite it to Socket.IO path
    let formattedUrl = url;
    if (url.includes("/api/ws")) {
      formattedUrl = url.replace(
        "/api/ws",
        "/socket.io/?EIO=4&transport=websocket",
      );
    } else if (url.includes("/ws")) {
      formattedUrl = url.replace(
        "/ws",
        "/socket.io/?EIO=4&transport=websocket",
      );
    } else if (!url.includes("/socket.io/")) {
      formattedUrl = url.endsWith("/")
        ? `${url}socket.io/?EIO=4&transport=websocket`
        : `${url}/socket.io/?EIO=4&transport=websocket`;
    }

    // Auto-upgrade ws:// to wss:// if page is loaded over HTTPS to prevent Mixed Content blocks
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      if (formattedUrl.startsWith("ws://")) {
        formattedUrl = formattedUrl.replace("ws://", "wss://");
      }
    }

    return new Promise((resolve, reject) => {
      this._setStatus("connecting");

      // ── Connection timeout ─────────────────────────────────────────────
      // Native WebSocket has no built-in timeout. If DNS fails or the host
      // is unreachable, the socket can hang in CONNECTING state for 60-90s.
      // We enforce our own timeout to surface the error quickly.
      let settled = false;
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        console.error(
          `[ChatSocket] Connection timed out after ${CONNECTION_TIMEOUT_MS}ms — ${formattedUrl}`,
        );
        // Close the pending socket silently (suppress retry in onclose)
        if (this.ws) {
          this.ws.onclose = null;
          this.ws.onerror = null;
          this.ws.close();
          this.ws = null;
        }
        this._scheduleReconnect();
        reject(new Error("[ChatSocket] Connection timed out"));
      }, CONNECTION_TIMEOUT_MS);

      try {
        const ws = new WebSocket(formattedUrl);
        this.ws = ws;

        ws.onopen = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timeoutId);
          this.retryCount = 0;
          this._setStatus("connected");

          // Send Socket.IO namespace connection packet
          console.log('[ChatSocket] Sending Socket.IO connection packet "40"');
          ws.send("40");

          resolve();
        };

        ws.onmessage = (event: MessageEvent) => {
          this._handleMessage(event);
        };

        ws.onerror = (evt) => {
          // onerror fires before onclose — log it, but let onclose drive retry.
          console.warn("[ChatSocket] WebSocket error event", evt);
        };

        ws.onclose = (evt) => {
          clearTimeout(timeoutId);
          if (this.manuallyClosed) {
            this._setStatus("disconnected");
            return;
          }
          if (!settled) {
            // Failed during initial connect
            settled = true;
            reject(
              new Error(
                `[ChatSocket] Connection closed before open (code ${evt.code})`,
              ),
            );
          }
          this._scheduleReconnect();
        };
      } catch (err) {
        clearTimeout(timeoutId);
        settled = true;
        this._setStatus("error");
        reject(err);
      }
    });
  }

  private _scheduleReconnect() {
    if (this.retryCount >= MAX_RETRIES) {
      console.error("[ChatSocket] Max retries reached — giving up");
      this._setStatus("error");
      return;
    }

    const delay = RECONNECT_DELAYS_MS[this.retryCount] ?? 8_000;
    this.retryCount += 1;
    this._setStatus("reconnecting");

    console.warn(
      `[ChatSocket] Reconnecting in ${delay}ms (attempt ${this.retryCount}/${MAX_RETRIES})`,
    );

    this.reconnectTimer = setTimeout(() => {
      if (this.wsUrl) {
        this._open(this.wsUrl).catch(() => {});
      }
    }, delay);
  }

  disconnect() {
    this.manuallyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.onclose = null; // prevent retry on manual close
      this.ws.close(1000, "Client disconnected");
      this.ws = null;
    }

    this._setStatus("disconnected");
  }

  /** Manually trigger a reconnect (e.g. after user clicks "Reconnect") */
  reconnect() {
    if (!this.wsUrl) return;
    this.retryCount = 0;
    this.manuallyClosed = false;
    this._open(this.wsUrl).catch(() => {});
  }

  // ── Sending ────────────────────────────────────────────────────────────────

  execute(payload: ChatExecutePayload): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("[ChatSocket] Cannot send — socket not open");
      return;
    }

    // Hardcode parameters as requested, matching values in console image:
    const wsPayload = {
      version: "v1.0",
      query: `${payload.query} (Chuyển câu trả lời sang tiếng anh)`,
      session_id: "frontend_3cf1f967-b90c-485f-a612-d61a5aafa2a9",
      user_id: "f68076d8-2f0c-4964-b6ab-806de4a74fa5",
      channel_id: "frontend_channel",
      available_files: [
        "file-1779272882130-p8c0tfhh2",
        "file-1779272916328-ss4p7hkt0",
        "file-1779272955902-tbq7xlgfk",
        "file-1779272977185-uhytc6dr0",
        "file-1779273001226-t8pp8j6w0",
        "file-1779273029669-y5y01q6oy",
        "file-1779273066143-upx3zxwuu",
        "file-1779273079360-cimjzxb2k",
        "file-1779273103996-iwg684qkf",
        "file-1779273128051-dn2cjtjb2",
      ],
      images: payload.images,
      llm_model: "neura-2.0-flash",
      user_info: {
        firstName: "Bùi",
        lastName: "Văn Hoá",
      },
    };

    const framedMessage = "42" + JSON.stringify(["execute", wsPayload]);
    this.ws.send(framedMessage);
  }

  // ── Internals ──────────────────────────────────────────────────────────────

  private _handleMessage(event: MessageEvent) {
    const rawData = event.data as string;

    // Engine.IO / Socket.IO parsing
    if (rawData === "2") {
      // Heartbeat ping from server -> reply with pong '3'
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send("3");
      }
      return;
    }

    if (rawData.startsWith("40")) {
      console.log("[ChatSocket] Socket.IO namespace connected successfully");
      return;
    }

    if (rawData.startsWith("42")) {
      try {
        const payloadStr = rawData.substring(2);
        const [eventName, eventData] = JSON.parse(payloadStr) as [
          string,
          ServerMessage["data"],
        ];

        switch (eventName) {
          case "execution_started":
            this._onExecutionStarted();
            break;

          case "agent_thinking":
            if (eventData?.message) {
              this._onAgentThinking({ message: eventData.message });
            }
            break;

          case "response_chunk":
            if (eventData?.chunk) {
              this._onResponseChunk({ chunk: eventData.chunk });
            }
            break;

          case "execution_complete":
            this._onExecutionComplete({
              result: { llmOutput: eventData?.result?.llmOutput ?? "" },
            });
            break;

          case "execution_error":
          case "error":
            this._onExecutionError({
              message: eventData?.message ?? "Unknown error",
            });
            break;

          default:
            console.warn(
              "[ChatSocket] Unknown Socket.IO event:",
              eventName,
              eventData,
            );
        }
      } catch (err) {
        console.error(
          "[ChatSocket] Failed to parse Socket.IO event payload:",
          rawData,
          err,
        );
      }
      return;
    }

    console.warn(
      "[ChatSocket] Received unexpected non-protocol message:",
      rawData,
    );
  }

  private _setStatus(status: ConnectionStatus) {
    this._onStatusChange(status);
  }
}

// Export a singleton instance
export const chatSocketService = new ChatSocketService();
