"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, Phone } from "lucide-react";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import {
  formatPhoneNumber,
  generateTelLink,
} from "@/src/lib/email/templates/helpers";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface PricingRow {
  type?: string;
  perTooth?: string;
  package?: string;
  origin?: string;
  warranty?: string;
}

interface PricingSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    context?: string;
    rows?: PricingRow[];
    disclaimer?: string;
  };
}

export function PricingSection({ data }: PricingSectionProps) {
  const d = data || {};
  return (
    <section
      id="pricing"
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 to-white pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          subtitle={d.context || ""}
          subtitleClassName="text-primary-600"
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.1}
          className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-white mb-8 mt-12"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base md:text-lg min-w-[700px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  {[
                    "Crown Type",
                    "Price Per Tooth",
                    "16-Teeth Package",
                    "Origin",
                    "Warranty",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-5 text-left text-sm sm:text-base md:text-lg font-bold text-slate-500 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(d.rows || []).map((row: any, i: number) => (
                  <tr
                    key={i}
                    className="group hover:bg-sky-50/50 transition-colors"
                  >
                    <td className="px-6 py-5 font-bold text-foreground flex items-center gap-3">
                      {row.type || ""}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-lg text-[#165197]">
                        {row.perTooth || ""}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-primary-600 bg-primary-50 inline-block px-3 py-1 rounded-lg">
                        {row.package || ""}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 text-foreground-secondary font-medium">
                        {row.origin || ""}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-foreground-secondary font-medium">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        {row.warranty || ""}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PerformanceAnimation>

        <p className="text-center text-sm md:text-base text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-2 mb-8">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          {d.disclaimer || ""}
        </p>

        <div className="hidden lg:flex flex-row items-center justify-center gap-4">
          <a
            href={generateTelLink(CLINIC_INFO.phone1)}
            className="w-full sm:w-auto"
          >
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#165197] text-white rounded-2xl font-bold text-base shadow-xl shadow-[#165197]/25 w-full hover:scale-105 active:scale-95 transition-transform duration-200">
              <Phone className="w-5 h-5" />{" "}
              {formatPhoneNumber(CLINIC_INFO.phone1)}
            </button>
          </a>
          <a
            href={generateTelLink(CLINIC_INFO.phone2)}
            className="w-full sm:w-auto"
          >
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#165197] text-white rounded-2xl font-bold text-base shadow-xl shadow-[#165197]/25 w-full hover:scale-105 active:scale-95 transition-transform duration-200">
              <Phone className="w-5 h-5" />{" "}
              {formatPhoneNumber(CLINIC_INFO.phone2)}
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
