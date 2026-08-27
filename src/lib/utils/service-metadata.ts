import { Metadata } from "next";
import { SERVICE_SLUGS } from "@/src/lib/constants/services";

/**
 * Service Page Metadata Overrides
 *
 * Centralized metadata for clinical service pages to ensure
 * high-impact SEO titles and descriptions across all primary routes.
 */

const SERVICE_METADATA: Record<string, { title: string; description: string }> =
  {
    [SERVICE_SLUGS.DENTAL_CROWNS]: {
      title: "Dental Crowns in Ho Chi Minh City: Types, Costs & Procedures",
      description:
        "Need a dental crown in Ho Chi Minh City? Compare zirconia, e.max and porcelain crowns — costs and procedure explained. Book at SG International Dental.",
    },
    [SERVICE_SLUGS.DENTAL_VENEERS]: {
      title: "Dental Veneers Cost in Vietnam for International Patients",
      description:
        "Explore dental veneer cost in Vietnam, compare veneers vs crowns, meet our certified dentists, and see real patient results for natural-looking smiles.",
    },
    [SERVICE_SLUGS.DENTAL_BLEACHING]: {
      title: "Dental Bleaching: Professional Teeth Whitening That Lasts",
      description:
        "Discover clinically proven dental bleaching options — in-office, at-home, and combination treatments. Evidence-based care for lasting, brighter results.",
    },
    [SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY]: {
      title: "General Dentistry Services | SG International Dental",
      description:
        "Comprehensive general dentistry at SG International Dental Clinic cleanings, fillings, root canals, extractions & more. Trusted by thousands.",
    },
    [SERVICE_SLUGS.DENTAL_BRACES]: {
      title: "Dental Braces in Ho Chi Minh City | SG International Dental",
      description:
        "Looking for dental braces in Ho Chi Minh City? SG International Dental offers metal, ceramic braces and clear aligners. International-standard care.",
    },
    [SERVICE_SLUGS.DENTAL_IMPLANTS]: {
      title: "Trusted dental implant clinic in Ho Chi Minh City",
      description:
        "Restore your smile and chewing function with advanced dental implants at Saigon International Dental Clinic. High-quality care for lasting results.",
    },
  };

/**
 * Get metadata for a specific service slug
 *
 * Returns the hardcoded SEO override if it exists, otherwise null.
 */
export function getServiceMetadataOverride(slug: string): Metadata | null {
  const meta = SERVICE_METADATA[slug];

  if (!meta) return null;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
    },
  };
}
