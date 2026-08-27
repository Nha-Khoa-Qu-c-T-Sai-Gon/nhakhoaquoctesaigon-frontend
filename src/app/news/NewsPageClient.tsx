"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { EN_MAP, STATIC_CATEGORIES } from "@/src/lib/constants/news";
import { NewsHeroSection } from "@/src/components/news/NewsHeroSection";
import { CategoryFilter } from "@/src/components/news/CategoryFilter";
import { FeaturedArticle } from "@/src/components/news/FeaturedArticle";
import { BlogCard } from "@/src/components/news/BlogCard";

import type { BlogPost } from "@/src/types/blog";

interface NewsPageClientProps {
  initialBlogs: BlogPost[];
  featuredBlog?: BlogPost;
  popularBlogs: BlogPost[];
  strapiUrl: string;
}

export function NewsPageClient({
  initialBlogs,
  featuredBlog: initialFeaturedBlog,
  popularBlogs: _popularBlogs,
  strapiUrl,
}: NewsPageClientProps) {
  const { shouldSimplify } = useMobileAnimation();
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(initialBlogs);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filtered = [...initialBlogs];

    if (activeCategory !== "all") {
      const categoryLabel = STATIC_CATEGORIES.find(
        (c) => c.id === activeCategory,
      )?.label;
      filtered = filtered.filter((blog) => blog.category === categoryLabel);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredBlogs(filtered);
  }, [activeCategory, searchQuery, initialBlogs]);

  const featuredBlog = filteredBlogs[0] || initialFeaturedBlog;
  const regularBlogs = filteredBlogs.slice(1);

  const translate = (text: string) => EN_MAP[text] || text;

  return (
    <div className="min-h-screen bg-slate-50/30 selection:bg-blue-100 selection:text-blue-900">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-blue-50/30 to-white" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)] blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)] blur-[60px]" />
      </div>

      {/* Hero Header Section */}
      <NewsHeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        strapiUrl={strapiUrl}
        translate={translate}
        shouldSimplify={shouldSimplify}
      />

      {/* Sticky Category Filter */}
      <CategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        translate={translate}
        shouldSimplify={shouldSimplify}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <AnimatePresence mode="wait">
          {filteredBlogs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 font-normal">
                {translate("No articles found.")}
              </p>
            </motion.div>
          ) : (
            <div key="content" className="space-y-20">
              {/* Featured Article Section */}
              {featuredBlog && (
                <PerformanceAnimation
                  preset="slide-up-subtle"
                  delay={0.2}
                  whileInView={true}
                >
                  <FeaturedArticle
                    blog={featuredBlog}
                    strapiUrl={strapiUrl}
                    readNowText={translate("Read Now")}
                  />
                </PerformanceAnimation>
              )}

              {/* Regular Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {regularBlogs.map((blog, index) => (
                  <PerformanceAnimation
                    key={blog.id}
                    preset="slide-up-subtle"
                    delay={0.1 * index}
                    whileInView={true}
                  >
                    <BlogCard
                      blog={blog}
                      strapiUrl={strapiUrl}
                      readMoreText={translate("Read More")}
                    />
                  </PerformanceAnimation>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
export default NewsPageClient;
