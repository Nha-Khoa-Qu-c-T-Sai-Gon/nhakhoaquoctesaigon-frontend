/**
 * ChatLauncherButton
 *
 * The floating action button that opens/closes the chat panel.
 * Positioned to integrate with the existing floating contact icon stack.
 *
 * Visual style:
 * - Primary dental blue gradient background
 * - Tooth icon with subtle pulse ring when closed
 * - Smooth open/close icon morph
 * - Unread badge (optional)
 */

"use client";

import Image from "next/image";
import { cn } from "@/src/lib/utils";
import type { AIChatConfig } from "@/src/types/strapi";

interface ChatLauncherButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
  aiChatConfig?: AIChatConfig | null;
}

export function ChatLauncherButton({
  isOpen,
  onClick,
  unreadCount = 0,
  aiChatConfig,
}: ChatLauncherButtonProps) {
  const hasAvatar = !!aiChatConfig?.aiAvatar?.url;

  return (
    <div className="relative">
      {/* Pulse ring — only when closed and not having a custom avatar */}
      {!isOpen && !hasAvatar && (
        <>
          <span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-25 pointer-events-none" />
          <span className="absolute inset-[-4px] rounded-full bg-primary-200 animate-ping opacity-10 pointer-events-none [animation-delay:0.4s]" />
        </>
      )}

      <button
        onClick={onClick}
        aria-label={
          isOpen
            ? aiChatConfig?.launcherCloseLabel || "Close chat"
            : aiChatConfig?.launcherOpenLabel || "Open AI Dental Assistant"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden",
          "transition-all duration-300 ease-out",
          "hover:scale-110 active:scale-95",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          isOpen
            ? "bg-gradient-to-br from-gray-600 to-gray-800 shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            : hasAvatar
              ? "bg-transparent border-0 shadow-none"
              : "bg-gradient-to-br from-primary-500 to-primary-700 shadow-[0_8px_24px_rgba(22,81,151,0.35)] hover:shadow-[0_12px_32px_rgba(22,81,151,0.45)]",
        )}
      >
        {/* Icon — morphs between tooth/avatar and X */}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-200",
            isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90",
          )}
          aria-hidden="true"
        >
          {/* Close X */}
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>

        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-200 w-full h-full",
            isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0",
          )}
          aria-hidden="true"
        >
          {hasAvatar ? (
            <Image
              src={aiChatConfig.aiAvatar!.url}
              alt={
                aiChatConfig.aiAvatar!.alt ||
                aiChatConfig.aiName ||
                "AI Assistant"
              }
              fill
              sizes="56px"
              className="object-cover rounded-full"
            />
          ) : (
            /* Chat / tooth icon */
            <span className="flex items-center justify-center w-full h-full">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C9.24 2 7 4.24 7 7c0 1.38.56 2.63 1.46 3.54C7.56 11.45 7 12.7 7 14c0 .92.24 1.78.65 2.54L8.5 22h1l1-4h3l1 4h1l.85-5.46C17.76 15.78 18 14.92 18 14c0-1.3-.56-2.55-1.46-3.46C17.44 9.63 18 8.38 18 7c0-2.76-2.24-5-6-5z" />
              </svg>
            </span>
          )}
        </span>
      </button>

      {/* Unread badge */}
      {unreadCount > 0 && !isOpen && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow"
          aria-label={`${unreadCount} new message${unreadCount !== 1 ? "s" : ""}`}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
}
