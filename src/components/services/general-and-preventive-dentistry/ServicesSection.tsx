"use client";

import React, { useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface ServicesSectionProps {
  data: {
    badge?: string;
    h2?: string;
    intro?: string;
    items?: Array<{
      name?: string;
      desc?: string;
      icon?: string | Record<string, unknown> | null;
      color?: string;
    }>;
  };
}

const serviceColorMap: Record<string, string> = {
  sky: "bg-sky-50 border-sky-100 text-sky-600",
  indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
  violet: "bg-violet-50 border-violet-100 text-violet-600",
  emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
  amber: "bg-amber-50 border-amber-100 text-amber-600",
  rose: "bg-rose-50 border-rose-100 text-rose-600",
};

export const ServicesSection = ({ data }: ServicesSectionProps) => {
  const d = data;
  const [activeIndex, setActiveIndex] = useState(0);

  // Swipe state
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

    if (isLeftSwipe && activeIndex < (d?.items || []).length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const activeItem = (d?.items || [])[activeIndex] || {};

  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-sky-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d?.badge || ""}
          title={d?.h2 || ""}
          subtitle={d?.intro || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(d?.items || []).map((item, i: number) => {
            return (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.08}
              >
                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-md flex flex-col transition-all cursor-default h-full hover:translate-y-[-6px] hover:shadow-xl duration-300">
                  {/* Row 1: Icon + Title */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${serviceColorMap[item?.color || ""] || ""} p-3.5`}
                    >
                      {renderServiceIcon(
                        item?.icon as (string | null | undefined),
                        "w-full h-full",
                        item?.name || "",
                        item?.desc || "",
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                      {item?.name || ""}
                    </h3>
                  </div>
                  {/* Row 2: Description */}
                  <div className="flex-1">
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary font-normal leading-relaxed">
                      {item?.desc || ""}
                    </p>
                    <button className="text-sm sm:text-base md:text-lg mt-4 self-start font-bold text-primary-600 flex items-center gap-1 group/btn hover:translate-x-1 transition-transform">
                      Learn more{" "}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </PerformanceAnimation>
            );
          })}
        </div>

        {/* Mobile Slider */}
        <div className="sm:hidden relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none -mx-2 z-30">
            <button
              className={cn(
                "flex items-center justify-center pointer-events-auto active:scale-95 transition-transform",
                activeIndex === 0
                  ? "opacity-30"
                  : "text-primary-600 opacity-80 drop-shadow-sm",
              )}
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className={cn(
                "flex items-center justify-center pointer-events-auto active:scale-95 transition-transform",
                activeIndex === (d?.items || []).length - 1
                  ? "opacity-30"
                  : "text-primary-600 opacity-80 drop-shadow-sm",
              )}
              onClick={() =>
                setActiveIndex(
                  Math.min((d?.items || []).length - 1, activeIndex + 1),
                )
              }
              disabled={activeIndex === (d?.items || []).length - 1}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div
            className="rounded-3xl p-5 overflow-hidden relative bg-white"
            style={{
              border: "1px solid rgba(22,81,151,0.10)",
              boxShadow:
                "0 4px 6px -1px rgba(22,81,151,0.04), 0 20px 60px -10px rgba(22,81,151,0.10), 0 0 0 1px rgba(255,255,255,0.8) inset",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Subtle inner light orb */}
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%)",
              }}
            />

            <div
              key={activeIndex}
              className="flex flex-col relative z-10 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${serviceColorMap[activeItem?.color || ""] || ""} p-3`}
                  >
                    {renderServiceIcon(
                      activeItem?.icon as (string | null | undefined),
                      "w-full h-full",
                      activeItem?.name || "",
                      activeItem?.desc || "",
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {activeItem?.name || ""}
                  </h3>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    {activeItem?.desc || ""}
                  </p>
                  <button className="text-sm mt-4 font-bold text-primary-600 flex items-center gap-1">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Visual swipe hint */}
          <div className="flex justify-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-6">
            ← Swipe to view services →
          </div>
        </div>
      </div>
    </section>
  );
};
