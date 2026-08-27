/**
 * API Query Functions
 *
 * High-level functions for fetching data from the CMS API.
 * Handles API communication and data transformation.
 */

import { apiClient } from "./client";
import { transformPage } from "./transformers";
import type {
  Page,
  StrapiPages,
  StrapiPage,
  Navigation,
  StrapiNavigation,
  Footer,
  StrapiFooter,
  Homepage,
  StrapiHomepage,
  HomepageVideoHeroComponent,
  HomepageHeroComponent,
  HomepageServicesComponent,
  HomepageAboutComponent,
  HomepageCombinedTestimonialResultComponent,
  HomepageCTAComponent,
  HomepageTrustComponent,
  HomepageProcessComponent,
  HomepageDoctorComponent,
  HomepageFAQComponent,
  HomepageBlogCollectionComponent,
  HomepageBlock,
  HomepageBlockComponent,
  HomepageCertificationComponent,
  HomepagePapersSectionComponent,
} from "@/src/types/strapi";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import { CLINIC_INFO } from "../constants/contact";
import { SERVICE_SLUGS } from "@/src/lib/constants/services";

// Helper to prevent JSON strings from being rendered as text descriptions
function cleanDescription(desc: unknown): string | undefined {
  if (!desc) return undefined;
  // If it's not a string, it shouldn't be rendered as a description/subtitle
  if (typeof desc !== "string") return undefined;

  // More aggressive HTML stripping
  const cleaned = desc
    .trim()
    .replace(/^<p>/g, "")
    .replace(/<\/p>$/g, "")
    .trim();

  // If description looks like JSON, it's likely a malformed migration/dump
  // We check for common JSON starting characters
  if (cleaned.startsWith("{") || cleaned.startsWith("[")) {
    try {
      JSON.parse(cleaned);
      return undefined; // Hide it if it's valid JSON
    } catch (_e) {
      // If it fails to parse but still looks very much like a JSON dump,
      // check for common patterns like {"hero": or {"badge":
      if (cleaned.includes('{"hero":') || cleaned.includes('{"badge":')) {
        return undefined;
      }
      return desc;
    }
  }
  return desc;
}

/**
 * Get a page by slug
 *
 * Fetches a single page from the CMS using slug filter.
 * Uses populate=* to include all first-level relations
 *
 * @param slug - Page slug (e.g., "dental-implants")
 * @param isDraftMode - Whether to fetch draft content (for preview)
 * @returns Transformed page data or null if not found
 */
export async function getPageBySlug(
  slug: string,
  isDraftMode: boolean = false,
): Promise<Page | null> {
  try {
    // Query API with filters and populate
    const response = await apiClient<StrapiPages>("/api/pages", {
      params: {
        "filters[slug][$eq]": slug,
        populate: "*",
      },
      isDraftMode,
      tags: ["pages", "page"], // Cache tags for revalidation
    });

    // API returns array even for single result
    if (!response.data || response.data.length === 0) {
      console.warn(`Page not found: ${slug}`);
      return null;
    }

    // Transform first result from API format to frontend format
    const strapiPage: StrapiPage = {
      data: response.data[0],
      meta: response.meta,
    };

    return transformPage(strapiPage);
  } catch (_error) {
    return null;
  }
}

/**
 * Get all page slugs
 *
 * Used for static generation (generateStaticParams).
 * Only fetches slug field for performance.
 * Only fetches published pages for production builds.
 *
 * @returns Array of page slugs
 */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    // Only fetch slug field for performance
    // Only fetch published pages (not drafts) - Strapi v5 uses status=published
    const response = await apiClient<StrapiPages>("/api/pages", {
      params: {
        "fields[0]": "slug",
        status: "published", // Strapi v5: Only published pages for static generation
      },
      tags: ["pages"], // Cache tag for revalidation
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Extract slugs from response
    // Handle both Strapi v4 (page.attributes.slug) and v5 (page.slug)
    return response.data
      .map((page) => {
        // Type assertion for v5 flat structure
        const pageData = page as unknown as Record<string, unknown>;
        return page.attributes?.slug || (pageData.slug as string | undefined);
      })
      .filter((slug): slug is string => Boolean(slug));
  } catch (_error) {
    return [];
  }
}

/**
 * Get all pages
 *
 * Fetches multiple pages with full data.
 * Used for homepage listing or sitemap generation.
 *
 * @param limit - Maximum number of pages to return (default: 10)
 * @returns Array of transformed pages
 */
