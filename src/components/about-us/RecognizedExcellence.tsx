"use client";

import React, { useState, useEffect } from "react";
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
import type { StatItem } from "@/src/types/about-us";

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

/**
 * Lightweight CountUp component for performance
 */
function CountUp({
  value,
  duration = 1.5,
  startTrigger = false,
}: {
  value: string;
  duration?: number;
  startTrigger?: boolean;
}) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!startTrigger) return;

    let start = 0;
    const end = numericValue;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    let incrementTime = totalMiliseconds / end;

    if (incrementTime < 16) incrementTime = 16;

    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numericValue, duration, startTrigger]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

interface RecognizedExcellenceProps {
  /**
   * Excellence section data
   */
  excellence: {
    badge?: string;
    title?: string;
    description?: string;
    stats?: StatItem[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * RecognizedExcellence displays dashboard metrics using animatable CountUp numbers.
 */
export function RecognizedExcellence({
  excellence,
  shouldSimplify,
}: RecognizedExcellenceProps) {
  if (!excellence) return null;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          <AnimatedSectionHeader
            badge={excellence.badge}
            title={excellence.title}
            subtitle={excellence.description}
            titleClassName="text-[#165197] tracking-tight"
            subtitleClassName="text-[#165197]/80 font-normal"
            className="!mb-0"
          />
        </div>

        {/* Stats cards */}
        {excellence.stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {excellence.stats.map((stat: StatItem, index: number) => {
              const Icon = (stat.icon ? iconMap[stat.icon] : undefined) || Award;
              return (
                <PerformanceAnimation
                  key={index}
                  preset="scale-in"
                  delay={index * 0.1}
                  whileInView={true}
                  className="h-full"
                >
                  {({ inView }: { inView: boolean }) => (
                    <MotionDiv
                      whileHover={
                        shouldSimplify
                          ? undefined
                          : { y: -8, transition: { duration: 0.25 } }
                      }
                      className="group bg-white rounded-3xl p-6 sm:p-10 shadow-lg hover:shadow-2xl border border-primary-50 hover:border-primary-200 transition-all duration-300 relative overflow-hidden h-full flex flex-col"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 flex flex-row items-center gap-6">
                        {/* Icon — fixed size, left */}
                        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                          {stat.iconImage ? (
                            <Image
                              src={stat.iconImage}
                              alt={stat.label}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <Icon className="w-14 h-14 text-primary-600" />
                          )}
                        </div>
                        {/* Number + label — right */}
                        <div className="flex flex-col">
                          <p className="text-xl min-[375px]:text-2xl sm:text-3xl lg:text-[38px] font-bold text-[#165197] leading-none mb-2">
                            {shouldSimplify ? (
                              stat.value ?? stat.number
                            ) : (
                              <CountUp
                                value={
                                  stat.value != null
                                    ? String(stat.value)
                                    : stat.number
                                }
                                startTrigger={inView}
                              />
                            )}
                          </p>
                          <p className="text-sm sm:text-base md:text-lg text-[#165197]/80 font-normal">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </MotionDiv>
                  )}
                </PerformanceAnimation>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
