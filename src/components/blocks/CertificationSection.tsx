"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import type { HomepageCertificationBlock } from "@/src/types/strapi";
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
import { useCertificateModal } from "@/src/components/providers/CertificateModalContext";

/**
 * CertificationSection — 2026 Premium Design
 */

interface CertificationSectionProps {
  data: HomepageCertificationBlock;
}

/**
 * CertCard — uses HoverCard so the lift transform is on an inner div,
 * keeping the outer hit area stable and hover events reliable.
 */
function CertCard({
  cert,
  index,
  imageUrl,
}: {
  cert: HomepageCertificationBlock["certificates"][number];
  index: number;
  imageUrl: string | null;
}) {
  const { open: openLightbox } = useCertificateModal();

  return (
    <CarouselItem className="pl-4 sm:pl-6 basis-[80%] sm:basis-1/2 lg:basis-1/3">
      <div
        className="h-full animate-kf-fade-in"
        style={{
          animationDelay: `${(index % 3) * 0.08}s`,
          animationFillMode: "both",
        }}
      >
        <HoverCard
          className="h-full"
          onClick={() => {
            if (imageUrl) openLightbox(imageUrl, cert.name || "Certificate");
          }}
        >
          {(hovered) => (
            <div
              className={cn(
                "relative rounded-3xl overflow-hidden border h-[400px] sm:h-[450px]",
                "transition-[box-shadow,border-color] duration-200",
                hovered
                  ? "shadow-[0_20px_60px_rgba(30,58,95,0.18)] border-primary-200"
                  : "shadow-[0_10px_30px_rgba(30,58,95,0.08)] border-primary-50",
              )}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={cert.name}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-300",
                    hovered ? "scale-105" : "scale-100",
                  )}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center pointer-events-none">
                  <svg
                    className="w-32 h-32 text-primary-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              {imageUrl && (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none",
                    "transition-opacity duration-200",
                    hovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl",
                      "transition-transform duration-200",
                      hovered ? "scale-100" : "scale-75",
                    )}
                  >
                    <ZoomIn className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 right-0 p-6 text-right z-10 pointer-events-none">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-lg">
                  {cert.name}
                </h3>
                {cert.organization && (
                  <p className="text-sm sm:text-base text-white/90 mb-1 drop-shadow-md">
                    {cert.organization}
                  </p>
                )}
              </div>
            </div>
          )}
        </HoverCard>
      </div>
    </CarouselItem>
  );
}

export function CertificationSection({ data }: CertificationSectionProps) {
  // Use the NEXT_PUBLIC_STRAPI_URL baked at build time — always available,
  // no async fetch needed unlike the old useEnv() pattern.
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").replace(
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

  if (!data.certificates || data.certificates.length === 0) return null;

  return (
    <section
      id="certifications"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-white"
    >
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#F8FBFF]" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary-100/30 blur-[130px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="text-center mb-12 sm:mb-14 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-foreground leading-tight tracking-tight">
            {data.titleLines && data.titleLines.length > 0 ? (
              data.titleLines.map((line) => (
                <span key={line.id} className="block">
                  {line.text}
                </span>
              ))
            ) : (
              <span className="block">Our Certifications</span>
            )}
          </h2>
          {data.subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-foreground-secondary leading-relaxed mx-auto">
              {data.subtitle}
            </p>
          )}
        </PerformanceAnimation>

        {/* Certificate Carousel */}
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
              {data.certificates.map((cert, index) => {
                const imageUrl = cert.image?.url
                  ? cert.image.url.startsWith("http")
                    ? cert.image.url
                    : strapiUrl
                      ? `${strapiUrl}${cert.image.url}`
                      : null
                  : null;

                return (
                  <CertCard
                    key={cert.id || index}
                    cert={cert}
                    index={index}
                    imageUrl={imageUrl}
                  />
                );
              })}
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
