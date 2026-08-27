import React from "react";
import Image from "next/image";
import { Ban, Check } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import {
  CROWNS_DAILY_HABITS_FALLBACK,
  CROWNS_AVOID_LIST_FALLBACK,
} from "@/src/lib/constants/services-fallbacks";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface CrownCareItem {
  title?: string;
  description?: string;
  icon?: string | null;
}

interface CrownCareSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    dailyHabits?: CrownCareItem[];
    avoidList?: CrownCareItem[];
    avoidImage?: string;
    images?: {
      avoid?: string;
    };
  };
}

export const CrownCareSection = ({ data }: CrownCareSectionProps) => {
  const d = data || {};
  const dailyHabits = (d.dailyHabits?.length
    ? d.dailyHabits
    : CROWNS_DAILY_HABITS_FALLBACK) as CrownCareItem[];
  const avoidList = (d.avoidList?.length
    ? d.avoidList
    : CROWNS_AVOID_LIST_FALLBACK) as CrownCareItem[];

  return (
    <section
      id="care"
      className="py-20 relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white border-t border-sky-100/50"
    >
      {/* Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_55%)]" />
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl opacity-40 pointer-events-none -mr-16 -mt-16" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <AnimatedSectionHeader
          badge="Post-Treatment Care"
          title={d?.title || "Crown Care: How to Protect Your Investment"}
          subtitle={d?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* Grid for Habits & Avoidance */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Left Card: Daily Habits */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            className="bg-white border border-border/50 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] group transition-all duration-500 hover:-translate-y-1.5"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Daily Habits
              </h3>
            </div>

            <div className="space-y-8">
              {dailyHabits.map((item, i: number) => (
                <PerformanceAnimation
                  key={item.title || i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.1}
                  className="cursor-default relative group/item"
                >
                  <div className="flex flex-col gap-4">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-4 transition-transform duration-300 group-hover/item:translate-x-1.5">
                      <div className="w-11 h-11 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground transition-all duration-300 shadow-sm relative z-10 group-hover/item:scale-110 group-hover/item:rotate-6 group-hover/item:bg-primary group-hover/item:text-white shrink-0">
                        {renderServiceIcon(
                          item.icon,
                          "w-5 h-5",
                          item.title || "",
                          item.description || "",
                        )}
                        <div className="absolute inset-0 bg-sky-400 rounded-xl blur-md -z-10 opacity-0 group-hover/item:opacity-40 group-hover/item:scale-125 transition-all duration-300" />
                      </div>
                      <h4 className="font-bold text-foreground transition-colors group-hover/item:text-primary leading-tight">
                        {item.title}
                      </h4>
                    </div>
                    {/* Row 2: Content */}
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </PerformanceAnimation>

          {/* Right Card: Things to Avoid */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="bg-amber-50/30 border border-amber-100 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_15px_40px_rgba(245,158,11,0.03)] group transition-all duration-500 hover:-translate-y-1.5"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 transition-transform group-hover:scale-110">
                <Ban className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground text-red-900">
                Things to Avoid
              </h3>
            </div>

            <div className="space-y-8">
              {avoidList.map((item, i: number) => (
                <PerformanceAnimation
                  key={item.title || i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={0.2 + i * 0.1}
                  className="cursor-default relative group/item"
                >
                  <div className="flex flex-col gap-4">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-4 transition-transform duration-300 group-hover/item:translate-x-1.5">
                      <div className="w-11 h-11 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-500 transition-all duration-300 shadow-sm relative z-10 group-hover/item:scale-110 group-hover/item:-rotate-6 group-hover/item:bg-amber-600 group-hover/item:text-white shrink-0">
                        {renderServiceIcon(
                          item.icon,
                          "w-5 h-5",
                          item.title || "",
                          item.description || "",
                        )}
                        <div className="absolute inset-0 bg-amber-400 rounded-xl blur-md -z-10 opacity-0 group-hover/item:opacity-40 group-hover/item:scale-125 transition-all duration-300" />
                      </div>
                      <h4 className="font-bold text-amber-900 transition-colors group-hover/item:text-amber-700 leading-tight">
                        {item.title}
                      </h4>
                    </div>
                    {/* Row 2: Content */}
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>

            {/* Visual Emphasis */}
            {(d?.avoidImage || d?.images?.avoid) && (
              <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl border border-amber-200/50 saturate-[0.8] hover:saturate-100 transition-all duration-700">
                <Image
                  src={d?.avoidImage || d?.images?.avoid || ""}
                  alt="Preventive Care"
                  width={600}
                  height={240}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
};
