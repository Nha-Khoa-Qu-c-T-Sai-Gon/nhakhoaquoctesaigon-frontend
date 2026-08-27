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
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import type { PhilosophyTab, TitleLine } from "@/src/types/about-us";

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

interface PhilosophySectionProps {
  /**
   * Philosophy section data
   */
  philosophy: {
    titleLines?: TitleLine[];
    title?: string;
    quote?: string;
    tabs?: PhilosophyTab[];
  };
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * PhilosophySection renders tabs showing the clinic's design/care values.
 */
export function PhilosophySection({
  philosophy,
  shouldSimplify,
}: PhilosophySectionProps) {
  const baseUrl = NEXT_PUBLIC_STRAPI_URL;
  const [activePhilosophyTab, setActivePhilosophyTab] = useState(0);

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

  if (!philosophy) return null;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6 md:mb-8">
          <AnimatedSectionHeader
            title={
              philosophy.titleLines && philosophy.titleLines.length > 0
                ? philosophy.titleLines.map((line: TitleLine, idx: number) => (
                    <span key={line.id || idx} className="block mb-1 last:mb-0">
                      {line.text}
                    </span>
                  ))
                : philosophy.title
            }
            titleClassName="text-[#165197] tracking-tight"
            className="!mb-0"
          >
            {philosophy.quote && (
              <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-lg border-l-4 border-primary-500 mt-6 text-left">
                <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-[#165197] leading-relaxed">
                  <Sprout className="w-8 h-8 text-primary-600 inline-block mr-3 mb-1 align-middle" />
                  &ldquo;{philosophy.quote}&rdquo;
                </p>
              </div>
            )}
          </AnimatedSectionHeader>
        </div>

        {/* Tabs */}
        {philosophy.tabs && philosophy.tabs.length > 0 && (
          <div className="mt-12">
            {/* Tab buttons */}
            <div className="flex justify-center gap-2 md:gap-4 mb-10 flex-wrap">
              {philosophy.tabs.map((tab: PhilosophyTab, index: number) => (
                <button
                  key={tab.key || index}
                  onClick={() => setActivePhilosophyTab(index)}
                  className={`px-6 py-3 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 ${
                    activePhilosophyTab === index
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-200 sm:scale-105 scale-100"
                      : "bg-white text-foreground-secondary sm:hover:bg-primary-50 sm:hover:text-primary-700 border border-primary-100"
                  }`}
                  aria-selected={activePhilosophyTab === index}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {philosophy.tabs.map((tab: PhilosophyTab, index: number) => {
              const Icon = (tab.icon ? iconMap[tab.icon] : undefined) || Sprout;
              if (activePhilosophyTab !== index) return null;
              return (
                <MotionDiv
                  key={tab.key || index}
                  initial={
                    shouldSimplify ? { opacity: 0 } : { opacity: 0, y: 20 }
                  }
                  animate={shouldSimplify ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={
                    shouldSimplify ? { duration: 0.2 } : { duration: 0.4 }
                  }
                  className="grid md:grid-cols-2 gap-10 items-center"
                  role="tabpanel"
                >
                  {/* Left: Image */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 md:h-[420px]">
                    <Image
                      src={
                        getImageUrl(tab.image) ||
                        (baseUrl
                          ? `${baseUrl}/uploads/dental_consultation_d555f4a87c.jpg`
                          : "")
                      }
                      alt={tab.title}
                      fill
                      className="object-cover"
                    />
                    {tab.highlight && (
                      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg z-10">
                        <p className="text-base sm:text-lg md:text-xl text-primary-700 font-bold">
                          {tab.highlight}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 md:block md:space-y-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Icon className="w-9 h-9 md:w-11 md:h-11 text-primary-600" />
                      </div>
                      <h3 className="text-2xl md:text-4xl font-bold text-[#165197] leading-[1.15] tracking-tight">
                        {tab.title}
                      </h3>
                    </div>
                    <p className="text-lg md:text-xl text-[#165197]/80 font-normal leading-relaxed">
                      {tab.description}
                    </p>
                    {tab.highlight && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-200">
                        <CheckCircle2 className="w-5 h-5 text-primary-600" />
                        <span className="text-lg md:text-xl text-[#165197] font-bold">
                          {tab.highlight}
                        </span>
                      </div>
                    )}
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
