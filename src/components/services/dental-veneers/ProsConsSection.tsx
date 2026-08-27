"use client";

import React from "react";
import { Check, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface ProsConsItem {
  title?: string;
  desc?: string;
}

interface ProsConsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    pros?: ProsConsItem[];
    cons?: ProsConsItem[];
  };
}

export function ProsConsSection({ data }: ProsConsSectionProps) {
  const d = data || {};
  return (
    <section
      id="pros-cons"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          subtitle={d.subtitle || ""}
          subtitleClassName="text-primary-600"
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* Subtle Divider */}
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary-300 to-transparent mx-auto mb-12" />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Benefits Column */}
          <div className="flex flex-col gap-5 border border-green-100 bg-green-50/40 rounded-3xl p-6 lg:p-8 relative">
            {/* Subtle vertical line connecting items */}
            <div className="absolute left-10 md:left-[3.25rem] top-24 bottom-10 w-px bg-green-200/50 hidden sm:block" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Benefits</h3>
            </div>

            <div className="flex flex-col gap-4">
              {(d.pros || []).map((p: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.08}
                >
                  <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative z-10">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                        {p.title || ""}
                      </h4>
                    </div>
                    {/* Row 2: Description */}
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {p.desc || ""}
                    </p>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </div>

          {/* Disadvantages Column */}
          <div className="flex flex-col gap-5 border border-amber-100 bg-amber-50/40 rounded-3xl p-6 lg:p-8 relative">
            {/* Subtle vertical line connecting items */}
            <div className="absolute left-10 md:left-[3.25rem] top-24 bottom-10 w-px bg-amber-200/50 hidden sm:block" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Limitations</h3>
            </div>

            <div className="flex flex-col gap-4">
              {(d.cons || []).map((c: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.08}
                >
                  <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative z-10">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                        {c.title || ""}
                      </h4>
                    </div>
                    {/* Row 2: Description */}
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {c.desc || ""}
                    </p>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
