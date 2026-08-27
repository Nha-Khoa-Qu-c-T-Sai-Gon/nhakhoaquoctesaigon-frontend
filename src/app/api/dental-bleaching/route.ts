import { NextResponse } from "next/server";
import { getDentalBleachingPage } from "@/src/lib/api/queries";

/**
 * API Route: /api/dental-bleaching
 *
 * Fetches dental bleaching page data from Strapi CMS.
 * This route acts as a proxy between the client and Strapi,
 * allowing client-side components to fetch data without CORS issues.
 */
export async function GET() {
  try {
    const data = await getDentalBleachingPage();

    if (!data) {
      return NextResponse.json(
        { error: "Dental bleaching data not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dental bleaching data" },
      { status: 500 },
    );
  }
}
