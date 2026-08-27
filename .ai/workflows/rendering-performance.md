# Page Rendering Performance Guide

> Standard established after Phase 1–3 optimization of the dental clinic homepage.
> Follow this guide for every new page to ensure consistent performance and SEO.

---

## Core Principle

**SSR-first, progressively enhanced.**

All content must be in the server-rendered HTML for SEO.  
Client-side JS only adds interactivity, never replaces content.

---

## The 4-Tier Loading Model

Every new page section must be assigned a priority tier:

| Tier   | Trigger                  | Components                             | JS Loading                                                 |
| ------ | ------------------------ | -------------------------------------- | ---------------------------------------------------------- |
| **P1** | Immediate (eager import) | LCP driver only (VideoHero, page hero) | `import { X } from './X'`                                  |
| **P2** | Immediate hydration      | First 1–2 scroll depths                | `dynamic(ssr:true)`                                        |
| **P3** | `SectionReveal 600px`    | Well below fold                        | `dynamic(ssr:true)` + `<SectionReveal rootMargin="600px">` |
| **P4** | `SectionReveal 500px`    | Near footer                            | `dynamic(ssr:true)` + `<SectionReveal rootMargin="500px">` |

---

## BlockRenderer Pattern (Homepage)

When adding a new section to the homepage `BlockRenderer.tsx`:

```tsx
// 1. Add the dynamic import at the top (correct tier):
const MyNewSection = dynamic(
  () => import('./blocks/MyNewSection').then(m => ({ default: m.MyNewSection })),
  { loading: () => <SectionSkeleton mobileHeight="min-h-[300px]" desktopHeight="md:min-h-[500px]" cols={3} /> }
)

// 2. Add skeleton to SK object:
const SK = {
  // existing...
  mySection: <SectionSkeleton mobileHeight="min-h-[300px]" desktopHeight="md:min-h-[500px]" cols={3} />,
}

// 3. Add case to switch with correct tier wrapper:
case 'my-new-section':
  // P3 example:
  return (
    <SectionReveal key={reactKey} fallback={SK.mySection} rootMargin="600px">
      <MyNewSection data={block as any} />
    </SectionReveal>
  )
```

---

## New Page Architecture

For non-homepage pages (e.g., `/services/dental-implants`):

```
src/app/services/dental-implants/
├── page.tsx         ← Server Component: fetch data, generate metadata
└── DentalImplantsContent.tsx  ← Client Component: interactive UI
```

### page.tsx (Server Component) — Always this structure:

```tsx
// NO 'use client' directive
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/src/lib/api/queries";
import { DentalImplantsContent } from "./DentalImplantsContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("dental-implants");
  return {
    title: page?.seo?.metaTitle || page?.title,
    description: page?.seo?.metaDescription || page?.description,
  };
}

export default async function DentalImplantsPage() {
  const page = await getPageBySlug("dental-implants");
  if (!page) notFound();
  return <DentalImplantsContent content={page.content} />;
}

export const revalidate = false; // ISR via webhook
```

### Content.tsx (Client Component) — Progressive loading:

```tsx
"use client";
import dynamic from "next/dynamic";
import { SectionReveal } from "@/src/components/ui/SectionReveal";
import { SectionSkeleton } from "@/src/components/skeletons/SectionSkeleton";

// P1: Hero renders immediately — no dynamic()
import { PageHero } from "@/src/components/blocks/PageHero";

// P3: Below-fold sections
const ServiceDetails = dynamic(() => import("./ServiceDetails"), {
  loading: () => (
    <SectionSkeleton
      mobileHeight="min-h-[300px]"
      desktopHeight="md:min-h-[500px]"
      cols={2}
    />
  ),
});
const ServiceFAQ = dynamic(() => import("./ServiceFAQ"), {
  loading: () => (
    <SectionSkeleton
      mobileHeight="min-h-[200px]"
      desktopHeight="md:min-h-[400px]"
      cols={1}
    />
  ),
});

export function DentalImplantsContent({ content }) {
  return (
    <div>
      {/* P1: Immediate */}
      <PageHero data={content.hero} />

      {/* P3: Viewport-triggered */}
      <SectionReveal
        fallback={
          <SectionSkeleton
            mobileHeight="min-h-[300px]"
            desktopHeight="md:min-h-[500px]"
            cols={2}
          />
        }
        rootMargin="600px"
      >
        <ServiceDetails data={content.details} />
      </SectionReveal>

      <SectionReveal
        fallback={
          <SectionSkeleton
            mobileHeight="min-h-[200px]"
            desktopHeight="md:min-h-[400px]"
            cols={1}
          />
        }
        rootMargin="500px"
      >
        <ServiceFAQ data={content.faq} />
      </SectionReveal>
    </div>
  );
}
```

