"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, AlertTriangle, ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface DiscolorationSectionProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    extrinsic?: {
      title?: string;
      accent?: string;
      causes?: string[];
      treatment?: string;
      icon?: string | null;
    };
    intrinsic?: {
      title?: string;
      accent?: string;
      causes?: string[];
      treatment?: string;
      icon?: string | null;
    };
    callout?: string;
    limitation?: string;
  };
}

export function DiscolorationSection({ data }: DiscolorationSectionProps) {
  const d = data || {};
  const [extrinsicExpanded, setExtrinsicExpanded] = useState(false);
  const [intrinsicExpanded, setIntrinsicExpanded] = useState(false);

  const extrinsic = d.extrinsic || { title: "", causes: [], treatment: "", icon: null };
  const intrinsic = d.intrinsic || { title: "", causes: [], treatment: "", icon: null };

  return (
    <section
      id="causes"
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-sky-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.title || ""}
          subtitle={d.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* ── Extrinsic — warm amber ── */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            className="bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-sm transition-all hover:scale-[1.01] hover:shadow-[0_20px_40px_-12px_rgba(251,146,60,0.18)]"
          >
            <div className="p-6">
              {/* A. Quick Scan */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 relative">
                  {extrinsic.icon ? (
                    <Image
                      src={extrinsic.icon}
                      alt={extrinsic.title || ""}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xl">☕</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {extrinsic.title || ""}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                    Surface-level · Enamel only
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5 mb-4">
                {(extrinsic.causes || []).map((c: any, i: number) => (
                  <li
                    key={i}
                    className="text-sm sm:text-base md:text-lg flex items-center gap-2 text-foreground-secondary"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />{" "}
                    {c}
                  </li>
                ))}
              </ul>

              {/* B. Summary Strip */}
              <div
                className="rounded-xl px-4 py-3 mb-4"
                style={{
                  background: "#FEF3C7",
                  border: "1px solid rgba(251,191,36,0.35)",
                }}
              >
                <p className="text-sm sm:text-base md:text-lg font-semibold leading-snug text-amber-900">
                  Stains on enamel surfaces. Respond well to both professional
                  prophylaxis and bleaching.
                </p>
              </div>

              {/* C. Expandable Clinical Explanation */}
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  extrinsicExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed mb-4 mt-2">
                    {extrinsic.treatment || ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExtrinsicExpanded(!extrinsicExpanded)}
                className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                {extrinsicExpanded ? "Show less" : "Clinical explanation"}
                <span
                  className={cn(
                    "transition-transform duration-300",
                    extrinsicExpanded && "rotate-180",
                  )}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </PerformanceAnimation>

          {/* ── Intrinsic — cool blue ── */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="bg-white rounded-3xl overflow-hidden shadow-sm transition-all hover:scale-[1.01] hover:shadow-[0_20px_40px_-12px_rgba(22,81,151,0.18)]"
            style={{ border: "1px solid var(--color-primary-100)" }}
          >
            <div className="p-6">
              {/* A. Quick Scan */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 relative">
                  {intrinsic.icon ? (
                    <Image
                      src={intrinsic.icon}
                      alt={intrinsic.title || ""}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xl">🦷</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {intrinsic.title || ""}
                  </h3>
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "var(--color-primary-400)" }}
                  >
                    Internal · Within enamel & dentin
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5 mb-4">
                {(intrinsic.causes || []).map((c: any, i: number) => (
                  <li
                    key={i}
                    className="text-sm sm:text-base md:text-lg flex items-center gap-2 text-foreground-secondary"
                  >
                    <Check
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: "var(--color-primary-400)" }}
                    />{" "}
                    {c}
                  </li>
                ))}
              </ul>

              {/* B. Summary Strip */}
              <div
                className="rounded-xl px-4 py-3 mb-4"
                style={{
                  background: "var(--color-primary-50)",
                  border: "1px solid var(--color-primary-100)",
                }}
              >
                <p
                  className="text-sm sm:text-base md:text-lg font-semibold leading-snug"
                  style={{ color: "#165197" }}
                >
                  Stains within tooth structure. Require chemical bleaching —
                  tetracycline cases may need 3–4 months of nightly treatment.
                </p>
              </div>

              {/* C. Expandable Clinical Explanation */}
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  intrinsicExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed mb-4 mt-2">
                    {intrinsic.treatment || ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIntrinsicExpanded(!intrinsicExpanded)}
                className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-primary-600)" }}
              >
                {intrinsicExpanded ? "Show less" : "Clinical explanation"}
                <span
                  className={cn(
                    "transition-transform duration-300",
                    intrinsicExpanded && "rotate-180",
                  )}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </PerformanceAnimation>
        </div>

        {/* Diagnostic CTA callout */}
        {d.callout && (
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.2}
            className="rounded-2xl px-6 py-5 flex items-center gap-4 mb-5"
            style={{
              background: "linear-gradient(135deg, #165197 0%, #1e6abf 100%)",
            }}
          >
            <HelpCircle className="w-6 h-6 shrink-0 text-sky-300 flex-shrink-0" />
            <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-white">
              {d.callout}
            </p>
          </PerformanceAnimation>
        )}

        {/* Critical Limitation Block — full-width highlight warning */}
        {d.limitation && (
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.3}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--color-warning-50)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderLeft: "4px solid var(--color-warning-500)",
            }}
          >
            <div className="px-6 py-5 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,158,11,0.12)" }}
                >
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: "var(--color-warning-600)" }}
                  />
                </div>
                <h3
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: "#92400E" }}
                >
                  Important: Whitening Only Affects Natural Teeth
                </h3>
              </div>
              <div>
                <p
                  className="text-sm sm:text-base md:text-lg leading-relaxed"
                  style={{ color: "var(--color-foreground-secondary)" }}
                >
                  {d.limitation}
                </p>
              </div>
            </div>
          </PerformanceAnimation>
        )}
      </div>
    </section>
  );
}
