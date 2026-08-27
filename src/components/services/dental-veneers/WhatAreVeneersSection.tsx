"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface WhatAreVeneersSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    body?: string;
    callout?: string;
    image?: string;
  };
}

export function WhatAreVeneersSection({ data }: WhatAreVeneersSectionProps) {
  const d = data || {};
  return (
    <section
      id="what-are-veneers"
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <DecorativeBadge
              text={d.badge || ""}
              variant="primary"
              align="responsive"
              className="mb-4"
            />
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.1}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-[1.15] tracking-tight">
                {d.h2 || ""}
              </h2>
            </PerformanceAnimation>
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.2}
            >
              <p className="text-base sm:text-lg md:text-xl text-foreground-secondary leading-relaxed mb-6 font-normal">
                {d.body || ""}
              </p>
            </PerformanceAnimation>
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.3}
              className="flex gap-3 bg-sky-50 border border-sky-200 rounded-2xl p-4"
            >
              <Sparkles className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <p className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                {d.callout || ""}
              </p>
            </PerformanceAnimation>
          </div>
          <PerformanceAnimation
            preset="slide-right"
            whileInView={true}
            delay={0.4}
            className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]"
          >
            <Image
              src={
                d.image ||
                "https://images.unsplash.com/photo-1473445712615-5853f17511c6?q=80&w=1920&auto=format&fit=crop"
              }
              alt="Dental veneer close-up"
              fill
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 50vw"
            />
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
