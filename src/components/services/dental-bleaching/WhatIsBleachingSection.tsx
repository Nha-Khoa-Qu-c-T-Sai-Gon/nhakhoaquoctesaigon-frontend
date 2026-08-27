"use client";

import React, { useState, useRef } from "react";
import {
  Zap,
  Droplets,
  Clock,
  Star,
  Activity,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface WhatIsBleachingSectionProps {
  data?: {
    title?: string;
    shortDef?: string;
    body?: string;
    readMore?: any[];
    highlights?: any[];
    image?: string | null;
    note?: string;
  };
}

export function WhatIsBleachingSection({ data }: WhatIsBleachingSectionProps) {
  const d = data || {};

  const [activeIndex, setActiveIndex] = useState(0);

  // Swipe state for mobile carousel
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // There are 4 content cards
    if (isLeftSwipe && activeIndex < 3) {
      setActiveIndex(activeIndex + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const factChips = [
    {
      icon: Zap,
      label: "In-Office",
      value: "25 – 40%",
      sub: "Hydrogen Peroxide",
    },
    {
      icon: Droplets,
      label: "At-Home",
      value: "10 – 22%",
      sub: "Carbamide Peroxide",
    },
    {
      icon: Clock,
      label: "Longevity",
      value: "6 mo – 2 yr",
      sub: "Typical duration",
    },
  ];

  const getReadMoreText = (item: any) => {
    if (!item) return "";
    return typeof item === "string" ? item : item.value || item.label || "";
  };

  // 4 content pillars — each becomes a card in the grid
  const contentCards = [
    {
      icon: Droplets,
      title: "Clinical Definition",
      accentColor: "#165197",
      accentBg: "var(--color-primary-50)",
      body: d?.body || "",
    },
    {
      icon: Star,
      title: "#1 Patient Request — Over a Decade",
      accentColor: "#F97316",
      accentBg: "#FFF7ED",
      body: getReadMoreText(d?.readMore?.[0]),
    },
    {
      icon: Activity,
      title: "How Bleaching Works",
      accentColor: "#165197",
      accentBg: "var(--color-primary-50)",
      body: getReadMoreText(d?.readMore?.[1]),
    },
    {
      icon: ShieldCheck,
      title: "Bleaching vs. Surface Polishing",
      accentColor: "#0891b2",
      accentBg: "#ecfeff",
      body: getReadMoreText(d?.readMore?.[2]),
    },
  ];

  const activeCard = contentCards[activeIndex] || {
    icon: Droplets,
    title: "",
    accentColor: "#165197",
    accentBg: "var(--color-primary-50)",
    body: "",
  };

  return (
    <section
      id="what-is"
      className="py-20 lg:py-28"
      style={{ background: "var(--color-primary-50)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          {/* ── Section Header ── */}
          <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
            <AnimatedSectionHeader
              title={d.title || ""}
              subtitle={d.shortDef || ""}
              align="center"
              titleClassName="mb-4"
              subtitleClassName="text-base sm:text-lg md:text-xl font-normal"
            />
          </PerformanceAnimation>

          {/* ── Fact chips — 3-col grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {factChips.map((chip, i) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.08}
              >
                <div
                  className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all h-full"
                  style={{ border: "1px solid var(--color-primary-100)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--color-primary-50)" }}
                  >
                    <chip.icon
                      className="w-6 h-6"
                      style={{ color: "var(--color-primary-500)" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-bold uppercase tracking-widest leading-tight mb-1"
                      style={{ color: "var(--color-primary-400)" }}
                    >
                      {chip.label}
                    </p>
                    <p
                      className="text-lg sm:text-xl font-bold leading-tight mb-0.5"
                      style={{ color: "var(--color-primary-800)" }}
                    >
                      {chip.value}
                    </p>
                    <p
                      className="text-xs uppercase tracking-wide leading-tight"
                      style={{ color: "var(--color-primary-400)" }}
                    >
                      {chip.sub}
                    </p>
                  </div>
                </div>
              </PerformanceAnimation>
            ))}
          </div>

          {/* ── Desktop: 2×2 content card grid ── */}
          <div className="hidden md:grid md:grid-cols-2 gap-5">
            {contentCards.map((card, i) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.1}
              >
                <div
                  className="flex flex-col gap-4 rounded-2xl p-6 sm:p-7 bg-white shadow-sm transition-all h-full hover:translate-y-[-4px] hover:shadow-lg duration-300"
                  style={{ border: "1px solid var(--color-primary-100)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-primary-50)" }}
                    >
                      <card.icon
                        className="w-6 h-6"
                        style={{ color: card.accentColor }}
                      />
                    </div>
                    <h3
                      className="text-lg sm:text-xl font-bold leading-snug"
                      style={{ color: "#165197" }}
                    >
                      {card.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
                    style={{ color: "var(--color-foreground-secondary)" }}
                  >
                    {card.body}
                  </p>
                </div>
              </PerformanceAnimation>
            ))}
          </div>

          {/* ── Mobile: Single Item Swipe Slider ── */}
          <div className="md:hidden relative">
            {/* Mobile Content Slider Arrows */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none -mx-4 z-30">
              <button
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className={cn(
                  "flex items-center justify-center pointer-events-auto active:scale-95 transition-transform drop-shadow-md",
                  activeIndex === 0
                    ? "opacity-30"
                    : "text-[#165197] opacity-80",
                )}
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={() => setActiveIndex(Math.min(3, activeIndex + 1))}
                disabled={activeIndex === 3}
                className={cn(
                  "flex items-center justify-center pointer-events-auto active:scale-95 transition-transform drop-shadow-md",
                  activeIndex === 3
                    ? "opacity-30"
                    : "text-[#165197] opacity-80",
                )}
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </div>

            <div
              className="overflow-hidden relative pb-2"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                key={activeIndex}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 mx-6"
              >
                <div
                  className="flex flex-col gap-4 rounded-2xl p-6 bg-white shadow-sm transition-all h-full min-h-[220px]"
                  style={{ border: "1px solid var(--color-primary-100)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-primary-50)" }}
                    >
                      <activeCard.icon
                        className="w-6 h-6"
                        style={{ color: activeCard.accentColor }}
                      />
                    </div>
                    <h3
                      className="text-lg font-bold leading-snug"
                      style={{ color: "#165197" }}
                    >
                      {activeCard.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-foreground-secondary)" }}
                  >
                    {activeCard.body}
                  </p>
                </div>
              </div>
            </div>
            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    activeIndex === idx
                      ? "w-6 bg-[#165197]"
                      : "w-1.5 bg-[#165197]/20",
                  )}
                />
              ))}
            </div>
          </div>

          {/* ── Disclaimer bar — full width ── */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.2}
            className="flex items-start gap-4 rounded-2xl p-5 sm:p-6"
            style={{
              background: "var(--color-warning-50)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <AlertTriangle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-warning-500)" }}
            />
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed font-medium"
              style={{ color: "var(--color-foreground-secondary)" }}
            >
              {d.note || ""}
            </p>
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
