"use client";

import React from "react";
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
import type { FeatureItem } from "@/src/types/about-us";

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

interface AboutUsWhyChooseUsProps {
  /**
   * Why choose us section data
   */
  whyChooseUs: {
    badge?: string;
    title?: string;
    description?: string;
    features?: FeatureItem[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * AboutUsWhyChooseUs renders the clinic clinical benefits features grid.
 */
export function AboutUsWhyChooseUs({
  whyChooseUs,
  shouldSimplify,
}: AboutUsWhyChooseUsProps) {
  if (!whyChooseUs) return null;

  return (
    <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <AnimatedSectionHeader
          badge={whyChooseUs.badge}
          title={whyChooseUs.title}
          subtitle={whyChooseUs.description}
          titleClassName="text-[#165197] tracking-tight"
          subtitleClassName="text-[#165197]/80 font-normal"
          className="!mb-0"
        />
      </div>

      {whyChooseUs.features && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
          {whyChooseUs.features.map((feature: FeatureItem, index: number) => {
            const Icon =
              (feature.icon ? iconMap[feature.icon] : undefined) || Shield;
            return (
              <PerformanceAnimation
                key={index}
                preset="slide-up-subtle"
                delay={index * 0.1}
                whileInView={true}
                className="h-full"
              >
                <MotionDiv
                  whileHover={
                    shouldSimplify
                      ? undefined
                      : { y: -6, transition: { duration: 0.25 } }
                  }
                  className="group flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl border border-primary-50 hover:border-primary-200 transition-all duration-300 h-full"
                >
                  {/* Row 1: Icon + Title */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 group-hover:scale-110 flex items-center justify-center transition-all duration-300 relative overflow-hidden">
                      {feature.iconImage ? (
                        <Image
                          src={feature.iconImage}
                          alt={feature.title}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <Icon className="w-10 h-10 sm:w-14 sm:h-14 text-primary-600" />
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#165197] leading-tight">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Row 2: Description */}
                  <div>
                    <p className="text-sm sm:text-base md:text-lg text-[#165197]/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </MotionDiv>
              </PerformanceAnimation>
            );
          })}
        </div>
      )}
    </section>
  );
}
