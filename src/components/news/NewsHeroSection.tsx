"use client";

import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

const STATIC_HERO_IMAGES = [
  "/uploads/about_us_section_1_4afb174811.jpg",
  "/uploads/about_us_section_2_bdc229eb21.jpg",
  "/uploads/about_us_section_3_f9cb79ad01.jpg",
  "/uploads/about_us_section_4_f29079acc1.jpg",
];

interface NewsHeroSectionProps {
  /**
   * Current search input value
   */
  searchQuery: string;
  /**
   * Callback on search input value change
   */
  onSearchChange: (value: string) => void;
  /**
   * Strapi URL for media loading
   */
  strapiUrl: string;
  /**
   * Helper translation function
   */
  translate: (text: string) => string;
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * NewsHeroSection renders the main header of the News page,
 * containing animated floating cards on both sides, the main title and subtitle,
 * and a center search input bar.
 */
export function NewsHeroSection({
  searchQuery,
  onSearchChange,
  strapiUrl,
  translate,
  shouldSimplify,
}: NewsHeroSectionProps) {
  return (
    <section className="relative pt-32 sm:pt-40 lg:pt-48 pb-32 lg:pb-44">
      {/* Background decorations — contained so they don't overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blue → White gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#dbeafe] via-[#eff6ff] to-white" />
        {/* Subtle radial accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_70%)]" />
      </div>

      {/* LEFT floating cards */}
      <div className="absolute left-4 xl:left-12 top-[55%] lg:top-[60%] -translate-y-1/2 hidden md:flex flex-col gap-5 z-10">
        {/* Card 1 — top-left */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -4 }}
          animate={{ opacity: 1, x: 0, rotate: -4, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            x: { delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            y: shouldSimplify
              ? { duration: 0 }
              : {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0,
                },
          }}
          whileHover={{ rotate: 0, scale: 1.04 }}
          className="w-40 md:w-52 xl:w-64 h-28 md:h-36 xl:h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white cursor-pointer relative"
        >
          <Image
            src={`${strapiUrl}${STATIC_HERO_IMAGES[0]}`}
            alt="Dental news"
            fill
            className="object-cover"
            sizes="(max-w-768px) 160px, (max-w-1280px) 208px, 256px"
          />
        </motion.div>
        {/* Card 2 — bottom-left, shifted right */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: 3 }}
          animate={{ opacity: 1, x: 24, rotate: 3, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            x: { delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            y: shouldSimplify
              ? { duration: 0 }
              : {
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                },
          }}
          whileHover={{ rotate: 0, scale: 1.04 }}
          className="w-32 md:w-44 xl:w-56 h-20 md:h-28 xl:h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white cursor-pointer relative"
        >
          <Image
            src={`${strapiUrl}${STATIC_HERO_IMAGES[1]}`}
            alt="Dental care"
            fill
            className="object-cover"
            sizes="(max-w-768px) 128px, (max-w-1280px) 176px, 224px"
          />
        </motion.div>
      </div>

      {/* RIGHT floating cards */}
      <div className="absolute right-4 xl:right-12 top-[55%] lg:top-[60%] -translate-y-1/2 hidden md:flex flex-col gap-5 z-10">
        {/* Card 3 — right */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: 4, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            x: { delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            y: shouldSimplify
              ? { duration: 0 }
              : {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                },
          }}
          whileHover={{ rotate: 0, scale: 1.04 }}
          className="w-40 md:w-52 xl:w-64 h-28 md:h-36 xl:h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white cursor-pointer relative"
        >
          <Image
            src={`${strapiUrl}${STATIC_HERO_IMAGES[2]}`}
            alt="Dental treatment"
            fill
            className="object-cover"
            sizes="(max-w-768px) 160px, (max-w-1280px) 208px, 256px"
          />
        </motion.div>
        {/* Card 4 — bottom-right, shifted left */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotate: -3 }}
          animate={{ opacity: 1, x: -20, rotate: -3, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            x: { delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            y: shouldSimplify
              ? { duration: 0 }
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                },
          }}
          whileHover={{ rotate: 0, scale: 1.04 }}
          className="w-32 md:w-44 xl:w-52 h-20 md:h-28 xl:h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white cursor-pointer relative"
        >
          <Image
            src={`${strapiUrl}${STATIC_HERO_IMAGES[3]}`}
            alt="Oral health"
            fill
            className="object-cover"
            sizes="(max-w-768px) 128px, (max-w-1280px) 176px, 208px"
          />
        </motion.div>
      </div>

      {/* Center content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <PerformanceAnimation preset="slide-up-subtle" delay={0.2}>
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#165197] tracking-tight leading-tight mb-4">
              News &amp; Dental Knowledge
            </h1>
            <p className="text-base sm:text-lg text-foreground-secondary font-normal leading-relaxed max-w-2xl">
              Stay updated with the latest dental care information and modern
              clinical services.
            </p>
          </div>
        </PerformanceAnimation>

        {/* Search bar */}
        <PerformanceAnimation preset="fade-in" delay={0.35}>
          <div className="relative max-w-sm mx-auto">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={translate("Search articles...")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-full bg-white border border-blue-100 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm sm:text-base md:text-lg text-slate-700"
            />
          </div>
        </PerformanceAnimation>
      </div>
    </section>
  );
}
