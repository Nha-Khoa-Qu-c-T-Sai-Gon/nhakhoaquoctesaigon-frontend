"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { Clock, Target, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface OptionType {
  color?: string;
  icon?: any;
  title?: string;
  desc?: string;
  timeLabel?: string;
  time?: string;
  bestFor?: string;
}

interface BracesTypesSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    options?: OptionType[];
    comparison?: Array<{
      feature: string;
      metal?: string;
      ceramic?: string;
      selfLig?: string;
      aligner?: string;
    }>;
  };
}

const bracesAccents: Record<string, string> = {
  slate:
    "text-slate-600 bg-gradient-to-br from-slate-50 to-slate-100/30 border-slate-200/60 shadow-[inset_0_2px_8px_rgba(71,85,105,0.15)]",
  stone:
    "text-stone-600 bg-gradient-to-br from-stone-50 to-stone-100/30 border-stone-200/60 shadow-[inset_0_2px_8px_rgba(120,113,108,0.15)]",
  blue: "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100/30 border-blue-200/60 shadow-[inset_0_2px_8px_rgba(37,99,235,0.15)]",
  teal: "text-teal-600 bg-gradient-to-br from-teal-50 to-teal-100/30 border-teal-200/60 shadow-[inset_0_2px_8px_rgba(13,148,136,0.15)]",
  sky: "text-sky-600 bg-gradient-to-br from-sky-50 to-sky-100/30 border-sky-200/60 shadow-[inset_0_2px_8px_rgba(3,105,161,0.15)]",
  indigo:
    "text-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100/30 border-indigo-200/60 shadow-[inset_0_2px_8px_rgba(67,56,202,0.15)]",
  violet:
    "text-violet-600 bg-gradient-to-br from-violet-50 to-violet-100/30 border-violet-200/60 shadow-[inset_0_2px_8px_rgba(109,40,217,0.15)]",
  emerald:
    "text-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-emerald-200/60 shadow-[inset_0_2px_8px_rgba(4,120,87,0.15)]",
  amber:
    "text-amber-600 bg-gradient-to-br from-amber-50 to-amber-100/30 border-amber-200/60 shadow-[inset_0_2px_8px_rgba(180,83,9,0.15)]",
};

const isImageIcon = (icon: unknown) =>
  typeof icon === "string" &&
  (icon.startsWith("http") ||
    icon.startsWith("/") ||
    icon.includes("/uploads/"));

const renderBracesIcon = (
  icon: any,
  className: string = "w-6 h-6",
  title: string = "",
  desc: string = "",
  _invertActive: boolean = false,
) => {
  if (isImageIcon(icon)) {
    return (
      <Image
        src={icon}
        alt={title || "Braces treatment icon"}
        width={128}
        height={128}
        quality={100}
        sizes="64px"
        className={cn(className, "object-contain shrink-0")}
      />
    );
  }
  if (typeof icon === "string" && icon.length <= 4) {
    return <span className="text-2xl shrink-0">{icon}</span>;
  }
  return renderServiceIcon(icon, className, title, desc);
};

