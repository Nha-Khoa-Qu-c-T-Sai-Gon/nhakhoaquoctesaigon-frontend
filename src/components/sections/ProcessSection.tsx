"use client";

import React, { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { SafeImage } from "@/src/components/ui/SafeImage";

/**
 * Represents a single stage or step in the treatment journey.
 */
interface ProcessStep {
  /** The headline title of the step */
  title?: string;
  /** Duration or step sequence string (e.g. "1-2 Weeks", "Appointment 1") */
  duration?: string;
  /** Detailed description of what happens during this step */
  description?: string;
  /** URL path to the illustration/image representing this step */
  image?: string;
  /** Alternative step sequence identifier from CMS */
  num?: string;
}

/**
 * Props for the common ProcessSection component.
 * Supports passing data wrapped in a single `data` object, or as raw parameters.
 */
interface ProcessSectionProps {
  /** Unified CMS data object */
  data?: {
    /** Main section heading (h2) */
    h2?: string;
    /** Alternative title parameter */
    title?: string;
    /** Section subtitle */
    subtitle?: string;
    /** Small badge text displayed at the top */
    badge?: string;
    /** Collection of step nodes */
    steps?: ProcessStep[];
  };
  /** Collection of step nodes (fallback/raw prop) */
  steps?: ProcessStep[];
  /** Journey header configuration (fallback/raw prop) */
  journeyHeader?: {
    /** Small badge text displayed at the top */
    badge?: string;
    /** Main section heading */
    title?: string;
    /** Section subtitle */
    subtitle?: string;
  };
}

/**
 * ProcessSection Component
 *
 * Renders an immersive, scroll-driven interactive step-by-step progress timeline.
 * - **Desktop**: Renders as a 400vh tall container where the background image changes
 *   smoothly as the user scrolls. Nodes are clickable to jump between steps instantly.
 * - **Mobile**: Renders as a clean, stacked vertical timeline list with overlay illustrations.
 *
 * @param props - ProcessSectionProps configuration
 * @returns React Component element
 */
export const ProcessSection = ({ data, steps: stepsProp, journeyHeader }: ProcessSectionProps) => {
  // Normalize variables to support both unified CMS structures (e.g. dental-braces) and discrete properties (e.g. dental-crowns)
  const steps = data?.steps || stepsProp || [];
  const title = data?.h2 || data?.title || journeyHeader?.title || "";
  const subtitle = data?.subtitle || journeyHeader?.subtitle || "";
  const badge = data?.badge || journeyHeader?.badge || "";

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Monitor the scroll progress across the container ref (which stretches to 400vh on desktop)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate the currently active step index dynamically based on the scroll progress ratio
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(
      Math.floor(latest * (steps.length || 1)),
      Math.max(0, steps.length - 1),
    );
    if (step !== activeStep) {
      setActiveStep(step);
      setExpanded(false);
    }
  });

  const currentStep = steps[activeStep] || {
    title: "",
    duration: "",
    description: "",
    image: "",
  };

  return (
    <section id="process" className="relative">
      {/* ── DESKTOP xl+: 400vh sticky scroll ── */}
      <div ref={containerRef} className="hidden xl:block relative h-[400vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col pt-24 md:pt-32 items-center justify-start overflow-hidden bg-[#0b101a]">
          {/* Background image engine */}
          <AnimatePresence>
            <MotionDiv
              key={`bg-${activeStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <SafeImage
                src={currentStep?.image}
                alt={currentStep?.title || ""}
                fill
                className="w-full h-full"
                imageClassName="object-cover"
                sizes="100vw"
                priority
              />
            </MotionDiv>
          </AnimatePresence>
          {/* Cinematic Overlay - Critical for white text contrast */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0 pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto px-8 w-full flex flex-col gap-12 shrink-0">
            {/* Header */}
            <div className="text-center">
              <AnimatedSectionHeader
                badge={badge}
                title={title}
                subtitle={subtitle}
                titleClassName="text-white drop-shadow-md"
                subtitleClassName="text-white/90 drop-shadow-sm mx-auto font-normal"
                className="mb-8 sm:mb-10 md:mb-12"
                fullWidthSubtitle={true}
              />
            </div>

            {/* Process nodes */}
            <div className="flex items-start justify-between w-full">
              {steps.map((step, idx: number) => {
                const isActive = idx === activeStep;
                return (
                  <React.Fragment key={idx}>
                    {/* Node box with click interactions to jump between steps */}
                    <div
                      className="flex flex-col items-center text-center w-[170px] shrink-0 relative z-10 cursor-pointer"
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
                          const progress = (idx + 0.5) / (steps.length || 1);
                          const scrollPos = containerTop + progress * scrollRange;
                          
                          window.scrollTo({
                            top: scrollPos,
                            behavior: "smooth",
                          });
                        }
                        setActiveStep(idx);
                        setExpanded(false);
                      }}
                    >
                      {isActive && (
                        <MotionDiv
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                          className="absolute -top-5 text-white opacity-60"
                        >
                          <Sparkles size={14} />
                        </MotionDiv>
                      )}
                      <MotionDiv
                        animate={{ scale: isActive ? 1.15 : 1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 transition-colors duration-300 ${
                          isActive
                            ? "bg-sky-500 text-white shadow-[0_0_24px_rgba(56,189,248,0.5)] border border-transparent"
                            : "bg-transparent border border-white/40 text-white/70"
                        }`}
                      >
                        {idx + 1}
                      </MotionDiv>
                      <div className="mt-4">
                        <div
                          className={`text-sm md:text-base leading-tight transition-colors duration-300 ${isActive ? "text-white font-bold" : "text-white/60 font-medium"}`}
                        >
                          {step?.title || ""}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest mt-1.5 text-white opacity-60 font-bold">
                          {step?.duration || step?.num || ""}
                        </div>
                      </div>
                      <AnimatePresence>
                        {isActive && (
                          <MotionDiv
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px] max-w-[90vw] mt-3"
                          >
                            <div className="px-4 pt-4 pb-3 bg-[#111827]/60 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl">
                              <div
                                className={`text-sm sm:text-base text-white/90 leading-relaxed text-center ${expanded ? "" : "line-clamp-4"}`}
                              >
                                {step?.description || ""}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpanded(!expanded);
                                }}
                                className="mt-2 flex items-center justify-center w-full p-1 text-white/50 hover:text-white/90 hover:bg-white/10 rounded-full transition-all"
                              >
                                <ChevronDown
                                  size={12}
                                  className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                                />
                              </button>
                            </div>
                          </MotionDiv>
                        )}
                      </AnimatePresence>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="shrink-0 flex items-center justify-center h-12 mt-1">
                        <MotionDiv
                          animate={{ x: isActive ? [0, 8, 0] : 0 }}
                          transition={{
                            repeat: isActive ? Infinity : 0,
                            duration: 1.2,
                          }}
                          className={`transition-colors duration-300 ${isActive ? "text-white/80 drop-shadow-md" : "text-white/30"}`}
                        >
                          <ArrowRight size={18} />
                        </MotionDiv>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET: vertical stacked ── */}
      <div className="xl:hidden relative bg-[#0b1f3a] py-16 px-4 sm:px-8">
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <AnimatedSectionHeader
            badge={badge}
            title={title}
            subtitle={subtitle}
            titleClassName="text-white"
            subtitleClassName="text-white/80 font-normal"
            className="mb-8 sm:mb-10 md:mb-12"
          />
        </div>
        <div className="relative max-w-2xl mx-auto space-y-16">
          {steps.map((step, idx: number) => (
            <div key={idx} className="relative">
              {/* Image for mobile step */}
              <SafeImage
                src={step.image}
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
                <div>
                  {(step?.duration || step?.num) && (
                    <div className="text-xs sm:text-sm md:text-base text-sky-400 font-bold uppercase tracking-widest mb-1">
                      {step.duration || step.num}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {step.title}
                  </h3>
                </div>
              </div>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
