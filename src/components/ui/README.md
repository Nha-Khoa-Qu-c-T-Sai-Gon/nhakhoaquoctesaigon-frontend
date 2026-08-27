# Common UI Components Directory (`src/components/ui/`)

This directory contains our reusable atomic UI components, design tokens wrappers, animations, and typography wrappers.

## Core UI Components

### 1. Animations & Layout Wrappers

- **`PerformanceAnimation.tsx`**: CSS-driven entrance animations (using tailwind presets like `slide-up-subtle`, `scale-in`, etc.) to guarantee high LCP/FID performance and eliminate layout thrashing.
- **`SectionReveal.tsx` / `MotionDiv.tsx`**: Framer Motion scroll and view entry wrappers.
- **`AnimatedSectionHeader.tsx`**: Renders standard section title headers with pre-configured animation entries.

### 2. Interactive Controls & Buttons

- **`BookingButton.tsx`**: Triggers booking popup modals or routes to booking paths.
- **`CallNowButton.tsx`**: Sticky / standalone direct click-to-call clinical phone button.
- **`ServiceIndexMenu.tsx`**: Side anchor index menu for multi-section service pages.

### 3. Display Elements

- **`DecorativeBadge.tsx`**: Colored clinic badges with curated theme color maps (dark, primary, light modes).
- **`ExpandableText.tsx`**: Clean, accessible text overflow expand/collapse wrapper.
- **`safety-accordion.tsx`**: Accessible, custom animated accordion panels tailored for FAQs and procedural warning cards.

## Developer & AI Guidelines

> [!IMPORTANT]
>
> 1. Always reuse common buttons, badges, and animations from this folder.
> 2. NEVER construct raw `<button>` elements for clinical actions; use `<CallNowButton>` or `<BookingButton>` to preserve event tracking and uniform design styling.
> 3. Document all new UI component files with descriptive JSDoc block comments at the top of the file.
