import type { Page, HomepageBlock } from "@/src/types/strapi";
import dynamic from "next/dynamic";
import { EmptyState } from "./EmptyState";
import { SectionSkeleton } from "./skeletons/SectionSkeleton";
import { SectionReveal } from "./ui/SectionReveal";

/**
 * BlockRenderer — Phase 3 Progressive Loading Architecture
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * SEO guarantee: ALL sections use ssr:true (Next.js dynamic() default).
 *   The server renders full HTML for every section. Crawlers always see content.
 *   SectionReveal uses a null-sentinel pattern so it also renders children on server.
 *
 * Priority tiers:
 *
 *   P1 — Eager import (drives LCP, no dynamic, no skeleton, no delay)
 *        • VideoHero
 *
 *   P2 — Dynamic SSR, no SectionReveal (first 1-2 scroll depths)
 *        Load immediately after hero. Skeleton only shown during client-nav.
 *        • HeroBlock, ServicesBlock, CTABlock
 *        • TrustSection, ProcessSection, AboutBlock
 *
 *   P3 — Dynamic SSR + SectionReveal 600px (well below fold)
 *        Full HTML in SSR. Client-side: skeleton until 600px from viewport.
 *        Browser skips paint for off-screen via content-visibility CSS.
 *        • CombinedTestimonialResult, DoctorSection
 *        • CertificationSection, PapersSection
 *
 *   P4 — Dynamic SSR + SectionReveal 400px (near footer)
 *        • FAQSection, BlogCollectionSection
 *
 * content-visibility: auto
 *   Applied via 'cv-section' CSS class in globals.css.
 *   Browser natively skips paint and layout for off-screen sections.
 *   This is the primary off-screen optimization — zero JS, zero SSR impact.
 */

// ── P1: Eager ──────────────────────────────────────────────────────────────
import { VideoHero } from "./blocks/VideoHero";

// ── P2: Dynamic SSR, immediate ────────────────────────────────────────────
const HeroBlock = dynamic(
  () => import("./blocks/HeroBlock").then((m) => ({ default: m.HeroBlock })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[380px]"
        desktopHeight="md:min-h-[600px]"
        cols={1}
      />
    ),
  },
);
const ServicesBlock = dynamic(
  () =>
    import("./blocks/ServicesBlock").then((m) => ({
      default: m.ServicesBlock,
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
const CTABlock = dynamic(
  () => import("./blocks/CTABlock").then((m) => ({ default: m.CTABlock })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[120px]"
        desktopHeight="md:min-h-[200px]"
        hasHeader={false}
        cols={1}
      />
    ),
  },
);
const TrustSection = dynamic(
  () =>
    import("./blocks/TrustSection").then((m) => ({ default: m.TrustSection })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[280px]"
        desktopHeight="md:min-h-[420px]"
        cols={3}
      />
    ),
  },
);
const ProcessSection = dynamic(
  () =>
    import("./blocks/ProcessSection").then((m) => ({
      default: m.ProcessSection,
    })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[360px]"
        desktopHeight="md:min-h-[520px]"
        cols={1}
      />
    ),
  },
);
const AboutBlock = dynamic(
  () => import("./blocks/AboutBlock").then((m) => ({ default: m.AboutBlock })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[300px]"
        desktopHeight="md:min-h-[500px]"
        cols={2}
      />
    ),
  },
);

// ── P3: Dynamic SSR + SectionReveal 600px ─────────────────────────────────
const CombinedTestimonialResult = dynamic(
  () =>
    import("./blocks/CombinedTestimonialResult").then((m) => ({
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
const DoctorSection = dynamic(
  () =>
    import("./blocks/DoctorSection").then((m) => ({
      default: m.DoctorSection,
    })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[360px]"
        desktopHeight="md:min-h-[620px]"
        cols={3}
      />
    ),
  },
);
const CertificationSection = dynamic(
  () =>
    import("./blocks/CertificationSection").then((m) => ({
      default: m.CertificationSection,
    })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[280px]"
        desktopHeight="md:min-h-[480px]"
        cols={3}
      />
    ),
  },
);
const PapersSection = dynamic(
  () =>
    import("./blocks/PapersSection").then((m) => ({
      default: m.PapersSection,
    })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[280px]"
        desktopHeight="md:min-h-[460px]"
        cols={3}
      />
    ),
  },
);

// ── P4: Dynamic SSR + SectionReveal 400px ─────────────────────────────────
const FAQSection = dynamic(
  () => import("./blocks/FAQSection").then((m) => ({ default: m.FAQSection })),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[300px]"
        desktopHeight="md:min-h-[500px]"
        cols={1}
      />
    ),
  },
);
const BlogCollectionSection = dynamic(
  () => import("./blocks/BlogCollectionSection"),
  {
    loading: () => (
      <SectionSkeleton
        mobileHeight="min-h-[320px]"
        desktopHeight="md:min-h-[540px]"
        cols={3}
      />
    ),
  },
);

