"use client";

import React from "react";
import { FAQSection as GlassFAQSection } from "@/src/components/blocks/FAQSection";

interface FaqItem {
  q?: string;
  a?: string;
}

interface FaqSectionProps {
  data?: {
    h2?: string;
    items?: FaqItem[];
  };
}

export function FaqSection({ data }: FaqSectionProps) {
  const d = data || {};
  const faqData: any = {
    id: "faq",
    __component: "blocks.faq",
    title: d.h2 || "",
    subtitle:
      "Clinically accurate answers to the most common questions about dental veneers.",
    questions: (d.items || []).map((item: any, i: number) => ({
      id: `q-${i}`,
      question: item.q || "",
      answer: item.a || "",
    })),
  };

  return <GlassFAQSection data={faqData} />;
}
