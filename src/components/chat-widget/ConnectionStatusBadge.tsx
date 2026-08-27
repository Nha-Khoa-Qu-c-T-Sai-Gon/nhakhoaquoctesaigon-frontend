/**
 * ConnectionStatusBadge
 *
 * A small indicator showing the WebSocket connection state.
 * Renders in the chat panel header.
 */

"use client";

import { cn } from "@/src/lib/utils";
import type { ConnectionStatus } from "@/src/services/chatSocketService";

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
  onReconnect?: () => void;
  className?: string;
}

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; dotClass: string; pulse: boolean }
> = {
  idle: { label: "Starting up", dotClass: "bg-gray-400", pulse: false },
  connecting: { label: "Connecting...", dotClass: "bg-amber-400", pulse: true },
  connected: { label: "Online", dotClass: "bg-emerald-500", pulse: false },
  reconnecting: {
    label: "Reconnecting...",
    dotClass: "bg-amber-400",
    pulse: true,
  },
  disconnected: {
    label: "Disconnected",
    dotClass: "bg-rose-500",
    pulse: false,
  },
  error: { label: "Connection error", dotClass: "bg-rose-500", pulse: false },
};

export function ConnectionStatusBadge({
  status,
  onReconnect,
  className,
}: ConnectionStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  const showReconnect =
    (status === "disconnected" || status === "error") && onReconnect;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {/* Status dot */}
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.dotClass,
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            config.dotClass,
          )}
        />
      </span>

      {/* Label */}
      <span className="text-xs text-gray-500 leading-none">{config.label}</span>

      {/* Reconnect button */}
      {showReconnect && (
        <button
          onClick={onReconnect}
          className="text-xs text-primary-600 hover:text-primary-700 underline leading-none ml-0.5 transition-colors"
          aria-label="Try reconnecting"
        >
          Retry
        </button>
      )}
    </div>
  );
}