---

## Skeleton Height Rules

Match skeleton heights to real section heights as closely as possible:

| Section Type       | Mobile          | Desktop            | cols |
| ------------------ | --------------- | ------------------ | ---- |
| Full-screen hero   | `min-h-[380px]` | `md:min-h-[600px]` | 1    |
| 3-column card grid | `min-h-[320px]` | `md:min-h-[580px]` | 3    |
| 2-column layout    | `min-h-[300px]` | `md:min-h-[500px]` | 2    |
| CTA strip          | `min-h-[120px]` | `md:min-h-[200px]` | 1    |
| FAQ accordion      | `min-h-[300px]` | `md:min-h-[500px]` | 1    |
| Carousel           | `min-h-[280px]` | `md:min-h-[480px]` | 3    |
| Doctor/Team cards  | `min-h-[360px]` | `md:min-h-[620px]` | 3    |

---

## SectionReveal Rules

```tsx
// CORRECT: null-sentinel ensures SSR content always in HTML
// Server renders children → SEO safe
// Client: swaps to skeleton if section is well below fold
// IntersectionObserver re-reveals as user scrolls near

<SectionReveal fallback={<SectionSkeleton ... />} rootMargin="600px">
  <MySection data={data} />
</SectionReveal>

// WRONG: Never use revealed=false initially
// This breaks SSR — crawlers see skeleton, not content
```

---

## Global Layout Rules (layout.tsx)

- **Never** add `dynamic({ ssr: false })` directly in `layout.tsx` — it is a Server Component
- All `ssr: false` imports must be in `GlobalClientShell.tsx` (`'use client'`)
- Pattern for adding new global client-only component:

```tsx
// In GlobalClientShell.tsx:
const MyNewWidget = dynamic(
  () => import('@/src/components/MyNewWidget'),
  { ssr: false }
)

// Then render inside GlobalClientShell's return:
<MyNewWidget config={config} />
```

---

## content-visibility CSS Rule

Already applied globally in `globals.css`:

```css
main > *,
main section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}

/* LCP element MUST be excluded */
.video-hero,
main > :first-child {
  content-visibility: visible !important;
  contain-intrinsic-size: unset !important;
}
```

For new pages: add a class matching your LCP hero element to the exclusion rule if needed.

---

## Anti-Patterns to Avoid

| Anti-Pattern                                     | Why Bad                                    | Correct Approach                                                 |
| ------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------------- |
| `dynamic({ ssr: false })` in Server Component    | Next.js build error                        | Put in `'use client'` file                                       |
| `useState(false)` as initial reveal state        | Server renders skeleton, breaks SEO        | Use `null` sentinel → `revealed === false ? fallback : children` |
| SectionReveal wrapping P1/P2 sections            | Unnecessarily delays near-viewport content | Only use for P3/P4                                               |
| `body.style.overflow = 'hidden'` without cleanup | Scroll lock persists on unmount            | Always release in `useEffect` cleanup                            |
| Importing all sections eagerly                   | Hydration burst on page load               | Use `dynamic()` for all non-LCP sections                         |
| `.video-hero-section` (wrong class)              | Dead CSS                                   | Use actual class name `.video-hero`                              |
| Generic `SectionSkeleton height="600px"` (fixed) | CLS on different screen sizes              | Use `mobileHeight` + `desktopHeight` responsive props            |

---

## Verification Checklist for Every New Page

- [ ] LCP section has no `SectionReveal` wrapping
- [ ] LCP section uses eager import (no `dynamic()`)
- [ ] All content sections use `dynamic(ssr:true)` (no `ssr:false`)
- [ ] Skeleton heights approximate real section heights
- [ ] P3+ sections wrapped in `SectionReveal` with correct rootMargin
- [ ] No `dynamic({ ssr: false })` in Server Components
- [ ] `body.style.overflow` always has cleanup in `useEffect` return
- [ ] Run `npm run type-check` before commit
