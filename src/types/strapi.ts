/**
 * Strapi TypeScript Types
 *
 * Type definitions for Strapi API responses and frontend data structures.
 */

// ============================================================================
// Strapi API Response Types (Raw)
// ============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: Record<string, unknown> | null;
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string | null;
      provider: string;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
  id?: number;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, unknown> | null;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  url?: string;
  previewUrl?: string | null;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Strapi Content Type Attributes
// ============================================================================

export interface PageAttributes {
  title: string;
  slug: string;
  content?: string; // Rich text content field
  cover?: StrapiMedia; // Cover image
  description?: string; // Text description
  publishDate?: string; // Publish date
  metaTitle?: string | null;
  metaDescription?: string | null;
  layout?: BlockComponent[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type BlockComponent = HeroComponent | ServicesComponent | CTAComponent;

export interface HeroComponent {
  __component: "blocks.hero";
  id: number;
  heading: string;
  subheading: string | null;
  image: StrapiMedia;
}

export interface ServicesComponent {
  __component: "blocks.services";
  id: number;
  heading: string;
  items: ServiceItem[];
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  image: StrapiMedia;
}

export interface CTAComponent {
  __component: "blocks.cta";
  id: number;
  text: string;
  buttonLabel: string;
  link: string;
}

// ============================================================================
// Strapi API Response Types (Typed)
// ============================================================================

export type StrapiPage = StrapiResponse<StrapiEntity<PageAttributes>>;
export type StrapiPages = StrapiResponse<StrapiEntity<PageAttributes>[]>;

// ============================================================================
// Frontend Types (Transformed)
// ============================================================================

export interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string; // Rich text content field
  cover?: Media; // Cover image
  description?: string; // Text description
  publishDate?: string; // Publish date
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  layout: Block[];
}

export type Block = HeroBlock | ServicesBlock | CTABlock;

export interface HeroBlock {
  blockType: "hero";
  heading: string;
  subheading?: string;
  image?: Media;
}

export interface ServicesBlock {
  blockType: "services";
  heading: string;
  items: {
    title: string;
    description: string;
    image?: Media;
  }[];
}

export interface CTABlock {
  blockType: "cta";
  text: string;
  buttonLabel: string;
  link: string;
}

export interface Media {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface StrapiNavigation {
  data: {
    id: number;
    documentId: string;
    navigation: NavItem[];
    logo?: StrapiMedia;
    ctaText?: string;
    ctaLink?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export interface NavChild {
  id: number;
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string | null;
}

export interface NavItem {
  id: number;
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string | null;
  children?: NavChild[];
}

export interface Navigation {
  navigation: NavItem[];
  logo?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  ctaText?: string;
  ctaLink?: string;
}

// ============================================================================
// Footer Types
// ============================================================================

export interface StrapiFooter {
  data: {
    id: number;
    documentId: string;
    logo?: StrapiMedia;
    description: string;
    contact_info: StrapiContactInfo;
    footer_links: FooterLink[];
    social_links: SocialLink[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export interface StrapiContactInfo {
  id: number;
  address: string;
  phone: string;
  email: string;
  address_icon?: StrapiMedia;
  phone_icon?: StrapiMedia;
  email_icon?: StrapiMedia;
}

export interface ContactInfo {
  id: number;
  address: string;
  phone: string;
  email: string;
  addressIcon?: Media;
  phoneIcon?: Media;
  emailIcon?: Media;
}

export interface FooterLink {
  id: number;
  label: string;
  href: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  iconClass?: string;
}

export interface Footer {
  logo?: Media;
  description: string;
  contactInfo: ContactInfo;
  links: FooterLink[];
}

// ============================================================================
// News Page Types
// ============================================================================

// ============================================================================
// Homepage Types
// ============================================================================

export interface StrapiHomepage {
  data: {
    id: number;
    documentId: string;
    title: string;
    layout: HomepageBlockComponent[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: Record<string, unknown>;
}

export type HomepageBlockComponent =
  | HomepageVideoHeroComponent
  | HomepageHeroComponent
  | HomepageTrustComponent
  | HomepageServicesComponent
  | HomepageProcessComponent
  | HomepageDoctorComponent
  | HomepageAboutComponent
  | HomepageCombinedTestimonialResultComponent
  | HomepageCertificationComponent
  | HomepagePapersSectionComponent
  | HomepageFAQComponent
  | HomepageCTAComponent
  | HomepageBlogCollectionComponent;

export interface HomepageVideoHeroComponent {
  __component: "homepage.video-hero";
  id: number;
  titleLines?: Array<{ id: number; text: string }>;
  subtitle: string;
  ctaText: string;
  videoMedia?: StrapiMedia; // Replace with precise media type if desired, using any for simplicity to match posterImage which uses any in queries
  posterImage?: StrapiMedia;
  mobileBackgroundImage?: StrapiMedia;
  isActive: boolean;
}

export interface HomepageHeroComponent {
  __component: "homepage.hero";
  id: number;
  heading: string;
  subheading?: string;
  image?: StrapiMedia;
  cta_label?: string;
  cta_link?: string;
  user_avatars?: StrapiMedia[];
}

export interface HomepageServicesComponent {
  __component: "homepage.services";
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  items: HomepageServiceItem[];
}

export interface HomepageServiceItem {
  id: number;
  title: string;
  description: string;
  image?: StrapiMedia;
  link?: string;
}

export interface HomepageAboutComponent {
  __component: "homepage.about";
  id: number;
  title: string;
  content: string;
  image?: StrapiMedia;
}

export interface HomepageCombinedTestimonialResultComponent {
  __component: "homepage.combined-testimonial-result";
  id: number;
  title: string;
  subtitle?: string;
  items: HomepageCombinedTestimonialResultItem[];
}

export interface HomepageCombinedTestimonialResultItem {
  id: number;
  customerName: string;
  content: string;
  rating: number;
  country?: string;
  beforeImage?: StrapiMedia;
  avatar?: StrapiMedia;
  afterImage?: StrapiMedia;
}

export interface HomepageCTAComponent {
  __component: "homepage.cta";
  id: number;
  heading: string;
  highlight_text?: string;
  button_label: string;
  button_link: string;
  background_image?: StrapiMedia;
  mobile_background_image?: StrapiMedia;
  human_image?: StrapiMedia;
}

export interface HomepageBlogCollectionComponent {
  __component: "homepage.blog-collection-section";
  id: number;
  title: string;
  subtitle?: string;
  posts?: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
      excerpt?: string;
      coverImage?: StrapiMedia;
      publishedAt: string;
    };
  }>;
  layout?: "grid_2" | "grid_3" | "grid_4";
  showFeatured?: boolean;
  isActive?: boolean;
}

export interface HomepageTrustComponent {
  __component: "homepage.trust";
  id: number;
  title: string;
  subtitle?: string;
  stats: Array<{
    id: number;
    number: string;
    label: string;
    suffix?: string;
    icon?: StrapiMedia;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    image?: StrapiMedia;
  }>;
}

export interface HomepageProcessComponent {
  __component: "homepage.process";
  id: number;
  title: string;
  subtitle?: string;
  steps: Array<{
    id: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface HomepageDoctorComponent {
  __component: "homepage.doctor";
  id: number;
  title: string;
  subtitle?: string;
  doctors: Array<{
    id: number;
    name: string;
    specialization?: string;
    bio?: string;
    image?: StrapiMedia;
    certificate_image?: StrapiMedia;
    experience_years?: number;
    badges?: Array<{ id: number; label: string }>;
    stats?: Array<{ id: number; label: string }>;
  }>;
}

export interface HomepageCertificationComponent {
  __component: "homepage.certification";
  id: number;
  titleLines?: Array<{ id: number; text: string }>;
  subtitle?: string;
  certificates: Array<{
    id: number;
    name: string;
    image?: StrapiMedia;
    organization?: string;
  }>;
}

export interface HomepagePapersSectionComponent {
  __component: "homepage.papers-section";
  id: number;
  title: string;
  subtitle?: string;
  papers: Array<{
    id: number;
    image?: StrapiMedia;
    link: string;
  }>;
}

export interface HomepageFAQComponent {
  __component: "homepage.faq";
  id: number;
  title: string;
  subtitle?: string;
  questions: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

// Frontend Homepage Types (Normalized)

export interface Homepage {
  title: string;
  metadataTitle?: string;
  metadataDescription?: string;
  metadataImage?: string;
  blocks: HomepageBlock[];
}

export type HomepageBlock =
  | HomepageVideoHeroBlock
  | HomepageHeroBlock
  | HomepageTrustBlock
  | HomepageServicesBlock
  | HomepageProcessBlock
  | HomepageDoctorBlock
  | HomepageAboutBlock
  | HomepageCombinedTestimonialResultBlock
  | HomepageCertificationBlock
  | HomepagePapersSectionBlock
  | HomepageFAQBlock
  | HomepageCTABlock
  | HomepageBlogCollectionBlock;

export interface HomepageVideoHeroBlock {
  blockType: "video-hero";
  id: number;
  titleLines?: Array<{ id: number; text: string }>;
  subtitle: string;
  ctaText: string;
  videoUrl: string;
  posterImage?: Media;
  mobileBackgroundImage?: Media;
  isActive: boolean;
}

export interface HomepageHeroBlock {
  blockType: "hero";
  id: number;
  heading: string;
  subheading?: string;
  image?: Media;
  ctaLabel?: string;
  ctaLink?: string;
  userAvatars?: Media[];
}

export interface HomepageServicesBlock {
  blockType: "services";
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  viewMoreLabel?: string;
  viewMoreLink?: string;
  items: {
    id: number;
    title: string;
    description: string;
    image?: Media;
    link?: string;
  }[];
}

export interface HomepageAboutBlock {
  blockType: "about";
  id: number;
  title: string;
  content: string;
  image?: Media;
}

export interface HomepageCombinedTestimonialResultBlock {
  blockType: "combined-testimonial-result";
  id: number;
  title: string;
  subtitle?: string;
  items: Array<{
    id: number;
    customerName: string;
    content: string;
    rating: number;
    country?: string;
    beforeImage?: Media;
    afterImage?: Media;
    avatar?: Media;
  }>;
}

export interface HomepageCTABlock {
  blockType: "cta";
  id: number;
  heading: string;
  subheading?: string;
  highlightText?: string;
  buttonLabel: string;
  buttonLink: string;
  backgroundImage?: Media;
  mobileBackgroundImage?: Media;
  humanImage?: Media;
}

export interface HomepageTrustBlock {
  blockType: "trust";
  id: number;
  title: string;
  subtitle?: string;
  stats: Array<{
    id: number;
    number: string;
    label: string;
    suffix?: string;
    icon?: Media;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    image?: Media;
  }>;
}

export interface HomepageProcessBlock {
  blockType: "process";
  id: number;
  title: string;
  subtitle?: string;
  steps: Array<{
    id: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface HomepageDoctorBlock {
  blockType: "doctor";
  id: number;
  title: string;
  subtitle?: string;
  doctors: Array<{
    id: number;
    name: string;
    specialization?: string;
    bio?: string;
    image?: Media;
    certificateImage?: Media;
    experienceYears?: number;
    badges: string[];
    stats: string[];
  }>;
}

export interface HomepageCertificationBlock {
  blockType: "certification";
  id: number;
  titleLines?: Array<{ id: number; text: string }>;
  subtitle?: string;
  certificates: Array<{
    id: number;
    name: string;
    image?: Media;
    organization?: string;
  }>;
}

export interface HomepagePapersSectionBlock {
  blockType: "papers-section";
  id: number;
  title: string;
  subtitle?: string;
  papers: Array<{
    id: number;
    image?: Media;
    link: string;
  }>;
}

export interface HomepageFAQBlock {
  blockType: "faq";
  id: number;
  title: string;
  subtitle?: string;
  questions: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

export interface HomepageBlogCollectionBlock {
  blockType: "blog-collection-section";
  id: number;
  title: string;
  subtitle?: string;
  posts: Array<{
    id: number;
    attributes: {
      title: string;
      slug: string;
      excerpt?: string;
      coverImage?: StrapiMedia;
      publishedAt: string;
    };
  }>;
  showFeatured?: boolean;
  isActive?: boolean;
}

// ============================================================================
// Contact Method Types
// ============================================================================

export interface StrapiContactMethod {
  id: number;
  documentId: string;
  type: string;
  label: string;
  href: string;
  icon?: StrapiMedia;
  color?: string;
  order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiContactMethods {
  data: StrapiContactMethod[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ContactMethod {
  id: number;
  type: string;
  label: string;
  href: string;
  icon?: Media;
  iconUrl?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

// ============================================================================
// AI Chat Config Types
// ============================================================================

export interface StrapiCommonQuestion {
  id: number;
  emoji?: string;
  label: string;
  prompt: string;
}

export interface StrapiAIChatConfig {
  data: {
    id: number;
    documentId: string;
    is_enabled?: boolean;
    default_open?: boolean;
    ai_name: string;
    ai_avatar?: StrapiMedia;
    welcome_message?: string;
    empty_state_title?: string;
    empty_state_subtitle?: string;
    empty_state_description?: string;
    quick_replies_title?: string;
    launcher_open_label?: string;
    launcher_close_label?: string;
    panel_aria_label?: string;
    common_questions?: StrapiCommonQuestion[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  } | null;
  meta: Record<string, unknown>;
}

export interface CommonQuestion {
  id: number;
  emoji?: string;
  label: string;
  prompt: string;
}

export interface AIChatConfig {
  isEnabled: boolean;
  defaultOpen: boolean;
  aiName: string;
  aiAvatar?: Media;
  welcomeMessage?: string;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateDescription?: string;
  quickRepliesTitle?: string;
  launcherOpenLabel: string;
  launcherCloseLabel: string;
  panelAriaLabel: string;
  commonQuestions: CommonQuestion[];
}
