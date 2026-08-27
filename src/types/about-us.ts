/**
 * About Us Domain Types
 *
 * Defines shared interfaces for hero elements, statistics, clinical feature assets,
 * philosophy tabs, core values, and firm guarantees.
 */

export interface TitleLine {
  id?: string | number;
  text: string;
}

export interface StatItem {
  id?: string | number;
  number: string;
  value?: string | number;
  suffix?: string;
  label: string;
  icon?: string;
  iconImage?: string;
}

export interface FeatureItem {
  id?: string | number;
  title: string;
  description: string;
  icon?: string;
  iconImage?: string;
}

export interface PhilosophyTab {
  id?: string | number;
  key?: string;
  title: string;
  description: string;
  content?: string;
  icon?: string;
  image?: string;
  highlight?: string;
  label?: string;
}

export interface CoreValue {
  id?: string | number;
  title: string;
  description: string;
  icon?: string;
  iconImage?: string;
}

export interface PatientAvatar {
  id?: string | number;
  url?: string;
  formats?: {
    thumbnail?: {
      url: string;
    };
  };
}

export interface CommitmentItem {
  id?: string | number;
  title: string;
  description: string;
  icon?: string;
}
