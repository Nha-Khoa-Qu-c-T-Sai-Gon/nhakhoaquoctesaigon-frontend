"use client";

import React, { useState } from "react";
import { SafetyAccordionItem, QuestionIcon } from "@/src/components/ui/safety-accordion";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface FaqItem {
  q?: string;
  a?: string;
}

interface FaqSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    items?: FaqItem[];
  };
}

export function FaqSection({ data }: FaqSectionProps) {
  const d = data || {};
  const items = d.items || [];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.08),transparent_50%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          subtitle={d.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
          titleClassName="!leading-tight"
        />

        <div className="flex flex-col gap-3">
          {items.map((item: any, i: number) => (
            <SafetyAccordionItem
              key={i}
              title={item.q}
              content={item.a}
              icon={<QuestionIcon question={item.q} />}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
