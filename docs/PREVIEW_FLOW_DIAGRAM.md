# Strapi Preview Mode - Flow Diagram

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         STRAPI CMS ADMIN                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  Page Editor                                              │     │
│  │                                                           │     │
│  │  Title: Dental Implants                                  │     │
│  │  Slug: dental-implants                                   │     │
│  │  Status: DRAFT (not published)                           │     │
│  │                                                           │     │
│  │  Layout:                                                  │     │
│  │    - Hero Block                                          │     │
│  │    - Services Block                                      │     │
│  │    - CTA Block                                           │     │
│  │                                                           │     │
│  │  [Save]  [Publish]  [Preview] ◄─── Editor clicks here   │     │
│  └──────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Redirects to:
                                │ http://localhost:3000/api/preview
                                │   ?slug=dental-implants
                                │   &secret=your-secret
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS PREVIEW API ROUTE                        │
│                   /api/preview/route.ts                             │
│                                                                     │
│  1. Validate secret token                                          │
│     ├─ Valid? ✓ Continue                                           │
│     └─ Invalid? ✗ Return 401 Unauthorized                          │
│                                                                     │
│  2. Enable draft mode                                              │
│     const draft = await draftMode()                                │
│     draft.enable()                                                 │
│     → Sets cookie: __prerender_bypass                              │
│                                                                     │
│  3. Redirect to page                                               │
│     redirect(`/${slug}`)                                           │
│     → http://localhost:3000/dental-implants                        │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Redirects with cookie
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS DYNAMIC PAGE                             │
│                   /[slug]/page.tsx                                  │
│                                                                     │
│  1. Check draft mode                                               │
│     const { isEnabled } = await draftMode()                        │
│     → isEnabled = true (cookie detected)                           │
│                                                                     │
│  2. Fetch page data                                                │
│     const page = await getPageBySlug(slug, isDraftMode)            │
│     → Calls API with publicationState=preview                      │
│                                                                     │
│  3. Render preview banner                                          │
│     {isDraftMode && <PreviewBanner />}                             │
│                                                                     │
│  4. Render page content                                            │
│     <BlockRenderer layout={page.layout} />                         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ API Request
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STRAPI API ENDPOINT                            │
│                                                                     │
│  GET /api/pages                                                    │
│    ?filters[slug][$eq]=dental-implants                             │
│    &populate=deep                                                  │
│    &publicationState=preview  ◄─── Key parameter!                 │
│                                                                     │
│  Returns:                                                          │
│    - Draft content (unpublished)                                   │
│    - Published content                                             │
│    - All nested relations (blocks, images)                         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Response
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BROWSER DISPLAY                                │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 👁️ Preview Mode Enabled                    [Exit Preview]    │ │
│  │    You are viewing draft content                              │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │                    DENTAL IMPLANTS                            │ │
│  │              Transform Your Smile Today                       │ │
│  │                                                               │ │
│  │  [Book Consultation]                                          │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Our Services                                                 │ │
│  │  • Dental Implants                                            │ │
│  │  • Teeth Whitening                                            │ │
│  │  • Orthodontics                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  Ready to Get Started?                                        │ │
│  │  [Contact Us Today]                                           │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ User clicks "Exit Preview"
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  NEXT.JS EXIT PREVIEW API ROUTE                     │
│                  /api/exit-preview/route.ts                         │
│                                                                     │
│  1. Disable draft mode                                             │
│     const draft = await draftMode()                                │
│     draft.disable()                                                │
│     → Clears cookie: __prerender_bypass                            │
│                                                                     │
│  2. Redirect to homepage                                           │
│     redirect('/')                                                  │
│     → http://localhost:3000                                        │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Back to normal mode
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NORMAL MODE                                    │
│                                                                     │
│  • No preview banner                                               │
│  • Only published content visible                                  │
│  • Standard caching (60s ISR)                                      │
│  • publicationState parameter not sent                             │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Preview API Route (`/api/preview`)

**Purpose:** Enable draft mode and redirect to page

**Input:**

- `slug` - Page to preview
- `secret` - Security token

**Process:**

1. Validate secret
2. Enable draft mode (set cookie)
3. Redirect to page

**Output:**

