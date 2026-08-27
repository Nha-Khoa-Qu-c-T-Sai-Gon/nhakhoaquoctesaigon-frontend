"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { cn } from "@/src/lib/utils";

interface VideoHeroBackgroundProps {
  hasVideo: boolean;
  videoUrl: string;
  posterImageUrl?: string;
  mobileBackgroundImageUrl?: string;
}

/**
 * VideoHeroBackground - Adaptive Media Layer
 *
 * Performance:
 * - On Mobile (shouldSimplify): Skips heavy video/iframe logic entirely.
 * - On Desktop: Renders high-quality video or YouTube background.
 * - Uses poster image as a fall-back and LCP placeholder.
 * - Implements Hybrid Poster -> Motion Transition strategy:
 *   1. Instantly render optimized poster image.
 *   2. Preload metadata only.
 *   3. Lazy-load and play video after initial page stabilization (idle time).
 *   4. Fade in video smoothly only after playback actually begins (prevents white/black flashes).
 *   5. Pause video when out of viewport using Intersection Observer.
 */
export function VideoHeroBackground({
  hasVideo,
  videoUrl,
  posterImageUrl,
  mobileBackgroundImageUrl,
}: VideoHeroBackgroundProps) {
  const { prefersReduced, isMobile } = useMobileAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isStable, setIsStable] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Track hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for initial page stabilization to lazy-load video resources
  useEffect(() => {
    if (!mounted) return;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(
        () => {
          setIsStable(true);
        },
        { timeout: 1500 },
      );
      return () => window.cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(() => {
        setIsStable(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Reset playing state when video URL changes
  useEffect(() => {
    setIsVideoPlaying(false);
  }, [videoUrl]);

  const shouldRenderVideo =
    mounted && isStable && !prefersReduced && !isMobile && hasVideo;

  // Intersection Observer: Play/pause video based on viewport visibility
  useEffect(() => {
    if (!shouldRenderVideo || !videoRef.current) return;

    const videoEl = videoRef.current;

    // Explicitly set/update autoplay/preload options when mounting to assist browser caching
    videoEl.preload = "metadata";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch((err) => {
            console.warn(
              "[VideoHeroBackground] Playback interrupted or prevented:",
              err,
            );
          });
        } else {
          videoEl.pause();
        }
      },
      {
        threshold: 0.05, // Trigger as soon as 5% of the element is visible
      },
    );

    observer.observe(videoEl);

    return () => {
      observer.unobserve(videoEl);
      observer.disconnect();
    };
  }, [shouldRenderVideo, videoUrl]);

  // Low CPU Optimization: Show static poster image instead of video entirely
  if (prefersReduced || !hasVideo) {
    return (
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: mobileBackgroundImageUrl
            ? `url(${mobileBackgroundImageUrl})`
            : posterImageUrl
              ? `url(${posterImageUrl})`
              : "none",
          backgroundColor: "#040f1c", // Primary 950 fall-back
        }}
      />
    );
  }

  return (
    <>
      {/* Mobile Layer (< 768px): Shows static background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 md:hidden"
        style={{
          backgroundImage: mobileBackgroundImageUrl
            ? `url(${mobileBackgroundImageUrl})`
            : posterImageUrl
              ? `url(${posterImageUrl})`
              : "none",
          backgroundColor: "#040f1c", // Primary 950 fall-back
        }}
      >
        {/* Dark overlay to ensure background image is not too light */}
        <div className="absolute inset-0 bg-primary-950/50 pointer-events-none" />
      </div>

      {/* Desktop Layer (>= 768px): Plays high-quality video with smooth fade-in */}
      <div className="absolute inset-0 z-0 hidden md:block overflow-hidden bg-primary-950">
        {/* Poster image that fades out once video starts playing */}
        <div
          className={cn(
            "absolute inset-0 z-10 bg-cover bg-center transition-opacity duration-1000 pointer-events-none",
            isVideoPlaying ? "opacity-0" : "opacity-100",
          )}
          style={{
            backgroundImage: posterImageUrl ? `url(${posterImageUrl})` : "none",
            backgroundColor: "#040f1c",
          }}
        />

        {shouldRenderVideo ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="metadata"
            onPlaying={() => setIsVideoPlaying(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000",
              isVideoPlaying ? "opacity-100" : "opacity-0",
            )}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>
    </>
  );
}
