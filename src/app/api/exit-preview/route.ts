/**
 * Exit Preview Mode API Route
 *
 * Disables draft mode and returns user to normal published content.
 * Called when user clicks "Exit Preview" button.
 */

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to homepage with cache-busting timestamp
  redirect(`/?_t=${Date.now()}`);
}
