"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface ProcessSectionProps {
  data: {
    badge?: string;
    h2?: string;
    steps?: Array<{
      num?: string;
      title?: string;
      desc?: string;
    }>;
  };
}

export const ProcessSection = ({ data }: ProcessSectionProps) => {
  const d = data;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="process" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d?.badge || ""}
          title={d?.h2 || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        {/* Desktop — Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative flex items-start justify-between">
            <div className="absolute top-10 left-[8%] right-[8%] h-px border-t-2 border-dashed border-[#165197]/20" />
            {(d?.steps || []).map((step, i: number) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.15}
                className="flex flex-col items-center text-center w-1/4 px-4"
              >
                <div className="relative z-10 w-20 h-20 rounded-full bg-[#165197] text-white flex items-center justify-center shadow-lg shadow-[#165197]/30 mb-6">
                  <span className="text-2xl font-bold">
                    {step?.num || i + 1}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {step?.title || ""}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-foreground-secondary font-normal leading-relaxed">
                  {step?.desc || ""}
                </p>
              </PerformanceAnimation>
            ))}
          </div>
        </div>
        {/* Mobile — Vertical Accordion */}
        <div className="lg:hidden space-y-3">
          {(d?.steps || []).map((step, i: number) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.1}
            >
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                >
                  <span className="text-sm sm:text-base md:text-lg w-10 h-10 rounded-full bg-[#165197] text-white font-bold flex items-center justify-center shrink-0">
                    {step?.num || i + 1}
                  </span>
                  <span className="font-bold text-foreground flex-1">
                    {step?.title || ""}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    openIdx === i
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm sm:text-base md:text-lg px-5 pb-4 text-foreground-secondary leading-relaxed">
                      {step?.desc || ""}
                    </p>
                  </div>
                </div>
              </div>
            </PerformanceAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};
