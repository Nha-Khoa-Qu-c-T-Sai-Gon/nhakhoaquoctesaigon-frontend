"use client";

import React from "react";
import { Check, Star, FileText } from "lucide-react";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface ClinicSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    image?: any;
    doctorByline?: {
      label?: string;
      name?: string;
      credentials?: string;
    };
    clinicalDescription?: string[];
    credentials?: string[];
    reviews?: any[];
    disclaimer?: string;
  };
}

export function ClinicSection({ data }: ClinicSectionProps) {
  const d = data || {};
  const clinicalDescription = d.clinicalDescription || [];
  const credentials = d.credentials || [];
  const reviews = d.reviews || [];

  return (
    <section
      id="clinic"
      className="py-20 lg:py-28"
      style={{
        background:
          "linear-gradient(160deg, #F0F6FF 0%, #EBF3FF 30%, #F5F9FF 70%, #ffffff 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 2-Column Layout ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-10">
          {/* LEFT: Description + Credentials */}
          <div>
            <AnimatedSectionHeader
              title={d.title || ""}
              align="left"
              className="mb-2 sm:mb-3 md:mb-4"
              titleClassName="!mb-0 sm:!mb-0"
              titleAs="h1"
              titleSize="large"
            />

            <div className="space-y-4 mb-8">
              {clinicalDescription.map((para: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.1}
                >
                  <p
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
                    style={{ color: "var(--color-foreground-secondary)" }}
                  >
                    {para}
                  </p>
                </PerformanceAnimation>
              ))}
            </div>

            <ul className="space-y-3 mb-8">
              {credentials.map((c: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={0.3 + i * 0.05}
                >
                  <li
                    className="text-sm sm:text-base md:text-lg flex items-start gap-3 leading-relaxed"
                    style={{ color: "var(--color-foreground-secondary)" }}
                  >
                    <Check
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--color-primary-600)" }}
                    />{" "}
                    {c}
                  </li>
                </PerformanceAnimation>
              ))}
            </ul>

            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.6}
              className="flex flex-wrap gap-2.5"
            >
              {[
                "ADA-Aligned",
                "AACD-Affiliated",
                "5-Star Rated",
                "1,000+ Cases",
              ].map((b) => (
                <span
                  key={b}
                  className="text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(22,81,151,0.08)",
                    color: "#165197",
                    border: "1px solid rgba(22,81,151,0.18)",
                  }}
                >
                  {b}
                </span>
              ))}
            </PerformanceAnimation>
          </div>

          {/* RIGHT: Testimonials */}
          <div className="space-y-4">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
              style={{ color: "var(--color-primary-400)" }}
            >
              Patient Reviews · Google
            </p>
            {reviews.map((r: any, i: number) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.2 + i * 0.1}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-primary-100 shadow-md hover:scale-[1.01] hover:shadow-[0_8px_28px_rgba(22,81,151,0.10)] transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: r.stars || 0 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest ml-auto"
                    style={{ color: "var(--color-primary-300)" }}
                  >
                    via Google
                  </span>
                </div>
                <p
                  className="text-sm sm:text-base md:text-lg italic font-medium mb-3 leading-relaxed"
                  style={{ color: "var(--color-foreground-secondary)" }}
                >
                  &quot;{r.text}&quot;
                </p>
                <p
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: "var(--color-primary-600)" }}
                >
                  {r.name} · {r.country}
                </p>
              </PerformanceAnimation>
            ))}
          </div>
        </div>

        {/* ── Clinical Disclaimer ── */}
        {d.disclaimer && (
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.8}
            className="rounded-xl p-4 sm:p-5 flex items-start gap-3"
            style={{
              background: "rgba(22,81,151,0.04)",
              border: "1px solid rgba(22,81,151,0.10)",
            }}
          >
            <FileText
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-primary-400)" }}
            />
            <p
              className="text-xs sm:text-sm italic leading-relaxed"
              style={{ color: "var(--color-foreground-secondary)" }}
            >
              {d.disclaimer}
            </p>
          </PerformanceAnimation>
        )}
      </div>
    </section>
  );
}
