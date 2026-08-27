"use client";

import React from "react";
import Image from "next/image";
import { BookingButton } from "@/src/components/ui/BookingButton";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface HeroSectionProps {
  data?: {
    h1?: string;
    subtitle?: string;
    cta1?: string;
    cta2?: string;
    image?: string;
    badges?: string[];
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  const d = data || {};
  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_55%)] pointer-events-none" />
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(4rem, 8vh, 6rem)",
        }}
      >
        <div className="grid lg:grid-cols-[55fr_45fr] gap-6 sm:gap-8 lg:gap-16 items-center">
          <div className="flex flex-col">
            <div className="mb-4 sm:mb-6 lg:mb-10 text-left">
              <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                  {d.h1 || ""}
                </h1>
                <p className="text-primary-600 max-w-xl text-lg sm:text-xl font-normal leading-relaxed mb-0">
                  {d.subtitle || ""}
                </p>
              </PerformanceAnimation>

              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.1}
                className="hidden sm:flex flex-col lg:flex-row items-stretch lg:items-center gap-6 mb-10 mt-6"
              >
                {/* Primary Actions Group */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group w-full sm:w-auto hidden sm:block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-sky-400/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <BookingButton
                      label={d.cta1 || ""}
                      className="relative w-full sm:w-auto px-10 py-5 rounded-[1.5rem] shadow-2xl shadow-primary-900/10 hover:shadow-primary-600/30 transition-all duration-300"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const el = document.getElementById("pricing");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-8 py-5 bg-white/40 backdrop-blur-xl border border-primary-100/50 rounded-[1.5rem] font-bold text-primary-700 hover:bg-primary-50 hover:border-primary-600/30 transition-all duration-300 shadow-sm w-full sm:w-auto whitespace-nowrap text-sm sm:text-base md:text-xl hover:scale-[1.03] active:scale-[0.97] hidden sm:block"
                  >
                    {d.cta2 || ""}
                  </button>
                </div>
              </PerformanceAnimation>
            </div>
          </div>
          <PerformanceAnimation
            preset="scale-in"
            whileInView={true}
            delay={0.2}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
          >
            <Image
              src={
                d.image ||
                "https://images.unsplash.com/photo-1579684389782-64d84b5e901f?q=80&w=1920&auto=format&fit=crop"
              }
              alt="Dental veneers transformation"
              fill
              priority
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#165197]/20 to-transparent" />
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
