"use client";

import React from "react";
import { Check, ShieldCheck } from "lucide-react";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface ComparisonSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    rows?: any[];
  };
}

export function ComparisonSection({ data }: ComparisonSectionProps) {
  const d = data || {};
  const rows = d.rows || [];

  return (
    <section id="comparison" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.title || ""}
          subtitle={d.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.1}
          className="overflow-x-auto rounded-2xl border border-slate-100 shadow-md"
        >
          <table className="text-base md:text-base w-full min-w-[520px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th
                  className="text-base md:text-base px-6 py-5 text-left font-bold uppercase tracking-widest w-1/4"
                  style={{ color: "var(--color-primary-400)" }}
                >
                  Feature
                </th>
                <th className="text-base md:text-base px-6 py-5 text-left font-bold text-primary-600 uppercase tracking-widest min-w-[200px] sm:w-auto">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Professional
                  </span>
                </th>
                <th
                  className="text-base md:text-base px-6 py-5 text-left font-bold uppercase tracking-widest min-w-[200px] sm:w-auto"
                  style={{ color: "var(--color-primary-300)" }}
                >
                  OTC / DIY
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, i: number) => (
                <tr
                  key={i}
                  className={`border-b border-slate-50 ${i % 2 === 0 ? "bg-white" : "bg-sky-50/30"}`}
                >
                  <td className="text-base md:text-lg px-6 py-4 font-bold text-foreground">
                    {row.feature}
                  </td>
                  <td
                    className="text-base md:text-lg px-6 py-4 leading-relaxed"
                    style={{ color: "var(--color-foreground-secondary)" }}
                  >
                    <span className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {row.pro}
                    </span>
                  </td>
                  <td
                    className="text-base md:text-lg px-6 py-4 leading-relaxed"
                    style={{ color: "var(--color-primary-400)" }}
                  >
                    {row.otc}
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
