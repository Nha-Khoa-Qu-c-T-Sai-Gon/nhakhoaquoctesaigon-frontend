"use client";

import React from "react";
import { VisitClinicSection } from "@/src/components/sections";

interface ContactCTASectionProps {
  data?: {
    badge?: string;
    h2?: string;
    subtitle?: string;
  };
}

export function ContactCTASection({ data }: ContactCTASectionProps) {
  return (
    <VisitClinicSection
      id="visit-clinic"
      badge={data?.badge || ""}
      title={data?.h2 || ""}
      subtitle={data?.subtitle || ""}
      showSocials={true}
      className="py-20 lg:py-28 bg-sky-50 border-t border-sky-100"
      useDefaultContainer={true}
    />
  );
}
