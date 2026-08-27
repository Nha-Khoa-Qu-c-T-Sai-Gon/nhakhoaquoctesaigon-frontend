"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { Button } from "@/src/components/ui/button";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import type { CustomerImage } from "@/src/types/customer";

interface CustomerHeroProps {
  /**
   * Hero section data
   */
  hero: {
    title?: string;
    description?: string;
    images?: (CustomerImage | null)[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * CustomerHero displays the LCP-driving top header for the customer testimonials page.
 * Includes interactive navigation action buttons and floating animated grid images.
 */
export function CustomerHero({ hero, shouldSimplify }: CustomerHeroProps) {
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

  return (
    <section className="relative pt-24 pb-20 sm:pt-28 md:pb-32 lg:pt-32 overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-6 items-center">
          <div className="flex flex-col gap-6 lg:pr-4 text-center md:text-left items-center md:items-start">
            <DecorativeBadge
              text="Patient Stories"
              variant="primary"
              className="mb-0"
            />
            <AnimatedSectionHeader
              title={hero.title}
              subtitle={hero.description}
              titleAs="h1"
              titleSize="large"
              align="left"
              titleClassName="text-[#165197] tracking-tight"
              subtitleClassName="text-[#165197]/80 font-normal w-full max-w-[none]"
              className="!mb-0 items-center md:items-start text-center md:text-left"
            />
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                asChild
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-xl text-sm sm:text-base md:text-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                <NavigationLink href="/services">
                  Explore Our Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </NavigationLink>
              </Button>
            </div>
          </div>

          {/* Hero Images Grid — floating animation */}
          <div className="grid grid-cols-2 gap-4 lg:pl-8">
            <div className="space-y-4">
              {[
                {
                  idx: 0,
                  h: "h-64",
                  delay: 0.3,
                  dur: 3.5,
                  loopDelay: 0,
                  alt: "Happy dental patients",
                },
                {
                  idx: 1,
                  h: "h-48",
                  delay: 0.5,
                  dur: 3.8,
                  loopDelay: 0.8,
                  alt: "Patient consultation",
                },
              ].map(({ idx, h, delay, dur, loopDelay, alt }) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: [0, -10, 0] }}
                  transition={{
                    opacity: {
                      delay,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    y: shouldSimplify
                      ? { duration: 0 }
                      : {
                          duration: dur,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: loopDelay,
                        },
                  }}
                  className={`rounded-3xl overflow-hidden shadow-xl relative ${h} border-4 border-white`}
                >
                  <Image
                    src={getImageUrl(hero.images?.[idx]) || ""}
                    alt={hero.images?.[idx]?.alt || alt}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </motion.div>
              ))}
            </div>
            <div className="space-y-4 pt-8">
              {[
                {
                  idx: 2,
                  h: "h-48",
                  delay: 0.4,
                  dur: 3.6,
                  loopDelay: 0.4,
                  alt: "Family dental care",
                },
                {
                  idx: 3,
                  h: "h-64",
                  delay: 0.6,
                  dur: 4,
                  loopDelay: 1.2,
                  alt: "Patient consultation",
                },
              ].map(({ idx, h, delay, dur, loopDelay, alt }) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: [0, -10, 0] }}
                  transition={{
                    opacity: {
                      delay,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    y: shouldSimplify
                      ? { duration: 0 }
                      : {
                          duration: dur,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: loopDelay,
                        },
                  }}
                  className={`rounded-3xl overflow-hidden shadow-xl relative ${h} border-4 border-white`}
                >
                  <Image
                    src={getImageUrl(hero.images?.[idx]) || ""}
                    alt={hero.images?.[idx]?.alt || alt}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
