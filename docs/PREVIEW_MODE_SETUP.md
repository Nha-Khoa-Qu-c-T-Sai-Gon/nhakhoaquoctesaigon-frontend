# Strapi Preview Mode Setup Guide

## Overview

This guide explains how to configure Strapi CMS to enable preview functionality for draft content in the Next.js frontend.

## Architecture

### How Preview Mode Works

1. Editor creates/edits content in Strapi (draft state)
2. Editor clicks "Preview" button in Strapi admin
3. Strapi redirects to: `http://localhost:3000/api/preview?slug={slug}&secret={secret}`
4. Next.js validates the secret token
5. Next.js enables draft mode (sets cookie)
6. Next.js redirects to the page: `/{slug}`
7. Page fetches draft content from Strapi API
8. Preview banner appears at top of page
9. Editor can exit preview mode anytime

### Security

- Preview requires a secret token (`NEXT_PREVIEW_SECRET`)
- Token must match between Strapi and Next.js
- Without valid token, preview is denied (401 error)
- Draft mode is session-based (cookie)

## Next.js Configuration

### 1. Environment Variables

Add to `dental-frontend/.env`:

```env
NEXT_PREVIEW_SECRET=your-secure-preview-secret-change-in-production
```

**Important:** Use a strong, random secret in production. Generate with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. API Routes Created

- `/api/preview` - Enables draft mode and redirects to page
- `/api/exit-preview` - Disables draft mode and returns to homepage

### 3. Components Created

- `PreviewBanner` - Yellow banner shown during preview mode
- Updated `[slug]/page.tsx` - Detects draft mode and fetches draft content

### 4. API Client Updates

- Added `isDraftMode` parameter to `apiClient()`
- When enabled, adds `publicationState=preview` to Strapi queries
- Disables caching in draft mode (revalidate: 0)

## Strapi Configuration

### Step 1: Enable Preview Feature

1. Open Strapi admin panel: `http://localhost:1337/admin`
2. Go to **Settings** → **Content Manager** → **Configure the view**
3. Select **Page** content type
4. Enable **Preview** feature

### Step 2: Configure Preview URL

In Strapi admin, configure the preview URL for the Page content type:

**Preview URL Template:**

```
http://localhost:3000/api/preview?slug={slug}&secret=your-secure-preview-secret-change-in-production
```

**Important:** Replace `your-secure-preview-secret-change-in-production` with your actual `NEXT_PREVIEW_SECRET` value.

### Step 3: Configure Preview Button

The preview button will appear in the Strapi editor when:

- Content type has preview enabled
- Preview URL is configured
- Content has a `slug` field

### Alternative: Manual Configuration

If Strapi doesn't have a UI for preview configuration, add to `strapi-cms/config/admin.ts`:

```typescript
export default ({ env }) => ({
  // ... other config
  preview: {
    enabled: true,
    config: {
      page: {
        url: `${env("FRONTEND_URL", "http://localhost:3000")}/api/preview`,
        params: {
          slug: "{slug}",
          secret: env("PREVIEW_SECRET", "your-secret"),
        },
      },
    },
  },
});
```

Add to `strapi-cms/.env`:

```env
FRONTEND_URL=http://localhost:3000
PREVIEW_SECRET=your-secure-preview-secret-change-in-production
```

## Testing Preview Mode

### Test Flow

1. **Create Draft Content**
   - Open Strapi admin
   - Create a new Page or edit existing
   - Add content blocks (Hero, Services, CTA)
   - **Do NOT publish** (keep as draft)
   - Save

2. **Click Preview**
   - Click "Preview" button in Strapi editor
   - Should redirect to Next.js frontend
   - Yellow banner should appear: "Preview Mode Enabled"
   - Draft content should be visible

