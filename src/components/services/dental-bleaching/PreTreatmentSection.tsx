"use client";

import React from "react";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface PreTreatmentSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    steps?: any[];
  };
}

export function PreTreatmentSection({ data }: PreTreatmentSectionProps) {
  const d = data || {};
  const steps = d.steps || [];

  return (
    <section id="process" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.title || ""}
          subtitle={d.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-[#165197]/20" />
          {steps.map((step: any, i: number) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.1}
              className="flex flex-col items-start lg:items-center lg:text-center"
            >
              {/* Row 1: Number + Title (Mobile) / Vertical Stack (Desktop) */}
              <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-center mb-4 sm:mb-5">
                <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-full bg-[#165197] text-white flex items-center justify-center shadow-lg shadow-[#165197]/30 shrink-0">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {step.title}
                </h3>
              </div>

              {/* Row 2: Description */}
              <p className="text-sm sm:text-base md:text-lg text-foreground-secondary font-normal leading-relaxed">
                {step.desc}
              </p>
            </PerformanceAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
