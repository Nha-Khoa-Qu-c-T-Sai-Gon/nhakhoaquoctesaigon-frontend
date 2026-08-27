"use client";

import React from "react";
import { Zap, PlayCircle } from "lucide-react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";

interface PricingRow {
  brand?: string;
  highlight?: string;
  priceEach?: string;
  priceFrom2?: string;
  allon4?: string;
  allon6?: string;
  origin?: string;
}

interface CrownRow {
  type?: string;
  price?: string;
  price16?: string;
  origin?: string;
  warranty?: string;
  highlight?: boolean;
}

interface PricingSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    implantTable?: {
      headers?: string[];
      rows?: PricingRow[];
    };
    crownTable?: {
      headers?: string[];
      rows?: CrownRow[];
    };
    note?: string;
  };
}

export function PricingSection({ data }: PricingSectionProps) {
  const d = data || {};
  const implantHeaders = d.implantTable?.headers || [];
  const implantRows = d.implantTable?.rows || [];
  const crownHeaders = d.crownTable?.headers || [];
  const crownRows = d.crownTable?.rows || [];

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSectionHeader
          badge={d.badge || ""}
          title={d.h2 || ""}
          subtitle={d.subtitle || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />

        {/* Implant Table */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Zap className="text-sky-500" /> Implant abutment price list
          </h3>
          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {implantHeaders.map((h, i) => (
                    <th
                      key={i}
                      className={`text-lg lg:text-xl px-8 py-6 font-bold text-[#165197] leading-tight align-top ${
                        i === 2 ? "max-w-[140px]" : ""
                      } ${i === 3 || i === 4 ? "whitespace-nowrap" : ""}`}
                    >
                      {i === 2 ? (
                        <div className="flex flex-col">
                          <span>Price</span>
                          <span className="text-sm font-normal opacity-80 mt-1">
                            (From 2 Implants)
                          </span>
                        </div>
                      ) : (
                        h
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {implantRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`group hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0 ${
                      row.highlight ? "bg-sky-50/30" : ""
                    }`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#165197] text-lg">
                          {row.brand}
                        </span>
                        {row.highlight && (
                          <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">
                            {row.highlight} Choice
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-[#165197] text-base lg:text-lg">
                      {row.priceEach}
                    </td>
                    <td className="px-8 py-6 text-[#165197] font-bold text-base lg:text-lg">
                      {row.priceFrom2}
                    </td>
                    <td className="px-8 py-6 text-base lg:text-lg text-[#165197] font-bold whitespace-nowrap">
                      {row.allon4}
                    </td>
                    <td className="px-8 py-6 text-base lg:text-lg text-[#165197] font-bold whitespace-nowrap">
                      {row.allon6}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-base px-3 py-1 bg-slate-100 text-[#165197] rounded-full font-bold">
                        {row.origin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Crown Table */}
        <div>
          <h3 className="text-2xl font-bold text-[#165197] mb-8 flex items-center gap-3">
            <PlayCircle className="text-primary-600" /> Price list for crown
            restoration on Implant
          </h3>
          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {crownHeaders.map((h, i) => (
                    <th
                      key={i}
                      className="text-lg lg:text-xl px-8 py-6 font-bold text-[#165197] leading-relaxed align-top"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {crownRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${
                      row.highlight ? "bg-sky-50/20" : ""
                    }`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#165197] text-lg">
                          {row.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-[#165197] text-base lg:text-lg">
                      {row.price}
                    </td>
                    <td className="px-8 py-6 font-bold text-[#165197] text-base lg:text-lg">
                      {row.price16}
                    </td>
                    <td className="px-8 py-6 text-[#165197] font-bold text-base lg:text-lg">
                      {row.origin}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-base px-3 py-1 bg-sky-50 text-[#165197] rounded-full font-bold uppercase tracking-wider">
                        {row.warranty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs sm:text-sm md:text-base mt-8 text-slate-500 font-medium italic text-center">
          {d.note}
        </p>
      </div>
    </section>
  );
}
