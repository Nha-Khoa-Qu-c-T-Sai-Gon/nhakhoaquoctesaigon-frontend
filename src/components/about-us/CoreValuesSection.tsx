"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  TrendingUp,
  Users,
  Scan,
  UserCheck,
  FileText,
  Sofa,
  Lightbulb,
  Shield,
  Heart,
  Smile,
  Star,
  Sprout,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import type { CoreValue } from "@/src/types/about-us";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  TrendingUp,
  Users,
  Scan,
  UserCheck,
  FileText,
  Sofa,
  Lightbulb,
  Shield,
  Heart,
  Smile,
  Star,
  Sprout,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
};

interface CoreValuesSectionProps {
  /**
   * Core values section data block
   */
  coreValues: {
    badge?: string;
    title?: string;
    description?: string;
    centerIcon?: string;
    values?: CoreValue[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * CoreValuesSection displays core values in a two-column solar-system-inspired layout.
 */
export function CoreValuesSection({
  coreValues,
  shouldSimplify,
}: CoreValuesSectionProps) {
  const baseUrl = NEXT_PUBLIC_STRAPI_URL;
  const [hoveredValueIndex, setHoveredValueIndex] = useState<number | null>(
    null,
  );

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

  if (!coreValues) return null;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          <AnimatedSectionHeader
            badge={coreValues.badge}
            title={coreValues.title}
            subtitle={coreValues.description}
            titleClassName="text-[#165197] tracking-tight"
            subtitleClassName="text-[#165197]/80 font-normal max-w-2xl mx-auto"
            className="!mb-0"
          />
        </div>

        {/* Two-column: Solar System + Values List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          {/* Left Side: Universe Animation */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            delay={0.2}
            whileInView={true}
            className="hidden lg:flex"
          >
            <div className="relative w-full max-w-[400px] md:max-w-[500px] aspect-square mx-auto flex items-center justify-center">
              {/* Central Glowing Core */}
              <div className="absolute z-20 w-28 h-28 md:w-36 md:h-36 rounded-full shadow-[0_0_60px_rgba(22,81,151,0.4)] border-4 border-white/20 overflow-hidden bg-white flex items-center justify-center">
                {coreValues.centerIcon ? (
                  <div className="relative w-full h-full p-4 md:p-6">
                    <div className="relative w-full h-full">
                      <Image
                        src={coreValues.centerIcon}
                        alt="Core Values Center Icon"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#165197] to-primary-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />
                    <Smile className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-md relative z-10" />
                  </div>
                )}
              </div>

              {/* Orbit Rings & Planets */}
              {coreValues.values &&
                coreValues.values.map((value: CoreValue, index: number) => {
                  const Icon = (value.icon ? iconMap[value.icon] : undefined) || Star;
                  const sizeMap = ["50%", "75%", "100%"];
                  const size = sizeMap[index % 3];
                  const isEven = index % 2 === 0;
                  const rotateTo = isEven ? 360 : -360;
                  const duration = 25 + index * 10;

                  return (
                    <MotionDiv
                      key={index}
                      className="absolute m-auto rounded-full border border-dashed border-primary-300 z-10"
                      style={{ width: size, height: size }}
                      animate={shouldSimplify ? {} : { rotate: rotateTo }}
                      transition={{
                        duration,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <MotionDiv
                        className="absolute left-1/2 -top-8 md:-top-10 -translate-x-1/2"
                        animate={shouldSimplify ? {} : { rotate: -rotateTo }}
                        transition={{
                          duration,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <MotionDiv
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full cursor-pointer relative flex items-center justify-center bg-white border border-primary-100"
                          animate={{
                            scale: hoveredValueIndex === index ? 1.25 : 1,
                            boxShadow:
                              hoveredValueIndex === index
                                ? "0 0 25px rgba(22,81,151,0.5)"
                                : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                          transition={{ duration: 0.3 }}
                          onMouseEnter={() => setHoveredValueIndex(index)}
                          onMouseLeave={() => setHoveredValueIndex(null)}
                        >
                          {value.iconImage ? (
                            <Image
                              src={getImageUrl(value.iconImage)!}
                              alt={value.title}
                              width={48}
                              height={48}
                              className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            />
                          ) : (
                            <Icon className="w-8 h-8 text-primary-600" />
                          )}
                        </MotionDiv>
                      </MotionDiv>
                    </MotionDiv>
                  );
                })}
            </div>
          </PerformanceAnimation>

          {/* Right Side: Values List */}
          {coreValues.values && (
            <div className="flex flex-col gap-4">
              {coreValues.values.map((value: CoreValue, index: number) => {
                const Icon = (value.icon ? iconMap[value.icon] : undefined) || Star;
                const isHovered = hoveredValueIndex === index;
                return (
                  <PerformanceAnimation
                    key={index}
                    preset="slide-up-subtle"
                    delay={index * 0.1}
                    whileInView={true}
                  >
                    <MotionDiv
                      variants={{
                        rest: {
                          scale: 1,
                          backgroundColor: "rgba(255,255,255,0.65)",
                          y: 0,
                          boxShadow: "0 4px 16px rgba(22,81,151,0.06)",
                        },
                        hovered: {
                          scale: 1.02,
                          backgroundColor: "rgba(255,255,255,1)",
                          y: -4,
                          boxShadow: "0 12px 32px rgba(22,81,151,0.14)",
                        },
                      }}
                      initial="rest"
                      animate={isHovered ? "hovered" : "rest"}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onMouseEnter={() => setHoveredValueIndex(index)}
                      onMouseLeave={() => setHoveredValueIndex(null)}
                      className="group flex flex-col gap-3 p-5 sm:p-6 rounded-2xl backdrop-blur-md border border-white/70 cursor-pointer relative overflow-hidden"
                    >
                      {/* Hover glow */}
                      <MotionDiv
                        variants={{
                          rest: { opacity: 0 },
                          hovered: { opacity: 1 },
                        }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 bg-gradient-to-r from-primary-50/60 to-transparent pointer-events-none rounded-2xl"
                      />

                      {/* Row 1: Icon container + Step number + Title */}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center shadow-sm">
                          <MotionDiv
                            animate={
                              isHovered ? { scale: [1, 1.18, 1] } : { scale: 1 }
                            }
                            transition={{ duration: 0.4 }}
                            className="flex items-center justify-center w-full h-full"
                          >
                            {value.iconImage ? (
                              <Image
                                src={getImageUrl(value.iconImage)!}
                                alt={value.title}
                                width={28}
                                height={28}
                                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                              />
                            ) : (
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#165197]" />
                            )}
                          </MotionDiv>
                        </div>
                        <h3 className="text-base sm:text-xl font-bold text-[#165197] leading-tight">
                          {value.title}
                        </h3>
                      </div>

                      {/* Row 2: Description */}
                      <div className="relative z-10">
                        <p className="text-sm sm:text-lg text-[#165197]/75 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </MotionDiv>
                  </PerformanceAnimation>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
