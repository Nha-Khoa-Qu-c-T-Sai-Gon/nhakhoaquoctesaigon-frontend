"use client";

import React from "react";
import Image from "next/image";
import {
  Award,
  TrendingUp,
  Users,
  Scan,
  UserCheck,
  FileText,
  Sofa,
  Lightbulb,
  Shield,
  Heart,
  Smile,
  Star,
  Sprout,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import type { CommitmentItem, PatientAvatar } from "@/src/types/about-us";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  TrendingUp,
  Users,
  Scan,
  UserCheck,
  FileText,
  Sofa,
  Lightbulb,
  Shield,
  Heart,
  Smile,
  Star,
  Sprout,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
};

interface CommitmentSectionProps {
  /**
   * Commitment section data
   */
  commitment: {
    badge?: string;
    title?: string;
    description?: string;
    patientAvatars?: (string | PatientAvatar)[];
    commitments?: CommitmentItem[];
  };
  /**
   * List of commitment items
   */
  commitmentItems: CommitmentItem[];
  /**
   * Whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
}

/**
 * CommitmentSection displays guarantee cards and social proof patient counts.
 */
export function CommitmentSection({
  commitment,
  commitmentItems,
  shouldSimplify,
}: CommitmentSectionProps) {
  if (!commitment) return null;

  return (
    <section className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
      {/* Dynamic accent lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] gap-16 lg:gap-24 items-center">
          {/* Left Side: Header & Context */}
          <div className="space-y-8 flex flex-col lg:block h-full lg:h-auto">
            <div>
              <AnimatedSectionHeader
                badge={commitment.badge}
                title={
                  typeof commitment.title === "string" &&
                  commitment.title.includes("Our Firm Guarantees to You") ? (
                    <>
                      Our Firm Guarantees <br className="block lg:hidden" /> to
                      You
                    </>
                  ) : (
                    commitment.title || (
                      <>
                        Our Firm Guarantees <br className="block lg:hidden" />{" "}
                        to You
                      </>
                    )
                  )
                }
                subtitle={commitment.description}
                align="left"
                titleSize="large"
                titleClassName="text-white tracking-tight"
                subtitleClassName="text-blue-100/70 font-normal max-w-xl"
                className="!mb-0 items-center lg:items-start text-center lg:text-left"
              />
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-6 pt-4 mb-auto lg:mb-0">
              <div className="flex -space-x-3">
                {(commitment.patientAvatars && commitment.patientAvatars.length > 0
                  ? commitment.patientAvatars.slice(0, 4)
                  : [1, 2, 3, 4]
                ).map((avatar: string | PatientAvatar, i: number) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-800 flex items-center justify-center"
                  >
                    {typeof avatar === "string" ? (
                      <Image
                        src={avatar}
                        alt={`Patient avatar ${i + 1}`}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm sm:text-base md:text-lg font-bold text-white">
                  5,000+ Happy Patients
                </p>
                <p className="text-sm sm:text-base md:text-lg text-slate-500">
                  Trusting our commitment to quality
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Asymmetric Cards Layout */}
          <div className="relative group">
            {commitmentItems.length > 0 && (
              <div className="flex flex-col gap-6">
                {/* Row 1: Featured Guarantee */}
                <PerformanceAnimation
                  preset="scale-in"
                  delay={0.2}
                  whileInView={true}
                >
                  <MotionDiv
                    whileHover={shouldSimplify ? undefined : { y: -5 }}
                    className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-blue-700 overflow-hidden shadow-2xl shadow-primary-900/20 group"
                  >
                    {/* Corner Tag */}
                    <div className="absolute top-0 right-0 px-6 py-2 bg-primary-600 rounded-tr-[2.5rem] rounded-bl-2xl shadow-sm z-20">
                      <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">
                        Primary Commitment
                      </p>
                    </div>

                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ShieldCheck className="w-32 h-32 text-white" />
                    </div>

                    <div className="relative z-10">
                      {/* Row 1: Icon + Title */}
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0">
                          {(() => {
                            const Icon =
                              (commitmentItems[0].icon
                                ? iconMap[commitmentItems[0].icon]
                                : undefined) || Star;
                            return <Icon className="w-7 h-7 text-primary-600" />;
                          })()}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {commitmentItems[0].title}
                        </h3>
                      </div>

                      {/* Row 2: Description */}
                      <div>
                        <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
                          {commitmentItems[0].description}
                        </p>
                      </div>
                    </div>
                  </MotionDiv>
                </PerformanceAnimation>

                {/* Row 2: Secondary Guarantees Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {commitmentItems
                    .slice(1, 3)
                    .map((item: CommitmentItem, idx: number) => {
                      const Icon = (item.icon ? iconMap[item.icon] : undefined) || Star;
                      return (
                        <PerformanceAnimation
                          key={idx}
                          preset="scale-in"
                          delay={0.3 + idx * 0.1}
                          whileInView={true}
                          className="h-full"
                        >
                          <MotionDiv
                            whileHover={
                              shouldSimplify
                                ? undefined
                                : {
                                    y: -5,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                                  }
                            }
                            className="relative p-6 rounded-[2rem] bg-gradient-to-br from-primary-600 to-blue-700 overflow-hidden shadow-xl shadow-primary-900/20 transition-all h-full flex flex-col gap-3"
                          >
                            {/* Subtle glow orb */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

                            {/* Row 1: Icon + Title — 2-Row Standardization */}
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="w-10 h-10 shrink-0 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                                {item.title}
                              </h3>
                            </div>

                            {/* Row 2: Description */}
                            <p className="text-sm sm:text-base leading-relaxed text-white/80 relative z-10">
                              {item.description}
                            </p>
                          </MotionDiv>
                        </PerformanceAnimation>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
