import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import {
  getServicePageMetadata,
  getDentalBleachingPage,
  getDentalVeneersPage,
  getDentalBracesPage,
  getGeneralDentistryPage,
  getDentalImplantsPage,
  getDentalCrownsPage,
  getMediaUrl,
} from "@/src/lib/api/queries";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";

// ─── Service page components ─────────────────────────────────────────────────
import GeneralCheckUpPage from "../_pages/general-and-preventive-dentistry";
import DentalBleachingPage from "../_pages/dental-bleaching";
import DentalVeneersPage from "../_pages/dental-veneers";
import DentalCrownsPage from "../_pages/dental-crowns";
import DentalBracesPage from "../_pages/dental-braces";
import DentalImplantsPage from "../_pages/dental-implants";

import { SERVICE_SLUGS } from "@/src/lib/constants/services";

import { getServiceMetadataOverride } from "@/src/lib/utils/service-metadata";

// ─── Slug → component map ─────────────────────────────────────────────────────
const SERVICE_PAGES: Record<string, React.ComponentType<Record<string, unknown>>> = {
  [SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY]: GeneralCheckUpPage,
  [SERVICE_SLUGS.DENTAL_BLEACHING]: DentalBleachingPage,
  [SERVICE_SLUGS.DENTAL_VENEERS]: DentalVeneersPage,
  [SERVICE_SLUGS.DENTAL_CROWNS]: DentalCrownsPage,
  [SERVICE_SLUGS.DENTAL_BRACES]: DentalBracesPage,
  [SERVICE_SLUGS.DENTAL_IMPLANTS]: DentalImplantsPage,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SERVICE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Fetch metadata directly from the specific service page content-type
  const service = await getServicePageMetadata(slug);

  let title = "";
  let description = "";

  if (service && service.metadata_title) {
    title = `${service.metadata_title} | Saigon International Dental`;
    description =
      service.metadata_description ||
      `Learn more about ${service.metadata_title} at Saigon International Dental Clinic in Ho Chi Minh City.`;
  } else {
    const override = getServiceMetadataOverride(slug);
    if (override) return override;

    const fallbackTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    title = `${fallbackTitle} | Saigon International Dental`;
    description = `Learn more about ${fallbackTitle} at Saigon International Dental Clinic in Ho Chi Minh City.`;
  }

  // Get full metadata image URL
  const strapiBase = NEXT_PUBLIC_STRAPI_URL;
  let imageUrl = "";
  if (service?.metadata_image) {
    const metaImage = service.metadata_image as {
      url?: string;
      formats?: { large?: { url?: string }; medium?: { url?: string } };
    };
    const rawUrl =
      metaImage.formats?.large?.url ||
      metaImage.formats?.medium?.url ||
      metaImage.url;
    if (rawUrl) {
      imageUrl = rawUrl.startsWith("http") ? rawUrl : `${strapiBase}${rawUrl}`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const PageComponent = SERVICE_PAGES[slug];



  if (!PageComponent) {
    notFound();
  }

  // Check if draft mode (preview mode) is enabled
  const { isEnabled: isDraftMode } = await draftMode();

  // Dynamic Related Services Hook
  interface FormattedService { title: string; desc: string; href: string; image: string; }
  let formattedServices: FormattedService[] = [];

  const servicePages = [
    {
      slug: SERVICE_SLUGS.DENTAL_IMPLANTS,
      defaultTitle: "Dental Implants",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_BRACES,
      defaultTitle: "Dental Braces",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_BLEACHING,
      defaultTitle: "Teeth Whitening",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_VENEERS,
      defaultTitle: "Dental Veneers",
    },
    {
      slug: SERVICE_SLUGS.DENTAL_CROWNS,
      defaultTitle: "Dental Crowns",
    },
    {
      slug: SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY,
      defaultTitle: "General Dentistry",
    },
  ].filter((sp) => sp.slug !== slug);

  formattedServices = await Promise.all(
    servicePages.map(async (sp) => {
      try {
        const meta = await getServicePageMetadata(sp.slug);
        return {
          title: meta?.overview_title || sp.defaultTitle,
          desc: meta?.overview_description || meta?.metadata_description || "",
          href: `/services/${sp.slug}`,
          image: meta?.metadata_image
            ? getMediaUrl(meta.metadata_image)
            : "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600",
        };
      } catch {
        return {
          title: sp.defaultTitle,
          desc: "",
          href: `/services/${sp.slug}`,
          image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600",
        };
      }
    }),
  );

  // ── CMS data dispatch: fetch page-specific content and pass as data prop ──
  switch (slug) {
    case SERVICE_SLUGS.DENTAL_BLEACHING: {
      const cmsData = await getDentalBleachingPage(isDraftMode);
      return (
        <DentalBleachingPage
          data={cmsData}
          relatedServices={formattedServices}
        />
      );
    }
    case SERVICE_SLUGS.DENTAL_VENEERS: {
      const cmsData = await getDentalVeneersPage(isDraftMode);
      return (
        <DentalVeneersPage data={cmsData} relatedServices={formattedServices} />
      );
    }
    case SERVICE_SLUGS.DENTAL_BRACES: {
      const cmsData = await getDentalBracesPage(isDraftMode);
      return (
        <DentalBracesPage data={cmsData} relatedServices={formattedServices} />
      );
    }
    case SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY: {
      const cmsData = await getGeneralDentistryPage(isDraftMode);
      return (
        <GeneralCheckUpPage
          data={cmsData ?? undefined}
          relatedServices={formattedServices}
        />
      );
    }
    case SERVICE_SLUGS.DENTAL_IMPLANTS: {
      const cmsData = await getDentalImplantsPage(isDraftMode);
      return (
        <DentalImplantsPage
          data={cmsData}
          relatedServices={formattedServices}
        />
      );
    }
    case SERVICE_SLUGS.DENTAL_CROWNS: {
      const cmsData = await getDentalCrownsPage(isDraftMode);
      return (
        <DentalCrownsPage data={cmsData ?? undefined} relatedServices={formattedServices} />
      );
    }
    default:
      return <PageComponent relatedServices={formattedServices} />;
  }
}

// On-demand revalidation via webhook — no time-based ISR needed
// force-dynamic: prevents stale SSG content baked when Strapi was unreachable at build time.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// IMPORTANT: Set to true to allow dynamic service pages in production
// If false, only pre-generated slugs from generateStaticParams() will work
export const dynamicParams = true;
