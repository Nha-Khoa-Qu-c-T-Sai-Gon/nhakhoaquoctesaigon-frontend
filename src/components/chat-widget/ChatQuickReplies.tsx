/**
 * ChatQuickReplies
 *
 * Quick-prompt chips shown in empty state or after responses.
 * Tapping a chip fills the composer input and optionally auto-sends.
 */

"use client";

import { cn } from "@/src/lib/utils";
import type { CommonQuestion } from "@/src/types/strapi";

interface QuickReply {
  label: string;
  prompt: string;
  emoji?: string;
}

const QUICK_REPLIES: QuickReply[] = [
  {
    emoji: "📅",
    label: "Book a Consultation",
    prompt: "I would like to book a dental consultation.",
  },
  {
    emoji: "🦷",
    label: "Dental Implants",
    prompt: "Tell me more about your dental implant services.",
  },
  {
    emoji: "😁",
    label: "Braces & Orthodontics",
    prompt: "What orthodontic and braces options do you offer?",
  },
  {
    emoji: "✨",
    label: "Teeth Whitening",
    prompt: "What is the cost of teeth whitening?",
  },
  {
    emoji: "💰",
    label: "Pricing & Services",
    prompt: "Can you show me the pricing list for your dental services?",
  },
];

interface ChatQuickRepliesProps {
  onSelect: (prompt: string) => void;
  className?: string;
  customReplies?: CommonQuestion[];
}

export function ChatQuickReplies({
  onSelect,
  className,
  customReplies,
}: ChatQuickRepliesProps) {
  const replies =
    customReplies && customReplies.length > 0 ? customReplies : QUICK_REPLIES;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {replies.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.prompt)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
            "bg-primary-50 text-primary-700 border border-primary-200",
            "hover:bg-primary-100 hover:border-primary-300",
            "active:scale-95 transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
          )}
          aria-label={`Ask about: ${item.label}`}
        >
          {item.emoji && <span aria-hidden="true">{item.emoji}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
