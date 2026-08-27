"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/src/components/ui/carousel";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import type { CustomerStory, CustomerImage } from "@/src/types/customer";

interface SuccessStoriesProps {
  /**
   * Success stories section data
   */
  successStories: {
    badge?: string;
    title?: string;
    description?: string;
    stories?: CustomerStory[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * SuccessStories renders a layout of cards highlighting key patient testimonials.
 * Displays as a grid on desktop screens, and collapses into an interactive carousel on mobile viewports.
 */
export function SuccessStories({
  successStories,
  shouldSimplify,
}: SuccessStoriesProps) {
  const baseUrl = NEXT_PUBLIC_STRAPI_URL;
  const [successStoriesApi, setSuccessStoriesApi] = useState<CarouselApi>();
  const [successStoriesCurrent, setSuccessStoriesCurrent] = useState(0);
  const [successStoriesCount, setSuccessStoriesCount] = useState(0);

  useEffect(() => {
    if (!successStoriesApi) return;

    setSuccessStoriesCount(successStoriesApi.scrollSnapList().length);
    setSuccessStoriesCurrent(successStoriesApi.selectedScrollSnap());

    successStoriesApi.on("select", () => {
      setSuccessStoriesCurrent(successStoriesApi.selectedScrollSnap());
    });
  }, [successStoriesApi]);

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

  if (
    !successStories ||
    !successStories.stories ||
    successStories.stories.length === 0
  ) {
    return null;
  }

  return (
    <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-primary-50 via-white to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <AnimatedSectionHeader
            badge={successStories.badge}
            title={successStories.title}
            subtitle={successStories.description}
            titleClassName="text-foreground tracking-tight"
            className="mb-0"
          />
        </div>

        {/* ── Cards Grid (Desktop & Tablet) ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {successStories.stories.map((story: CustomerStory, index: number) => {
            const avatarUrl = getImageUrl(story.avatar);
            return (
              <PerformanceAnimation
                key={index}
                preset="slide-up-subtle"
                delay={index * 0.1}
                whileInView={true}
                className="h-full"
              >
                <MotionDiv
                  className="bg-white rounded-[2.5rem] border border-slate-100 h-full flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                  style={{
                    padding: "40px",
                    boxShadow: "0 10px 40px rgb(0,0,0,0.03)",
                  }}
                  whileHover={
                    shouldSimplify
                      ? undefined
                      : {
                          y: -8,
                          boxShadow: "0 25px 50px rgb(0,0,0,0.08)",
                          borderColor: "rgb(226, 232, 240)",
                          transition: { duration: 0.3 },
                        }
                  }
                >
                  <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex-1 flex flex-col justify-between gap-6">
                    <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed italic font-light flex-grow">
                      &ldquo;{story.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                      <div>
                        <h4 className="font-extrabold text-foreground text-lg leading-tight group-hover:text-primary-700 transition-colors">
                          {story.name}
                        </h4>
                        {story.treatment && (
                          <p className="text-sm sm:text-base md:text-lg font-normal text-primary-600 mt-1">
                            {story.treatment}
                          </p>
                        )}
                      </div>
                      {avatarUrl ? (
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-sm flex-shrink-0 border-2 border-white ring-2 ring-primary-100 ml-2">
                          <Image
                            src={avatarUrl}
                            alt={story.name || "Customer Story"}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 border-2 border-white ring-2 ring-primary-100 ml-2">
                          <span className="text-white font-bold text-lg">
                            {story.name?.charAt(0) || "C"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </MotionDiv>
              </PerformanceAnimation>
            );
          })}
        </div>

        {/* ── Cards Carousel (Mobile Only — below 768px) ── */}
        <div className="md:hidden relative px-4 sm:px-12">
          <Carousel
            setApi={setSuccessStoriesApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 py-3 px-2">
              {successStories.stories.map((story: CustomerStory, index: number) => {
                const avatarUrl = getImageUrl(story.avatar);
                return (
                  <CarouselItem
                    key={`carousel-${index}`}
                    className="pl-2 basis-full"
                  >
                    <div className="h-full py-2">
                      <MotionDiv
                        className="bg-white rounded-[2.5rem] border border-slate-100 h-full flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                        style={{
                          padding: "40px",
                          boxShadow: "0 10px 40px rgb(0,0,0,0.03)",
                        }}
                      >
                        <div className="flex-1 flex flex-col justify-between gap-6">
                          <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed italic font-light flex-grow">
                            &ldquo;{story.quote}&rdquo;
                          </p>
                          <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                            <div>
                              <h4 className="font-extrabold text-foreground text-lg leading-tight transition-colors">
                                {story.name}
                              </h4>
                              {story.treatment && (
                                <p className="text-sm sm:text-base md:text-lg font-normal text-primary-600 mt-1">
                                  {story.treatment}
                                </p>
                              )}
                            </div>
                            {avatarUrl ? (
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-sm flex-shrink-0 border-2 border-white ring-2 ring-primary-100 ml-2">
                                <Image
                                  src={avatarUrl}
                                  alt={story.name || "Customer Story"}
                                  width={56}
                                  height={56}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 border-2 border-white ring-2 ring-primary-100 ml-2">
                                <span className="text-white font-bold text-lg">
                                  {story.name?.charAt(0) || "C"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </MotionDiv>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Premium Pagination Dots — mobile only */}
          {successStoriesCount > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {Array.from({ length: successStoriesCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => successStoriesApi?.scrollTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    successStoriesCurrent === i
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
