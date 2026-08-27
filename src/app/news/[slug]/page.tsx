import { Metadata } from "next/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { NavigationLink } from "@/src/components/ui/NavigationLink";
import { MarkdownContent } from "@/src/components/MarkdownContent";
import { apiClient } from "@/src/lib/api/client";

interface CoverImageField {
  url?: string;
  alternativeText?: string;
  data?: {
    attributes?: {
      url: string;
      alternativeText?: string;
    };
  };
}

interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: CoverImageField | null;
  imageCover?: CoverImageField | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string | null;
  imageAlt?: string;
}

interface StrapiResponse {
  data: BlogPost[];
  meta?: Record<string, unknown>;
}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || "";

async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await apiClient<StrapiResponse>("/api/blogs", {
      params: {
        "filters[slug][$eq]": slug,
        populate: "*",
      },
      isDraftMode: false,
      tags: ["blogs", `blog-${slug}`], // Cache tags for webhook revalidation
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    const blog = response.data[0];
    const data = (blog as unknown as { attributes?: BlogPost }).attributes || blog;
    const rawMedia = data.coverImage || data.imageCover;
    const mediaData = rawMedia?.data?.attributes || rawMedia;

    return {
      ...data,
      id: blog.id,
      documentId: blog.documentId,
      imageUrl: mediaData?.url || null,
      imageAlt: mediaData?.alternativeText || data.title,
    };
  } catch {
    return null;
  }
}

async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await apiClient<StrapiResponse>("/api/blogs", {
      params: {
        "fields[0]": "slug",
      },
      isDraftMode: false,
      tags: ["blogs"], // Cache tags for webhook revalidation
    });

    return response.data?.map((blog) => blog.slug) || [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${blog.title} | Saigon International Dental Clinic`,
    description: blog.excerpt || blog.title,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const imageUrl = blog.imageUrl
    ? blog.imageUrl.startsWith("http")
      ? blog.imageUrl
      : `${STRAPI_URL}${blog.imageUrl}`
    : "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=800";

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary-50 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm sm:text-base md:text-lg">
            <ol className="flex items-center gap-2 text-foreground-muted">
              <li>
                <NavigationLink
                  href="/"
                  className="hover:text-primary-600 transition-colors"
                >
                  Home
                </NavigationLink>
              </li>
              <li>/</li>
              <li>
                <NavigationLink
                  href="/news"
                  className="hover:text-primary-600 transition-colors"
                >
                  News
                </NavigationLink>
              </li>
              <li>/</li>
              <li className="text-foreground">{blog.title}</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#165197] leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-foreground-secondary mb-8">
            <time
              dateTime={blog.publishedAt}
              className="text-sm sm:text-base md:text-lg"
            >
              {new Date(blog.publishedAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-sm sm:text-base md:text-lg text-foreground-secondary font-normal leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Cover Image */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-12">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={imageUrl}
            alt={blog.imageAlt || blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 pb-20">
        <div className="prose max-w-none">
          {blog.content ? (
            <MarkdownContent content={blog.content} />
          ) : (
            <p className="text-sm sm:text-base md:text-lg text-foreground-secondary">
              Content is being updated...
            </p>
          )}
        </div>

        {/* Back to News */}
        <div className="mt-16 pt-8 border-t border-border">
          <NavigationLink
            href="/news"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to News
          </NavigationLink>
        </div>
      </article>
    </main>
  );
}

// force-dynamic: prevents stale SSG content baked when Strapi was unreachable at build time.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;
