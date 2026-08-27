# Preview Mode - Quick Reference Card

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Add to dental-frontend/.env
NEXT_PREVIEW_SECRET=your-secure-preview-secret-change-in-production
```

### 2. Strapi Configuration

Configure preview URL in Strapi admin:

```
http://localhost:3000/api/preview?slug={slug}&secret=your-secure-preview-secret-change-in-production
```

### 3. Test

1. Create draft page in Strapi
2. Click "Preview" button
3. See yellow banner + draft content

---

## 📁 Files Overview

| File                                | Purpose                         |
| ----------------------------------- | ------------------------------- |
| `src/app/api/preview/route.ts`      | Enable preview mode             |
| `src/app/api/exit-preview/route.ts` | Disable preview mode            |
| `src/components/PreviewBanner.tsx`  | Preview indicator UI            |
| `src/lib/api/client.ts`             | API client with draft support   |
| `src/lib/api/queries.ts`            | Query functions with draft mode |
| `src/app/[slug]/page.tsx`           | Page with preview detection     |

---

## 🔑 Key Concepts

### Draft Mode Detection

```typescript
import { draftMode } from "next/headers";

const { isEnabled } = await draftMode();
```

### Fetch Draft Content

```typescript
const page = await getPageBySlug(slug, isDraftMode);
```

### API Query Difference

```
Normal:  /api/pages?filters[slug][$eq]=test&populate=deep
Preview: /api/pages?filters[slug][$eq]=test&populate=deep&publicationState=preview
```

---

## 🔐 Security

| Aspect         | Implementation                  |
| -------------- | ------------------------------- |
| Authentication | Secret token validation         |
| Token Storage  | Environment variable            |
| Cookie         | `__prerender_bypass` (HttpOnly) |
| Invalid Token  | 401 Unauthorized                |
| Missing Slug   | 400 Bad Request                 |

---

## 🎯 API Endpoints

### Enable Preview

```
GET /api/preview?slug={slug}&secret={secret}

Success: 307 → /{slug} (with draft mode)
Error:   401 (invalid secret)
         400 (missing slug)
```

### Exit Preview

```
GET /api/exit-preview

Success: 307 → / (draft mode disabled)
```

---

## 🧪 Testing Commands

### Manual API Test

```bash
# Enable preview
curl "http://localhost:3000/api/preview?slug=test&secret=your-secret"

# Exit preview
curl "http://localhost:3000/api/exit-preview"
```

### Check Cookie

```javascript
// In browser console
document.cookie;
// Should see: __prerender_bypass=...
```

---

## 🐛 Troubleshooting

| Issue                      | Solution                                 |
| -------------------------- | ---------------------------------------- |
| Preview button not showing | Enable preview in Strapi settings        |
| 401 error                  | Check secret matches in both places      |
| Draft content not showing  | Verify `publicationState=preview` in API |
| Banner not appearing       | Check draft mode cookie is set           |
| Changes not reflecting     | Hard refresh (Cmd+Shift+R)               |

---

## 📊 Cache Behavior

| Mode    | Revalidate | Behavior               |
| ------- | ---------- | ---------------------- |
| Normal  | 60s        | ISR caching enabled    |
| Preview | 0s         | No caching, fresh data |

---

## 🎨 UI Components

### Preview Banner

```typescript
{isDraftMode && <PreviewBanner />}
```

**Appearance:**

- Yellow background
- Fixed at top
- "Preview Mode Enabled" text
- "Exit Preview" button

---

## 🔄 State Flow

```
Normal → Preview (click "Preview" in Strapi)
Preview → Normal (click "Exit Preview" button)
```

---

## 📝 Code Snippets

### Check Draft Mode in Component

```typescript
import { draftMode } from "next/headers";

export default async function Page() {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    // Preview mode logic
  }
}
```

### Fetch with Draft Mode

```typescript
import { getPageBySlug } from "@/src/lib/api/queries";
import { draftMode } from "next/headers";

const { isEnabled: isDraftMode } = await draftMode();
const page = await getPageBySlug(slug, isDraftMode);
```

### Custom API Call with Draft

```typescript
import { apiClient } from "@/src/lib/api/client";

const data = await apiClient("/api/pages", {
  params: { "filters[slug][$eq]": slug },
  isDraftMode: true, // Adds publicationState=preview
});
```

---

## 🚀 Production Checklist

- [ ] Generate strong secret (32+ chars)
- [ ] Set `NEXT_PREVIEW_SECRET` in production env
- [ ] Configure Strapi with production URL
- [ ] Test preview in production
- [ ] Verify security (test invalid secret)
- [ ] Document for editors

---

## 📚 Documentation

| Document                            | Purpose                 |
| ----------------------------------- | ----------------------- |
| `PREVIEW_MODE_SETUP.md`             | Complete setup guide    |
| `PREVIEW_IMPLEMENTATION_SUMMARY.md` | Implementation details  |
| `PREVIEW_FLOW_DIAGRAM.md`           | Visual flow diagrams    |
| `PREVIEW_QUICK_REFERENCE.md`        | This document           |
| `COMPLETED_TASKS.md`                | Task completion summary |

---

## 🔗 Useful Links

- [Next.js Draft Mode Docs](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode)
- [Strapi Preview Docs](https://docs.strapi.io/)
- [Project README](../README.md)

---

## 💡 Tips

1. **Always use same secret** in Next.js and Strapi
2. **Hard refresh** if changes don't appear (Cmd+Shift+R)
3. **Check console** for API errors
4. **Verify cookie** is set when preview enabled
5. **Test with invalid secret** to verify security

---

## 🎯 Common Use Cases

### Preview Unpublished Page

1. Create page in Strapi (don't publish)
2. Click "Preview"
3. View draft content
4. Make changes in Strapi
5. Refresh preview to see updates

### Preview Changes to Published Page

1. Edit published page in Strapi
2. Make changes (don't save as published)
3. Click "Preview"
4. View changes before publishing

### Share Preview with Team

1. Enable preview mode
2. Copy URL from browser
3. Share with team (they need same cookie)
4. Note: Cookie is session-based

---

## ⚡ Performance Notes

- Preview mode disables caching (expected)
- Normal mode uses 60s ISR (fast)
- Preview fetches fresh data every time
- Exit preview to return to fast mode

---

## 🎨 Customization

### Change Banner Color

Edit `src/components/PreviewBanner.tsx`:

```typescript
className = "bg-yellow-500"; // Change to bg-blue-500, etc.
```

### Change Preview Secret

Update both:

1. `dental-frontend/.env` → `NEXT_PREVIEW_SECRET`
2. Strapi preview URL → `secret` parameter

### Add Custom Preview Logic

Edit `src/app/api/preview/route.ts`:

```typescript
// Add custom validation, logging, etc.
```

---

## 📞 Support

For issues:

1. Check troubleshooting section
2. Review full setup guide
3. Check browser console
4. Verify environment variables
5. Test API endpoints manually

---

**Last Updated:** 2026-03-19
**Version:** 1.0.0
**Status:** ✅ Production Ready
