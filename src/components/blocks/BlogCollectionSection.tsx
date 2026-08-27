"use client";

import Image from "next/image";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { HoverCard } from "@/src/components/ui/HoverCard";
import { cn } from "@/src/lib/utils";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  createdAt?: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface BlogCollectionSectionProps {
  title: string;
  subtitle?: string;
  posts: BlogPost[];
  isActive?: boolean;
}

/**
 * BlogCard
 *
 * Uses HoverCard so the lift transform lives on an inner div and never
 * misaligns the outer hit area. Shadow / border change is driven by the
 * `hovered` render-prop value, not CSS :hover.
 */
function BlogCard({
  post,
  index,
  strapiUrl,
}: {
  post: BlogPost;
  index: number;
  strapiUrl: string;
}) {
  const resolvedSrc = (() => {
    const url = post.imageUrl;
    if (typeof url !== "string" || !url) return null;
    if (url.startsWith("http")) return url;
    return strapiUrl ? `${strapiUrl}${url}` : null;
  })();

  return (
    <div
      className="h-full animate-kf-fade-in"
      style={{
        animationDelay: `${(index % 3) * 0.08}s`,
        animationFillMode: "both",
      }}
    >
      <HoverCard className="h-full">
        {(hovered) => (
          <NavigationLink
            href={`/news/${post.slug}`}
            className={cn(
              "block bg-white rounded-3xl overflow-hidden border h-full",
              "transition-[box-shadow,border-color] duration-200",
              hovered
                ? "shadow-[0_20px_60px_rgba(30,58,95,0.18)] border-primary-200"
                : "shadow-[0_10px_30px_rgba(30,58,95,0.08)] border-primary-50",
            )}
          >
            {/* Image */}
            <div className="relative h-56 bg-gradient-to-br from-primary-50 to-blue-50 overflow-hidden">
              {resolvedSrc ? (
                <Image
                  src={resolvedSrc}
                  alt={post.imageAlt || post.title || "Blog post"}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-300",
                    hovered ? "scale-110" : "scale-100",
                  )}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                  <svg
                    className="w-14 h-14 text-primary-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c-2 0-4.5 1-4.5 4 0 1.5.5 3 .5 5s-1 5-1 6.5a1.5 1.5 0 003 0c0-1 .5-3 1.5-3s1.5 2 1.5 3a1.5 1.5 0 003 0c0-1.5-1-5-1-6.5s.5-3.5.5-5C16.5 4 14 3 12 3z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-primary-300 uppercase tracking-widest">
                    Dental News
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3
                className={cn(
                  "text-xl font-bold mb-3 transition-colors duration-200 line-clamp-2",
                  hovered ? "text-primary-600" : "text-foreground",
                )}
              >
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-foreground-secondary line-clamp-3 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <time
                  dateTime={post.publishedAt}
                  className="text-xs sm:text-sm text-foreground-muted"
                >
                  {new Date(
                    post.publishedAt || post.createdAt || "",
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span
                  className={cn(
                    "text-xs sm:text-sm text-primary-600 font-medium inline-flex items-center gap-1",
                    "transition-transform duration-200",
                    hovered ? "translate-x-1" : "translate-x-0",
                  )}
                >
                  Read More
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </NavigationLink>
        )}
      </HoverCard>
    </div>
  );
}

export default function BlogCollectionSection({
  title,
  subtitle,
  posts,
  isActive = true,
}: BlogCollectionSectionProps) {
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").replace(
    /\/$/,
    "",
  );

  if (!isActive || !posts || posts.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#F8FBFF]" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary-100/30 blur-[130px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-foreground-secondary mx-auto">
              {subtitle}
            </p>
          )}
        </PerformanceAnimation>

        <div className="relative px-4 sm:px-0">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4 sm:-ml-6">
              {posts.map((post: BlogPost, index: number) => (
                <CarouselItem
                  key={post.id || index}
                  className="pl-4 sm:pl-6 basis-[80%] sm:basis-[55%] lg:basis-1/3"
                >
                  <BlogCard post={post} index={index} strapiUrl={strapiUrl} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
