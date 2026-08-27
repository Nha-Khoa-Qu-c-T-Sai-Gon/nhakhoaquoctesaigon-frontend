"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { BLEACHING_RESULTS_FALLBACK } from "@/src/lib/constants/services-fallbacks";
import { BookingButton } from "@/src/components/ui/BookingButton";

interface ResultsSectionProps {
  data: {
    badge?: string;
    title?: string;
    cases?: Array<{
      before?: string;
      after?: string;
    }>;
    disclaimer?: string;
    timeline?: Array<{
      label?: string;
      weeks?: string;
      pct?: number;
    }>;
  };
}

export const ResultsSection = ({ data }: ResultsSectionProps) => {
  const d = data;
  const [sliderPos, setSliderPos] = useState(50);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(
      5,
      Math.min(95, ((clientX - rect.left) / rect.width) * 100),
    );
    setSliderPos(pct);
  };

  const cases =
    d.cases && d.cases.length > 0 ? d.cases : BLEACHING_RESULTS_FALLBACK;
  const currentCase = cases[currentCaseIndex] || BLEACHING_RESULTS_FALLBACK[0];
  const timeline = d.timeline || [];

  return (
    <section
      id="results"
      className="py-20 lg:py-28 bg-gradient-to-b from-sky-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d.badge}
          title={d.title}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* ── Block 1: Hero 2-col ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* LEFT: Before/After Slider */}
          <PerformanceAnimation preset="slide-left" whileInView={true}>
            <div className="flex flex-col gap-4">
              <div
                ref={sliderRef}
                className="relative rounded-3xl overflow-hidden aspect-[4/3] cursor-col-resize select-none shadow-xl border border-slate-100"
                onMouseMove={(e) => handleMove(e.clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              >
                <Image
                  src={currentCase.after || BLEACHING_RESULTS_FALLBACK[0].after}
                  alt="After bleaching"
                  fill
                  className="object-cover"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ width: `${100 / Math.max(sliderPos / 100, 0.01)}%` }}
                  >
                    <Image
                      src={
                        currentCase.before || BLEACHING_RESULTS_FALLBACK[0].before
                      }
                      alt="Before bleaching"
                      fill
                      className="object-cover"
                      sizes="(max-w-768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div
                  className="absolute top-0 bottom-0 flex items-center"
                  style={{
                    left: `${sliderPos}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="w-0.5 h-full bg-white/80" />
                  <div className="absolute w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center pointer-events-none">
                    <ArrowRight className="w-3 h-3 text-[#165197]" />
                  </div>
                </div>
                <div
                  className="text-xs sm:text-sm absolute top-4 left-4 font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(0,0,0,0.55)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  BEFORE
                </div>
                <div
                  className="text-xs sm:text-sm absolute top-4 right-4 font-bold px-3 py-1.5 rounded-full text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #165197 0%, #1e6abf 100%)",
                    boxShadow: "0 0 16px rgba(30,106,191,0.45)",
                  }}
                >
                  AFTER ✨
                </div>
              </div>

              {/* Navigation Pills & Arrow controls */}
              {cases.length > 1 && (
                <div className="flex items-center justify-between gap-4 mt-2">
                  <button
                    onClick={() => {
                      setCurrentCaseIndex((prev) =>
                        prev > 0 ? prev - 1 : cases.length - 1,
                      );
                      setSliderPos(50);
                    }}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                    aria-label="Previous case"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="text-center flex-1">
                    <div className="flex gap-1.5 justify-center">
                      {cases.map((_, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentCaseIndex(idx);
                            setSliderPos(50);
                          }}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            currentCaseIndex === idx
                              ? "bg-[#165197] w-6"
                              : "bg-slate-300 hover:bg-slate-400",
                          )}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentCaseIndex((prev) =>
                        prev < cases.length - 1 ? prev + 1 : 0,
                      );
                      setSliderPos(50);
                    }}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                    aria-label="Next case"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p
              className="text-xs sm:text-sm mt-3 text-center italic"
              style={{ color: "var(--color-primary-300)" }}
            >
              {d.disclaimer}
            </p>
          </PerformanceAnimation>

          {/* RIGHT: 3 Outcome Cards */}
          <div className="flex flex-col gap-4">
            {[
              {
                icon: Zap,
                title: "How Fast Will You See Results?",
                points: [
                  "In-office: visible change after 1 session",
                  "At-home trays: improvement in 2–4 weeks",
                  "Combination: immediate + maintained",
                ],
              },
              {
                icon: Clock,
                title: "How Long Do Results Last?",
                points: [
                  "6 months to 2 years with proper care",
                  "Coffee, red wine, tobacco accelerate re-staining",
                  "Custom tray maintenance extends longevity significantly",
                ],
              },
              {
                icon: Sparkles,
                title: "How to Maintain Your Results",
                points: [
                  "Periodic at-home tray top-ups",
                  "Professional clean every 6 months",
                  "Limit pigmented foods 48 hrs post-treatment",
                ],
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.1}
                  className="rounded-2xl p-5 bg-white border border-primary-100 shadow-md hover:scale-[1.01] hover:shadow-[0_8px_28px_rgba(22,81,151,0.12)] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-primary-50)" }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: "var(--color-primary-500)" }}
                      />
                    </div>
                    <h3
                      className="text-lg sm:text-xl font-bold"
                      style={{ color: "#165197" }}
                    >
                      {card.title}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {card.points.map((pt, idx) => (
                      <li
                        key={idx}
                        className="text-sm sm:text-base md:text-lg flex items-start gap-2 leading-relaxed"
                        style={{ color: "var(--color-foreground-secondary)" }}
                      >
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: "var(--color-primary-600)" }}
                        />{" "}
                        {pt}
                      </li>
                    ))}
                  </ul>
                </PerformanceAnimation>
              );
            })}
          </div>
        </div>

        {/* ── Block 2: Shade Improvement Bars ── */}
        {timeline.length > 0 && (
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="rounded-2xl p-6 sm:p-8 bg-white mb-6"
            style={{
              border: "1px solid var(--color-primary-100)",
              boxShadow: "0 2px 16px rgba(22,81,151,0.06)",
            }}
          >
            <p
              className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest mb-5"
              style={{ color: "var(--color-primary-400)" }}
            >
              Shade Improvement Comparison
            </p>
            <div className="space-y-4">
              {timeline.map((row, i: number) => {
                const isHighlight =
                  row.label === "In-Office" || row.label === "Combination";
                return (
                  <div key={i}>
                    <div className="text-sm sm:text-base md:text-lg flex justify-between mb-1.5">
                      <span
                        className="font-bold"
                        style={{
                          color: isHighlight
                            ? "#165197"
                            : "var(--color-foreground-secondary)",
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--color-primary-600)" }}
                      >
                        {row.weeks}
                      </span>
                    </div>
                    <div
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{
                        background: "var(--color-primary-50)",
                        border: "1px solid var(--color-primary-100)",
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${row.pct}%`,
                          background: isHighlight
                            ? "linear-gradient(90deg, #165197 0%, #1e6abf 100%)"
                            : "linear-gradient(90deg, #93c5fd 0%, #60a5fa 100%)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </PerformanceAnimation>
        )}

        {/* ── Block 3: Critical Warning Panel ── */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FFF8F2 0%, #FFF3E0 100%)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderLeft: "4px solid #F59E0B",
          }}
        >
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.15)" }}
              >
                <AlertTriangle
                  className="w-6 h-6"
                  style={{ color: "#D97706" }}
                />
              </div>
              <div>
                <h3
                  className="text-lg sm:text-xl font-bold mb-0.5"
                  style={{ color: "#92400E" }}
                >
                  Bleaching Results Are NOT Permanent — And Overuse Can Be
                  Harmful
                </h3>
                <p
                  className="text-sm sm:text-base md:text-lg font-medium"
                  style={{ color: "#B45309" }}
                >
                  Important clinical information every patient should know
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: "Reality",
                  text: "Results vary by individual. Not all stains respond equally — shade gain is not fully predictable, and all results fade over time.",
                  highlight: false,
                },
                {
                  label: "Risk",
                  text: "Overuse or unsupervised bleaching can cause irreversible enamel damage, persistent sensitivity, gingival irritation, and restoration colour mismatch.",
                  highlight: false,
                },
                {
                  label: "Solution",
                  text: "Professional supervision is not optional — it is the single most important factor in achieving safe, effective, lasting results.",
                  highlight: true,
                },
              ].map((block, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{
                    background: block.highlight
                      ? "rgba(22,81,151,0.06)"
                      : "rgba(255,255,255,0.75)",
                    border: block.highlight
                      ? "1px solid rgba(22,81,151,0.15)"
                      : "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  <p
                    className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: block.highlight ? "#165197" : "#B45309" }}
                  >
                    {block.label}
                  </p>
                  <p
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
                    style={{
                      color: block.highlight
                        ? "#165197"
                        : "var(--color-foreground-secondary)",
                    }}
                  >
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden sm:block">
              <BookingButton label="Get a Safe, Personalized Plan" />
            </div>
          </div>
        </PerformanceAnimation>
      </div>
    </section>
  );
};
