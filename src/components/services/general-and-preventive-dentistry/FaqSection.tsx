"use client";

import React, { useState } from "react";
import {
  SafetyAccordionItem,
  QuestionIcon,
} from "@/src/components/ui/safety-accordion";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface FaqSectionProps {
  data: {
    badge?: string;
    h2?: string;
    note?: string;
    items?: Array<{
      q?: string;
      a?: string;
    }>;
  };
}

export const FaqSection = ({ data }: FaqSectionProps) => {
  const d = data;
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d?.badge || ""}
          title={d?.h2 || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="flex flex-col gap-3 mb-6">
          {(d?.items || []).map((item, i: number) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.05}
            >
              <SafetyAccordionItem
                title={item?.q || ""}
                content={item?.a || ""}
                icon={<QuestionIcon question={item?.q || ""} />}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            </PerformanceAnimation>
          ))}
        </div>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 text-center italic">
          {d?.note || ""}
        </p>
      </div>
    </section>
  );
};
