"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Zap } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface ProcessStep {
  num?: string;
  title?: string;
  desc?: string;
  image?: string;
}

interface ProcessSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    steps?: ProcessStep[];
  };
}

export function ProcessSection({ data }: ProcessSectionProps) {
  const d = data || {};
  const steps = d.steps || [];
  const [activeStep, setActiveStep] = useState(0);

  // Swipe state
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const endX = e.changedTouches[0]
      ? e.changedTouches[0].clientX
      : touchEnd.current || touchStart.current;
    const distance = touchStart.current - endX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
    if (isRightSwipe && activeStep > 0) {
      setActiveStep(activeStep - 1);
    }

    // Reset
    touchStart.current = null;
    touchEnd.current = null;
  };

  return (
    <section
      id="process"
      className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden"
    >
      {/* 24H Speed Badge */}
      <PerformanceAnimation
        preset="slide-up-subtle"
        whileInView={true}
        className="hidden sm:flex absolute top-10 right-4 md:right-12 lg:right-24 bg-gradient-to-r from-primary-600 to-sky-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-primary-500/30 border border-white/20 z-20 items-center gap-2"
      >
        <Zap className="w-4 h-4 text-yellow-300" />
        Completed in 24 Hours
      </PerformanceAnimation>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          subtitle={d.subtitle || ""}
          subtitleClassName="text-primary-600"
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* Desktop Interactive Layout */}
        <div className="hidden lg:block mt-16 max-w-6xl mx-auto">
          {/* Top Navigation Nodes */}
          <div className="relative flex justify-between mb-24 px-8">
            {/* Background Base Line — spans between first and last node centers */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 rounded-full" />

            {/* Animated Progress Line — grows from first node to active node */}
            <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 overflow-hidden rounded-full pointer-events-none">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    (activeStep / (steps.length > 1 ? steps.length - 1 : 1)) * 100
                  }%`,
                }}
              />
            </div>

            {steps.map((step: any, i: number) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;
              return (
                <div
                  key={i}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                  onClick={() => setActiveStep(i)}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-sm transition-all duration-300 relative",
                      isActive || isPast
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "bg-white border-slate-200 text-slate-500",
                      isActive && "scale-110",
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-20" />
                    )}
                    <span className="relative z-10">{step.num || ""}</span>
                  </div>
                  <div
                    className={cn(
                      "absolute top-16 text-center w-40 text-sm font-bold transition-colors duration-300",
                      isActive
                        ? "text-primary-600"
                        : "text-slate-400 group-hover:text-primary-400",
                    )}
                  >
                    {step.title || ""}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Content Display */}
          <div className="bg-white rounded-3xl p-10 border border-white/50 shadow-xl flex gap-12 items-center min-h-[400px]">
            {/* Left Text */}
            <div className="flex-1 max-w-md">
              {steps[activeStep] && (
                <div
                  key={activeStep}
                  className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both"
                >
                  <div className="text-primary-600 font-bold text-6xl mb-4 opacity-20">
                    {steps[activeStep].num || ""}
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    {steps[activeStep].title || ""}
                  </h3>
                  <p className="text-lg text-foreground-secondary leading-relaxed">
                    {steps[activeStep].desc || ""}
                  </p>
                </div>
              )}
            </div>
            {/* Right Image */}
            <div className="flex-1 h-[360px] rounded-2xl overflow-hidden shadow-lg relative">
              {steps[activeStep] && (
                <div
                  key={activeStep}
                  className="absolute inset-0 w-full h-full animate-in fade-in duration-500 fill-mode-both"
                >
                  <Image
                    src={steps[activeStep].image || ""}
                    alt={steps[activeStep].title || ""}
                    fill
                    className="object-cover"
                    sizes="(max-w-1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Carousel Layout */}
        <div className="lg:hidden mt-8 relative">
          <div
            className="rounded-3xl p-5 sm:p-8 overflow-hidden relative bg-white touch-pan-y select-none"
            style={{
              border: "1px solid rgba(22,81,151,0.10)",
              boxShadow:
                "0 4px 6px -1px rgba(22,81,151,0.04), 0 20px 60px -10px rgba(22,81,151,0.10), 0 0 0 1px rgba(255,255,255,0.8) inset",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Subtle inner light orb */}
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%)",
              }}
            />

            {steps[activeStep] && (
              <div
                key={activeStep}
                className="flex flex-col relative z-10 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="flex flex-col gap-3 mb-6">
                  {/* Row 1: Icon + Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg shadow-highlight shrink-0">
                      {steps[activeStep].num || ""}
                    </div>
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      {steps[activeStep].title || ""}
                    </h3>
                  </div>
                  {/* Row 2: Image and Description */}
                  <div className="relative w-full h-44 sm:h-64 rounded-xl overflow-hidden mt-2 border border-slate-100 shadow-sm">
                    <Image
                      src={steps[activeStep].image || ""}
                      alt={steps[activeStep].title || ""}
                      fill
                      className="object-cover"
                      sizes="(max-w-768px) 100vw, 50vw"
                    />
                  </div>
                  <p className="text-base sm:text-lg text-foreground-secondary leading-relaxed mt-2">
                    {steps[activeStep].desc || ""}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  idx === activeStep ? "w-8 bg-[#165197]" : "w-2.5 bg-slate-200",
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
