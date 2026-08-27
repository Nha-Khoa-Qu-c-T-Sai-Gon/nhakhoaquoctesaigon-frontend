# Constants Directory (`src/lib/constants/`)

This directory houses all static configuration values, navigation mappings, revalidation options, and CMS layout fallback structures.

## Folder Contents

### 1. `contact.ts`

- **Purpose**: Static contact details such as clinic hotlines, operating hours, email addresses, and address structures.
- **Reuse Pattern**: Import contact details globally for header/footer, maps, and booking forms.

### 2. `news.ts`

- **Purpose**: Fallbacks and static structures for articles, news, and dental blog listings.

### 3. `revalidate.ts`

- **Purpose**: Holds next.js ISR (Incremental Static Regeneration) cache timeout configuration constants.

### 4. `services-fallbacks.ts`

- **Purpose**: Centralized zero-mock fallbacks for all dental service templates (Braces, Crowns, Veneers, Implants, Bleaching, General Dentistry) to guarantee clean, crash-free renders when CMS fields are empty.
- **Reuse Pattern**: Import these default objects or empty arrays inside service templates as fallbacks for optional query values.

### 5. `services-nav.ts`

- **Purpose**: Configures the floating side index menus for each page to allow users to smoothly jump to specific page anchors.

### 6. `services.ts`

- **Purpose**: Contains structural metadata representing all dental treatment offerings.

### 7. `social-links.ts`

- **Purpose**: Static link configurations for social profiles (Facebook, YouTube, Zalo, maps link).

## Developer & AI Guidelines

> [!IMPORTANT]
> Always check `src/lib/constants/` before hardcoding text or values in your components. Reuse existing constants where possible to maintain uniformity and ensure single-source-of-truth edits.
