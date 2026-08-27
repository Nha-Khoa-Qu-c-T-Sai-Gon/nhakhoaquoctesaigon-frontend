"use client";

import React from "react";
import Image from "next/image";
import { Clock, Target, CheckCircle2 } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface WhatAreBracesSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    snippet?: string;
    body?: string;
    image?: string;
  };
}

export function WhatAreBracesSection({ data }: WhatAreBracesSectionProps) {
  const defaultImage =
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200";

  return (
    <section
      id="benefits"
      className="py-20 lg:py-28 bg-gradient-to-b from-blue-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT: Content */}
          <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
            <AnimatedSectionHeader
              badge={data?.badge || ""}
              title={data?.h2 || ""}
              align="left"
              className="mb-4 sm:mb-6 md:mb-8 text-center lg:text-left items-center lg:items-start"
            />

            {/* Featured Explanation Card */}
            <PerformanceAnimation preset="slide-up-subtle" whileInView={true}>
              <div className="bg-gradient-to-br from-blue-50 to-white border-l-4 lg:border-l-4 border-blue-600 rounded-2xl shadow-sm px-6 py-5 mb-8 text-center lg:text-left">
                <p className="text-lg sm:text-lg md:text-xl text-[#165197]/90 font-normal leading-relaxed">
                  {data?.snippet || data?.body || ""}
                </p>
              </div>
            </PerformanceAnimation>

            {/* Structured Content Block */}
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.1}
              className="space-y-6 mb-10 text-[#165197]/80 text-lg sm:text-lg md:text-xl font-normal leading-relaxed text-center lg:text-left"
            >
              <div>
                <h3 className="text-[#165197] font-bold mb-2">
                  Orthodontic Care
                </h3>
                <p>
                  {data?.body ||
                    "At SG International Dental, we prioritize custom orthodontic care using digital mapping and advanced techniques."}
                </p>
              </div>
            </PerformanceAnimation>

            {/* Data / Fact Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full justify-center lg:justify-start">
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.2}
                className="flex-1 h-full"
              >
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm transition-all flex flex-col sm:flex-col gap-3 hover:translate-y-[-2px] hover:shadow-lg duration-300 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[10px] sm:text-xs text-[#165197]/70 font-bold uppercase tracking-wider mb-0.5">
                        Duration
                      </div>
                      <div className="font-bold text-[#165197] text-base sm:text-lg leading-none">
                        12–36
                        <span className="text-sm text-[#165197]/70 font-medium ml-1">
                          months
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PerformanceAnimation>

              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                delay={0.3}
                className="flex-1 h-full"
              >
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm transition-all flex flex-col sm:flex-col gap-3 hover:translate-y-[-2px] hover:shadow-lg duration-300 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[10px] sm:text-xs text-[#165197]/70 font-bold uppercase tracking-wider mb-0.5">
                        Starting Age
                      </div>
                      <div className="font-bold text-[#165197] text-base sm:text-lg leading-none">
                        9–14
                        <span className="text-sm text-[#165197]/70 font-medium ml-1">
                          years old
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PerformanceAnimation>
            </div>

            {/* Source / Authority Line */}
            <PerformanceAnimation
              preset="slide-up-subtle"
              whileInView={true}
              delay={0.4}
              className="text-xs text-[#165197]/60"
            >
              Source: American Dental Association (MouthHealthy), Cleveland Clinic
            </PerformanceAnimation>
          </div>

          {/* RIGHT: Visual Story */}
          <PerformanceAnimation
            preset="slide-up"
            whileInView={true}
            duration={0.8}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-100 w-full h-[350px] sm:h-[450px] lg:h-[600px]">
                <Image
                  src={data?.image || defaultImage}
                  alt={data?.h2 || ""}
                  fill
                  className="object-cover"
                  sizes="(max-w-1024px) 100vw, 50vw"
                />
              </div>

              {/* Floating Context Card */}
              <div className="hidden sm:block absolute bottom-6 left-6 right-6 lg:left-[-20px] lg:right-auto bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-slate-100 max-w-[280px] animate-kf-float">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-sm text-[#165197]">
                    Treatment Process
                  </h4>
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-[#165197]/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />{" "}
                    Clinical Examination
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />{" "}
                    Digital X-Rays & Scans
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />{" "}
                    Orthodontic Analysis
                  </li>
                </ul>
              </div>
            </div>

            {/* Decorative background element behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-400/10 blur-[80px] rounded-full z-[-1]" />
          </PerformanceAnimation>
        </div>
      </div>
    </section>
  );
}
