"use client";

import React from "react";
import { CombinedTestimonialResult } from "@/src/components/blocks/CombinedTestimonialResult";

interface PatientItem {
  name?: string;
  country?: string;
  stars?: number;
  quote?: string;
  treatment?: string;
  avatar?: string;
  before?: string;
  after?: string;
}

interface TestimonialsSectionProps {
  data?: {
    h2?: string;
    patients?: PatientItem[];
  };
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const d = data || {};

  // Map existing data to format expected by CombinedTestimonialResult
  const mappedData = {
    id: 1, // Required by HomepageCombinedTestimonialResultBlock
    blockType: "combined-testimonial-result" as const,
    title: d.h2 || "",
    subtitle:
      "Our patients love their new smiles. Here are some of their stories.",
    items: (d.patients || []).map((p: any, i: number) => ({
      id: i,
      customerName: p.name || "",
      country: p.country || "",
      rating: p.stars || 5,
      content: p.quote || "",
      treatmentType: p.treatment || "",
      avatar: p.avatar
        ? {
            url: p.avatar,
            alt: `${p.name || ""} avatar`,
          }
        : undefined,
      beforeImage: {
        url: p.before || "",
        alt: `${p.name || ""} before treatment`,
      },
      afterImage: {
        url: p.after || "",
        alt: `${p.name || ""} after treatment`,
      },
    })),
  };

  return (
    <section id="testimonials">
      <CombinedTestimonialResult data={mappedData as any} />
    </section>
  );
}
