"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface WhyChooseSectionProps {
  data: FeatureItem[];
}

export function WhyChooseSection({ data }: WhyChooseSectionProps) {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50/30 py-16 sm:py-20 lg:pt-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
            <p className="text-xs sm:text-sm md:text-base mb-2 text-[10px] sm:font-bold uppercase tracking-widest text-blue-600">
              Why Us
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
              Built on Standards, Not Promises
            </h2>
          </PerformanceAnimation>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {data.map((feature, i) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.08}
            >
              <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 h-full">
                {/* Row 1: icon + title */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-primary-600 border border-blue-100 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">
                    {feature.title}
                  </h3>
                </div>
                {/* Row 2: description */}
                <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            </PerformanceAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
