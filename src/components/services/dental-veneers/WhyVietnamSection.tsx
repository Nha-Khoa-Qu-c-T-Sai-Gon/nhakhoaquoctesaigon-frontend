"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface PillarItem {
  icon?: any;
  title?: string;
  desc?: string;
}

interface DoctorItem {
  avatar?: string;
  name?: string;
  role?: string;
  years?: string;
}

interface WhyVietnamSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    pillars?: PillarItem[];
    doctors?: DoctorItem[];
    image?: string;
  };
}

const PillarCard = ({ p }: { p: PillarItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isMoreThanThreeLines =
          textRef.current.scrollHeight > textRef.current.clientHeight + 2;
        setShowButton(isMoreThanThreeLines);
      }
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    if (textRef.current) observer.observe(textRef.current);

    window.addEventListener("resize", checkOverflow);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [p?.desc]);

  return (
    <div className="flex flex-col gap-3 bg-sky-50/60 rounded-2xl p-5 border border-sky-100 h-fit hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      {/* Row 1: Icon + Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#165197]/10 flex items-center justify-center shrink-0">
          {renderServiceIcon(
            p?.icon,
            "w-5 h-5 text-primary-600",
            p?.title || "",
            p?.desc || "",
          )}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#165197] leading-tight">
          {p?.title || ""}
        </h3>
      </div>
      {/* Row 2: Content */}
      <div className="flex-1 min-w-0">
        <p
          ref={textRef}
          className={cn(
            "text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed transition-all duration-300",
            !isExpanded && "line-clamp-3",
          )}
        >
          {p?.desc || ""}
        </p>
        {(showButton || isExpanded) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 font-bold text-sm mt-2 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
          >
            {isExpanded ? "Read Less" : "Read More"}
            <ArrowRight
              className={cn(
                "w-3 h-3 transition-transform",
                isExpanded ? "-rotate-90" : "rotate-0",
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export function WhyVietnamSection({ data }: WhyVietnamSectionProps) {
  const d = data || {};
  return (
    <section id="why-us" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          subtitle={d.subtitle || ""}
          subtitleClassName="text-primary-600"
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-4">
            {(d.pillars || []).map((p: any, i: number) => (
              <PerformanceAnimation
                key={i}
                preset="slide-up-subtle"
                whileInView={true}
                delay={i * 0.08}
              >
                <PillarCard p={p} />
              </PerformanceAnimation>
            ))}
          </div>
          <div className="space-y-6">
            <PerformanceAnimation
              preset="slide-right"
              whileInView={true}
              delay={0.2}
              className="relative rounded-3xl overflow-hidden shadow-xl aspect-video"
            >
              <Image
                src={
                  d.image ||
                  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                }
                alt="Clinic Interior"
                fill
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 50vw"
              />
            </PerformanceAnimation>
            <div className="grid grid-cols-1 gap-4">
              {(d.doctors || []).map((doc: any, i: number) => (
                <PerformanceAnimation
                  key={i}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={i * 0.1}
                >
                  <div className="bg-white rounded-2xl p-5 border border-primary-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xl border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shrink-0 overflow-hidden relative">
                      {doc?.avatar ? (
                        <Image
                          src={doc.avatar}
                          alt={doc.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        (doc?.name || "").split(" ").pop()?.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg font-bold text-[#165197]">
                        {doc?.name || ""}
                      </p>
                      <p className="text-xs sm:text-sm text-foreground-secondary mt-0.5">
                        {doc?.role || ""}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide uppercase">
                        {doc?.years || ""}
                      </p>
                    </div>
                  </div>
                </PerformanceAnimation>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
