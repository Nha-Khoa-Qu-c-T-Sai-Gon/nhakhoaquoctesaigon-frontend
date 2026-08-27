import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPageClient from "./ContactPageClient";
import { getContactPage, getContactMethods } from "@/src/lib/api/queries";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us - Saigon International Dental Clinic",
    description:
      "Get in touch with Saigon International Dental Clinic. Visit our locations, call us, or send us a message.",
  };
}

export default async function ContactPage() {
  const [contactData, contactMethods] = await Promise.all([
    getContactPage(),
    getContactMethods(),
  ]);

  if (!contactData || !contactData.blocks || contactData.blocks.length === 0) {
    notFound();
  }

  return (
    <ContactPageClient content={contactData} contactMethods={contactMethods} />
  );
}

// Disable all caching for this page to guarantee instant updates from CMS
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
