"use client";

/**
 * DeferredProviders
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps BookingModalWrapper + CallModalWrapper in a single client component
 * that is imported via next/dynamic({ ssr: false }) in layout.tsx.
 *
 * WHY a wrapper instead of dynamic() on each individually?
 *   BookingModalWrapper and CallModalWrapper provide React context that is
 *   consumed by Header.tsx (useBookingModal) and CallNowButton.tsx.
 *   They MUST be ancestors of those consumers in the React tree.
 *
 *   Since layout.tsx is a Server Component, we cannot use React.createContext
 *   or hooks directly. The only correct pattern is:
 *     1. Keep the providers in the layout tree as ancestors of consumers
 *     2. But avoid including their JS in the initial server-rendered payload
 *
 *   Solution: a single 'use client' file that re-exports the two wrappers
 *   composed together. layout.tsx imports THIS file via dynamic({ ssr: false }),
 *   so the entire provider subtree (and all their dependencies) is excluded
 *   from the SSR HTML and hydration pass — loaded only after first paint.
 *
 * CONTEXT during pre-hydration window:
 *   Both contexts return safe defaults (open: noop, isOpen: false) when
 *   called outside the provider, so Header and children are still functional
 *   for reading/display during the brief window before hydration completes.
 *   Interactive triggers (booking button clicks) will always fire after
 *   hydration since they require user action.
 */

import { BookingModalWrapper } from "@/src/components/booking-modal/BookingModalWrapper";
import { CallModalWrapper } from "@/src/components/call-modal";
import { CertificateModalProvider } from "./CertificateModalContext";

interface DeferredProvidersProps {
  children: React.ReactNode;
  serviceOptions: string[];
}

export function DeferredProviders({
  children,
  serviceOptions,
}: DeferredProvidersProps) {
  return (
    <BookingModalWrapper serviceOptions={serviceOptions}>
      <CallModalWrapper>
        <CertificateModalProvider>{children}</CertificateModalProvider>
      </CallModalWrapper>
    </BookingModalWrapper>
  );
}
