"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { ServiceIndexMenu } from "@/src/components/ui/ServiceIndexMenu";
import { DENTAL_VENEERS_NAV } from "@/src/lib/constants/services-nav";
import { VisitClinicSection } from "@/src/components/sections/VisitClinicSection";

// Central Utilities & Constants
import { deepMerge } from "@/src/lib/utils/deep-merge";
import { DENTAL_VENEERS_PAGE_FALLBACK } from "@/src/lib/constants/services-fallbacks";

// Extracted Sub-components
import { HeroSection } from "@/src/components/services/dental-veneers/HeroSection";
import { WhatAreVeneersSection } from "@/src/components/services/dental-veneers/WhatAreVeneersSection";
import { ProsConsSection } from "@/src/components/services/dental-veneers/ProsConsSection";
import { ComparisonSection } from "@/src/components/services/dental-veneers/ComparisonSection";
import { CandidatesSection } from "@/src/components/services/dental-veneers/CandidatesSection";
import { ProcessSection } from "@/src/components/services/dental-veneers/ProcessSection";
import { CareSection } from "@/src/components/services/dental-veneers/CareSection";
import { PricingSection } from "@/src/components/services/dental-veneers/PricingSection";
import { CostFactorsSection } from "@/src/components/services/dental-veneers/CostFactorsSection";
import { WhyVietnamSection } from "@/src/components/services/dental-veneers/WhyVietnamSection";
import { TestimonialsSection } from "@/src/components/services/dental-veneers/TestimonialsSection";
import { FaqSection } from "@/src/components/services/dental-veneers/FaqSection";

const FaqJsonLd = ({ data }: { data: any }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (data?.items || []).map((item: any) => ({
      "@type": "Question",
      name: item.q || "",
      acceptedAnswer: { "@type": "Answer", text: item.a || "" },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default function DentalVeneersPage({
  data,
  relatedServices: _relatedServices = [],
}: {
  data?: any;
  relatedServices?: any[];
}) {
  const d = data ? deepMerge(DENTAL_VENEERS_PAGE_FALLBACK, data) : DENTAL_VENEERS_PAGE_FALLBACK;

  return (
    <>
      <title>{d?.meta?.title || ""}</title>
      <meta name="description" content={d?.meta?.description || ""} />
      <FaqJsonLd data={d?.faq} />
      <ServiceIndexMenu
        serviceName="Dental Veneers"
        items={DENTAL_VENEERS_NAV}
      />
      <main className="bg-white text-foreground">
        <HeroSection data={d?.hero} />
        <WhatAreVeneersSection data={d?.whatAreVeneers} />
        <ProsConsSection data={d?.prosCons} />
        <ComparisonSection data={d?.comparison} />
        <CandidatesSection data={d?.candidates} />
        <ProcessSection data={d?.process} />
        <CareSection data={d?.care} />
        <PricingSection data={d?.pricing} />
        <CostFactorsSection data={d?.costFactors} />
        <WhyVietnamSection data={d?.whyVietnam} />
        <TestimonialsSection data={d?.testimonials} />
        <FaqSection data={d?.faq} />
        <VisitClinicSection
          id="visit-clinic"
          className="bg-gradient-to-b from-white to-sky-50 py-20 lg:py-28"
          title="Visit Our Cosmetic Clinic"
          subtitle="Experience premium cosmetic dentistry in a world-class clinical environment located in the heart of Saigon."
        />
      </main>
    </>
  );
}
