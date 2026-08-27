"use client";

import React from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface TimelineRow {
  label?: string;
  months?: string;
  pct?: number;
}

interface FactorItem {
  icon?: string;
  label?: string;
  desc?: string;
}

interface DurationSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    snippet?: string;
    timeline?: TimelineRow[];
    factors?: FactorItem[];
    note?: string;
  };
}

export function DurationSection({ data }: DurationSectionProps) {
  return (
    <section
      id="timeline"
      className="relative py-24 lg:py-32 overflow-hidden bg-slate-50"
    >
      {/* Soft Ambient Background Motif */}
      <div className="absolute top-[-10%] right-[5%] w-[600px] h-[600px] bg-sky-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="mt-12 grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* LEFT COLUMN: Featured Insight + Duration Spectrum */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Featured Summary Panel */}
            <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
              <div className="bg-gradient-to-br from-[#165197] to-[#0d346b] text-white rounded-[2rem] p-8 lg:p-10 shadow-2xl shadow-blue-900/15 relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-sky-400/20 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150" />
                <div className="relative z-10">
                  <p className="text-xl sm:text-2xl font-bold leading-tight mb-3">
                    {data?.snippet && data.snippet.includes(".")
                      ? data.snippet.split(".")[0] + "."
                      : data?.snippet || ""}
                  </p>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                    {data?.snippet && data.snippet.includes(".")
                      ? data.snippet.substring(data.snippet.indexOf(".") + 1).trim()
                      : ""}
                  </p>
                </div>
              </div>
            </PerformanceAnimation>

            {/* Animated Duration Spectrum */}
            <div className="space-y-6 lg:px-2">
              {(data?.timeline || []).map((row: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={0.2 + i * 0.1}
                >
                  <div className="flex flex-col gap-2.5 group cursor-default">
                    <div className="flex justify-between items-baseline px-1">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-[#165197]/90 transition-colors group-hover:text-[#165197]">
                        {row?.label || ""}
                      </span>
                      <div className="bg-white border border-blue-100 px-3 py-1 rounded-full shadow-sm text-xs sm:text-sm md:text-base font-bold text-[#165197]">
                        {row?.months || ""}{" "}
                        <span className="text-[#165197]/70 font-normal ml-0.5">
                          months
                        </span>
                      </div>
                    </div>
                    <div className="h-3.5 w-full bg-slate-200/80 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-[#165197] rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                        style={{ width: `${row?.pct || 0}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      </div>
                    </div>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Scannable Factor Cards */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full">
            <div className="space-y-3 mb-8">
              {(data?.factors || []).map((f: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={0.3 + i * 0.08}
                >
                  <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 flex flex-col gap-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 transform group">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-sky-50 to-blue-50/30 rounded-xl flex items-center justify-center border border-sky-100 group-hover:scale-110 transition-transform duration-300">
                        {f?.icon ? (
                          <Image
                            src={f.icon}
                            alt={f?.label || "Icon"}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <Info className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <h4 className="font-bold text-[#165197] text-base sm:text-lg">
                        {f?.label || ""}
                      </h4>
                    </div>
                    {/* Row 2: Content */}
                    <div>
                      <p className="text-sm sm:text-base md:text-lg text-[#165197]/80 leading-relaxed">
                        {f?.desc || ""}
                      </p>
                    </div>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>

            {data?.note && (
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.8}
              >
                <div className="bg-blue-50/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100 border-dashed">
                  <p className="text-sm sm:text-base text-[#165197]/80 leading-relaxed italic">
                    <span className="font-bold text-[#165197] not-italic">
                      Sources:{" "}
                    </span>
                    {data.note.replace(/Sources:\s*/i, "").trim()}
                  </p>
                </div>
              </PerformanceAnimation>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
