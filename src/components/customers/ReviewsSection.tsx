"use client";

import React from "react";
import Image from "next/image";
import { Star, CheckCircle, ArrowRight } from "lucide-react";

import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import type { CustomerReviewChecklistItem, CustomerImage } from "@/src/types/customer";

interface ReviewsSectionProps {
  /**
   * Reviews data from Strapi API content block
   */
  reviews: {
    badge?: string;
    title?: string;
    rating?: number;
    rating_subtitle?: string;
    checklist?: CustomerReviewChecklistItem[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * ReviewsSection component displays rating stars, score summaries,
 * and list checklists showing clinical features or feedback reviews.
 */
export function ReviewsSection({ reviews, shouldSimplify }: ReviewsSectionProps) {
  const baseUrl = NEXT_PUBLIC_STRAPI_URL;

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

  if (!reviews) {
    return null;
  }

  return (
    <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <AnimatedSectionHeader
          badge={reviews.badge}
          title={reviews.title}
          titleClassName="text-foreground tracking-tight"
          className="mb-6"
        >
          <div className="flex flex-col items-center justify-center gap-3 mb-6 mt-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <PerformanceAnimation
                  key={i}
                  preset="scale-in"
                  delay={i * 0.1}
                  whileInView={true}
                >
                  <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                </PerformanceAnimation>
              ))}
            </div>
            <p className="text-xl md:text-2xl font-bold">
              <span style={{ color: "#F59E0B" }}>{reviews.rating}</span>
              <span className="text-slate-600"> / </span>
              <span style={{ color: "#F59E0B" }}>5</span>
              <span className="text-foreground-secondary font-normal">
                {" "}
                {reviews.rating_subtitle}
              </span>
            </p>
          </div>
        </AnimatedSectionHeader>
      </div>

      {reviews.checklist && reviews.checklist.length > 0 && (
        <div className="w-full max-w-3xl mx-auto mt-12 flex flex-col gap-3 sm:gap-4 md:gap-5">
          {reviews.checklist.map(
            (item: CustomerReviewChecklistItem, index: number) => {
              const iconUrl = getImageUrl(item.icon);
              const iconAlt =
                item.icon?.alternativeText ||
                item.icon?.alt ||
                item.text ||
                "Checklist Item";
              return (
                <PerformanceAnimation
                  key={index}
                  preset="slide-up-subtle"
                  delay={index * 0.1}
                  whileInView={true}
                >
                  <MotionDiv
                    className="bg-white rounded-2xl border border-slate-100 flex items-center gap-4 sm:gap-5 transition-all duration-300 overflow-hidden relative group px-4 py-4 sm:px-8 sm:py-5"
                    style={{
                      boxShadow: "0 4px 15px rgb(0,0,0,0.02)",
                    }}
                    whileHover={
                      shouldSimplify
                        ? undefined
                        : {
                            x: 8,
                            boxShadow: "0 12px 25px rgb(0,0,0,0.06)",
                            borderColor: "rgb(226, 232, 240)",
                          }
                    }
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
                    {iconUrl ? (
                      <div className="w-12 h-12 flex-shrink-0">
                        <Image
                          src={iconUrl}
                          alt={iconAlt}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 shadow-inner">
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm sm:text-base md:text-lg text-foreground leading-snug sm:group-hover:text-primary-700 transition-colors">
                        {item.text}
                      </p>
                    </div>
                    <div className="hidden sm:flex w-8 h-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 opacity-0 sm:group-hover:opacity-100 transition-all duration-300 text-primary-600 sm:group-hover:bg-primary-50 sm:group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </MotionDiv>
                </PerformanceAnimation>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}
