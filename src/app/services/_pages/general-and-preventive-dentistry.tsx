"use client";

// docs: khám tổng quát - https://docs.google.com/document/d/1FBkm_GbzfNmSH45lp5WK9M8A6fX-0tYHPCSf3aY98Ho/edit?tab=t.0#heading=h.yt0ry5sx58b5
import React from "react";
import { ServiceIndexMenu } from "@/src/components/ui/ServiceIndexMenu";
import { GENERAL_DENTISTRY_NAV } from "@/src/lib/constants/services-nav";
import { VisitClinicSection } from "@/src/components/sections/VisitClinicSection";
import { HeroSection } from "@/src/components/services/general-and-preventive-dentistry/HeroSection";
import { ImportanceSection } from "@/src/components/services/general-and-preventive-dentistry/ImportanceSection";
import { ServicesSection } from "@/src/components/services/general-and-preventive-dentistry/ServicesSection";
import { ProcessSection } from "@/src/components/services/general-and-preventive-dentistry/ProcessSection";
import { PricingSection } from "@/src/components/services/general-and-preventive-dentistry/PricingSection";
import { WhyUsSection } from "@/src/components/services/general-and-preventive-dentistry/WhyUsSection";
import { FaqSection } from "@/src/components/services/general-and-preventive-dentistry/FaqSection";

// deepMerge supports recursive merging of arbitrary JSON payloads from CMS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }
  return output;
}


const PAGE_DATA = {
  meta: {
    title: "",
    description: "",
  },
  hero: {
    titleLines: [] as string[],
    body: "",
    cta: "Book a Free Consultation",
    image: "",
  },
  importance: {
    badge: "",
    h2: "",
    body: [] as string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    links: [] as any[],
    image: "",
  },
  services: {
    badge: "",
    h2: "",
    intro: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: [] as any[],
  },
  process: {
    badge: "",
    h2: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    steps: [] as any[],
  },
  pricing: {
    badge: "",
    h2: "",
    disclaimer: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: [] as any[],
  },
  whyUs: {
    badge: "",
    h2: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pillars: [] as any[],
  },
  faq: {
    badge: "",
    h2: "",
    note: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: [] as any[],
  },
  clinic: {
    badge: "",
    h2: "",
    cta1: "",
  },
};

// ─── FAQ JSON-LD ─────────────────────────────────────────────────────────────

interface FaqItem { q?: string; a?: string; }
const FaqJsonLd = ({ items }: { items?: FaqItem[] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (items || []).map((item) => ({
      "@type": "Question",
      name: item?.q || "",
      acceptedAnswer: { "@type": "Answer", text: item?.a || "" },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function GeneralCheckUpPage({
  data,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedServices?: any[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d: Record<string, any> = data ? deepMerge(PAGE_DATA, data) : PAGE_DATA;

  return (
    <>
      <title>{d?.meta?.title || ""}</title>
      <meta name="description" content={d?.meta?.description || ""} />
      <FaqJsonLd items={d?.faq?.items} />
      <ServiceIndexMenu
        serviceName="General Dentistry"
        items={GENERAL_DENTISTRY_NAV}
      />
      <main className="bg-white text-foreground">
        <HeroSection data={d?.hero} />
        <ImportanceSection data={d?.importance} />
        <ServicesSection data={d?.services} />
        <ProcessSection data={d?.process} />
        <PricingSection data={d?.pricing} />
        <WhyUsSection data={d?.whyUs} />
        <FaqSection data={d?.faq} />
        <VisitClinicSection
          id="visit-clinic"
          badge={d?.clinic?.badge || ""}
          title={d?.clinic?.h2 || ""}
          ctaLabel={d?.clinic?.cta1 || ""}
          className="bg-gradient-to-r from-[#f8f4ec] to-[#eef6fb] py-20 lg:py-28"
        />
      </main>
    </>
  );
}
