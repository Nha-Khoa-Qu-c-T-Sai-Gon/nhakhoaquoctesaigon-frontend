"use client";

import React from "react";
import { motion } from "framer-motion";
import { STATIC_CATEGORIES } from "@/src/lib/constants/news";

interface CategoryFilterProps {
  /**
   * Currently active category ID
   */
  activeCategory: string;
  /**
   * Callback to change active category ID
   */
  setActiveCategory: (category: string) => void;
  /**
   * Translation utility function
   */
  translate: (text: string) => string;
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * CategoryFilter displays horizontal category filter tags.
 * Includes smooth sliding tab animation layouts on desktop viewports.
 */
export function CategoryFilter({
  activeCategory,
  setActiveCategory,
  translate,
  shouldSimplify,
}: CategoryFilterProps) {
  return (
    <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-3">
        <div className="flex items-center justify-center gap-2 flex-wrap py-1">
          {STATIC_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                relative px-3 py-1.5 sm:px-5 sm:py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider
                ${
                  activeCategory === category.id
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-900"
                }
              `}
            >
              <span className="relative z-10">
                {translate(category.label)}
              </span>
              {activeCategory === category.id && !shouldSimplify && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-slate-900 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {activeCategory === category.id && shouldSimplify && (
                <div className="absolute inset-0 bg-slate-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
