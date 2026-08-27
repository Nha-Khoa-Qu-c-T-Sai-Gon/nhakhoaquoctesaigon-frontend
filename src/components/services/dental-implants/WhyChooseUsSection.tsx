"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface WhyPoint {
  title?: string;
  desc?: string;
}

interface WhyChooseUsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    points?: WhyPoint[];
    clinicImage?: string;
  };
}

export function WhyChooseUsSection({ data }: WhyChooseUsSectionProps) {
  console.log("[WhyChooseUsSection UI received data]:", data);
  const points = data?.points || [];
  return (
    <section id="why-us" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-4">
            {points.map((p: any, i: number) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.1}
              >
                <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-sky-200 transition-colors group">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 shrink-0 mt-0.5 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-foreground mb-1 leading-tight">
                      {p.title}
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </PerformanceAnimation>
            ))}
          </div>
          <PerformanceAnimation
            preset="slide-right"
            whileInView={true}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl skew-y-1">
              <Image
                src={
                  data?.clinicImage ||
                  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                }
                alt="Clinic Interior"
                fill
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 50vw"
              />
            </div>
            {/* Trust badge overlay */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#165197] text-white flex items-center justify-center font-bold text-xl">
                15+
              </div>
              <div>
                <p className="text-xs sm:text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Years of
                </p>
                <p className="font-bold text-foreground">Clinic Excellence</p>
              </div>
            </div>
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
