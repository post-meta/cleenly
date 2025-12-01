import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Services } from "@/components/marketing/services";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { WhyUs } from "@/components/marketing/why-us";
import { FAQ } from "@/components/marketing/faq";
import { ServiceAreas } from "@/components/marketing/service-areas";
import { CTA } from "@/components/marketing/cta";
import {
  JsonLd,
  localBusinessSchema,
  faqSchema,
} from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "House Cleaning Seattle | Book Online Today | CLEENLY",
  description:
    "Book house cleaning in Seattle online. See prices upfront, choose your cleaner, schedule in minutes. Regular, deep clean, and move-out services available.",
  keywords: [
    "house cleaning seattle",
    "cleaning service seattle",
    "seattle house cleaners",
    "book cleaning online seattle",
    "maid service seattle",
    "home cleaning seattle wa",
    "house cleaning near me",
    "cleaning service bellevue",
    "house cleaning redmond",
    "cleaning service kirkland",
  ],
  openGraph: {
    title: "House Cleaning Seattle | Book Online | CLEENLY",
    description:
      "Book house cleaning in Seattle. See prices upfront, choose your cleaner, schedule in minutes.",
    type: "website",
    url: "https://cleenly.com",
    locale: "en_US",
    siteName: "CLEENLY",
    images: [
      {
        url: "https://cleenly.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CLEENLY - House Cleaning in Seattle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House Cleaning Seattle | Book Online | CLEENLY",
    description:
      "Book house cleaning in Seattle. See prices upfront, choose your cleaner.",
    images: ["https://cleenly.com/twitter-image.jpg"],
  },
  other: {
    "geo.region": "US-WA",
    "geo.placename": "Seattle",
    "geo.position": "47.6062;-122.3321",
    ICBM: "47.6062, -122.3321",
  },
  alternates: {
    canonical: "https://cleenly.com",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />
      <Hero />
      <HowItWorks />
      <Services />
      <PricingPreview />
      <WhyUs />
      <FAQ />
      <ServiceAreas />
      <CTA />
    </>
  );
}
