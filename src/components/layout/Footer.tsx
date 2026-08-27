"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
  faTiktok,
  faPinterest,
  faWhatsapp,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { faCommentDots, faLink } from "@fortawesome/free-solid-svg-icons";
import { SOCIAL_LINKS } from "@/src/lib/constants/social-links";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import {
  formatPhoneNumber,
  generateMailtoLink,
  generateTelLink,
} from "@/src/lib/email/templates/helpers";

/**
 * Footer Component — 2026 Premium Design
 *
 * Features:
 * - CTA section for last-page conversion
 * - Bigger logo with tagline and rating
 * - Social links from constants
 * - Restructured Quick Links (no duplication)
 * - Upgraded Services section
 * - Interactive contact block (click to map/call/email)
 * - Light blue gradient background
 * - Micro-interactions on all elements
 * - Consistent with hero CTA button style
 */

interface FooterProps {
  footer?: {
    logo?: { url: string; alt: string; width: number; height: number };
    description?: string;
    links: Array<{
      id: number;
      label: string;
      href: string;
    }>;
    contactInfo: {
      address?: string;
      phone?: string;
      email?: string;
      addressIcon?: { url: string };
      phoneIcon?: { url: string };
      emailIcon?: { url: string };
    };
  };
}

// Map icon class strings to Font Awesome icons
const getIconFromClass = (iconClass?: string) => {
  if (!iconClass) return faLink;

  const iconMap: Record<string, IconDefinition> = {
    "fab fa-facebook": faFacebook,
    "fab fa-twitter": faTwitter,
    "fab fa-instagram": faInstagram,
    "fab fa-linkedin": faLinkedin,
    "fab fa-youtube": faYoutube,
    "fab fa-tiktok": faTiktok,
    "fab fa-pinterest": faPinterest,
    "fab fa-whatsapp": faWhatsapp,
    "fab fa-telegram": faTelegram,
    "fas fa-comment-dots": faCommentDots,
  };

  return iconMap[iconClass] || faLink;
};

export function Footer({ footer }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-white">
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#EBF5FF]" />
        {/* Soft Medical Glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary-100/30 blur-[100px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-blue-100/40 blur-[90px] rounded-full translate-y-1/2" />
      </div>

      <div className="absolute inset-0 pointer-events-none border-t border-primary-100/50" />

      {/* Main Footer Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Brand Block - Redesigned with bigger logo */}
          <div className="lg:col-span-1">
            {/* Logo - only render if exists */}
            {footer?.logo && (
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={footer.logo.url}
                  alt={footer.logo.alt}
                  width={56}
                  height={56}
                  className="rounded-2xl object-cover shadow-lg"
                />
                <div>
                  <h3 className="font-bold text-xl leading-tight text-foreground">
                    International Dental Clinic
                  </h3>
                </div>
              </div>
            )}

            {/* Tagline - only render if exists */}
            {footer?.description && (
              <p className="text-sm sm:text-base md:text-lg text-foreground-secondary mb-4 leading-relaxed">
                {footer.description}
              </p>
            )}

            {/* Social Links */}
            <div>
              <h3 className="font-bold text-xl mb-5 text-foreground">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="transition-all duration-300"
                    title={social.platform}
                  >
                    <FontAwesomeIcon
                      icon={getIconFromClass(social.iconClass)}
                      className="w-7 h-7 text-primary-600 hover:text-primary-700"
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links - only render if has links */}
          {footer?.links && footer.links.length > 0 && (
            <div>
              <h3 className="font-bold text-xl mb-6 text-foreground">
                Quick Links
              </h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {footer.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-sm sm:text-base md:text-lg text-foreground-secondary hover:text-primary-600 transition-colors duration-300"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services - removed (duplicate of Quick Links) */}

          {/* Contact - only render if has contact info */}
          {footer?.contactInfo &&
            (footer.contactInfo.address ||
              footer.contactInfo.phone ||
              footer.contactInfo.email) && (
              <div>
                <h3 className="font-bold text-xl mb-6 text-foreground">
                  Get In Touch
                </h3>
                <ul className="space-y-4">
                  {/* Address - only if exists */}
                  {footer.contactInfo.address && (
                    <li>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(footer.contactInfo.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 text-foreground-secondary hover:text-primary-600 transition-colors duration-300"
                      >
                        {footer.contactInfo.addressIcon ? (
                          <Image
                            src={footer.contactInfo.addressIcon.url}
                            alt="Address"
                            width={20}
                            height={20}
                            className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300 object-contain"
                          />
                        ) : (
                          <MapPin className="w-5 h-5 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span className="text-sm sm:text-base md:text-lg leading-relaxed">
                          {footer.contactInfo.address}
                        </span>
                      </a>
                    </li>
                  )}

                  {/* Phone - display both */}
                  <li>
                    <div className="group flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        {footer.contactInfo.phoneIcon ? (
                          <Image
                            src={footer.contactInfo.phoneIcon.url}
                            alt="Phone"
                            width={20}
                            height={20}
                            className="shrink-0 group-hover:scale-110 transition-transform duration-300 object-contain"
                          />
                        ) : (
                          <Phone className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <div className="flex flex-col">
                          <a
                            href={generateTelLink(CLINIC_INFO.phone1)}
                            className="text-sm sm:text-base md:text-lg font-medium text-foreground-secondary hover:text-primary-600 transition-colors duration-300"
                          >
                            {formatPhoneNumber(CLINIC_INFO.phone1)}
                          </a>
                          <a
                            href={generateTelLink(CLINIC_INFO.phone2)}
                            className="text-sm sm:text-base md:text-lg font-medium text-foreground-secondary hover:text-primary-600 transition-colors duration-300"
                          >
                            {formatPhoneNumber(CLINIC_INFO.phone2)}
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Email - only if exists */}
                  {footer.contactInfo.email && (
                    <li>
                      <a
                        href={generateMailtoLink()}
                        className="group flex items-center gap-3 text-foreground-secondary hover:text-primary-600 transition-colors duration-300"
                      >
                        {footer.contactInfo.emailIcon ? (
                          <Image
                            src={footer.contactInfo.emailIcon.url}
                            alt="Email"
                            width={20}
                            height={20}
                            className="shrink-0 group-hover:scale-110 transition-transform duration-300 object-contain"
                          />
                        ) : (
                          <Mail className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span className="text-sm sm:text-base md:text-lg font-medium break-all">
                          {footer.contactInfo.email}
                        </span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8"
          style={{
            borderTop: "1px solid rgba(22, 81, 151, 0.15)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm sm:text-base md:text-lg text-foreground-secondary">
              © {currentYear} International Dental Clinic. All rights reserved.
            </p>
            <div className="flex gap-6 text-base">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "HIPAA Compliance", href: "/hipaa" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative text-sm sm:text-base md:text-lg text-foreground-secondary hover:text-primary-600 transition-colors duration-300"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </footer>
  );
}
