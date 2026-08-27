import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { ReCaptchaProvider } from "@/src/components/providers/ReCaptchaProvider";
import {
  getNavigation,
  getFooter,
  getContactMethods,
  getAIChatConfig,
} from "@/src/lib/api/queries";
import { Toaster } from "sonner";
import { CLINIC_INFO } from "@/src/lib/constants/contact";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";
import { GlobalClientShell } from "./GlobalClientShell";

/**
 * Root Layout — Render Priority Strategy
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PRIORITY 1 — Synchronous SSR (critical path):
 *   • ReCaptchaProvider — script injection only, no DOM cost
 *   • Header            — navigation, always above fold
 *   • <main>            — page content; VideoHero drives LCP
 *   • Footer            — SSR, zero JS cost
 *   • Toaster           — reactive only, no first-paint cost
 *
 * PRIORITY 2 — GlobalClientShell ('use client', dynamic ssr:false):
 *   • DeferredProviders    — BookingModal + CallModal React context
 *                           ssr:false keeps JS out of initial payload.
 *                           Safe because both contexts have default values.
 *   • FloatingContactWrapper — AI chat, social icons, scroll-to-top
 *   • PromotionModal         — TTL-gated (500ms + 30min sessionStorage)
 *
 * NOTE: `ssr: false` is only allowed inside Client Components (Next.js rule).
 *       All ssr:false dynamic() calls are in GlobalClientShell.tsx ('use client').
 *       layout.tsx imports it as a regular named import — no dynamic() here.
 */

export const metadata: Metadata = {
  title: {
    template: `%s | ${CLINIC_INFO.name}`,
    default: `${CLINIC_INFO.name} - Professional Dental Services`,
  },
  description:
    "Professional dental services including dental implants, teeth whitening, and braces",
  icons: {
    icon: `${NEXT_PUBLIC_STRAPI_URL}/uploads/logo_37125485af.png`,
    shortcut: `${NEXT_PUBLIC_STRAPI_URL}/uploads/logo_37125485af.png`,
    apple: `${NEXT_PUBLIC_STRAPI_URL}/uploads/logo_37125485af.png`,
  },
  verification: {
    google: "3RgDyuHZHgE0yFPqGSPUqvBTFQSoBi0FoqThRQ8lzGA",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const navigation = await getNavigation();
  const footer = await getFooter();
  const contactMethods = await getContactMethods();
  const aiChatConfig = await getAIChatConfig();

  const servicesNav = navigation.navigation.find(
    (item) =>
      item.label.toLowerCase() === "services" ||
      item.label.toLowerCase() === "dịch vụ" ||
      item.href === "/services",
  );
  const serviceOptions =
    servicesNav?.children?.map((child) => child.label) || [];

  return (
    <html lang="vi">
      <head>
        {/* Google Search Console site verification — hardcoded here so it is
            included in the synchronous first-flush HTML head, not streamed
            later via RSC (which Next.js metadata API does with dynamic pages) */}
        <meta
          name="google-site-verification"
          content="3RgDyuHZHgE0yFPqGSPUqvBTFQSoBi0FoqThRQ8lzGA"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen font-sans">
        {/* Google Analytics — must be inside body, not between html/body */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0FW2VDBGS8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0FW2VDBGS8');
          `}
        </Script>
        <ReCaptchaProvider>
          {/*
           * GlobalClientShell: 'use client' boundary that contains all
           * dynamic({ ssr: false }) imports. Wraps children with modal context
           * providers and renders non-critical widgets after the hero.
           *
           * children (Header + main + Footer) are passed as React children —
           * they remain SSR-rendered even though GlobalClientShell is a client
           * component. This is the standard Next.js App Router pattern.
           */}
          <GlobalClientShell
            serviceOptions={serviceOptions}
            contactMethods={contactMethods}
            aiChatConfig={aiChatConfig}
          >
            {/* ── PRIORITY 1: critical SSR shell ────────────────────────── */}
            <Header navigation={navigation} />

            <main className="flex-1 overflow-x-clip main-content-offset">{children}</main>

            <Footer footer={footer} />
          </GlobalClientShell>

          {/* Toaster: purely reactive, zero first-paint cost */}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              className: "max-sm:mb-20 max-sm:mx-auto",
            }}
          />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
