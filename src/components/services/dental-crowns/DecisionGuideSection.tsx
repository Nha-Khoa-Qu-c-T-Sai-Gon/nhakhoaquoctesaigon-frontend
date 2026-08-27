import React from "react";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  Bone,
  Activity,
  HelpCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import ExpandableText from "@/src/components/ui/ExpandableText";
import { CROWNS_TREATMENTS_FALLBACK } from "@/src/lib/constants/services-fallbacks";

interface DecisionGuideTreatmentItem {
  title?: string;
  description?: string;
}

interface ComparisonTableRow {
  situation?: string;
  option?: string;
}

interface DecisionGuideSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    treatments?: {
      crown?: DecisionGuideTreatmentItem;
      veneer?: DecisionGuideTreatmentItem;
      implant?: DecisionGuideTreatmentItem;
    };
    comparisonTable?: ComparisonTableRow[];
  };
}

export const DecisionGuideSection = ({ data }: DecisionGuideSectionProps) => {
  const d = data || {};
  const treatments = d?.treatments || CROWNS_TREATMENTS_FALLBACK;

  return (
    <section
      id="decision-guide"
      className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-sky-50 to-white"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.12),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* 1. HEADER */}
        <AnimatedSectionHeader
          badge="Treatment Decision Guide"
          title={d?.title || ""}
          subtitle={d?.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* 3. TREATMENT EXPLANATION CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { key: "crown", data: treatments.crown, icon: Crown },
            { key: "veneer", data: treatments.veneer, icon: Sparkles },
            { key: "implant", data: treatments.implant, icon: Bone },
          ].map((item, i) => (
            <PerformanceAnimation
              key={item.key}
              preset="slide-up-subtle"
              whileInView={true}
              delay={i * 0.1}
              className="bg-white border border-border/50 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(22,81,151,0.09)] transition-all duration-300 group cursor-default hover:-translate-y-1.5"
            >
              <div className="flex flex-col gap-4">
                {/* Row 1: Icon + Title */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-primary-600 shadow-sm border border-sky-100 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary group-hover:text-white shrink-0">
                    <item.icon className="w-6 h-6" />
                    {/* Glow blur behind icon */}
                    <div className="absolute inset-0 bg-sky-400 rounded-xl blur-md -z-10 opacity-0 group-hover:opacity-40 group-hover:scale-150 transition-all duration-300" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary leading-tight">
                    {item.data?.title}
                  </h4>
                </div>
                {/* Row 2: Content */}
                <ExpandableText
                  text={item.data?.description || ""}
                  lineClamp={5}
                  expandLabel="Read more"
                  collapseLabel="Show less"
                />
              </div>
            </PerformanceAnimation>
          ))}
        </div>

        {/* 4. COMPARISON TABLE */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.3}
          className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="px-6 py-5 bg-[#F8FBFF] border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h4 className="font-bold text-lg flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary-500" />
              Clinical Recommendations
            </h4>
            <div className="text-xs sm:text-sm md:text-base text-[11px] sm:font-bold text-sky-700 bg-sky-100 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 w-fit border border-sky-200">
              <HelpCircle className="w-3.5 h-3.5" /> Quick Reference
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {(d?.comparisonTable || []).map((row, i: number) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row p-5 sm:p-6 hover:bg-sky-50/50 transition-colors group"
              >
                <div className="sm:w-3/5 font-bold text-foreground-secondary mb-2 sm:mb-0 group-hover:text-foreground transition-colors pr-4 flex items-center">
                  {row.situation}
                </div>
                <div className="sm:w-2/5 flex items-center">
                  <span className="font-bold text-primary-700 text-sm md:text-base flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
                    <ArrowRight className="w-4 h-4 text-primary-400 shrink-0 hidden sm:block" />
                    {row.option}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PerformanceAnimation>

        {/* 5. BELOW SECTION CTA */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.4}
          className="mt-16 text-center"
        >
          <p className="text-foreground-secondary font-medium mb-6">
            Still unsure? Get a personalized treatment recommendation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgba(2,132,199,0.3)] hover:shadow-[0_10px_40px_rgba(2,132,199,0.4)] hover:-translate-y-1"
          >
            Book Consultation
          </Link>
          <div className="text-xs sm:text-sm md:text-base mt-6 flex items-center justify-center gap-2 text-muted-foreground font-medium uppercase tracking-widest">
            <Shield className="w-4 h-4 text-green-500" />
            Clinically guided decision framework
          </div>
        </PerformanceAnimation>
      </div>
    </section>
  );
};
