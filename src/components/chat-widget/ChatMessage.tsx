/**
 * ChatMessage
 *
 * Renders a single message bubble — user, assistant, or error.
 * Assistant messages render with ChatMarkdown for rich text support.
 */

"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { ChatMarkdown } from "./ChatMarkdown";
import type { ChatMessage as ChatMessageType } from "@/src/hooks/useChatSocket";
import type { AIChatConfig } from "@/src/types/strapi";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  aiChatConfig?: AIChatConfig | null;
}

export function ChatMessage({
  message,
  isStreaming,
  aiChatConfig,
}: ChatMessageProps) {
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(
    null,
  );
  const isUser = message.role === "user";
  const isError = message.role === "error";

  if (isError) {
    return (
      <div className="flex justify-center my-1">
        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs px-3 py-1.5 rounded-full">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1.5 w-full max-w-[85%] ml-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Render images */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-col items-end gap-2 mb-0.5">
            {message.images.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFullImage(imgUrl)}
                className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] cursor-pointer hover:opacity-95 transition-opacity w-[260px] aspect-[4/3] bg-gray-50 shrink-0"
              >
                <Image
                  src={imgUrl}
                  alt="Uploaded attachment"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Render text bubble */}
        {message.content && (
          <div
            className={cn(
              "relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm font-normal text-white",
              "bg-[#2f2f2f] rounded-tr-md",
            )}
          >
            <p>{message.content}</p>
          </div>
        )}

        {/* Lightbox / ChatGPT-like expand modal */}
        {selectedFullImage &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
              onClick={() => setSelectedFullImage(null)}
            >
              <button
                type="button"
                onClick={() => setSelectedFullImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer z-10"
                aria-label="Close full view"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="relative w-full h-full max-w-4xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={selectedFullImage}
                  alt="Expanded view"
                  fill
                  unoptimized
                  className="object-contain rounded-lg animate-in zoom-in-95 duration-200 shadow-2xl"
                />
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-end flex-row animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Assistant avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shadow-sm relative",
          aiChatConfig?.aiAvatar?.url
            ? "bg-transparent shadow-none"
            : "bg-gradient-to-br from-primary-500 to-primary-700",
        )}
      >
        {aiChatConfig?.aiAvatar?.url ? (
          <Image
            src={aiChatConfig.aiAvatar.url}
            alt={aiChatConfig.aiAvatar.alt || aiChatConfig.aiName || "AI"}
            fill
            sizes="28px"
            className="object-cover"
          />
        ) : (
          /* Tooth icon SVG */
          <svg
            className="w-3.5 h-3.5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C9.24 2 7 4.24 7 7c0 1.38.56 2.63 1.46 3.54C7.56 11.45 7 12.7 7 14c0 .92.24 1.78.65 2.54L8.5 22h1l1-4h3l1 4h1l.85-5.46C17.76 15.78 18 14.92 18 14c0-1.3-.56-2.55-1.46-3.46C17.44 9.63 18 8.38 18 7c0-2.76-2.24-5-6-5z" />
          </svg>
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "relative max-w-[82%] rounded-2xl px-3.5 py-2.5 bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        )}
      >
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 mt-1">
            {message.images.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFullImage(imgUrl)}
                className="relative rounded-lg overflow-hidden border border-white/20 shadow-sm cursor-pointer hover:opacity-90 transition-opacity w-20 h-20 bg-gray-50 shrink-0"
              >
                <Image
                  src={imgUrl}
                  alt="Uploaded attachment"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <ChatMarkdown content={message.content} />

        {/* Streaming cursor */}
        {isStreaming && (
          <span className="inline-block w-0.5 h-3.5 bg-primary-500 ml-0.5 animate-pulse rounded-full align-middle" />
        )}
      </div>

      {/* Lightbox / ChatGPT-like expand modal */}
      {selectedFullImage &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
            onClick={() => setSelectedFullImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedFullImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              aria-label="Close full view"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full h-full max-w-4xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedFullImage}
                alt="Expanded view"
                fill
                unoptimized
                className="object-contain rounded-lg animate-in zoom-in-95 duration-200 shadow-2xl"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/**
 * ThinkingBubble
 * Premium animated "..." indicator showing active responsive waiting state.
 */
interface ThinkingBubbleProps {
  aiChatConfig?: AIChatConfig | null;
}

export function ThinkingBubble({ aiChatConfig }: ThinkingBubbleProps) {
  return (
    <div className="flex gap-2 items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Assistant avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center overflow-hidden shadow-sm relative",
          aiChatConfig?.aiAvatar?.url
            ? "bg-transparent shadow-none"
            : "bg-gradient-to-br from-primary-500 to-primary-700",
        )}
      >
        {aiChatConfig?.aiAvatar?.url ? (
          <Image
            src={aiChatConfig.aiAvatar.url}
            alt={aiChatConfig.aiAvatar.alt || aiChatConfig.aiName || "AI"}
            fill
            sizes="28px"
            className="object-cover"
          />
        ) : (
          <svg
            className="w-3.5 h-3.5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C9.24 2 7 4.24 7 7c0 1.38.56 2.63 1.46 3.54C7.56 11.45 7 12.7 7 14c0 .92.24 1.78.65 2.54L8.5 22h1l1-4h3l1 4h1l.85-5.46C17.76 15.78 18 14.92 18 14c0-1.3-.56-2.55-1.46-3.46C17.44 9.63 18 8.38 18 7c0-2.76-2.24-5-6-5z" />
          </svg>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden">
        {/* Subtle pulsing background glow indicating active processing */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent animate-pulse pointer-events-none" />

        <div className="flex items-center gap-1.5 h-4 relative z-10">
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
