"use client";

import React from "react";
import dynamic from "next/dynamic";

import { SectionReveal } from "@/src/components/ui/SectionReveal";
import { SectionSkeleton } from "@/src/components/skeletons/SectionSkeleton";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { CustomerHero } from "@/src/components/customers/CustomerHero";
import { SuccessStories } from "@/src/components/customers/SuccessStories";
import { WhyChooseUs } from "@/src/components/customers/WhyChooseUs";
import { ReviewsSection } from "@/src/components/customers/ReviewsSection";

import type { HomepageCombinedTestimonialResultBlock } from "@/src/types/strapi";
import type {
  CustomerImage,
  CustomerStory,
  CustomerWhyChooseUsFeature,
  CustomerReviewChecklistItem,
} from "@/src/types/customer";

// P2: Dynamic import — separate JS chunk, SSR for SEO
const CombinedTestimonialResult = dynamic(
  () =>
    import("@/src/components/blocks/CombinedTestimonialResult").then((m) => ({
      default: m.CombinedTestimonialResult,
    })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[320px]"
        desktopHeight="md:min-h-[580px]"
        cols={3}
      />
    ),
  },
);

// Pre-built stable skeleton nodes
const SK = {
  stories: (
    <SectionSkeleton
      mobileHeight="min-h-[320px]"
      desktopHeight="md:min-h-[560px]"
      cols={3}
    />
  ),
  whyUs: (
    <SectionSkeleton
      mobileHeight="min-h-[320px]"
      desktopHeight="md:min-h-[560px]"
      cols={3}
    />
  ),
  reviews: (
    <SectionSkeleton
      mobileHeight="min-h-[280px]"
      desktopHeight="md:min-h-[460px]"
      cols={1}
    />
  ),
};

interface CustomerContentProps {
  content: {
    hero?: {
      title?: string;
      description?: string;
      images?: (CustomerImage | null)[];
    };
    beforeAfterGallery?: HomepageCombinedTestimonialResultBlock;
    successStories?: {
      badge?: string;
      title?: string;
      description?: string;
      stories?: CustomerStory[];
    };
    whyChooseUs?: {
      badge?: string;
      title?: string;
      description?: string;
      features?: CustomerWhyChooseUsFeature[];
    };
    reviews?: {
      badge?: string;
      title?: string;
      rating?: number;
      rating_subtitle?: string;
      checklist?: CustomerReviewChecklistItem[];
    };
  };
}

export function CustomerContent({ content }: CustomerContentProps) {
  const { shouldSimplify } = useMobileAnimation();

  if (!content || typeof content === "string") return null;

  const { hero, beforeAfterGallery, successStories, whyChooseUs, reviews } =
    content;

  if (!hero && !beforeAfterGallery) return null;

  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ── P1: HERO — LCP driver, no SectionReveal, eager ────────── */}
      {hero && (
        <CustomerHero hero={hero} shouldSimplify={shouldSimplify} />
      )}

      {/* ── P2: Before/After — dynamic SSR, no SectionReveal ──────── */}
      {beforeAfterGallery?.items && beforeAfterGallery.items.length > 0 && (
        <CombinedTestimonialResult data={beforeAfterGallery} />
      )}

      {/* ── P3: Success Stories — SectionReveal 600px ─────────────── */}
      {successStories && (
        <SectionReveal fallback={SK.stories} rootMargin="600px">
          <SuccessStories
            successStories={successStories}
            shouldSimplify={shouldSimplify}
          />
        </SectionReveal>
      )}

      {/* ── P3: Why Choose Us — SectionReveal 600px ───────────────── */}
      {whyChooseUs?.features && whyChooseUs.features.length > 0 && (
        <SectionReveal fallback={SK.whyUs} rootMargin="600px">
          <WhyChooseUs
            whyChooseUs={whyChooseUs}
            shouldSimplify={shouldSimplify}
          />
        </SectionReveal>
      )}

      {/* ── P4: Reviews — SectionReveal 500px ─────────────────────── */}
      {reviews && (
        <SectionReveal fallback={SK.reviews} rootMargin="500px">
          <ReviewsSection
            reviews={reviews}
            shouldSimplify={shouldSimplify}
          />
        </SectionReveal>
      )}
    </div>
  );
}
