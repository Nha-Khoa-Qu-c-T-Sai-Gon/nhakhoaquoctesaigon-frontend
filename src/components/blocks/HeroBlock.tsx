"use client";

import Image from "next/image";
import type { HomepageHeroBlock } from "@/src/types/strapi";
import {
  SectionTitle,
  SectionSubtitle,
} from "@/src/components/ui/SectionHeader";
import { BookingButton } from "@/src/components/ui/BookingButton";
import { useMobileAnimation } from "@/src/hooks/useMobileAnimation";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";

interface HeroBlockProps {
  data: HomepageHeroBlock;
}

export function HeroBlock({ data }: HeroBlockProps) {
  const { shouldSimplify } = useMobileAnimation();

  return (
    <section className="hero-block relative w-full overflow-hidden bg-[#fafcff]">
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#f7fbff] to-[#eaf4ff]" />

        {/* Animated background blobs — static on mobile */}
        {!shouldSimplify ? (
          <>
            <div
              className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-100/30 blur-[130px] rounded-full animate-kf-blob"
              style={{ animationDuration: "10s" }}
            />
            <div
              className="absolute bottom-[0%] -left-[10%] w-[600px] h-[600px] bg-primary-50/40 blur-[120px] rounded-full animate-kf-blob"
              style={{ animationDuration: "15s", animationDelay: "2s" }}
            />
          </>
        ) : (
          <>
            <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-100/20 blur-[130px] rounded-full opacity-30" />
            <div className="absolute bottom-0 -left-[10%] w-[600px] h-[600px] bg-primary-50/30 blur-[120px] rounded-full opacity-40" />
          </>
        )}

        {/* Subtle grid pattern for texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#165197 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 sm:px-6 pt-12 pb-8 sm:pt-16 md:pb-12 lg:pt-20 lg:pb-16">
        {/* Main Content Grid: Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Badge, Title, Subtitle, Booking, Trust */}
          <div className="lg:col-span-6 lg:order-1 flex flex-col justify-center text-center lg:text-left">
            <div className="space-y-4 mb-10">
              <DecorativeBadge
                text="World-Class Clinical Care"
                variant="primary"
                align="responsive"
              />
              <SectionTitle
                as="h1"
                className="text-[#165197] leading-[1.1] !mb-0"
              >
                {data.heading}
              </SectionTitle>
              {data.subheading && (
                <SectionSubtitle className="text-[#165197]/80 mx-auto lg:mx-0 !mt-6">
                  {data.subheading}
                </SectionSubtitle>
              )}
            </div>

            {/* Booking Button and Trust Indicators */}
            {shouldSimplify ? (
              <div className="flex flex-col items-center lg:items-start">
                {/* Mobile Layout */}
                <div className="flex flex-col gap-4 sm:hidden w-full">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-[#165197]/90">
                      Trusted by{" "}
                      <span className="font-bold text-[#165197]">
                        2,000+ patients
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex -space-x-2">
                      {data.userAvatars && data.userAvatars.length > 0
                        ? data.userAvatars.slice(0, 4).map((avatar, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                            >
                              <Image
                                src={avatar.url}
                                alt={avatar.alt}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))
                        : [1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                            >
                              <Image
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                                alt="Patient"
                                width={40}
                                height={40}
                              />
                            </div>
                          ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-[12px] font-bold text-white uppercase tracking-tighter">
                        +2k
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                  <div className="hidden sm:block">
                    <BookingButton
                      label={data.ctaLabel}
                      className="h-16 px-12 rounded-full"
                    />
                  </div>
                  <div className="flex -space-x-2">
                    {data.userAvatars && data.userAvatars.length > 0
                      ? data.userAvatars.slice(0, 4).map((avatar, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                          >
                            <Image
                              src={avatar.url}
                              alt={avatar.alt}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))
                      : [1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                          >
                            <Image
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                              alt="Patient"
                              width={40}
                              height={40}
                            />
                          </div>
                        ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-[12px] font-bold text-white uppercase tracking-tighter">
                      +2k
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 text-yellow-500 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-[#165197]/90 leading-tight whitespace-nowrap">
                      Trusted by{" "}
                      <span className="font-bold text-[#165197]">
                        2,000+ patients
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <PerformanceAnimation
                preset="slide-up-subtle"
                whileInView={true}
                className="flex flex-col items-center lg:items-start"
              >
                {/* Mobile Layout */}
                <div className="flex flex-col gap-4 sm:hidden w-full">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-[#165197]/90">
                      Trusted by{" "}
                      <span className="font-bold text-[#165197]">
                        2,000+ patients
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex -space-x-2">
                      {data.userAvatars && data.userAvatars.length > 0
                        ? data.userAvatars.slice(0, 4).map((avatar, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                            >
                              <Image
                                src={avatar.url}
                                alt={avatar.alt}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))
                        : [1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                            >
                              <Image
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                                alt="Patient"
                                width={40}
                                height={40}
                              />
                            </div>
                          ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-[12px] font-bold text-white uppercase tracking-tighter">
                        +2k
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                  <div className="hidden sm:block">
                    <BookingButton
                      label={data.ctaLabel}
                      className="h-16 px-12 rounded-full"
                    />
                  </div>
                  <div className="flex -space-x-2">
                    {data.userAvatars && data.userAvatars.length > 0
                      ? data.userAvatars.slice(0, 4).map((avatar, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                          >
                            <Image
                              src={avatar.url}
                              alt={avatar.alt}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))
                      : [1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                          >
                            <Image
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                              alt="Patient"
                              width={40}
                              height={40}
                            />
                          </div>
                        ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-[12px] font-bold text-white uppercase tracking-tighter">
                      +2k
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className="w-3 h-3 text-yellow-500 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-[#165197]/90 leading-tight whitespace-nowrap">
                      Trusted by{" "}
                      <span className="font-bold text-[#165197]">
                        2,000+ patients
                      </span>
                    </p>
                  </div>
                </div>
              </PerformanceAnimation>
            )}
          </div>

          {/* Right Column: Hero Image */}
          {data.image && (
            <PerformanceAnimation
              preset="slide-right"
              whileInView={true}
              delay={0.2}
              className="lg:col-span-6 lg:order-2 relative w-full h-[350px] sm:h-[450px] lg:h-[700px] flex items-center justify-center lg:justify-end"
            >
              <div
                className={`relative w-full h-full z-10 ${!shouldSimplify ? "animate-kf-float" : ""}`}
                style={!shouldSimplify ? { animationDuration: "8s" } : {}}
              >
                <Image
                  src={data.image.url}
                  alt={data.image.alt || "Clinic Hero"}
                  fill
                  priority
                  className="object-contain object-center lg:object-right"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Decorative elements behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-60">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-200/20 blur-[100px] rounded-full" />
                <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-primary-100/30 blur-[60px] rounded-full mix-blend-multiply" />
              </div>

              {/* Floating Badge */}
              <div
                className={`absolute top-[15%] right-[5%] z-20 hidden lg:flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-2xl ${!shouldSimplify ? "animate-kf-float" : ""}`}
                style={
                  !shouldSimplify
                    ? { animationDuration: "5s", animationDelay: "1s" }
                    : {}
                }
              >
                <div className="text-primary-600 font-bold text-3xl tracking-tighter mb-0.5">
                  15+
                </div>
                <div className="text-[11px] font-medium text-[#3b5982] leading-tight text-center px-4">
                  Years of Excellence
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#165197] flex items-center justify-center text-white">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>
              </div>
            </PerformanceAnimation>
          )}
        </div>
      </div>
    </section>
  );
}
