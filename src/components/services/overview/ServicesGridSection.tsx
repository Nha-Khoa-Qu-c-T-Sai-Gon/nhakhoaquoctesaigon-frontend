"use client";

import React, { useState } from "react";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { ServiceCard } from "./ServiceCard";

interface ServiceItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

interface ServicesGridSectionProps {
  data: ServiceItem[];
}

export const CATEGORIES = [
  "All",
  "Cosmetic",
  "Implants",
  "Orthodontics",
  "General",
] as const;

export function ServicesGridSection({ data }: ServicesGridSectionProps) {
  const [active, setActive] = useState<string>("All");
  const filtered = data.filter(
    (s) => active === "All" || s.category === active,
  );

  return (
    <section className="bg-gradient-to-b from-blue-50/40 via-white to-white py-16 sm:py-20 lg:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Filter */}
        <div className="mb-8 sm:mb-10 md:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
            <p className="text-xs sm:text-sm md:text-base text-[10px] sm:font-bold uppercase tracking-widest text-blue-600 mb-1">
              All Services
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
              Browse by Category
            </h2>
          </PerformanceAnimation>

          {/* Category pills */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 focus:outline-none
                  ${
                    active === cat
                      ? "bg-[#165197] text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
                  }`}
              >
                {cat}
                {active === cat && (
                  <span className="absolute inset-0 rounded-full bg-[#165197] -z-10" />
                )}
              </button>
            ))}
          </PerformanceAnimation>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, i) => (
            <PerformanceAnimation
              key={service.slug}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.05}
            >
              <ServiceCard service={service} />
            </PerformanceAnimation>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-medium">
            No services in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
