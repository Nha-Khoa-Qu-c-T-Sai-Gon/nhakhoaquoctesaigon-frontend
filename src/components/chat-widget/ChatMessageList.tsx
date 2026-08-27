/**
 * ChatMessageList
 *
 * Scrollable message area. Handles:
 * - Rendering committed messages
 * - Live streaming message at the bottom
 * - Thinking bubble while waiting for chunks
 * - Auto-scroll to bottom on new content
 * - Empty state when no messages
 */

"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, ThinkingBubble } from "./ChatMessage";
import { ChatEmptyState } from "./ChatEmptyState";
import type { ChatMessage as ChatMessageType } from "@/src/hooks/useChatSocket";
import type { AIChatConfig } from "@/src/types/strapi";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  streamingResponse: string;
  thinkingMessage: string;
  isLoading: boolean;
  isStreaming: boolean;
  onQuickReply: (prompt: string) => void;
  aiChatConfig?: AIChatConfig | null;
}

export function ChatMessageList({
  messages,
  streamingResponse,
  thinkingMessage,
  isLoading,
  isStreaming,
  onQuickReply,
  aiChatConfig,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever content changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingResponse, thinkingMessage, isLoading]);

  const isEmpty =
    messages.length === 0 && !isLoading && !isStreaming && !thinkingMessage;

  return (
    <div
      className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 scroll-smooth"
      aria-label="Conversation"
      aria-live="polite"
    >
      <div className="max-w-4xl mx-auto w-full space-y-3">
        {isEmpty ? (
          <ChatEmptyState
            onQuickReply={onQuickReply}
            aiChatConfig={aiChatConfig}
          />
        ) : (
          <>
            {/* Committed messages */}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                aiChatConfig={aiChatConfig}
              />
            ))}

            {/* Thinking indicator — shown while waiting for response chunks */}
            {(isLoading || isStreaming || !!thinkingMessage) &&
              !streamingResponse.trim() && (
                <ThinkingBubble aiChatConfig={aiChatConfig} />
              )}

            {/* Live streaming message */}
            {isStreaming && streamingResponse.trim() && (
              <ChatMessage
                message={{
                  role: "assistant",
                  content: streamingResponse,
                  id: "streaming",
                }}
                isStreaming
                aiChatConfig={aiChatConfig}
              />
            )}
          </>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-px" aria-hidden="true" />
      </div>
    </div>
  );
}
