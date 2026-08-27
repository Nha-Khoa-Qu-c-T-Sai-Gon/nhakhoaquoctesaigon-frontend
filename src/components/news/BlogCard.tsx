"use client";

import React from "react";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { MotionDiv } from "@/src/components/ui/MotionDiv";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import type { BlogPost } from "@/src/types/blog";

interface BlogCardProps {
  /**
   * Blog post data to render
   */
  blog: BlogPost;
  /**
   * Strapi URL for relative media URLs
   */
  strapiUrl: string;
  /**
   * Translated 'Read more' text label
   */
  readMoreText: string;
}

/**
 * BlogCard component displays individual articles in a clean visual layout.
 * Optimized for grid presentation.
 */
export function BlogCard({
  blog,
  strapiUrl,
  readMoreText,
}: BlogCardProps) {
  const { shouldSimplify } = useMobileAnimation();
  const imageUrl = blog.imageUrl
    ? blog.imageUrl.startsWith("http")
      ? blog.imageUrl
      : `${strapiUrl}${blog.imageUrl}`
    : "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=800";

  return (
    <MotionDiv
      whileHover={shouldSimplify ? undefined : { y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-white rounded-[32px] overflow-hidden border border-slate-100/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
    >
      <NavigationLink href={`/news/${blog.slug}`} className="block">
        {/* Top: Image */}
        <div className="relative h-72 overflow-hidden">
          <MotionDiv
            className="w-full h-full"
            whileHover={shouldSimplify ? undefined : { scale: 1.08 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={imageUrl}
              alt={blog.imageAlt || blog.title}
              fill
              className="object-cover"
            />
          </MotionDiv>

          {/* Subtle Category Badge */}
          {blog.category && (
            <div className="absolute top-6 left-6 hidden sm:block">
              <span className="inline-block px-4 py-2 bg-white/95 backdrop-blur text-foreground rounded-xl text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest shadow-lg">
                {blog.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 text-slate-500 text-sm sm:text-base md:text-lg font-semibold mb-3 uppercase tracking-[0.2em] flex-wrap">
            {blog.category && (
              <span className="sm:hidden inline-block px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-xs font-bold uppercase tracking-widest">
                {blog.category}
              </span>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-[1.2] tracking-tight">
            {blog.title}
          </h3>

          {blog.excerpt && (
            <p className="text-sm sm:text-base md:text-lg text-foreground-secondary mb-4 line-clamp-3 leading-relaxed font-normal">
              {blog.excerpt}
            </p>
          )}

          <div className="inline-flex items-center gap-3 text-slate-900 text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest group-hover:text-blue-600 group-hover:translate-x-2 transition-all">
            <span>{readMoreText}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </NavigationLink>
    </MotionDiv>
  );
}
