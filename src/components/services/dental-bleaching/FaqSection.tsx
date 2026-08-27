"use client";

import React, { useState } from "react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { SafetyAccordionItem, QuestionIcon } from "@/src/components/ui/safety-accordion";

interface FaqSectionProps {
  faqItems?: any[];
}

export function FaqSection({ faqItems = [] }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-20 lg:py-28 bg-gradient-to-b from-sky-50 to-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Clinically accurate answers to the most common questions about dental bleaching."
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="flex flex-col gap-3">
          {faqItems.map((item, i) => (
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
