/**
 * Customer Domain Types
 *
 * Defines shared interfaces for customer images, reviews, success stories,
 * and checklist assets on the Customers section of the dental application.
 */

export interface CustomerImage {
  url?: string;
  path?: string;
  type?: string;
  alt?: string;
  alternativeText?: string;
}

export interface CustomerStory {
  rating?: number;
  quote?: string;
  name?: string;
  treatment?: string;
  avatar?: CustomerImage | null;
}

export interface CustomerWhyChooseUsFeature {
  icon?: CustomerImage | null;
  title?: string;
  description?: string;
}

export interface CustomerReviewChecklistItem {
  icon?: CustomerImage | null;
  text?: string;
}
