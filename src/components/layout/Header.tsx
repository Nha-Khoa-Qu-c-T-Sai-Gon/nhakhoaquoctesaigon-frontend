"use client";

/**
 * Header Component — 2026 Premium Design
 *
 * ANIMATION SYSTEM:
 * This component intentionally does NOT use framer-motion.
 * All animations are implemented with CSS keyframes defined in globals.css,
 * which run entirely on the browser's compositor thread:
 *
 *  - `kf-scale-in`       → Desktop CTA entrance (opacity + scale)
 *  - `kf-slide-up`       → Sticky mobile CTA entrance (translateY 100% → 0)
 *  - `kf-menu-open`      → Mobile nav drawer entrance (translateY -6px → 0)
 *  - `.rotate-icon-*`    → Hamburger ↔ X icon rotation via CSS transition
 *  - `.logo-scale-wrapper` → Logo scale-on-scroll via direct DOM style write
 *                            inside a passive scroll listener (no React state,
 *                            no RAF loop, no MotionValue subscription)
 *
 * WHY NO FRAMER MOTION HERE:
 * The header is the first thing users interact with. On mid-range Android/iOS
 * devices, JS-driven animation loops (useTransform, MotionValue subscriptions)
 * compete with scroll, input, and hydration work on the main thread.
 * CSS keyframes and `transition` on compositor-only properties (transform,
 * opacity) execute off-thread entirely, providing consistent 60fps even under
 * heavy CPU load.
 *
 * GUIDELINES:
 * - Never add `initial/animate` Framer Motion props back to this file.
 * - For scroll-driven transforms: write to `element.style.transform` in a
 *   passive scroll listener, not via `useScroll` + MotionValue.
 * - For conditional show/hide: toggle CSS animation class names, never
 *   `animate={{ opacity: 0 / 1 }}`.
 *
 * FEATURES:
 * - Optimistic UI: instant active-state updates via CSS `:active` / class toggle
 * - Top progress bar during navigation
 * - Route preloading on hover (NavLink)
 * - Scroll-based logo scale via direct DOM style write
 * - Premium gradient CTA (desktop)
 * - Scroll spy for anchor links
 * - Sticky mobile CTA slide-up on mount
 * - Mobile menu: instant on mobile, 180ms slide on desktop-width
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavLink } from "./NavLink";
import { NavDropdown } from "./NavDropdown";
import { TopProgressBar } from "./TopProgressBar";
import { useBookingModal } from "@/src/components/booking-modal/BookingModalContext";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import type { Navigation } from "@/src/types/strapi";

interface HeaderProps {
  navigation: Navigation;
}

export function Header({ navigation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { open: openBookingModal } = useBookingModal();
  const { shouldSimplify } = useMobileAnimation();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {},
  );

  const toggleExpanded = useCallback((id: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  /**
   * logoRef — direct DOM reference for scroll-driven scale.
   *
   * We write `element.style.transform` directly in the scroll handler
   * instead of going through React state → re-render → framer-motion
   * MotionValue. This avoids batching delays and keeps the logo scale
   * silky-smooth without any JS animation frames.
   */
  const logoRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Handle navigation click - trigger progress bar
  const handleNavigate = useCallback(() => {
    window.dispatchEvent(new Event("navigationStart"));
  }, []);

  // Handle scroll effects for background and logo scale
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;

      // 1. Sticky header background state
      const isScrolled = sy > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

      // 2. Logo scale — interpolate 1 → 0.85 over first 100px of scroll
      if (logoRef.current && !shouldSimplify) {
        const t = Math.min(sy / 100, 1);
        const scale = 1 - t * 0.15;
        logoRef.current.style.transform = `scale(${scale})`;
      }

      // 3. Measure unscrolled height when back at top
      if (sy === 0 && headerRef.current) {
        const height = headerRef.current.offsetHeight;
        if (height > 0) {
          document.documentElement.style.setProperty("--header-height", `${height}px`);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldSimplify]);

  // Measure actual Header height and expose it as a CSS variable
  useEffect(() => {
    if (typeof window === "undefined" || !headerRef.current) return;

    const headerEl = headerRef.current;

    const updateHeaderHeight = () => {
      if (!headerEl) return;
      // Only measure when page is unscrolled to capture the full natural height
      if (window.scrollY === 0) {
        const height = headerEl.offsetHeight;
        if (height > 0) {
          document.documentElement.style.setProperty("--header-height", `${height}px`);
        }
      }
    };

    // Initial measure
    updateHeaderHeight();

    // ResizeObserver updates `--header-height` when size changes (e.g. screen width, layout reflow)
    const observer = new ResizeObserver(() => {
      updateHeaderHeight();
    });
    observer.observe(headerEl);

    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  // Use IntersectionObserver for scroll spy instead of getBoundingClientRect in scroll listener
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.getAttribute("id") || "");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Top Progress Bar */}
      <TopProgressBar />

      {/*
       * Main Header
       * Background and padding use CSS transitions (Tailwind duration-* classes).
       * On mobile (`shouldSimplify`) we drop to duration-0 for instant feedback.
       */}
      <header
        ref={headerRef}
        className={`
          fixed top-0 inset-x-0 z-50
          transition-[background-color,border-color,box-shadow] ease-out ${shouldSimplify ? "duration-0" : "duration-300"}
          ${
            scrolled
              ? "bg-white shadow-md border-b border-primary-100"
              : shouldSimplify
                ? "bg-white border-b border-primary-50"
                : "bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-xl border-b border-white/20"
          }
        `}
      >
        <div
          className={`
          w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          transition-[padding] ease-out ${shouldSimplify ? "duration-0" : "duration-300"}
          ${scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4 lg:py-5"}
        `}
        >
          <div className="flex items-center justify-between w-full">
            {/* Mobile Left Spacer — balances the hamburger so the logo centers */}
            <div className="w-10 lg:hidden flex-shrink-0" />

            {/* Logo */}
            <Link
              href="/"
              onClick={handleNavigate}
              className="flex items-center space-x-2 sm:space-x-3 group relative z-10 flex-1 lg:flex-none justify-center lg:justify-start"
            >
              {/*
               * logo-scale-wrapper: the scroll handler writes `style.transform`
               * directly to this element — bypassing React state entirely.
               * On mobile (shouldSimplify) we skip the DOM write and leave scale
               * at its natural 1.0 to save the style recalc.
               */}
              <div ref={logoRef} className="logo-scale-wrapper">
                {navigation.logo ? (
                  <Image
                    src={navigation.logo.url}
                    alt={navigation.logo.alt}
                    width={navigation.logo.width || 160}
                    height={navigation.logo.height || 56}
                    priority
                    className={`
                      w-auto transition-all ${shouldSimplify ? "duration-0" : "duration-300"}
                      rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary-100 bg-white/50 backdrop-blur-sm p-1
                      ${scrolled ? "h-12 sm:h-10" : "h-16 sm:h-12 lg:h-14"}
                    `}
                  />
                ) : (
                  <span
                    className={`
                    font-bold text-foreground transition-all ${shouldSimplify ? "duration-0" : "duration-300"}
                    ${scrolled ? "text-xl sm:text-xl" : "text-2xl sm:text-2xl"}
                  `}
                  >
                    International Dental Clinic
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.navigation.length > 0 ? (
                navigation.navigation.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isAnchorLink = item.href.startsWith("#");
                  const isActive = isAnchorLink
                    ? activeSection === item.href.replace("#", "")
                    : undefined;

                  return hasChildren ? (
                    <NavDropdown
                      key={item.id}
                      label={item.label}
                      href={item.href}
                      isActive={isActive}
                      onNavigate={handleNavigate}
                    >
                      {item.children!}
                    </NavDropdown>
                  ) : (
                    <NavLink
                      key={item.id}
                      href={item.href}
                      label={item.label}
                      isActive={isActive}
                      onNavigate={handleNavigate}
                    />
                  );
                })
              ) : (
                <span className="text-sm text-foreground-muted">
                  No menu items
                </span>
              )}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              {navigation.ctaText && navigation.ctaLink && (
                /*
                 * anim-scale-in: CSS keyframe kf-scale-in with 0.3s delay.
                 * Runs once on mount; animation-fill-mode: both keeps it visible.
                 * No framer-motion subscription needed.
                 */
                <PerformanceAnimation preset="scale-in" delay={0.3}>
                  <button
                    onClick={openBookingModal}
                    id="header-book-consultation-desktop"
                    className={`
                      group relative inline-flex items-center
                      bg-gradient-to-r from-primary-400 to-primary-600
                      text-white font-semibold rounded-xl
                      shadow-lg shadow-primary-500/30
                      transition-all duration-300
                      hover:shadow-2xl hover:shadow-primary-500/40
                      hover:-translate-y-0.5
                      active:scale-95
                      overflow-hidden
                      ${scrolled ? "px-4 py-2 text-base" : "px-6 py-3 text-lg"}
                    `}
                  >
                    {/* Shimmer glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <svg
                      className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="relative z-10">Book Consultation</span>
                    <div className="absolute inset-0 rounded-xl bg-primary-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
                  </button>
                </PerformanceAnimation>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`
                lg:hidden w-10 flex-shrink-0 flex justify-end p-2 text-foreground-secondary hover:text-primary-500
                transition-colors relative z-10 rounded-lg
                hover:bg-primary-50 active:bg-primary-100
                ${scrolled ? "" : "backdrop-blur-sm"}
              `}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {/*
               * CSS-only hamburger rotation.
               * rotate-icon-open / rotate-icon-closed classes apply
               * `transform: rotate(180deg / 0deg)` via CSS transition.
               * No JS animation frame, no framer-motion subscription.
               */}
              <div
                className={
                  mobileMenuOpen ? "rotate-icon-open" : "rotate-icon-closed"
                }
              >
                {mobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/*
         * Mobile Navigation Drawer
         *
         * `shouldSimplify` selects the animation class:
         *   true  → anim-menu-open-instant (kf-fade-in, 0s — no interpolation)
         *   false → anim-menu-open (kf-menu-open, 180ms slide-in)
         *
         * Using conditional rendering (not AnimatePresence) is intentional —
         * exit animations are dropped in favour of instant close on mobile
         * to eliminate the perceived lag of waiting for an exit animation.
         */}
        {mobileMenuOpen && (
          <PerformanceAnimation
            as="nav"
            preset={shouldSimplify ? "fade-in" : "menu-open"}
            duration={0.18}
            className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-primary-50 shadow-2xl px-4 sm:px-6 pb-6 sm:pb-8 pt-4 sm:pt-6 overflow-y-auto max-h-[85vh] rounded-b-3xl sm:rounded-b-[2rem]"
          >
            {navigation.navigation.length > 0
              ? navigation.navigation.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const expanded = !!expandedItems[item.id];

                  return (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center justify-between py-2.5 sm:py-3">
                        <div onClick={closeMobileMenu} className="flex-1">
                          <NavLink
                            href={item.href}
                            label={item.label}
                            className="block py-2 text-lg font-bold text-[#1E3A5F] hover:text-primary-600 transition-colors"
                          />
                        </div>
                        {hasChildren && (
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="p-2 text-foreground-secondary hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50 active:bg-primary-100 mr-1"
                            aria-label={
                              expanded ? "Collapse menu" : "Expand menu"
                            }
                          >
                            <svg
                              className={`w-5 h-5 transition-transform duration-200 ${expanded ? "rotate-180" : "rotate-0"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      {hasChildren && (
                        <div
                          className={`
                          grid transition-all duration-200 ease-out
                          ${expanded ? "grid-rows-[1fr] opacity-100 mb-3" : "grid-rows-[0fr] opacity-0 pointer-events-none"}
                        `}
                        >
                          <div className="overflow-hidden min-h-0 pl-3 sm:pl-4 space-y-1 border-l-2 border-primary-100 ml-2">
                            {item.children?.map((child) => (
                              <div key={child.id} onClick={closeMobileMenu}>
                                <NavLink
                                  href={child.href}
                                  label={child.label}
                                  className="block py-1.5 sm:py-2 text-lg text-foreground-secondary hover:text-primary-500 transition-colors"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              : null}
            {/* Mobile CTA in nav - Hidden on mobile, shown on tablet+ */}
            {navigation.ctaText && navigation.ctaLink && (
              <div className="pt-4 sm:pt-5 hidden sm:block">
                <button
                  onClick={() => {
                    openBookingModal();
                    closeMobileMenu();
                  }}
                  id="header-book-consultation-mobile-nav"
                  className="flex items-center justify-center gap-2 w-full px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-primary-400 to-primary-600 text-white font-semibold rounded-xl shadow-md active:scale-95 transition-transform text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {navigation.ctaText}
                </button>
              </div>
            )}
          </PerformanceAnimation>
        )}
      </header>

      {/*
       * Sticky Mobile CTA Bar
       *
       * anim-slide-up: CSS keyframe kf-slide-up with a spring-like cubic-bezier.
       * No JS spring simulation — the cubic-bezier(0.34, 1.56, 0.64, 1) curve
       * produces the same overshoot feel as Framer Motion's spring(damping: 20).
       *
       * On mobile (shouldSimplify) we still play the slide-up but without the
       * overshoot curve so low-end devices don't drop frames on mount.
       *
       * We use a passive listener / CSS rule that checks shouldSimplify.
       */}
      {navigation.ctaText && navigation.ctaLink && (
        <PerformanceAnimation
          preset="slide-up"
          duration={0.45}
          easing={
            shouldSimplify ? "ease-out" : "cubic-bezier(0.34, 1.56, 0.64, 1)"
          }
          className="lg:hidden fixed bottom-6 left-6 right-[5.5rem] z-40"
        >
          <button
            onClick={openBookingModal}
            id="header-book-consultation-sticky"
            className="
              flex items-center justify-center w-full px-6 py-4
              bg-gradient-to-r from-primary-500 to-[#11427C]
              text-white font-bold rounded-2xl
              shadow-[0_10px_30px_rgba(22,81,151,0.35)]
              active:scale-95
              transition-all duration-300
              border border-white/10 backdrop-blur-md
            "
          >
            <svg
              className="w-5 h-5 mr-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[15px] tracking-tight">
              Book Consultation
            </span>
          </button>
        </PerformanceAnimation>
      )}
    </>
  );
}
