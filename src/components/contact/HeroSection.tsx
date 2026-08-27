"use client";

import React from "react";
import {
  MapPin,
  Phone,
  ArrowRight,
  Globe,
  Clock,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/src/components/ui";
import { DecorativeBadge } from "@/src/components/ui/DecorativeBadge";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import CallNowButton from "@/src/components/ui/CallNowButton";
import { ContactForm } from "./ContactForm";

interface HeroFeature {
  icon: string;
  label: string;
  body: string;
}

const PAGE_DATA = {
  hero: {
    title: "Professional Dental Clinic for International Patients",
    subtitle:
      "At Saigon International Dental Clinic, our goal is to make it easy for you to access the high-quality, specialized dental care you need.",
    locationBadge: "Hoa Hung Ward, Ho Chi Minh City",
    locationDetail:
      "Our clinic is located in Hoa Hung Ward, right in the heart of Ho Chi Minh City, serving both local and international patients. We also offer multiple payment options for your convenience.",
    features: [
      {
        icon: "message",
        label: "Free Consultation",
        body: "We're happy to assist with all your dental questions and booking inquiries.",
      },
      {
        icon: "phone",
        label: "Expert Guidance",
        body: "When you contact us, our dental assistants will provide free consultation and guidance to help you understand your condition and choose the most suitable treatment",
      },
    ],
    trustPills: [
      { icon: "clock", label: "Response within 24 hours" },
      { icon: "globe", label: "English-speaking team" },
      { icon: "phone", label: "Open daily 8:00 AM – 7:00 PM" },
    ],
  },
};

interface HeroSectionProps {
  /**
   * Hero block data from CMS
   */
  hero: any;
  /**
   * Flag indicating whether animation complexity should be simplified
   */
  shouldSimplify: boolean;
  /**
   * Handler to trigger booking modal opening
   */
  openBookingModal: () => void;
}

/**
 * HeroSection component displays the main landing section of the Contact Us page.
 * It includes a responsive background image, localized clinic address badges, key features,
 * trust badges, and embeds the interactive booking form on the right column.
 */
export function HeroSection({
  hero,
  shouldSimplify,
  openBookingModal,
}: HeroSectionProps) {
  const heroContactForm = hero?.contactForm;
  const desktopBgUrl =
    hero?.backgroundDesktopUrl ||
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=85&w=1920";
  const mobileBgUrl = hero?.backgroundMobileUrl || desktopBgUrl;

  return (
    <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 relative z-10 overflow-hidden isolate">
      {/* Background Image Container with responsive desktop/mobile styling */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Desktop Background */}
        <div
          className={`absolute inset-0 z-0 hidden md:block ${shouldSimplify ? "" : "scale-105"}`}
          style={{
            backgroundImage: `url(${desktopBgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: shouldSimplify
              ? "brightness(0.45)"
              : "blur(2px) brightness(0.45)",
          }}
        />
        {/* Mobile Background */}
        <div
          className={`absolute inset-0 z-0 md:hidden ${shouldSimplify ? "" : "scale-105"}`}
          style={{
            backgroundImage: `url(${mobileBgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: shouldSimplify
              ? "brightness(0.45)"
              : "blur(2px) brightness(0.45)",
          }}
        />
        {/* Dark medical-grade overlay */}
        <div className="absolute inset-0 bg-slate-950/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent z-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30">
        {/* ── TOP TITLE SECTION ── */}
        <div className="text-center w-full mx-auto mb-8 sm:mb-10 md:mb-12">
          <DecorativeBadge
            text="Contact Us"
            variant="dark"
            align="center"
            className="mb-4"
          />
          <AnimatedSectionHeader
            title={hero?.title || PAGE_DATA.hero.title}
            subtitle={hero?.subtitle || PAGE_DATA.hero.subtitle}
            titleClassName="text-white tracking-tight"
            subtitleClassName="text-blue-100/75 leading-relaxed font-normal mt-4 mx-auto"
            titleAs="h1"
            titleSize="large"
            className="mb-0"
            fullWidthSubtitle={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 items-start">
          {/* LEFT COLUMN: Hero Details */}
          <div className="flex flex-col gap-7 justify-center">
            {/* ── Location badge + detail ── */}
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-sky-400/15 border border-sky-400/25 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-sky-300" />
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-widest text-sky-200 uppercase">
                  {hero?.locationBadge || PAGE_DATA.hero.locationBadge}
                </span>
              </span>
              <p className="text-sm sm:text-base md:text-lg text-white/60 leading-relaxed">
                {hero?.locationDetail || PAGE_DATA.hero.locationDetail}
              </p>
            </div>

            {/* ── Feature highlight cards ── */}
            <div className="flex flex-col gap-3">
              {(hero?.features && hero.features.length > 0
                ? hero.features
                : PAGE_DATA.hero.features
              ).map((feat: HeroFeature) => (
                <div
                  key={feat.label}
                  className="relative flex items-start gap-3 p-4 rounded-2xl bg-white/8 backdrop-blur-md border border-white/12 hover:bg-white/12 transition-colors duration-300 overflow-hidden group"
                >
                  {/* Subtle glow accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  {/* Icon circle */}
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center mt-0.5">
                    {feat.icon === "message" ? (
                      <MessageSquare className="w-4 h-4 text-sky-300" />
                    ) : (
                      <Phone className="w-4 h-4 text-sky-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest text-sky-300">
                      {feat.label}
                    </span>
                    <p className="text-sm sm:text-base md:text-lg text-white/65 leading-snug">
                      {feat.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── CTA buttons ── */}
            <div className="hidden sm:flex flex-col sm:flex-row items-start gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-slate-950 hover:bg-white/90 rounded-full px-10 py-5 h-auto text-sm sm:text-base md:text-lg font-bold shadow-2xl shadow-white/5 group"
                onClick={openBookingModal}
              >
                Book Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <CallNowButton variant="dark" />
            </div>

            {/* ── Trust pills ── */}
            <div className="hidden sm:flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              {[
                {
                  icon: <Clock className="w-3.5 h-3.5" />,
                  label: "Response within 24 hours",
                },
                {
                  icon: <Globe className="w-3.5 h-3.5" />,
                  label: "English-speaking team",
                },
                {
                  icon: <Phone className="w-3.5 h-3.5" />,
                  label: "Open daily 8:00 AM – 7:00 PM",
                },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/70 text-sm sm:text-base md:text-lg font-bold"
                >
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          {heroContactForm && (
            <div data-contact-form>
              <ContactForm data={heroContactForm} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
