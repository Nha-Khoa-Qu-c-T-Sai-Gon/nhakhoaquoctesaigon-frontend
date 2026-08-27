"use client";

import React from "react";
import { Check, X, Smile, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface CandidateItem {
  title?: string;
  desc?: string;
}

interface CandidatesSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    suitable?: CandidateItem[];
    notSuitable?: CandidateItem[];
  };
}

export function CandidatesSection({ data }: CandidatesSectionProps) {
  const d = data || {};
  return (
    <section
      id="candidates"
      className="py-20 lg:py-28 bg-gradient-to-b from-sky-50 to-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          className="mb-4 sm:mb-8 md:mb-12"
        />

        <div className="grid md:grid-cols-[1fr_60px_1fr] lg:grid-cols-[1fr_80px_1fr] gap-6 lg:gap-4 items-stretch mt-12">
          {/* Left Column - Ideal Candidates */}
          <div className="flex flex-col gap-4">
            <div className="mb-6 flex items-center justify-center lg:justify-start">
              <h3 className="text-xl font-bold text-foreground inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                Ideal Candidates
              </h3>
            </div>

            <div className="flex flex-col gap-4 h-full">
              {(d.suitable || []).map((item: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.08}
                >
                  <div className="group bg-green-50/40 backdrop-blur-sm rounded-xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <Check className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                        {item.title || ""}
                      </h4>
                    </div>
                    {/* Row 2: Description */}
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {item.desc || ""}
                    </p>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </div>

          {/* Center Column - Decision Indicator */}
          <div className="hidden md:flex flex-col items-center justify-center py-12 relative group">
            <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent group-hover:via-primary-300 transition-colors duration-700" />
            <div className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-primary-100 flex flex-col items-center justify-center relative z-10 animate-pulse-subtle">
              <Smile className="w-7 h-7 text-primary-500" />
            </div>
          </div>

          {/* Mobile Center Indicator (Visible only on mobile) */}
          <div className="flex md:hidden items-center justify-center py-6 relative">
            <div className="absolute left-0 right-0 h-px bg-slate-200" />
            <div className="px-4 bg-gradient-to-b from-sky-50 to-white relative z-10 text-xs font-bold tracking-widest text-slate-400 uppercase">
              Evaluation Criteria
            </div>
          </div>

          {/* Right Column - Not Suitable */}
          <div className="flex flex-col gap-4">
            <div className="mb-6 flex items-center justify-center lg:justify-start">
              <h3 className="text-xl font-bold text-foreground inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                Not Recommended For
              </h3>
            </div>

            <div className="flex flex-col gap-4 h-full">
              {(d.notSuitable || []).map((item: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.08}
                >
                  <div className="group bg-amber-50/50 backdrop-blur-sm rounded-xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 h-full items-start justify-center">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <X className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                        {item.title || ""}
                      </h4>
                    </div>
                    {/* Row 2: Description */}
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {item.desc || ""}
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
