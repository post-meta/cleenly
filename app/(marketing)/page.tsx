import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { ImpactBar } from "@/components/marketing/impact-bar";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Services } from "@/components/marketing/services";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { WhyUs } from "@/components/marketing/why-us";
import { FAQ } from "@/components/marketing/faq";
import { ServiceAreas } from "@/components/marketing/service-areas";
import { CTA } from "@/components/marketing/cta";
import { JsonLd } from "@/components/shared/json-ld";
import { generateLocalBusinessSchema, generateFAQSchema } from "@/lib/utils/schema-generators";
import { cities } from "@/lib/data/cities";

export const metadata: Metadata = {
  title: "Conscious Cleaning for Modern Homes | CLEENLY Seattle",
  description:
    "Eco-friendly house cleaning in Seattle. 0% toxic chemicals, 100% recyclable packaging. Book thoughtful home care that's good for you and the planet.",
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

import { FadeIn } from "@/components/ui/fade-in";

export default function HomePage() {
  const seattle = cities.find(c => c.slug === 'seattle')!;
  const localBusinessSchema = generateLocalBusinessSchema(seattle);
  const faqSchema = generateFAQSchema([
    { question: "How much does house cleaning cost in Seattle?", answer: "Our regular cleaning starts at $100, deep cleaning at $150, and move-out cleaning at $200. Prices vary based on home size and condition." },
    { question: "Are your cleaners insured?", answer: "Yes, all cleaners on the CLEENLY platform are fully insured and background-checked for your peace of mind." }
  ]);

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />
      <Hero />
      <ImpactBar />
      <FadeIn>
        <HowItWorks />
      </FadeIn>
      <FadeIn>
        <Services />
      </FadeIn>
      <FadeIn>
        <PricingPreview />
      </FadeIn>
      <FadeIn>
        <WhyUs />
      </FadeIn>
      <FadeIn>
        <FAQ />
      </FadeIn>
      <FadeIn>
        <ServiceAreas />
      </FadeIn>
      <FadeIn>
        <CTA />
      </FadeIn>
    </>
  );
}
