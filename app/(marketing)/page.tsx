import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingSection } from "@/components/marketing/pricing-section";
import { WhyUs } from "@/components/marketing/why-us";
import { FAQ } from "@/components/marketing/faq";
import { ServiceAreas } from "@/components/marketing/service-areas";
import { CTA } from "@/components/marketing/cta";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { JsonLd } from "@/components/shared/json-ld";
import { generateLocalBusinessSchema, generateFAQSchema } from "@/lib/utils/schema-generators";
import { cities } from "@/lib/data/cities";

export const metadata: Metadata = {
  title: "House Cleaning Seattle | Book Online Today | CLEENLY",
  description:
    "Book house cleaning in Seattle online. See your price upfront, pick a time, done. Regular, deep clean, and move-out services.",
  keywords: [
    "house cleaning seattle",
    "cleaning service seattle",
    "seattle house cleaners",
    "book cleaning online seattle",
    "house cleaning service seattle",
    "home cleaning seattle wa",
    "house cleaning near me",
    "cleaning service bellevue",
    "house cleaning redmond",
    "cleaning service kirkland",
  ],
  openGraph: {
    title: "House Cleaning Seattle | Book Online | CLEENLY",
    description:
      "Book house cleaning in Seattle. See your price upfront, pick a time, done.",
    type: "website",
    url: "https://cleenly.app",
    locale: "en_US",
    siteName: "CLEENLY",
  },
  twitter: {
    card: "summary_large_image",
    title: "House Cleaning Seattle | Book Online | CLEENLY",
    description:
      "Book house cleaning in Seattle. See your price upfront, pick a time, done.",
  },
  other: {
    "geo.region": "US-WA",
    "geo.placename": "Seattle",
    "geo.position": "47.6062;-122.3321",
    ICBM: "47.6062, -122.3321",
  },
  alternates: {
    canonical: "https://cleenly.app",
  },
};

export default function HomePage() {
  const seattle = cities.find(c => c.slug === 'seattle')!;
  const localBusinessSchema = generateLocalBusinessSchema(seattle);
  const faqSchema = generateFAQSchema([
    { question: "How much does house cleaning cost in Seattle?", answer: "For a 2-bedroom home: $100-$200 regular, $150-$300 deep, $200-$400 move-out. Exact price depends on home size and condition." },
    { question: "Are your cleaners insured?", answer: "Yes — our cleaners carry liability insurance." },
    { question: "What if I'm not happy with the clean?", answer: "Tell us within 24 hours and we come back to fix it. No charge." }
  ]);

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />
      <Hero />
      <HowItWorks />
      <TrustStrip />
      <PricingSection />
      <WhyUs />
      <FAQ />
      <ServiceAreas />
      <CTA />
    </>
  );
}
