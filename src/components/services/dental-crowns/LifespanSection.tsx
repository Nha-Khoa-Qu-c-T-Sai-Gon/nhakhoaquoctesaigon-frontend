"use client";

import React from "react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface LifespanSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
  };
  crownLifespan?: Array<{
    name: string;
    years: string;
    icon?: string;
    position?: string;
  }>;
  longevityFactors?: Array<{
    title: string;
    icon?: string;
    description?: string;
  }>;
}

export function LifespanSection({
  data,
  crownLifespan = [],
  longevityFactors = [],
}: LifespanSectionProps) {
  return (
    <section
      id="lifespan"
      className="py-24 sm:py-32 relative overflow-hidden bg-[#f9f8f6]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f9f8f6] to-[#f3f4f8]/60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dce3ec] to-transparent" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(26,58,92,0.05),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(61,111,168,0.04),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.025),transparent_70%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <AnimatedSectionHeader
          title={data?.title || ""}
          subtitle={data?.subtitle || ""}
          align="center"
          className="mb-0"
        />

        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20 xl:gap-32 mt-10 lg:mt-16">
          {/* LEFT: MATERIAL LIFESPAN COMPARISON */}
          <div className="lg:w-1/2 w-full">
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-[#165197] uppercase tracking-[0.3em] whitespace-nowrap">
                Material Lifespan
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#165197]/20 to-transparent" />
            </div>

            <div className="flex flex-col gap-6">
              {crownLifespan.map((mat, i) => (
                <PerformanceAnimation
                  key={mat.name}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.1}
                  className="group relative bg-white/80 backdrop-blur-md rounded-[2rem] p-6 lg:p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(26,58,92,0.12)] transition-all duration-300 overflow-hidden hover:translate-x-2"
                >
                  <div className="absolute top-0 right-0">
                    <span className="inline-block text-xs sm:text-sm md:text-base font-bold px-4 py-1 rounded-tr-[2rem] rounded-bl-2xl bg-sky-50 text-[#165197] tracking-wider border-l border-b border-sky-100/50">
                      {mat.years}
                    </span>
                  </div>

                  <div className="space-y-3 pr-16">
                    <div className="flex items-center gap-3 text-[#165197]">
                      <div className="text-[#165197] shrink-0 transition-colors duration-300 w-7 h-7 flex items-center justify-center">
                        {renderServiceIcon(
                          mat.icon,
                          "w-7 h-7",
                          mat.name || "",
                          mat.position || "",
                        )}
                      </div>
                      <h4 className="text-lg lg:text-xl font-bold leading-tight text-[#165197]">
                        {mat.name}
                      </h4>
                    </div>

                    <p className="text-sm sm:text-base md:text-lg text-[#165197]/70 leading-relaxed font-normal">
                      {mat.position}
                    </p>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </div>

          {/* RIGHT: CLINICAL LONGEVITY FACTORS */}
          <div className="lg:w-1/2 w-full">
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-[#165197] uppercase tracking-[0.3em] whitespace-nowrap">
                Longevity Factors
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-[#165197]/20 to-transparent" />
            </div>

            <div className="flex flex-col gap-6">
              {longevityFactors.map((factor, index) => (
                <PerformanceAnimation
                  key={factor.title}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={0.2 + index * 0.1}
                  className="group relative bg-sky-50/40 backdrop-blur-md rounded-[2rem] p-7 lg:p-8 border border-sky-100 hover:bg-white hover:border-[#165197]/20 hover:shadow-[0_20px_50px_rgba(26,58,92,0.08)] transition-all duration-300 hover:translate-x-2"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="text-[#165197] shrink-0 transition-colors duration-300 w-8 h-8 flex items-center justify-center">
                        {renderServiceIcon(
                          factor.icon,
                          "w-8 h-8",
                          factor.title || "",
                          factor.description || "",
                        )}
                      </div>
                      <h4 className="text-lg lg:text-xl font-bold leading-tight text-[#165197]">
                        {factor.title}
                      </h4>
                    </div>

                    <p className="text-sm sm:text-base md:text-lg text-[#165197]/70 leading-relaxed font-normal">
                      {factor.description}
                    </p>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </div>
        </div>

        {/* CLINICAL SOURCES */}
        <PerformanceAnimation
          preset="fade-in"
          whileInView={true}
          delay={0.5}
          className="text-xs sm:text-sm text-[#165197]/50 italic text-center leading-relaxed mt-16"
        >
          Sources: ADA MouthHealthy.org; Gehrt et al.,{" "}
          <em>Clinical and Oral Investigations</em>, 2013.
        </PerformanceAnimation>
      </div>
    </section>
  );
}
