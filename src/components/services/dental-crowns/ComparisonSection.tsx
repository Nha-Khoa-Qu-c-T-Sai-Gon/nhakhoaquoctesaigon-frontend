"use client";

import React from "react";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface ComparisonSectionProps {
  data?: {
    title?: string;
    headers?: Array<{ key: string; label: string }>;
    rows?: Array<{
      feature: string;
      zirconia?: { value: string };
      emax?: { value: string };
      pfm?: { value: string };
    }>;
    footnote?: string;
  };
  fallback: {
    title: string;
    headers: Array<{ key: string; label: string }>;
    rows: Array<any>;
    footnote: string;
  };
}

export function ComparisonSection({ data, fallback }: ComparisonSectionProps) {
  const headers =
    data?.headers && data.headers.length > 0
      ? data.headers
      : fallback.headers;
  const rows =
    data?.rows && data.rows.length > 0
      ? data.rows
      : fallback.rows;
  const footnote = data?.footnote || fallback.footnote;

  return (
    <section id="comparison" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <AnimatedSectionHeader
            title={data?.title || fallback.title}
            className="mb-8 sm:mb-10 md:mb-12"
          />

          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
            className="mb-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(22,81,151,0.08)] border border-primary-100/60">
              <div className="overflow-x-auto isolate">
                <table className="text-base lg:text-lg w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#165197]">
                      {headers.map((h, i) => (
                        <th
                          key={h.key}
                          className={`px-5 py-5 font-bold text-white whitespace-nowrap text-base lg:text-xl ${
                            i === 0
                              ? "sticky left-0 bg-[#165197] z-[30] border-r border-white/10 min-w-[160px]"
                              : "text-center text-primary-100"
                          }`}
                        >
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100/50 bg-white">
                    {rows.map((row, rowIndex) => (
                      <tr
                        key={row.feature}
                        className={`transition-colors group ${
                          rowIndex % 2 === 0 ? "bg-white" : "bg-[#F4F8FD]"
                        } hover:bg-[#EBF3FC]`}
                      >
                        <td
                          className={`px-5 py-4 font-normal text-[#165197] sticky left-0 z-[20] border-r border-primary-100/50 transition-colors ${
                            rowIndex % 2 === 0
                              ? "bg-white group-hover:bg-[#EBF3FC]"
                              : "bg-[#F4F8FD] group-hover:bg-[#EBF3FC]"
                          }`}
                        >
                          {row.feature}
                        </td>
                        {["zirconia", "emax", "pfm"].map((key) => {
                          const cell = (row as any)[key];
                          const textCls = "text-[#165197]";

                          const renderContent = () => {
                            if (!cell) return null;
                            if (cell.value === "✓")
                              return (
                                <svg
                                  className="w-5 h-5 mx-auto"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              );
                            if (cell.value === "✓✓")
                              return (
                                <div className="flex justify-center -space-x-1">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              );
                            if (cell.value === "✗")
                              return (
                                <svg
                                  className="w-5 h-5 mx-auto"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              );
                            return (
                              <span className="font-normal">{cell.value}</span>
                            );
                          };

                          return (
                            <td
                              key={key}
                              className="px-3 py-3 text-center align-middle"
                            >
                              <div
                                className={`inline-flex items-center justify-center min-w-[110px] px-3 py-2 text-base lg:text-lg font-normal ${textCls}`}
                              >
                                {renderContent()}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PerformanceAnimation>

          <p className="text-sm sm:text-base lg:text-lg italic text-muted-foreground text-center max-w-4xl mx-auto mb-12 px-4 leading-relaxed">
            * {footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
