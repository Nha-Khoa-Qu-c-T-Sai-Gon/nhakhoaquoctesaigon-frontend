"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { ServiceIndexMenu } from "@/src/components/ui/ServiceIndexMenu";
import { DENTAL_IMPLANTS_NAV } from "@/src/lib/constants/services-nav";
import { VisitClinicSection } from "@/src/components/sections/VisitClinicSection";
import { CombinedTestimonialResult } from "@/src/components/blocks/CombinedTestimonialResult";

// Central Utilities & Constants
import { deepMerge } from "@/src/lib/utils/deep-merge";
import { DENTAL_IMPLANTS_PAGE_FALLBACK } from "@/src/lib/constants/services-fallbacks";

// Extracted Sub-components
import { WhatAreImplantsSection } from "@/src/components/services/dental-implants/WhatAreImplantsSection";
import { ImplantStructureSection } from "@/src/components/services/dental-implants/ImplantStructureSection";
import { BenefitsSection } from "@/src/components/services/dental-implants/BenefitsSection";
import { IndicationsSection } from "@/src/components/services/dental-implants/IndicationsSection";
import { TypesOfImplantsSection } from "@/src/components/services/dental-implants/TypesOfImplantsSection";
import { ProcedureSection } from "@/src/components/services/dental-implants/ProcedureSection";
import { PricingSection } from "@/src/components/services/dental-implants/PricingSection";
import { WhyChooseUsSection } from "@/src/components/services/dental-implants/WhyChooseUsSection";
import { DoctorsSection } from "@/src/components/services/dental-implants/DoctorsSection";
import { BrandsSection } from "@/src/components/services/dental-implants/BrandsSection";
import { TestimonialsSection } from "@/src/components/services/dental-implants/TestimonialsSection";
import { FaqSection } from "@/src/components/services/dental-implants/FaqSection";


export default function DentalImplantsPage({
  data,
  relatedServices: _relatedServices = [],
}: {
  data?: any;
  relatedServices?: any[];
}) {
  const merged = data ? deepMerge(DENTAL_IMPLANTS_PAGE_FALLBACK, data) : DENTAL_IMPLANTS_PAGE_FALLBACK;

  return (
    <>
      <title>{merged?.meta?.title || ""}</title>
      <meta name="description" content={merged?.meta?.description || ""} />
      <main className="min-h-screen bg-white text-foreground">
        <ServiceIndexMenu
          serviceName="Dental Implants"
          items={DENTAL_IMPLANTS_NAV}
        />
        <WhatAreImplantsSection data={merged?.hero} />
        <ImplantStructureSection data={merged?.implantStructure} />
        <BenefitsSection data={merged?.benefits} />
        <IndicationsSection data={merged?.indications} />
        <TypesOfImplantsSection data={merged?.types} />
        <ProcedureSection data={merged?.procedure} />
        <PricingSection data={merged?.pricing} />
        <WhyChooseUsSection data={merged?.whyChooseUs} />
        <DoctorsSection data={merged?.doctors} />
        <BrandsSection data={merged?.brands} />
        <div id="transformation">
          <CombinedTestimonialResult data={merged?.results as any} />
        </div>
        <TestimonialsSection data={merged?.testimonials} />
        <FaqSection data={merged?.faq} />
        <VisitClinicSection
          id="visit-clinic"
          className="bg-gradient-to-b from-white to-sky-50 py-20 lg:py-28"
          title="Visit Our Implant Clinic"
          subtitle="Conveniently located in the heart of Ho Chi Minh City, easy to reach by any transport."
        />
      </main>
    </>
  );
}
