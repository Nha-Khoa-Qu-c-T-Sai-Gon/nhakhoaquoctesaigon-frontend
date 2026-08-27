# Shared Sections Directory (`src/components/sections/`)

This directory contains reusable, page-level section components that are shared across multiple service templates or landing pages in the dental application.

## Folder Contents

### 1. `ProcessSection.tsx`

- **Purpose**: An immersive, scroll-driven interactive timeline representing step-by-step clinical or treatment journeys.
- **Interactivity**:
  - **Desktop (xl+)**: Renders as a 400vh tall container using Framer Motion's sticky scroll. The background image changes automatically as the user scrolls, but nodes are also fully clickable (using `onClick`) to allow users to jump directly to specific treatment steps.
  - **Mobile/Tablet**: Transforms into a responsive vertical stacked timeline.
- **Usage & Reuse**: Reused across `dental-braces.tsx` and `dental-crowns.tsx`. It handles flexible input structures:
  ```tsx
  // Braces approach (unified CMS data object)
  <ProcessSection data={data?.process} />

  // Crowns approach (raw steps array and discrete header configurations)
  <ProcessSection steps={d?.crownProcess} journeyHeader={d?.journeyHeader} />
  ```

### 2. `VisitClinicSection.tsx`

- **Purpose**: Section inviting users to visit the physical clinic locations, showcasing social proof, Zalo / maps links, and contact options.
- **Usage & Reuse**: Used as the default contact call-to-action block across general dentistry and specialty landing pages.

## Developer & AI Guidelines

> [!IMPORTANT]
> - Ensure all components created here are highly reusable, configurable via props, and accommodate slightly differing layouts across service pages.
> - Always support responsive layouts (mobile first/stacked vertical and desktop sticky/horizontal layouts where appropriate).
> - Document any complex state, scroll calculations, or animation configurations inside the code using comprehensive JSDoc/docstrings.
