"use client";

import React, { useState, useRef } from "react";
import { Clock, Activity, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

const treatmentAccents: Record<string, string> = {
  sky: "text-sky-600 bg-gradient-to-br from-sky-50 to-sky-100/30 border-sky-200/60 shadow-[inset_0_2px_8px_rgba(14,165,233,0.15)]",
  indigo:
    "text-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100/30 border-indigo-200/60 shadow-[inset_0_2px_8px_rgba(99,102,241,0.15)]",
  violet:
    "text-violet-600 bg-gradient-to-br from-violet-50 to-violet-100/30 border-violet-200/60 shadow-[inset_0_2px_8px_rgba(139,92,246,0.15)]",
  emerald:
    "text-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-emerald-200/60 shadow-[inset_0_2px_8px_rgba(16,185,129,0.15)]",
};

interface TreatmentSectionProps {
  data?: {
    badge?: string;
    title?: string;
    options?: any[];
    comparisonTable?: any[];
  };
}

export function TreatmentSection({ data }: TreatmentSectionProps) {
  const d = data || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

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

    if (isLeftSwipe && activeIndex < (d?.options?.length || 0) - 1) {
      setActiveIndex(activeIndex + 1);
      setIsExpanded(false);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setIsExpanded(false);
    }
  };

  const activeProtocol = d?.options?.[activeIndex] || {
    title: "",
    badge: "",
    duration: "",
    suitability: "",
    cost: "",
    summary: [],
    benefits: [],
    process: [],
    processTitle: "",
    accentColor: "blue",
    time: "",
    concentration: "",
    icon: "",
  };

  const handleProtocolChange = (i: number) => {
    setActiveIndex(i);
    setIsExpanded(false);
  };

  // Helper to extract a short preview from the summary
  const summaryArray = Array.isArray(activeProtocol?.summary)
    ? activeProtocol.summary
    : activeProtocol?.summary
      ? [activeProtocol.summary]
      : [];
  const shortSummary = summaryArray[0]
    ? summaryArray[0].split(". ")[0] + "."
    : "";
  const remainingSummary = [
    summaryArray[0]
      ? summaryArray[0].substring(shortSummary.length).trim()
      : "",
    ...summaryArray.slice(1),
  ].filter(Boolean);

  return (
    <section
      id="methods"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #F0F6FF 0%, #EBF3FF 30%, #F5F9FF 65%, #EDF3FC 100%)",
      }}
    >
      {/* Premium light aurora accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,179,237,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSectionHeader
          badge={d?.badge || ""}
          title={d?.title || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:items-stretch">
          {/* Left: Selector */}
          <div className="hidden lg:flex lg:col-span-4 flex-col min-w-0 w-full h-full">
            <div className="relative group/selector w-full h-full">
              <div
                id="bleaching-protocol-selector"
                className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2.5 snap-x snap-mandatory hide-scrollbar w-full lg:h-full lg:justify-between"
              >
                {(d?.options || []).map((o: any, i: number) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => handleProtocolChange(i)}
                      className={cn(
                        "snap-start flex-shrink-0 w-[85vw] sm:w-[280px] lg:w-full lg:flex-1 text-left rounded-2xl border transition-all duration-300 relative overflow-hidden active:scale-95",
                        "flex flex-row items-center gap-3 p-3 lg:p-6",
                        isActive
                          ? "border-[#165197]/20 shadow-[0_8px_32px_rgba(22,81,151,0.15)] z-10 text-white"
                          : "border-blue-100/80 bg-white/70 hover:bg-white hover:border-blue-200 hover:translate-x-1 hover:shadow-md",
                      )}
                      style={
                        isActive
                          ? {
                              background:
                                "linear-gradient(135deg, #165197 0%, #1e6abf 100%)",
                              backdropFilter: "blur(10px)",
                            }
                          : { backdropFilter: "blur(10px)" }
                      }
                    >
                      <div
                        className={cn(
                          "rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10 overflow-hidden",
                          "w-9 h-9",
                          isActive
                            ? "bg-white/20 text-white"
                            : treatmentAccents[o.accentColor] || "text-[#165197] bg-blue-50 border-blue-200",
                        )}
                      >
                        {renderServiceIcon(
                          o.icon,
                          "w-4 h-4 lg:w-5 lg:h-5",
                          o.title || "",
                          o.summary || "",
                        )}
                      </div>
                      <div className="relative z-10 flex-1 min-w-0">
                        <div className="font-bold text-sm sm:text-base md:text-lg leading-snug">
                          {o.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-8 min-w-0 relative">
            {/* Mobile Content Slider Arrows */}
            <div className="lg:hidden absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none -mx-3 z-30">
              <button
                className={cn(
                  "flex items-center justify-center pointer-events-auto active:scale-95 transition-transform",
                  activeIndex === 0
                    ? "opacity-30"
                    : "text-[#165197] opacity-80 drop-shadow-sm",
                )}
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                className={cn(
                  "flex items-center justify-center pointer-events-auto active:scale-95 transition-transform",
                  activeIndex === (d?.options?.length || 0) - 1
                    ? "opacity-30"
                    : "text-[#165197] opacity-80 drop-shadow-sm",
                )}
                onClick={() =>
                  setActiveIndex(
                    Math.min((d?.options?.length || 0) - 1, activeIndex + 1),
                  )
                }
                disabled={activeIndex === (d?.options?.length || 0) - 1}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            <div
              className="rounded-3xl p-5 sm:p-8 md:p-10 overflow-hidden relative bg-white"
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
                className="flex flex-col relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Icon + Title + Summary */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-6">
                  {/* Mobile: Icon left of title in row */}
                  <div className="flex sm:hidden items-center gap-3 mb-2">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border overflow-hidden",
                        treatmentAccents[activeProtocol.accentColor] || "text-[#165197] bg-blue-50 border-blue-200",
                      )}
                    >
                      {renderServiceIcon(
                        activeProtocol.icon,
                        "w-6 h-6",
                        activeProtocol.title || "",
                        activeProtocol.summary || "",
                      )}
                    </div>
                    <h3 className="font-bold text-[#165197] text-xl tracking-tight">
                      {activeProtocol.title}
                    </h3>
                  </div>

                  {/* Desktop: Icon above title */}
                  <div
                    className={cn(
                      "hidden sm:flex w-14 h-14 rounded-2xl items-center justify-center flex-shrink-0 border overflow-hidden animate-in zoom-in duration-500",
                      treatmentAccents[activeProtocol.accentColor] || "text-[#165197] bg-blue-50 border-blue-200",
                    )}
                  >
                    {renderServiceIcon(
                      activeProtocol.icon,
                      "w-7 h-7",
                      activeProtocol.title || "",
                      activeProtocol.summary || "",
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="hidden sm:block font-bold text-[#165197] text-xl sm:text-2xl md:text-3xl mb-2 tracking-tight">
                      {activeProtocol.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed break-words text-[#165197]/80 px-0 sm:px-0">
                      {shortSummary}
                    </p>
                  </div>
                </div>

                {/* Metrics grid */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-2xl overflow-hidden animate-in fade-in duration-500 delay-200 fill-mode-both"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(22,81,151,0.08)",
                  }}
                >
                  <div
                    className="p-5 sm:p-6 min-w-0"
                    style={{ borderRight: "1px solid rgba(22,81,151,0.08)" }}
                  >
                    <div className="flex items-center gap-2 text-[#165197]/60 mb-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                        Duration
                      </span>
                    </div>
                    <div
                      className="font-semibold text-base sm:text-lg break-words"
                      style={{ color: "var(--color-primary-700)" }}
                    >
                      {activeProtocol.time}
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 min-w-0">
                    <div className="flex items-center gap-2 text-[#165197]/60 mb-2">
                      <Activity className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                        Concentration
                      </span>
                    </div>
                    <div
                      className="font-semibold text-base sm:text-lg break-words"
                      style={{ color: "var(--color-primary-700)" }}
                    >
                      {activeProtocol.concentration}
                    </div>
                  </div>
                </div>

                {/* Expand toggle */}
                <div className="mt-6">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="font-bold text-sm sm:text-base md:text-xl flex items-center gap-2 transition-all px-5 py-2.5 rounded-xl hover:scale-[1.02] hover:bg-[#165197]/10 active:scale-[0.98]"
                    style={{
                      color: "#165197",
                      background: "rgba(22,81,151,0.05)",
                      border: "1px solid rgba(22,81,151,0.15)",
                    }}
                  >
                    {isExpanded
                      ? "Hide clinical explanation"
                      : "Read full clinical explanation"}
                    <span
                      className={cn(
                        "transition-transform duration-300",
                        isExpanded && "rotate-180",
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-6 space-y-4">
                        {remainingSummary.map(
                          (paragraph: string, idx: number) => (
                            <p
                              key={idx}
                              className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Comparison Table */}
        {d.comparisonTable && d.comparisonTable.length > 0 && (
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="overflow-x-auto rounded-2xl border border-slate-100 shadow-md"
          >
            <table className="text-sm sm:text-base lg:text-lg w-full min-w-[600px]">
              <thead>
                <tr className="bg-[#165197] text-white">
                  <th className="text-sm sm:text-base lg:text-lg px-5 py-4 text-left font-bold uppercase tracking-wider min-w-[140px] sticky left-0 z-10 bg-[#165197] border-r border-sky-800 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                    Method
                  </th>
                  <th className="text-sm sm:text-base lg:text-lg px-5 py-4 text-left font-bold uppercase tracking-wider min-w-[200px]">
                    Active Agent
                  </th>
                  <th className="text-sm sm:text-base lg:text-lg px-5 py-4 text-left font-bold uppercase tracking-wider min-w-[150px]">
                    Session Time
                  </th>
                  <th className="text-sm sm:text-base lg:text-lg px-5 py-4 text-left font-bold uppercase tracking-wider min-w-[160px]">
                    Results
                  </th>
                  <th className="text-sm sm:text-base lg:text-lg px-5 py-4 text-left font-bold uppercase tracking-wider min-w-[160px]">
                    Sensitivity
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.comparisonTable.map((row: any, i: number) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-sky-50/50"}
                  >
                    <td
                      className={cn(
                        "px-5 py-4 font-bold text-foreground sticky left-0 z-10 border-r border-sky-100 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]",
                        i % 2 === 0 ? "bg-white" : "bg-[#f4f9ff]",
                      )}
                    >
                      {row.method}
                    </td>
                    <td className="px-5 py-4 text-foreground-secondary font-medium">
                      {row.agent}
                    </td>
                    <td className="px-5 py-4 text-foreground-secondary font-medium">
                      {row.time}
                    </td>
                    <td className="px-5 py-4 text-foreground-secondary font-medium">
                      {row.timeline}
                    </td>
                    <td className="px-5 py-4 text-foreground-secondary font-medium">
                      {row.sensitivity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PerformanceAnimation>
        )}
      </div>
    </section>
  );
}
