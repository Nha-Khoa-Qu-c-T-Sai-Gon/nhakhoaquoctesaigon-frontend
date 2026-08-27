/**
 * ChatComposer
 *
 * The message input bar at the bottom of the chat panel.
 * Features:
 * - Auto-growing textarea (max 3 rows)
 * - Enter to send, Shift+Enter for newline
 * - Disabled state during loading/streaming
 * - Character limit soft indicator (200 chars)
 */

"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { CHAT_WIDGET_IMAGE_UPLOAD_ENABLED } from "./chatWidgetConfig";

const MAX_CHARS = 500;

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string, images?: { url: string; base64: string }[]) => void;
  attachedImages: { id: string; url: string; base64: string; name: string }[];
  setAttachedImages: React.Dispatch<
    React.SetStateAction<
      { id: string; url: string; base64: string; name: string }[]
    >
  >;
  disabled?: boolean;
  placeholder?: string;
  isMaximized?: boolean;
}

export function ChatComposer({
  value,
  onChange,
  onSend,
  attachedImages,
  setAttachedImages,
  disabled = false,
  placeholder = "Type your question...",
  isMaximized = false,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

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

  const handleFileSelect = () => {
    if (!CHAT_WIDGET_IMAGE_UPLOAD_ENABLED) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!CHAT_WIDGET_IMAGE_UPLOAD_ENABLED) return;

    const files = e.target.files;
    if (!files) return;

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

    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (id: string) => {
    setAttachedImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const canSend =
    (value.trim().length > 0 ||
      (CHAT_WIDGET_IMAGE_UPLOAD_ENABLED && attachedImages.length > 0)) &&
    !disabled;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(
      value,
      CHAT_WIDGET_IMAGE_UPLOAD_ENABLED
        ? attachedImages.map((img) => ({ url: img.url, base64: img.base64 }))
        : undefined,
    );
    onChange("");
    setAttachedImages([]);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [canSend, onSend, value, onChange, attachedImages, setAttachedImages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length > MAX_CHARS) return;
    onChange(newValue);

    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`; // max ~4 lines
  };

  const overLimit = value.length > MAX_CHARS * 0.85;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-b-[inherit]",
        isMaximized ? "bg-gray-50/50 px-8 py-5" : "bg-white px-4 pb-4 pt-2",
      )}
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-2">
        {/* Attached Images Preview Area */}
        {CHAT_WIDGET_IMAGE_UPLOAD_ENABLED && attachedImages.length > 0 && (
          <div className="flex flex-wrap gap-2.5 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {attachedImages.map((img) => (
              <div
                key={img.id}
                className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50 shrink-0"
              >
                <Image
                  src={img.url}
                  alt={img.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.id)}
                  aria-label="Remove image"
                  className="absolute top-1 right-1 w-4.5 h-4.5 bg-gray-950/60 text-white rounded-full flex items-center justify-center hover:bg-gray-950 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Pill */}
        <div
          className={cn(
            "bg-white border transition-all duration-200 flex items-end",
            isMaximized
              ? "border-gray-200 hover:border-gray-300 rounded-2xl px-4 py-3 gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10"
              : isFocused
                ? "border-primary-400 ring-2 ring-primary-500/10 rounded-xl px-3 py-2 gap-2"
                : "border-gray-200 hover:border-gray-300 rounded-xl px-3 py-2 gap-2",
          )}
        >
          {/* File Input and Trigger Button */}
          {CHAT_WIDGET_IMAGE_UPLOAD_ENABLED && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={handleFileSelect}
                disabled={disabled}
                aria-label="Attach image"
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-label="Nhập tin nhắn"
            aria-multiline="true"
            className={cn(
              "flex-1 resize-none bg-transparent text-sm text-gray-800",
              "placeholder:text-gray-400 leading-relaxed outline-none",
              "min-h-[24px] max-h-32 py-0.5",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-150",
            )}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              "transition-all duration-200",
              canSend
                ? "bg-primary-500 text-white hover:bg-primary-600 active:scale-90 shadow-sm hover:shadow-md cursor-pointer"
                : "bg-gray-100 text-gray-300 cursor-not-allowed",
            )}
          >
            <svg
              className="w-4 h-4 translate-x-px"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>

        {/* Footer info (hints / character limit) */}
        <div className="flex items-center justify-between px-1 text-[11px] text-gray-400">
          {/* Character counter (only when approaching limit) */}
          {overLimit && (
            <p className="text-amber-500 leading-none font-medium">
              {value.length}/{MAX_CHARS}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
