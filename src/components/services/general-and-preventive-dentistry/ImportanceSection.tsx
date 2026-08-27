"use client";

import React from "react";
import Image from "next/image";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";
import { getGoogleMapsUrl } from "@/src/lib/utils/maps";

interface ImportanceSectionProps {
  data: {
    badge?: string;
    h2?: string;
    body?: string | string[];
    links?: Array<{
      label?: string;
      desc?: string;
      icon?: string | Record<string, unknown> | null;
    }>;
    image?: string;
  };
}

export const ImportanceSection = ({ data }: ImportanceSectionProps) => {
  const d = data;
  return (
    <section id="importance" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <DecorativeBadge
              text={d?.badge || ""}
              variant="primary"
              align="responsive"
              className="mb-4"
            />
            <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight mb-5">
                {d?.h2 || ""}
              </h2>
            </PerformanceAnimation>
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.1}
              className="text-base sm:text-lg md:text-xl text-foreground-secondary font-normal leading-relaxed mb-8 space-y-4"
            >
              {Array.isArray(d?.body) ? (
                d.body.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>{d?.body || ""}</p>
              )}
            </PerformanceAnimation>
            <div className="space-y-4">
              {(d?.links || []).map((l, i: number) => {
                const isLocation =
                  (l?.label || "").toLowerCase() === "location";
                const content = (
                  <div className="flex items-start gap-4 bg-sky-50 rounded-2xl p-4 border border-sky-100 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#165197]/10 flex items-center justify-center shrink-0 p-2">
                      {renderServiceIcon(
                      l?.icon as (string | null | undefined),
                        "w-full h-full text-primary-600",
                        l?.label || "",
                        l?.desc || "",
                      )}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1">
                        {l?.label || ""}
                      </p>
                      <p className="text-sm sm:text-base md:text-lg text-foreground-secondary">
                        {l?.desc || ""}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <PerformanceAnimation
                    key={i}
                    preset="slide-up-subtle"
                    whileInView={true}
                    delay={0.2 + i * 0.05}
                  >
                    {isLocation ? (
                      <a
                        href={getGoogleMapsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </PerformanceAnimation>
                );
              })}
            </div>
          </div>
          <PerformanceAnimation
            preset="slide-right"
            whileInView={true}
            className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]"
          >
            <Image
              src={d?.image || ""}
              alt="Systemic oral health connection"
              fill
              className="object-cover"
              sizes="(max-w-1024px) 100vw, 50vw"
            />
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
};
