"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface CertificateModalContextType {
  isOpen: boolean;
  src: string;
  alt: string;
  open: (src: string, imageAlt: string) => void;
  close: () => void;
}

const CertificateModalContext = createContext<CertificateModalContextType>({
  isOpen: false,
  src: "",
  alt: "",
  open: () => {},
  close: () => {},
});

const EXIT_MS = 200;

function GlobalCertLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const exitRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger CSS enter animation after mount
  useEffect(() => {
    let r2: number;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  // Lock body scroll while mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard escape handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleClose = () => {
    setVisible(false);
    exitRef.current = setTimeout(onClose, EXIT_MS);
  };

  return (
    <>
      <div
        onClick={handleClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[100] bg-slate-900/90 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: visible ? "auto" : "none" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative inline-block pointer-events-auto transition-[transform,opacity] duration-200 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {imageLoading && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md animate-pulse rounded-2xl flex items-center justify-center z-[110]">
              <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "auto", height: "auto" }}
            unoptimized
            className={`max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
          />
          {!imageLoading && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              aria-label="Close image"
              className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-red-600/90 hover:bg-red-700 text-white border-2 border-white/40 flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 z-[120]"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function CertificateModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [shouldRender, setShouldRender] = useState(false);

  const open = useCallback((imageSrc: string, imageAlt: string) => {
    setSrc(imageSrc);
    setAlt(imageAlt);
    setIsOpen(true);
    setShouldRender(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    setShouldRender(false);
    setSrc("");
    setAlt("");
  }, []);

  return (
    <CertificateModalContext.Provider value={{ isOpen, src, alt, open, close }}>
      {children}
      {shouldRender && (
        <GlobalCertLightbox src={src} alt={alt} onClose={handleAnimationEnd} />
      )}
    </CertificateModalContext.Provider>
  );
}

export function useCertificateModal() {
  return useContext(CertificateModalContext);
}
