# Loading States Implementation Guide

This document explains the loading state system implemented for the dental clinic website.

## Overview

The loading state system provides visual feedback while content is being fetched from Strapi CMS. It includes:

1. **Base Loading Components** - Reusable primitives (Spinner, Skeleton, etc.)
2. **Block-Specific Skeletons** - Layout-matched loading states for each content block
3. **Page Loading States** - Next.js App Router loading.tsx files
4. **Client-Side Loading** - Dynamic content loading in client components

## Architecture

### 1. Base Loading Components

Location: `src/components/ui/loading.tsx`

#### Spinner

Rotating loading indicator for buttons and actions.

```tsx
import { Spinner } from "@/src/components/ui/loading";

<Spinner size="md" color="primary" />;
```

**Props:**

- `size`: "sm" | "md" | "lg" | "xl"
- `color`: "primary" | "white" | "neutral"
- `className`: Additional CSS classes

#### Skeleton

Content placeholder with pulse animation.

```tsx
import { Skeleton } from "@/src/components/ui/loading";

<Skeleton className="h-12 w-full" variant="rectangular" />;
```

**Props:**

- `variant`: "text" | "rectangular" | "circular"
- `width`: string | number
- `height`: string | number
- `animate`: boolean (default: true)
- `className`: Additional CSS classes

#### ShimmerSkeleton

Enhanced skeleton with gradient shimmer effect.

```tsx
import { ShimmerSkeleton } from "@/src/components/ui/loading";

<ShimmerSkeleton className="h-12 w-full bg-white/10" />;
```

**Props:**

- `variant`: "text" | "rectangular" | "circular"
- `className`: Additional CSS classes

#### PulseDots

Animated dots for inline loading states.

```tsx
import { PulseDots } from "@/src/components/ui/loading";

<PulseDots color="primary" />;
```

**Props:**

- `color`: "primary" | "white" | "neutral"
- `className`: Additional CSS classes

#### LoadingOverlay

Full-screen or container overlay with spinner.

```tsx
import { LoadingOverlay } from "@/src/components/ui/loading";

<LoadingOverlay message="Loading content..." />;
```

**Props:**

- `message`: Optional loading message
- `className`: Additional CSS classes

### 2. Block-Specific Skeletons

Location: `src/components/skeletons/BlockSkeletons.tsx`

These components match the exact layout of their corresponding content blocks:

- `VideoHeroSkeleton` - For VideoHero component
- `HeroBlockSkeleton` - For HeroBlock component
- `ServicesBlockSkeleton` - For ServicesBlock component
- `AboutBlockSkeleton` - For AboutBlock component
- `CTABlockSkeleton` - For CTABlock component
- `TestimonialBlockSkeleton` - For testimonial sections
- `FAQBlockSkeleton` - For FAQ sections
- `GenericBlockSkeleton` - Fallback for unknown blocks
- `PageSkeleton` - Combines multiple blocks for full page loading

**Usage:**

```tsx
import { VideoHeroSkeleton } from "@/src/components/skeletons";

export default function Loading() {
  return <VideoHeroSkeleton />;
}
```

### 3. Next.js App Router Loading States

Location: `src/app/loading.tsx` (and other route-specific loading.tsx files)

Next.js automatically shows these components while Server Components are fetching data.

```tsx
// src/app/loading.tsx
import { PageSkeleton } from "@/src/components/skeletons";

export default function Loading() {
  return <PageSkeleton />;
}
```

### 4. Client-Side Loading (VideoHero Example)

For components that need dynamic loading states on the client:

**VideoHeroContent Component:**
Location: `src/components/blocks/VideoHeroContent.tsx`

This client component handles loading states for text content while keeping the video background visible.

```tsx
<VideoHeroContent
  badge="INTERNATIONAL STANDARD"
  titleLines={data.titleLines}
  subtitle={data.subtitle}
  ctaText={data.ctaText}
  showLoadingState={false}
/>
```

**Props:**

- `badge`: Badge text
- `titleLines`: Array of title line objects
- `subtitle`: Subtitle text
- `ctaText`: CTA button text
- `showLoadingState`: Whether to show loading skeletons

## Implementation Examples

### Example 1: Adding Loading to a New Page

```tsx
// src/app/my-page/page.tsx
export default async function MyPage() {
  const data = await getMyPageData();
  return <MyPageContent data={data} />;
}

// src/app/my-page/loading.tsx
import { GenericBlockSkeleton } from "@/src/components/skeletons";

export default function Loading() {
  return <GenericBlockSkeleton />;
}
```

### Example 2: Creating a Custom Skeleton

```tsx
// src/components/skeletons/MyCustomSkeleton.tsx
import { Skeleton, ShimmerSkeleton } from "@/src/components/ui/loading";

export function MyCustomSkeleton() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <ShimmerSkeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Example 3: Button Loading State

```tsx
import { Spinner } from "@/src/components/ui/loading";

