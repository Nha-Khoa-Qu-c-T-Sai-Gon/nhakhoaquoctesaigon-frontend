"use client";

import React, { useMemo } from "react";

import { CTABlock } from "@/src/components/blocks/CTABlock";
import { SectionReveal } from "@/src/components/ui/SectionReveal";
import { SectionSkeleton } from "@/src/components/skeletons/SectionSkeleton";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";

import { AboutUsHero } from "@/src/components/about-us/AboutUsHero";
import { RecognizedExcellence } from "@/src/components/about-us/RecognizedExcellence";
import { AboutUsWhyChooseUs } from "@/src/components/about-us/AboutUsWhyChooseUs";
import { PhilosophySection } from "@/src/components/about-us/PhilosophySection";
import { CoreValuesSection } from "@/src/components/about-us/CoreValuesSection";
import { CommitmentSection } from "@/src/components/about-us/CommitmentSection";

interface AboutUsContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page?: any;
}

export function AboutUsContent({ content, page: _page }: AboutUsContentProps) {
  const { shouldSimplify } = useMobileAnimation();

  const commitmentItems = useMemo(
    () => content?.commitment?.commitments || [],
    [content],
  );

  const { hero, excellence } = content || {};

  if (!content || typeof content === "string" || (!hero && !excellence)) {
    return null;
  }

  const { whyChooseUs, philosophy, coreValues, commitment, cta } = content;

  return (
    <div className="w-full bg-white">
      {/* ── SECTION 1: HERO ── */}
      {hero && (
        <AboutUsHero hero={hero} shouldSimplify={shouldSimplify} />
      )}

      {/* ── SECTION 2: RECOGNIZED EXCELLENCE (STATS) ── */}
      {excellence && (
        <RecognizedExcellence
          excellence={excellence}
          shouldSimplify={shouldSimplify}
        />
      )}

      {/* ── SECTION 3: WHY CHOOSE US ── */}
      {whyChooseUs && (
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[300px]"
              desktopHeight="md:min-h-[500px]"
              cols={2}
            />
          }
          rootMargin="600px"
        >
          <AboutUsWhyChooseUs
            whyChooseUs={whyChooseUs}
            shouldSimplify={shouldSimplify}
          />
        </SectionReveal>
      )}

      {/* ── SECTION 4: PHILOSOPHY ── */}
      {philosophy && (
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[300px]"
              desktopHeight="md:min-h-[520px]"
              cols={2}
            />
          }
          rootMargin="600px"
        >
          <PhilosophySection
            philosophy={philosophy}
            shouldSimplify={shouldSimplify}
          />
        </SectionReveal>
      )}

      {/* ── SECTION 5: CORE VALUES ── */}
      {coreValues && (
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[320px]"
              desktopHeight="md:min-h-[560px]"
              cols={2}
            />
          }
          rootMargin="500px"
        >
          <CoreValuesSection
            coreValues={coreValues}
            shouldSimplify={shouldSimplify}
          />
        </SectionReveal>
      )}

      {/* ── SECTION 6: COMMITMENT ── */}
      {commitment && (
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[320px]"
              desktopHeight="md:min-h-[540px]"
              cols={2}
            />
          }
          rootMargin="500px"
        >
          <CommitmentSection
            commitment={commitment}
            commitmentItems={commitmentItems}
            shouldSimplify={shouldSimplify}
          />
        </SectionReveal>
      )}

      {/* ── SECTION 7: CTA ── */}
      {cta && (
        <SectionReveal
          fallback={
            <SectionSkeleton
              mobileHeight="min-h-[160px]"
              desktopHeight="md:min-h-[280px]"
              hasHeader={false}
              cols={1}
            />
          }
          rootMargin="500px"
        >
          <CTABlock
            data={{
              blockType: "cta",
              id: 0,
              heading: cta.heading,
              highlightText: cta.highlightText,
              buttonLabel: cta.buttonLabel,
              buttonLink: cta.buttonLink,
              backgroundImage: cta.backgroundImage,
              humanImage: cta.humanImage,
            }}
          />
        </SectionReveal>
      )}
    </div>
  );
}
