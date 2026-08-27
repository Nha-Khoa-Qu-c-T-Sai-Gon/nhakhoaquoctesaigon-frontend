"use client";

import React from "react";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { BookingButton } from "@/src/components/ui/BookingButton";
import CallNowButton from "@/src/components/ui/CallNowButton";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { MapPin, Clock } from "lucide-react";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import { getGoogleMapsUrl } from "@/src/lib/utils/maps";

interface HeroSectionProps {
  data?: {
    image?: string;
    badge?: string;
    h1?: string;
    subtitle?: string;
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  const bgImageReal =
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=2000";

  return (
    <section id="overview" className="relative overflow-hidden bg-[#0A1128]">
      {/* Background Layer with Slow Zoom */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${data?.image || bgImageReal}')` }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 z-0 bg-[#0A1128]/50" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0A1128]/95 via-[#0A1128]/70 to-transparent" />

      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(4rem, 8vh, 6rem)",
        }}
      >
        <div className="max-w-4xl mx-auto lg:mx-0">
          <div className="mb-10 text-center lg:text-left">
            {data?.badge && (
              <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
                <DecorativeBadge
                  text={data.badge}
                  variant="dark"
                  align="center"
                  className="hidden lg:inline-flex mb-4"
                />
              </PerformanceAnimation>
            )}
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.1}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                {data?.h1 || ""}
              </h1>
            </PerformanceAnimation>
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.2}
            >
              <p className="text-slate-300 max-w-2xl mx-auto lg:mx-0 lg:text-xl font-normal leading-relaxed mb-0 text-center lg:text-left">
                {data?.subtitle || ""}
              </p>
            </PerformanceAnimation>
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.3}
              className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 mb-10 mt-6"
            >
              {/* Booking Button Wrapper */}
              <div className="relative group w-full sm:w-auto hidden lg:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-sky-400/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <BookingButton
                  label="Book Free Consultation"
                  className="relative w-full sm:w-auto px-10 py-5 rounded-[1.5rem] shadow-2xl shadow-primary-900/10 hover:shadow-primary-600/30 transition-all duration-300"
                />
              </div>

              {/* Call Button Wrapper */}
              <div className="hidden lg:block w-full sm:w-auto [&>div]:w-full [&>div>a>button]:w-full sm:[&>div>a>button]:w-auto">
                <CallNowButton />
              </div>
            </PerformanceAnimation>
          </div>
          {/* Unified Glass Contact Bar */}
          <div className="hidden md:block w-full">
            <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-10 lg:gap-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5">
              {/* Address */}
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center lg:items-start lg:flex-row gap-3 group text-center lg:text-left"
              >
                <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="text-white text-sm md:text-base font-bold leading-snug group-hover:text-sky-300 transition-colors max-w-[280px] md:max-w-[320px]">
                  {CLINIC_INFO.address}
                </div>
              </a>

              <div className="hidden lg:block w-px h-10 bg-white/15" />

              {/* Hours */}
              <div className="flex flex-col items-center lg:items-start lg:flex-row gap-3 text-center lg:text-left">
                <Clock className="w-5 h-5 text-slate-300 shrink-0" />
                <div className="text-white text-sm md:text-base font-bold leading-snug">
                  <div>{CLINIC_INFO.days}</div>
                  <div>{CLINIC_INFO.hours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
