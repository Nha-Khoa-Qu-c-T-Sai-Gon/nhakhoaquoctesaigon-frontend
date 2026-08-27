"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ServiceIndexMenu } from "@/src/components/ui/ServiceIndexMenu";
import { DENTAL_BRACES_NAV } from "@/src/lib/constants/services-nav";
import { ProcessSection } from "@/src/components/sections/ProcessSection";

// Extracted Sub-components
import { HeroSection } from "@/src/components/services/dental-braces/HeroSection";
import { WhatAreBracesSection } from "@/src/components/services/dental-braces/WhatAreBracesSection";
import { BracesTypesSection } from "@/src/components/services/dental-braces/BracesTypesSection";
import { ConditionsSection } from "@/src/components/services/dental-braces/ConditionsSection";
import { DurationSection } from "@/src/components/services/dental-braces/DurationSection";
import { WhyUsSection } from "@/src/components/services/dental-braces/WhyUsSection";
import { CareSection } from "@/src/components/services/dental-braces/CareSection";
import { FaqSection } from "@/src/components/services/dental-braces/FaqSection";
import { ContactCTASection } from "@/src/components/services/dental-braces/ContactCTASection";

const FaqJsonLd = ({ faqItems = [] }: { faqItems?: any[] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqItems || []).map((item: any) => ({
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

export default function DentalBracesPage({
  data,
  relatedServices: _relatedServices = [],
}: {
  data?: any;
  relatedServices?: any[];
}) {
  return (
    <>
      <title>{data?.meta?.title || ""}</title>
      <meta name="description" content={data?.meta?.description || ""} />
      <FaqJsonLd faqItems={data?.faq?.items} />
      <ServiceIndexMenu serviceName="Dental Braces" items={DENTAL_BRACES_NAV} />
      <main className="bg-white text-foreground">
        <HeroSection data={data?.hero} />
        <WhatAreBracesSection data={data?.whatAreBraces} />
        <BracesTypesSection data={data?.bracesTypes} />
        <ConditionsSection data={data?.conditions} />
        <ProcessSection data={data?.process} />
        <DurationSection data={data?.duration} />
        <WhyUsSection data={data?.whyUs} />
        <CareSection data={data?.care} />
        <FaqSection data={data?.faq} />
        <ContactCTASection data={data?.contact} />
      </main>
    </>
  );
}
