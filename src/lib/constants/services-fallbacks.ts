/**
 * Centralized Service Fallback Constants
 *
 * Centralized, empty/default structure fallback definitions for service pages
 * to ensure graceful layout rendering and 100% compliance with Rule 17.
 */

// ─── DENTAL CROWNS ───────────────────────────────────────────────────────────
export const CROWNS_TREATMENTS_FALLBACK = {
  crown: { title: "", description: "" },
  veneer: { title: "", description: "" },
  implant: { title: "", description: "" },
};

export const CROWNS_COMPARISON_FALLBACK = {
  badge: "Detailed Treatment Comparison",
  title: "Detailed Treatment Comparison",
  headers: [
    { key: "feature", label: "Feature" },
    { key: "zirconia", label: "Zirconia" },
    { key: "emax", label: "Lithium Disilicate (E.max)" },
    { key: "pfm", label: "Porcelain Fused to Metal" },
  ],
  rows: [
    {
      feature: "Aesthetics",
      zirconia: "Very good",
      emax: "Excellent",
      pfm: "Good"
    },
    {
      feature: "Strength (MPa)",
      zirconia: "900 – 1,200",
      emax: "360 – 400",
      pfm: "400 – 600"
    },
    {
      feature: "Best position",
      zirconia: "Posterior",
      emax: "Anterior / premolar",
      pfm: "Any"
    },
    {
      feature: "Metal-free",
      zirconia: "✓",
      emax: "✓",
      pfm: "✗"
    },
    {
      feature: "Lifespan",
      zirconia: "15 – 20+ yrs",
      emax: "10 – 15 yrs",
      pfm: "10 – 15 yrs"
    },
    {
      feature: "Bruxism suitability",
      zirconia: "✓✓",
      emax: "✗",
      pfm: "✓"
    },
    {
      feature: "Estimated cost",
      zirconia: "●●●●",
      emax: "●●●●",
      pfm: "●●●"
    }
  ] as Record<string, unknown>[],
  footnote: "Prices and outcomes vary based on individual cases. Consult our dental specialists for advice.",
};

export const CROWNS_DAILY_HABITS_FALLBACK: Record<string, unknown>[] = [];
export const CROWNS_AVOID_LIST_FALLBACK: Record<string, unknown>[] = [];
export const CROWNS_PAYMENT_METHODS_FALLBACK: Record<string, unknown>[] = [];

// ─── DENTAL IMPLANTS ─────────────────────────────────────────────────────────
export const DENTAL_IMPLANTS_PAGE_FALLBACK = {
  meta: {
    title: "",
    description: "",
  },
  hero: {
    badge: "",
    h1: "",
    subtitle: "",
    bgImage: "",
    backgroundImage: "",
    image: "",
    cta1: "",
    cta2: "",
  },
  whatAreImplants: {
    badge: "",
    h2: "",
    body: [] as string[],
    image: "",
  },
  implantStructure: {
    badge: "",
    h2: "",
    subtitle: "",
    implantImage: "",
    parts: [] as any[],
  },
  benefits: {
    badge: "",
    h2: "",
    subtitle: "",
    items: [] as any[],
  },
  indications: {
    badge: "",
    h2: "",
    subtitle: "",
    cases: [] as any[],
  },
  types: {
    badge: "",
    h2: "",
    subtitle: "",
    options: [] as any[],
  },
  procedure: {
    badge: "",
    h2: "",
    subtitle: "",
    steps: [] as any[],
  },
  pricing: {
    badge: "",
    h2: "",
    subtitle: "",
    implantTable: {
      headers: [] as string[],
      rows: [] as any[],
    },
    crownTable: {
      headers: [] as string[],
      rows: [] as any[],
    },
    note: "",
  },
  whyChooseUs: {
    badge: "",
    h2: "",
    subtitle: "",
    points: [] as any[],
    clinicImage: "",
  },
  doctors: {
    badge: "",
    h2: "",
    subtitle: "",
    profiles: [] as any[],
  },
  brands: {
    badge: "",
    h2: "",
    subtitle: "",
    points: [] as any[],
  },
  results: {
    badge: "",
    title: "",
    subtitle: "",
    items: [] as any[],
  },
  testimonials: {
    badge: "",
    h2: "",
    reviews: [] as any[],
  },
  faq: {
    badge: "",
    h2: "",
    subtitle: "",
    items: [] as any[],
  },
};

export const IMPLANTS_STRUCTURE_FALLBACKS = {
  implantImage: "",
  icons: ["", "", ""],
};

export const IMPLANTS_STEP_FALLBACKS = ["", "", "", "", ""];

