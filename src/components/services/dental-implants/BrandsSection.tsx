"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface BrandPoint {
  title: string;
  desc: string;
  iconUrl?: string;
}

interface BrandsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    points?: BrandPoint[];
  };
}

const BrandCard = ({ p, index }: { p: BrandPoint; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const { shouldSimplify } = useMobileAnimation();
  const defaultIconUrls = [
    "https://cdn-icons-png.flaticon.com/512/9334/9334464.png",
    "https://cdn-icons-png.flaticon.com/512/2912/2912771.png",
    "https://cdn-icons-png.flaticon.com/512/2875/2875902.png",
    "https://cdn-icons-png.flaticon.com/512/1031/1031445.png",
  ];
  const iconUrl = p.iconUrl || defaultIconUrls[index] || "";

  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      delay={index * 0.1}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-sky-200 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
        {iconUrl && (
          <div
            className={cn(
              "relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center transition-transform duration-500",
              hovered && !shouldSimplify && "scale-110 rotate-3",
            )}
          >
            <Image
              src={iconUrl}
              alt={p.title}
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        )}
        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">{p.title}</h3>
      </div>
      <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed font-light">
        {p.desc}
      </p>
    </PerformanceAnimation>
  );
};

export function BrandsSection({ data }: BrandsSectionProps) {
  const points = data?.points || [];

  return (
    <section
      id="brands"
      className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {points.map((p: any, i: number) => (
            <BrandCard key={i} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
