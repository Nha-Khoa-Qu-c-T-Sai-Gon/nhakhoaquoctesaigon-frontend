# Utilities Directory (`src/lib/utils/`)

This directory houses helper functions, mapping utilities, and metadata generators.

## Folder Contents

### 1. `maps.ts`

- **Purpose**: Pinpoint coordinates integration with Google Maps. Provides `getGoogleMapsUrl` to generate consistent directions links.
- **Reuse Pattern**: Import `getGoogleMapsUrl` for location links, contact buttons, and interactive maps.

### 2. `service-icons.ts`

- **Purpose**: Centralized Lucide icon mappings and dynamic context-based search resolvers (`getFallbackIconByContent`). Avoids importing Lucide icons locally in page templates.
- **Reuse Pattern**: Import `renderServiceIcon` or `getIcon` for dynamic CMS-driven sections.

### 3. `service-metadata.ts`

- **Purpose**: SEO Title/Description metadata generator overrides for service routes to ensure optimized indexing.
- **Reuse Pattern**: Import `getServiceMetadataOverride` inside page metadata generation handlers.

## Developer & AI Guidelines

> [!IMPORTANT]
> When rendering icons dynamically based on CMS fields, always use the helpers in `service-icons.ts` instead of writing custom icon resolvers. Ensure all new helper functions are documented with descriptive JSDoc comment strings.
