"use client";

import React, { useState, useRef } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion, AnimatePresence } from "framer-motion";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { SafeImage } from "@/src/components/ui/SafeImage";

interface ProcedureStep {
  title: string;
  description: string;
  image?: string;
}

interface ProcedureSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    steps?: ProcedureStep[];
  };
}

export function ProcedureSection({ data }: ProcedureSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const steps = data?.steps || [];
  const [activeStep, setActiveStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(
      Math.floor(latest * (steps.length || 1)),
      Math.max(0, steps.length - 1),
    );
    if (step !== activeStep) setActiveStep(step);
  });

  const currentStep = steps[activeStep] || {
    title: "",
    description: "",
    desc: "",
    image: "",
  };

  const currentImage = currentStep.image || "";

  return (
    <section id="process" className="relative">
      {/* ── DESKTOP: 400vh sticky scroll ── */}
      <div
        ref={containerRef}
        className="hidden lg:block relative h-[400vh] bg-[#0b1f3a]"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">
          {/* Immediate Background Image */}
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={currentImage}
              fill
              className="w-full h-full"
              imageClassName="object-cover opacity-[0.35]"
              alt="Procedure Background"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f3a] via-transparent to-[#0b1f3a]" />
          </div>

          <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4">
            <AnimatedSectionHeader
              badge={data?.badge || ""}
              title={data?.h2 || ""}
              subtitle={data?.subtitle || ""}
              titleClassName="text-white"
              subtitleClassName="text-white/80"
              className="mb-8 sm:mb-10 md:mb-12"
              align="center"
            />

            <div className="w-full max-w-6xl">
              {/* Progress Bar */}
              <div className="relative h-1 bg-white/10 rounded-full mb-12 sm:mb-16 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-sky-400 shadow-[0_0_10px_#38bdf8]"
                  style={{
                    width: useTransform(
                      scrollYProgress,
                      [0, 1],
                      ["0%", "100%"],
                    ),
                  }}
                />
              </div>

              {/* Step Details */}
              <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
                <AnimatePresence mode="wait">
                  <MotionDiv
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center lg:text-left space-y-6"
                  >
                    <div className="lg:hidden text-sky-400 font-bold text-sm sm:text-base tracking-[0.2em] uppercase">
                      {activeStep + 1} / {steps.length}
                    </div>
                    <h3 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-white leading-[1.15] tracking-tight">
                      {currentStep.title}
                    </h3>
                    <p className="text-lg sm:text-lg md:text-xl text-white/70 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                      {currentStep.description || (currentStep as any).desc}
                    </p>
                  </MotionDiv>
                </AnimatePresence>

                {/* Sidebar list hidden on mobile to avoid overlap, shown on LG+ */}
                <div className="hidden lg:flex flex-col gap-4">
                  {steps.map((s: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        const target = containerRef.current;
                        if (target) {
                          // Get absolute, parent-agnostic top position of the container relative to the document.
                          // Do not use offsetTop as it is relative to the nearest offsetParent (which can cause scrolling to the top of the page).
                          const rect = target.getBoundingClientRect();
                          const containerTop = rect.top + window.scrollY;
                          
                          const containerHeight = target.offsetHeight;
                          const viewportHeight = window.innerHeight;
                          const scrollRange = containerHeight - viewportHeight;
                          
                          // Calculate the midpoint scroll position of the step to ensure user scrolling in either direction transitions correctly.
                          const progress = (i + 0.5) / (steps.length || 1);
                          const scrollPos = containerTop + progress * scrollRange;
                          
                          window.scrollTo({
                            top: scrollPos,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                        activeStep === i
                          ? "bg-white/10 border-white/20"
                          : "opacity-40 hover:opacity-100 hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center font-bold text-base sm:text-lg md:text-xl lg:text-2xl shrink-0 ${
                          activeStep === i ? "text-sky-400" : "text-white/40"
                        }`}
                      >
                        0{i + 1}
                      </div>
                      <span
                        className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wide transition-colors ${
                          activeStep === i ? "text-white" : "text-white/40"
                        }`}
                      >
                        {s.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: vertical stacked ── */}
      <div className="lg:hidden relative bg-[#0b1f3a] py-20 px-4 sm:px-8">
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <AnimatedSectionHeader
            badge={data?.badge || ""}
            title={data?.h2 || ""}
            subtitle={data?.subtitle || ""}
            titleClassName="text-white"
            subtitleClassName="text-white/80"
            className="mb-12"
          />
        </div>
        <div className="relative max-w-2xl mx-auto space-y-16">
          {steps.map((step: any, idx: number) => {
            const stepImg = step.image || "";
            return (
              <div key={idx} className="relative">
                {/* Image for mobile step */}
                <SafeImage
                  src={stepImg}
                  alt={step.title || ""}
                  fill
                  className="mb-8 aspect-video shadow-2xl border border-white/10 w-full h-[200px] sm:h-[300px] rounded-3xl"
                  imageClassName="object-cover"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
                <div className="flex items-center gap-4 mb-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                    {idx + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                  {step.description || step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
