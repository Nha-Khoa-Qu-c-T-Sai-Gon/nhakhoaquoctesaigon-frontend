"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { SafetyAccordionItem } from "@/src/components/ui/safety-accordion";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface SafetySectionProps {
  data: {
    badge?: string;
    title?: string;
    subtitle?: string;
    reassurance?: string;
    items?: Array<{
      title?: string;
      content?: string;
      icon?: string | Record<string, unknown> | null;
    }>;
  };
}

export const SafetySection = ({ data }: SafetySectionProps) => {
  const d = data;
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const items = d.items || [];

  return (
    <section
      id="safety"
      className="py-20 lg:py-28 bg-gradient-to-b from-sky-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d.badge}
          title={d.title}
          subtitle={d.subtitle}
          subtitleClassName="max-w-none"
          className="mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-10 md:mb-12"
        />
        <div className="flex flex-col gap-3 mb-8">
          {items.map((item, i: number) => (
            <SafetyAccordionItem
              key={i}
              title={item.title || ""}
              content={item.content || ""}
              icon={renderServiceIcon(
                item.icon as (string | null | undefined),
                "w-5 h-5",
                item.title || "",
                item.content || "",
              )}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
        {d.reassurance && (
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 flex items-start gap-3"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base md:text-lg font-bold text-foreground-secondary">
              {d.reassurance}
            </p>
          </PerformanceAnimation>
        )}
      </div>
    </section>
  );
};