- 307 redirect to `/{slug}` with draft mode enabled
- OR 401 if invalid secret

### 2. Exit Preview API Route (`/api/exit-preview`)

**Purpose:** Disable draft mode and return to normal

**Process:**

1. Disable draft mode (clear cookie)
2. Redirect to homepage

**Output:**

- 307 redirect to `/`

### 3. Dynamic Page (`/[slug]/page.tsx`)

**Purpose:** Render page with draft or published content

**Process:**

1. Check if draft mode enabled
2. Fetch data (with or without `publicationState=preview`)
3. Render preview banner if in draft mode
4. Render page content

### 4. API Client (`lib/api/client.ts`)

**Purpose:** Make API requests with draft mode support

**Process:**

1. Build URL with query params
2. Add `publicationState=preview` if draft mode
3. Set cache: 0 if draft, 60s if published
4. Add authentication headers
5. Fetch and return data

### 5. Preview Banner Component

**Purpose:** Visual indicator for preview mode

**Features:**

- Fixed position at top
- Yellow background (high visibility)
- "Exit Preview" button
- Clear messaging

## API Query Comparison

### Normal Mode (Published Only)

```
GET http://localhost:1337/api/pages
  ?filters[slug][$eq]=dental-implants
  &populate=deep

Response: Only published content
Cache: 60 seconds (ISR)
```

### Preview Mode (Draft + Published)

```
GET http://localhost:1337/api/pages
  ?filters[slug][$eq]=dental-implants
  &populate=deep
  &publicationState=preview  ◄─── Added parameter

Response: Draft + published content
Cache: 0 seconds (no cache)
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Strapi sends:                                              │
│  /api/preview?slug=test&secret=abc123                       │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js validates:                                         │
│  if (secret !== process.env.NEXT_PREVIEW_SECRET)            │
│    return 401 Unauthorized                                  │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  If valid:                                                  │
│  - Enable draft mode                                        │
│  - Set secure cookie                                        │
│  - Redirect to page                                         │
└─────────────────────────────────────────────────────────────┘
```

## Cookie Mechanism

```
Preview Enabled:
┌──────────────────────────────────────────────────────┐
│ Cookie: __prerender_bypass=<token>                   │
│ Path: /                                              │
│ HttpOnly: true                                       │
│ Secure: true (production)                            │
│ SameSite: Lax                                        │
└──────────────────────────────────────────────────────┘

Preview Disabled:
┌──────────────────────────────────────────────────────┐
│ Cookie: __prerender_bypass (deleted)                 │
└──────────────────────────────────────────────────────┘
```

## State Diagram

```
                    ┌─────────────┐
                    │   Normal    │
                    │    Mode     │
                    └──────┬──────┘
                           │
                           │ Click "Preview" in Strapi
                           │ (with valid secret)
                           ▼
                    ┌─────────────┐
                    │   Preview   │
                    │    Mode     │
                    └──────┬──────┘
                           │
                           │ Click "Exit Preview"
                           │ OR close browser
                           ▼
                    ┌─────────────┐
                    │   Normal    │
                    │    Mode     │
                    └─────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│  Invalid Secret                                             │
│  → 401 Unauthorized                                         │
│  → "Invalid token" message                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Missing Slug                                               │
│  → 400 Bad Request                                          │
│  → "Missing slug parameter" message                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Page Not Found                                             │
│  → 404 Not Found                                            │
│  → Next.js not-found page                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  API Error                                                  │
│  → Error boundary catches                                   │
│  → Error UI displayed                                       │
│  → Console error logged                                     │
└─────────────────────────────────────────────────────────────┘
```

## Performance Characteristics

### Normal Mode

- ✅ Static generation at build time
- ✅ ISR revalidation every 60 seconds
- ✅ CDN caching possible
- ✅ Fast response times

### Preview Mode

- ⚡ No caching (revalidate: 0)
- ⚡ Fresh data on every request
- ⚡ Immediate updates visible
- ⚠️ Slower than normal mode (expected)

## Summary

The preview system provides:

- ✅ Secure token-based authentication
- ✅ Seamless editor experience
- ✅ Visual preview indicators
- ✅ Easy exit mechanism
- ✅ No caching issues
- ✅ Production-ready security
- ✅ Clear error handling
