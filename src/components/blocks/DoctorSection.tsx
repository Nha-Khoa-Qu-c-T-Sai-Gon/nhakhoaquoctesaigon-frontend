"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import type { HomepageDoctorBlock } from "@/src/types/strapi";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { useCertificateModal } from "@/src/components/providers/CertificateModalContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/src/components/ui/carousel";

interface DoctorSectionProps {
  data: HomepageDoctorBlock;
}

// ─── Avatar placeholder ───────────────────────────────────────────────────────
function AvatarPlaceholder() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #1a3a6b 0%, #2563a8 100%)",
      }}
    >
      <svg className="w-24 h-24 opacity-25" fill="white" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

// ─── Shared gradient scrim ────────────────────────────────────────────────────
function Scrim({ strong = false }: { strong?: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: strong
          ? "linear-gradient(to top, rgba(4,16,44,0.95) 0%, rgba(4,16,44,0.65) 30%, rgba(4,16,44,0.2) 55%, transparent 75%)"
          : "linear-gradient(to top, rgba(4,16,44,0.93) 0%, rgba(4,16,44,0.55) 38%, rgba(4,16,44,0.08) 60%, transparent 78%)",
      }}
    />
  );
}

// ─── Featured (Lead Specialist) card ─────────────────────────────────────────
// Fills height naturally — no fixed aspect-ratio so it matches sibling cards
function FeaturedCard({
  doctor,
  strapiUrl,
}: {
  doctor: HomepageDoctorBlock["doctors"][number];
  strapiUrl: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { open: openLightbox } = useCertificateModal();

  // Profile image shown on the card (always)
  const resolvedImageUrl = doctor.image?.url
    ? doctor.image.url.startsWith("http")
      ? doctor.image.url
      : strapiUrl
        ? `${strapiUrl}${doctor.image.url}`
        : null
    : null;

  // Certificate image shown in the lightbox modal (separate from profile photo)
  const resolvedCertUrl = doctor.certificateImage?.url
    ? doctor.certificateImage.url.startsWith("http")
      ? doctor.certificateImage.url
      : strapiUrl
        ? `${strapiUrl}${doctor.certificateImage.url}`
        : null
    : null;

  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      duration={0.7}
      className="relative w-full"
      style={{ aspectRatio: "3/4" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (resolvedCertUrl)
            openLightbox(resolvedCertUrl, `${doctor.name} — Certificate`);
        }}
        className={`relative rounded-2xl md:rounded-3xl overflow-hidden w-full h-full transition-[box-shadow] duration-[450ms] ease-out ${resolvedCertUrl ? "cursor-pointer" : ""} ${hovered ? "shadow-[0_32px_80px_rgba(22,81,151,0.3),0_8px_24px_rgba(0,0,0,0.16)]" : "shadow-[0_12px_40px_rgba(0,0,0,0.16)]"}`}
      >
        {/* Unset aspect-ratio on md+ so height fills grid */}
        <style>{`@media (min-width: 768px) { .featured-card { aspect-ratio: unset !important; } }`}</style>

        {/* Full-bleed portrait image */}
        {resolvedImageUrl ? (
          <div
            className={`absolute inset-0 transition-transform duration-700 ease-out ${hovered ? "scale-105" : "scale-100"}`}
          >
            <Image
              src={resolvedImageUrl}
              alt={doctor.image?.alt ?? doctor.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <AvatarPlaceholder />
        )}

        <Scrim strong />

        {/* Zoom overlay on hover — only when certificate image exists */}
        {resolvedCertUrl && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none transition-opacity duration-200 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl transition-transform duration-200 ${
                hovered ? "scale-100" : "scale-75"
              }`}
            >
              <ZoomIn className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        )}

        {/* Lead badge — top-left */}
        <PerformanceAnimation
          preset="slide-right"
          whileInView={true}
          delay={0.35}
          className="absolute top-4 left-4 z-20"
        >
          <span
            className="text-xs sm:text-sm md:text-base inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white"
            style={{
              background: "linear-gradient(90deg,#165197,#1e6ab5)",
              boxShadow: "0 4px 14px rgba(22,81,151,0.55)",
            }}
          >
            <svg
              className="w-2.5 h-2.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Lead Specialist
          </span>
        </PerformanceAnimation>

        {/* Experience badge — top-right */}
        {doctor.experienceYears && (
          <div className="absolute top-4 right-4 z-20">
            <span
              className="text-xs sm:text-sm md:text-base text-[11px] sm:font-bold px-3 py-1.5 rounded-full text-white"
              style={{
                background: "rgba(255,255,255,0.16)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              {doctor.experienceYears}+ yrs exp.
            </span>
          </div>
        )}

        {/* Info overlay — bottom */}
        <div className="absolute bottom-0 inset-x-0 z-10 p-5 sm:p-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-1 drop-shadow-md">
            {doctor.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-3">
            {doctor.specialization && (
              <span className="text-xs sm:text-sm md:text-base text-blue-300 font-semibold">
                {doctor.specialization}
              </span>
            )}
          </div>
          {doctor.bio && (
            <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-sm">
              {doctor.bio}
            </p>
          )}
          {doctor.badges && doctor.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {doctor.badges.map((b) => (
                <span
                  key={b}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover border glow — desktop only */}
        <div
          className={`absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none transition-opacity duration-300 border-2 border-blue-500/50 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </PerformanceAnimation>
  );
}

// ─── Standard doctor card ─────────────────────────────────────────────────────
function DoctorCard({
  doctor,
  delay,
  strapiUrl,
}: {
  doctor: HomepageDoctorBlock["doctors"][number];
  delay: number;
  strapiUrl: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { open: openLightbox } = useCertificateModal();

  // Profile image shown on the card (always)
  const resolvedImageUrl = doctor.image?.url
    ? doctor.image.url.startsWith("http")
      ? doctor.image.url
      : strapiUrl
        ? `${strapiUrl}${doctor.image.url}`
        : null
    : null;

  // Certificate image shown in the lightbox modal (separate from profile photo)
  const resolvedCertUrl = doctor.certificateImage?.url
    ? doctor.certificateImage.url.startsWith("http")
      ? doctor.certificateImage.url
      : strapiUrl
        ? `${strapiUrl}${doctor.certificateImage.url}`
        : null
    : null;

  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      delay={delay}
      className="relative w-full"
      style={{ aspectRatio: "3/4" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (resolvedCertUrl)
            openLightbox(resolvedCertUrl, `${doctor.name} — Certificate`);
        }}
        className={`relative rounded-2xl overflow-hidden w-full h-full transition-[transform,box-shadow] duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${resolvedCertUrl ? "cursor-pointer" : ""} ${hovered ? "-translate-y-[5px] shadow-[0_24px_64px_rgba(22,81,151,0.25),0_6px_20px_rgba(0,0,0,0.14)]" : "translate-y-0 shadow-[0_8px_28px_rgba(0,0,0,0.13)]"}`}
      >
        {resolvedImageUrl ? (
          <div
            className={`absolute inset-0 transition-transform duration-700 ease-out ${hovered ? "scale-105" : "scale-100"}`}
          >
            <Image
              src={resolvedImageUrl}
              alt={doctor.image?.alt ?? doctor.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <AvatarPlaceholder />
        )}

        <Scrim />

        {/* Zoom overlay on hover — only when certificate image exists */}
        {resolvedCertUrl && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none transition-opacity duration-200 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl transition-transform duration-200 ${
                hovered ? "scale-100" : "scale-75"
              }`}
            >
              <ZoomIn className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        )}

        {/* Experience badge — top-right */}
        {doctor.experienceYears && (
          <div className="absolute top-3 right-3 z-20">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
              style={{
                background: "rgba(22,81,151,0.78)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {doctor.experienceYears}+ yrs
            </span>
          </div>
        )}

        {/* Info overlay — bottom */}
        <div className="absolute bottom-0 inset-x-0 z-10 p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-0.5 drop-shadow">
            {doctor.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-2">
            {doctor.specialization && (
              <span className="text-xs sm:text-sm md:text-base text-blue-300 font-semibold">
                {doctor.specialization}
              </span>
            )}
          </div>

          {doctor.stats && doctor.stats.length > 0 && (
            <div className="flex flex-col gap-1 mb-2">
              {doctor.stats.slice(0, 2).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500/40 flex items-center justify-center shrink-0">
                    <svg
                      className="w-2 h-2 text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-[11px] text-white/80 font-medium">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          )}

          {doctor.badges && doctor.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {doctor.badges.slice(0, 3).map((b) => (
                <span
                  key={b}
                  className="text-xs sm:text-sm md:text-base text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 border-2 border-blue-500/45 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </PerformanceAnimation>
  );
}

// ─── Trust strip ──────────────────────────────────────────────────────────────
function TrustStrip() {
  const items = [
    "Internationally trained specialists",
    "10+ years average experience",
    "Advanced implant & cosmetic expertise",
  ];
  return (
    <PerformanceAnimation
      preset="slide-up-subtle"
      whileInView={true}
      delay={0.2}
      className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-2 sm:gap-3"
    >
      {items.map((label) => (
        <span
          key={label}
          className="text-xs sm:text-sm md:text-base inline-flex items-center gap-2 sm:font-medium px-4 py-2 rounded-full"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(22,81,151,0.15)",
            color: "#165197",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "#165197" }}
          />
          {label}
        </span>
      ))}
    </PerformanceAnimation>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function DoctorSection({ data }: DoctorSectionProps) {
  // Resolve Strapi base URL — same pattern as CertificationSection
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").replace(
    /\/$/,
    "",
  );

  const doctors = data.doctors;
  const [featured, ...rest] = doctors;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!data.doctors || data.doctors.length === 0) return null;

  return (
    <section
      className="relative py-16 sm:py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #eef6ff 40%, #dce9fc 100%)",
      }}
    >
      {/* Radial glows — use Tailwind blur class, not inline filter */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none blur-[48px] opacity-80"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(22,81,151,0.08), transparent 58%)",
          transform: "translate(-25%,-25%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none blur-[40px] opacity-80"
        style={{
          background:
            "radial-gradient(circle at 75% 80%, rgba(56,130,246,0.07), transparent 58%)",
          transform: "translate(25%,25%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="text-center mb-10 sm:mb-14"
        >
          {/* Decorative badge */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            delay={0.1}
          >
            <DecorativeBadge
              text="Our Specialists"
              variant="primary"
              align="center"
              className="mb-4"
            />
          </PerformanceAnimation>

          <AnimatedSectionHeader
            title={data.title}
            subtitle={data.subtitle}
            className="mb-0"
          />
        </PerformanceAnimation>

        {doctors.length === 1 ? (
          <div className="max-w-sm mx-auto">
            <FeaturedCard doctor={featured} strapiUrl={strapiUrl} />
          </div>
        ) : doctors.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <FeaturedCard doctor={featured} strapiUrl={strapiUrl} />
            <DoctorCard doctor={rest[0]} delay={0.1} strapiUrl={strapiUrl} />
          </div>
        ) : (
          <div className="relative px-4 sm:px-12 max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {doctors.map((doctor, i) => (
                  <CarouselItem
                    key={doctor.id}
                    className="pl-4 basis-[85%] sm:basis-[60%] md:basis-[50%]"
                  >
                    <div
                      className="h-full py-6 transition-transform duration-500 ease-out origin-center"
                      style={{
                        transform: i === current ? "scale(1.05)" : "scale(0.92)",
                      }}
                      onClick={(e) => {
                        if (i !== current) {
                          e.preventDefault();
                          e.stopPropagation();
                          api?.scrollTo(i);
                        }
                      }}
                    >
                      <div className={i === current ? "" : "pointer-events-none"}>
                        {i === 0 ? (
                          <FeaturedCard doctor={doctor} strapiUrl={strapiUrl} />
                        ) : (
                          <DoctorCard doctor={doctor} delay={0} strapiUrl={strapiUrl} />
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 sm:-left-4 md:-left-12 top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
              <CarouselNext className="absolute right-0 sm:-right-4 md:-right-12 top-1/2 -translate-y-1/2 hidden sm:inline-flex" />
            </Carousel>
          </div>
        )}

        {/* ── Trust strip ── */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          delay={0.1}
        >
          <TrustStrip />
        </PerformanceAnimation>
      </div>
    </section>
  );
}
