import React from "react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface CareItem {
  icon?: string | Record<string, unknown> | null;
  title?: string;
  desc?: string;
}

interface CareSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    items?: CareItem[];
  };
}

export const CareSection = ({ data }: CareSectionProps) => {
  const d = data;
  const items = d?.items || [];
  const featureItem = items[0] || { icon: "", title: "", desc: "" };
  const gridItems = items.slice(1);

  return (
    <section
      id="aftercare"
      className="relative py-20 lg:py-28 bg-gradient-to-b from-blue-50 via-white to-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d?.badge || ""}
          title={d?.h2 || ""}
          subtitle={d?.subtitle || ""}
          subtitleClassName="text-primary-600"
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          {/* Feature Card */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="group bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-md flex flex-col gap-6 items-start transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
            <div className="flex flex-col gap-3 relative z-10">
              {/* Row 1: Icon + Title */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:rotate-3 transition-transform duration-300">
                  {renderServiceIcon(
                    featureItem.icon as (string | null | undefined),
                    "w-7 h-7 text-primary-600",
                    featureItem.title || "",
                    featureItem.desc || "",
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {featureItem.title || ""}
                </h3>
              </div>
              {/* Row 2: Content */}
              <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                {featureItem.desc || ""}
              </p>
            </div>
          </PerformanceAnimation>

          {/* Divider Line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2" />

          {/* Grid Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {gridItems.map((item, i: number) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.08}
              >
                <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md flex flex-col gap-4 transition-all duration-300 h-full">
                  <div className="flex flex-col gap-3">
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:rotate-3 transition-transform duration-300">
                        {renderServiceIcon(
                          item.icon as (string | null | undefined),
                          "w-6 h-6 text-primary-600",
                          item.title || "",
                          item.desc || "",
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                        {item.title || ""}
                      </h3>
                    </div>
                    {/* Row 2: Content */}
                    <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                      {item.desc || ""}
                    </p>
                  </div>
                </div>
              </PerformanceAnimation>
            ))}
          </div>

          {/* Bottom Note */}
          <p className="text-center text-sm font-medium text-slate-400 mt-4 animate-in fade-in duration-500 delay-500 fill-mode-both">
            Consistent care ensures long-lasting results
          </p>
        </div>
      </div>
    </section>
  );
};
