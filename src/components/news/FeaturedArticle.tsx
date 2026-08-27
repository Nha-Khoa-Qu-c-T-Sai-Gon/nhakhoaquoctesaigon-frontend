"use client";

import React from "react";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import type { BlogPost } from "@/src/types/blog";

interface FeaturedArticleProps {
  /**
   * Blog post data to render as featured
   */
  blog: BlogPost;
  /**
   * Strapi URL for relative media URLs
   */
  strapiUrl: string;
  /**
   * Translated 'Read now' text label
   */
  readNowText: string;
}

/**
 * FeaturedArticle component highlights a main article in a detailed layout.
 * Combines full height visuals and descriptions in a 2-column container.
 */
export function FeaturedArticle({
  blog,
  strapiUrl,
  readNowText,
}: FeaturedArticleProps) {
  const { shouldSimplify } = useMobileAnimation();
  const imageUrl = blog.imageUrl
    ? blog.imageUrl.startsWith("http")
      ? blog.imageUrl
      : `${strapiUrl}${blog.imageUrl}`
    : "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=1200";

  return (
    <article className="group bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/40 border border-slate-100 hover:shadow-slate-300/50 transition-all duration-700">
      <NavigationLink href={`/news/${blog.slug}`} className="block">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-0 lg:min-h-[520px]">
          {/* Left: large image */}
          <div className="relative overflow-hidden aspect-video lg:aspect-auto">
            <MotionDiv
              className="w-full h-full"
              whileHover={shouldSimplify ? undefined : { scale: 1.05 }}
              transition={{ duration: 1.2 }}
            >
              <Image
                src={imageUrl}
                alt={blog.imageAlt || blog.title}
                fill
                className="object-cover"
                priority
              />
            </MotionDiv>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
          </div>

          {/* Right: content block */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="inline-block px-4 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest">
                {blog.category}
              </span>
              <div className="flex items-center gap-2 text-slate-500 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 group-hover:text-blue-600 transition-colors leading-[1.15] tracking-tight">
              {blog.title}
            </h2>

            {blog.excerpt && (
              <p className="text-sm sm:text-base md:text-lg text-foreground-secondary mb-5 line-clamp-3 leading-relaxed font-normal">
                {blog.excerpt}
              </p>
            )}

            <div className="inline-flex items-center gap-4 text-slate-900 font-bold group-hover:text-blue-600 group-hover:translate-x-3 transition-all">
              <span className="text-sm sm:text-base md:text-lg tracking-tight uppercase">
                {readNowText}
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </NavigationLink>
    </article>
  );
}
