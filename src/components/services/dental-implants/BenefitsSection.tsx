"use client";

import React from "react";
import { Shield } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface BenefitItem {
  icon?: any;
  title?: string;
  desc?: string;
}

interface BenefitsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    items?: BenefitItem[];
  };
}

const BenefitCard = ({ item, index }: { item: BenefitItem; index: number }) => {
  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      delay={index * 0.1}
      className="h-full"
    >
      <div className="p-8 rounded-[2rem] bg-white border border-slate-100 hover:-translate-y-2 hover:shadow-xl hover:border-sky-100 transition-all duration-500 group h-full">
        <div className="flex flex-col gap-6">
          {/* Row 1: Icon + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-sky-50 flex items-center justify-center text-primary-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 p-3">
              {renderServiceIcon(
                item?.icon,
                "w-full h-full",
                item?.title || "",
                item?.desc || "",
              )}
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground group-hover:text-primary-600 transition-colors leading-tight">
              {item?.title}
            </h3>
          </div>
          {/* Row 2: Subtitle (Description) */}
          <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed font-normal">
            {item?.desc}
          </p>
        </div>
      </div>
    </PerformanceAnimation>
  );
};

export function BenefitsSection({ data }: BenefitsSectionProps) {
  const items = data?.items || [];
  return (
    <section
      id="benefits"
      className="py-24 bg-gradient-to-b from-sky-50/50 to-white relative overflow-hidden"
    >
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-sky-100/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="flex flex-col gap-6 mt-12">
          {/* Row 1: 2 Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {items.slice(0, 2).map((item: any, i: number) => (
              <BenefitCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* Row 2: 3 Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(2, 5).map((item: any, i: number) => (
              <BenefitCard key={i + 2} item={item} index={i + 2} />
            ))}
          </div>
        </div>

        {/* Trust Enhancement Line */}
        <PerformanceAnimation
          preset="fade-in"
          whileInView={true}
          delay={0.6}
          className="mt-12 text-center"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Shield size={16} className="text-emerald-500" />
            Clinically proven. Designed for long-term oral health.
          </p>
        </PerformanceAnimation>
      </div>
    </section>
  );
}
