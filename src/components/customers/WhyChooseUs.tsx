"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Globe, ArrowRight } from "lucide-react";

import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/src/components/ui/carousel";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import type { CustomerWhyChooseUsFeature, CustomerImage } from "@/src/types/customer";

interface WhyChooseUsProps {
  /**
   * Why choose us section data
   */
  whyChooseUs: {
    badge?: string;
    title?: string;
    description?: string;
    features?: CustomerWhyChooseUsFeature[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * WhyChooseUs component highlights features or benefits of selecting the clinic.
 * Uses decorative waves, hover transforms on desktop, and a carousel on mobile.
 */
export function WhyChooseUs({ whyChooseUs, shouldSimplify }: WhyChooseUsProps) {
  const baseUrl = NEXT_PUBLIC_STRAPI_URL;
  const [whyChooseUsApi, setWhyChooseUsApi] = useState<CarouselApi>();
  const [whyChooseUsCurrent, setWhyChooseUsCurrent] = useState(0);
  const [whyChooseUsCount, setWhyChooseUsCount] = useState(0);

  useEffect(() => {
    if (!whyChooseUsApi) return;

    setWhyChooseUsCount(whyChooseUsApi.scrollSnapList().length);
    setWhyChooseUsCurrent(whyChooseUsApi.selectedScrollSnap());

    whyChooseUsApi.on("select", () => {
      setWhyChooseUsCurrent(whyChooseUsApi.selectedScrollSnap());
    });
  }, [whyChooseUsApi]);

  const getImageUrl = (image?: CustomerImage | string | null): string | null => {
    if (!image) return null;
    if (typeof image === "string")
      return image.startsWith("http")
        ? image
        : baseUrl
          ? `${baseUrl}${image}`
          : null;
    if (image.type === "strapi" && image.path)
      return image.path.startsWith("http")
        ? image.path
        : baseUrl
          ? `${baseUrl}${image.path}`
          : null;
    if (image.url)
      return image.url.startsWith("http")
        ? image.url
        : baseUrl
          ? `${baseUrl}${image.url}`
          : null;
    return null;
  };

  if (!whyChooseUs || !whyChooseUs.features || whyChooseUs.features.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <path
              d="M0,250 Q250,200 500,250 T1000,250"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-slate-900"
            />
            <circle
              cx="200"
              cy="250"
              r="3"
              fill="currentColor"
              className="text-slate-900"
            />
            <circle
              cx="500"
              cy="250"
              r="3"
              fill="currentColor"
              className="text-slate-900"
            />
            <circle
              cx="800"
              cy="250"
              r="3"
              fill="currentColor"
              className="text-slate-900"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <AnimatedSectionHeader
            badge={whyChooseUs.badge}
            title={whyChooseUs.title}
            subtitle={whyChooseUs.description}
            titleClassName="text-foreground tracking-tight"
            className="mb-0"
          />
        </div>

        {/* ── Unified Cards Carousel ── */}
        <div className="relative px-4 sm:px-12">
          <Carousel
            setApi={setWhyChooseUsApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6 py-3 px-2">
              {whyChooseUs.features.map((feature: CustomerWhyChooseUsFeature, index: number) => {
                const iconUrl = getImageUrl(feature.icon);
                const iconAlt =
                  feature.icon?.alternativeText ||
                  feature.icon?.alt ||
                  feature.title ||
                  "Why Choose Us Feature";
                return (
                  <CarouselItem
                    key={`carousel-${index}`}
                    className="pl-4 sm:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full py-2">
                      <MotionDiv
                        className="bg-white rounded-2xl border border-slate-100 h-full flex flex-col transition-all duration-300 group"
                        style={{
                          padding: "32px",
                          boxShadow: "0 8px 30px rgb(0,0,0,0.04)",
                        }}
                        whileHover={
                          shouldSimplify
                            ? undefined
                            : {
                                y: -8,
                                boxShadow: "0 20px 40px rgb(0,0,0,0.08)",
                                borderColor: "rgb(226, 232, 240)",
                                transition: { duration: 0.3 },
                              }
                        }
                      >
                        <div className="flex items-center gap-4 mb-5">
                          {iconUrl ? (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 relative">
                              <Image
                                src={iconUrl}
                                alt={iconAlt}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <MotionDiv
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative shrink-0"
                              style={{
                                backgroundColor: "#E0F2FE",
                                boxShadow: "0 0 0 0 rgba(14, 165, 233, 0.3)",
                              }}
                              whileHover={
                                shouldSimplify
                                  ? undefined
                                  : {
                                      scale: 1.1,
                                      boxShadow: "0 0 20px 8px rgba(14, 165, 233, 0.15)",
                                      transition: { duration: 0.3 },
                                    }
                              }
                            >
                              <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
                            </MotionDiv>
                          )}
                          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-[#165197] transition-colors duration-300">
                            {feature.title}
                          </h3>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed font-normal">
                            {feature.description}
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 text-primary-600 font-bold cursor-pointer">
                            <span>Learn more</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </MotionDiv>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {/* Premium navigation arrows for larger screens */}
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>

          {/* Premium Pagination Dots */}
          {whyChooseUsCount > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {Array.from({ length: whyChooseUsCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => whyChooseUsApi?.scrollTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    whyChooseUsCurrent === i
                      ? "w-7 bg-primary-600"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
