"use client";

import React from "react";
import Image from "next/image";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { BookingButton } from "@/src/components/ui/BookingButton";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { CLINIC_INFO } from "@/src/lib/constants/contact";

interface HeroSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    image?: string;
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_60%)] pointer-events-none" />
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(4rem, 8vh, 6rem)",
        }}
      >
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div>
            <div className="flex flex-col items-center lg:items-start mb-10 w-full lg:w-fit text-center lg:text-left">
              <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
                <DecorativeBadge
                  text="Dental Crowns"
                  variant="primary"
                  align="center"
                  className="hidden lg:inline-flex mb-4"
                />
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                  <span className="text-primary-600">{data?.title || ""}</span>
                </h1>
              </PerformanceAnimation>
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.1}
              >
                <p className="text-foreground-secondary text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {data?.subtitle || ""}
                </p>
              </PerformanceAnimation>
            </div>

            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.2}
              className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 mt-10"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full lg:w-auto">
                <div className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-sky-400/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <BookingButton className="relative w-full sm:w-auto px-10 py-5 rounded-[1.5rem] shadow-2xl shadow-primary-900/10 hover:shadow-primary-600/30 transition-all duration-300" />
                </div>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center px-8 py-5 bg-white/60 backdrop-blur-xl border border-primary-100/50 rounded-[1.5rem] font-bold text-primary-700 hover:bg-primary-50 hover:border-primary-600/30 transition-all duration-300 shadow-sm w-full sm:w-auto text-lg md:text-xl hidden sm:inline-flex"
                >
                  View Pricing
                </a>
              </div>
            </PerformanceAnimation>
          </div>

          {/* Right Column */}
          <PerformanceAnimation
            preset="scale-in"
            whileInView={true}
            delay={0.3}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
          >
            <Image
              src={data?.image || "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=1200"}
              alt="Professional dental crown treatment"
              fill
              priority
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#165197]/20 to-transparent" />
          </PerformanceAnimation>
        </div>

        {/* Trust Badges Strip */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.4}
          className="mt-12 pt-8 border-t border-primary-100"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: "🕐",
                label: CLINIC_INFO.hours,
                sub: CLINIC_INFO.days,
              },
              { icon: "🌐", label: "International", sub: "Standards" },
              { icon: "🏅", label: "15+ Years", sub: "Experience" },
              { icon: "🦷", label: "5,000+", sub: "Happy Patients" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl border border-primary-100 px-4 py-3 shadow-sm"
              >
                <span className="text-xl flex-shrink-0">{badge.icon}</span>
                <div>
                  <div className="text-xs sm:text-sm md:text-base sm:font-bold text-foreground leading-tight">
                    {badge.label}
                  </div>
                  <div className="text-[11px] text-foreground-secondary leading-tight">
                    {badge.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PerformanceAnimation>
      </div>
    </section>
  );
}
