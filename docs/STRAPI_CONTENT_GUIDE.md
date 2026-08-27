# Strapi CMS Content Management Guide

**Complete guide for content creators and editors**

This guide will help you create and manage content in your Dental CMS system using Strapi. No technical knowledge required!

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [How to Create a Page](#how-to-create-a-page)
3. [Understanding Content Blocks](#understanding-content-blocks)
4. [Managing Media (Images)](#managing-media-images)
5. [SEO Best Practices](#seo-best-practices)
6. [Publishing and Unpublishing](#publishing-and-unpublishing)
7. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
8. [Tips and Tricks](#tips-and-tricks)

---

## Getting Started

### Accessing Strapi Admin

1. Open your web browser
2. Go to: `http://localhost:1337/admin` (or your production URL)
3. Log in with your admin credentials
4. You'll see the Strapi dashboard

### Dashboard Overview

- **Content Manager** - Where you create and edit pages
- **Media Library** - Where you upload and manage images
- **Content-Type Builder** - For admins only (don't touch this!)
- **Settings** - User management and permissions

---

## How to Create a Page

### Step 1: Navigate to Pages

1. Click **Content Manager** in the left sidebar
2. Click **Page** under "Collection Types"
3. You'll see a list of all existing pages

### Step 2: Create New Page

1. Click the **"Create new entry"** button (top right)
2. You'll see an empty page form

### Step 3: Fill in Basic Information

#### Title (Required)

- **What it is:** The name of your page
- **Example:** "Dental Implants", "About Us", "Contact"
- **Tip:** Keep it clear and descriptive

#### Slug (Required - Auto-generated)

- **What it is:** The URL path for your page
- **Example:** If slug is "dental-implants", URL will be `yoursite.com/dental-implants`
- **Tip:**
  - Automatically created from title
  - Use lowercase letters
  - Use hyphens instead of spaces
  - Keep it short and SEO-friendly

#### Meta Title (Optional but Recommended)

- **What it is:** The title that appears in Google search results and browser tabs
- **Example:** "Professional Dental Implants in [City] | [Clinic Name]"
- **Best Practice:**
  - 50-60 characters maximum
  - Include main keyword
  - Make it compelling to click

#### Meta Description (Optional but Recommended)

- **What it is:** The description that appears in Google search results
- **Example:** "Get natural-looking dental implants from experienced professionals. Free consultation. 20+ years experience. Book your appointment today!"
- **Best Practice:**
  - 150-160 characters maximum
  - Include call-to-action
  - Mention key benefits
  - Include location if relevant

### Step 4: Add Content Blocks

This is where you build your page! Click **"Add a component to layout"** to add blocks.

You have 3 types of blocks available:

#### 1. Hero Block

**Use for:** Top section of your page with big heading and image

**Fields:**

- **Heading** (Required) - Main headline
  - Example: "Welcome to Our Dental Clinic"
  - Tip: Make it attention-grabbing
- **Subheading** (Optional) - Supporting text
  - Example: "Professional care for your smile with state-of-the-art technology"
  - Tip: Explain your value proposition
- **Image** (Optional) - Background or hero image
  - Tip: Use high-quality, professional photos
  - Recommended size: 1920x1080px

#### 2. Services Block

**Use for:** Showcasing multiple services or features

**Fields:**

- **Heading** (Required) - Section title
  - Example: "Our Services"
- **Items** (Repeatable) - Individual service cards
  - Click "Add an entry to items" for each service
  - Each item has:
    - **Title** - Service name (e.g., "Dental Implants")
    - **Description** - Brief explanation
    - **Image** - Service photo (recommended: 800x600px)

**Example:**

```
Heading: "Our Services"

Item 1:
- Title: "Dental Implants"
- Description: "Permanent solution for missing teeth with natural-looking results"
- Image: [implants.jpg]

Item 2:
- Title: "Teeth Whitening"
- Description: "Brighten your smile safely with professional whitening treatments"
- Image: [whitening.jpg]

Item 3:
- Title: "Orthodontics"
- Description: "Straighten teeth with modern braces and clear aligners"
- Image: [braces.jpg]
```

#### 3. CTA Block (Call-to-Action)

**Use for:** Encouraging visitors to take action

**Fields:**

- **Text** (Required) - Main message
  - Example: "Ready to Transform Your Smile?"
- **Button Label** (Required) - Button text
  - Example: "Book Appointment", "Contact Us", "Get Started"
- **Link** (Required) - Where button goes
  - Internal page: `/contact`
  - External link: `https://booking.example.com`
  - Phone: `tel:+1234567890`
  - Email: `mailto:info@example.com`

### Step 5: Arrange Your Blocks

**Typical Page Structure:**

1. Hero Block (top)
2. Services Block (middle)
3. CTA Block (bottom)

**Tips:**

- You can add multiple blocks of the same type
- Drag blocks to reorder them
- Delete blocks by clicking the trash icon

### Step 6: Save and Publish

1. Click **"Save"** button (top right) - Saves as draft
2. Click **"Publish"** button - Makes page live on website
3. Your page is now visible at `yoursite.com/[slug]`

---

## Understanding Content Blocks

### Hero Block - Detailed Guide

**Purpose:** Create a strong first impression

**When to use:**

- Top of landing pages
- Homepage banner
- Campaign pages

**Best Practices:**

- **Heading:** 5-10 words, clear benefit
- **Subheading:** 10-20 words, explain what you do
- **Image:** High-quality, relevant, professional
- **Avoid:** Generic stock photos, cluttered images

**Examples:**

✅ **Good:**

- Heading: "Transform Your Smile in Just One Visit"
- Subheading: "Expert cosmetic dentistry with 20+ years of experience"

❌ **Bad:**

- Heading: "Welcome to Our Website"
- Subheading: "We are a dental clinic"

### Services Block - Detailed Guide

**Purpose:** Showcase what you offer

**When to use:**

- Service pages
- Feature highlights
- Product listings

**Best Practices:**

- **Heading:** Clear section title
- **Items:** 3-6 services (odd numbers look better)
- **Titles:** Short and specific
- **Descriptions:** 1-2 sentences, focus on benefits
- **Images:** Consistent style, same dimensions

**Example Structure:**

```
Services Block
├── Heading: "Why Choose Us"
├── Item 1: "Expert Team" + description + image
├── Item 2: "Modern Technology" + description + image
└── Item 3: "Flexible Scheduling" + description + image
```

### CTA Block - Detailed Guide

**Purpose:** Drive conversions

**When to use:**

- End of pages
- After explaining services
- Multiple times on long pages

**Best Practices:**

- **Text:** Create urgency or excitement
- **Button:** Action-oriented verbs
- **Link:** Make sure it works!

**Examples:**

✅ **Good:**

- Text: "Ready to Get Started?"
- Button: "Book Free Consultation"
- Link: `/contact`

✅ **Good:**

- Text: "Questions? We're Here to Help"
- Button: "Call Us Now"
- Link: `tel:+1234567890`

❌ **Bad:**

- Text: "Click here"
- Button: "Submit"
- Link: `#`

---

## Managing Media (Images)

### Accessing Media Library

1. Click **Media Library** in left sidebar
2. You'll see all uploaded images

### Uploading Images

**Method 1: Upload from Page**

1. When adding an image to a block
2. Click "Add new assets"
3. Drag and drop or browse files
4. Image uploads automatically

**Method 2: Upload to Library**

1. Go to Media Library
2. Click "Add new assets"
3. Upload multiple images at once
4. Use them later in pages

### Image Best Practices

#### File Formats

- ✅ **Use:** JPG for photos, PNG for graphics with transparency
- ❌ **Avoid:** BMP, TIFF (too large)

#### File Sizes

- **Hero images:** Max 500KB, ideally 200-300KB
- **Service images:** Max 300KB, ideally 100-200KB
- **Icons/logos:** Max 100KB

**Tip:** Use online tools like TinyPNG to compress images before uploading

#### Image Dimensions

| Block Type | Recommended Size | Aspect Ratio |
| ---------- | ---------------- | ------------ |
| Hero       | 1920x1080px      | 16:9         |
| Services   | 800x600px        | 4:3          |
| General    | 1200x800px       | 3:2          |

#### Alternative Text (Alt Text)

**What it is:** Description of image for accessibility and SEO

**How to add:**

1. Click on uploaded image
2. Find "Alternative text" field
3. Write descriptive text

**Examples:**

✅ **Good:**

- "Dentist examining patient's teeth with modern equipment"
- "Bright white smile after teeth whitening treatment"
- "Modern dental clinic waiting room with comfortable seating"

❌ **Bad:**

- "Image1"
- "Photo"
- "DSC_1234"

**Best Practices:**

- Describe what's in the image
- Include relevant keywords naturally
- Keep it under 125 characters
- Don't start with "Image of..." or "Picture of..."

### Organizing Images

**Naming Convention:**

- Use descriptive names: `dental-implants-hero.jpg`
- Not: `IMG_1234.jpg`

**Folders:**

- Strapi doesn't have folders, but you can use naming:
  - `hero-homepage.jpg`
  - `service-implants.jpg`
  - `team-dr-smith.jpg`

---

## SEO Best Practices

### Why SEO Matters

Good SEO helps your pages:

- Rank higher in Google
- Get more visitors
- Attract the right audience

### Meta Title Optimization

**Formula:** [Primary Keyword] | [Secondary Keyword] | [Brand]

**Examples:**

✅ **Good:**

- "Dental Implants in Boston | Affordable Tooth Replacement | Smith Dental"
- "Professional Teeth Whitening | Same-Day Results | Bright Smile Clinic"

❌ **Bad:**

- "Home Page"
- "Welcome"
- "Untitled Page"

**Tips:**

- Put most important keywords first
- Include location if you're local business
- Make it unique for each page
- Stay under 60 characters

### Meta Description Optimization

**Formula:** [Benefit] + [Feature] + [Call-to-Action]

**Examples:**

✅ **Good:**

- "Get natural-looking dental implants from experienced professionals. Free consultation. 20+ years experience. Book your appointment today!"
- "Professional teeth whitening in just one visit. Safe, effective, and affordable. See results immediately. Call now for special offer!"

❌ **Bad:**

- "This is our dental implants page"
- "Learn more about our services"
- "Welcome to our website"

**Tips:**

- Include main keyword naturally
- Mention unique selling points
- Add call-to-action
- Stay under 160 characters
- Make it compelling to click

### Keyword Research

**Where to find keywords:**

1. Google Search - See "People also ask"
2. Google Autocomplete - Type and see suggestions
3. Competitor websites - See what they rank for

**How to use keywords:**

- In page title
- In meta title and description
- In hero heading
- In service titles and descriptions
- Naturally, don't force it

**Example:**
If targeting "dental implants Boston":

- Title: "Dental Implants Boston"
- Meta Title: "Dental Implants in Boston | Affordable & Professional"
- Hero Heading: "Expert Dental Implants in Boston"
- Services: Include "dental implants" in descriptions

### URL Structure (Slug)

**Best Practices:**

✅ **Good:**

- `/dental-implants`
- `/teeth-whitening-boston`
- `/about-our-team`

❌ **Bad:**

- `/page1`
- `/new-page-copy-2`
- `/dental_implants_and_tooth_replacement_services`

**Tips:**

- Use hyphens, not underscores
- Keep it short (3-5 words max)
- Include main keyword
- Use lowercase only
- Avoid special characters

---

## Publishing and Unpublishing

### Draft vs Published

**Draft:**

- Saved but not visible on website
- You can edit freely
- Good for work-in-progress

**Published:**

- Live on website
- Visible to all visitors
- Can still be edited

### How to Publish

1. Create or edit page
2. Click **"Save"** (saves as draft)
3. Click **"Publish"** (makes it live)
4. Page is now visible at `yoursite.com/[slug]`

### How to Unpublish

1. Open published page
2. Click **"Unpublish"** button
3. Page is now hidden from website
4. You can edit and republish later

### Editing Published Pages

1. Open published page
2. Make your changes
3. Click **"Save"**
4. Changes are live immediately

**Note:** Changes may take up to 60 seconds to appear due to caching.

---

## Common Mistakes to Avoid

### ❌ Mistake #1: Missing Slug

**Problem:** Page won't be accessible

**Solution:**

- Always fill in the slug field
- Let it auto-generate from title
- Or create custom slug

### ❌ Mistake #2: Empty Layout

**Problem:** Page shows "No content blocks" message

**Solution:**

- Add at least one content block
- Typical minimum: Hero + CTA

### ❌ Mistake #3: Missing Images

**Problem:** Blocks look incomplete

**Solution:**

- Always add images to Hero and Services blocks
- Use high-quality, relevant photos
- Add alt text to all images

### ❌ Mistake #4: Broken Links

**Problem:** CTA buttons go nowhere

**Solution:**

- Test all links before publishing
- Internal links: `/contact` (with leading slash)
- External links: `https://example.com` (full URL)
- Phone: `tel:+1234567890` (no spaces)
- Email: `mailto:info@example.com`

### ❌ Mistake #5: Duplicate Slugs

**Problem:** Two pages can't have same slug

**Solution:**

- Make each slug unique
- Example: `/dental-implants` and `/dental-implants-cost`

### ❌ Mistake #6: Poor Image Quality

**Problem:** Blurry or pixelated images

**Solution:**

- Use high-resolution images
- Minimum 1200px wide for hero images
- Compress before uploading

### ❌ Mistake #7: Missing SEO Fields

**Problem:** Poor search engine visibility

**Solution:**

- Always fill meta title and description
- Make them unique for each page
- Include relevant keywords

### ❌ Mistake #8: Too Many Blocks

**Problem:** Page is too long and overwhelming

**Solution:**

- Keep pages focused
- Typical page: 3-5 blocks
- Long pages: Break into multiple pages

---

## Tips and Tricks

### Content Writing Tips

**Headlines:**

- Start with action verbs
- Include benefits, not features
- Keep under 10 words
- Make it specific

**Descriptions:**

- Focus on "what's in it for me"
- Use simple language
- Break into short paragraphs
- Include numbers when possible

**Call-to-Actions:**

- Create urgency: "Book Today", "Limited Spots"
- Be specific: "Get Free Consultation" not "Learn More"
- Use action verbs: "Start", "Get", "Book", "Call"

### Workflow Tips

**Before Creating Page:**

1. Plan your content structure
2. Prepare all images
3. Write copy in Google Docs first
4. Get approval if needed

**Creating Page:**

1. Fill basic info (title, slug, SEO)
2. Add blocks in order
3. Upload and add images
4. Add alt text to images
5. Preview (if available)
6. Save as draft
7. Review everything
8. Publish

**After Publishing:**

1. Visit page on website
2. Test all links
3. Check on mobile device
4. Share with team for feedback

### Keyboard Shortcuts

- **Ctrl/Cmd + S** - Save
- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Shift + Z** - Redo

### Testing Your Pages

**Checklist:**

- [ ] All text is spelled correctly
- [ ] All images load properly
- [ ] All links work
- [ ] Page looks good on mobile
- [ ] Meta title and description are filled
- [ ] Slug is correct
- [ ] Page is published

### Getting Help

**If something doesn't work:**

1. Save your work
2. Refresh the page
3. Try again
4. Contact your administrator

**If you need to:**

- Add new block types → Contact developer
- Change permissions → Contact administrator
- Recover deleted content → Contact administrator

---

## Quick Reference

### Page Creation Checklist

- [ ] Title (required)
- [ ] Slug (auto-generated, verify it)
- [ ] Meta Title (recommended)
- [ ] Meta Description (recommended)
- [ ] At least one content block
- [ ] Images uploaded with alt text
- [ ] All links tested
- [ ] Saved and published

### Block Types Quick Guide

| Block    | Use For          | Required Fields          |
| -------- | ---------------- | ------------------------ |
| Hero     | Page header      | Heading                  |
| Services | Feature showcase | Heading, Items           |
| CTA      | Call-to-action   | Text, Button Label, Link |

### Image Size Quick Guide

| Use Case | Dimensions  | Max File Size |
| -------- | ----------- | ------------- |
| Hero     | 1920x1080px | 500KB         |
| Services | 800x600px   | 300KB         |
| General  | 1200x800px  | 300KB         |

---

## Frequently Asked Questions

**Q: How long does it take for changes to appear on the website?**
A: Up to 60 seconds due to caching. Refresh your browser.

**Q: Can I preview a page before publishing?**
A: Currently no preview feature. Save as draft and publish when ready.

**Q: Can I schedule pages to publish later?**
A: Not currently available. You must manually publish.

**Q: How many pages can I create?**
A: Unlimited! Create as many as you need.

**Q: Can I duplicate a page?**
A: Not directly. You'll need to create a new page and copy content manually.

**Q: What happens if I delete a page?**
A: It's permanently deleted. Be careful! Consider unpublishing instead.

**Q: Can I restore a deleted page?**
A: No, deletions are permanent. Always double-check before deleting.

**Q: How do I change the order of blocks?**
A: Drag and drop blocks in the layout section.

**Q: Can I add custom HTML or CSS?**
A: No, use the provided blocks only. Contact developer for custom features.

**Q: Why can't I see my page on the website?**
A: Make sure it's published (not just saved as draft).

---

## Need More Help?

**Documentation:**

- Strapi Official Docs: https://docs.strapi.io
- This guide: `/docs/STRAPI_CONTENT_GUIDE.md`

**Contact:**

- Technical issues: Contact your developer
- Content questions: Contact your content manager
- Access issues: Contact your administrator

---

**Last Updated:** March 19, 2026
**Version:** 1.0.0
**For:** Dental CMS System with Strapi 5.40.0

---

**Happy content creating! 🎉**
