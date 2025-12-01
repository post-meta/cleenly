import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import { PricingTables } from "@/components/marketing/pricing-tables";
import { PricingFactors } from "@/components/marketing/pricing-factors";
import { PricingChecklists } from "@/components/marketing/pricing-checklists";
import { PricingFAQ } from "@/components/marketing/pricing-faq";

export const metadata: Metadata = {
  title: "House Cleaning Prices Seattle | $100-$350 | CLEENLY",
  description:
    "Seattle house cleaning prices: Regular cleaning $100-$200, Deep cleaning $150-$300, Move-out $200-$400. See what's included. Get your exact price in 30 seconds.",
  keywords: [
    "house cleaning prices seattle",
    "cleaning service cost seattle",
    "how much house cleaning seattle",
    "deep cleaning cost seattle",
    "move out cleaning price seattle",
    "maid service rates seattle",
  ],
  openGraph: {
    title: "House Cleaning Prices Seattle | CLEENLY",
    description:
      "Seattle house cleaning prices: Regular $100-$200, Deep $150-$300, Move-out $200-$400. Get your exact price.",
    type: "website",
    url: "https://cleenly.com/pricing",
  },
  alternates: {
    canonical: "https://cleenly.com/pricing",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "House Cleaning",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://cleenly.com/#LocalBusiness",
    name: "CLEENLY",
  },
  areaServed: {
    "@type": "City",
    name: "Seattle",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Regular Cleaning",
        description:
          "Routine house cleaning including dusting, vacuuming, mopping, bathroom and kitchen cleaning",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "100-200",
          priceCurrency: "USD",
          unitText: "per cleaning",
        },
      },
      {
        "@type": "Offer",
        name: "Deep Cleaning",
        description:
          "Thorough cleaning including inside appliances, baseboards, and hard-to-reach areas",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "150-300",
          priceCurrency: "USD",
          unitText: "per cleaning",
        },
      },
      {
        "@type": "Offer",
        name: "Move-Out Cleaning",
        description:
          "Complete cleaning to landlord standards for security deposit return",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "200-400",
          priceCurrency: "USD",
          unitText: "per cleaning",
        },
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does house cleaning cost in Seattle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "House cleaning in Seattle costs $100-$400 depending on home size and cleaning type. Regular cleaning: $100-$200. Deep cleaning: $150-$300. Move-out cleaning: $200-$400.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in regular house cleaning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Regular cleaning includes: dusting all surfaces, vacuuming carpets and floors, mopping hard floors, cleaning bathrooms (toilet, shower, sink, mirrors), wiping kitchen surfaces and appliances (exterior), and emptying trash.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in deep cleaning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deep cleaning includes everything in regular cleaning plus: inside oven and refrigerator, inside microwave, baseboards, window sills, ceiling fans, light fixtures, cabinet fronts, door frames, and behind furniture.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in move-out cleaning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Move-out cleaning includes deep cleaning plus: inside all cabinets and closets, inside all appliances, window tracks, light switch plates, walls spot-cleaned, and garage sweep (if applicable). Designed to meet landlord inspection standards.",
      },
    },
    {
      "@type": "Question",
      name: "Do you charge hourly or flat rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We charge flat rates based on your home size and cleaning type. You see the exact price before booking. No hourly surprises.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any hidden fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No hidden fees. The price you see at booking is the price you pay. We may suggest add-ons (like inside fridge or oven) but you decide what's included.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://cleenly.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: "https://cleenly.com/pricing",
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="py-16 md:py-24">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Pricing</span>
          </nav>

          {/* Hero / Intro - Optimized for LLM extraction */}
          <div className="max-w-3xl">
            <h1>House Cleaning Prices in Seattle</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              House cleaning in Seattle costs $100-$400 depending on your home
              size and cleaning type. Regular cleaning for a 2-3 bedroom home
              runs $120-$180. Deep cleaning costs $180-$280. Move-out cleaning
              ranges from $250-$400. Below you&apos;ll find detailed pricing by
              service type and what&apos;s included in each.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/book">Get Your Exact Price</Link>
              </Button>
            </div>
          </div>

          {/* Pricing Tables */}
          <PricingTables />

          {/* What Affects Your Price */}
          <PricingFactors />

          {/* What's Included */}
          <PricingChecklists />

          {/* Pricing FAQ */}
          <PricingFAQ />

          {/* CTA Section */}
          <section className="mt-20 rounded-lg bg-muted/50 p-8 text-center md:p-12">
            <h2>Get Your Exact Price</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Price depends on your specific home. Get your exact quote in about
              30 seconds — no account required.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/book">Calculate My Price</Link>
              </Button>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
