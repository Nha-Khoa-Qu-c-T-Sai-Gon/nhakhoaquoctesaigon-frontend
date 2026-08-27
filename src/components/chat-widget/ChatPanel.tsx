/**
 * ChatPanel
 *
 * The expandable chat panel shell.
 *
 * Desktop: 380×560px panel fixed above the launcher button
 * Mobile: near-full-screen bottom sheet (h-[90dvh])
 *
 * Panel structure:
 *   ┌──────────────────────────────┐
 *   │  Header (avatar, status, X)  │
 *   ├──────────────────────────────┤
 *   │  ChatMessageList (flex-1)    │
 *   ├──────────────────────────────┤
 *   │  ChatComposer                │
 *   └──────────────────────────────┘
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";
import { ChatMessageList } from "./ChatMessageList";
import { ChatComposer } from "./ChatComposer";
import { Maximize2, Minimize2 } from "lucide-react";
import type { ConnectionStatus } from "@/src/services/chatSocketService";
import type { ChatMessage } from "@/src/hooks/useChatSocket";
import type { AIChatConfig } from "@/src/types/strapi";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { CHAT_WIDGET_IMAGE_UPLOAD_ENABLED } from "./chatWidgetConfig";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  messages: ChatMessage[];
  streamingResponse: string;
  thinkingMessage: string;
  isLoading: boolean;
  isStreaming: boolean;
  connectionStatus: ConnectionStatus;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: (text: string, images?: { url: string; base64: string }[]) => void;
  onQuickReply: (prompt: string) => void;
  onReconnect: () => void;
  aiChatConfig?: AIChatConfig | null;
}

export function ChatPanel({
  isOpen,
  onClose,
  isMaximized,
  onToggleMaximize,
  messages,
  streamingResponse,
  thinkingMessage,
  isLoading,
  isStreaming,
  connectionStatus,
  inputValue,
  onInputChange,
  onSend,
  onQuickReply,
  onReconnect,
  aiChatConfig,
}: ChatPanelProps) {
  const { shouldSimplify } = useMobileAnimation();
  const [attachedImages, setAttachedImages] = useState<
    { id: string; url: string; base64: string; name: string }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!CHAT_WIDGET_IMAGE_UPLOAD_ENABLED) return;
    if (connectionStatus !== "connected" || isLoading || isStreaming) return;
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!CHAT_WIDGET_IMAGE_UPLOAD_ENABLED) return;
    if (connectionStatus !== "connected" || isLoading || isStreaming) return;
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (!CHAT_WIDGET_IMAGE_UPLOAD_ENABLED) return;
    if (connectionStatus !== "connected" || isLoading || isStreaming) return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newImages = [...attachedImages];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      try {
        const base64 = await fileToBase64(file);
        const url = URL.createObjectURL(file);
        newImages.push({
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
          url,
          base64,
          name: file.name,
        });
      } catch (err) {
        console.error("Failed to convert file to base64:", err);
      }
    }
    setAttachedImages(newImages);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);



  // Reset drag state on close
  useEffect(() => {
    if (!isOpen) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  }, [isOpen]);

  const attachedImagesRef = useRef(attachedImages);
  useEffect(() => {
    attachedImagesRef.current = attachedImages;
  }, [attachedImages]);

  useEffect(() => {
    return () => {
      attachedImagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  const isSendDisabled =
    isLoading || isStreaming || connectionStatus !== "connected";

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[49] transition-opacity duration-300",
            isMaximized ? "block" : "hidden sm:hidden",
          )}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <MotionDiv
        role="dialog"
        aria-modal="true"
        aria-label={aiChatConfig?.panelAriaLabel || "AI Dental Assistant Chat"}
        layout={!shouldSimplify}
        initial={
          !shouldSimplify ? { opacity: 0, y: 20, scale: 0.95 } : undefined
        }
        animate={
          !shouldSimplify
            ? {
                opacity: isOpen ? 1 : 0,
                y: isOpen ? 0 : 20,
                scale: isOpen ? 1 : 0.95,
                pointerEvents: isOpen ? ("auto" as const) : ("none" as const),
              }
            : undefined
        }
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 32,
          mass: 0.8,
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          // Base
          "fixed z-[50] flex flex-col",
          "bg-white/95 backdrop-blur-sm",
          "border border-gray-200/80",
          "shadow-[0_24px_64px_rgba(22,81,151,0.15),0_8px_24px_rgba(0,0,0,0.08)]",
          "overflow-hidden",

          // Desktop layout
          isMaximized
            ? "sm:bottom-6 sm:right-6 sm:w-[calc(100vw-3rem)] sm:h-[calc(100vh-3rem)] sm:max-w-[1050px] sm:max-h-[780px] sm:rounded-3xl"
            : "sm:bottom-6 sm:right-24 sm:w-[380px] sm:h-[560px] sm:max-h-[80dvh] sm:rounded-2xl",

          // Mobile layout — bottom sheet
          "bottom-0 left-0 right-0",
          isMaximized ? "h-[100dvh] rounded-none" : "h-[90dvh] rounded-t-3xl",
          "sm:left-auto sm:h-auto sm:rounded-2xl",

          // Fallback CSS transitions for mobile only (when shouldSimplify is true)
          shouldSimplify && [
            "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto visible"
              : "opacity-0 translate-y-4 pointer-events-none invisible",
            "max-sm:transition-transform max-sm:duration-300",
            !isOpen && "max-sm:translate-y-full",
          ],
        )}
      >
        {/* Full Panel Drop Zone Overlay - border styling only */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary-500/[0.04] border-4 border-dashed border-primary-500 rounded-[inherit] z-30 pointer-events-none animate-in fade-in duration-200" />
        )}

        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-[inherit]">
          {/* Clinic avatar */}
          <div
            className={cn(
              "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden relative",
              aiChatConfig?.aiAvatar?.url ? "bg-transparent" : "bg-white/20",
            )}
          >
            {aiChatConfig?.aiAvatar?.url ? (
              <Image
                src={aiChatConfig.aiAvatar.url}
                alt={
                  aiChatConfig.aiAvatar.alt ||
                  aiChatConfig.aiName ||
                  "AI Avatar"
                }
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C9.24 2 7 4.24 7 7c0 1.38.56 2.63 1.46 3.54C7.56 11.45 7 12.7 7 14c0 .92.24 1.78.65 2.54L8.5 22h1l1-4h3l1 4h1l.85-5.46C17.76 15.78 18 14.92 18 14c0-1.3-.56-2.55-1.46-3.46C17.44 9.63 18 8.38 18 7c0-2.76-2.24-5-6-5z" />
              </svg>
            )}
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {aiChatConfig?.aiName || "AI Dental Assistant"}
            </p>
            <ConnectionStatusBadge
              status={connectionStatus}
              onReconnect={onReconnect}
              className="[&_span.text-gray-500]:text-white/70 [&_button]:text-white/90"
            />
          </div>

          {/* Maximize / Minimize button */}
          <button
            onClick={onToggleMaximize}
            aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 active:bg-white/25 transition-all duration-150"
          >
            {isMaximized ? (
              <Minimize2 className="w-4.5 h-4.5" />
            ) : (
              <Maximize2 className="w-4.5 h-4.5" />
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={aiChatConfig?.launcherCloseLabel || "Close chat"}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 active:bg-white/25 transition-all duration-150"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* ─── Message List ────────────────────────────────────── */}
        <ChatMessageList
          messages={messages}
          streamingResponse={streamingResponse}
          thinkingMessage={thinkingMessage}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onQuickReply={onQuickReply}
          aiChatConfig={aiChatConfig}
        />

        {/* ─── Composer ────────────────────────────────────────── */}
        <ChatComposer
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          attachedImages={attachedImages}
          setAttachedImages={setAttachedImages}
          disabled={isSendDisabled}
          isMaximized={isMaximized}
        />
      </MotionDiv>
    </>
  );
}
