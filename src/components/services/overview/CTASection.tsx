"use client";

import React from "react";
import Image from "next/image";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { useEnv } from "@/src/hooks/useEnv";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface CTASectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctaData?: any;
}

export function CTASection({ ctaData }: CTASectionProps) {
  const heading = ctaData?.heading || "Schedule Your Clinical Evaluation";
  const highlightText = ctaData?.highlight_text || "Clinical Evaluation";
  const buttonLabel = ctaData?.button_label || "Book Consultation";
  const buttonLink = ctaData?.button_link || "/contact";

  const { env } = useEnv();
  const strapiBase = env?.NEXT_PUBLIC_STRAPI_URL || env?.STRAPI_URL || "";
  const backgroundImage = ctaData?.background_image
    ? {
        url: ctaData.background_image.url
          ? ctaData.background_image.url.startsWith("http")
            ? ctaData.background_image.url
            : `${strapiBase}${ctaData.background_image.url}`
          : "",
        alt:
          ctaData.background_image.alternativeText ||
          ctaData.background_image.name ||
          "CTA Background",
      }
    : null;

  const humanImage = ctaData?.human_image
    ? {
        url: ctaData.human_image.url
          ? ctaData.human_image.url.startsWith("http")
            ? ctaData.human_image.url
            : `${strapiBase}${ctaData.human_image.url}`
          : "",
        alt:
          ctaData.human_image.alternativeText ||
          ctaData.human_image.name ||
          "Dental Professional",
      }
    : null;

  // Split heading to highlight specific text
  const renderHeading = () => {
    if (!heading) return null;

    if (highlightText && heading.includes(highlightText)) {
      const parts = heading.split(highlightText);
      return (
        <>
          {parts[0]}
          <span className="text-blue-600 relative inline-block">
            {highlightText}
            <span className="absolute bottom-1 left-0 h-1 sm:h-2 bg-blue-100 -z-10 w-full" />
          </span>
          {parts[1]}
        </>
      );
    }

    return heading;
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-20 lg:py-0">
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0">
        {/* Gradient backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBFF] to-[#EBF5FF]" />

        {/* Background Image (if provided from CMS) */}
        {backgroundImage && backgroundImage.url && (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage.url}
              alt={backgroundImage.alt || "CTA Background"}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-100/30 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <circle
              cx="850"
              cy="150"
              r="150"
              fill="url(#grad1_cta)"
              className="animate-pulse-subtle"
            />
            <defs>
              <radialGradient
                id="grad1_cta"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch lg:min-h-[550px] xl:min-h-[650px]">
          <div className="relative w-full lg:absolute lg:right-0 lg:bottom-0 lg:w-1/2 lg:h-full z-20 flex items-center justify-center lg:justify-end mb-8 sm:mb-10 lg:mb-0">
            <PerformanceAnimation
              preset="scale-in"
              whileInView={true}
              duration={1.2}
              className="relative w-[260px] h-[260px] sm:w-[450px] sm:h-[450px] lg:w-full lg:h-[75%] self-end pointer-events-none"
            >
              <div className="relative w-full h-full drop-shadow-[0_25px_45px_rgba(30,58,95,0.2)]">
                {humanImage?.url && (
                  <Image
                    src={humanImage.url}
                    alt={humanImage.alt || "Dental Professional"}
                    fill
                    className="object-contain object-bottom transform"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
            </PerformanceAnimation>
          </div>

          <PerformanceAnimation
            preset="slide-up"
            whileInView={true}
            duration={0.7}
            className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left py-4 sm:py-8 lg:py-20 relative z-30"
          >
            <div className="space-y-5 sm:space-y-8 max-w-xl mx-auto lg:mx-0">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                  {renderHeading()}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-foreground-secondary font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Experience patient-centered care with our English-speaking
                  experts. Your journey to a perfect smile starts with a single
                  click.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <NavigationLink
                  href={buttonLink}
                  className="group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl text-white font-bold text-lg overflow-hidden shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] to-[#2B5A8E] group-hover:scale-105 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    {buttonLabel}
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </NavigationLink>
              </div>
            </div>
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
