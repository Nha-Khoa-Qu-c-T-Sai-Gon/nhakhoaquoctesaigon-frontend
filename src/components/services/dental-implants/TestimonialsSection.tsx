"use client";

import React from "react";
import Image from "next/image";
import { Star, Check } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface ReviewItem {
  photo?: string;
  avatar?: string;
  name?: string;
  flag?: string;
  country?: string;
  stars?: number;
  quote?: string;
}

interface TestimonialsSectionProps {
  data?: {
    h2?: string;
    reviews?: ReviewItem[];
  };
}

const FlagIcon = ({ code }: { code: string }) => {
  if (!code) return null;
  const Flag = (Flags as any)[code.toUpperCase()];
  if (!Flag) return <span className="text-xs text-slate-400">{code}</span>;
  return (
    <span className="inline-flex w-7 h-5 object-cover align-middle rounded-sm overflow-hidden flex-shrink-0">
      <Flag className="w-full h-full" />
    </span>
  );
};

const getCountryCode = (countryName: string) => {
  const c = (countryName || "").toLowerCase();
  if (
    c.includes("usa") ||
    c.includes("united states") ||
    c.includes("america")
  )
    return "US";
  if (c.includes("canada")) return "CA";
  if (c.includes("singapore")) return "SG";
  if (c.includes("australia")) return "AU";
  if (c.includes("united kingdom") || c.includes("uk")) return "GB";
  if (c.includes("vietnam")) return "VN";
  return "US"; // default fallback
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const reviews = data?.reviews || [];
  const defaultPhotos = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <section
      className="py-24 bg-slate-50 overflow-hidden relative"
      id="testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatedSectionHeader
          title={data?.h2 || ""}
          align="center"
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.1}
            >
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <Image
                    src={
                      r.avatar ||
                      r.photo ||
                      defaultPhotos[i] ||
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
                    }
                    alt={r.name || ""}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover border-2 border-sky-50"
                  />
                  <div>
                    <p className="font-bold text-foreground">{r.name}</p>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      {r.flag && (r.flag.startsWith("http") || r.flag.startsWith("/")) ? (
                        <Image
                          src={r.flag}
                          alt={r.country || "Flag"}
                          width={28}
                          height={20}
                          className="inline-block w-7 h-5 object-cover align-middle rounded-sm"
                        />
                      ) : (
                        <FlagIcon code={getCountryCode(r.country || "")} />
                      )}
                      {r.country}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(r.stars || 0)].map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="fill-sky-400 text-sky-400"
                    />
                  ))}
                </div>
                <p className="text-foreground-secondary font-light leading-relaxed italic flex-grow">
                  &quot;{r.quote}&quot;
                </p>
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-xs sm:text-sm md:text-base text-[10px] font-bold text-sky-500 uppercase tracking-widest">
                    Verified Patient
                  </span>
                  <Check size={14} className="text-sky-500" />
                </div>
              </div>
            </PerformanceAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