// ── Pre-built skeleton nodes (stable references, no JSX allocation per render) ─
const SK = {
  testimonial: (
    <SectionSkeleton
      mobileHeight="min-h-[320px]"
      desktopHeight="md:min-h-[580px]"
      cols={3}
    />
  ),
  doctor: (
    <SectionSkeleton
      mobileHeight="min-h-[360px]"
      desktopHeight="md:min-h-[620px]"
      cols={3}
    />
  ),
  cert: (
    <SectionSkeleton
      mobileHeight="min-h-[280px]"
      desktopHeight="md:min-h-[480px]"
      cols={3}
    />
  ),
  papers: (
    <SectionSkeleton
      mobileHeight="min-h-[280px]"
      desktopHeight="md:min-h-[460px]"
      cols={3}
    />
  ),
  faq: (
    <SectionSkeleton
      mobileHeight="min-h-[300px]"
      desktopHeight="md:min-h-[500px]"
      cols={1}
    />
  ),
  blog: (
    <SectionSkeleton
      mobileHeight="min-h-[320px]"
      desktopHeight="md:min-h-[540px]"
      cols={3}
    />
  ),
};

// ─────────────────────────────────────────────────────────────────────────────

/** Raw CMS block payload forwarded to each section component. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CmsBlockData = any;

interface BlockRendererProps {
  layout: Page["layout"] | HomepageBlock[];
}

export function BlockRenderer({ layout }: BlockRendererProps) {
  if (!layout || layout.length === 0) {
    return (
      <EmptyState
        title="No content blocks"
        description="This page doesn't have any content blocks yet. Add some blocks in the CMS."
      />
    );
  }

  return (
    <>
      {layout.map((block, index) => {
        if (!block || !block.blockType) return null;

        try {
          const reactKey = `${block.blockType}-${index}`;

          switch (block.blockType) {
            // ── P1: Immediate, drives LCP ──────────────────────────────────
            case "video-hero":
              return <VideoHero key={reactKey} data={block as CmsBlockData} />;

            // ── P2: Dynamic SSR, no SectionReveal ─────────────────────────
            case "hero":
              return <HeroBlock key={reactKey} data={block as CmsBlockData} />;

            case "services":
              return <ServicesBlock key={reactKey} data={block as CmsBlockData} />;

            case "cta":
              return <CTABlock key={reactKey} data={block as CmsBlockData} />;

            case "trust":
              return <TrustSection key={reactKey} data={block as CmsBlockData} />;

            case "process":
              return <ProcessSection key={reactKey} data={block as CmsBlockData} />;

            case "about":
              return <AboutBlock key={reactKey} data={block as CmsBlockData} />;

            // ── P3: SectionReveal 600px, content-visibility via CSS ────────
            case "combined-testimonial-result":
              return (
                <SectionReveal
                  key={reactKey}
                  fallback={SK.testimonial}
                  rootMargin="600px"
                >
                  <CombinedTestimonialResult data={block as CmsBlockData} />
                </SectionReveal>
              );

            case "doctor":
              return (
                <SectionReveal
                  key={reactKey}
                  fallback={SK.doctor}
                  rootMargin="600px"
                >
                  <DoctorSection data={block as CmsBlockData} />
                </SectionReveal>
              );

            case "certification":
              return (
                <SectionReveal
                  key={reactKey}
                  fallback={SK.cert}
                  rootMargin="600px"
                >
                  <CertificationSection data={block as CmsBlockData} />
                </SectionReveal>
              );

            case "papers-section":
              return (
                <SectionReveal
                  key={reactKey}
                  fallback={SK.papers}
                  rootMargin="600px"
                >
                  <PapersSection data={block as CmsBlockData} />
                </SectionReveal>
              );

            // ── P4: SectionReveal 400px ────────────────────────────────────
            case "faq":
              return (
                <SectionReveal
                  key={reactKey}
                  fallback={SK.faq}
                  rootMargin="500px"
                >
                  <FAQSection data={block as CmsBlockData} />
                </SectionReveal>
              );

            case "blog-collection-section":
              return (
                <SectionReveal
                  key={reactKey}
                  fallback={SK.blog}
                  rootMargin="500px"
                >
                  <BlogCollectionSection {...(block as CmsBlockData)} />
                </SectionReveal>
              );

            default:
              return (
                <div key={reactKey} className="py-8 bg-yellow-50">
                  <div className="container mx-auto px-4 text-center">
                    <p className="text-yellow-800">
                      Unknown block type: {(block as CmsBlockData).blockType as string}
                    </p>
                  </div>
                </div>
              );
          }
        } catch {
          return (
            <div key={index} className="py-8 bg-red-50">
              <div className="container mx-auto px-4 text-center">
                <p className="text-red-800">Error rendering block</p>
              </div>
            </div>
          );
        }
      })}
    </>
  );
}
