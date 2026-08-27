/**
 * useChatMessageSender — Hook
 *
 * Handles sending a message via the chatSocketService.
 * Manages optimistic UI updates and guards against duplicate sends.
 */

"use client";

import { useRef } from "react";
import { chatSocketService } from "@/src/services/chatSocketService";
import type { ChatMessage } from "./useChatSocket";
import { CHAT_WIDGET_IMAGE_UPLOAD_ENABLED } from "@/src/components/chat-widget/chatWidgetConfig";

interface UseChatMessageSenderOptions {
  onMessageAdd: (message: ChatMessage) => void;
  onLoadingChange: (loading: boolean) => void;
  sessionId: string;
}

interface UseChatMessageSenderReturn {
  sendMessage: (
    text: string,
    images?: { url: string; base64: string }[],
  ) => Promise<boolean>;
  isSendingRef: React.MutableRefObject<boolean>;
}

export function useChatMessageSender({
  onMessageAdd,
  onLoadingChange,
  sessionId,
}: UseChatMessageSenderOptions): UseChatMessageSenderReturn {
  const isSendingRef = useRef(false);

  const sendMessage = async (
    text: string,
    images?: { url: string; base64: string }[],
  ): Promise<boolean> => {
    const trimmed = text.trim();
    const enabledImages = CHAT_WIDGET_IMAGE_UPLOAD_ENABLED ? images : undefined;
    if (!trimmed && (!enabledImages || enabledImages.length === 0)) return false;

    // Guard against duplicate sends
    if (isSendingRef.current) return false;
    isSendingRef.current = true;

    // 1. Optimistic UI: show the user's message immediately
    onMessageAdd({
      role: "user",
      content: trimmed,
      id: `user-${Date.now()}`,
      images: enabledImages?.map((img) => img.url),
    });
    onLoadingChange(true);

    // 2. Send over WebSocket
    try {
      chatSocketService.execute({
        query: trimmed,
        session_id: sessionId,
        images: enabledImages?.map((img) => img.base64),
      });
      return true;
    } catch (error) {
      console.error("[useChatMessageSender] Send failed:", error);
      onLoadingChange(false);
      isSendingRef.current = false;

      onMessageAdd({
        role: "error",
        content: "Failed to send message. Please try again.",
        id: `err-send-${Date.now()}`,
      });

      return false;
    }
  };

  return { sendMessage, isSendingRef };
}
