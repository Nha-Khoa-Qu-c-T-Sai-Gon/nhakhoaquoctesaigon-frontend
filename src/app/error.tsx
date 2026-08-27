"use client";

/**
 * Global Error Boundary (error.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Next.js App Router catches unexpected runtime errors here.
 * Must be a Client Component — receives `error` and `reset` props.
 *
 * Design: same dental-blue brand palette as the site.
 */

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service if needed
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-24"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #eef6ff 45%, #dce9fc 100%)",
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none blur-[60px] opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(220,38,38,0.06), transparent 60%)",
          transform: "translate(-30%, -30%)",
        }}
      />

      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(220,38,38,0.15)]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,240,240,0.95))",
              border: "2px solid rgba(220,38,38,0.12)",
            }}
          >
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full text-white"
            style={{
              background: "linear-gradient(90deg, #dc2626, #ef4444)",
              boxShadow: "0 4px 16px rgba(220,38,38,0.30)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            Something Went Wrong
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black leading-tight text-[#165197] mb-4">
          Unexpected Error
        </h1>

        <p className="text-base sm:text-lg text-[#2b6cb0] leading-relaxed max-w-sm mx-auto mb-10">
          We&apos;re sorry — an unexpected error occurred. Our team has been
          notified. Please try again or return home.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_12px_36px_rgba(22,81,151,0.4)] active:scale-[0.98]"
            style={{
              background: "linear-gradient(90deg, #165197 0%, #1e6ab5 100%)",
              boxShadow: "0 6px 20px rgba(22,81,151,0.30)",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-200 hover:scale-[1.04] active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(22,81,151,0.20)",
              color: "#165197",
              boxShadow: "0 4px 14px rgba(22,81,151,0.10)",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
