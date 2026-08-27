import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { AnimatedSectionHeader } from "@/src/components/ui/AnimatedSectionHeader";
import { PerformanceAnimation } from "@/src/components/ui/PerformanceAnimation";
import { IMPLANTS_STRUCTURE_FALLBACKS } from "@/src/lib/constants/services-fallbacks";

const IMPLANT_ANCHORS = [
  { xPct: 0.58, yPct: 0.18 }, // Crown — right edge of cream crown cap
  { xPct: 0.56, yPct: 0.39 }, // Abutment — right edge of metal abutment
  { xPct: 0.54, yPct: 0.62 }, // Implant Post — mid-body of threaded screw
];

const DESKTOP_CARD_STACK_HEIGHT_RATIO = 0.88;

interface ConnectorLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface ImplantPart {
  name?: string;
  desc?: string;
  icon?: string;
}

interface ImplantStructureSectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
    implantImage?: string;
    parts?: ImplantPart[];
  };
}

export const ImplantStructureSection = ({ data }: ImplantStructureSectionProps) => {
  const d = data || {};
  const parts = useMemo(() => d?.parts || [], [d?.parts]);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<ConnectorLine[]>([]);
  const [isLg, setIsLg] = useState(false);
  const [imageContentHeight, setImageContentHeight] = useState<number | null>(
    null,
  );
  const [imgSrc, setImgSrc] = useState(
    d.implantImage || IMPLANTS_STRUCTURE_FALLBACKS.implantImage,
  );
  const [iconSrcs, setIconSrcs] = useState<string[]>([]);

  useEffect(() => {
    setImgSrc(d.implantImage || IMPLANTS_STRUCTURE_FALLBACKS.implantImage);
  }, [d.implantImage]);

  useEffect(() => {
    setIconSrcs(
      parts.map(
        (part, idx: number) =>
          part.icon || IMPLANTS_STRUCTURE_FALLBACKS.icons[idx] || "",
      ),
    );
  }, [parts]);

  const recalc = () => {
    if (!containerRef.current || !imgRef.current) return;

    const isDesktop = window.innerWidth >= 1024;
    setIsLg(isDesktop);
    if (!isDesktop) {
      setLines([]);
      setImageContentHeight(null);
      return;
    }

    const cRect = containerRef.current.getBoundingClientRect();
    const iRect = imgRef.current.getBoundingClientRect();
    const img = imgRef.current;

    // ── Correct for object-contain letterboxing ──────────────────────────────
    const natW = img.naturalWidth || iRect.width;
    const natH = img.naturalHeight || iRect.height;
    const scale = Math.min(iRect.width / natW, iRect.height / natH);
    const rendW = natW * scale;
    const rendH = natH * scale;
    const contentLeft = iRect.left + (iRect.width - rendW) / 2;
    const contentTop = iRect.top + (iRect.height - rendH) / 2;
    setImageContentHeight(rendH);

    const newLines: ConnectorLine[] = [];

    cardRefs.current.forEach((cardEl, idx) => {
      if (!cardEl) return;
      const anchor = IMPLANT_ANCHORS[idx];
      if (!anchor) return;

      const kRect = cardEl.getBoundingClientRect();

      const x1 = contentLeft + rendW * anchor.xPct - cRect.left;
      const y1 = contentTop + rendH * anchor.yPct - cRect.top;

      const x2 = kRect.left - cRect.left;
      const y2 = kRect.top + kRect.height / 2 - cRect.top;

      newLines.push({ x1, y1, x2, y2 });
    });

    setLines(newLines);
  };

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recalc);
    const t1 = setTimeout(recalc, 400);
    const t2 = setTimeout(recalc, 1100);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [parts.length]);

  return (
    <section id="structure" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSectionHeader
          badge={d.badge}
          title={d.h2}
          subtitle={d.subtitle}
          align="center"
          className="mb-12 md:mb-16"
        />

        {/* Outer wrapper — relative so SVG can be absolutely placed */}
        <div
          ref={containerRef}
          className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16"
        >
          {isLg && lines.length > 0 && (
            <svg
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
                zIndex: 20,
              }}
            >
              {lines.map((ln, idx) => {
                const mx = ln.x1 + (ln.x2 - ln.x1) * 0.55;
                return (
                  <g key={idx}>
                    <polyline
                      points={`${ln.x1},${ln.y1} ${mx},${ln.y1} ${mx},${ln.y2} ${ln.x2},${ln.y2}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="5 4"
                    />
                    <circle cx={ln.x1} cy={ln.y1} r="4.5" fill="#165197" />
                    <circle cx={ln.x2} cy={ln.y2} r="5.5" fill="white" />
                    <circle cx={ln.x2} cy={ln.y2} r="3.5" fill="#165197" />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Left Image */}
          <PerformanceAnimation
            preset="slide-up-subtle"
            whileInView={true}
            duration={0.9}
            className="w-full lg:w-1/2 flex-shrink-0 flex items-center justify-center"
            style={{ position: "relative", zIndex: 0 }}
          >
            <Image
              ref={imgRef}
              src={imgSrc}
              alt="Full dental implant anatomy diagram"
              width={480}
              height={640}
              className="w-full max-w-[480px] lg:max-w-none h-auto object-contain drop-shadow-xl"
              onLoad={recalc}
              onError={() => {
                setImgSrc(IMPLANTS_STRUCTURE_FALLBACKS.implantImage);
                setTimeout(recalc, 100);
              }}
            />
          </PerformanceAnimation>

          {/* Right Cards */}
          <div
            className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5 lg:gap-4 xl:gap-5 lg:justify-between lg:self-center"
            style={{
              position: "relative",
              zIndex: 10,
              height:
                isLg && imageContentHeight
                  ? `${imageContentHeight * DESKTOP_CARD_STACK_HEIGHT_RATIO}px`
                  : undefined,
            }}
          >
            {parts.map((part, idx: number) => {
              return (
                <PerformanceAnimation
                  key={idx}
                  preset="slide-up-subtle"
                  whileInView={true}
                  duration={0.7}
                  delay={idx * 0.12}
                  className="lg:flex-1 lg:min-h-0"
                >
                  <div
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    className="flex h-full min-h-[132px] items-center gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-5 sm:px-6 lg:min-h-0 lg:px-6 lg:py-5 xl:px-7 xl:py-6 hover:shadow-md transition-shadow w-full"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {iconSrcs[idx] ? (
                          <Image
                            src={iconSrcs[idx]}
                            alt={part.name || "Implant Part"}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain flex-shrink-0"
                            onLoad={recalc}
                            onError={() => {
                              setIconSrcs(prev => {
                                const copy = [...prev];
                                copy[idx] = "";
                                return copy;
                              });
                            }}
                          />
                        ) : (
                          <span className="w-12 h-12 flex-shrink-0 inline-flex items-center justify-center rounded-full bg-sky-100 text-[#165197] font-bold text-base">
                            {String(idx + 1)}
                          </span>
                        )}
                        <h3 className="text-lg lg:text-xl font-bold text-[#165197] leading-tight">
                          {part.name}
                        </h3>
                      </div>
                      <p className="text-[15px] sm:text-base lg:text-lg text-[#165197]/80 leading-relaxed">
                        {part.desc}
                      </p>
                    </div>
                  </div>
                </PerformanceAnimation>
              );
            })}

            {parts.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                No parts data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
