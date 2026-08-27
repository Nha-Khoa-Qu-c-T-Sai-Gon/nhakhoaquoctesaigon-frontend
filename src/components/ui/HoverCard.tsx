"use client";

import React, { useState } from "react";
import { cn } from "@/src/lib/utils";

interface HoverCardProps {
  /**
   * Render prop: receives `hovered` so children can conditionally apply
   * shadow, border-color, opacity, image-scale etc.
   * The lift transform is handled entirely by HoverCard itself.
   */
  children: React.ReactNode | ((hovered: boolean) => React.ReactNode);
  /** Classes for the outer stable-hit-area wrapper (size, position, cursor). */
  className?: string;
  /**
   * Tailwind translate class applied to the inner visual lifter on hover.
   * Default '-translate-y-2' (8 px). Pass '' to disable lift.
   */
  liftClass?: string;
  /** onClick on the outer wrapper (for non-link cards, e.g. lightbox trigger). */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * HoverCard — reusable hover wrapper for carousel cards.
 *
 * Root-cause fix
 * ──────────────
 * `transform: translateY(-8px)` moves the VISUAL element but NOT its layout
 * box (the pointer-events hit area). When a card lifts on hover, the top 8 px
 * of the visual card sits above the layout box: moving the pointer there fires
 * spurious `mouseleave`, immediately cancelling the hover state.
 *
 * Architecture
 * ────────────
 *   ┌─ outer div  (stable hit area — NEVER transforms) ──────────────┐
 *   │    onMouseEnter / onMouseLeave fire here, always reliable       │
 *   │  ┌─ inner div  (visual lift — transition-transform only) ─────┐ │
 *   │  │  [children: shadow, border, image, text …]                 │ │
 *   │  └────────────────────────────────────────────────────────────┘ │
 *   └────────────────────────────────────────────────────────────────┘
 *
 * Because the outer div never transforms, its hit area is always the
 * original card footprint. `mouseenter`/`mouseleave` fire reliably across
 * the entire card regardless of where the inner content is visually.
 *
 * Additional pointer-events guarantees
 * ─────────────────────────────────────
 * - Absolutely-positioned overlays inside children should carry
 *   `pointer-events-none` so they don't create hover "holes".
 * - The inner lift div itself gets `pointer-events-none` so it never
 *   competes with the outer wrapper; children re-enable with `pointer-events-auto`.
 */
export function HoverCard({
  children,
  className,
  liftClass = "-translate-y-2",
  onClick,
}: HoverCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    // Outer: stable hit area — no transform ever applied here
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={cn("relative cursor-pointer select-none", className)}
    >
      {/*
       * Inner: visual lift only.
       * pointer-events-none so it never intercepts events meant for the outer wrapper.
       * Children that need clicks must carry pointer-events-auto themselves
       * (links and buttons have it by default).
       */}
      <div
        className={cn(
          "h-full pointer-events-none",
          "transition-transform duration-200 ease-out",
          liftClass && (hovered ? liftClass : "translate-y-0"),
        )}
      >
        {/* Re-enable pointer-events for all interactive children */}
        <div className="h-full pointer-events-auto">
          {typeof children === "function" ? children(hovered) : children}
        </div>
      </div>
    </div>
  );
}