3. **Verify Draft Content**
   - Make changes in Strapi (don't publish)
   - Refresh preview page
   - Changes should appear immediately

4. **Exit Preview**
   - Click "Exit Preview" button in banner
   - Should return to homepage
   - Draft content no longer visible

### Manual Testing

Test the preview API directly:

```bash
# Enable preview (replace with your secret and slug)
curl "http://localhost:3000/api/preview?slug=test-page&secret=your-secure-preview-secret-change-in-production"

# Should redirect to /test-page with draft mode enabled
```

### Verify Draft Mode Cookie

After enabling preview, check browser cookies:

- Cookie name: `__prerender_bypass`
- Should be set by Next.js

## Troubleshooting

### Preview Button Not Showing

**Cause:** Preview feature not enabled in Strapi
**Solution:**

- Check Strapi settings for Page content type
- Ensure preview URL is configured
- Verify `slug` field exists

### 401 Unauthorized Error

**Cause:** Secret token mismatch
**Solution:**

- Verify `NEXT_PREVIEW_SECRET` in `.env`
- Ensure Strapi preview URL uses same secret
- Check for typos or extra spaces

### Draft Content Not Showing

**Cause:** API not fetching draft content
**Solution:**

- Check browser console for API errors
- Verify `publicationState=preview` in API request
- Check Strapi API token permissions
- Ensure content is saved as draft (not published)

### Preview Banner Not Appearing

**Cause:** Draft mode not enabled
**Solution:**

- Check if preview API route was called
- Verify cookie is set
- Check browser console for errors

### Changes Not Reflecting

**Cause:** Caching issue
**Solution:**

- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Clear Next.js cache: `rm -rf .next`
- Restart Next.js dev server

## Production Deployment

### Environment Variables

**Next.js (.env.production):**

```env
NEXT_PREVIEW_SECRET=<strong-random-secret>
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
STRAPI_URL=https://your-strapi-domain.com
STRAPI_API_TOKEN=<your-api-token>
```

**Strapi (.env):**

```env
FRONTEND_URL=https://your-domain.com
PREVIEW_SECRET=<same-as-next-preview-secret>
```

### Security Checklist

- [ ] Use strong random secret (32+ characters)
- [ ] Never commit secrets to version control
- [ ] Use environment variables for all secrets
- [ ] Verify secret validation in preview API
- [ ] Test preview with invalid secret (should fail)
- [ ] Enable HTTPS in production
- [ ] Restrict Strapi API token permissions

## API Reference

### Preview API Endpoint

**URL:** `/api/preview`

**Method:** GET

**Query Parameters:**

- `slug` (required) - Page slug to preview
- `secret` (required) - Preview secret token

**Response:**

- Success: 307 redirect to `/{slug}` with draft mode enabled
- Invalid secret: 401 Unauthorized
- Missing slug: 400 Bad Request

**Example:**

```
GET /api/preview?slug=dental-implants&secret=your-secret
```

### Exit Preview API Endpoint

**URL:** `/api/exit-preview`

**Method:** GET

**Response:**

- 307 redirect to `/` with draft mode disabled

**Example:**

```
GET /api/exit-preview
```

### Strapi API Query

When draft mode is enabled, API queries include:

```
GET /api/pages?filters[slug][$eq]=test&populate=deep&publicationState=preview
```

**Parameters:**

- `publicationState=preview` - Fetch draft and published content
- Without this parameter, only published content is returned

## Code Examples

### Check Draft Mode in Component

```typescript
import { draftMode } from "next/headers";

export default async function MyPage() {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    // Fetch draft content
  } else {
    // Fetch published content
  }
}
```

### Fetch Draft Content

```typescript
import { getPageBySlug } from "@/src/lib/api/queries";
import { draftMode } from "next/headers";

export default async function Page({ params }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const page = await getPageBySlug(params.slug, isDraftMode);

  // Render page...
}
```

### Custom Preview Banner

```typescript
import { draftMode } from 'next/headers'
import { PreviewBanner } from '@/src/components/PreviewBanner'

export default async function Layout({ children }) {
  const { isEnabled } = await draftMode()

  return (
    <>
      {isEnabled && <PreviewBanner />}
      {children}
    </>
  )
}
```

## Summary

Preview mode is now fully configured and ready to use:

✅ Next.js preview API routes created
✅ Draft mode detection implemented
✅ Strapi API queries support draft content
✅ Preview banner component added
✅ Security validation in place
✅ Exit preview functionality working

Editors can now preview draft content before publishing!
