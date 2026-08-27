"use client";

import Image from "next/image";
import type { HomepageAboutBlock } from "@/src/types/strapi";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";

interface AboutBlockProps {
  data: HomepageAboutBlock;
}

export function AboutBlock({ data }: AboutBlockProps) {

  return (
    <section
      className="about-block w-full py-16 md:py-24"
      style={{ background: "#FFFFFF" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content — slide-right entrance */}
          <PerformanceAnimation
            preset="slide-right"
            whileInView={true}
            duration={0.6}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {data.title}
            </h2>
            <div className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed whitespace-pre-line">
              {data.content}
            </div>
          </PerformanceAnimation>

          {/* Image — slide-left entrance */}
          {data.image && (
            <PerformanceAnimation
              preset="slide-left"
              whileInView={true}
              duration={0.6}
              className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src={data.image.url}
                alt={data.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </PerformanceAnimation>
          )}
        </div>
      </div>
    </section>
  );
}
