"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  fallback: ReactNode;
  /**
   * How far ahead of the viewport to trigger the reveal.
   * 600px = start loading when section is 600px below the visible area.
   */
  rootMargin?: string;
}

/**
 * SectionReveal — SSR-safe viewport-triggered section loading.
 *
 * ── SSR correctness ──────────────────────────────────────────────────────────
 * The fundamental constraint: `useState(false)` on server renders `fallback`,
 * not `children`. This means crawlers see the skeleton, not real content —
 * which is a serious SEO regression.
 *
 * Fix: use `null` as the initial sentinel.
 *   null  → "not yet determined" → render children (matches server output, SEO safe)
 *   true  → in viewport → render children
 *   false → outside viewport → render fallback (skeleton)
 *
 * ── Lifecycle ────────────────────────────────────────────────────────────────
 *
 *   INITIAL PAGE LOAD (direct URL, SSR):
 *     1. Server renders:  revealed=null → children (FULL HTML in page, SEO ✓)
 *     2. React hydrates:  revealed=null → children (matches server, no hydration error ✓)
 *     3. useEffect fires: measures section position
 *        a. In viewport (or within rootMargin):  setRevealed(true)  → children stay ✓
 *        b. Below fold (well off-screen):         setRevealed(false) → swap to skeleton
 *           ↳ This swap happens off-screen — user never sees the flash
 *     4. IntersectionObserver fires as user scrolls near section → setRevealed(true)
 *
 *   CLIENT-SIDE NAVIGATION (Next.js Link):
 *     1. No SSR, React renders from scratch: revealed=null → children
 *     2. useEffect fires immediately, same logic as above
 *     3. If below fold and dynamic() chunk not yet loaded: skeleton shows
 *     4. When section approaches: chunk loads, children mount
 *
 * ── Why the off-screen swap is safe ──────────────────────────────────────────
 *   When a section is 2000px below the fold:
 *   - The swap from children→skeleton happens while user hasn't scrolled there
 *   - They never see the flash
 *   - By the time they scroll near (rootMargin), children are ready again
 *
 * ── CLS prevention ───────────────────────────────────────────────────────────
 *   The fallback skeleton must match the section height.
 *   SectionSkeleton uses `mobileHeight` + `desktopHeight` props for this.
 *   The wrapper div has no fixed height — it takes the height of its content.
 */
export function SectionReveal({
  children,
  fallback,
  rootMargin = "600px",
}: SectionRevealProps) {
  // null = SSR sentinel (renders children, matches server output)
  // true = in viewport → children
  // false = below fold → skeleton
  const [revealed, setRevealed] = useState<boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;

    // No IntersectionObserver support (old browsers, test env) → always show
    if (!el || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    // Check if section is already in or near the viewport on mount.
    // getBoundingClientRect is sync and accurate immediately after hydration.
    const rect = el.getBoundingClientRect();
    const margin = parseFloat(rootMargin) || 600;
    const isNearViewport = rect.top < window.innerHeight + margin;

    if (isNearViewport) {
      // Already visible or near-visible: keep children, no observer needed
      setRevealed(true);
      return;
    }

    // Section is well below fold: swap to skeleton (off-screen, user won't see)
    // Then watch for the section to approach.
    setRevealed(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]); // rootMargin is stable; no dependency on `revealed`

  return (
    <div ref={ref}>
      {/* null = SSR sentinel: render children to match server output */}
      {revealed === false ? fallback : children}
    </div>
  );
}
