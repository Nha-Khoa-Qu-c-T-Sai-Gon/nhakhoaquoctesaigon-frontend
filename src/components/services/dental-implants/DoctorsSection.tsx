"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Award } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface DoctorProfile {
  name?: string;
  title?: string;
  photo?: string;
  education?: string[];
  certifications?: string[];
  experience?: string;
}

interface DoctorsSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    profiles?: DoctorProfile[];
  };
}

export function DoctorsSection({ data }: DoctorsSectionProps) {
  const profiles = data?.profiles || [];
  const defaultPhotos = [
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
  ];
  return (
    <section id="doctors" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          subtitle={data?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="grid lg:grid-cols-2 gap-8">
          {profiles.map((doc: any, i: number) => (
            <PerformanceAnimation
              key={i}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.1}
            >
              <div className="flex flex-col md:flex-row bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 group h-full">
                <div className="w-full md:w-2/5 aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={
                      doc.photo ||
                      defaultPhotos[i] ||
                      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={doc.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-w-768px) 100vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white font-bold text-xl leading-tight">
                      {doc.name}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base text-sky-300 font-bold uppercase tracking-widest">
                      {doc.title}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-3/5 p-8 lg:p-10 flex flex-col justify-center">
                  <div className="mb-6">
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Education & Credentials
                    </p>
                    <ul className="space-y-2">
                      {(doc.education || []).map((edu: any, j: number) => (
                        <li
                          key={j}
                          className="text-sm sm:text-base md:text-lg flex items-start gap-2 text-foreground-secondary leading-relaxed font-light"
                        >
                          <Award
                            size={14}
                            className="text-sky-500 shrink-0 mt-1"
                          />{" "}
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(doc.certifications || []).map((cert: any, j: number) => (
                      <span
                        key={j}
                        className="text-xs sm:text-sm md:text-base px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-primary-600 uppercase tracking-wider"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between mt-auto">
                    <span className="text-xs sm:text-sm md:text-base font-bold text-primary-600 uppercase tracking-widest">
                      {doc.experience}
                    </span>
                    <button className="text-xs sm:text-sm md:text-base text-sky-500 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                      Profile <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </PerformanceAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
