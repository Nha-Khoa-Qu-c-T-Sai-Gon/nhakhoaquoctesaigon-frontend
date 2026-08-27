"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { AlertTriangle } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface ConditionItem {
  icon?: any;
  title?: string;
  desc?: string;
}

interface ConditionsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    items?: ConditionItem[];
    note?: string;
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

export function ConditionsSection({ data }: ConditionsSectionProps) {
  return (
    <section id="conditions" className="py-20 lg:py-28 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {(data?.items || []).map((item: any, i: number) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.05}
            >
              <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm flex flex-col gap-3 transition-all h-full hover:translate-y-[-3px] hover:shadow-md duration-300">
                {/* Row 1: Icon + Title */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                    {renderBracesIcon(
                      item?.icon,
                      "w-6 h-6 text-[#165197]",
                      item?.title || "",
                      item?.desc || "",
                    )}
                  </div>
                  <h3 className="font-bold text-foreground text-lg sm:text-xl">
                    {item?.title || ""}
                  </h3>
                </div>
                {/* Row 2: Content */}
                <div>
                  <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed">
                    {item?.desc || ""}
                  </p>
                </div>
              </div>
            </PerformanceAnimation>
          ))}
        </div>
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.4}
        >
          <div className="bg-[#165197] text-white rounded-2xl px-6 py-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
            <p className="text-sm md:text-base font-medium">{data?.note || ""}</p>
          </div>
        </PerformanceAnimation>
      </div>
    </section>
  );
}
