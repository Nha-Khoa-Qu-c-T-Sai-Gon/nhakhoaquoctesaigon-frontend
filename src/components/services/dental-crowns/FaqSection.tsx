"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { SafetyAccordionItem } from "@/src/components/ui/safety-accordion";
import { getIcon } from "@/src/lib/utils/service-icons";

interface FaqItem {
  icon?: string | Record<string, unknown> | null;
  q?: string;
  a?: string;
}

export const FaqSection = ({ data }: { data?: FaqItem[] }) => {
  const d = data || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="pt-0 pb-20 lg:pb-32 relative overflow-hidden bg-white"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.08),transparent_50%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <AnimatedSectionHeader
          badge="Common Questions"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about dental crowns and veneers at our clinic."
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="space-y-4">
          {(d || []).map((item, i) => {
            const Icon = getIcon(item.icon as (string | null | undefined), HelpCircle);
            return (
              <SafetyAccordionItem
                key={i}
                title={item.q || ""}
                content={item.a || ""}
                icon={<Icon className="w-5 h-5" />}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