// ─── DENTAL VENEERS ──────────────────────────────────────────────────────────
export const DENTAL_VENEERS_PAGE_FALLBACK = {
  meta: {
    title: "",
    description: "",
  },
  hero: {
    h1: "",
    subtitle: "",
    cta1: "Book a Consultation",
    cta2: "View Pricing",
    image: "",
    badges: [] as string[],
  },
  whatAreVeneers: {
    badge: "",
    h2: "",
    body: "",
    callout: "",
    image: "",
  },
  prosCons: {
    badge: "",
    h2: "",
    subtitle: "",
    pros: [] as any[],
    cons: [] as any[],
  },
  comparison: {
    badge: "",
    h2: "",
    subtitle: "",
    rows: [] as any[],
  },
  candidates: {
    badge: "",
    h2: "",
    suitable: [] as any[],
    notSuitable: [] as any[],
  },
  process: {
    badge: "",
    h2: "",
    subtitle: "",
    steps: [] as any[],
  },
  care: {
    badge: "",
    h2: "",
    subtitle: "",
    items: [] as any[],
  },
  pricing: {
    badge: "",
    h2: "",
    context: "",
    rows: [] as any[],
    cta1: "Call Hotline 1",
    cta2: "Call Hotline 2",
    disclaimer: "",
  },
  costFactors: {
    badge: "",
    h2: "",
    subtitle: "",
    items: [] as any[],
  },
  whyVietnam: {
    badge: "",
    h2: "",
    subtitle: "",
    pillars: [] as any[],
    doctors: [] as any[],
    image: "",
  },
  testimonials: {
    badge: "",
    h2: "",
    patients: [] as any[],
  },
  faq: {
    badge: "",
    h2: "",
    items: [] as any[],
  },
};

export const VENEERS_TREATMENTS_FALLBACK = {
  crown: { title: "", description: "" },
  veneer: { title: "", description: "" },
  implant: { title: "", description: "" },
};

export const VENEERS_COMPARISON_FALLBACK = {
  badge: "",
  title: "",
  headers: [] as { key: string; label: string }[],
  rows: [] as Record<string, unknown>[],
  footnote: "",
};

export const VENEERS_DAILY_HABITS_FALLBACK: Record<string, unknown>[] = [];
export const VENEERS_AVOID_LIST_FALLBACK: Record<string, unknown>[] = [];

// ─── DENTAL BRACES ───────────────────────────────────────────────────────────
export const BRACES_PROCESS_FALLBACK: Record<string, unknown>[] = [];
export const BRACES_CARE_DAILY_FALLBACK: Record<string, unknown>[] = [];
export const BRACES_CARE_AVOID_FALLBACK: Record<string, unknown>[] = [];

// ─── DENTAL BLEACHING ────────────────────────────────────────────────────────
export const DENTAL_BLEACHING_PAGE_FALLBACK = {
  hero: {
    badge: "",
    titleHighlight: "",
    subtitle: "",
    cta1: "Book a Consultation",
    cta2: "Learn More",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=1200",
    badges: [] as string[],
  },
  whatIsBleaching: {
    title: "",
    shortDef: "",
    body: "",
    readMore: [] as any[],
    highlights: [] as any[],
    image: null as any,
    note: "",
  },
  discolorationTypes: {
    badge: "",
    title: "",
    subtitle: "",
    extrinsic: {
      title: "",
      accent: "amber",
      causes: [] as string[],
      treatment: "",
      icon: null as any,
    },
    intrinsic: {
      title: "",
      accent: "slate",
      causes: [] as string[],
      treatment: "",
      icon: null as any,
    },
    callout: "",
    limitation: "",
  },
  treatmentOptions: {
    badge: "",
    title: "",
    options: [] as any[],
    comparisonTable: [] as any[],
  },
  safety: {
    badge: "",
    title: "",
    subtitle: "",
    reassurance: "",
    items: [] as any[],
  },
  preTreatment: {
    badge: "",
    title: "",
    subtitle: "",
    steps: [] as any[],
  },
  results: {
    badge: "",
    title: "",
    cases: [] as any[],
    disclaimer: "",
    points: [] as any[],
    timeline: [] as any[],
  },
  comparison: {
    badge: "",
    title: "",
    subtitle: "",
    rows: [] as any[],
  },
  faq: [] as any[],
  clinic: {
    badge: "",
    title: "",
    subtitle: "",
    image: null as any,
    doctorByline: {
      label: "",
      name: "",
      credentials: "",
    },
    clinicalDescription: [] as string[],
    credentials: [] as any[],
    reviews: [] as any[],
    disclaimer: "",
  },
  cta: null as any,
};

export const BLEACHING_METHODS_FALLBACK: Record<string, unknown>[] = [];
export const BLEACHING_CARE_DAILY_FALLBACK: Record<string, unknown>[] = [];
export const BLEACHING_CARE_AVOID_FALLBACK: Record<string, unknown>[] = [];
export const BLEACHING_RESULTS_FALLBACK = [
  {
    before:
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=600",
    after:
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600",
  },
];

// ─── GENERAL DENTISTRY ───────────────────────────────────────────────────────
export const GENERAL_TREATMENTS_FALLBACK: Record<string, unknown>[] = [];
export const GENERAL_CARE_DAILY_FALLBACK: Record<string, unknown>[] = [];
export const GENERAL_CARE_AVOID_FALLBACK: Record<string, unknown>[] = [];
