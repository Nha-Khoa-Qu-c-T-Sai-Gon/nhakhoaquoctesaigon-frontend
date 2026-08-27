"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface TrustItem {
  icon: LucideIcon;
  label: string;
  sub: string;
}

interface HeroSectionProps {
  data: {
    badge?: string;
    title: string;
    description?: string;
    trust?: TrustItem[];
  };
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative overflow-x-hidden pt-24 sm:pt-28 lg:pt-32 pb-14 lg:pb-20">
      {/* Blue → White gradient background — same as News page */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#dbeafe] via-[#eff6ff] to-white pointer-events-none" />
      {/* Subtle radial accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_70%)] pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* LCP Content - Plain HTML to ensure immediate rendering on mobile */}
        <div className="mb-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[#165197] tracking-tight">
            {data.title}
          </h1>
          {data.description && (
            <p className="text-lg sm:text-xl md:text-2xl text-foreground-secondary font-normal leading-relaxed max-w-[85%] mx-auto">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