export function BracesTypesSection({ data }: BracesTypesSectionProps) {
  const options = data?.options || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const activeOption = options[activeIndex] || {
    color: "blue",
    icon: "",
    title: "",
    desc: "",
    timeLabel: "",
    time: "",
    bestFor: "",
  };

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

    if (isLeftSwipe && activeIndex < (options.length || 1) - 1) {
      setActiveIndex(activeIndex + 1);
      setIsExpanded(false);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setIsExpanded(false);
    }
  };

  const handleProtocolChange = (i: number) => {
    setActiveIndex(i);
    setIsExpanded(false);
  };

  return (
    <section
      id="types"
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
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* --- DESKTOP VIEW (lg and up) --- */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:items-stretch">
          {/* Left: Selector */}
          <div className="hidden lg:flex lg:col-span-4 flex-col min-w-0 w-full h-full">
            <div className="flex flex-col w-full h-full justify-between gap-3">
              {options.map((o: any, i: number) => {
                const isActive = i === activeIndex;
                const usesImageIcon = isImageIcon(o?.icon);
                return (
                  <PerformanceAnimation
                    key={i}
                    preset="slide-right"
                    whileInView={true}
                    delay={i * 0.1}
                    className="flex-1"
                  >
                    <button
                      onClick={() => handleProtocolChange(i)}
                      className={cn(
                        "w-full h-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden active:scale-95",
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
                          "flex items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10",
                          usesImageIcon
                            ? "w-12 h-12"
                            : cn(
                                "w-10 h-10 rounded-xl",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : bracesAccents[o?.color || ""] || "",
                              ),
                        )}
                      >
                        {renderBracesIcon(
                          o?.icon,
                          usesImageIcon ? "w-12 h-12" : "w-5 h-5",
                          o?.title || "",
                          o?.desc || "",
                          isActive,
                        )}
                      </div>
                      <div className="relative z-10">
                        <div className="font-bold text-lg sm:text-xl transition-colors">
                          {o?.title || ""}
                        </div>
                      </div>
                    </button>
                  </PerformanceAnimation>
                );
              })}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <PerformanceAnimation
            preset="scale-in"
            whileInView={true}
            delay={0.4}
            className="lg:col-span-8 min-w-0 relative"
          >
            {/* Mobile Content Slider Arrows */}
            <div className="lg:hidden absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none -mx-4 sm:-mx-6 z-30">
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center pointer-events-auto active:scale-95 transition-all bg-white border shadow-md",
                  activeIndex === 0
                    ? "opacity-40 bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed"
                    : "text-[#165197] border-slate-200 hover:bg-[#165197] hover:text-white hover:border-[#165197] active:bg-[#165197] active:text-white active:border-[#165197] hover:shadow-lg hover:shadow-blue-500/15",
                )}
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center pointer-events-auto active:scale-95 transition-all bg-white border shadow-md",
                  activeIndex === (options.length || 1) - 1
                    ? "opacity-40 bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed"
                    : "text-[#165197] border-slate-200 hover:bg-[#165197] hover:text-white hover:border-[#165197] active:bg-[#165197] active:text-white active:border-[#165197] hover:shadow-lg hover:shadow-blue-500/15",
                )}
                onClick={() =>
                  setActiveIndex(
                    Math.min((options.length || 1) - 1, activeIndex + 1),
                  )
                }
                disabled={activeIndex === (options.length || 1) - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div
              className="rounded-3xl p-5 sm:p-8 md:p-10 h-full overflow-hidden relative bg-white"
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
                className="flex flex-col h-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* SECTION 1: Narrative Description */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-6">
                    <div
                      className={cn(
                        "flex items-center justify-center flex-shrink-0",
                        isImageIcon(activeOption?.icon)
                          ? "w-16 h-16"
                          : cn(
                              "w-14 h-14 rounded-2xl border",
                              bracesAccents[activeOption?.color || ""] || "",
                            ),
                      )}
                    >
                      {renderBracesIcon(
                        activeOption?.icon,
                        isImageIcon(activeOption?.icon)
                          ? "w-16 h-16"
                          : "w-7 h-7",
                        activeOption?.title || "",
                        activeOption?.desc || "",
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#165197] text-xl sm:text-2xl md:text-3xl mb-3 tracking-tight">
                        {activeOption?.title || ""}
                      </h3>
                      <div className="relative">
                        <p
                          className={`text-sm sm:text-base md:text-lg leading-relaxed text-[#165197]/80 transition-all duration-300 ${
                            !isExpanded ? "line-clamp-3" : ""
                          }`}
                        >
                          {activeOption?.desc || ""}
                        </p>
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="mt-2 text-[#165197] font-bold text-sm hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Clinical Metrics */}
                <div className="mt-auto">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#165197]/40 px-1">
                    Treatment Performance
                  </div>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#165197]/10"
                    style={{ background: "#FFFFFF" }}
                  >
                    <div className="p-5 sm:p-6 min-w-0 border-b sm:border-b-0 sm:border-r border-[#165197]/10">
                      <div className="flex items-center gap-2 text-[#165197]/60 mb-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                          {activeOption?.timeLabel || "Duration"}
                        </span>
                      </div>
                      <div className="font-semibold text-base sm:text-lg text-[#165197]">
                        {activeOption?.time || ""}
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 min-w-0">
                      <div className="flex items-center gap-2 text-[#165197]/60 mb-2">
                        <Target className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                          Ideal For
                        </span>
                      </div>
                      <div className="font-semibold text-base sm:text-lg text-[#165197]">
                        {activeOption?.bestFor || ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PerformanceAnimation>
        </div>

        {/* Comparison Table */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="overflow-x-auto rounded-2xl border border-blue-100 shadow-md"
        >
          <table className="text-sm sm:text-base md:text-lg w-full min-w-[800px]">
            <thead>
              <tr className="bg-[#165197] text-white">
                <th className="px-5 py-4 text-center font-bold uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-5 py-4 text-center font-bold uppercase tracking-wider">
                  Metal Braces
                </th>
                <th className="px-5 py-4 text-center font-bold uppercase tracking-wider">
                  Ceramic Braces
                </th>
                <th className="px-5 py-4 text-center font-bold uppercase tracking-wider">
                  Self-Ligating
                </th>
                <th className="px-5 py-4 text-center font-bold uppercase tracking-wider">
                  Clear Aligners
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {(data?.comparison || []).map((row: any, i: number) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-blue-50/30"}
                >
                  <td className="px-5 py-4 font-bold text-[#165197]">
                    {row.feature}
                  </td>
                  <td className="px-5 py-4 text-center text-[#165197]/80">
                    {row.metal}
                  </td>
                  <td className="px-5 py-4 text-center text-[#165197]/80">
                    {row.ceramic}
                  </td>
                  <td className="px-5 py-4 text-center text-[#165197]/80">
                    {row.selfLig}
                  </td>
                  <td className="px-5 py-4 text-center text-[#165197]/80">
                    {row.aligner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerformanceAnimation>
      </div>
    </section>
  );
}
