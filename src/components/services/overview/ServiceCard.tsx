"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { NavigationLink } from "@/src/components/ui/NavigationLink";

interface ServiceItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = service.image && !imgError;

  // ── CATEGORY DESIGN SYSTEM ──────────────────────────────────────────────
  const categoryStyles: Record<
    string,
    { bg: string; text: string; icon: string }
  > = {
    Cosmetic: {
      bg: "from-purple-50 via-pink-50 to-white",
      text: "text-pink-700",
      icon: "text-pink-300",
    },
    Implants: {
      bg: "from-blue-50 via-indigo-50 to-white",
      text: "text-blue-700",
      icon: "text-blue-300",
    },
    Orthodontics: {
      bg: "from-teal-50 via-emerald-50 to-white",
      text: "text-teal-700",
      icon: "text-teal-300",
    },
    General: {
      bg: "from-slate-50 via-blue-50 to-white",
      text: "text-slate-700",
      icon: "text-slate-300",
    },
    Default: {
      bg: "from-blue-50 to-indigo-50",
      text: "text-blue-700",
      icon: "text-blue-300",
    },
  };

  const theme =
    categoryStyles[service.category] || categoryStyles.Default;

  return (
    <NavigationLink
      href={`/services/${service.slug}`}
      className="group block h-full"
    >
      <div className="h-full overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col">
        {/* Image / Background Area (aspect-4/3) */}
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${theme.bg}`}
        >
          {showImage ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => {
                setImgError(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <svg
                className={`w-20 h-20 ${theme.icon}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60" />

          <span
            className={`absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${theme.text} backdrop-blur-sm shadow-sm`}
          >
            {service.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-blue-700 transition-colors duration-200 mb-1.5">
            {service.title}
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-foreground-secondary leading-relaxed mb-4 line-clamp-2 font-medium">
            {service.description}
          </p>
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-primary-600 group-hover:gap-2 transition-all duration-200">
            Explore service
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </NavigationLink>
  );
}
