"use client";

/**
 * GlobalClientShell
 * ─────────────────────────────────────────────────────────────────────────────
 * A 'use client' boundary that owns all dynamic({ ssr: false }) imports.
 *
 * WHY this file exists:
 *   Next.js App Router enforces that `dynamic({ ssr: false })` can only be
 *   called inside a Client Component. layout.tsx is a Server Component, so
 *   all ssr:false imports must live here instead.
 *
 * What it does:
 *   1. Wraps children in BookingModal + CallModal React context providers
 *      (DeferredProviders). On server: providers don't render (ssr:false),
 *      but both contexts have safe default values so Header works fine.
 *   2. Renders FloatingContactWrapper (AI chat, social icons) after hero.
 *   3. Renders PromotionModal (client-only, TTL-gated, returns null by default).
 *
 * What it does NOT do:
 *   - It does NOT wrap <main> or <Footer> — they are siblings rendered by
 *     layout.tsx directly. Context is still available because DeferredProviders
 *     wraps `children` which includes Header, main, Footer.
 */

import dynamic from "next/dynamic";

// ── Context providers (ssr:false = excluded from initial SSR payload) ─────────
// Both contexts have safe defaults so Header works during pre-hydration window.
const DeferredProviders = dynamic(
  () =>
    import("@/src/components/providers/DeferredProviders").then((m) => ({
      default: m.DeferredProviders,
    })),
  { ssr: false },
);

// ── Non-critical widgets ───────────────────────────────────────────────────────
const FloatingContactWrapper = dynamic(
  () =>
    import("@/src/components/floating-contact").then((m) => ({
      default: m.FloatingContactWrapper,
    })),
  { ssr: false },
);

// ── Promotion modal (TTL-gated, returns null by default) ───────────────────────
const PromotionModal = dynamic(
  () =>
    import("@/src/components/blocks/PromotionModal").then((m) => ({
      default: m.PromotionModal,
    })),
  { ssr: false },
);

import type { ContactMethod, AIChatConfig } from "@/src/types/strapi";

interface GlobalClientShellProps {
  children: React.ReactNode;
  serviceOptions: string[];
  contactMethods: ContactMethod[];
  aiChatConfig?: AIChatConfig | null;
}

export function GlobalClientShell({
  children,
  serviceOptions,
  contactMethods,
  aiChatConfig,
}: GlobalClientShellProps) {
  return (
    <>
      {/*
       * DeferredProviders wraps children (which includes Header + main + Footer)
       * so BookingModal/CallModal context is available to all consumers.
       * ssr:false means this provider renders only on client — but context
       * default values (open: noop, isOpen: false) keep everything safe
       * during the brief pre-hydration window.
       */}
      <DeferredProviders serviceOptions={serviceOptions}>
        {children}
      </DeferredProviders>

      {/* Non-critical widgets — mount after hero is interactive */}
      <FloatingContactWrapper
        contactMethods={contactMethods}
        aiChatConfig={aiChatConfig}
      />

      {/* TTL-gated modal — returns null until 500ms idle + sessionStorage check */}
      <PromotionModal />
    </>
  );
}
