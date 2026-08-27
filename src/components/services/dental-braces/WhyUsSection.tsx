"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface PillarItem {
  icon?: any;
  title?: string;
  desc?: string;
}

interface ReviewItem {
  name?: string;
  country?: string;
  stars?: number;
  text?: string;
}

interface WhyUsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    pillars?: PillarItem[];
    image?: string;
    reviews?: ReviewItem[];
  };
}

const renderBracesIcon = (
  icon: any,
  className: string = "w-6 h-6",
  title: string = "",
  desc: string = "",
  invertActive: boolean = false,
) => {
  if (
    typeof icon === "string" &&
    (icon.startsWith("http") ||
      icon.startsWith("/") ||
      icon.includes("/uploads/"))
  ) {
    return (
      <Image
        src={icon}
        alt="Icon"
        width={24}
        height={24}
        className={cn(
          "w-full h-full object-contain",
          invertActive && "brightness-0 invert",
        )}
      />
    );
  }
  if (typeof icon === "string" && icon.length <= 4) {
    return <span className="text-2xl shrink-0">{icon}</span>;
  }
  return renderServiceIcon(icon, className, title, desc);
};

export function WhyUsSection({ data }: WhyUsSectionProps) {
  return (
    <section
      id="why-us"
      className="relative py-16 lg:py-24 overflow-hidden bg-slate-50"
    >
      {/* Ambient Trust Background Glows */}
      <div className="absolute top-[10%] left-[25%] w-[500px] h-[500px] bg-[#165197]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[25%] w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Headline & Badge */}
          <AnimatedSectionHeader
            badge={data?.badge || ""}
            title={data?.h2 || ""}
            align="center"
            className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto"
          />

          {/* Centered Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full mx-auto">
            {(data?.pillars || []).map((p: any, i: number) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.08}
              >
                <div className="group flex flex-col gap-4 bg-white/80 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:scale-[1.01] transition-all duration-300 h-full">
                  {/* Row 1: Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-300">
                      {renderBracesIcon(
                        p?.icon,
                        "w-6 h-6 text-[#165197]",
                        p?.title || "",
                        p?.desc || "",
                      )}
                    </div>
                    <h3 className="font-bold text-[#165197] text-lg sm:text-xl md:text-2xl group-hover:text-[#165197]/80 transition-colors">
                      {p?.title || ""}
                    </h3>
                  </div>
                  {/* Row 2: Content */}
                  <div>
                    <p className="text-sm sm:text-base md:text-lg text-[#165197]/75 leading-relaxed pr-2">
                      {p?.desc || ""}
                    </p>
                  </div>
                </div>
              </PerformanceAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

