"use client";

import React from "react";
import Image from "next/image";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { BookingButton } from "@/src/components/ui/BookingButton";
import CallNowButton from "@/src/components/ui/CallNowButton";

interface HeroSectionProps {
  data: {
    titleLines?: string[];
    body?: string;
    cta?: string;
    image?: string;
  };
}

export const HeroSection = ({ data }: HeroSectionProps) => {
  const d = data;

  return (
    <section id="overview" className="relative overflow-hidden bg-[#0b1f3a]">
      <div className="absolute inset-0 pointer-events-none" />
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{
          paddingTop: "clamp(9rem, 15vh, 12rem)",
          paddingBottom: "clamp(5rem, 10vh, 10rem)",
        }}
      >
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col">
            <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                {(d?.titleLines || []).map((line: string, idx: number) => (
                  <PerformanceAnimation
                    key={idx}
                    preset="slide-up-subtle"
                    whileInView={true}
                    delay={idx * 0.1}
                    as="span"
                    className="block"
                  >
                    {line || ""}
                  </PerformanceAnimation>
                ))}
              </h1>
            </PerformanceAnimation>
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.1}
            >
              <p className="text-lg sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-xl mb-3 md:mb-4 lg:mb-8">
                {d?.body || ""}
              </p>
            </PerformanceAnimation>
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.2}
              className="hidden lg:flex lg:flex-row items-center gap-6 mb-12"
            >
              {/* Primary Actions Group */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group w-full sm:w-auto hidden lg:block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 to-primary-600/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <BookingButton
                    label={d?.cta || ""}
                    className="relative w-full sm:w-auto px-10 py-5 rounded-[1.5rem] shadow-2xl shadow-sky-900/20 hover:shadow-sky-400/30 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="hidden lg:flex justify-center lg:justify-start">
                <CallNowButton />
              </div>
            </PerformanceAnimation>
          </div>
          {/* Right — Image */}
          <PerformanceAnimation
            preset="scale-in"
            whileInView={true}
            delay={0.3}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
          >
            <Image
              src={d?.image || ""}
              alt="SG International Dental Clinic"
              fill
              priority
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 to-transparent" />
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
};
