"use client";

import React from "react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import CallNowButton from "@/src/components/ui/CallNowButton";

interface PricingSectionProps {
  data: {
    badge?: string;
    h2?: string;
    disclaimer?: string;
    rows?: Array<{
      service?: string;
      unit?: string;
      price?: string;
    }>;
  };
}

export const PricingSection = ({ data }: PricingSectionProps) => {
  const d = data;
  return (
    <section
      id="pricing"
      className="py-20 lg:py-28 bg-gradient-to-b from-sky-50 to-white"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d?.badge || ""}
          title={d?.h2 || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="overflow-x-auto rounded-2xl border border-slate-100 shadow-md mb-8"
        >
          <table className="text-sm sm:text-base md:text-lg w-full min-w-[480px]">
            <thead>
              <tr className="bg-[#165197] text-white">
                <th className="text-sm sm:text-base md:text-lg px-5 py-4 text-left font-bold uppercase tracking-wider">
                  Service
                </th>
                <th className="text-sm sm:text-base md:text-lg px-5 py-4 text-left font-bold uppercase tracking-wider">
                  Unit
                </th>
                <th className="text-sm sm:text-base md:text-lg px-5 py-4 text-right font-bold uppercase tracking-wider">
                  Price (VND)
                </th>
              </tr>
            </thead>
            <tbody>
              {(d?.rows || []).map((row, i: number) => (
                <PerformanceAnimation
                  key={i}
                  as="tr"
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.05}
                  className={`group border-b border-slate-50 hover:bg-sky-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                >
                  <td className="px-5 py-3.5 font-normal text-foreground">
                    {row?.service || ""}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {row?.unit || ""}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-primary-600">
                    {row?.price || ""}
                  </td>
                </PerformanceAnimation>
              ))}
            </tbody>
          </table>
        </PerformanceAnimation>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 text-center italic mb-10">
          {d?.disclaimer || ""}
        </p>
        <div className="hidden sm:flex flex-row items-center justify-center gap-6">
          <CallNowButton />
        </div>
      </div>
    </section>
  );
};
