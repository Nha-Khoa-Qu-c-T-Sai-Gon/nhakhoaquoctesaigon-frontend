"use client";

import React from "react";
import Image from "next/image";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { BookingButton } from "@/src/components/ui/BookingButton";
import CallNowButton from "@/src/components/ui/CallNowButton";

interface HeroSectionProps {
  data?: {
    badge?: string;
    titleHighlight?: string;
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_60%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 pb-10 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col">
            <div className="mb-3 sm:mb-8 md:mb-10 text-center lg:text-left flex flex-col items-center lg:items-start">
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                className="flex flex-col items-center lg:items-start w-full"
              >
                <DecorativeBadge
                  text={d.badge || ""}
                  variant="primary"
                  align="responsive"
                  className="mb-4"
                />
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                  <span className="block text-primary-600 mt-2">
                    {d.titleHighlight || ""}
                  </span>
                </h1>
              </PerformanceAnimation>
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.1}
              >
                <p className="text-primary-600 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl font-normal leading-relaxed mb-0">
                  {d.subtitle || ""}
                </p>
              </PerformanceAnimation>

              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.2}
                className="hidden sm:flex sm:flex-row items-center justify-center lg:justify-start gap-5 mb-6 sm:mb-8 mt-6 sm:mt-8 w-full"
              >
                <div className="hidden sm:block w-full sm:w-auto">
                  <BookingButton label={d.cta1 || "Book a Consultation"} className="w-full" />
                </div>
                <div className="hidden sm:block">
                  <CallNowButton />
                </div>
              </PerformanceAnimation>
            </div>
          </div>
          {/* Right */}
          <PerformanceAnimation
            preset="scale-in"
            whileInView={true}
            delay={0.3}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
          >
            <Image
              src={
                d.image ||
                "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=1200"
              }
              alt="Professional dental bleaching treatment"
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
