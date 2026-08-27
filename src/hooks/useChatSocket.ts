/**
 * useChatSocket — Hook
 *
 * Connects to the WebSocket chat service and routes incoming events into
 * caller-provided callbacks. Handles the full connection lifecycle including
 * reconnection state.
 *
 * Returns `connectionStatus` so the UI can reflect the socket state.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  chatSocketService,
  type ConnectionStatus,
} from "@/src/services/chatSocketService";

export interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
  id: string;
  images?: string[];
}

interface UseChatSocketOptions {
  onMessageReceived: (message: ChatMessage) => void;
  onLoadingChange: (loading: boolean) => void;
  onStreamingChange: (streaming: boolean) => void;
  onStreamingResponseChange: (text: string) => void;
  onThinkingMessageChange: (message: string) => void;
  isSendingRef: React.MutableRefObject<boolean>;
}

interface UseChatSocketReturn {
  connectionStatus: ConnectionStatus;
  reconnect: () => void;
}

export function useChatSocket({
  onMessageReceived,
  onLoadingChange,
  onStreamingChange,
  onStreamingResponseChange,
  onThinkingMessageChange,
  isSendingRef,
}: UseChatSocketOptions): UseChatSocketReturn {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");

  // Accumulate streaming chunks without causing re-renders for every chunk
  const streamingResponseRef = useRef("");

  const wsUrl = process.env.NEXT_PUBLIC_CHAT_WS_URL;

  useEffect(() => {
    // If no WebSocket URL configured, stay in disconnected state gracefully
    if (!wsUrl) {
      console.warn(
        "[useChatSocket] NEXT_PUBLIC_CHAT_WS_URL is not set — chat widget is offline",
      );
      setConnectionStatus("disconnected");
      return;
    }

    let mounted = true;

    // Register status callback first so we get 'connecting' before connect()
    chatSocketService.onStatusChange((status) => {
      if (mounted) setConnectionStatus(status);
    });

    // ── Register all event handlers ───────────────────────────────────────

    chatSocketService.onExecutionStarted(() => {
      if (!mounted) return;
      onStreamingChange(false);
      onThinkingMessageChange("");
      streamingResponseRef.current = "";
      onStreamingResponseChange("");
    });

    chatSocketService.onAgentThinking(({ message }) => {
      if (!mounted) return;
      onStreamingChange(false);
      onThinkingMessageChange(message);
    });

    chatSocketService.onResponseChunk(({ chunk }) => {
      if (!mounted) return;
      if (streamingResponseRef.current === "") {
        onStreamingChange(true);
        onThinkingMessageChange("");
      }
      streamingResponseRef.current += chunk;
      onStreamingResponseChange(streamingResponseRef.current);
    });

    chatSocketService.onExecutionComplete(({ result }) => {
      if (!mounted) return;

      onLoadingChange(false);
      onStreamingChange(false);
      onThinkingMessageChange("");
      isSendingRef.current = false;

      const finalContent =
        streamingResponseRef.current || result.llmOutput || "";

      if (finalContent) {
        onMessageReceived({
          role: "assistant",
          content: finalContent,
          id: `ai-${Date.now()}`,
        });
      }

      streamingResponseRef.current = "";
      onStreamingResponseChange("");
    });

    chatSocketService.onExecutionError(({ message }) => {
      if (!mounted) return;

      onLoadingChange(false);
      onStreamingChange(false);
      onThinkingMessageChange("");
      isSendingRef.current = false;
      streamingResponseRef.current = "";
      onStreamingResponseChange("");

      onMessageReceived({
        role: "error",
        content: message || "An error occurred. Please try again.",
        id: `err-${Date.now()}`,
      });
    });

    // ── Connect ───────────────────────────────────────────────────────────
    chatSocketService.connect(wsUrl).catch((err: unknown) => {
      console.error("[useChatSocket] Initial connect failed:", err);
      // Ensure UI reflects error state (service will schedule reconnect automatically)
      if (mounted) setConnectionStatus("error");
    });

    return () => {
      mounted = false;
      chatSocketService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl]);

  const reconnect = () => {
    chatSocketService.reconnect();
  };

  return { connectionStatus, reconnect };
}
