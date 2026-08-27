# High-Performance CSS Animation System (v2.0)

This document outlines the mandatory standards for animations within the Dental Frontend codebase. Our goal is **Consistent 60fps on Mobile** by offloading all animation work to the browser's Compositor Thread.

## 🚀 The Core Philosophy: CSS over JavaScript

Traditional JavaScript animations (like standard Framer Motion) run on the **Main Thread**. This thread is often overloaded with hydration, API handling, and logic.

**The Solution:** Use **CSS Keyframes** and **Compositor-Only Properties** (`transform`, `opacity`). These execute off-thread, ensuring smooth motion even when the CPU is busy.

---

## 🛠️ Mandatory Components

### 1. `PerformanceAnimation` (Priority: HIGH)

Use for all entrance effects (fade, scale, slide).

- **Path:** `src/components/ui/PerformanceAnimation.tsx`
- **Presets:** `fade-in`, `scale-in`, `slide-up`, `slide-up-subtle`, `menu-open`.

```tsx
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

<PerformanceAnimation preset="slide-up" delay={0.1}>
  <YourComponent />
</PerformanceAnimation>;
```

### 2. `MotionDiv` (Priority: MEDIUM)

Use ONLY for complex scroll-reveal logic that requires IntersectionObserver integration not yet supported by `PerformanceAnimation`, or for hover effects.

- **Path:** `src/components/ui/MotionDiv.tsx`

---

## 🎯 Special Cases: When to Use Direct Framer Motion

### Infinite Floating Animations (Hero Decorative Elements)

**Use Case**: Hero section decorative images that float continuously with rotation and complex keyframes.

**Example**: News page, Customer page, and About Us page hero floating images.

**Why Direct `motion.div`**:

- ✅ Requires infinite repeat with complex keyframe arrays
- ✅ Combines multiple properties (x, y, rotate, opacity)
- ✅ Needs staggered delays and different durations per element
- ✅ Decorative elements (not LCP content)
- ✅ `PerformanceAnimation` is designed for one-time entrances only

**Pattern**:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, x: -40, rotate: -4 }}
  animate={{ opacity: 1, x: 0, rotate: -4, y: [0, -10, 0] }}
  transition={{
    opacity: { delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    x: { delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0 },
  }}
  whileHover={{ rotate: 0, scale: 1.04 }}
>
  <img src={...} alt={...} />
</motion.div>
```

**Files Using This Pattern**:

- `dental-frontend/src/app/news/NewsPageClient.tsx` (hero floating cards)
- `dental-frontend/src/app/customers/CustomerContent.tsx` (hero floating images)
- `dental-frontend/src/app/about-us/AboutUsContent.tsx` (hero floating images)

**Performance Considerations**:

- ✅ Uses `transform` (compositor-only)
- ✅ GPU-accelerated
- ⚠️ Continuous animation (battery impact)
- 💡 Consider disabling on mobile via `useMobileAnimation` in the future

---

## 📏 Mandatory Rules for AI & Developers

1. **NO Framer Motion for LCP**: Hero sections, headers, and any above-the-fold content MUST be plain HTML or use `PerformanceAnimation`.
2. **Direct DOM for Continuous Events**: For animations driven by continuous input (like `scroll` or `mousemove`), write directly to `element.style.transform`. Do NOT use React state or MotionValue subscriptions for high-frequency updates.
3. **No Jitter Rule**: Never mix a JS-driven style update with a CSS `transition` on the same property. This creates "conflicting interpolation" and jitter.
4. **Compositor Only**: Never animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`). These trigger "Layout" and "Paint" which are performance killers.
5. **Reduced Motion**: Always respect the `shouldSimplify` flag from `useMobileAnimation`. On low-end devices, animations should be instant (`duration: 0`).
6. **Special Cases**: Infinite floating animations with complex keyframes and rotation can use direct `motion.div` from Framer Motion (see Special Cases section above).

---

## 🏗️ Adding New Animations

To add a new animation type:

1. Define `@keyframes kf-name` in `src/app/globals.css`.
2. Add the name to the `AnimationPreset` type in `PerformanceAnimation.tsx`.
3. Add the mapping to `keyframesMap` inside the component.

This approach ensures that your new animation is immediately available via props across the entire application without adding redundant CSS classes.
