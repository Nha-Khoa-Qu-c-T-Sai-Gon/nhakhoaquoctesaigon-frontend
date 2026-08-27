/**
 * Service Page Slugs
 *
 * Centralized identifiers for all clinical service pages.
 * Used for routing, dynamic page matching, and metadata overrides.
 */

export const SERVICE_SLUGS = {
  GENERAL_AND_PREVENTIVE_DENSTISTRY: "general-and-preventive-dentistry",
  DENTAL_BLEACHING: "dental-bleaching",
  DENTAL_VENEERS: "dental-veneers",
  DENTAL_CROWNS: "dental-crowns",
  DENTAL_BRACES: "dental-braces",
  DENTAL_IMPLANTS: "dental-implants",
} as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[keyof typeof SERVICE_SLUGS];
