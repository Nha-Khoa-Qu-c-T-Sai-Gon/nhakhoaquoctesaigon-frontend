"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { QuestionIcon } from "@/src/components/ui/safety-accordion";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

function quickPreview(answer: string): string {
  if (!answer) return "";
  const clean = answer.replace(/\n/g, " ").trim();
  if (clean.length <= 72) return clean;
  return clean.slice(0, 72).replace(/\s\S*$/, "") + "…";
}

interface SafetyAccordionItemProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  index?: number;
}

function SafetyAccordionItem({
  title,
  content,
  icon,
  isOpen,
  onToggle,
  index = 0,
}: SafetyAccordionItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      delay={index * 0.07}
      className="rounded-2xl overflow-hidden"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "rounded-2xl border transition-all duration-300 backdrop-blur-sm",
          isOpen
            ? "bg-sky-50/90 border-sky-300 shadow-[0_4px_24px_rgba(56,189,248,0.12)]"
            : hovered
              ? "bg-white/95 border-sky-200 shadow-md"
              : "bg-white/80 border-sky-100 shadow-sm",
        )}
      >
        <button
          onClick={onToggle}
          className="w-full px-5 py-4 text-left flex items-start gap-3"
          aria-expanded={isOpen}
        >
          {icon && (
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300",
                isOpen
                  ? "bg-gradient-to-br from-[#165197] to-blue-500 text-white"
                  : "bg-blue-50 text-[#165197]",
              )}
            >
              {icon}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-semibold text-lg sm:text-xl leading-snug transition-colors duration-300",
                isOpen ? "text-[#165197]" : "text-slate-800",
              )}
            >
              {title}
            </p>
            <AnimatePresence initial={false}>
              {!isOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm sm:text-base md:text-lg text-slate-500/70 mt-0.5 truncate"
                >
                  {quickPreview(content)}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div
            className={cn(
              "shrink-0 mt-1 transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          >
            <ChevronDown
              className={cn(
                "w-4 h-4",
                isOpen ? "text-blue-500" : "text-slate-400",
              )}
            />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -8 }}
                animate={{ y: 0 }}
                exit={{ y: -8 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "px-5 pb-5 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed whitespace-pre-line",
                  icon ? "pl-[52px] sm:pl-[60px]" : "",
                )}
              >
                {content}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PerformanceAnimation>
  );
}

interface FaqItem {
  q?: string;
  a?: string;
}

interface FaqSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    items?: FaqItem[];
  };
}

export function FaqSection({ data }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="py-20 lg:py-28 bg-gradient-to-b from-sky-50 to-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader
          badge={data?.badge || ""}
          title={data?.h2 || ""}
          className="mb-8 sm:mb-10 md:mb-12"
        />
        <div className="flex flex-col gap-3">
          {(data?.items || []).map((item: any, i: number) => (
            <SafetyAccordionItem
              key={i}
              title={item?.q || ""}
              content={item?.a || ""}
              icon={<QuestionIcon question={item?.q || ""} />}
              index={i}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
