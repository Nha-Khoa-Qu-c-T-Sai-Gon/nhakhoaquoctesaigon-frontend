"use client";

import React from "react";
import { Zap } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface IndicationCase {
  title?: string;
  desc?: string;
}

interface IndicationsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    cases?: IndicationCase[];
  };
}

export function IndicationsSection({ data }: IndicationsSectionProps) {
  const cases = data?.cases || [];
  return (
    <section id="indications" className="py-24 bg-sky-50 relative">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((item: any, i: number) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.1}
            >
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 h-full flex flex-col items-center text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="w-20 h-20 rounded-[2rem] bg-sky-50 flex items-center justify-center text-primary-600 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Zap size={36} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed font-normal flex-grow">
                  {item.desc}
                </p>
              </div>
            </PerformanceAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
