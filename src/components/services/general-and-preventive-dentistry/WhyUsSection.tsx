"use client";

import React from "react";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface WhyUsSectionProps {
  data: {
    badge?: string;
    h2?: string;
    pillars?: Array<{
      title?: string;
      body?: string;
      icon?: string | Record<string, unknown> | null;
    }>;
  };
}

export const WhyUsSection = ({ data }: WhyUsSectionProps) => {
  const d = data;
  return (
    <section id="why-us" className="py-20 lg:py-28 bg-[#0b1f3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
            <DecorativeBadge
              text={d?.badge || ""}
              variant="dark"
              align="center"
              className="mb-4"
            />
          </PerformanceAnimation>
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {d?.h2 || ""}
            </h2>
          </PerformanceAnimation>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {(d?.pillars || []).map((p, i: number) => {
            return (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.1}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 transition-all h-full hover:bg-white/10 hover:border-white/20 duration-300 flex flex-col">
                  {/* Row 1: Icon + Title */}
                  <div className="flex items-center gap-4 mb-4 sm:mb-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center shrink-0 p-2.5">
                      {renderServiceIcon(
                        p?.icon as (string | null | undefined),
                        "w-full h-full text-sky-400",
                        p?.title || "",
                        p?.body || "",
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {p?.title || ""}
                    </h3>
                  </div>
                  {/* Row 2: Content */}
                  <div className="flex-1">
                    <p className="text-sm sm:text-base md:text-lg text-slate-400 font-normal leading-relaxed">
                      {p?.body || ""}
                    </p>
                  </div>
                </div>
              </PerformanceAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
};
