/**
 * Blog Domain Types
 *
 * Defines shared interfaces for articles, categories, and translation maps
 * on the News section of the dental application.
 */

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  publishedAt: string;
}
