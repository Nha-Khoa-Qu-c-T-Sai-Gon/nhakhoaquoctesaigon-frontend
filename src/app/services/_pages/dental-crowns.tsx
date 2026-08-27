"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { ServiceIndexMenu } from "@/src/components/ui/ServiceIndexMenu";
import { DENTAL_CROWNS_NAV } from "@/src/lib/constants/services-nav";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

import { CrownCareSection } from "@/src/components/services/dental-crowns/CrownCareSection";
import { DecisionGuideSection } from "@/src/components/services/dental-crowns/DecisionGuideSection";
import {
  CROWNS_COMPARISON_FALLBACK,
  CROWNS_PAYMENT_METHODS_FALLBACK,
} from "@/src/lib/constants/services-fallbacks";

import { WhyChooseSection } from "@/src/components/services/dental-crowns/WhyChooseSection";
import { FaqSection } from "@/src/components/services/dental-crowns/FaqSection";
import { ProcessSection } from "@/src/components/sections/ProcessSection";
import { IndicationsCarousel } from "@/src/components/services/dental-crowns/IndicationsCarousel";
import { MaterialBestFit } from "@/src/components/services/dental-crowns/MaterialBestFit";

// Extracted Sub-components
import { HeroSection } from "@/src/components/services/dental-crowns/HeroSection";
import { ComparisonSection } from "@/src/components/services/dental-crowns/ComparisonSection";
import { PricingSection } from "@/src/components/services/dental-crowns/PricingSection";
import { LifespanSection } from "@/src/components/services/dental-crowns/LifespanSection";

interface RelatedService {
  title?: string;
  desc?: string;
  href?: string;
  image?: string;
}

export default function DentalCrownsPage({
  data: cmsData,
  relatedServices: _relatedServices = [],
}: {
  data?: Record<string, any>;
  relatedServices?: RelatedService[];
}) {
  const d: Record<string, any> = cmsData || {};

  const comparisonFallback = CROWNS_COMPARISON_FALLBACK;
  const paymentMethodsFallback = CROWNS_PAYMENT_METHODS_FALLBACK;

  return (
    <div className="bg-[#F8FBFF] text-foreground">
      <ServiceIndexMenu serviceName="Dental Crowns" items={DENTAL_CROWNS_NAV} />
      <main className="bg-white text-foreground">
        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <HeroSection data={d?.hero} />

        {/* ── 2. CLINICAL INDICATIONS ─────────────────────────────────────── */}
        <section
          id="indications"
          className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-sky-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <AnimatedSectionHeader
                title={d?.whenNeedCrown?.title || ""}
                subtitle={d?.whenNeedCrown?.subtitle || ""}
                align="center"
                className="mb-8 sm:mb-10 md:mb-12"
              />

              <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
                <IndicationsCarousel
                  indications={d?.whenNeedCrown?.indications || []}
                />
              </PerformanceAnimation>
            </div>
          </div>
        </section>

        {/* ── 3. TREATMENT OPTIONS: CROWN MATERIALS ──────────────────────── */}
        <section
          id="materials"
          className="py-20 sm:py-24 lg:py-32 bg-[#F8FBFF]"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <AnimatedSectionHeader
                title={d?.crownMaterials?.title || ""}
                subtitle={d?.crownMaterials?.subtitle || ""}
                className="mb-2 sm:mb-3 md:mb-4"
              />

              {/* DECISION HELPER BAR */}
              {(d?.crownMaterials?.helperBar ||
                (d?.crownMaterials?.quickLogic &&
                  d.crownMaterials.quickLogic.length > 0)) && (
                <PerformanceAnimation
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={0.1}
                  className="mb-10 flex flex-col md:flex-row items-center justify-center gap-4 bg-white/60 backdrop-blur-sm border border-primary-100 rounded-2xl p-4 shadow-sm w-full"
                >
                  <span className="text-xs sm:text-sm md:text-base font-bold text-foreground">
                    {d?.crownMaterials?.helperBar || ""}
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {(d?.crownMaterials?.quickLogic || []).map((logic: any) => (
                      <div
                        key={logic.label}
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-border flex-shrink-0 shadow-sm"
                      >
                        <span className="text-xs sm:text-sm md:text-base text-[11px] sm: text-foreground-secondary whitespace-nowrap">
                          {logic.label}
                        </span>
                        <svg
                          className="w-3 h-3 text-primary-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        <span className="text-xs sm:text-sm md:text-base text-[11px] sm:font-bold text-foreground whitespace-nowrap">
                          {logic.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </PerformanceAnimation>
              )}

              <div className="w-full">
                <MaterialBestFit
                  materials={d?.crownMaterials?.materials || []}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. COMPARISON GUIDE ────────────────────────────────────────── */}
        <ComparisonSection
          data={d?.decisionGuide?.comparison}
          fallback={comparisonFallback}
        />

        {/* ── 5. DENTAL CROWN COST IN HCMC ────────────────────────────────── */}
        <PricingSection
          data={d?.pricingSection}
          crownPricing={d?.crownPricing}
          paymentMethodsFallback={paymentMethodsFallback}
        />

        {/* ── 6. PROCESS TIMELINE ─────────────────────────────────────────── */}
        <section id="process">
          <ProcessSection
            steps={d?.crownProcess}
            journeyHeader={d?.journeyHeader}
          />
        </section>

        {/* ── 7. HOW LONG DO CROWNS LAST? ─────────────────────────────────── */}
        <LifespanSection
          data={d?.lifespanSection}
          crownLifespan={d?.crownLifespan}
          longevityFactors={d?.longevityFactors}
        />

        {/* ── 8 CROWN CARE: HOW TO PROTECT YOUR INVESTMENT ─────────────── */}
        <div>
          <CrownCareSection data={d?.crownCare} />
        </div>

        {/* ── 9 TREATMENT DECISION GUIDE ─────────────────────────────── */}
        <div>
          <DecisionGuideSection data={d?.decisionGuide} />
        </div>

        {/* ── 10 WHY CHOOSE SG INTERNATIONAL CLINIC ─────────────────────── */}
        <section>
          <WhyChooseSection data={d?.whyChoose} />
        </section>

        {/* ── 11 FREQUENTLY ASKED QUESTIONS ─────────────────────────────── */}
        <section>
          <FaqSection data={d?.faq} />
        </section>
      </main>
    </div>
  );
}
