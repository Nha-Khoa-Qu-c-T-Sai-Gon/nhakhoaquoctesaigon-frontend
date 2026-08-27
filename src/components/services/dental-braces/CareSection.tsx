"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { Check, X, Activity, CheckCircle2 } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface CareItem {
  icon?: any;
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

export function CareSection({ data }: CareSectionProps) {
  const items = data?.items || [];

  return (
    <section
      id="care"
      className="py-20 lg:py-28 bg-slate-50/50 relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
          <p className="text-sm sm:text-base md:text-lg text-[#165197]/70 leading-relaxed max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-12 -mt-4">
            {data?.subtitle || ""}
          </p>
        </PerformanceAnimation>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {items.map((item: any, i: number) => {
            const isBlue = i === 0;
            const isSlate = i === 1;
            const isCyan = i === 2;

            const lines = item?.desc
              ? item.desc
                  .split("\n")
                  .map((l: string) => l.trim())
                  .filter(Boolean)
              : [];

            return (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={(i + 1) * 0.1}
                className="h-full"
              >
                <div
                  className={cn(
                    "bg-white rounded-[2rem] p-6 lg:p-8 border shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full",
                    isBlue && "border-blue-100/50",
                    isSlate && "border-slate-200/60",
                    isCyan && "border-cyan-100/50",
                  )}
                >
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                        isBlue && "bg-blue-50/30 border-blue-100",
                        isSlate && "bg-slate-50 border-slate-200",
                        isCyan && "bg-cyan-50/30 border-cyan-100",
                      )}
                    >
                      {item?.icon ? (
                        renderBracesIcon(
                          item.icon,
                          "w-6 h-6",
                          item.title,
                          item.desc,
                        )
                      ) : (
                        <>
                          {isBlue && (
                            <Check className="w-6 h-6 text-[#165197]" />
                          )}
                          {isSlate && <X className="w-6 h-6 text-slate-600" />}
                          {isCyan && (
                            <Activity className="w-6 h-6 text-cyan-700" />
                          )}
                        </>
                      )}
                    </div>
                    <h3 className="font-bold text-[#165197] text-lg sm:text-xl">
                      {item?.title || ""}
                    </h3>
                  </div>

                  {lines.length > 1 ? (
                    <ul className="space-y-4">
                      {lines.map((line: string, idx: number) => {
                        const splitPoint = line.indexOf("—");
                        const prefix =
                          splitPoint !== -1
                            ? line.substring(0, splitPoint).trim()
                            : line;
                        const suffix =
                          splitPoint !== -1 ? line.substring(splitPoint) : "";

                        return (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm sm:text-base md:text-lg text-[#165197]/80 leading-relaxed"
                          >
                            {isBlue && (
                              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            )}
                            {isSlate && (
                              <X className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            {isCyan && (
                              <Check className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                            )}
                            <span>
                              {splitPoint !== -1 ? (
                                <>
                                  <span className="font-bold text-[#165197]">
                                    {prefix}
                                  </span>{" "}
                                  {suffix}
                                </>
                              ) : (
                                line
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm sm:text-base md:text-lg text-[#165197]/80 leading-relaxed">
                      {item?.desc || ""}
                    </p>
                  )}
                </div>
              </PerformanceAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
}
