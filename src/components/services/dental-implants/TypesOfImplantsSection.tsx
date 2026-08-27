"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface ImplantOption {
  title?: string;
  bestFor?: string;
  desc?: string;
  highlight?: boolean;
}

interface TypesOfImplantsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    options?: ImplantOption[];
  };
}

export function TypesOfImplantsSection({ data }: TypesOfImplantsSectionProps) {
  const options = data?.options || [];
  return (
    <section id="types" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((opt: any, i: number) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.1}
            >
              <div
                className={cn(
                  "relative h-full pt-8 px-8 pb-8 rounded-[2rem] border transition-all duration-300",
                  opt.highlight
                    ? "bg-sky-50 border-sky-200 shadow-sm"
                    : "bg-white border-slate-100 hover:border-sky-100 hover:shadow-md",
                )}
              >
                {opt.highlight && (
                  <div className="absolute top-0 right-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-bl-2xl rounded-tr-[2rem] bg-gradient-to-r from-sky-500 to-[#165197] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-md z-10">
                    <Star size={12} className="text-sky-200" />{" "}
                    {opt.title?.includes("All-on-4")
                      ? "HIGHLY RECOMMENDED"
                      : "POPULAR"}
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-[#165197] mb-1">
                    {opt.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-sky-600 font-normal">
                    {opt.bestFor}
                  </p>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-[#165197]/70 font-normal leading-relaxed">
                  {opt.desc}
                </p>
              </div>
            </PerformanceAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
