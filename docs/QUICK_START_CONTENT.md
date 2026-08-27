# Quick Start - Content Creation

**5-Minute Guide to Creating Your First Page**

---

## Step 1: Access Strapi Admin (30 seconds)

1. Open browser
2. Go to: `http://localhost:1337/admin`
3. Log in with your credentials

---

## Step 2: Create New Page (1 minute)

1. Click **Content Manager** (left sidebar)
2. Click **Page**
3. Click **"Create new entry"** (top right)

---

## Step 3: Fill Basic Info (1 minute)

### Required Fields:

**Title:**

```
Example: Dental Implants
```

**Slug:** (auto-generated)

```
Example: dental-implants
```

### Recommended Fields:

**Meta Title:**

```
Example: Professional Dental Implants in Boston | Smith Dental
```

**Meta Description:**

```
Example: Get natural-looking dental implants from experienced professionals. Free consultation. 20+ years experience. Book your appointment today!
```

---

## Step 4: Add Content Blocks (2 minutes)

### Add Hero Block

1. Click **"Add a component to layout"**
2. Select **"Hero"**
3. Fill in:
   - **Heading:** "Transform Your Smile with Dental Implants"
   - **Subheading:** "Natural-looking, permanent tooth replacement"
   - **Image:** Upload hero image (optional)

### Add Services Block

1. Click **"Add a component to layout"**
2. Select **"Services"**
3. Fill in:
   - **Heading:** "Why Choose Our Implants"
4. Click **"Add an entry to items"** (repeat 3 times):

   **Item 1:**
   - Title: "Natural Looking"
   - Description: "Implants look and feel like real teeth"
   - Image: Upload image

   **Item 2:**
   - Title: "Long Lasting"
   - Description: "Can last a lifetime with proper care"
   - Image: Upload image

   **Item 3:**
   - Title: "Comfortable"
   - Description: "No discomfort once healed"
   - Image: Upload image

### Add CTA Block

1. Click **"Add a component to layout"**
2. Select **"CTA"**
3. Fill in:
   - **Text:** "Ready to Get Started?"
   - **Button Label:** "Book Free Consultation"
   - **Link:** "/contact" or "tel:+1234567890"

---

## Step 5: Publish (30 seconds)

1. Click **"Save"** (top right)
2. Click **"Publish"**
3. Done! 🎉

---

## View Your Page

Visit: `http://localhost:3000/dental-implants`

(Replace "dental-implants" with your slug)

---

## Quick Tips

### Images

- Use high-quality photos
- Recommended size: 1200x800px
- Add alt text for accessibility

### Writing

- Keep headings short (5-10 words)
- Focus on benefits, not features
- Use action verbs in CTAs

### SEO

- Include keywords in title and description
- Keep meta title under 60 characters
- Keep meta description under 160 characters

---

## Need More Help?

📖 **Full Guide:** `docs/STRAPI_CONTENT_GUIDE.md`

Contains:

- Detailed instructions
- Best practices
- Common mistakes
- Tips and tricks
- FAQ

---

## Common Issues

**Q: Page not showing on website?**
A: Make sure you clicked "Publish" (not just "Save")

**Q: Images not loading?**
A: Check file size (max 500KB) and format (JPG/PNG)

**Q: Can't find my page?**
A: Check the slug - visit `yoursite.com/[slug]`

---

**Happy creating! 🚀**

For detailed help, see: `docs/STRAPI_CONTENT_GUIDE.md`