export async function getAllPages(limit: number = 10): Promise<Page[]> {
  try {
    // Fetch pages with pagination and populate
    const response = await apiClient<StrapiPages>("/api/pages", {
      params: {
        "pagination[limit]": limit,
        populate: "*",
        sort: "createdAt:desc", // Newest first
      },
      tags: ["pages"], // Cache tag for revalidation
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Transform all pages
    return response.data.map((page) => {
      const strapiPage: StrapiPage = {
        data: page,
        meta: response.meta,
      };
      return transformPage(strapiPage);
    });
  } catch (_error) {
    return [];
  }
}

/**
 * Get a single service card by slug
 *
 * Fetches service card metadata from the services-overview dynamic zone so
 * the [slug] detail page can have CMS-driven title/description.
 *
 * @param slug - e.g. "general-check-up"
 * @returns Service item data { slug, title, description } or null
 */
interface ServiceOverviewResponse {
  data?: {
    layout?: Array<{
      __component?: string;
      services?: Array<{
        slug?: string;
        title?: string;
        description?: string;
        category?: string;
      }>;
    }>;
  };
}

export async function getServiceCardBySlug(slug: string): Promise<{
  slug: string;
  title: string;
  description?: string;
  category?: string;
} | null> {
  try {
    const response = await apiClient<ServiceOverviewResponse>("/api/services-overview", {
      params: {
        populate: {
          layout: {
            on: {
              "services-overview.service-cards": {
                populate: { services: { populate: "*" } },
              },
            },
          },
        },
      },
      isDraftMode: false,
      tags: ["services-overview"],
    });

    const layout = response?.data?.layout ?? [];
    for (const block of layout) {
      if (block.__component === "services-overview.service-cards") {
        const match = (block.services ?? []).find((s) => s.slug === slug);
        if (match) {
          return {
            slug: match.slug || "",
            title: match.title || "",
            description: match.description,
            category: match.category,
          };
        }
      }
    }
    return null;
  } catch (_error) {
    return null;
  }
}

/**
 * Maps a CMS service item title to its centralized constant slug.
 */
export function getSlugFromTitle(title: string, index: number): string {
  if (!title) return "";
  const t = title.toLowerCase();
  if (t.includes("bleach") || t.includes("whiten"))
    return SERVICE_SLUGS.DENTAL_BLEACHING;
  if (t.includes("veneer")) return SERVICE_SLUGS.DENTAL_VENEERS;
  if (t.includes("crown")) return SERVICE_SLUGS.DENTAL_CROWNS;
  if (t.includes("brace") || t.includes("ortho"))
    return SERVICE_SLUGS.DENTAL_BRACES;
  if (t.includes("implant")) return SERVICE_SLUGS.DENTAL_IMPLANTS;
  if (t.includes("general") || t.includes("prevent") || t.includes("check"))
    return SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY;

  // Fallback to order
  const SLUGS_ORDER = [
    SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY,
    SERVICE_SLUGS.DENTAL_BLEACHING,
    SERVICE_SLUGS.DENTAL_VENEERS,
    SERVICE_SLUGS.DENTAL_CROWNS,
    SERVICE_SLUGS.DENTAL_BRACES,
    SERVICE_SLUGS.DENTAL_IMPLANTS,
  ];
  return SLUGS_ORDER[index] || t.replace(/[^a-z0-9]+/g, "-");
}

interface ServicePageMetadataResponse {
  data?: {
    title?: string;
    description?: string;
    metadata_title?: string;
    metadata_description?: string;
    metadata_image?: unknown;
    overview_title?: string;
    overview_description?: string;
  };
}

export async function getServicePageMetadata(
  slug: string,
  isDraftMode: boolean = false,
): Promise<{
  metadata_title?: string;
  metadata_description?: string;
  metadata_image?: unknown;
  overview_title?: string;
  overview_description?: string;
} | null> {
  const endpointMap: Record<string, string> = {
    [SERVICE_SLUGS.GENERAL_AND_PREVENTIVE_DENSTISTRY]: "/api/general-dentistry",
    [SERVICE_SLUGS.DENTAL_BLEACHING]: "/api/dental-bleaching",
    [SERVICE_SLUGS.DENTAL_VENEERS]: "/api/dental-veneers",
    [SERVICE_SLUGS.DENTAL_CROWNS]: "/api/dental-crowns",
    [SERVICE_SLUGS.DENTAL_BRACES]: "/api/dental-braces",
    [SERVICE_SLUGS.DENTAL_IMPLANTS]: "/api/dental-implants",
  };

  const endpoint = endpointMap[slug];
  if (!endpoint) return null;

  try {
    const response = await apiClient<ServicePageMetadataResponse>(endpoint, {
      params: {
        "populate[metadata_image]": "*",
      },
      isDraftMode,
      tags: [slug],
      cache:
        isDraftMode || process.env.NODE_ENV === "development"
          ? "no-store"
          : "force-cache",
      next:
        isDraftMode || process.env.NODE_ENV === "development"
          ? undefined
          : { revalidate: false, tags: [slug] },
    });

    const data = response?.data;
    if (!data) return null;

    return {
      metadata_title: data.metadata_title || data.title,
      metadata_description: data.metadata_description || data.description,
      metadata_image: data.metadata_image,
      overview_title: data.overview_title,
      overview_description: data.overview_description,
    };
  } catch (error) {
    console.error(
      `[getServicePageMetadata] Error fetching metadata for ${slug}:`,
      error,
    );
    return null;
  }
}

// Internal helper type for navigating nested media objects
interface MediaSource {
  url?: string;
  alternativeText?: string | null;
  name?: string;
  width?: number;
  height?: number;
  data?: {
    id?: number;
    attributes?: {
      url?: string;
      alternativeText?: string | null;
    };
  } | null;
}

function asMediaSource(m: unknown): MediaSource | null {
  if (!m || typeof m !== "object") return null;
  return m as MediaSource;
}

export function getMediaUrl(media: unknown, _size?: string): string {
  if (!media) return "";

  let url = "";

  if (Array.isArray(media)) {
    const first = asMediaSource(media[0]);
    if (first?.url) url = first.url;
  } else {
    const m = asMediaSource(media);
    if (m?.url) {
      url = m.url;
    } else if (m?.data?.attributes?.url) {
      url = m.data.attributes.url;
    }
  }

  if (!url) return "";

  // If URL is relative, prepend API URL
  if (url.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL as string;
    return `${baseUrl}${url}`;
  }

  return url;
}

/**
 * Get media alt text
 *
 * Extracts alt text from CMS media object.
 * Falls back to provided fallback text.
 *
 * @param media - Media object from CMS
 * @param fallback - Fallback text if alt is not available
 * @returns Alt text or fallback
 */
export function getMediaAlt(media: unknown, fallback: string = ""): string {
  if (!media) return fallback;

  let alt = "";

  if (Array.isArray(media)) {
    const first = asMediaSource(media[0]);
    if (first?.alternativeText) alt = first.alternativeText;
  } else {
    const m = asMediaSource(media);
    if (m?.alternativeText) {
      alt = m.alternativeText;
    } else if (m?.data?.attributes?.alternativeText) {
      alt = m.data.attributes.alternativeText;
    }
  }

  return alt || fallback;
}

/**
 * Get navigation menu
 *
 * Fetches navigation menu from CMS.
 * Navigation is a Single Type with repeatable nav items that support dropdown children.
 *
 * @returns Navigation object with items, logo, and CTA
 */
export async function getNavigation(): Promise<Navigation> {
  try {
    // Fetch navigation from Strapi with nested populate for children
    // Strapi v5 requires explicit populate syntax for nested components
    const response = await apiClient<StrapiNavigation>("/api/navigation", {
      params: {
        "populate[navigation][populate][children]": "true",
        "populate[logo]": "true",
      },
      tags: ["navigation"], // Cache tag for revalidation
    });

    // Handle missing or empty data
    if (!response.data || !response.data.navigation) {
      console.warn("[getNavigation] No navigation data found");
      return { navigation: [] };
    }

    // Normalize data: extract navigation items with children
    const navigation = response.data.navigation.map((item) => {
      return {
        id: item.id,
        label: item.label || "",
        href: item.href || "#",
        isExternal: item.isExternal || false,
        icon: item.icon || null,
        children: item.children
          ? item.children.map((child) => ({
              id: child.id,
              label: child.label || "",
              href: child.href || "#",
              isExternal: child.isExternal || false,
              icon: child.icon || null,
            }))
          : undefined,
      };
    });

    const result = {
      navigation,
      logo: response.data.logo
        ? {
            url: getMediaUrl(response.data.logo),
            alt: getMediaAlt(response.data.logo, ""),
            width: 0,
            height: 0,
          }
        : undefined,
      ctaText: response.data.ctaText || undefined,
      ctaLink: response.data.ctaLink || undefined,
    };

    return result;
  } catch (_error) {
    return { navigation: [] };
  }
}

/**
 * Get footer content
 *
 * Fetches footer content from CMS.
 * Footer is a Single Type with contact info, links, and social links.
 *
 * @returns Footer object with all footer data
 */
export async function getFooter(): Promise<Footer> {
  try {
    // Fetch footer from Strapi
    const response = await apiClient<StrapiFooter>("/api/footer", {
      params: {
        "populate[logo]": "true",
        "populate[contact_info][populate][address_icon]": "true",
        "populate[contact_info][populate][phone_icon]": "true",
        "populate[contact_info][populate][email_icon]": "true",
        "populate[footer_links]": "true",
      },
      tags: ["footer"], // Cache tag for revalidation
    });

    // Handle missing data
    if (!response.data) {
      console.warn("[getFooter] No footer data found");
      return {
        description: "",
        contactInfo: { id: 0, address: "", phone: "", email: "" },
        links: [],
      };
    }

    // Normalize data
    const footer: Footer = {
      logo: response.data.logo
        ? {
            url: getMediaUrl(response.data.logo),
            alt: getMediaAlt(response.data.logo, ""),
            width: 0,
            height: 0,
          }
        : undefined,
      description: cleanDescription(response.data.description) || "",
      contactInfo: response.data.contact_info
        ? {
            id: response.data.contact_info.id,
            address: response.data.contact_info.address,
            phone: response.data.contact_info.phone,
            email: response.data.contact_info.email,
            addressIcon: response.data.contact_info.address_icon?.data
              ? {
                  url: getMediaUrl(response.data.contact_info.address_icon),
                  alt: "",
                  width: 0,
                  height: 0,
                }
              : undefined,
            phoneIcon: response.data.contact_info.phone_icon?.data
              ? {
                  url: getMediaUrl(response.data.contact_info.phone_icon),
                  alt: "",
                  width: 0,
                  height: 0,
                }
              : undefined,
            emailIcon: response.data.contact_info.email_icon?.data
              ? {
                  url: getMediaUrl(response.data.contact_info.email_icon),
                  alt: "",
                  width: 0,
                  height: 0,
                }
              : undefined,
          }
        : {
            id: 0,
            address: "",
            phone: "",
            email: "",
          },
      links: response.data.footer_links || [],
    };

    return footer;
  } catch (_error) {
    return {
      description: "",
      contactInfo: { id: 0, address: "", phone: "", email: "" },
      links: [],
    };
  }
}

/**
 * Get homepage content
 *
 * Fetches homepage with dynamic layout blocks from CMS.
 * Homepage is a Single Type with a Dynamic Zone for flexible layouts.
 *
 * @returns Homepage object with normalized blocks
 */
export async function getHomepage(): Promise<Homepage> {
  try {
    // Fetch homepage from Strapi
    // Custom controller handles all population automatically
    const response = await apiClient<StrapiHomepage>("/api/homepage", {
      params: {},
      tags: ["homepage"],
    });

    // Handle missing data
    if (!response.data) {
      console.warn("[getHomepage] No homepage data found");
      return {
        title: "Homepage",
        metadataTitle: undefined,
        metadataDescription: undefined,
        metadataImage: undefined,
        blocks: [],
      };
    }

    // Strapi v5 custom controller returns array, extract first item
    const data = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    if (!data) {
      console.warn("[getHomepage] No homepage data in response");
      return {
        title: "Homepage",
        metadataTitle: undefined,
        metadataDescription: undefined,
        metadataImage: undefined,
        blocks: [],
      };
    }

    // Normalize blocks: convert __component to blockType
    const blocks = (data.layout || [])
      .map((block: HomepageBlockComponent) => {
        const componentType = block.__component.split(".")[1];

        switch (componentType) {
          case "video-hero": {
            const videoHero = block as HomepageVideoHeroComponent;
            const poster = videoHero.posterImage;
            const mobileBg = videoHero.mobileBackgroundImage;
            return {
              blockType: "video-hero" as const,
              id: block.id,
              titleLines: videoHero.titleLines || [],
              subtitle: cleanDescription(videoHero.subtitle),
              ctaText: videoHero.ctaText,
              videoUrl: videoHero.videoMedia ? getMediaUrl(videoHero.videoMedia) : "",
              posterImage: poster
                ? {
                    url: getMediaUrl(poster),
                    alt: getMediaAlt(poster, "Video Hero"),
                    width: poster.data?.attributes?.width || poster.width || 0,
                    height: poster.data?.attributes?.height || poster.height || 0,
                  }
                : undefined,
              mobileBackgroundImage: mobileBg
                ? {
                    url: getMediaUrl(mobileBg),
                    alt: getMediaAlt(mobileBg, "Mobile Video Hero Background"),
                    width: mobileBg.data?.attributes?.width || mobileBg.width || 0,
                    height: mobileBg.data?.attributes?.height || mobileBg.height || 0,
                  }
                : undefined,
              isActive: videoHero.isActive,
            };
          }

          case "hero": {
            const heroBlock = block as HomepageHeroComponent;
            const heroImg = heroBlock.image;
            return {
              blockType: "hero" as const,
              id: block.id,
              heading: heroBlock.heading,
              subheading: heroBlock.subheading,
              image: heroImg
                ? {
                    url: getMediaUrl(heroImg),
                    alt: getMediaAlt(heroImg, heroBlock.heading),
                    width: heroImg.data?.attributes?.width || heroImg.width || 0,
                    height: heroImg.data?.attributes?.height || heroImg.height || 0,
                  }
                : undefined,
              ctaLabel: heroBlock.cta_label,
              ctaLink: (block as HomepageHeroComponent).cta_link,
              userAvatars: (block as HomepageHeroComponent).user_avatars
                ? (block as HomepageHeroComponent).user_avatars!.map(
                    (avatar) => ({
                      url: getMediaUrl(avatar),
                      alt: avatar.alternativeText || "User Avatar",
                      width: avatar.width || 100,
                      height: avatar.height || 100,
                    }),
                  )
                : undefined,
            };
          }

          case "services":
            return {
              blockType: "services" as const,
              id: block.id,
              title: (block as HomepageServicesComponent).title,
              subtitle: cleanDescription(
                (block as HomepageServicesComponent).subtitle,
              ),
              description: cleanDescription(
                (block as HomepageServicesComponent).description,
              ),
              items:
                (block as HomepageServicesComponent).items?.map((item) => ({
                  id: item.id,
                  title: item.title,
                  description: cleanDescription(item.description),
                  link: item.link,
                  image: item.image
                    ? {
                        url: getMediaUrl(item.image),
                        alt: getMediaAlt(item.image, item.title),
                        width:
                          item.image.data?.attributes?.width ||
                          item.image.width ||
                          0,
                        height:
                          item.image.data?.attributes?.height ||
                          item.image.height ||
                          0,
                      }
                    : undefined,
                })) || [],
            };

          case "about": {
            const aboutBlock = block as HomepageAboutComponent;
            const aboutImg = aboutBlock.image;
            return {
              blockType: "about" as const,
              id: block.id,
              title: aboutBlock.title,
              content: cleanDescription(aboutBlock.content),
              image: aboutImg
                ? {
                    url: getMediaUrl(aboutImg),
                    alt: getMediaAlt(aboutImg, aboutBlock.title),
                    width: aboutImg.data?.attributes?.width || aboutImg.width || 0,
                    height: aboutImg.data?.attributes?.height || aboutImg.height || 0,
                  }
                : undefined,
            };
          }

          case "combined-testimonial-result":
            return {
              blockType: "combined-testimonial-result" as const,
              id: block.id,
              title: (block as HomepageCombinedTestimonialResultComponent)
                .title,
              subtitle: cleanDescription(
                (block as HomepageCombinedTestimonialResultComponent).subtitle,
              ),
              items:
                (
                  block as HomepageCombinedTestimonialResultComponent
                ).items?.map((item) => ({
                  id: item.id,
                  customerName: item.customerName,
                  content: cleanDescription(item.content),
                  rating: item.rating,
                  country: item.country,
                  beforeImage: item.beforeImage
                    ? {
                        url: getMediaUrl(item.beforeImage),
                        alt: getMediaAlt(
                          item.beforeImage,
                          `${item.customerName} - Before`,
                        ),
                        width:
                          item.beforeImage.data?.attributes?.width ||
                          item.beforeImage.width ||
                          0,
                        height:
                          item.beforeImage.data?.attributes?.height ||
                          item.beforeImage.height ||
                          0,
                      }
                    : undefined,
                  avatar: item.avatar
                    ? {
                        url: getMediaUrl(item.avatar),
                        alt: getMediaAlt(item.avatar, item.customerName),
                      }
                    : undefined,
                  afterImage: item.afterImage
                    ? {
                        url: getMediaUrl(item.afterImage),
                        alt: getMediaAlt(
                          item.afterImage,
                          `${item.customerName} - After`,
                        ),
                        width:
                          item.afterImage.data?.attributes?.width ||
                          item.afterImage.width ||
                          0,
                        height:
                          item.afterImage.data?.attributes?.height ||
                          item.afterImage.height ||
                          0,
                      }
                    : undefined,
                })) || [],
            };

          case "cta":
            const ctaBlock = {
              blockType: "cta" as const,
              id: block.id,
              heading: (block as HomepageCTAComponent).heading || "",
              highlightText: (block as HomepageCTAComponent).highlight_text,
              buttonLabel: (block as HomepageCTAComponent).button_label || "",
              buttonLink: (block as HomepageCTAComponent).button_link || "",
              backgroundImage: (block as HomepageCTAComponent).background_image
                ? {
                    url: getMediaUrl(
                      (block as HomepageCTAComponent).background_image,
                    ),
                    alt: getMediaAlt(
                      (block as HomepageCTAComponent).background_image,
                      "CTA Background",
                    ),
                    width: 0,
                    height: 0,
                  }
                : undefined,
              mobileBackgroundImage: (block as HomepageCTAComponent).mobile_background_image
                ? {
                    url: getMediaUrl(
                      (block as HomepageCTAComponent).mobile_background_image,
                    ),
                    alt: getMediaAlt(
                      (block as HomepageCTAComponent).mobile_background_image,
                      "CTA Mobile Background",
                    ),
                    width: 0,
                    height: 0,
                  }
                : undefined,
              humanImage: (block as HomepageCTAComponent).human_image
                ? {
                    url: getMediaUrl(
                      (block as HomepageCTAComponent).human_image,
                    ),
                    alt: getMediaAlt(
                      (block as HomepageCTAComponent).human_image,
                      "Dental Professional",
                    ),
                    width: 0,
                    height: 0,
                  }
                : undefined,
            };

            return ctaBlock;

          case "trust":
            return {
              blockType: "trust" as const,
              id: block.id,
              title: (block as HomepageTrustComponent).title,
              subtitle: cleanDescription(
                (block as HomepageTrustComponent).subtitle,
              ),
              stats:
                (block as HomepageTrustComponent).stats?.map((stat) => ({
                  id: stat.id,
                  number: stat.number,
                  label: stat.label,
                  suffix: stat.suffix,
                  icon: stat.icon
                    ? {
                        url: getMediaUrl(stat.icon),
                        alt: getMediaAlt(stat.icon, `Icon - ${stat.label}`),
                        width:
                          stat.icon.data?.attributes?.width ||
                          stat.icon.width ||
                          0,
                        height:
                          stat.icon.data?.attributes?.height ||
                          stat.icon.height ||
                          0,
                      }
                    : undefined,
                })) || [],
              certifications: (
                block as HomepageTrustComponent
              ).certifications.map((cert) => ({
                id: cert.id,
                name: cert.name,
                image: cert.image
                  ? {
                      url: getMediaUrl(cert.image),
                      alt: getMediaAlt(cert.image, cert.name),
                      width:
                        cert.image.data?.attributes?.width ||
                        cert.image.width ||
                        0,
                      height:
                        cert.image.data?.attributes?.height ||
                        cert.image.height ||
                        0,
                    }
                  : undefined,
              })),
            };

          case "process":
            return {
              blockType: "process" as const,
              id: block.id,
              title: (block as HomepageProcessComponent).title,
              subtitle: cleanDescription(
                (block as HomepageProcessComponent).subtitle,
              ),
              steps: (block as HomepageProcessComponent).steps || [],
            };

          case "doctor":
            return {
              blockType: "doctor" as const,
              id: block.id,
              title: (block as HomepageDoctorComponent).title,
              subtitle: cleanDescription(
                (block as HomepageDoctorComponent).subtitle,
              ),
              doctors:
                (block as HomepageDoctorComponent).doctors?.map((doc) => ({
                  id: doc.id,
                  name: doc.name,
                  specialization: doc.specialization,
                  bio: doc.bio,
                  image: doc.image
                    ? {
                        url: getMediaUrl(doc.image),
                        alt: getMediaAlt(doc.image, doc.name),
                        width:
                          doc.image.data?.attributes?.width ||
                          doc.image.width ||
                          0,
                        height:
                          doc.image.data?.attributes?.height ||
                          doc.image.height ||
                          0,
                      }
                    : undefined,
                  certificateImage: doc.certificate_image
                    ? {
                        url: getMediaUrl(doc.certificate_image),
                        alt: getMediaAlt(
                          doc.certificate_image,
                          `${doc.name} Certificate`,
                        ),
                        width:
                          doc.certificate_image.data?.attributes?.width ||
                          doc.certificate_image.width ||
                          0,
                        height:
                          doc.certificate_image.data?.attributes?.height ||
                          doc.certificate_image.height ||
                          0,
                      }
                    : undefined,
                  experienceYears: doc.experience_years,
                  badges: (doc.badges ?? [])
                    .map((b) => b.label)
                    .filter(Boolean),
                  stats: (doc.stats ?? []).map((s) => s.label).filter(Boolean),
                })) || [],
            };

          case "faq":
            return {
              blockType: "faq" as const,
              id: block.id,
              title: (block as HomepageFAQComponent).title,
              subtitle: cleanDescription(
                (block as HomepageFAQComponent).subtitle,
              ),
              questions: (block as HomepageFAQComponent).questions || [],
            };

          case "certification": {
            const certBlock = block as HomepageCertificationComponent;
            return {
              blockType: "certification" as const,
              id: certBlock.id,
              titleLines: certBlock.titleLines || [],
              subtitle: certBlock.subtitle,
              certificates:
                certBlock.certificates?.map((cert) => ({
                  id: cert.id,
                  name: cert.name,
                  organization: cert.organization,
                  year: (cert as Record<string, unknown>).year as number | undefined,
                  image: cert.image
                    ? {
                        url: getMediaUrl(cert.image),
                        alt: getMediaAlt(cert.image, cert.name),
                        width:
                          cert.image.data?.attributes?.width ||
                          cert.image.width ||
                          0,
                        height:
                          cert.image.data?.attributes?.height ||
                          cert.image.height ||
                          0,
                      }
                    : undefined,
                })) || [],
            };
          }

          case "papers-section": {
            const papersBlock = block as HomepagePapersSectionComponent;
            return {
              blockType: "papers-section" as const,
              id: papersBlock.id,
              title: papersBlock.title,
              subtitle: papersBlock.subtitle,
              papers:
                papersBlock.papers?.map((paper) => ({
                  id: paper.id,
                  link: paper.link,
                  image: paper.image
                    ? {
                        url: getMediaUrl(paper.image),
                        alt: getMediaAlt(paper.image, "Scientific Paper"),
                        width:
                          paper.image.data?.attributes?.width ||
                          paper.image.width ||
                          0,
                        height:
                          paper.image.data?.attributes?.height ||
                          paper.image.height ||
                          0,
                      }
                    : undefined,
                })) || [],
            };
          }

          case "blog-collection-section": {
            const blogBlock = block as HomepageBlogCollectionComponent;
            return {
              blockType: "blog-collection-section" as const,
              id: blogBlock.id,
              title: blogBlock.title,
              subtitle: cleanDescription(blogBlock.subtitle),
              posts: (blogBlock.posts || []).map((post) => {
                const data = post.attributes || post;
                const rawMedia = (data as Record<string, unknown>).coverImage || (data as Record<string, unknown>).imageCover;
                const mediaData = (rawMedia as Record<string, unknown>)?.data ? ((rawMedia as Record<string, unknown>).data as Record<string, unknown>)?.attributes : rawMedia;

                return {
                  id: post.id,
                  documentId: (post as unknown as Record<string, unknown>).documentId as string | undefined,
                  ...data,
                  imageUrl: (mediaData as Record<string, unknown>)?.url as string | null || null,
                  imageAlt: ((mediaData as Record<string, unknown>)?.alternativeText || data.title || "") as string,
                };
              }),
              showFeatured: blogBlock.showFeatured,
              isActive: (blogBlock as unknown as Record<string, unknown>).isActive as boolean | undefined,
            };
          }

          default:
            console.warn(`[getHomepage] Unknown block type: ${componentType}`);
            return null;
        }
      })
      .filter(
        (block: HomepageBlock | null): block is HomepageBlock => block !== null,
      );

    return {
      title: data.title || "Homepage",
      metadataTitle: data.metadata_title,
      metadataDescription: data.metadata_description,
      metadataImage: data.metadata_image
        ? getMediaUrl(data.metadata_image)
        : undefined,
      blocks,
    };
  } catch (_error) {
    return {
      title: "Homepage",
      blocks: [],
    };
  }
}

interface CustomerHeroComponent {
  __component: "customer.hero";
  id: number;
  badge?: string;
  title?: string;
  description?: string;
  images?: unknown[];
  image1?: unknown;
  image2?: unknown;
  image3?: unknown;
  image4?: unknown;
}

interface CustomerSuccessStoriesComponent {
  __component: "customer.success-stories";
  id: number;
  badge?: string;
  title?: string;
  description?: string;
  stories?: Array<{
    id?: number;
    name?: string;
    treatment?: string;
    quote?: string;
    rating?: number;
    avatar?: unknown;
    author?: string;
  }>;
}

interface CustomerCombinedTestimonialResultComponent {
  __component: "customer.combined-testimonial-result";
  id: number;
  title?: string;
  subtitle?: string;
  items?: Array<{
    customerName?: string;
    content?: string;
    rating?: number;
    country?: string;
    treatmentType?: string;
    beforeImage?: unknown;
    avatar?: unknown;
    afterImage?: unknown;
  }>;
}

interface CustomerReviewsComponent {
  __component: "customer.reviews";
  id: number;
  badge?: string;
  title?: string;
  rating?: number;
  total_reviews?: number;
  rating_subtitle?: string;
  description?: string;
  checklist?: Array<{
    text?: string;
    icon?: unknown;
  }>;
}

interface CustomerWhyChooseUsComponent {
  __component: "customer.why-choose-us";
  id: number;
  badge?: string;
  title?: string;
  description?: string;
  features?: Array<{
    title?: string;
    description?: string;
    icon?: unknown;
  }>;
}

interface CustomerStoryItem {
  name?: string;
  treatment?: string;
  quote?: string;
  rating?: number;
  avatar?: { url?: string; alt?: string } | null;
  author?: string;
}

interface CustomerCombinedTestimonialItem {
  customerName?: string;
  content?: string;
  rating?: number;
  country?: string;
  treatmentType?: string;
  beforeImage?: { url?: string; alt?: string } | null;
  avatar?: { url?: string; alt?: string } | null;
  afterImage?: { url?: string; alt?: string } | null;
}

interface CustomerChecklistItem {
  text?: string;
  icon?: { url?: string; alt?: string } | null;
}

interface CustomerFeatureItem {
  title?: string;
  description?: string;
  icon?: { url?: string; alt?: string } | null;
}

interface CustomerPageContent {
  hero?: {
    badge?: string;
    title?: string;
    description?: string;
    subtitle?: string;
    images?: Array<{ type: string; path: string; alt: string } | null>;
  };
  successStories?: {
    badge?: string;
    title?: string;
    description?: string;
    stories?: CustomerStoryItem[];
  };
  beforeAfterGallery?: {
    title?: string;
    subtitle?: string;
    items?: CustomerCombinedTestimonialItem[];
  };
  whyChooseUs?: {
    badge?: string;
    title?: string;
    description?: string;
    features?: CustomerFeatureItem[];
  };
  reviews?: {
    badge?: string;
    title?: string;
    rating?: number;
    total_reviews?: number;
    rating_subtitle?: string;
    description?: string;
    checklist?: CustomerChecklistItem[];
  };
}

export async function getCustomersPage(isDraftMode: boolean = false): Promise<{
  page: { title: string; description: string; slug: string } | null;
  content: CustomerPageContent | null;
}> {
  // 1. Try the new Customer single type first
  try {
    const fetchCustomer = async (draft: boolean) =>
      apiClient<{
        data?: {
          title?: string;
          description?: string;
          layout?: Record<string, unknown>[];
        };
      }>("/api/customer", {
        params: {
          "populate[layout][populate]": "*",
          "populate[layout][on][customer.hero][populate]":
            "image1,image2,image3,image4",
          "populate[layout][on][customer.combined-testimonial-result][populate][items][populate]":
            "beforeImage,afterImage,avatar",
          "populate[layout][on][customer.success-stories][populate][stories][populate]":
            "avatar",
          "populate[layout][on][customer.benefits][populate][benefits][populate]":
            "icon",
          "populate[layout][on][customer.statistics][populate][stats][populate]":
            "icon",
          "populate[layout][on][customer.why-choose-us][populate][features][populate]":
            "icon",
          "populate[layout][on][customer.reviews][populate][checklist][populate]":
            "icon",
          "populate[layout][on][customer.faq][populate][questions][populate]":
            "*",
          "populate[layout][on][customer.cta][populate][contact_info][populate]":
            "address_icon,phone_icon,email_icon",
        },
        tags: ["customer"],
        isDraftMode: draft,
      });

    let customerResponse = await fetchCustomer(isDraftMode);

    // Fallback: If published is empty (e.g. raw SQL migration), fetch draft
    if (!customerResponse?.data && !isDraftMode) {
      customerResponse = await fetchCustomer(true);
    }

    if (customerResponse?.data) {
      const data = customerResponse.data;
      const content = transformCustomersLayoutToContent(data.layout || []);
      return {
        page: {
          title: data.title || "",
          description: cleanDescription(data.description) || "",
          slug: "customers",
        },
        content,
      };
    }
  } catch {}

  // 2. Fall back to pages collection (legacy - 024-create-customer-page.js data)
  try {
    const fetchPages = async (draft: boolean) =>
      apiClient<{
        data?: Array<{
          title?: string;
          description?: string;
          slug?: string;
          content?: string;
        }>;
      }>("/api/pages", {
        params: {
          "filters[slug][$eq]": "customers",
          populate: "*",
        },
        tags: ["pages"],
        isDraftMode: draft,
      });

    let pagesResponse = await fetchPages(isDraftMode);

    if (
      (!pagesResponse?.data || pagesResponse.data.length === 0) &&
      !isDraftMode
    ) {
      pagesResponse = await fetchPages(true);
    }

    if (pagesResponse?.data && pagesResponse.data.length > 0) {
      const pageData = pagesResponse.data[0];

      let content: unknown = null;
      if (pageData.content) {
        try {
          content = JSON.parse(pageData.content);
        } catch {
          content = pageData.content;
        }
      }

      // Clean the legacy content if it has hero/descriptions
      if (content && typeof content === "object") {
        const legacyContent = content as Record<string, unknown>;
        
        // 1. Hero
        const hero = legacyContent.hero as Record<string, unknown> | undefined;
        if (hero) {
          hero.badge = cleanDescription(hero.badge);
          hero.title = cleanDescription(hero.title);
          hero.description = cleanDescription(hero.description);
          hero.subtitle = cleanDescription(hero.subtitle);
        }
        
        // 2. Success Stories
        const successStories = legacyContent.successStories as Record<string, unknown> | undefined;
        if (successStories) {
          successStories.badge = cleanDescription(successStories.badge);
          successStories.title = cleanDescription(successStories.title);
          successStories.description = cleanDescription(successStories.description);
          if (Array.isArray(successStories.stories)) {
            successStories.stories.forEach((s) => {
              const story = s as Record<string, unknown>;
              story.quote = cleanDescription(story.quote);
            });
          }
        }
        
        // 3. Before After Gallery
        const beforeAfterGallery = legacyContent.beforeAfterGallery as Record<string, unknown> | undefined;
        if (beforeAfterGallery) {
          beforeAfterGallery.title = cleanDescription(beforeAfterGallery.title);
          beforeAfterGallery.subtitle = cleanDescription(beforeAfterGallery.subtitle);
          if (Array.isArray(beforeAfterGallery.items)) {
            beforeAfterGallery.items.forEach((item) => {
              const galleryItem = item as Record<string, unknown>;
              galleryItem.content = cleanDescription(galleryItem.content);
            });
          }
        }
        
        // 4. Why Choose Us
        const whyChooseUs = legacyContent.whyChooseUs as Record<string, unknown> | undefined;
        if (whyChooseUs) {
          whyChooseUs.badge = cleanDescription(whyChooseUs.badge);
          whyChooseUs.title = cleanDescription(whyChooseUs.title);
          whyChooseUs.description = cleanDescription(whyChooseUs.description);
          if (Array.isArray(whyChooseUs.features)) {
            whyChooseUs.features.forEach((f) => {
              const feature = f as Record<string, unknown>;
              feature.description = cleanDescription(feature.description);
            });
          }
        }
        
        // 5. Reviews
        const reviews = legacyContent.reviews as Record<string, unknown> | undefined;
        if (reviews) {
          reviews.badge = cleanDescription(reviews.badge);
          reviews.title = cleanDescription(reviews.title);
          reviews.description = cleanDescription(reviews.description);
          reviews.rating_subtitle = cleanDescription(reviews.rating_subtitle);
        }
      }

      return {
        page: {
          title: pageData.title || "",
          description: cleanDescription(pageData.description) || "",
          slug: pageData.slug || "",
        },
        content: content as CustomerPageContent,
      };
    }
  } catch (_pagesError) {}

  // 3. Return null result if all API calls fail (will trigger Error UI)
  return { page: null, content: null };
}

function transformCustomersLayoutToContent(layout: Record<string, unknown>[]): CustomerPageContent | null {
  if (!layout || !Array.isArray(layout)) return null;

  const content: CustomerPageContent = {};

  for (const component of layout) {
    const componentType = (component.__component as string)?.split(".")[1];

    switch (componentType) {
      case "hero": {
        const comp = component as unknown as CustomerHeroComponent;
        content.hero = {
          badge: cleanDescription(comp.badge),
          title: cleanDescription(comp.title),
          description: cleanDescription(comp.description),
          images: (Array.isArray(comp.images)
            ? comp.images
            : [
                comp.image1,
                comp.image2,
                comp.image3,
                comp.image4,
              ]
          )
            .map((img) => {
              if (!img) return null;
              const imgObj = img as MediaSource;
              if (imgObj.url) {
                return {
                  type: "strapi",
                  path: imgObj.url,
                  alt: imgObj.alternativeText || "",
                };
              }
              return null;
            })
            .filter(Boolean),
        };
        break;
      }

      case "success-stories": {
        const comp = component as unknown as CustomerSuccessStoriesComponent;
        content.successStories = {
          badge: cleanDescription(comp.badge),
          title: cleanDescription(comp.title),
          description: cleanDescription(comp.description),
          stories: (comp.stories || []).map((s) => ({
            name: s.name,
            treatment: s.treatment,
            quote: cleanDescription(s.quote),
            rating: s.rating ?? 5,
            avatar: s.avatar
              ? {
                  url: getMediaUrl(s.avatar as MediaSource),
                  alt: (s.avatar as MediaSource).alternativeText || s.author || "",
                }
              : null,
          })),
        };
        break;
      }

      case "combined-testimonial-result": {
        const comp = component as unknown as CustomerCombinedTestimonialResultComponent;
        content.beforeAfterGallery = {
          title: cleanDescription(comp.title),
          subtitle: cleanDescription(comp.subtitle),
          items: (comp.items || []).map((item) => ({
            customerName: item.customerName,
            content: cleanDescription(item.content),
            rating: item.rating,
            country: item.country,
            treatmentType: item.treatmentType,
            beforeImage: item.beforeImage
              ? {
                  url: getMediaUrl(item.beforeImage as MediaSource),
                  alt: getMediaAlt(
                    item.beforeImage as MediaSource,
                    `${item.treatmentType || ""} - Before`,
                  ),
                }
              : null,
            avatar: item.avatar
              ? {
                  url: getMediaUrl(item.avatar as MediaSource),
                  alt: getMediaAlt(item.avatar as MediaSource, item.customerName || ""),
                }
              : null,
            afterImage: item.afterImage
              ? {
                  url: getMediaUrl(item.afterImage as MediaSource),
                  alt: getMediaAlt(
                    item.afterImage as MediaSource,
                    `${item.treatmentType || ""} - After`,
                  ),
                }
              : null,
          })),
        };
        break;
      }

      case "reviews": {
        const comp = component as unknown as CustomerReviewsComponent;
        content.reviews = {
          badge: cleanDescription(comp.badge),
          title: cleanDescription(comp.title),
          rating: comp.rating,
          total_reviews: comp.total_reviews,
          rating_subtitle: cleanDescription(comp.rating_subtitle),
          description: cleanDescription(comp.description),
          checklist: (comp.checklist || []).map((item) => ({
            text: cleanDescription(item.text),
            icon: item.icon
              ? {
                  url: getMediaUrl(item.icon as MediaSource),
                  alt: (item.icon as MediaSource).alternativeText || item.text || "",
                }
              : null,
          })),
        };
        break;
      }

      case "why-choose-us": {
        const comp = component as unknown as CustomerWhyChooseUsComponent;
        content.whyChooseUs = {
          badge: cleanDescription(comp.badge),
          title: cleanDescription(comp.title),
          description: cleanDescription(comp.description),
          features: (comp.features || []).map((feature) => ({
            title: cleanDescription(feature.title),
            description: cleanDescription(feature.description),
            icon: feature.icon
              ? {
                  url: getMediaUrl(feature.icon as MediaSource),
                  alt: (feature.icon as MediaSource).alternativeText || feature.title || "",
                }
              : null,
          })),
        };
        break;
      }

      default:
        console.warn(
          `[transformCustomersLayoutToContent] Unknown component type: ${componentType}`,
        );
    }
  }

  return content;
}

/**
 * Get contact page content
 *
 * Fetches contact page with all sections from CMS.
 * Contact page is a Single Type with hero (including map), form, and CTA.
 *
 * @returns Contact page object with all sections
 */
interface ContactHeroBlock {
  __component: "contact.hero";
  id?: number;
  title?: string;
  subtitle?: string;
  location_badge?: string;
  location_detail?: string;
  features?: Array<{
    icon?: string;
    label?: string;
    body?: string;
  }>;
  background_desktop?: unknown;
  background_mobile?: unknown;
  contact_form?: {
    title?: string;
    description?: string;
    name_label?: string;
    name_placeholder?: string;
    phone_label?: string;
    phone_placeholder?: string;
    email_label?: string;
    email_placeholder?: string;
    service_label?: string;
    service_placeholder?: string;
    service_options?: Array<string | { label?: string; value?: string }>;
    message_label?: string;
    message_placeholder?: string;
    submit_button_text?: string;
    success_message?: string;
    error_message?: string;
  };
}

interface ContactEliteStackBlock {
  __component: "contact.elite-stack";
  id?: number;
  title?: string;
  description?: string;
  cards?: Array<{
    description?: string;
    icon_image?: unknown;
    show_cta?: boolean;
    cta_label?: string;
    cta_link?: string;
  }>;
}

interface ContactMapSectionBlock {
  __component: "contact.map-section";
  id?: number;
  title?: string;
  description?: string;
  phone?: string;
  phone_secondary?: string;
  location_name?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
}

interface ContactFAQBlock {
  __component: "contact.faq";
  id?: number;
  title?: string;
  subtitle?: string;
  questions?: Array<{
    id?: number;
    question?: string;
    answer?: string;
  }>;
}

export interface ContactPageBlock {
  id: string;
  __component: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface ContactPageContent {
  blocks?: ContactPageBlock[];
}

interface ContactPageResponse {
  data?: {
    layout?: Array<Record<string, unknown>>;
  };
}

export async function getContactPage(
  isDraftMode: boolean = false,
): Promise<ContactPageContent> {
  try {
    const response = await apiClient<ContactPageResponse>("/api/contact-page", {
      params: {
        "populate[layout][populate]": "*",
        "populate[layout][on][contact.hero][populate][background_desktop]": "*",
        "populate[layout][on][contact.hero][populate][background_mobile]": "*",
        "populate[layout][on][contact.hero][populate][contact_form][populate][service_options]":
          "*",
        "populate[layout][on][contact.elite-stack][populate][cards][populate][icon_image]":
          "*",
        "populate[layout][on][contact.map-section]": "*",
        "populate[layout][on][contact.faq][populate][questions]": "*",
      },
      isDraftMode,
      tags: ["contact-page"],
    });

    const data = response.data;
    if (!data || !data.layout) {
      console.warn("[getContactPage] No contact page layout found");
      return {};
    }

    const layout = data.layout || [];

    // Map blocks preserving order from CMS
    const blocks: ContactPageBlock[] = layout.map(
      (block, index: number) => {
        const type = block.__component as string;
        let blockData: unknown = {};

        if (type === "contact.hero") {
          const comp = block as unknown as ContactHeroBlock;
          blockData = {
            title: comp.title,
            subtitle: cleanDescription(comp.subtitle),
            locationBadge: comp.location_badge || "",
            locationDetail: comp.location_detail || "",
            features: (comp.features || []).map((f) => ({
              icon: f.icon || "message",
              label: f.label || "",
              body: f.body || "",
            })),
            backgroundDesktopUrl: comp.background_desktop
              ? getMediaUrl(comp.background_desktop as MediaSource)
              : undefined,
            backgroundMobileUrl: comp.background_mobile
              ? getMediaUrl(comp.background_mobile as MediaSource)
              : undefined,
            contactForm: comp.contact_form
              ? {
                  title: comp.contact_form.title,
                  description: cleanDescription(comp.contact_form.description),
                  nameLabel: comp.contact_form.name_label,
                  namePlaceholder: comp.contact_form.name_placeholder,
                  phoneLabel: comp.contact_form.phone_label,
                  phonePlaceholder: comp.contact_form.phone_placeholder,
                  emailLabel: comp.contact_form.email_label,
                  emailPlaceholder: comp.contact_form.email_placeholder,
                  serviceLabel: comp.contact_form.service_label,
                  servicePlaceholder: comp.contact_form.service_placeholder,
                  serviceOptions: (
                    comp.contact_form.service_options || []
                  ).map((opt) =>
                    typeof opt === "string"
                      ? opt
                      : opt.label || opt.value || "Option",
                  ),
                  messageLabel: comp.contact_form.message_label,
                  messagePlaceholder: comp.contact_form.message_placeholder,
                  submitButtonText: comp.contact_form.submit_button_text,
                  successMessage: comp.contact_form.success_message,
                  errorMessage: comp.contact_form.error_message,
                }
              : undefined,
          };
        } else if (type === "contact.elite-stack") {
          const comp = block as unknown as ContactEliteStackBlock;
          blockData = {
            title: comp.title,
            description: cleanDescription(comp.description),
            cards: (comp.cards || []).map((card) => ({
              description: cleanDescription(card.description),
              iconImage: card.icon_image
                ? getMediaUrl(card.icon_image as MediaSource)
                : undefined,
              showCta: card.show_cta === true,
              ctaLabel: card.cta_label,
              ctaLink: card.cta_link,
            })),
          };
        } else if (type === "contact.map-section") {
          const comp = block as unknown as ContactMapSectionBlock;
          blockData = {
            title: comp.title || "Find Us",
            description: cleanDescription(comp.description),
            phone: comp.phone || CLINIC_INFO.phone1,
            phoneSecondary: comp.phone_secondary || CLINIC_INFO.phone2,
            location: {
              name: comp.location_name || CLINIC_INFO.name,
              address: comp.address || CLINIC_INFO.address,
              lat: parseFloat(comp.latitude || "") || 10.776145,
              lng: parseFloat(comp.longitude || "") || 106.676643,
            },
          };
        } else if (type === "contact.faq") {
          const comp = block as unknown as ContactFAQBlock;
          blockData = {
            title: comp.title,
            subtitle: cleanDescription(comp.subtitle),
            questions: (comp.questions || []).map((q) => ({
              id: q.id,
              question: q.question,
              answer: cleanDescription(q.answer),
            })),
          };
        }

        return {
          id: `contact-block-${index}-${(block.id as number | undefined) || index}`,
          __component: type,
          data: blockData,
        };
      },
    );

    return { blocks };
  } catch (_error) {
    return {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// About Page
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the About Page single type from Strapi.
 * Returns structured sections for the AboutUsContent component.
 */
interface AboutHeroSection {
  titleLines?: string[];
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
}

interface AboutExcellenceSection {
  badge?: string;
  title?: string;
  description?: string;
  stats?: Array<{
    value?: string;
    label?: string;
    icon?: string;
    iconImage?: string | null;
  }>;
}

interface AboutWhyChooseUsSection {
  badge?: string;
  title?: string;
  description?: string;
  features?: Array<{
    icon?: string;
    iconImage?: string | null;
    title?: string;
    description?: string;
  }>;
}

interface AboutPhilosophySection {
  titleLines?: string[];
  title?: string;
  quote?: string;
  tabs?: Array<{
    key?: string;
    label?: string;
    icon?: string;
    image?: string | null;
    title?: string;
    description?: string;
    highlight?: string;
  }>;
}

interface AboutCoreValuesSection {
  badge?: string;
  title?: string;
  description?: string;
  centerIcon?: string | null;
  values?: Array<{
    icon?: string;
    iconImage?: string | null;
    title?: string;
    description?: string;
  }>;
}

interface AboutCommitmentSection {
  badge?: string;
  title?: string;
  description?: string;
  commitments?: Array<{
    icon?: string;
    iconImage?: string | null;
    title?: string;
    subtitle?: string;
    description?: string;
  }>;
  patientAvatars?: string[];
}

interface AboutCTASection {
  heading?: string;
  highlightText?: string;
  buttonLabel?: string;
  buttonLink?: string;
  backgroundImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  humanImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  userAvatars?: Array<{
    url: string;
    alt: string;
    width: number;
    height: number;
  }>;
}

export interface AboutPageContent {
  hero: AboutHeroSection | null;
  excellence: AboutExcellenceSection | null;
  whyChooseUs: AboutWhyChooseUsSection | null;
  philosophy: AboutPhilosophySection | null;
  coreValues: AboutCoreValuesSection | null;
  commitment: AboutCommitmentSection | null;
  cta: AboutCTASection | null;
}

interface AboutPageResponse {
  data?: {
    hero?: {
      titleLines?: string[];
      title?: string;
      subtitle?: string;
      description?: string;
      hero_images?: MediaSource[];
    };
    excellence?: {
      badge?: string;
      title?: string;
      description?: string;
      stats?: Array<{
        value?: string;
        label?: string;
        icon?: string;
        icon_image?: MediaSource;
      }>;
    };
    why_choose_us?: {
      badge?: string;
      title?: string;
      description?: string;
      features?: Array<{
        icon?: string;
        icon_image?: MediaSource;
        title?: string;
        description?: string;
      }>;
    };
    philosophy?: {
      titleLines?: string[];
      title?: string;
      quote?: string;
      tabs?: Array<{
        key?: string;
        label?: string;
        icon?: string;
        image?: MediaSource;
        title?: string;
        description?: string;
        highlight?: string;
      }>;
    };
    core_values?: {
      badge?: string;
      title?: string;
      description?: string;
      center_icon?: MediaSource;
      values?: Array<{
        icon?: string;
        icon_image?: MediaSource;
        title?: string;
        description?: string;
      }>;
    };
    commitment?: {
      badge?: string;
      title?: string;
      description?: string;
      commitments?: Array<{
        icon?: string;
        icon_image?: MediaSource;
        title?: string;
        subtitle?: string;
        description?: string;
      }>;
      patient_avatars?: MediaSource[];
    };
    cta?: {
      heading?: string;
      highlight_text?: string;
      button_label?: string;
      button_link?: string;
      background_image?: MediaSource;
      human_image?: MediaSource;
      user_avatars?: MediaSource | MediaSource[];
    };
  };
}

export async function getAboutPage(isDraftMode: boolean = false): Promise<AboutPageContent | null> {
  try {
    const response = await apiClient<AboutPageResponse>("/api/about-page", {
      params: {
        "populate[hero][populate]": "hero_images,titleLines",
        "populate[excellence][populate][stats][populate]": "*",
        "populate[why_choose_us][populate][features][populate]": "*",
        "populate[philosophy][populate][titleLines][populate]": "*",
        "populate[philosophy][populate][tabs][populate]": "*",
        "populate[core_values][populate][values][populate]": "*",
        "populate[commitment][populate][commitments][populate]": "*",
        "populate[cta][populate]": "*",
      },
      isDraftMode,
      tags: ["about-page"],
      // Use proper caching: cache published content, don't cache drafts
      cache: isDraftMode ? "no-store" : "force-cache",
      next: isDraftMode
        ? undefined
        : { revalidate: false, tags: ["about-page"] },
    });

    const rawData = response?.data;
    if (!rawData) {
      console.warn("[getAboutPage] No data returned from API");
      return null;
    }

    const data = rawData;

    // Transform Strapi response → flat structure for frontend
    const hero = data.hero
      ? {
          titleLines: data.hero.titleLines || [],
          title: data.hero.title || "", // Keep for fallback if needed, though we moved to titleLines
          subtitle: cleanDescription(data.hero.subtitle) || "",
          description: cleanDescription(data.hero.description) || "",
          images: (data.hero.hero_images || []).map((img) =>
            getMediaUrl(img),
          ),
        }
      : null;

    const excellence = data.excellence
      ? {
          badge: data.excellence.badge || "",
          title: data.excellence.title || "",
          description: cleanDescription(data.excellence.description) || "",
          stats: (data.excellence.stats || []).map((s) => ({
            value: s.value || "",
            label: s.label || "",
            icon: s.icon || "",
            iconImage: s.icon_image ? getMediaUrl(s.icon_image) : null,
          })),
        }
      : null;

    const whyChooseUs = data.why_choose_us
      ? {
          badge: data.why_choose_us.badge || "",
          title: data.why_choose_us.title || "",
          description: cleanDescription(data.why_choose_us.description) || "",
          features: (data.why_choose_us.features || []).map((f) => ({
            icon: f.icon || "",
            iconImage: f.icon_image ? getMediaUrl(f.icon_image) : null,
            title: f.title || "",
            description: cleanDescription(f.description) || "",
          })),
        }
      : null;

    const philosophy = data.philosophy
      ? {
          titleLines: data.philosophy.titleLines || [],
          title: data.philosophy.title || "", // Keep for fallback during migration
          quote: cleanDescription(data.philosophy.quote) || "",
          tabs: (data.philosophy.tabs || []).map((t) => {
            const mappedImage = t.image ? getMediaUrl(t.image) : null;
            return {
              key: t.key || "",
              label: t.label || "",
              icon: t.icon || "",
              image: mappedImage,
              title: t.title || "",
              description: cleanDescription(t.description) || "",
              highlight: t.highlight || "",
            };
          }),
        }
      : null;

    const coreValues = data.core_values
      ? {
          badge: data.core_values.badge || "",
          title: data.core_values.title || "",
          description: cleanDescription(data.core_values.description) || "",
          centerIcon: data.core_values.center_icon
            ? getMediaUrl(data.core_values.center_icon)
            : null,
          values: (data.core_values.values || []).map((v) => ({
            icon: v.icon || "",
            iconImage: v.icon_image ? getMediaUrl(v.icon_image) : null,
            title: v.title || "",
            description: cleanDescription(v.description) || "",
          })),
        }
      : null;

    const commitment = data.commitment
      ? {
          badge: data.commitment.badge || "",
          title: data.commitment.title || "",
          description: cleanDescription(data.commitment.description) || "",
          commitments: (data.commitment.commitments || []).map((c) => ({
            icon: c.icon || "",
            iconImage: c.icon_image ? getMediaUrl(c.icon_image) : null,
            title: c.title || "",
            subtitle: cleanDescription(c.subtitle) || "",
            description: cleanDescription(c.description) || "",
          })),
          patientAvatars: (data.commitment.patient_avatars || []).map(
            (img) => getMediaUrl(img),
          ),
        }
      : null;

    const cta = data.cta
      ? {
          heading: data.cta.heading || "",
          highlightText: data.cta.highlight_text,
          buttonLabel: data.cta.button_label || "",
          buttonLink: data.cta.button_link || "",
          backgroundImage: data.cta.background_image
            ? {
                url: getMediaUrl(data.cta.background_image),
                alt: getMediaAlt(data.cta.background_image, "CTA Background"),
                width: 0,
                height: 0,
              }
            : undefined,
          humanImage: data.cta.human_image
            ? {
                url: getMediaUrl(data.cta.human_image),
                alt: getMediaAlt(data.cta.human_image, "Dental Professional"),
                width: 0,
                height: 0,
              }
            : undefined,
          userAvatars: data.cta.user_avatars
            ? (Array.isArray(data.cta.user_avatars)
                ? data.cta.user_avatars
                : [data.cta.user_avatars]
              ).map((avatar) => ({
                url: avatar.url
                  ? `${NEXT_PUBLIC_STRAPI_URL}${avatar.url}`
                  : getMediaUrl(avatar),
                alt: avatar.alternativeText || avatar.name || "User Avatar",
                width: avatar.width || 0,
                height: avatar.height || 0,
              }))
            : undefined,
        }
      : null;

    return {
      hero,
      excellence,
      whyChooseUs,
      philosophy,
      coreValues,
      commitment,
      cta,
    };
  } catch (_error) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dental Bleaching Page
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the Dental Bleaching Page single type from Strapi.
 *
 * Uses a dynamic zone layout with 11 sections:
 *   hero, what-is-bleaching, discoloration-types, treatment-options,
 *   safety, pre-treatment, results, comparison, faq, clinic, cta
 *
 * Returns structured section data keyed by section name for the frontend.
 */
interface BleachingHeroComponent {
  __component: "dental-bleaching.hero";
  badge?: string;
  title_highlight?: string;
  subtitle?: string;
  image?: unknown;
}

interface BleachingWhatIsBleachingComponent {
  __component: "dental-bleaching.what-is-bleaching";
  title?: string;
  short_def?: string;
  body?: string;
  read_more?: Array<string | { value?: string; label?: string }>;
  highlights?: Array<{ label?: string; value?: string }>;
  image?: unknown;
  note?: string;
}

interface BleachingDiscolorationTypesComponent {
  __component: "dental-bleaching.discoloration-types";
  badge?: string;
  title?: string;
  subtitle?: string;
  extrinsic_title?: string;
  extrinsic_causes?: string[];
  extrinsic_treatment?: string;
  extrinsic_icon?: unknown;
  intrinsic_title?: string;
  intrinsic_causes?: string[];
  intrinsic_treatment?: string;
  intrinsic_icon?: unknown;
  callout?: string;
  limitation?: string;
}

interface BleachingTreatmentOptionsComponent {
  __component: "dental-bleaching.treatment-options";
  badge?: string;
  title?: string;
  options?: Array<{
    icon?: unknown;
    title?: string;
    best_for?: string;
    time?: string;
    concentration?: string;
    summary?: string;
    summary_detail?: string;
    accent_color?: string;
  }>;
  comparison_table?: Array<{
    method?: string;
    agent?: string;
    time?: string;
    timeline?: string;
    sensitivity?: string;
  }>;
}

interface BleachingSafetyComponent {
  __component: "dental-bleaching.safety";
  badge?: string;
  title?: string;
  subtitle?: string;
  reassurance?: string;
  items?: Array<{
    title?: string;
    icon?: unknown;
    content?: string;
  }>;
}

interface BleachingPreTreatmentComponent {
  __component: "dental-bleaching.pre-treatment";
  badge?: string;
  title?: string;
  subtitle?: string;
  steps?: Array<{
    num?: string;
    title?: string;
    desc?: string;
  }>;
}

interface BleachingResultsComponent {
  __component: "dental-bleaching.results";
  badge?: string;
  title?: string;
  cases?: Array<{
    before_image?: unknown;
    after_image?: unknown;
  }>;
  disclaimer?: string;
  points?: Array<{ text?: string }>;
  timeline?: Array<{
    label?: string;
    shade?: number;
    weeks?: string;
    pct?: number;
  }>;
}

interface BleachingComparisonComponent {
  __component: "dental-bleaching.comparison";
  badge?: string;
  title?: string;
  subtitle?: string;
  rows?: Array<{
    feature?: string;
    pro?: string;
    otc?: string;
  }>;
}

interface BleachingFAQComponent {
  __component: "dental-bleaching.faq";
  questions?: Array<{
    q?: string;
    a?: string;
  }>;
}

interface BleachingClinicComponent {
  __component: "dental-bleaching.clinic";
  badge?: string;
  title?: string;
  subtitle?: string;
  image?: unknown;
  doctor_byline_label?: string;
  doctor_byline_name?: string;
  doctor_byline_credentials?: string;
  clinical_description?: Array<{ text?: string }>;
  credentials?: Array<{ text?: string }>;
  badge_chips?: string[];
  reviews?: Array<{
    name?: string;
    country?: string;
    stars?: number;
    text?: string;
  }>;
  disclaimer?: string;
}

interface BleachingCTAComponent {
  __component: "dental-bleaching.cta";
  id?: number;
  heading?: string;
  highlight_text?: string;
  button_link?: string;
  background_image?: unknown;
  human_image?: unknown;
}

interface BleachingPageContent {
  hero?: {
    badge: string;
    titleHighlight: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    image: string | null;
    badges: string[];
  };
  whatIsBleaching?: {
    title: string;
    shortDef: string;
    body: string;
    readMore: string[];
    highlights: Array<{ label: string; value: string }>;
    image: string | null;
    note: string;
  };
  discolorationTypes?: {
    badge: string;
    title: string;
    subtitle: string;
    extrinsic: {
      title: string;
      accent: string;
      causes: string[];
      treatment: string;
      icon: string | null;
    };
    intrinsic: {
      title: string;
      accent: string;
      causes: string[];
      treatment: string;
      icon: string | null;
    };
    callout: string;
    limitation: string;
  };
  treatmentOptions?: {
    badge: string;
    title: string;
    options: Array<{
      icon: string | null;
      title: string;
      bestFor: string;
      time: string;
      concentration: string;
      summary: string[];
      accentColor: string;
    }>;
    comparisonTable: Array<{
      method: string;
      agent: string;
      time: string;
      timeline: string;
      sensitivity: string;
    }>;
  };
  safety?: {
    badge: string;
    title: string;
    subtitle: string;
    reassurance: string;
    items: Array<{
      title: string;
      icon: string | null;
      content: string;
    }>;
  };
  preTreatment?: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
  };
  results?: {
    badge: string;
    title: string;
    cases: Array<{
      before: string;
      after: string;
    }>;
    disclaimer: string;
    points: string[];
    timeline: Array<{
      label: string;
      shade: number;
      weeks: string;
      pct: number;
    }>;
  };
  comparison?: {
    badge: string;
    title: string;
    subtitle: string;
    rows: Array<{
      feature: string;
      pro: string;
      otc: string;
    }>;
  };
  faq?: Array<{
    q: string;
    a: string;
  }>;
  clinic?: {
    badge: string;
    title: string;
    subtitle: string;
    image: string | null;
    doctorByline: {
      label: string;
      name: string;
      credentials: string;
    };
    clinicalDescription: string[];
    credentials: string[];
    badgeChips: string[];
    reviews: Array<{
      name: string;
      country: string;
      stars: number;
      text: string;
    }>;
    disclaimer: string;
  };
  cta?: {
    blockType: "cta";
    id?: number;
    heading: string;
    highlightText?: string;
    buttonLabel: string;
    buttonLink: string;
    backgroundImage?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    humanImage?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
  };
}

interface StrapiDentalBleachingResponse {
  data?: {
    metadata_title?: string;
    metadata_description?: string;
    layout?: Array<Record<string, unknown>>;
  };
}

export async function getDentalBleachingPage(
  isDraftMode: boolean = false,
): Promise<(BleachingPageContent & { meta: { title?: string; description?: string } }) | null> {
  try {
    const response = await apiClient<StrapiDentalBleachingResponse>("/api/dental-bleaching", {
      params: {
        // Populate entire layout dynamic zone with all nested components
        "populate[layout][populate][highlights]": "*",
        "populate[layout][populate][options]": "*",
        "populate[layout][populate][comparison_table]": "*",
        "populate[layout][populate][items]": "*",
        "populate[layout][populate][steps]": "*",
        "populate[layout][populate][points]": "*",
        "populate[layout][populate][timeline]": "*",
        "populate[layout][populate][rows]": "*",
        "populate[layout][populate][questions]": "*",
        "populate[layout][populate][clinical_description]": "*",
        "populate[layout][populate][credentials]": "*",
        "populate[layout][populate][reviews]": "*",
        "populate[layout][populate][read_more]": "*",
        "populate[layout][populate][cases]": "*",
        "populate[layout][populate][cases][populate][before_image]": "*",
        "populate[layout][populate][cases][populate][after_image]": "*",
        // Media fields per section
        "populate[layout][on][dental-bleaching.hero][populate][image]": "*",
        "populate[layout][on][dental-bleaching.what-is-bleaching][populate][image]":
          "*",

        "populate[layout][on][dental-bleaching.clinic][populate][image]": "*",
        "populate[layout][on][dental-bleaching.cta][populate][background_image]":
          "*",
        "populate[layout][on][dental-bleaching.cta][populate][human_image]":
          "*",
        "populate[layout][on][dental-bleaching.discoloration-types][populate][extrinsic_icon]":
          "*",
        "populate[layout][on][dental-bleaching.discoloration-types][populate][intrinsic_icon]":
          "*",
      },
      isDraftMode,
      tags: ["dental-bleaching"],
      cache: isDraftMode ? "no-store" : "force-cache",
      next: isDraftMode
        ? undefined
        : { revalidate: false, tags: ["dental-bleaching"] },
    });

    const rawData = response?.data;
    if (!rawData) {
      console.warn("[getDentalBleachingPage] No data returned from API");
      return null;
    }

    const layout = rawData.layout || [];
    if (!layout.length) {
      console.warn(
        "[getDentalBleachingPage] Empty layout — CMS not yet seeded",
      );
      return null;
    }

    const transformed = transformDentalBleachingLayout(layout);
    return {
      ...transformed,
      meta: {
        title: rawData.metadata_title || undefined,
        description: rawData.metadata_description || undefined,
      },
    };
  } catch (_error) {
    console.error("[getDentalBleachingPage] Error:", _error);
    return null;
  }
}

function transformDentalBleachingLayout(layout: Record<string, unknown>[]): BleachingPageContent {
  const result: BleachingPageContent = {};

  for (const component of layout) {
    const type = (component.__component as string)?.split(".")[1];

    switch (type) {
      case "hero": {
        const comp = component as unknown as BleachingHeroComponent;
        result.hero = {
          badge: comp.badge || "",
          titleHighlight: comp.title_highlight || "",
          subtitle: cleanDescription(comp.subtitle) || "",
          cta1: "Book a Consultation",
          cta2: "Learn More",
          image: comp.image ? getMediaUrl(comp.image as MediaSource) : null,
          badges: [
            "ADA-Aligned Protocols",
            "5-Star Patient Rating",
            "24-Hour Turnaround",
            "English-Speaking Team",
          ],
        };
        break;
      }

      case "what-is-bleaching": {
        const comp = component as unknown as BleachingWhatIsBleachingComponent;
        result.whatIsBleaching = {
          title: comp.title || "",
          shortDef: cleanDescription(comp.short_def) || "",
          body: cleanDescription(comp.body) || "",
          readMore: (comp.read_more || []).map((rm) => {
            if (typeof rm === "string") return rm;
            return (
              cleanDescription(rm.value) || cleanDescription(rm.label) || ""
            );
          }),
          highlights: (comp.highlights || []).map((h) => ({
            label: h.label || "",
            value: h.value || "",
          })),
          image: comp.image ? getMediaUrl(comp.image as MediaSource) : null,
          note: cleanDescription(comp.note) || "",
        };
        break;
      }

      case "discoloration-types": {
        const comp = component as unknown as BleachingDiscolorationTypesComponent;
        result.discolorationTypes = {
          badge: comp.badge || "",
          title: comp.title || "",
          subtitle: cleanDescription(comp.subtitle) || "",
          extrinsic: {
            title: comp.extrinsic_title || "Extrinsic Stains",
            accent: "amber",
            causes: Array.isArray(comp.extrinsic_causes)
              ? comp.extrinsic_causes
              : [],
            treatment: cleanDescription(comp.extrinsic_treatment) || "",
            icon: comp.extrinsic_icon
              ? getMediaUrl(comp.extrinsic_icon as MediaSource)
              : null,
          },
          intrinsic: {
            title: comp.intrinsic_title || "Intrinsic Stains",
            accent: "slate",
            causes: Array.isArray(comp.intrinsic_causes)
              ? comp.intrinsic_causes
              : [],
            treatment: cleanDescription(comp.intrinsic_treatment) || "",
            icon: comp.intrinsic_icon
              ? getMediaUrl(comp.intrinsic_icon as MediaSource)
              : null,
          },
          callout: cleanDescription(comp.callout) || "",
          limitation: cleanDescription(comp.limitation) || "",
        };
        break;
      }

      case "treatment-options": {
        const comp = component as unknown as BleachingTreatmentOptionsComponent;
        result.treatmentOptions = {
          badge: comp.badge || "",
          title: comp.title || "",
          options: (comp.options || []).map((opt) => ({
            icon: opt.icon
              ? typeof opt.icon === "string"
                ? opt.icon
                : getMediaUrl(opt.icon as MediaSource)
              : null,
            title: opt.title || "",
            bestFor: opt.best_for || "",
            time: opt.time || "",
            concentration: opt.concentration || "",
            summary: [opt.summary, opt.summary_detail].filter(Boolean) as string[],
            accentColor: opt.accent_color || "sky",
          })),
          comparisonTable: (comp.comparison_table || []).map(
            (row) => ({
              method: row.method || "",
              agent: row.agent || "",
              time: row.time || "",
              timeline: row.timeline || "",
              sensitivity: row.sensitivity || "",
            }),
          ),
        };
        break;
      }

      case "safety": {
        const comp = component as unknown as BleachingSafetyComponent;
        result.safety = {
          badge: comp.badge || "",
          title: comp.title || "",
          subtitle: cleanDescription(comp.subtitle) || "",
          reassurance: cleanDescription(comp.reassurance) || "",
          items: (comp.items || []).map((item) => ({
            title: item.title || "",
            icon: item.icon
              ? typeof item.icon === "string"
                ? item.icon
                : getMediaUrl(item.icon as MediaSource)
              : null,
            content: cleanDescription(item.content) || "",
          })),
        };
        break;
      }

      case "pre-treatment": {
        const comp = component as unknown as BleachingPreTreatmentComponent;
        result.preTreatment = {
          badge: comp.badge || "",
          title: comp.title || "",
          subtitle: cleanDescription(comp.subtitle) || "",
          steps: (comp.steps || []).map((step) => ({
            num: step.num || "",
            title: step.title || "",
            desc: cleanDescription(step.desc) || "",
          })),
        };
        break;
      }

      case "results": {
        const comp = component as unknown as BleachingResultsComponent;
        result.results = {
          badge: comp.badge || "",
          title: comp.title || "",
          cases:
            comp.cases && comp.cases.length > 0
              ? comp.cases.map((c) => ({
                  before: c.before_image ? getMediaUrl(c.before_image as MediaSource) : "",
                  after: c.after_image ? getMediaUrl(c.after_image as MediaSource) : "",
                }))
              : [],
          disclaimer: cleanDescription(comp.disclaimer) || "",
          points: (comp.points || []).map((p) => p.text || ""),
          timeline: (comp.timeline || []).map((t) => ({
            label: t.label || "",
            shade: t.shade ?? 1,
            weeks: t.weeks || "",
            pct: t.pct ?? 0,
          })),
        };
        break;
      }

      case "comparison": {
        const comp = component as unknown as BleachingComparisonComponent;
        result.comparison = {
          badge: comp.badge || "",
          title: comp.title || "",
          subtitle: cleanDescription(comp.subtitle) || "",
          rows: (comp.rows || []).map((row) => ({
            feature: row.feature || "",
            pro: cleanDescription(row.pro) || "",
            otc: cleanDescription(row.otc) || "",
          })),
        };
        break;
      }

      case "faq": {
        const comp = component as unknown as BleachingFAQComponent;
        result.faq = (comp.questions || []).map((q) => ({
          q: q.q || "",
          a: cleanDescription(q.a) || "",
        }));
        break;
      }

      case "clinic": {
        const comp = component as unknown as BleachingClinicComponent;
        result.clinic = {
          badge: comp.badge || "",
          title: comp.title || "",
          subtitle: cleanDescription(comp.subtitle) || "",
          image: comp.image ? getMediaUrl(comp.image as MediaSource) : null,
          doctorByline: {
            label: comp.doctor_byline_label || "Written & Reviewed by",
            name: comp.doctor_byline_name || "Our Clinical Dental Team",
            credentials: comp.doctor_byline_credentials || "",
          },
          clinicalDescription: (comp.clinical_description || []).map(
            (p) => cleanDescription(p.text) || "",
          ),
          credentials: (comp.credentials || []).map(
            (c) => c.text || "",
          ),
          badgeChips: Array.isArray(comp.badge_chips)
            ? comp.badge_chips
            : [
                "ADA-Aligned",
                "AACD-Affiliated",
                "5-Star Rated",
                "1,000+ Cases",
              ],
          reviews: (comp.reviews || []).map((r) => ({
            name: r.name || "",
            country: r.country || "",
            stars: r.stars ?? 5,
            text: cleanDescription(r.text) || "",
          })),
          disclaimer: cleanDescription(comp.disclaimer) || "",
        };
        break;
      }

      case "cta": {
        const comp = component as unknown as BleachingCTAComponent;
        result.cta = {
          blockType: "cta" as const,
          id: comp.id,
          heading: comp.heading || "",
          highlightText: comp.highlight_text,
          buttonLabel: "Book a Consultation",
          buttonLink: comp.button_link || "",
          backgroundImage: comp.background_image
            ? {
                url: getMediaUrl(comp.background_image as MediaSource),
                alt: getMediaAlt(comp.background_image as MediaSource, "CTA Background"),
                width: 0,
                height: 0,
              }
            : undefined,
          humanImage: comp.human_image
            ? {
                url: getMediaUrl(comp.human_image as MediaSource),
                alt: getMediaAlt(comp.human_image as MediaSource, "Dental Professional"),
                width: 0,
                height: 0,
              }
            : undefined,
        };
        break;
      }

      default:
        console.warn(
          `[transformDentalBleachingLayout] Unknown component: ${type}`,
        );
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Methods
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all contact methods
 *
 * Fetches contact methods from CMS for floating contact widget and contact page.
 * Returns active methods sorted by order.
 *
 * @param isDraftMode - Whether to fetch draft content (for preview)
 * @returns Array of contact methods
 */
export async function getContactMethods(
  isDraftMode: boolean = false,
): Promise<import("@/src/types/strapi").ContactMethod[]> {
  try {
    const response = await apiClient<
      import("@/src/types/strapi").StrapiContactMethods
    >("/api/contact-methods", {
      params: {
        "populate[icon]": "true",
        "filters[is_active][$eq]": true,
        "sort[0]": "order:asc",
      },
      isDraftMode,
      tags: ["contact-methods"],
      cache: isDraftMode ? "no-store" : "force-cache",
      next: isDraftMode
        ? undefined
        : { revalidate: false, tags: ["contact-methods"] },
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Transform to frontend format
    const transformed = response.data.map((method) => ({
      id: method.id,
      type: method.type,
      label: method.label,
      href: method.href,
      icon: method.icon
        ? {
            url: getMediaUrl(method.icon),
            alt: getMediaAlt(method.icon, method.label),
            width: 0,
            height: 0,
          }
        : undefined,
      iconUrl: method.icon ? getMediaUrl(method.icon) : undefined,
      color: method.color,
      order: method.order,
      isActive: method.is_active,
    }));

    return transformed;
  } catch (_error) {
    return [];
  }
}

interface AIChatQuestion {
  id: number;
  emoji?: string;
  label?: string;
  prompt?: string;
}

/**
 * Get AI Chat Configuration
 *
 * Fetches the AI Chat configuration (avatar, name, welcome message, common questions) from CMS.
 * Returns null if not found, falling back to frontend defaults.
 *
 * @param isDraftMode - Whether to fetch draft content (for preview)
 * @returns AI Chat Config or null
 */
export async function getAIChatConfig(
  isDraftMode: boolean = false,
): Promise<import("@/src/types/strapi").AIChatConfig | null> {
  try {
    const response = await apiClient<
      import("@/src/types/strapi").StrapiAIChatConfig
    >("/api/ai-chat-config", {
      params: {
        "populate[ai_avatar]": "true",
        "populate[common_questions]": "true",
      },
      isDraftMode,
      tags: ["ai-chat-config"],
      cache: isDraftMode ? "no-store" : "force-cache",
      next: isDraftMode
        ? undefined
        : { revalidate: false, tags: ["ai-chat-config"] },
    });

    if (!response.data) {
      return null;
    }

    const {
      is_enabled,
      default_open,
      ai_name,
      ai_avatar,
      welcome_message,
      empty_state_title,
      empty_state_subtitle,
      empty_state_description,
      quick_replies_title,
      launcher_open_label,
      launcher_close_label,
      panel_aria_label,
      common_questions,
    } = response.data;

    return {
      isEnabled: is_enabled ?? true,
      defaultOpen: default_open ?? true,
      aiName: ai_name || "AI Dental Assistant",
      aiAvatar: ai_avatar
        ? {
            url: getMediaUrl(ai_avatar),
            alt: getMediaAlt(ai_avatar, ai_name),
            width: 0,
            height: 0,
          }
        : undefined,
      welcomeMessage: welcome_message || undefined,
      emptyStateTitle: empty_state_title || "Hello! 👋",
      emptyStateSubtitle:
        empty_state_subtitle || "I'm the AI dental assistant at",
      emptyStateDescription:
        empty_state_description ||
        "I can answer questions about our dental services, appointment scheduling, and anything else you'd like to know.",
      quickRepliesTitle: quick_replies_title || "Common questions:",
      launcherOpenLabel: launcher_open_label || "Open AI Dental Assistant",
      launcherCloseLabel: launcher_close_label || "Close chat",
      panelAriaLabel: panel_aria_label || "AI Dental Assistant Chat",
      commonQuestions: (common_questions || []).map((q) => {
        const question = q as unknown as AIChatQuestion;
        return {
          id: question.id,
          emoji: question.emoji || undefined,
          label: question.label || "",
          prompt: question.prompt || "",
        };
      }),
    };
  } catch (_error) {
    console.error("Error fetching AI Chat Config:", _error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Service Pages — Dental Veneers, Braces, General Dentistry, Implants, Crowns
// ─────────────────────────────────────────────────────────────────────────────

/** Generic populate params for a service page layout dynamic zone */
const SERVICE_LAYOUT_POPULATE = {
  "populate[layout][populate][pros]": "*",
  "populate[layout][populate][cons]": "*",
  "populate[layout][populate][rows]": "*",
  "populate[layout][populate][suitable]": "*",
  "populate[layout][populate][not_suitable]": "*",
  "populate[layout][populate][patients]": "*",
  "populate[layout][populate][questions]": "*",
  "populate[layout][populate][comparison_rows]": "*",
  "populate[layout][populate][pricing_rows]": "*",

  // ─── Strapi v5 Component-Specific Dynamic Zone Deep Populate ───
  // 1. Dental Implants
  "populate[layout][on][dental-implants.structure][populate][implant_image]": "*",
  "populate[layout][on][dental-implants.structure][populate][parts][populate][icon]": "*",
  "populate[layout][on][dental-implants.benefits][populate][items][populate][icon]": "*",
  "populate[layout][on][dental-implants.procedure][populate][steps][populate][image]": "*",
  "populate[layout][on][dental-implants.why-choose-us][populate][items][populate][icon]": "*",
  "populate[layout][on][dental-implants.why-choose-us][populate][clinic_image]": "*",
  "populate[layout][on][dental-implants.doctors][populate][doctors][populate][image]": "*",
  "populate[layout][on][dental-implants.brands][populate][items][populate][logo]": "*",
  "populate[layout][on][dental-implants.testimonials][populate][items][populate][flag]": "*",
  "populate[layout][on][dental-implants.testimonials][populate][items][populate][avatar]": "*",

  // 2. Dental Bleaching
  "populate[layout][on][dental-bleaching.hero][populate][image]": "*",
  "populate[layout][on][dental-bleaching.results][populate][cases][populate][before_image]": "*",
  "populate[layout][on][dental-bleaching.results][populate][cases][populate][after_image]": "*",
  "populate[layout][on][dental-bleaching.safety][populate][items][populate][icon]": "*",
  "populate[layout][on][dental-bleaching.treatment-options][populate][options][populate][icon]": "*",

  // 3. Dental Veneers
  "populate[layout][on][dental-veneers.hero][populate][image]": "*",
  "populate[layout][on][dental-veneers.why-vietnam][populate][pillars][populate][icon]": "*",
  "populate[layout][on][dental-veneers.why-vietnam][populate][doctors][populate][image]": "*",
  "populate[layout][on][dental-veneers.process][populate][steps][populate][image]": "*",
  "populate[layout][on][dental-veneers.testimonials][populate][items][populate][avatar]": "*",
  "populate[layout][on][dental-veneers.testimonials][populate][items][populate][before]": "*",
  "populate[layout][on][dental-veneers.testimonials][populate][items][populate][after]": "*",

  // 4. Dental Braces
  "populate[layout][on][dental-braces.hero][populate][image]": "*",
  "populate[layout][on][dental-braces.why-us][populate][items][populate][icon]": "*",
  "populate[layout][on][dental-braces.why-us][populate][image]": "*",
  "populate[layout][on][dental-braces.braces-types][populate][items][populate][icon]": "*",
  "populate[layout][on][dental-braces.process][populate][steps][populate][image]": "*",

  // 5. Dental Crowns
  "populate[layout][on][dental-crowns.hero][populate][image]": "*",
  "populate[layout][on][dental-crowns.why-choose][populate][items][populate][icon]": "*",
  "populate[layout][on][dental-crowns.lifespan][populate][factors][populate][icon]": "*",
  "populate[layout][on][dental-crowns.lifespan][populate][materials][populate][icon]": "*",
  "populate[layout][on][dental-crowns.journey][populate][steps][populate][image]": "*",
  "populate[layout][on][dental-crowns.pricing][populate][payment_methods][populate][icon]": "*",

  // 6. General Dentistry
  "populate[layout][on][general-dentistry.hero][populate][image]": "*",
  "populate[layout][on][general-dentistry.why-us][populate][items][populate][icon]": "*",
  "populate[layout][on][general-dentistry.services][populate][items][populate][icon]": "*",
};

interface ServiceSubItem {
  id?: number;
  title?: string;
  desc?: string;
  feature?: string;
  veneer?: string;
  crown?: string;
  num?: string;
  image?: unknown;
  icon?: unknown;
  logo?: unknown;
  type?: string;
  per_tooth?: string;
  package?: string;
  origin?: string;
  warranty?: string;
  recommended?: boolean;
  name?: string;
  role?: string;
  years?: string;
  avatar?: unknown;
  country?: string;
  treatment?: string;
  stars?: number;
  quote?: string;
  flag?: unknown;
  before?: unknown;
  after?: unknown;
  q?: string;
  a?: string;
  subtitle?: string;
  price_range?: string;
  duration?: string;
  pros?: string[];
  cons?: string[];
  metal?: string;
  ceramic?: string;
  selfLig?: string;
  aligner?: string;
  factors?: string;
  service?: string;
  price?: string;
  note?: string;
  customerName?: string;
  content?: string;
  treatment_type?: string;
  beforeImage?: unknown;
  afterImage?: unknown;
  rating?: number;
  brand?: string;
  price_each?: string;
  price_from_2?: string;
  allon4?: string;
  allon6?: string;
  highlight?: boolean | string;
  price_16?: string;
  suitable?: boolean;
  best_for?: string;
  material?: string;
  lifespan?: string;
  situation?: string;
  recommendation?: string;
  crown_type?: string;
  zirconia?: string;
  emax?: string;
  pfm?: string;
  accent_color?: string;
  credentials?: string;
  label?: string;
  detail?: string;
  color?: string;
  single?: string;
  full?: string;
  table_type?: string;
  text?: string;
}

interface MaterialLifespanCmp {
  id?: number;
  name?: string;
  years?: string;
  description?: string;
  icon?: unknown;
}

interface ServiceComponent {
  __component: string;
  id?: number;
  h1?: string;
  h2?: string;
  badge?: string;
  subtitle?: string;
  body?: string;
  callout?: string;
  image?: unknown;
  clinic_image?: unknown;
  heading?: string;
  button_link?: string;
  context?: string;
  disclaimer?: string;
  doctor_byline_label?: string;
  doctor_byline_name?: string;
  doctor_byline_credentials?: string;
  badge_chips?: string[];
  extrinsic_title?: string;
  extrinsic_causes?: string[];
  extrinsic_treatment?: string;
  extrinsic_icon?: unknown;
  intrinsic_title?: string;
  intrinsic_causes?: string[];
  intrinsic_treatment?: string;
  intrinsic_icon?: unknown;
  limitation?: string;
  note?: string;
  num?: string;
  duration?: string;
  desc?: string;
  title?: string;
  accent_color?: string;
  price_range?: string;
  brand?: string;
  price_each?: string;
  price_from_2?: string;
  allon4?: string;
  allon6?: string;
  highlight?: string;
  price_16?: string;
  suitable?: ServiceSubItem[];
  not_suitable?: ServiceSubItem[];
  best_for?: string;
  icon?: unknown;
  logo?: unknown;
  customerName?: string;
  country?: string;
  rating?: number;
  content?: string;
  treatment_type?: string;
  beforeImage?: unknown;
  afterImage?: unknown;
  background_image?: unknown;
  snippet?: string;
  table_type?: string;
  situation?: string;
  recommendation?: string;
  crown_type?: string;
  crown_title?: string;
  crown_description?: string;
  veneer_title?: string;
  veneer_description?: string;
  implant_title?: string;
  implant_description?: string;
  comparison_title?: string;
  comparison_footnote?: string;
  description?: string;
  payment_subtitle?: string;
  bg_desktop?: unknown;
  bg_mobile?: unknown;
  material?: string;
  materials?: MaterialLifespanCmp[];
  lifespan?: string;
  recommended?: boolean;
  trust_info?: string;
  per_tooth?: string;
  package?: string;
  role?: string;
  years?: string;
  avatar?: unknown;
  name?: string;
  treatment?: string;
  stars?: number;
  quote?: string;
  before?: unknown;
  after?: unknown;
  q?: string;
  a?: string;
  label?: string;
  detail?: string;
  color?: string;
  single?: string;
  full?: string;
  avoid_image?: unknown;
  implant_image?: unknown;
  parts?: ServiceSubItem[];
  // Arrays
  pros?: ServiceSubItem[];
  cons?: ServiceSubItem[];
  rows?: ServiceSubItem[];
  items?: ServiceSubItem[];
  comparison?: ServiceSubItem[];
  comparison_rows?: ServiceSubItem[];
  pricing_rows?: ServiceSubItem[];
  payment_methods?: ServiceSubItem[];
  steps?: ServiceSubItem[];
  pillars?: ServiceSubItem[];
  doctors?: ServiceSubItem[];
  patients?: ServiceSubItem[];
  questions?: ServiceSubItem[];
  factors?: ServiceSubItem[];
  daily_habits?: ServiceSubItem[];
  things_to_avoid?: ServiceSubItem[];
}

interface StrapiServicePageResponse {
  data?: {
    layout?: ServiceComponent[];
    metadata_title?: string;
    metadata_description?: string;
  };
}

function makeServicePageFetch(
  endpoint: string,
  tag: string,
  transform: (layout: ServiceComponent[]) => Record<string, unknown>,
) {
  return async function (isDraftMode = false): Promise<(Record<string, unknown> & { meta: { title?: string; description?: string } }) | null> {
      const filteredParams: Record<string, string> = {};
      for (const [key, value] of Object.entries(SERVICE_LAYOUT_POPULATE)) {
        if (!key.includes("[on][")) {
          filteredParams[key] = value;
          continue;
        }
        if (key.includes(`[on][${tag}.`)) {
          filteredParams[key] = value;
        }
      }
    try {
      const response = await apiClient<StrapiServicePageResponse>(endpoint, {
        params: filteredParams,
        isDraftMode,
        tags: [tag],
        cache:
          isDraftMode || process.env.NODE_ENV === "development"
            ? "no-store"
            : "force-cache",
        next:
          isDraftMode || process.env.NODE_ENV === "development"
            ? undefined
            : { revalidate: false, tags: [tag] },
      });
      const data = response?.data;
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        fs.writeFileSync('/Users/hoabui/Desktop/dental-app-v2/dental-frontend/api_log.txt', JSON.stringify({ tag, filteredParams, responseData: response }, null, 2) + '\n');
      } catch (e) {}
      if (!data) return null;
      const layout = data.layout || [];
      if (!layout.length) return null;
      const transformed = transform(layout);
      return {
        ...transformed,
        meta: {
          title: data.metadata_title || undefined,
          description: data.metadata_description || undefined,
        },
      };
    } catch (e: any) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        fs.writeFileSync('/Users/hoabui/Desktop/dental-app-v2/dental-frontend/api_error.txt', JSON.stringify({ tag, error: e?.message || String(e), stack: e?.stack }, null, 2) + '\n');
      } catch (err) {}
      return null;
    }
  };
}

// ─── Dental Veneers ───────────────────────────────────────────────────────────

export const getDentalVeneersPage = makeServicePageFetch(
  "/api/dental-veneers",
  "dental-veneers",
  (layout) => {
    const r: Record<string, unknown> = {};
    for (const c of layout) {
      const t = (c.__component as string)?.split(".")[1];
      switch (t) {
        case "hero":
          r.hero = {
            h1: c.h1,
            subtitle: cleanDescription(c.subtitle),
            cta1: "Book a Free Consultation",
            cta2: "View Pricing",
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
            badges: [],
          };
          break;
        case "what-are-veneers":
          r.whatAreVeneers = {
            badge: c.badge,
            h2: c.h2,
            body: cleanDescription(c.body),
            callout: cleanDescription(c.callout),
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "pros-cons":
          r.prosCons = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            pros: (c.pros || []).map((p) => ({
              title: p.title,
              desc: cleanDescription(p.desc),
            })),
            cons: (c.cons || []).map((p) => ({
              title: p.title,
              desc: cleanDescription(p.desc),
            })),
          };
          break;
        case "comparison":
          r.comparison = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            rows: (c.rows || []).map((row) => ({
              feature: row.feature,
              veneer: row.veneer,
              crown: row.crown,
            })),
          };
          break;
        case "candidates":
          r.candidates = {
            badge: c.badge,
            h2: c.h2,
            suitable: (c.suitable || []).map((s) => ({
              title: s.title,
              desc: cleanDescription(s.desc),
            })),
            notSuitable: (c.not_suitable || []).map((s) => ({
              title: s.title,
              desc: cleanDescription(s.desc),
            })),
          };
          break;
        case "process":
          r.process = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            steps: (c.steps || []).map((s) => ({
              num: s.num,
              title: s.title,
              desc: cleanDescription(s.desc),
              image: s.image ? getMediaUrl(s.image as MediaSource) : null,
            })),
          };
          break;
        case "care":
          r.care = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            items: (c.items || []).map((i) => ({
              icon:
                i.icon && typeof i.icon === "object"
                  ? getMediaUrl(i.icon as MediaSource)
                  : i.icon || null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "pricing":
          r.pricing = {
            badge: c.badge,
            h2: c.h2,
            context: cleanDescription(c.context),
            rows: (c.rows || []).map((row) => ({
              type: row.type,
              perTooth: row.per_tooth,
              package: row.package,
              origin: row.origin,
              warranty: row.warranty,
              recommended: row.recommended,
            })),
            disclaimer: cleanDescription(c.disclaimer),
          };
          break;
        case "cost-factors":
          r.costFactors = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            items: (c.items || []).map((i) => ({
              icon:
                i.icon && typeof i.icon === "object"
                  ? getMediaUrl(i.icon as MediaSource)
                  : i.icon || null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "why-vietnam":
          r.whyVietnam = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            pillars: (c.pillars || []).map((p) => ({
              icon:
                p.icon && typeof p.icon === "object"
                  ? getMediaUrl(p.icon as MediaSource)
                  : p.icon || null,
              title: p.title,
              desc: cleanDescription(p.desc),
            })),
            doctors: (c.doctors || []).map((d) => ({
              name: d.name,
              role: d.role,
              years: d.years,
              avatar: d.avatar ? getMediaUrl(d.avatar as MediaSource) : null,
            })),
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "testimonials":
          r.testimonials = {
            badge: c.badge,
            h2: c.h2,
            patients: (c.patients || []).map((p) => ({
              name: p.name,
              country: p.country,
              treatment: p.treatment,
              stars: p.stars ?? 5,
              quote: cleanDescription(p.quote),
              avatar: p.avatar ? getMediaUrl(p.avatar as MediaSource) : null,
              before: p.before ? getMediaUrl(p.before as MediaSource) : null,
              after: p.after ? getMediaUrl(p.after as MediaSource) : null,
            })),
          };
          break;
        case "faq":
          r.faq = {
            badge: c.badge,
            h2: c.h2,
            items: Array.isArray(c.items) && c.items.length > 0
              ? c.items.map((q) => ({
                  q: q.q,
                  a: cleanDescription(q.a),
                }))
              : [],
          };
          break;
        case "cta":
          r.cta = {
            heading: c.heading,
            buttonLabel: "Book a Free Consultation",
            buttonLink: c.button_link,
          };
          break;
      }
    }
    return r;
  },
);

// ─── Dental Braces ────────────────────────────────────────────────────────────

export const getDentalBracesPage = makeServicePageFetch(
  "/api/dental-braces",
  "dental-braces",
  (layout) => {
    const r: Record<string, unknown> = {};
    for (const c of layout) {
      const t = (c.__component as string)?.split(".")[1];
      switch (t) {
        case "hero":
          r.hero = {
            badge: c.badge,
            h1: c.h1,
            subtitle: cleanDescription(c.subtitle),
            cta1: "Book a Free Consultation",
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "what-are-braces":
          r.whatAreBraces = {
            badge: c.badge,
            h2: c.h2,
            body: cleanDescription(c.body),
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "braces-types":
          r.bracesTypes = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            options: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              subtitle: i.subtitle,
              desc: cleanDescription(i.desc),
              pros: i.pros || [],
              cons: i.cons || [],
              priceRange: i.price_range,
              duration: i.duration,
              accentColor: i.accent_color || "sky",
              color: i.accent_color || "sky",
              timeLabel: "Duration",
              time: i.duration,
              bestFor: i.subtitle,
            })),
            comparison: (c.comparison || []).map((row) => ({
              feature: row.feature,
              metal: row.metal,
              ceramic: row.ceramic,
              selfLig: row.selfLig,
              aligner: row.aligner,
            })),
          };
          break;
        case "conditions":
          r.conditions = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            note: cleanDescription(c.note),
            items: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "process":
          r.process = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            steps: (c.steps || []).map((s) => ({
              num: s.num,
              title: s.title,
              duration: s.duration || "Contact us",
              description: cleanDescription(s.desc),
              image: s.image ? getMediaUrl(s.image as MediaSource) : "",
            })),
          };
          break;
        case "duration": {
          const rows = c.rows || [];
          r.duration = {
            badge: c.badge || "",
            h2: c.h2 || "",
            subtitle: cleanDescription(c.subtitle),
            snippet: c.snippet || "",
            note: c.note || "",
            timeline: rows.map((row, idx) => {
              const months = (row.duration || "").replace(" months", "").trim();
              const pct =
                idx === 0 ? 60 : idx === 1 ? 72 : idx === 2 ? 85 : 100;
              return {
                label: row.type || "",
                months: months || "",
                pct: pct,
              };
            }),
            factors: rows.map((row) => ({
              label: row.type || "",
              desc: cleanDescription(row.factors) || "",
              icon: row.icon ? getMediaUrl(row.icon as MediaSource) : null,
            })),
          };
          break;
        }
        case "why-us":
          r.whyUs = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
            pillars: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "care":
          r.care = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            items: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "faq":
          r.faq = {
            badge: c.badge,
            h2: c.h2,
            items: Array.isArray(c.questions) && c.questions.length > 0
              ? c.questions.map((q) => ({
                  q: q.q,
                  a: cleanDescription(q.a),
                }))
              : [],
          };
          break;
        case "cta":
          r.cta = {
            heading: c.heading,
            buttonLabel: "Book a Free Consultation",
            buttonLink: c.button_link,
          };
          break;
      }
    }
    return r;
  },
);

// ─── General Dentistry ────────────────────────────────────────────────────────

export const getGeneralDentistryPage = makeServicePageFetch(
  "/api/general-dentistry",
  "general-dentistry",
  (layout) => {
    const r: Record<string, unknown> = {};
    for (const c of layout) {
      const t = (c.__component as string)?.split(".")[1];
      switch (t) {
        case "hero":
          r.hero = {
            titleLines: c.h1 ? [c.h1] : [],
            body: cleanDescription(c.subtitle),
            cta: "Book a Free Consultation",
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "importance":
          r.importance = {
            badge: c.badge,
            h2: c.h2,
            body: cleanDescription(c.subtitle),
            links: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              label: i.title,
              desc: cleanDescription(i.desc),
            })),
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "services":
          r.services = {
            badge: c.badge,
            h2: c.h2,
            intro: cleanDescription(c.subtitle),
            items: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              name: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "process":
          r.process = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            steps: (c.steps || []).map((s) => ({
              num: s.num,
              title: s.title,
              desc: cleanDescription(s.desc),
            })),
          };
          break;
        case "pricing":
          r.pricing = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            rows: (c.rows || []).map((row) => ({
              service: row.service,
              price: row.price,
              unit: row.note,
            })),
            disclaimer: cleanDescription(c.disclaimer),
          };
          break;
        case "why-us":
          r.whyUs = {
            badge: c.badge,
            h2: c.h2,
            pillars: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              body: cleanDescription(i.desc),
            })),
          };
          break;
        case "faq":
          r.faq = {
            badge: c.badge,
            h2: c.h2,
            items: Array.isArray(c.questions) && c.questions.length > 0
              ? c.questions.map((q) => ({
                  q: q.q,
                  a: cleanDescription(q.a),
                }))
              : [],
          };
          break;
        case "cta":
          r.cta = {
            heading: c.heading,
            buttonLabel: "Book a Free Consultation",
            buttonLink: c.button_link,
          };
          break;
      }
    }
    return r;
  },
);

// ─── Dental Implants ──────────────────────────────────────────────────────────

export const getDentalImplantsPage = makeServicePageFetch(
  "/api/dental-implants",
  "dental-implants",
  (layout) => {
    const r: Record<string, unknown> = {};
    for (const c of layout) {
      const t = (c.__component as string)?.split(".")[1];
      switch (t) {
        case "hero":
          r.hero = {
            badge: c.badge || null,
            h1: c.h1,
            subtitle: cleanDescription(c.subtitle),
            cta1: "Book Free Consultation",
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
            backgroundImage: c.background_image
              ? getMediaUrl(c.background_image as MediaSource)
              : null,
          };
          break;
        case "what-are-implants":
          r.whatAreImplants = {
            badge: c.badge,
            h2: c.h2,
            body: c.body ? [cleanDescription(c.body)] : [],
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "structure":
          r.implantStructure = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            implantImage: c.implant_image ? getMediaUrl(c.implant_image as MediaSource) : null,
            parts: (c.parts || []).map((p) => ({
              name: p.name,
              desc: cleanDescription(p.desc),
              icon: p.icon ? getMediaUrl(p.icon as MediaSource) : null,
            })),
          };
          break;
        case "procedure":
          r.procedure = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            steps: (c.steps || []).map((s) => ({
              num: s.num,
              title: s.title,
              desc: cleanDescription(s.desc),
              description: cleanDescription(s.desc),
              duration: s.duration,
              image: s.image ? getMediaUrl(s.image as MediaSource) : null,
            })),
          };
          break;
        case "why-choose-us":
          try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fs = require('fs');
            fs.writeFileSync('/Users/hoabui/Desktop/dental-app-v2/dental-frontend/c_why_choose_us.json', JSON.stringify(c, null, 2));
          } catch(e) {}
          console.log("[DEBUG why-choose-us raw c]:", JSON.stringify(c, null, 2));
          r.whyChooseUs = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            points: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
            clinicImage: c.clinic_image ? getMediaUrl(c.clinic_image as MediaSource) : null,
          };
          console.log("[DEBUG why-choose-us parsed r.whyChooseUs]:", JSON.stringify(r.whyChooseUs, null, 2));
          break;
        case "doctors":
          r.doctors = {
            badge: c.badge,
            h2: c.h2,
            profiles: (c.doctors || []).map((docItem) => {
              const creds = cleanDescription(docItem.credentials) || "";
              const sentences = creds
                .split(".")
                .map((s) => s.trim())
                .filter(Boolean);
              const education = sentences.slice(
                0,
                Math.max(1, sentences.length - 1),
              );
              const experience =
                sentences[sentences.length - 1] || "10+ years experience";
              return {
                name: docItem.name,
                title: docItem.role,
                education: education,
                certifications: [
                  "Dental Implantology",
                  "FDA-Approved",
                  "All-on-X",
                ],
                experience: experience,
                photo: docItem.image ? getMediaUrl(docItem.image as MediaSource) : "",
              };
            }),
          };
          break;
        case "brands":
          r.brands = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            points: (c.items || []).map((i) => ({
              title: i.name,
              desc: cleanDescription(i.desc),
              iconUrl: i.logo ? getMediaUrl(i.logo as MediaSource) : null,
            })),
          };
          break;
        case "testimonials":
          r.testimonials = {
            badge: c.badge,
            h2: c.h2,
            reviews: (c.items || []).map((i) => ({
              name: i.name,
              country: i.country,
              stars: i.stars ?? 5,
              quote: cleanDescription(i.text),
              flag: i.flag ? getMediaUrl(i.flag as any) : null,
              photo: i.avatar ? getMediaUrl(i.avatar as any) : null,
            })),
          };
          break;
        case "combined-testimonial-result":
          r.results = {
            badge: "Transformation",
            title: c.title,
            subtitle: cleanDescription(c.subtitle),
            items: (c.items || []).map((i) => ({
              customerName: i.customerName,
              country: i.country,
              rating: i.rating ?? 5,
              content: cleanDescription(i.content),
              treatmentType: i.treatment_type,
              beforeImage: i.beforeImage
                ? {
                    url: getMediaUrl(i.beforeImage as MediaSource),
                    alt: getMediaAlt(i.beforeImage as MediaSource, ""),
                  }
                : null,
              afterImage: i.afterImage
                ? {
                    url: getMediaUrl(i.afterImage as MediaSource),
                    alt: getMediaAlt(i.afterImage as MediaSource, ""),
                  }
                : null,
              labelBefore: "Before",
              labelAfter: "After",
            })),
          };
          break;
        case "pricing":
          {
            const rows = c.rows || [];
            const implantRows = rows.filter(
              (row) => row.table_type === "implant",
            );
            const crownRows = rows.filter(
              (row) => row.table_type === "crown",
            );
            r.pricing = {
              badge: c.badge,
              h2: c.h2,
              subtitle: cleanDescription(c.subtitle),
              implantTable: {
                headers: [
                  "Implant Type",
                  "Price Per Implant",
                  "Price (From 2 Implants)",
                  "All-on-4",
                  "All-on-6",
                  "Origin",
                ],
                rows: implantRows.map((row) => ({
                  brand: row.brand,
                  priceEach: row.price_each,
                  priceFrom2: row.price_from_2,
                  allon4: row.allon4,
                  allon6: row.allon6,
                  origin: row.origin,
                  highlight: row.highlight,
                })),
              },
              crownTable: {
                headers: [
                  "Crown Type",
                  "Price Per Tooth",
                  "16-Teeth Package",
                  "Origin",
                  "Warranty",
                ],
                rows: crownRows.map((row) => ({
                  type: row.type,
                  price: row.price,
                  price16: row.price_16,
                  origin: row.origin,
                  warranty: row.warranty,
                  highlight: row.highlight,
                })),
              },
              note: cleanDescription(c.disclaimer),
            };
          }
          break;
        case "indications":
          r.indications = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            cases: (c.items || []).map((i) => ({
              title: i.title,
              desc: cleanDescription(i.desc),
              suitable: i.suitable,
            })),
          };
          break;
        case "types":
          r.types = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            options: (c.items || []).map((i) => ({
              title: i.title,
              desc: cleanDescription(i.desc),
              bestFor: i.best_for,
            })),
          };
          break;
        case "benefits":
          r.benefits = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            items: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "faq":
          r.faq = {
            badge: c.badge,
            h2: c.h2,
            subtitle: cleanDescription(c.subtitle),
            items: Array.isArray(c.items) && c.items.length > 0
              ? c.items.map((i) => ({
                  q: i.q,
                  a: cleanDescription(i.a),
                }))
              : [],
          };
          break;
      }
    }
    return r;
  },
);

// ─── Dental Crowns ────────────────────────────────────────────────────────────

export const getDentalCrownsPage = makeServicePageFetch(
  "/api/dental-crowns",
  "dental-crowns",
  (layout) => {
    const r: Record<string, unknown> = {};
    for (const c of layout) {
      const t = (c.__component as string)?.split(".")[1];
      switch (t) {
        case "hero":
          r.hero = {
            title: c.h1,
            subtitle: cleanDescription(c.subtitle),
            cta1: "Book Free Consultation",
            image: c.image ? getMediaUrl(c.image as MediaSource) : null,
          };
          break;
        case "journey":
          r.crownProcess = (c.steps || []).map((s) => ({
            title: s.title,
            duration: s.num || "",
            description: cleanDescription(s.desc),
            image: s.image ? getMediaUrl(s.image as MediaSource) : "",
          }));
          r.journeyHeader = {
            badge: c.badge || "",
            title: c.h2 || "",
            subtitle: cleanDescription(c.subtitle),
          };
          break;
        case "crown-types": {
          r.crownMaterials = {
            badge: c.badge,
            title: c.h2,
            subtitle: cleanDescription(c.subtitle),
            helperBar: "",
            quickLogic: [],
            materials: (c.items || []).map((i) => {
              const nameLower = (i.name || "").toLowerCase();
              let id = "pfm";
              if (nameLower.includes("zirconia")) {
                id = "zirconia";
              } else if (
                nameLower.includes("emax") ||
                nameLower.includes("lithium")
              ) {
                id = "emax";
              }
              return {
                id,
                name: i.name,
                material: i.material,
                shortName: i.material || i.name || "",
                lifespan: i.lifespan,
                bestFor: cleanDescription(i.best_for),
                pros: i.pros || [],
                cons: i.cons || [],
                priceRange: i.price_range,
                recommended: i.recommended,
              };
            }),
          };

          // Generate crown lifespan dynamically from c.items
          r.crownLifespan = (c.items || []).map((i) => {
            const nameLower = (i.name || "").toLowerCase();
            let icon = "Gem";
            if (nameLower.includes("zirconia")) {
              icon = "Shield";
            } else if (
              nameLower.includes("emax") ||
              nameLower.includes("lithium")
            ) {
              icon = "Sparkles";
            } else if (
              nameLower.includes("pfm") ||
              nameLower.includes("metal")
            ) {
              icon = "Layers";
            }

            let years = i.lifespan || "";
            if (years.includes(".")) {
              years = years.split(".")[0];
            }
            if (years.toLowerCase().includes("with")) {
              years = years.split(/with/i)[0];
            }
            years = years.trim();

            return {
              name: i.name,
              years,
              icon,
              position: i.best_for ? cleanDescription(i.best_for) : "",
            };
          });

          break;
        }
        case "lifespan":
          r.lifespanSection = {
            title: c.h2,
            subtitle: cleanDescription(c.subtitle),
            sourcesText:
              "Clinical study source: International Journal of Prosthodontics",
          };
          r.longevityFactors = (c.factors || []).map((f) => ({
            title: f.title,
            description: cleanDescription(f.desc),
            icon: f.icon ? getMediaUrl(f.icon as MediaSource) : null,
          }));
          if (c.materials && c.materials.length > 0) {
            r.crownLifespan = c.materials.map((m) => ({
              name: m.name,
              years: m.years,
              icon: m.icon ? getMediaUrl(m.icon as MediaSource) : null,
              position: cleanDescription(m.description),
            }));
          }
          break;
        case "care": {
          r.crownCare = {
            title: c.h2,
            subtitle: cleanDescription(c.subtitle),
            dailyHabits: (c.daily_habits || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              description: cleanDescription(i.desc),
            })),
            avoidList: (c.things_to_avoid || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              description: cleanDescription(i.desc),
            })),
            avoidImage: c.avoid_image ? getMediaUrl(c.avoid_image as MediaSource) : null,
            images: {
              hero: "",
              habits: "",
              avoid: "",
            },
          };
          break;
        }
        case "when-need-crown":
          r.whenNeedCrown = {
            badge: c.badge,
            title: c.h2,
            subtitle: cleanDescription(c.subtitle),
            indications: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              desc: cleanDescription(i.desc),
            })),
          };
          break;
        case "decision-guide":
          r.decisionGuide = {
            badge: c.badge,
            title: c.h2,
            subtitle: cleanDescription(c.subtitle),
            comparisonTable: (c.rows || []).map((row) => ({
              situation: row.situation,
              option:
                cleanDescription(row.recommendation) || row.crown_type || "",
            })),
            treatments: {
              crown: {
                title: c.crown_title || "",
                description: cleanDescription(c.crown_description) || "",
              },
              veneer: {
                title: c.veneer_title || "",
                description: cleanDescription(c.veneer_description) || "",
              },
              implant: {
                title: c.implant_title || "",
                description: cleanDescription(c.implant_description) || "",
              },
            },
            comparison: {
              title: c.comparison_title || "",
              footnote: cleanDescription(c.comparison_footnote) || "",
              headers: [
                { key: "feature", label: "Feature" },
                { key: "zirconia", label: "Zirconia" },
                { key: "emax", label: "Lithium Disilicate (E.max)" },
                { key: "pfm", label: "Porcelain Fused to Metal" },
              ],
              rows: (c.comparison_rows || []).map((row) => ({
                feature: row.feature,
                zirconia: { value: (row.zirconia as string) || "" },
                emax: { value: (row.emax as string) || "" },
                pfm: { value: (row.pfm as string) || "" },
              })),
            },
          };
          break;
        case "why-choose":
          r.whyChoose = {
            badge: c.badge,
            title: c.h2,
            subtitle: cleanDescription(c.subtitle),
            trustInfo: c.trust_info || "",
            pillars: (c.items || []).map((i) => ({
              icon: i.icon ? getMediaUrl(i.icon as MediaSource) : null,
              title: i.title,
              description: cleanDescription(i.desc),
            })),
          };
          break;
        case "faq":
          r.faq = Array.isArray(c.questions) && c.questions.length > 0
            ? c.questions.map((q) => ({
                q: q.q,
                a: cleanDescription(q.a),
              }))
            : [];
          break;
        case "cta":
          r.cta = {
            heading: c.heading,
            buttonLabel: "Book Free Consultation",
            buttonLink: c.button_link,
          };
          break;
        case "pricing":
          r.pricingSection = {
            title: c.title,
            description: cleanDescription(c.description),
            paymentSubtitle: cleanDescription(c.payment_subtitle),
            bgDesktop: c.bg_desktop ? getMediaUrl(c.bg_desktop as MediaSource) : null,
            bgMobile: c.bg_mobile ? getMediaUrl(c.bg_mobile as MediaSource) : null,
            paymentMethods: (c.payment_methods || []).map((m) => ({
              icon: m.icon ? getMediaUrl(m.icon as MediaSource) : null,
              label: m.label,
              detail: m.detail,
              color: m.color,
            })),
          };
          r.crownPricing = (c.pricing_rows || []).map((row) => ({
            material: row.material || "",
            origin: row.origin || "",
            warranty: row.warranty || "",
            single: row.single || "",
            full: row.full || "",
          }));
          break;
      }
    }
    return r;
  },
);
