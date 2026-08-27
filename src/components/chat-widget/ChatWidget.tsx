/**
 * ChatWidget
 *
 * Root smart component for the dental AI assistant chat widget.
 * Orchestrates all state, hooks, and child components.
 *
 * Renders:
 *   - ChatLauncherButton (always visible)
 *   - ChatPanel (shown when open)
 *
 * State lives here:
 *   - isOpen / panel visibility
 *   - messages (committed conversation history)
 *   - isLoading, isStreaming, streamingResponse, thinkingMessage
 *   - inputValue
 *
 * Hooks used:
 *   - useChatSocket: WebSocket connection + event routing
 *   - useChatMessageSender: send messages + isSendingRef
 */

"use client";

import { useState, useCallback, useId, useEffect, useRef } from "react";
import { useChatSocket, type ChatMessage } from "@/src/hooks/useChatSocket";
import { useChatMessageSender } from "@/src/hooks/useChatMessageSender";
import { ChatLauncherButton } from "./ChatLauncherButton";
import { ChatPanel } from "./ChatPanel";
import type { AIChatConfig } from "@/src/types/strapi";
import { CHAT_WIDGET_IMAGE_UPLOAD_ENABLED } from "./chatWidgetConfig";

interface ChatWidgetProps {
  aiChatConfig?: AIChatConfig | null;
}

export function ChatWidget({ aiChatConfig }: ChatWidgetProps) {
  const defaultOpen = aiChatConfig?.defaultOpen ?? true;

  // ── Hydration state ───────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);

  // ── Panel state ──────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mobile screens, default open state is false
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsOpen(false);
    } else {
      setIsOpen(defaultOpen);
    }
  }, [defaultOpen]);

  // Reset maximized state when chat panel is closed
  useEffect(() => {
    if (!isOpen) {
      setIsMaximized(false);
    }
  }, [isOpen]);

  // ── Message state ────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [thinkingMessage, setThinkingMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  // ── Stable session ID (per widget mount) ──────────────────────────────────
  // useId gives a stable deterministic string across SSR/CSR
  const rawId = useId();
  const sessionId = `dental-session-${rawId.replace(/:/g, "")}`;

  // ── Callbacks (stable references) ─────────────────────────────────────────
  const addMessage = useCallback(
    (msg: ChatMessage) => setMessages((prev) => [...prev, msg]),
    [],
  );

  // ── Sender hook (provides both isSendingRef and sendMessage) ────────────
  const { sendMessage, isSendingRef } = useChatMessageSender({
    onMessageAdd: addMessage,
    onLoadingChange: setIsLoading,
    sessionId,
  });

  // ── Socket hook (routes streaming events into state) ─────────────────────
  const { connectionStatus, reconnect } = useChatSocket({
    onMessageReceived: addMessage,
    onLoadingChange: setIsLoading,
    onStreamingChange: setIsStreaming,
    onStreamingResponseChange: setStreamingResponse,
    onThinkingMessageChange: setThinkingMessage,
    isSendingRef,
  });

  const handleSend = useCallback(
    async (text: string, images?: { url: string; base64: string }[]) => {
      const enabledImages = CHAT_WIDGET_IMAGE_UPLOAD_ENABLED ? images : undefined;
      if (!text.trim() && (!enabledImages || enabledImages.length === 0)) return;
      setInputValue("");
      await sendMessage(text, enabledImages);
    },
    [sendMessage],
  );

  // Auto-open panel on first quick reply
  const handleQuickReply = useCallback(
    (prompt: string) => {
      if (!isOpen) setIsOpen(true);
      handleSend(prompt);
    },
    [isOpen, handleSend],
  );

  const widgetRef = useRef<HTMLDivElement>(null);

  // Close panel on clicking outside the chat widget
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <ChatLauncherButton
        isOpen={false}
        onClick={() => setIsOpen(true)}
        aiChatConfig={aiChatConfig}
      />
    );
  }

  return (
    <div ref={widgetRef}>
      {/* The chat panel (portal-like, but keeps it simple since FloatingContactWrapper is already fixed) */}
      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isMaximized={isMaximized}
        onToggleMaximize={() => setIsMaximized((prev) => !prev)}
        messages={messages}
        streamingResponse={streamingResponse}
        thinkingMessage={thinkingMessage}
        isLoading={isLoading}
        isStreaming={isStreaming}
        connectionStatus={connectionStatus}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        onQuickReply={handleQuickReply}
        onReconnect={reconnect}
        aiChatConfig={aiChatConfig}
      />

      {/* The launcher button */}
      <ChatLauncherButton
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        aiChatConfig={aiChatConfig}
      />
    </div>
  );
}