function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner size="sm" color="white" />
          <span>Submitting...</span>
        </>
      ) : (
        "Submit"
      )}
    </button>
  );
}
```

### Example 4: Conditional Content Loading

```tsx
import { LoadingOverlay } from "@/src/components/ui/loading";

function DataDisplay({ data, isLoading }) {
  return (
    <div className="relative">
      {isLoading && <LoadingOverlay message="Fetching latest data..." />}
      <div className={isLoading ? "opacity-50" : ""}>
        {/* Your content here */}
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Match Layout Exactly

Skeleton components should match the exact layout of the actual content to prevent layout shift.

```tsx
// ✅ Good - matches actual content structure
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-6 w-3/4" />
</div>

// ❌ Bad - different structure
<Skeleton className="h-32 w-full" />
```

### 2. Use Appropriate Loading States

- **Spinner**: For actions (button clicks, form submissions)
- **Skeleton**: For content placeholders (text, images, cards)
- **ShimmerSkeleton**: For premium feel on hero sections
- **LoadingOverlay**: For full-screen or modal loading

### 3. Avoid Loading States for Images

Images should use the `poster` attribute or `placeholder` prop instead of skeletons to prevent layout shift.

```tsx
// ✅ Good - using Next.js Image with placeholder
<Image
  src={imageUrl}
  alt="Description"
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>;

// ❌ Bad - skeleton for images causes layout shift
{
  isLoading ? <Skeleton className="h-64" /> : <img src={imageUrl} />;
}
```

### 4. Performance Considerations

- Keep skeleton animations simple (pulse or shimmer only)
- Avoid complex animations on mobile devices
- Use CSS animations instead of JavaScript
- Minimize skeleton component complexity

### 5. Accessibility

All loading components include proper ARIA attributes:

```tsx
<div role="status" aria-label="Loading content">
  <span className="sr-only">Loading...</span>
</div>
```

## Strapi CMS Integration

### Where Loading States Are Applied

1. **Homepage** (`src/app/page.tsx`)
   - Shows `PageSkeleton` while fetching homepage data
   - Includes VideoHero, Services, About, and other blocks

2. **Dynamic Pages** (`src/app/[slug]/page.tsx`)
   - Shows appropriate skeleton based on page type
   - Handles all CMS-driven pages

3. **VideoHero Component** (`src/components/blocks/VideoHero.tsx`)
   - Background video/image loads immediately (no skeleton)
   - Text content can show shimmer skeletons
   - Prevents LCP (Largest Contentful Paint) issues

### API Call Pattern

```tsx
// Server Component (automatic loading state)
export default async function Page() {
  const data = await getHomepage(); // Strapi API call
  return <BlockRenderer layout={data.blocks} />;
}

// loading.tsx shows automatically during fetch
```

## Tailwind Configuration

The shimmer animation is configured in `tailwind.config.ts`:

```typescript
animation: {
  shimmer: 'shimmer 2s infinite',
},
keyframes: {
  shimmer: {
    '100%': { transform: 'translateX(100%)' },
  },
},
```

## Testing Loading States

### Manual Testing

1. **Slow Network Simulation:**
   - Open Chrome DevTools
   - Go to Network tab
   - Select "Slow 3G" or "Fast 3G"
   - Reload page to see loading states

2. **Artificial Delay:**
   ```tsx
   // Add delay to API calls for testing
   await new Promise((resolve) => setTimeout(resolve, 2000));
   const data = await getHomepage();
   ```

### Visual Regression Testing

Ensure loading states match content layout:

1. Take screenshot of loading state
2. Take screenshot of loaded content
3. Compare layouts for consistency

## Troubleshooting

### Issue: Loading state doesn't show

**Solution:** Ensure you have a `loading.tsx` file in the same directory as your `page.tsx`.

### Issue: Layout shift when content loads

**Solution:** Make sure skeleton dimensions match actual content dimensions exactly.

### Issue: Shimmer animation not working

**Solution:** Verify tailwind.config.ts includes the shimmer keyframe and animation.

### Issue: Loading state shows too briefly

**Solution:** This is actually good! It means your API is fast. Consider removing the loading state if it's consistently under 200ms.

## Future Enhancements

Potential improvements to consider:

1. **Progressive Loading**: Load critical content first, then secondary content
2. **Optimistic UI**: Show expected content immediately, update when data arrives
3. **Skeleton Variants**: Different skeleton styles for different themes
4. **Loading Analytics**: Track how often and how long loading states are shown
5. **Smart Caching**: Reduce loading states by caching frequently accessed data

## Related Documentation

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Web Vitals - LCP](https://web.dev/lcp/)
- [Skeleton Screens](https://www.nngroup.com/articles/skeleton-screens/)

## Summary

The loading state system provides:

✅ Consistent user experience during data fetching
✅ Reduced perceived loading time
✅ Better Core Web Vitals scores
✅ Accessible loading indicators
✅ Reusable components for all loading scenarios
✅ Optimized for Strapi CMS integration

For questions or improvements, refer to the component source code or update this documentation.
