"use client";

import React from "react";
import Image from "next/image";

import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { BookingButton } from "@/src/components/ui/BookingButton";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import type { TitleLine } from "@/src/types/about-us";

interface AboutUsHeroProps {
  /**
   * Hero section data block
   */
  hero: {
    titleLines?: TitleLine[];
    description?: string;
    images?: (string | { url: string } | null | undefined)[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * AboutUsHero renders the top hero section of the about us page.
 * Features clinical badge elements, descriptive text, CTAs, and a floating mosaic images layout.
 */
export function AboutUsHero({ hero, shouldSimplify }: AboutUsHeroProps) {
  const baseUrl = NEXT_PUBLIC_STRAPI_URL;

  const getImageUrl = (image: string | { url: string } | null | undefined) => {
    if (!image) return null;

    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return baseUrl ? `${baseUrl}${image}` : null;
    }

    if (typeof image === "object" && "url" in image && image.url) {
      if (image.url.startsWith("http")) return image.url;
      return baseUrl ? `${baseUrl}${image.url}` : null;
    }

    return null;
  };

  return (
    <section className="px-6 pt-24 pb-16 sm:pt-28 lg:pt-32 md:pb-24 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 flex flex-col md:block items-center">
          <DecorativeBadge text="About Us" variant="primary" className="mb-0" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#165197] leading-[1.1] tracking-tight text-center md:text-left">
            {hero.titleLines?.map((line: TitleLine, idx: number) => (
              <span key={line.id || idx} className="block mb-1 last:mb-0">
                {line.text}
              </span>
            ))}
          </h1>

          {hero.description && (
            <p className="text-base sm:text-lg md:text-xl text-[#165197]/80 font-normal leading-relaxed text-center md:text-left">
              {hero.description}
            </p>
          )}

          <div className="hidden sm:flex flex-wrap gap-4 pt-2">
            <BookingButton
              label="Book Free Consultation"
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg hover:shadow-xl !px-8 !py-4"
            />
          </div>
        </div>

        {/* Hero image mosaic — floating animation */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: {
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
                y: shouldSimplify
                  ? { duration: 0 }
                  : {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0,
                    },
              }}
              className="rounded-3xl overflow-hidden shadow-xl relative border-4 border-white"
            >
              <Image
                src={
                  getImageUrl(hero.images?.[0]) ||
                  (baseUrl
                    ? `${baseUrl}/uploads/dental_team_db6d3d4f6f.jpg`
                    : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800")
                }
                alt="Dental clinic team"
                width={288}
                height={256}
                className="object-cover w-full h-full"
              />
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: {
                  delay: 0.5,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
                y: shouldSimplify
                  ? { duration: 0 }
                  : {
                      duration: 3.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    },
              }}
              className="rounded-3xl overflow-hidden shadow-xl relative border-4 border-white"
            >
              <Image
                src={
                  getImageUrl(hero.images?.[1]) ||
                  (baseUrl
                    ? `${baseUrl}/uploads/patient_consultation_dcf1a32d50.jpg`
                    : "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800")
                }
                alt="Patient consultation"
                width={288}
                height={192}
                className="object-cover w-full h-full"
              />
            </MotionDiv>
          </div>
          <div className="space-y-4 pt-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: {
                  delay: 0.4,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
                y: shouldSimplify
                  ? { duration: 0 }
                  : {
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    },
              }}
              className="rounded-3xl overflow-hidden shadow-xl relative border-4 border-white"
            >
              <Image
                src={
                  getImageUrl(hero.images?.[2]) ||
                  (baseUrl
                    ? `${baseUrl}/uploads/clinic_interior_205c275757.jpg`
                    : "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800")
                }
                alt="Modern clinic interior"
                width={288}
                height={192}
                className="object-cover w-full h-full"
              />
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: {
                  delay: 0.6,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
                y: shouldSimplify
                  ? { duration: 0 }
                  : {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    },
              }}
              className="rounded-3xl overflow-hidden shadow-xl relative border-4 border-white"
            >
              <Image
                src={
                  getImageUrl(hero.images?.[3]) ||
                  (baseUrl
                    ? `${baseUrl}/uploads/happy_patient_3d6d7753d6.jpg`
                    : "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800")
                }
                alt="Happy patient"
                width={288}
                height={256}
                className="object-cover w-full h-full"
              />
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
}
