"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/src/components/ui/carousel";
import type { HomepageServicesBlock } from "@/src/types/strapi";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import Image from "next/image";

/**
 * Services Block Component - Advanced 2026 Interactions
 *
 * Phase 3 upgrades:
 * - 3D floating wave surface (R3F + custom GLSL shader)
 * - Surface reacts to card hover
 * - Cursor-based lighting per card
 * - Stagger reveal on scroll
 * - CTA slide-in animation
 */

// Lazy-load the 3D canvas — avoids SSR / WebGL issues

interface ServicesBlockProps {
  data: HomepageServicesBlock;
}

// cardVariants removed — PerformanceAnimation handles entrance effects

// Individual service card with dynamic icon from CMS
function ServiceCard({
  service,
  index,
  onHoverChange,
}: {
  service: HomepageServicesBlock["items"][number];
  index: number;
  onHoverChange: (h: boolean) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { shouldSimplify } = useMobileAnimation();

  /*
   * PERF: mouseX/mouseY MotionValues are declared here but only forwarded to
   * CursorLight when !shouldSimplify. We still need them at this level so the
   * handleMouseMove callback can call .set() without conditional hook calls.
   * This is the minimum allocation; spring values live inside CursorLight.
   */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldSimplify) return;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY, shouldSimplify],
  );

  const handleEnter = () => {
    if (!shouldSimplify) {
      setHovered(true);
      onHoverChange(true);
    }
  };
  const handleLeave = () => {
    if (!shouldSimplify) {
      setHovered(false);
      onHoverChange(false);
    }
  };

  const cardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      /*
       * PERF: transition-[transform,box-shadow,opacity] instead of transition-all.
       * willChange removed — permanent willChange allocates a GPU layer per card;
       * the browser promotes automatically during active transforms.
       */
      className={`relative cursor-pointer h-full transition-[transform,box-shadow,opacity] duration-500 ease-out ${hovered ? "-translate-y-2 scale-[1.03]" : "translate-y-0 scale-100"}`}
    >
      <div
        className={`relative rounded-[20px] sm:rounded-[24px] p-5 sm:p-8 md:p-10 overflow-hidden h-full flex flex-col transition-shadow duration-300 ${hovered ? "shadow-xl shadow-sky-200/40" : "shadow-sm"}`}
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f9fcff 100%)",
          border: "1px solid rgba(0, 120, 255, 0.08)",
        }}
      >
        {/* Cursor-following light — only on desktop; spring values allocated inside CursorLight */}
        {!shouldSimplify && (
          <CursorLight mouseX={mouseX} mouseY={mouseY} visible={hovered} />
        )}

        {/* ── Top inner glow ── */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-[20px] transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.09) 0%, transparent 65%)",
          }}
        />

        {/* ── Dynamic Image Icon ── */}
        <PerformanceAnimation
          preset="scale-in"
          whileInView={true}
          delay={index * 0.05}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[16px] flex items-center justify-center mb-4 sm:mb-5 md:mb-6 overflow-hidden bg-primary-50/50 transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"} hidden sm:flex`}
        >
          {service.image ? (
            <Image
              src={service.image.url}
              alt={service.image.alt || service.title}
              fill
              className="object-contain p-2 rounded-[12px]"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
            />
          ) : (
            <div className="w-full h-full bg-blue-100/50 rounded-[16px]" />
          )}
        </PerformanceAnimation>

        {/* ── Title with Icon on Mobile ── */}
        <div className="flex items-center gap-3 mb-2 sm:mb-2 md:mb-3">
          {/* Mobile icon - shown only on mobile, inline with title */}
          <PerformanceAnimation
            preset="scale-in"
            whileInView={true}
            delay={index * 0.05}
            className={`sm:hidden relative w-12 h-12 rounded-[12px] flex items-center justify-center overflow-hidden bg-primary-50/50 transition-transform duration-500 shrink-0 ${hovered ? "scale-110" : "scale-100"}`}
          >
            {service.image ? (
              <Image
                src={service.image.url}
                alt={service.image.alt || service.title}
                width={48}
                height={48}
                className="object-contain p-1.5 rounded-[10px]"
              />
            ) : (
              <div className="w-full h-full bg-blue-100/50 rounded-[12px]" />
            )}
          </PerformanceAnimation>

          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-tight">
            {service.title}
          </h3>
        </div>

        {/* ── Description — always visible, expands on hover ── */}
        <div className="overflow-hidden flex-1">
          <p
            className={`text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-65"}`}
          >
            {service.description}
          </p>
        </div>

        {/* ── Learn more CTA — slides up on hover ── */}
        <div className="overflow-hidden mt-3 sm:mt-4 md:mt-5">
          <div
            className={`flex items-center gap-1.5 text-primary-600 font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <span>Learn more</span>
            <span
              className={`inline-block transition-transform duration-300 ${hovered ? "translate-x-1" : "translate-x-0"}`}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Wrap with NavigationLink if link is provided
  if (service.link) {
    return (
      <NavigationLink href={service.link} className="block h-full">
        {cardContent}
      </NavigationLink>
    );
  }

  return cardContent;
}

/*
 * CursorLight — spring values live here, not in ServiceCard.
 * This avoids allocating useMotionValue + useSpring for every card that is
 * rendered on mobile (where shouldSimplify skips rendering this entirely).
 */
function CursorLight({
  mouseX,
  mouseY,
  visible,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  visible: boolean;
}) {
  // Spring values allocated only when CursorLight mounts (desktop only)
  const lightX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const lightY = useSpring(mouseY, { stiffness: 200, damping: 30 });
  const background = useMotionTemplate`radial-gradient(280px circle at ${lightX}px ${lightY}px, rgba(56,189,248,0.13) 0%, transparent 70%)`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-[20px]"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      style={{ background }}
    />
  );
}

export function ServicesBlock({ data }: ServicesBlockProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleCardHover = useCallback((_h: boolean) => {
  }, []);

  if (!data.items || data.items.length === 0) return null;

  return (
    <section
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      id="services"
    >
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-white" />
        {/* Soft abstract glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50/50 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <AnimatedSectionHeader
          title={data.title}
          subtitle={data.subtitle}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          {data.description && (
            <p className="text-base sm:text-lg md:text-xl text-foreground-secondary">
              {data.description}
            </p>
          )}
        </AnimatedSectionHeader>

        {/* ── Cards Grid (Desktop & Tablet) ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {data.items.map((service, index) => (
            <PerformanceAnimation
              key={service.id || index}
              preset="slide-up"
              whileInView={true}
              delay={index * 0.1}
              className="h-full"
            >
              <ServiceCard
                service={service}
                index={index}
                onHoverChange={handleCardHover}
              />
            </PerformanceAnimation>
          ))}
        </div>

        {/* ── Cards Carousel (Mobile Only — below 768px) ── */}
        <div className="md:hidden relative px-4 sm:px-12">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {data.items.map((service, index) => (
                <CarouselItem
                  key={`carousel-${service.id || index}`}
                  className="pl-2 sm:pl-4 basis-full"
                >
                  <div className="h-full py-2 sm:py-4">
                    <ServiceCard
                      service={service}
                      index={index}
                      onHoverChange={handleCardHover}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows — hidden on mobile (swipe instead), shown on sm+ */}
            <div className="hidden sm:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-20">
              <CarouselPrevious className="static translate-y-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 border-2 border-white shadow-lg flex items-center justify-center text-primary-600 hover:bg-white hover:scale-110 transition-transform duration-200 -translate-x-1/2 pointer-events-auto [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6" />
              <CarouselNext className="static translate-y-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 border-2 border-white shadow-lg flex items-center justify-center text-primary-600 hover:bg-white hover:scale-110 transition-transform duration-200 translate-x-1/2 pointer-events-auto [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6" />
            </div>
          </Carousel>

          {/* Premium Pagination Dots — mobile only */}
          {count > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    current === i
                      ? "w-7 bg-primary-600"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── CTA — always show for premium feel ── */}
        <PerformanceAnimation
          preset="slide-up"
          whileInView={true}
          delay={0.2}
          className="text-center mt-12 sm:mt-16 md:mt-24"
        >
          <NavigationLink
            href={data.viewMoreLink || "/services"}
            className="inline-block"
          >
            <div className="bg-[#1E3A5F] hover:bg-[#2B5A8E] text-white px-10 py-5 text-sm sm:text-base md:text-xl rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 whitespace-nowrap hover:scale-105 active:scale-[0.96]">
              {data.viewMoreLabel || "Explore All Treatments"}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </NavigationLink>
        </PerformanceAnimation>
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/3 left-5 w-2 h-2 rounded-full bg-primary-200 opacity-40 animate-pulse hidden lg:block" />
      <div className="absolute bottom-1/4 right-10 w-3 h-3 rounded-full bg-blue-100 opacity-50 animate-bounce hidden lg:block" />
    </section>
  );
}
