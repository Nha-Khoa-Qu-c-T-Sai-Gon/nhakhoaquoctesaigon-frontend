"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { HomepagePapersSectionBlock } from "@/src/types/strapi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/src/components/ui/carousel";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { HoverCard } from "@/src/components/ui/HoverCard";
import { cn } from "@/src/lib/utils";

/**
 * PapersSection — Embla Carousel (matches BlogCollectionSection layout)
 *
 * Migrated from a custom JS translate-slider to Embla for:
 * - Native touch scroll physics (no JS RAF overhead)
 * - Same card height and visual language as BlogCollectionSection
 * - object-contain on images so logos/paper covers are never cropped
 * - h-56 image container = same vertical rhythm as blog cards
 */

interface PapersSectionProps {
  data: HomepagePapersSectionBlock;
}

function PaperCard({
  paper,
  index,
  buildUrl,
}: {
  paper: HomepagePapersSectionBlock["papers"][number];
  index: number;
  buildUrl: (url: string | undefined) => string;
}) {
  const imageUrl = buildUrl(paper.image?.url);

  return (
    <CarouselItem className="pl-4 sm:pl-6 basis-[80%] sm:basis-[55%] lg:basis-1/3">
      <div
        className="h-full animate-kf-fade-in"
        style={{
          animationDelay: `${(index % 3) * 0.08}s`,
          animationFillMode: "both",
        }}
      >
        <HoverCard className="h-full">
          {(hovered) => (
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read scientific paper"
              className={cn(
                "relative block rounded-3xl overflow-hidden aspect-[938/898] w-full bg-white",
                "transition-[box-shadow] duration-200",
                hovered
                  ? "shadow-[0_20px_60px_rgba(30,58,95,0.18)]"
                  : "shadow-[0_10px_30px_rgba(30,58,95,0.08)]",
              )}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Scientific Paper"
                  fill
                  className={cn(
                    "object-cover transition-transform duration-300",
                    hovered ? "scale-105" : "scale-100",
                  )}
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 55vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary-50 to-blue-50 pointer-events-none">
                  <svg
                    className="w-14 h-14 text-primary-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-primary-300 uppercase tracking-widest">
                    Research Paper
                  </span>
                </div>
              )}
              {/* Scrim — pointer-events-none so it never creates a hover hole */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              {/* Read Article — visible only when hovered */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bottom-4 right-4 inline-flex items-center gap-1.5 text-white text-xs sm:text-sm font-semibold pointer-events-none",
                  "transition-[opacity,transform] duration-200",
                  hovered
                    ? "opacity-100 translate-x-0.5"
                    : "opacity-0 translate-x-0",
                )}
              >
                Read Article
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </span>
            </a>
          )}
        </HoverCard>
      </div>
    </CarouselItem>
  );
}

export function PapersSection({ data }: PapersSectionProps) {
  // Build-time env var — no async hook needed
  const strapiBaseUrl = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").replace(
    /\/$/,
    "",
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const buildUrl = (url: string | undefined): string => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return strapiBaseUrl ? `${strapiBaseUrl}${url}` : "";
  };

  const papers = data.papers ?? [];
  if (papers.length === 0) return null;

  return (
    <section
      id="papers"
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-white"
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(22,81,151,0.05), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="mt-3 text-base sm:text-lg md:text-xl text-foreground-secondary mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </PerformanceAnimation>

        {/* ── Carousel ───────────────────────────────────────────────────── */}
        <div className="relative px-4 sm:px-0">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {papers.map((paper, index) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  index={index}
                  buildUrl={buildUrl}
                />
              ))}
            </CarouselContent>
            {/* Premium navigation arrows for larger screens */}
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>

        {/* Premium Pagination Dots */}
        {count > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === i
                    ? "w-7 bg-primary-600"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
