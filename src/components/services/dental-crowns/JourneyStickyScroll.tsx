"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, Shield, ChevronDown, ArrowRight } from "lucide-react";
import {
  useScroll,
  useMotionValueEvent,
  motion,
  AnimatePresence,
} from "framer-motion";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

const MotionDiv = motion.div;

interface JourneyStep {
  title?: string;
  duration?: string;
  description?: string;
  image?: string;
}

interface JourneyHeader {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const JourneyStickyScroll = ({
  steps,
  journeyHeader,
}: {
  steps?: JourneyStep[];
  journeyHeader?: JourneyHeader;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const crownProcess = steps || [];
  const activeHeader = journeyHeader || {
    badge: "Procedure",
    title: "The Dental Crown Procedure: Step by Step",
    subtitle: "How many appointments does a dental crown take?",
  };
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(
      Math.floor(latest * (crownProcess.length || 1)),
      Math.max(0, crownProcess.length - 1),
    );
    if (step !== activeStep) {
      setActiveStep(step);
      setIsDescriptionExpanded(false);
    }
  });

  const currentStepData = crownProcess[activeStep] || {
    image: "",
    title: "",
    duration: "",
    description: "",
  };

  return (
    <section className="bg-[#0b101a] relative">
      {/* Desktop Immersive Scroll */}
      <div ref={containerRef} className="hidden xl:block relative h-[400vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col pt-24 md:pt-32 items-center justify-start overflow-hidden">
          {/* Background Engine */}
          <AnimatePresence>
            <MotionDiv
              key={`bg-${activeStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={currentStepData.image || ""}
                alt={currentStepData.title || ""}
                fill
                className="object-cover"
                priority
              />
            </MotionDiv>
          </AnimatePresence>

          {/* Cinematic Overlay - Critical for white text contrast */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0 pointer-events-none" />

          {/* Top Content */}
          <div className="relative text-center z-10 px-6 w-full shrink-0">
            <AnimatedSectionHeader
              title={
                activeHeader.title || "The Dental Crown Procedure: Step by Step"
              }
              subtitle={
                activeHeader.subtitle ||
                "How many appointments does a dental crown take?"
              }
              titleClassName="text-white drop-shadow-md"
              subtitleClassName="text-white/90 drop-shadow-sm mx-auto"
              className="mb-8 sm:mb-10 md:mb-12"
            />
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto font-medium drop-shadow-sm leading-relaxed">
              A dental crown typically requires two appointments spread over 1–2
              weeks when made at an external laboratory, or can be completed in
              a single visit when the clinic uses in-house CAD/CAM milling
              technology. The first appointment prepares and scans the tooth;
              the second delivers the final crown.
            </p>
          </div>

          {/* Central Process Map Hub - Centered Version */}
          <div className="relative z-10 w-full flex justify-center mt-8 lg:mt-16 shrink-0">
            <div className="w-full max-w-5xl mx-auto px-4 flex items-start justify-between">
              {crownProcess.map((step, idx: number) => {
                const isActive = idx === activeStep;

                return (
                  <React.Fragment key={idx}>
                    {/* Node Box */}
                    <div className="flex flex-col items-center text-center w-[160px] shrink-0 relative z-10">
                      {/* Floating Micro-Animations around active node */}
                      {isActive && (
                        <>
                          <MotionDiv
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute -top-5 -left-1 text-white opacity-40"
                          >
                            <Sparkles size={16} />
                          </MotionDiv>
                          <MotionDiv
                            animate={{ y: [0, -6, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                              delay: 1,
                            }}
                            className="absolute top-8 -right-1 text-white opacity-40"
                          >
                            <Shield size={14} />
                          </MotionDiv>
                        </>
                      )}

                      {/* Step Circle */}
                      <MotionDiv
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 z-10
                                                    ${
                                                      isActive
                                                        ? "bg-primary border border-transparent text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                                        : "bg-transparent border border-white/40 text-white/70"
                                                    }`}
                      >
                        {idx + 1}
                      </MotionDiv>

                      {/* Inline Details */}
                      <div className="mt-5">
                        <div
                          className={`transition-colors duration-300 leading-tight ${isActive ? "text-white font-bold" : "text-white/60 font-medium"}`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs sm:text-sm md:text-base text-[10px] uppercase tracking-widest mt-1.5 opacity-60 font-bold text-white">
                          {step.duration}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <MotionDiv
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px] max-w-[90vw]"
                          >
                            <div className="mt-4 px-4 pt-5 pb-3 bg-[#111827]/60 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl relative z-20 flex flex-col items-center">
                              <div
                                className={`text-sm text-white/90 leading-relaxed text-center ${isDescriptionExpanded ? "" : "line-clamp-4"}`}
                              >
                                {step.description}
                              </div>
                              {/* Show More Arrow Toggle */}
                              <button
                                onClick={() =>
                                  setIsDescriptionExpanded(
                                    !isDescriptionExpanded,
                                  )
                                }
                                className="mt-1 flex items-center justify-center p-1 text-white/50 hover:text-white/90 hover:bg-white/10 rounded-full transition-all"
                                title={
                                  isDescriptionExpanded
                                    ? "Show less"
                                    : "Show more"
                                }
                              >
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform duration-300 ${isDescriptionExpanded ? "rotate-180" : ""}`}
                                />
                              </button>
                            </div>
                          </MotionDiv>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Connecting Arrow */}
                    {idx < crownProcess.length - 1 && (
                      <div className="shrink-0 flex items-center justify-center h-12">
                        <MotionDiv
                          animate={{ x: isActive ? [0, 8, 0] : 0 }}
                          transition={{
                            repeat: isActive ? Infinity : 0,
                            duration: 1.2,
                          }}
                          className={`text-sm transition-colors duration-300 ${isActive ? "text-white/80 drop-shadow-md" : "text-white/30"}`}
                        >
                          <ArrowRight size={20} />
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

      {/* Mobile / Tablet Viewport Stacked Vertical Navigation */}
      <div className="xl:hidden relative bg-[#0b101a] py-24 px-4 sm:px-8">
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <AnimatedSectionHeader
            title={
              activeHeader.title || "The Dental Crown Procedure: Step by Step"
            }
            subtitle={
              activeHeader.subtitle ||
              "How many appointments does a dental crown take?"
            }
            titleClassName="text-white uppercase"
            subtitleClassName="text-white/90"
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-2">
              A dental crown typically requires two appointments spread over 1–2
              weeks when made at an external laboratory, or can be completed in
              a single visit when the clinic uses in-house CAD/CAM milling
              technology. The first appointment prepares and scans the tooth;
              the second delivers the final crown.
            </p>
          </AnimatedSectionHeader>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical Connecting Line (Background) - Center is exactly 24px (half of 48px circle) */}
          <div className="absolute top-0 bottom-0 left-[23px] w-[2px] bg-white/10" />

          {crownProcess.map((step, idx: number) => (
            <div
              key={idx}
              className="relative flex items-start gap-4 sm:gap-6 mb-10 sm:mb-14 last:mb-0"
            >
              {/* Step Node */}
              <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-[#111827] border border-white/20 text-white flex items-center justify-center font-bold shadow-lg">
                {idx + 1}
              </div>

              {/* Content Block */}
              <div className="pt-2 sm:pt-1 bg-[#111827]/40 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/5 w-full shadow-lg">
                <div className="text-xs sm:text-sm md:text-base text-[10px] sm:text-primary-400 font-bold uppercase tracking-widest mb-1 sm:mb-2">
                  {step.duration}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
