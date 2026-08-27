"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { BookingButton } from "@/src/components/ui/BookingButton";
import CallNowButton from "@/src/components/ui/CallNowButton";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import { getGoogleMapsUrl } from "@/src/lib/utils/maps";

interface WhatAreImplantsSectionProps {
  data?: {
    badge?: string;
    h1?: string;
    subtitle?: string;
    backgroundImage?: string;
    bgImage?: string;
    image?: string;
    cta1?: string;
    cta2?: string;
  };
}

export function WhatAreImplantsSection({ data }: WhatAreImplantsSectionProps) {
  const h = data || {};
  return (
    <section id="overview" className="relative overflow-hidden bg-[#0b1f3a]">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${
            h.backgroundImage ||
            h.bgImage ||
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
          }')`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-[#0b1f3a]/60" />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0b1f3a]/90 via-[#0b1f3a]/50 to-transparent" />

      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(4rem, 8vh, 6rem)",
        }}
      >
        <div className="grid lg:grid-cols-[60fr_40fr] gap-8 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                className="flex flex-col items-center lg:items-start w-full"
              >
                {h.badge && (
                  <DecorativeBadge
                    text={h.badge}
                    variant="dark"
                    align="responsive"
                    className="mb-4"
                  />
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                  {h.h1}
                </h1>
              </PerformanceAnimation>
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.1}
              >
                <p className="text-slate-300 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-0">
                  {h.subtitle}
                </p>
              </PerformanceAnimation>

              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.2}
                className="hidden sm:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-4 sm:mb-6 mt-6 sm:mt-8 w-full"
              >
                <div className="w-full sm:w-auto">
                  <BookingButton
                    label={h.cta1 || "Book Free Consultation"}
                    className="w-full"
                  />
                </div>
                <div>
                  <CallNowButton variant="dark" />
                </div>
              </PerformanceAnimation>

              {/* Glass contact bar */}
              <div className="hidden md:block w-full mt-4">
                <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-6 lg:gap-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                  <a
                    href={getGoogleMapsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center lg:items-start lg:flex-row gap-3 group text-center lg:text-left"
                  >
                    <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="text-white text-sm md:text-base font-bold leading-snug group-hover:text-sky-300 transition-colors max-w-[280px]">
                      {CLINIC_INFO.address}
                    </div>
                  </a>
                  <div className="hidden lg:block w-px h-10 bg-white/15" />
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

          {/* Right Column: Thumbnail image (456 x 350 size) */}
          <PerformanceAnimation
            preset="scale-in"
            whileInView={true}
            delay={0.3}
            className="relative rounded-3xl overflow-hidden shadow-2xl w-full max-w-[456px] aspect-[456/350] mx-auto lg:mx-0"
          >
            <Image
              src={
                h.image ||
                "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1974&auto=format&fit=crop"
              }
              alt="Dental implants thumbnail"
              fill
              priority
              className="object-cover"
              sizes="(max-w-768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/30 to-transparent" />
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
