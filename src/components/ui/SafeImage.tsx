import React from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface SafeImageProps {
  src?: string | null;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string; // Container className (controlling width, height, aspect ratio, borders, roundness)
  imageClassName?: string; // Direct Image tag className
  iconClassName?: string;
  iconSize?: number | string;
  sizes?: string;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt = "Image",
  fill = false,
  width,
  height,
  className,
  imageClassName,
  iconClassName,
  iconSize = 48,
  sizes,
  priority,
}: SafeImageProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={cn("object-cover", imageClassName)}
            sizes={sizes}
            priority={priority}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={imageClassName}
            sizes={sizes}
            priority={priority}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-slate-800/40 border border-white/10",
        className
      )}
    >
      <svg
        className={cn("text-slate-500/80", iconClassName)}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        style={{ width: iconSize, height: iconSize }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </div>
  );
}
