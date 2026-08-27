"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { ServiceIndexMenu } from "@/src/components/ui/ServiceIndexMenu";
import { DENTAL_BLEACHING_NAV } from "@/src/lib/constants/services-nav";
import { CTABlock } from "@/src/components/blocks/CTABlock";
import { SectionReveal } from "@/src/components/ui/SectionReveal";
import { SectionSkeleton } from "@/src/components/skeletons/SectionSkeleton";
import { ResultsSection } from "@/src/components/services/dental-bleaching/ResultsSection";
import { SafetySection } from "@/src/components/services/dental-bleaching/SafetySection";
import { getIcon } from "@/src/lib/utils/service-icons";
import { Shield } from "lucide-react";

// Central Utilities & Constants
import { deepMerge } from "@/src/lib/utils/deep-merge";
import { DENTAL_BLEACHING_PAGE_FALLBACK } from "@/src/lib/constants/services-fallbacks";

// Extracted Sub-components
import { HeroSection } from "@/src/components/services/dental-bleaching/HeroSection";
import { WhatIsBleachingSection } from "@/src/components/services/dental-bleaching/WhatIsBleachingSection";
import { DiscolorationSection } from "@/src/components/services/dental-bleaching/DiscolorationSection";
import { TreatmentSection } from "@/src/components/services/dental-bleaching/TreatmentSection";
import { PreTreatmentSection } from "@/src/components/services/dental-bleaching/PreTreatmentSection";
import { ComparisonSection } from "@/src/components/services/dental-bleaching/ComparisonSection";
import { FaqSection } from "@/src/components/services/dental-bleaching/FaqSection";
import { ClinicSection } from "@/src/components/services/dental-bleaching/ClinicSection";

const FaqJsonLd = ({ faqItems }: { faqItems: any[] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface DentalBleachingPageProps {
  data?: Record<string, any> | null;
  relatedServices?: any[];
}

export default function DentalBleachingPage({
  data,
}: DentalBleachingPageProps) {
  const cms = data ? deepMerge(DENTAL_BLEACHING_PAGE_FALLBACK, data) : DENTAL_BLEACHING_PAGE_FALLBACK;
  const cmsCta = cms.cta ?? null;

  const hero = cms.hero;
  const whatIs = cms.whatIsBleaching;
  const discoloration = cms.discolorationTypes;
  const treatments = cms.treatmentOptions;
  const safety = cms.safety;
  const preTreatment = cms.preTreatment;
  const results = cms.results;
  const comparison = cms.comparison;
  const faqItems = cms.faq || [];
  const clinic = cms.clinic;

  // Resolve icon strings from CMS treatment options
  const resolvedTreatments = {
    ...treatments,
    options: (treatments.options ?? []).map((opt: any) => {
      let icon = opt.icon;
      if (typeof icon === "string") {
        icon = getIcon(icon);
      }
      return {
        ...opt,
        icon: icon || Shield,
      };
    }),
  };

  // Resolve icon strings from CMS safety items
  const resolvedSafety = {
    ...safety,
    items: (safety.items ?? []).map((item: any) => {
      let icon = item.icon;
      if (typeof icon === "string") {
        icon = getIcon(icon);
      }
      return {
        ...item,
        icon: icon || Shield,
      };
    }),
  };

  // Build CTA block — prefer CMS cta component, else use empty defaults
  const NEXT_PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";
  const ctaData = cmsCta ?? {
    id: 999,
    __component: "blocks.cta",
    heading: cms.cta?.heading || cms.cta?.title || "",
    subheading: cms.cta?.subheading || cms.cta?.subtitle || "",
    buttonLabel: "Book a Consultation",
    buttonLink: cms.cta?.buttonLink || "/booking",
    humanImage: NEXT_PUBLIC_STRAPI_URL
      ? {
          url: `${NEXT_PUBLIC_STRAPI_URL}/uploads/model_2_4c3b03f954.png`,
          alt: "Dental Professional",
        }
      : undefined,
    backgroundImage: NEXT_PUBLIC_STRAPI_URL
      ? {
          url: `${NEXT_PUBLIC_STRAPI_URL}/uploads/1920_X800_1a6a22b786.jpg`,
          alt: "CTA Background",
        }
      : undefined,
    hideButtonOnMobile: true,
  };

  return (
    <>
      <FaqJsonLd faqItems={faqItems} />
      <ServiceIndexMenu
        serviceName="Teeth Whitening"
        items={DENTAL_BLEACHING_NAV}
      />
      <main className="bg-white text-foreground">
        {/* P1 — Hero (eager, LCP) */}
        <HeroSection data={hero} />

        {/* P2 — What Is Bleaching (SSR, immediately below fold) */}
        <WhatIsBleachingSection data={whatIs} />

        {/* P3 — Discoloration Types (viewport-deferred 600px) */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[320px]"
              desktopHeight="md:min-h-[600px]"
              cols={2}
            />
          }
          rootMargin="600px"
        >
          <DiscolorationSection data={discoloration} />
        </SectionReveal>

        {/* P3 — Treatment Options */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[400px]"
              desktopHeight="md:min-h-[700px]"
              cols={1}
            />
          }
          rootMargin="600px"
        >
          <TreatmentSection data={resolvedTreatments} />
        </SectionReveal>

        {/* P3 — Safety */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[320px]"
              desktopHeight="md:min-h-[520px]"
              cols={1}
            />
          }
          rootMargin="600px"
        >
          <SafetySection data={resolvedSafety} />
        </SectionReveal>

        {/* P4 — Pre-Treatment */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[280px]"
              desktopHeight="md:min-h-[400px]"
              cols={3}
            />
          }
          rootMargin="500px"
        >
          <PreTreatmentSection data={preTreatment} />
        </SectionReveal>

        {/* P4 — Results */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[320px]"
              desktopHeight="md:min-h-[600px]"
              cols={2}
            />
          }
          rootMargin="500px"
        >
          <ResultsSection data={results} />
        </SectionReveal>

        {/* P4 — Comparison */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[280px]"
              desktopHeight="md:min-h-[480px]"
              cols={1}
            />
          }
          rootMargin="500px"
        >
          <ComparisonSection data={comparison} />
        </SectionReveal>

        {/* P4 — FAQ */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[280px]"
              desktopHeight="md:min-h-[500px]"
              cols={1}
            />
          }
          rootMargin="500px"
        >
          <FaqSection faqItems={faqItems} />
        </SectionReveal>

        {/* P4 — Clinic / About */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[320px]"
              desktopHeight="md:min-h-[600px]"
              cols={2}
            />
          }
          rootMargin="500px"
        >
          <ClinicSection data={clinic} />
        </SectionReveal>

        {/* P4 — CTA (CMS-driven) */}
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[200px]"
              desktopHeight="md:min-h-[300px]"
              cols={1}
            />
          }
          rootMargin="500px"
        >
          <CTABlock data={ctaData as any} />
        </SectionReveal>
      </main>
    </>
  );
}
