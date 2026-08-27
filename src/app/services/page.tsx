import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { apiClient } from "@/src/lib/api/client";
import { getServicePageMetadata, getMediaUrl } from "@/src/lib/api/queries";
import { SERVICE_SLUGS } from "@/src/lib/constants/services";
import ServicesPageClient from "./ServicesPageClient";

// Static fallback used when the CMS entry is not yet published
const FALLBACK_LAYOUT = [
  {
    __component: "services-overview.hero",
    badge: "Premium Dental Services",
    title: "World-Class Dental Care in Ho Chi Minh City",
    description:
      "Evidence-based treatments delivered by internationally trained specialists. Your perfect smile, our lifetime commitment.",
    trust: [
      { icon: "Star", label: "5-Star Rated", sub: "500+ reviews" },
      { icon: "Users", label: "10,000+ Patients", sub: "Treated annually" },
      { icon: "Globe", label: "International", sub: "Standards" },
    ],
  },
  {
    __component: "services-overview.features",
    features: [
      {
        icon: "Shield",
        title: "Internationally Certified",
        description:
          "Our specialists hold certifications from leading dental institutions worldwide.",
      },
      {
        icon: "ScanLine",
        title: "Digital Precision",
        description:
          "3D imaging, laser dentistry, and CAD/CAM technology for accurate, pain-free results.",
      },
      {
        icon: "Clock",
        title: "Flexible Scheduling",
        description:
          "Evening and weekend appointments available to fit your busy lifestyle.",
      },
    ],
  },
];

async function getServicesListingData(isDraftMode: boolean = false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface ServicesOverviewData { data?: { layout?: any[] }; meta?: unknown }
  try {
    const response = await apiClient<ServicesOverviewData>("/api/services-overview", {
      params: {
        populate: {
          layout: {
            on: {
              "services-overview.hero": { populate: "*" },
              "services-overview.features": { populate: "*" },
              "services-overview.cta": {
                populate: {
                  background_image: { populate: "*" },
                  human_image: { populate: "*" },
                },
              },
            },
          },
        },
      },
      isDraftMode,
      tags: ["services-overview"],
    });

    if (response.data) {
      const servicePages = [
        {
          slug: SERVICE_SLUGS.DENTAL_IMPLANTS,
          category: "Implants",
          defaultTitle: "Dental Implants",
        },
        {
          slug: SERVICE_SLUGS.DENTAL_BRACES,
          category: "Orthodontics",
          defaultTitle: "Dental Braces",
        },
        {
          slug: SERVICE_SLUGS.DENTAL_BLEACHING,
          category: "Cosmetic",
          defaultTitle: "Teeth Whitening",
        },
        {
          slug: SERVICE_SLUGS.DENTAL_VENEERS,
          category: "Cosmetic",
          defaultTitle: "Dental Veneers",
        },
        {
          slug: SERVICE_SLUGS.DENTAL_CROWNS,
          category: "Cosmetic",
          defaultTitle: "Dental Crowns",
        },
        {
          slug: SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY,
          category: "General",
          defaultTitle: "General Dentistry",
        },
      ];

      const services = await Promise.all(
        servicePages.map(async (sp) => {
          const meta = await getServicePageMetadata(sp.slug);
          return {
            slug: sp.slug,
            title: meta?.overview_title || sp.defaultTitle,
            category: sp.category,
            description:
              meta?.overview_description || meta?.metadata_description || "",
            image: meta?.metadata_image ? getMediaUrl(meta.metadata_image) : "",
          };
        }),
      );

      return { ...response.data, services };
    }
  } catch {
    // CMS unavailable or entry not published — fall through to fallback
  }

  // ── Fallback: build service cards from individual service single types ──
  const servicePages = [
    {
      slug: SERVICE_SLUGS.DENTAL_IMPLANTS,
      category: "Implants",
      defaultTitle: "Dental Implants",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_BRACES,
      category: "Orthodontics",
      defaultTitle: "Dental Braces",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_BLEACHING,
      category: "Cosmetic",
      defaultTitle: "Teeth Whitening",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_VENEERS,
      category: "Cosmetic",
      defaultTitle: "Dental Veneers",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_CROWNS,
      category: "Cosmetic",
      defaultTitle: "Dental Crowns",
    },
    {
      slug: SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY,
      category: "General",
      defaultTitle: "General Dentistry",
    },
  ];

  const services = await Promise.all(
    servicePages.map(async (sp) => {
      try {
        const meta = await getServicePageMetadata(sp.slug);
        return {
          slug: sp.slug,
          title: meta?.overview_title || sp.defaultTitle,
          category: sp.category,
          description:
            meta?.overview_description || meta?.metadata_description || "",
          image: meta?.metadata_image ? getMediaUrl(meta.metadata_image) : "",
        };
      } catch {
        return {
          slug: sp.slug,
          title: sp.defaultTitle,
          category: sp.category,
          description: "",
          image: "",
        };
      }
    }),
  );

  return { layout: FALLBACK_LAYOUT, services };
}

export const metadata: Metadata = {
  title: "Dental Services | Saigon International Dental Clinic",
  description:
    "Premium dental services in Ho Chi Minh City — Dental Implants, Braces, Veneers, Teeth Whitening, Crowns, and General Dentistry by internationally trained specialists.",
  openGraph: {
    title: "Dental Services | Saigon International Dental Clinic",
    description:
      "Premium dental services in Ho Chi Minh City — evidence-based care by internationally trained specialists.",
    type: "website",
  },
};

export default async function ServicesPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const listingData = await getServicesListingData(isDraftMode);
  return <ServicesPageClient data={listingData} />;
}


// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
