"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Activity,
  Hash,
  Cpu,
  Banknote,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface PricingSectionProps {
  data?: {
    title?: string;
    description?: string;
    bgDesktop?: string;
    bgMobile?: string;
    paymentSubtitle?: string;
    paymentMethods?: Array<{
      icon?: string;
      label?: string;
      detail?: string;
      color?: string;
    }>;
  };
  crownPricing?: Array<{
    material: string;
    origin: string;
    warranty: string;
    single: string;
    full: string;
  }>;
  paymentMethodsFallback: any[];
}

export function PricingSection({
  data,
  crownPricing = [],
  paymentMethodsFallback,
}: PricingSectionProps) {
  const bgDesktop = data?.bgDesktop || "";
  const bgMobile = data?.bgMobile || "";

  const paymentMethods =
    Array.isArray(data?.paymentMethods) && data.paymentMethods.length
      ? data.paymentMethods.map((m) => ({
          icon: m.icon || "",
          label: m.label || "",
          detail: m.detail || "",
          color: m.color || "from-blue-400 to-blue-600",
        }))
      : paymentMethodsFallback;

  return (
    <section
      id="pricing"
      className="py-20 relative bg-gradient-to-b from-sky-50 via-white to-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_60%)]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSectionHeader
          title={data?.title || "Dental Crown Cost in Ho Chi Minh City"}
          className="mb-6"
        />

        {/* Patient Notice */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.1}
          className="relative pl-5 border-l-[3px] border-amber-300/90 bg-amber-50/40 rounded-r-2xl px-5 py-4 mb-10 sm:mb-12"
        >
          <p className="text-[10px] font-bold text-amber-600/80 uppercase tracking-widest mb-1.5">
            Note to Patient
          </p>
          <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed italic">
            {data?.description ||
              "All treatment fees at SG International Dental Clinic are confirmed in writing at your consultation following clinical examination. The ranges below represent general market guidance in Ho Chi Minh City and are subject to the complexity of your individual case, the condition of the tooth, and whether prerequisite treatments are required."}
          </p>
        </PerformanceAnimation>

        {/* Core Pricing UI - Desktop Table */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.2}
          className="hidden md:block w-full border border-border/50 rounded-2xl overflow-hidden bg-white shadow-sm mb-6"
        >
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted border-b border-border/50">
              <tr>
                <th className="text-xs sm:text-sm lg:text-lg px-6 py-4 font-bold text-[#165197] text-left">
                  Material
                </th>
                <th className="text-xs sm:text-sm lg:text-lg px-6 py-4 font-bold text-[#165197] text-center">
                  Origin
                </th>
                <th className="text-xs sm:text-sm lg:text-lg px-6 py-4 font-bold text-[#165197] text-center">
                  Warranty
                </th>
                <th className="text-xs sm:text-sm lg:text-lg px-6 py-4 font-bold text-[#165197] text-center">
                  Single Tooth
                </th>
                <th className="text-xs sm:text-sm lg:text-lg px-6 py-4 font-bold text-[#165197] text-center">
                  Full Jaw (16 teeth)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {crownPricing.map((item) => {
                const isPremium = item.material?.startsWith("Oro");
                return (
                  <tr
                    key={item.material}
                    className={`transition-colors hover:bg-sky-50/50 ${
                      isPremium
                        ? "bg-primary/5 border-l border-l-primary"
                        : "border-l border-l-transparent"
                    }`}
                  >
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-xs sm:text-sm lg:text-lg font-bold text-[#165197]">
                          {item.material}
                        </span>
                      </div>
                    </td>
                    <td className="text-xs sm:text-sm lg:text-lg px-6 py-4 text-[#165197]/70 text-center">
                      {item.origin}
                    </td>
                    <td className="text-xs sm:text-sm lg:text-lg px-6 py-4 text-[#165197]/70 font-medium text-center">
                      {item.warranty}
                    </td>
                    <td className="text-xs sm:text-sm lg:text-lg px-6 py-4 text-[#165197] text-center font-bold">
                      {item.single}
                    </td>
                    <td className="text-xs sm:text-sm lg:text-lg px-6 py-4 text-[#165197] text-center font-bold">
                      {item.full}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </PerformanceAnimation>

        {/* Core Pricing UI - Mobile Cards */}
        <div className="md:hidden space-y-4 mb-6">
          {crownPricing.map((item, index) => {
            const isPremium = item.material?.startsWith("Oro");
            return (
              <PerformanceAnimation
                key={item.material}
                preset="slide-up-subtle"
                whileInView={true}
                delay={index * 0.05}
                className={`bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border transition-all ${
                  isPremium
                    ? "border-primary/40 bg-primary/[0.02]"
                    : "border-border"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 mb-1">
                      {item.material}
                      {isPremium && (
                        <span className="text-xs sm:text-sm md:text-base bg-primary/10 text-primary-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                          Premium
                        </span>
                      )}
                    </h4>
                    <div className="text-xs sm:text-sm md:text-base text-foreground-secondary flex items-center gap-2">
                      <span>{item.origin}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{item.warranty}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-foreground-secondary mb-1">
                      Single Tooth
                    </div>
                    <div className="font-bold text-foreground">
                      {item.single}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-foreground-secondary mb-1">
                      Full Jaw
                    </div>
                    <div className="font-bold text-primary-600">
                      {item.full}
                    </div>
                  </div>
                </div>
              </PerformanceAnimation>
            );
          })}
        </div>

        {/* COST FACTORS + PAYMENT — Stacked Layout */}
        <div className="flex flex-col gap-10 lg:gap-16">
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.3}
            className="relative rounded-[3rem] overflow-hidden border border-slate-200/60 shadow-xl shadow-slate-900/5 group mt-12 lg:mt-20"
          >
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
              {bgDesktop && (
                <Image
                  src={bgDesktop}
                  alt="Premium Digital Backdrop Desktop"
                  fill
                  className="hidden md:block object-cover opacity-100"
                  sizes="(max-w-1024px) 100vw, 50vw"
                />
              )}
              {bgMobile && (
                <Image
                  src={bgMobile}
                  alt="Premium Digital Backdrop Mobile"
                  fill
                  className="block md:hidden object-cover opacity-100"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
              )}
              <div className="absolute inset-0 bg-white/30 backdrop-blur-[6px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/40 to-transparent" />
            </div>

            <div className="relative z-10 p-8 lg:p-14">
              <div className="flex flex-col gap-10">
                <div className="max-w-3xl">
                  <p className="text-lg lg:text-xl text-[#165197] leading-relaxed font-normal">
                    {data?.paymentSubtitle || ""}
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 lg:max-w-5xl">
                  {paymentMethods.map((method) => {
                    const renderPaymentIcon = () => {
                      const labelLower = (method.label || "").toLowerCase();
                      if (labelLower.includes("cash")) {
                        return <Banknote className="w-6 h-6 text-white" />;
                      }
                      if (labelLower.includes("card")) {
                        return <CreditCard className="w-6 h-6 text-white" />;
                      }
                      return <CalendarDays className="w-6 h-6 text-white" />;
                    };

                    const getGradientClass = (colorStr: string) => {
                      const c = (colorStr || "").toLowerCase();
                      if (
                        c.includes("amber") ||
                        c.includes("yellow") ||
                        c.includes("orange")
                      ) {
                        return "from-amber-400 to-amber-600";
                      }
                      if (c.includes("emerald") || c.includes("green")) {
                        return "from-emerald-400 to-emerald-600";
                      }
                      return "from-[#165197] to-blue-500";
                    };

                    return (
                      <div
                        key={method.label}
                        className="p-6 lg:p-7 rounded-[2.5rem] bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${getGradientClass(
                              method.color,
                            )} shadow-inner`}
                          >
                            {renderPaymentIcon()}
                          </div>
                          <h5 className="font-bold text-[#165197] text-lg lg:text-xl leading-tight">
                            {method.label}
                          </h5>
                        </div>
                        <p className="text-sm lg:text-base font-semibold text-slate-500 leading-snug">
                          {method.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </PerformanceAnimation>

          {/* Bottom Row: 2×2 Factor Cards */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <h3 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">
                Cost Influencers
              </h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {[
                {
                  title: "Tooth location",
                  subtitle:
                    "Front teeth visible in the smile line require higher-grade ceramic and more time-intensive shade-matching than posterior molars.",
                  icon: MapPin,
                },
                {
                  title: "Pre-existing condition",
                  subtitle:
                    "A tooth requiring a build-up core or post before a crown can be placed involves additional materials and chair time.",
                  icon: Activity,
                },
                {
                  title: "Number of crowns",
                  subtitle:
                    "Full-arch or multiple-unit restorations are typically discussed with a tailored package.",
                  icon: Hash,
                },
                {
                  title: "Technology used",
                  subtitle:
                    "Clinics with in-house CAD/CAM milling may absorb some laboratory costs, while premium hand-layered ceramics attract a higher laboratory fee.",
                  icon: Cpu,
                },
              ].map((factor, i) => (
                <PerformanceAnimation
                  key={factor.title}
                  preset="slide-up-subtle"
                  whileInView={true}
                  delay={0.4 + i * 0.1}
                  className="group p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-[#165197] shrink-0 transition-all duration-300 group-hover:bg-[#165197] group-hover:text-white p-3">
                        {renderServiceIcon(
                          factor.icon,
                          "w-full h-full",
                          factor.title || "",
                          factor.subtitle || "",
                        )}
                      </div>
                      <h4 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-[#165197] transition-colors leading-tight">
                        {factor.title}
                      </h4>
                    </div>
                    <p className="text-sm lg:text-lg text-slate-600 leading-relaxed font-normal">
                      {factor.subtitle}
                    </p>
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
