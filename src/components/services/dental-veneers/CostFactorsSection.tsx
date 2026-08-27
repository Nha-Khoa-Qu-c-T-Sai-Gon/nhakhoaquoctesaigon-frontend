"use client";

import React from "react";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface CostFactorItem {
  icon?: any;
  title?: string;
  desc?: string;
}

interface CostFactorsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    items?: CostFactorItem[];
  };
}

export function CostFactorsSection({ data }: CostFactorsSectionProps) {
  const d = data || {};
  return (
    <section
      id="cost-factors"
      className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
    >
      {/* Background premium pattern (subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.03),transparent_80%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          subtitle={d.subtitle || ""}
          subtitleClassName="text-primary-600"
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="relative max-w-3xl mx-auto mt-16 md:mt-24 pl-[60px] md:pl-[100px]">
          {/* Continuous Vertical Timeline Line */}
          <div className="absolute top-0 bottom-0 left-[30px] md:left-[50px] w-1 bg-gradient-to-b from-sky-100 via-primary-300 to-sky-100 -translate-x-1/2 rounded-full" />

          {(d.items || []).map((item: any, i: number) => {
            return (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.1}
                className="relative flex flex-col items-start justify-center mb-12 md:mb-16 group"
              >
                {/* Center Icon Hub */}
                <div className="absolute -left-[60px] md:-left-[100px] w-[60px] md:w-[100px] flex items-center justify-center z-10 top-0 md:top-1/2 md:-translate-y-1/2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-xl shadow-sky-500/10 border-[4px] border-white group-hover:border-primary-100 group-hover:bg-primary-50 transition-colors duration-500 flex items-center justify-center relative before:absolute before:-inset-2 before:rounded-full before:border before:border-sky-200/50 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500">
                    {renderServiceIcon(
                      item.icon,
                      "w-6 h-6 sm:w-7 sm:h-7 text-primary-600 group-hover:scale-110 transition-transform duration-500",
                      item.title || "",
                      item.desc || "",
                    )}
                  </div>
                </div>

                {/* Content Node */}
                <div className="w-full">
                  <div className="bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:shadow-sky-500/5 border border-sky-50 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col gap-3">
                      {/* Row 1: Number + Title */}
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-primary-50 text-primary-700 font-bold text-sm">
                          {i + 1}
                        </span>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground leading-tight">
                          {item.title || ""}
                        </h3>
                      </div>
                      {/* Row 2: Content */}
                      <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                        {item.desc || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </PerformanceAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
