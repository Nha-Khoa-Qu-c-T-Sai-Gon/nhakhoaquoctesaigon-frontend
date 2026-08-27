"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  Shield,
  ScanLine,
  Globe,
  Users,
  Clock,
  Star,
  LucideIcon,
} from "lucide-react";

import { HeroSection } from "@/src/components/services/overview/HeroSection";
import { ServicesGridSection } from "@/src/components/services/overview/ServicesGridSection";
import { WhyChooseSection } from "@/src/components/services/overview/WhyChooseSection";
import { CTASection } from "@/src/components/services/overview/CTASection";

type TrustItem = { icon: LucideIcon; label: string; sub: string };
type ServiceItem = {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
};
type FeatureItem = { icon: LucideIcon; title: string; description: string };

type PageData = {
  hero: {
    badge: string;
    title: string;
    description: string;
    trust: TrustItem[];
  };
  services: ServiceItem[];
  features: FeatureItem[];
};

function getIconForString(name: string): LucideIcon {
  switch (name) {
    case "Star":
      return Star;
    case "Users":
      return Users;
    case "Clock":
      return Clock;
    case "Shield":
      return Shield;
    case "ScanLine":
      return ScanLine;
    case "Globe":
      return Globe;
    default:
      return Star;
  }
}

export default function ServicesPageClient({ data }: { data?: any }) {
  if (!data?.layout) {
    return <main className="min-h-screen bg-white" />;
  }

  const heroBlock = data.layout.find(
    (b: { __component: string }) => b.__component === "services-overview.hero",
  );
  const featuresBlock = data.layout.find(
    (b: { __component: string }) => b.__component === "services-overview.features",
  );
  const ctaBlock = data.layout.find(
    (b: { __component: string }) => b.__component === "services-overview.cta",
  );

  if (!heroBlock || !featuresBlock) {
    return (
      <main className="min-h-screen bg-white">
        <ServicesGridSection data={data.services || []} />
      </main>
    );
  }

  const activeData: PageData = {
    hero: {
      badge: heroBlock.badge || "Premium Dental Services",
      title: heroBlock.title,
      description: heroBlock.description,
      trust:
        heroBlock.trust?.map((t: { icon: string; label: string; sub: string }) => ({
          icon: getIconForString(t.icon),
          label: t.label,
          sub: t.sub,
        })) || [],
    },
    services: data.services || [],
    features:
      featuresBlock.features?.map((f: { icon: string; title: string; description: string }) => ({
        icon: getIconForString(f.icon),
        title: f.title,
        description: f.description,
      })) || [],
  };

  return (
    <main className="min-h-screen bg-white">
      <HeroSection data={activeData.hero} />
      <ServicesGridSection data={activeData.services} />
      <WhyChooseSection data={activeData.features} />
      <CTASection ctaData={ctaBlock} />
    </main>
  );
}
