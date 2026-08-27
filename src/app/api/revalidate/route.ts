/**
 * On-Demand Revalidation API Route
 *
 * Handles webhook requests from Strapi CMS to invalidate Next.js cache.
 * Triggered when content is created, updated, published, or deleted.
 *
 * Security:
 * - Validates webhook secret from Strapi
 * - Rejects unauthorized requests
 * - Logs all revalidation attempts
 *
 * Flow:
 * 1. Strapi content changes
 * 2. Strapi sends webhook to this endpoint
 * 3. Validate secret
 * 4. Revalidate cache tags/paths
 * 5. Return success response
 */

import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { MODEL_TAG_MAP, MODEL_PATH_MAP } from "@/src/lib/constants/revalidate";

// Webhook secret from environment
const WEBHOOK_SECRET =
  process.env.STRAPI_WEBHOOK_SECRET || "dev-secret-change-in-production";

interface WebhookPayload {
  event: string;
  model?: string;
  entry?: {
    id: number;
    slug?: string;
    [key: string]: unknown;
  };
  // Strapi v4 payload structure
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/**
 * Extract model name from Strapi webhook payload
 * Strapi sends model in format: "api::page.page" or just "page"
 */
function extractModelName(payload: WebhookPayload): string | null {
  // Try direct model field
  if (payload.model) {
    // Extract from "api::page.page" format
    const match = payload.model.match(/api::([^.]+)\./);
    return match ? match[1] : payload.model;
  }

  // Try to extract from event name (e.g., "entry.create")
  if (payload.event) {
    const eventParts = payload.event.split(".");
    if (eventParts.length > 0) {
      return eventParts[0];
    }
  }

  // Check if entry has __type or similar field
  if (payload.entry && typeof payload.entry === "object") {
    const entry = payload.entry as Record<string, unknown>;
    if (entry.__type) {
      return String(entry.__type);
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Validate webhook secret (Strapi UI "Headers" or built-in "Secret")
    const secret =
      request.headers.get("x-strapi-secret") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!secret || secret !== WEBHOOK_SECRET) {
      console.warn(
        "[Webhook] Unauthorized request. Missing or invalid secret.",
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse webhook payload
    const payload: WebhookPayload = await request.json();

    // 3. Extract model name
    const modelName = extractModelName(payload);

    // 4. If we can't determine the model, revalidate everything
    if (!modelName) {
      // Revalidate common paths
      const commonPaths = ["/"];
      for (const path of commonPaths) {
        try {
          revalidatePath(path);
        } catch {}
      }

      return NextResponse.json({
        revalidated: true,
        paths: commonPaths,
        note: "Model could not be determined, revalidated common paths",
        timestamp: new Date().toISOString(),
      });
    }

    // 5. Revalidate cache tags
    const tags = MODEL_TAG_MAP[modelName] || [modelName];
    const revalidatedTags: string[] = [];

    for (const tag of tags) {
      try {
        revalidateTag(tag);
        revalidatedTags.push(tag);
      } catch {}
    }

    // 6. Revalidate specific paths
    const paths = MODEL_PATH_MAP[modelName] || [];
    const revalidatedPaths: string[] = [];

    // Revalidate model-specific paths
    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
      } catch {}
    }

    // 7. Revalidate entry-specific path (if slug exists)
    if (payload.entry?.slug) {
      const entryPath = `/${payload.entry.slug}`;
      try {
        revalidatePath(entryPath);
        revalidatedPaths.push(entryPath);
      } catch {}
    }

    // 8. Calculate execution time
    const executionTime = Date.now() - startTime;

    // 9. Return success response
    const response = {
      revalidated: true,
      tags: revalidatedTags,
      paths: revalidatedPaths,
      model: modelName,
      event: payload.event,
      entryId: payload.entry?.documentId || payload.entry?.id,
      slug: payload.entry?.slug,
      executionTime: `${executionTime}ms`,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `[Webhook] Successfully revalidated: ${JSON.stringify({
        model: modelName,
        tags: revalidatedTags,
        paths: revalidatedPaths,
      })}`,
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;
