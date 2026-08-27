import Link from "next/link";
import { CLINIC_INFO } from "@/src/lib/constants/contact";

/**
 * Not Found (404) Page
 * ─────────────────────────────────────────────────────────────────────────────
 * Displayed whenever Next.js cannot find a matching route or when a page
 * component calls notFound().
 *
 * Design: matches the site's dental-blue brand palette and premium aesthetic
 * (same radial glows, gradient background, glassmorphism pills as DoctorSection).
 *
 * Server Component — no interactivity needed here.
 */

export const metadata = {
  title: `Page Not Found | ${CLINIC_INFO.name}`,
  description:
    "The page you are looking for doesn't exist. Return to our homepage or book an appointment.",
};

export default function NotFound() {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-24"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #eef6ff 45%, #dce9fc 100%)",
      }}
    >
      {/* ── Decorative radial glows (same pattern as DoctorSection) ── */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] pointer-events-none blur-[60px] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(22,81,151,0.10), transparent 60%)",
          transform: "translate(-30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none blur-[50px] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 80% 85%, rgba(56,130,246,0.09), transparent 60%)",
          transform: "translate(30%, 30%)",
        }}
      />

      {/* ── Content card ── */}
      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Tooth / 404 illustration */}
        <div className="flex justify-center mb-8 select-none">
          <div className="relative inline-flex items-center justify-center">
            {/* Large ghost 404 behind the icon */}
            <span
              className="absolute text-[160px] sm:text-[200px] font-black leading-none tracking-tighter select-none pointer-events-none"
              style={{
                color: "rgba(22,81,151,0.06)",
                letterSpacing: "-0.05em",
              }}
              aria-hidden="true"
            >
              404
            </span>

            {/* Tooth SVG icon — centered over the ghost text */}
            <div
              className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(22,81,151,0.18)]"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(240,247,255,0.95) 100%)",
                border: "2px solid rgba(22,81,151,0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 sm:w-20 sm:h-20"
                aria-hidden="true"
              >
                {/* Tooth shape */}
                <path
                  d="M32 6C22 6 14 12 14 21c0 5 2 9 4 12l4 20c0.5 2.5 2 4 4 4 1.5 0 2.8-1 3.5-2.5L32 44l2.5 10.5C35.2 56 36.5 57 38 57c2 0 3.5-1.5 4-4l4-20c2-3 4-7 4-12 0-9-8-15-18-15z"
                  fill="#165197"
                  fillOpacity="0.15"
                  stroke="#165197"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Shine */}
                <path
                  d="M24 14c-4 2-7 6-7 10"
                  stroke="#165197"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeOpacity="0.4"
                />
                {/* Sad face */}
                <circle cx="27" cy="24" r="2" fill="#165197" fillOpacity="0.7" />
                <circle cx="37" cy="24" r="2" fill="#165197" fillOpacity="0.7" />
                <path
                  d="M27 31c1.5-2 8.5-2 10 0"
                  stroke="#165197"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeOpacity="0.7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full text-white"
            style={{
              background: "linear-gradient(90deg, #165197, #1e6ab5)",
              boxShadow: "0 4px 16px rgba(22,81,151,0.35)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            Error 404
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-[#165197] mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#2b6cb0] leading-relaxed max-w-sm mx-auto mb-10">
          Oops — the page you&apos;re looking for doesn&apos;t exist or may have
          been moved. Let us help you find your way back.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_12px_36px_rgba(22,81,151,0.4)] active:scale-[0.98]"
            style={{
              background: "linear-gradient(90deg, #165197 0%, #1e6ab5 100%)",
              boxShadow: "0 6px 20px rgba(22,81,151,0.30)",
            }}
          >
            {/* Home icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Homepage
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-200 hover:scale-[1.04] active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(22,81,151,0.20)",
              color: "#165197",
              boxShadow: "0 4px 14px rgba(22,81,151,0.10)",
            }}
          >
            {/* Phone icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact Us
          </Link>
        </div>

        {/* Quick links strip */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: "Dental Implants", href: "/dental-implants" },
            { label: "Teeth Whitening", href: "/teeth-whitening" },
            { label: "Our Doctors", href: "/#doctors" },
            { label: "About Us", href: "/about-us" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150 hover:scale-[1.04] hover:shadow-md"
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(22,81,151,0.14)",
                color: "#165197",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
