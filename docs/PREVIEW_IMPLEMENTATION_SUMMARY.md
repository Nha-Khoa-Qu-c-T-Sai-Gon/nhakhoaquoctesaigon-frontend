# Preview Mode Implementation Summary

## What Was Implemented

Complete Strapi preview functionality for the Next.js frontend, allowing editors to preview draft content before publishing.

## Files Created

### API Routes

1. **`src/app/api/preview/route.ts`**
   - Validates secret token
   - Enables draft mode
   - Redirects to preview page

2. **`src/app/api/exit-preview/route.ts`**
   - Disables draft mode
   - Returns to homepage

### Components

3. **`src/components/PreviewBanner.tsx`**
   - Yellow banner shown during preview
   - "Exit Preview" button
   - Visual indicator for editors

### Documentation

4. **`docs/PREVIEW_MODE_SETUP.md`**
   - Complete setup guide
   - Strapi configuration steps
   - Testing instructions
   - Troubleshooting guide

## Files Modified

### API Client

1. **`src/lib/api/client.ts`**
   - Fixed TypeScript error (HeadersInit → Record<string, string>)
   - Added `isDraftMode` parameter
   - Adds `publicationState=preview` for draft content
   - Disables caching in draft mode (revalidate: 0)

### Queries

2. **`src/lib/api/queries.ts`**
   - Updated `getPageBySlug()` to accept `isDraftMode` parameter
   - Passes draft mode flag to API client

### Pages

3. **`src/app/[slug]/page.tsx`**
   - Imports `draftMode` from Next.js
   - Detects if preview mode is active
   - Fetches draft content when in preview
   - Shows preview banner
   - Adds padding when banner is visible

### Environment

4. **`dental-frontend/.env`**
   - Added `NEXT_PREVIEW_SECRET` variable

## How It Works

### Preview Flow

```
1. Editor creates draft content in Strapi
   ↓
2. Editor clicks "Preview" button
   ↓
3. Strapi redirects to: /api/preview?slug={slug}&secret={secret}
   ↓
4. Next.js validates secret token
   ↓
5. Next.js enables draft mode (sets cookie)
   ↓
6. Next.js redirects to: /{slug}
   ↓
7. Page detects draft mode
   ↓
8. Page fetches draft content (publicationState=preview)
   ↓
9. Preview banner appears
   ↓
10. Editor can exit preview anytime
```

### Security

- Secret token validation prevents unauthorized access
- Token must match between Strapi and Next.js
- Invalid token returns 401 Unauthorized
- Draft mode is session-based (cookie)

### API Behavior

**Normal Mode (Published Content):**

```
GET /api/pages?filters[slug][$eq]=test&populate=deep
```

**Preview Mode (Draft Content):**

```
GET /api/pages?filters[slug][$eq]=test&populate=deep&publicationState=preview
```

## Configuration Required

### Next.js Environment Variables

Add to `dental-frontend/.env`:

```env
NEXT_PREVIEW_SECRET=your-secure-preview-secret-change-in-production
```

### Strapi Configuration

Configure preview URL in Strapi admin:

```
http://localhost:3000/api/preview?slug={slug}&secret=your-secure-preview-secret-change-in-production
```

**Important:** Use the same secret in both places!

## Testing

### Quick Test

1. Create draft page in Strapi (don't publish)
2. Click "Preview" button
3. Should see yellow banner: "Preview Mode Enabled"
4. Draft content should be visible
5. Click "Exit Preview" to return to normal mode

### Manual API Test

```bash
curl "http://localhost:3000/api/preview?slug=test-page&secret=your-secret"
```

## Benefits

✅ Editors can preview draft content before publishing
✅ No need to publish/unpublish for testing
✅ Secure token-based authentication
✅ Visual indicator when in preview mode
✅ Easy exit from preview mode
✅ No caching issues in preview mode
✅ Works with all content blocks (Hero, Services, CTA)

## Next Steps

1. Configure preview URL in Strapi admin
2. Test with draft content
3. Update secret for production deployment
4. Train editors on preview workflow

## Production Checklist

- [ ] Generate strong random secret (32+ characters)
- [ ] Set `NEXT_PREVIEW_SECRET` in production environment
- [ ] Configure Strapi preview URL with production domain
- [ ] Test preview functionality in production
- [ ] Document preview workflow for editors
- [ ] Verify security (test with invalid secret)

## Technical Details

### TypeScript Fix

Fixed error in `client.ts`:

```typescript
// Before (error)
const headers: HeadersInit = { ... }
headers["Authorization"] = `Bearer ${token}` // ❌ Type error

// After (fixed)
const headers: Record<string, string> = { ... }
headers["Authorization"] = `Bearer ${token}` // ✅ Works
```

### Draft Mode Detection

```typescript
import { draftMode } from "next/headers";

const { isEnabled } = await draftMode();
```

### Cache Behavior

- **Published content:** Cached for 60 seconds (ISR)
- **Draft content:** No cache (revalidate: 0)
- Ensures draft changes appear immediately

## Support

For issues or questions, refer to:

- `docs/PREVIEW_MODE_SETUP.md` - Complete setup guide
- Next.js Draft Mode docs: https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
- Strapi Preview docs: https://docs.strapi.io/
