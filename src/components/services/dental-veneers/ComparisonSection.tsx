"use client";

import React from "react";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface ComparisonRow {
  feature?: string;
  veneer?: string;
  crown?: string;
}

interface ComparisonSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    rows?: ComparisonRow[];
  };
}

export function ComparisonSection({ data }: ComparisonSectionProps) {
  const d = data || {};
  return (
    <section
      id="veneers-vs-crowns"
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          {d.badge && (
            <DecorativeBadge
              text={d.badge}
              variant="primary"
              align="center"
              className="mb-4"
            />
          )}
          <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[#165197] leading-[1.15]">
              {d.h2 || ""}
            </h2>
            {d.subtitle && (
              <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-[#165197]/80 font-normal">
                {d.subtitle}
              </p>
            )}
          </PerformanceAnimation>
        </div>
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.1}
          className="overflow-x-auto rounded-2xl border border-slate-100 shadow-md"
        >
          <table className="text-base md:text-lg w-full min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-left font-bold text-[#165197] uppercase tracking-widest w-1/3">
                  Feature
                </th>
                <th className="px-6 py-5 text-left font-bold text-[#165197] uppercase tracking-widest w-1/3">
                  Veneers
                </th>
                <th className="px-6 py-5 text-left font-bold text-[#165197] uppercase tracking-widest w-1/3">
                  Dental Crowns
                </th>
              </tr>
            </thead>
            <tbody>
              {(d.rows || []).map((row: any, i: number) => (
                <tr
                  key={i}
                  className={`border-b border-slate-50 hover:bg-sky-50/40 transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-sky-50/20"
                  }`}
                >
                  <td className="px-6 py-5 font-bold text-[#165197]">
                    {row.feature || ""}
                  </td>
                  <td className="px-6 py-5 text-[#165197]/90">
                    {row.veneer || ""}
                  </td>
                  <td className="px-6 py-5 text-[#165197]/70">
                    {row.crown || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerformanceAnimation>
      </div>
    </section>
  );
}
