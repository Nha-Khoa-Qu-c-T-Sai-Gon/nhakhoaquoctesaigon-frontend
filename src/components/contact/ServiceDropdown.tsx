"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { ChevronDown, Check } from "lucide-react";

interface ServiceDropdownProps {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function ServiceDropdown({
  value,
  options,
  placeholder,
  onChange,
  hasError,
  onOpenChange,
}: ServiceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${isOpen ? "z-40" : "z-0"}`}>
      {/* Trigger */}
      <button
        type="button"
        id="service"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all focus:outline-none bg-white ${
          hasError
            ? "border-red-300 ring-2 ring-red-500/20"
            : isOpen
              ? "border-primary-500 ring-2 ring-primary-500/20 shadow-sm"
              : "border-slate-200 hover:border-primary-300"
        }`}
      >
        <span
          className={`text-sm truncate ${value ? "text-slate-900 font-medium" : "text-slate-400"}`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
            isOpen ? "rotate-180 text-primary-500" : "text-slate-400"
          }`}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_16px_48px_rgba(22,81,151,0.14)] z-[100] overflow-hidden"
          >
            <div className="p-1.5 max-h-[260px] overflow-y-auto">
              {options.map((opt) => {
                const isSelected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary-50 text-primary-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-primary-600"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
