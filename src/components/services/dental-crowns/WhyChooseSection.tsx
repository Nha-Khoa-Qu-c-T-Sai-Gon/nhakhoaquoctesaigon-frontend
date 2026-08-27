"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, Star } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { VisitClinicSection } from "@/src/components/sections/VisitClinicSection";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface WhyChoosePillar {
  icon?: string | Record<string, unknown> | null;
  title?: string;
  description?: string;
}

interface WhyChooseTestimonial {
  image?: string;
  name?: string;
  rating?: number;
  quote?: string;
}

interface WhyChooseSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    trustInfo?: string;
    pillars?: WhyChoosePillar[];
    testimonials?: WhyChooseTestimonial[];
  };
}

export const WhyChooseSection = ({ data }: WhyChooseSectionProps) => {
  const d = data || {};

  return (
    <section
      id="why-us"
      className="py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-gradient-to-b from-white via-sky-50 to-white"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* 1. HEADER */}
        <AnimatedSectionHeader
          badge="Why Patients Trust Us"
          title={d?.title || ""}
          subtitle={d?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          {d?.trustInfo && (
            <div className="text-xs sm:text-sm md:text-base inline-flex flex-wrap justify-center items-center gap-2 px-6 py-3 mt-5 sm:mt-6 bg-sky-50 text-sky-800 rounded-full font-bold border border-sky-100 shadow-sm mx-auto text-center leading-tight">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {d.trustInfo}
            </div>
          )}
        </AnimatedSectionHeader>

        {/* 2. TRUST PILLARS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {(d?.pillars || []).map((pillar, i: number) => {
            return (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.05}
                className="bg-white border border-border/50 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="flex flex-col gap-4">
                  {/* Row 1: Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary-600 group-hover:bg-primary group-hover:text-white transition-colors duration-300 border border-primary/5 shrink-0">
                      {renderServiceIcon(
                        pillar.icon as (string | null | undefined),
                        "w-6 h-6",
                        pillar.title || "",
                        pillar.description || "",
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {pillar.title}
                    </h4>
                  </div>
                  {/* Row 2: Content */}
                  <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </PerformanceAnimation>
            );
          })}
        </div>

        {/* 3. TESTIMONIALS ROW */}
        <div className="mb-20">
          <div className="flex gap-6 overflow-x-auto pb-6 px-2 -mx-2 snap-x hide-scrollbar">
            {(d?.testimonials || []).map((test, i: number) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.2 + i * 0.1}
                className="snap-center min-w-[300px] w-[350px] shrink-0 bg-white rounded-2xl p-6 border shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  {test.image ? (
                    <Image
                      src={test.image}
                      alt={test.name || "Patient Testimonial"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary-700 border-2 border-primary/20 shrink-0">
                      {test.name?.charAt(0) || "P"}
                    </div>
                  )}
                  <div>
                    <div className="text-xs sm:text-sm md:text-base font-bold text-foreground">
                      {test.name}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(test.rating)].map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-foreground-secondary font-medium italic">
                  &quot;{test.quote}&quot;
                </p>
              </PerformanceAnimation>
            ))}
          </div>
        </div>
      </div>

      {/* 4. LOCATION + CONTACT - Moved outside of max-w-6xl to allow full-width background */}
      <VisitClinicSection
        title="Contact SG International Dental Clinic"
        ctaLabel="Book a Consultation"
        showSocials={true}
        className="bg-gradient-to-r from-[#f8f4ec] to-[#eef6fb] py-12 lg:py-16 mb-20"
        useDefaultContainer={true}
      />
    </section>
  );
};
