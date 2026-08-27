"use client";

import React from "react";
import { Shield, Sparkles, Activity, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface MaterialItem {
  id: string;
  name?: string;
  shortName?: string;
  badge?: string;
  strength?: string;
  aesthetics?: string;
  bestFor?: string;
}

export const MaterialTable = ({ materials }: { materials: MaterialItem[] }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-white/50 backdrop-blur-xl shadow-xl shadow-primary-900/5 max-w-4xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary-50/40 border-b border-primary-100/50">
              <th className="px-6 py-5 text-sm lg:text-lg font-bold text-[#165197] w-[50%] lg:w-[45%]">
                Material
              </th>
              <th className="px-6 py-5 text-sm lg:text-lg font-bold text-[#165197] w-[15%] lg:w-[12%]">
                Primary Benefit
              </th>
              <th className="px-6 py-5 text-sm lg:text-lg font-bold text-[#165197] text-center">
                Strength (MPa)
              </th>
              <th className="px-6 py-5 text-sm lg:text-lg font-bold text-[#165197] text-center">
                Aesthetics
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50/50">
            {materials.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-primary-50/20 transition-colors group"
              >
                <td className="px-6 py-6">
                  <span className="font-semibold text-[#165197] lg:text-lg">
                    {m.name}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] lg:text-lg font-bold tracking-wider whitespace-nowrap bg-primary-50 text-[#165197]",
                    )}
                  >
                    {m.badge}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="font-medium text-[#165197]/80 lg:text-lg whitespace-nowrap">
                    {m.strength}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="font-bold lg:text-lg whitespace-nowrap text-[#165197]">
                    {m.aesthetics}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const MaterialBestFit = ({ materials }: { materials: MaterialItem[] }) => {
  return (
    <div className="mt-12 lg:mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-primary-100" />
        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary-400 whitespace-nowrap">
          Best For
        </h3>
        <div className="h-px flex-1 bg-primary-100" />
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {materials.map((m, i) => (
          <PerformanceAnimation
            key={m.id}
            preset="slide-up-subtle"
            whileInView={true}
            delay={i * 0.1}
            className={cn(
              "relative p-8 rounded-[2rem] border bg-white shadow-sm transition-all duration-500 group/bestfit flex flex-col h-full hover:-translate-y-2 hover:shadow-xl",
              m.id === "zirconia"
                ? "border-primary-100/50 hover:border-primary-200"
                : m.id === "emax"
                  ? "border-sky-100/50 hover:border-sky-200"
                  : "border-blue-100/50 hover:border-blue-200",
            )}
          >
            {/* Corner Accent */}
            <div
              className={cn(
                "absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-[0.08] rounded-full -mr-12 -mt-12 group-hover/bestfit:opacity-[0.12] transition-opacity",
                m.id === "zirconia"
                  ? "bg-primary-500"
                  : m.id === "emax"
                    ? "bg-sky-500"
                    : "bg-blue-500",
              )}
            />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-500 group-hover/bestfit:scale-110 group-hover/bestfit:rotate-6",
                    m.id === "zirconia"
                      ? "bg-amber-50 border-amber-100 text-amber-600"
                      : m.id === "emax"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : "bg-slate-50 border-slate-100 text-slate-600",
                  )}
                >
                  {m.id === "zirconia" ? (
                    <Shield size={28} />
                  ) : m.id === "emax" ? (
                    <Sparkles size={28} />
                  ) : (
                    <Activity size={28} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[#165197] text-lg lg:text-xl leading-tight group-hover/bestfit:text-primary transition-colors">
                    {m.shortName}
                  </h4>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-6">
                <p className="text-[#165197]/80 leading-relaxed font-medium text-base lg:text-lg">
                  {m.bestFor}
                </p>
              </div>

              <div className="pt-6 border-t border-primary-50 mt-auto">
                <div className="flex items-center gap-2.5 text-[#165197]">
                  <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center group-hover/bestfit:bg-primary transition-colors">
                    <Check
                      size={14}
                      className="text-primary-600 group-hover:text-white"
                    />
                  </div>
                  <span className="text-xs lg:text-sm font-bold uppercase tracking-wider">
                    Clinical Best Fit
                  </span>
                </div>
              </div>
            </div>
          </PerformanceAnimation>
        ))}
      </div>
    </div>
  );
};
