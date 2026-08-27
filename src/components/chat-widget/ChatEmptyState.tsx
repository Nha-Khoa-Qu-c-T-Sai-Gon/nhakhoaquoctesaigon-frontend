/**
 * ChatEmptyState
 *
 * Displayed when the conversation has no messages.
 * Branded welcome screen with quick-reply chips.
 */

"use client";

import Image from "next/image";
import { ChatQuickReplies } from "./ChatQuickReplies";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import type { AIChatConfig } from "@/src/types/strapi";

interface ChatEmptyStateProps {
  onQuickReply: (prompt: string) => void;
  aiChatConfig?: AIChatConfig | null;
}

export function ChatEmptyState({
  onQuickReply,
  aiChatConfig,
}: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center px-4 pt-6 pb-2">
      {/* Clinic icon / avatar */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${
          aiChatConfig?.aiAvatar?.url
            ? "bg-transparent shadow-none"
            : "bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg"
        }`}
      >
        {aiChatConfig?.aiAvatar?.url ? (
          <Image
            src={aiChatConfig.aiAvatar.url}
            alt={
              aiChatConfig.aiAvatar.alt || aiChatConfig.aiName || "AI Avatar"
            }
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C9.24 2 7 4.24 7 7c0 1.38.56 2.63 1.46 3.54C7.56 11.45 7 12.7 7 14c0 .92.24 1.78.65 2.54L8.5 22h1l1-4h3l1 4h1l.85-5.46C17.76 15.78 18 14.92 18 14c0-1.3-.56-2.55-1.46-3.46C17.44 9.63 18 8.38 18 7c0-2.76-2.24-5-6-5z" />
          </svg>
        )}
      </div>

      {/* Greeting / Welcome message */}
      {aiChatConfig?.welcomeMessage ? (
        <div className="text-sm text-gray-600 mb-5 max-w-[280px] leading-relaxed whitespace-pre-line">
          {aiChatConfig.welcomeMessage}
        </div>
      ) : (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {aiChatConfig?.emptyStateTitle || "Hello! 👋"}
          </h3>
          <p className="text-sm text-gray-500 mb-1 leading-snug">
            {aiChatConfig?.emptyStateSubtitle ||
              "I'm the AI dental assistant at"}
          </p>
          <p className="text-sm font-medium text-primary-700 mb-4">
            {CLINIC_INFO.name}
          </p>
          <p className="text-xs text-gray-400 mb-5 max-w-[240px] leading-relaxed">
            {aiChatConfig?.emptyStateDescription ||
              "I can answer questions about our dental services, appointment scheduling, and anything else you'd like to know."}
          </p>
        </>
      )}

      {/* Quick replies */}
      <div className="w-full">
        <p className="text-xs text-gray-400 mb-2 text-left font-medium">
          {aiChatConfig?.quickRepliesTitle || "Common questions:"}
        </p>
        <ChatQuickReplies
          onSelect={onQuickReply}
          className="justify-start"
          customReplies={aiChatConfig?.commonQuestions}
        />
      </div>
    </div>
  );
}
