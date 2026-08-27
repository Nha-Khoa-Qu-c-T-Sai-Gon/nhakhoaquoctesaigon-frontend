"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { renderServiceIcon } from "@/src/lib/utils/service-icons";

interface IndicationItem {
  title?: string;
  desc?: string;
  icon?: string | Record<string, unknown> | null;
}

const IndicationCard = ({ item }: { item: IndicationItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, [item.desc]);

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-300 group/card hover:-translate-y-0.5 h-full">
      {/* Row 1: Icon + Title */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover/card:scale-110 text-primary-600 bg-sky-50 rounded-xl p-1.5">
          {renderServiceIcon(
            item.icon as (string | null | undefined),
            "w-full h-full",
            item.title || "",
            item.desc || "",
          )}
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover/card:text-primary-700 transition-colors">
          {item.title}
        </h3>
      </div>
      {/* Row 2: Content */}
      <div className="flex-1 flex flex-col">
        <p
          ref={textRef}
          className={`text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-5" : ""}`}
        >
          {item.desc}
        </p>
        {(isTruncated || isExpanded) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 group/btn inline-flex items-center gap-2 text-[10px] font-black text-primary-600 hover:text-primary-700 transition-all duration-200 w-fit"
          >
            <span className="tracking-widest uppercase">
              {isExpanded ? "SHOW LESS" : "READ MORE"}
            </span>
            <div
              className={`w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-primary-600 group-hover/btn:text-white ${isExpanded ? "rotate-180" : ""}`}
            >
              <ChevronDown size={12} strokeWidth={3} />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export const IndicationsCarousel = ({
  indications,
}: {
  indications: IndicationItem[];
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group/carousel">
      {/* ── MOBILE: Vertical Stack ── */}
      <div className="lg:hidden flex flex-col gap-6 px-4">
        {indications.map((item, index) => (
          <div key={index}>
            <IndicationCard item={item} />
          </div>
        ))}
      </div>

      {/* ── DESKTOP: Carousel ── */}
      <div className="hidden lg:block relative">
        {/* Navigation Arrows */}
        <div className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 hidden sm:block opacity-0 group-hover/carousel:opacity-100 transition-opacity">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
        </div>

        <div className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 hidden sm:block opacity-0 group-hover/carousel:opacity-100 transition-opacity">
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Viewport */}
        <div className="overflow-hidden px-4 -mx-4" ref={emblaRef}>
          <div className="flex -ml-6">
            {indications.map((item, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] py-4"
              >
                <IndicationCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === selectedIndex
                  ? "w-8 bg-primary-600"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
