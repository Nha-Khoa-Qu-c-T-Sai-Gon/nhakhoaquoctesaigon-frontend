"use client";

import React from "react";

import { SectionReveal } from "@/src/components/ui/SectionReveal";
import { SectionSkeleton } from "@/src/components/skeletons/SectionSkeleton";
import { FAQSection } from "@/src/components/blocks/FAQSection";
import { VisitClinicSection } from "@/src/components/sections/VisitClinicSection";
import { useBookingModal } from "@/src/components/booking-modal/BookingModalContext";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { HeroSection } from "@/src/components/contact/HeroSection";

import type { ContactPageContent } from "@/src/lib/api/queries";
import type { ContactMethod } from "@/src/types/strapi";

interface ContactPageClientProps {
  content: ContactPageContent;
  contactMethods: ContactMethod[];
}

export default function ContactPageClient({
  content,
  contactMethods: _contactMethods,
}: ContactPageClientProps) {
  const { open: openBookingModal } = useBookingModal();
  const { shouldSimplify } = useMobileAnimation();

  if (!content || !content.blocks || content.blocks.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white selection:bg-blue-100 selection:text-blue-900">
      {content.blocks.map((block) => {
        const type = block.__component;

        if (type === "contact.hero") {
          return (
            <HeroSection
              key={block.id}
              hero={block.data}
              shouldSimplify={shouldSimplify}
              openBookingModal={openBookingModal}
            />
          );
        }

        if (type === "contact.map-section") {
          const mapSection = block.data;
          return (
            <SectionReveal
              key={block.id}
              fallback={
                <SectionSkeleton
                  mobileHeight="min-h-[320px]"
                  desktopHeight="md:min-h-[520px]"
                  cols={1}
                />
              }
              rootMargin="600px"
            >
              <VisitClinicSection
                title={mapSection?.title || "Find Us & Get in Touch"}
                subtitle="Conveniently located in the heart of Ho Chi Minh City, easy to reach by any transport."
                reverseLayout={true}
                className="py-20 bg-gradient-to-b from-white to-slate-50"
              />
            </SectionReveal>
          );
        }

        if (type === "contact.faq") {
          return (
            <SectionReveal
              key={block.id}
              fallback={
                <SectionSkeleton
                  mobileHeight="min-h-[280px]"
                  desktopHeight="md:min-h-[500px]"
                  cols={1}
                />
              }
              rootMargin="500px"
            >
              <FAQSection data={block.data} />
            </SectionReveal>
          );
        }

        return null;
      })}
    </main>
  );
}
