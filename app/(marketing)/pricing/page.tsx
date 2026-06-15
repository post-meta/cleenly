import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import { PricingTables } from "@/components/marketing/pricing-tables";
import { PricingFactors } from "@/components/marketing/pricing-factors";
import { PricingChecklists } from "@/components/marketing/pricing-checklists";
import { PricingFAQ } from "@/components/marketing/pricing-faq";
import { PRICE_DISPLAY } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "House Cleaning Prices Seattle | From $185 | CLEENLY",
  description:
    "Seattle house cleaning prices: first/deep clean $290–650 for most homes, move-out $585–885, recurring from $185. Upfront estimate, billed by the hour at $75/cleaner-hour. Get your price in 30 seconds.",
  keywords: [
    "house cleaning prices seattle",
    "cleaning service cost seattle",
    "how much house cleaning seattle",
    "deep cleaning cost seattle",
    "move out cleaning price seattle",
    "house cleaning rates seattle",
  ],
  openGraph: {
    title: "House Cleaning Prices Seattle | CLEENLY",
    description:
      "Seattle house cleaning prices: first/deep clean $290–650, move-out $585–885, recurring from $185. Upfront estimate, billed by the hour. Get your price.",
    type: "website",
    url: "https://cleenly.app/pricing",
  },
  alternates: {
    canonical: "https://cleenly.app/pricing",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "House Cleaning",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://cleenly.app/#LocalBusiness",
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
        name: "First / Deep Cleaning",
        description:
          "Thorough first or deep cleaning including inside appliances, baseboards, and hard-to-reach areas. Upfront estimate; final price billed by the hour at $75 per cleaner-hour.",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "290-1120",
          priceCurrency: "USD",
          unitText: "estimate, billed hourly at $75/cleaner-hour",
        },
      },
      {
        "@type": "Offer",
        name: "Recurring Cleaning",
        description:
          "Ongoing maintenance cleaning from visit two onward. Upfront estimate; final price billed by the hour at $75 per cleaner-hour.",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "185-305",
          priceCurrency: "USD",
          unitText: "estimate, billed hourly at $75/cleaner-hour",
        },
      },
      {
        "@type": "Offer",
        name: "Move-Out Cleaning",
        description:
          "Complete cleaning to landlord standards for security deposit return. Upfront estimate; final price billed by the hour at $75 per cleaner-hour.",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "380-1295",
          priceCurrency: "USD",
          unitText: "estimate, billed hourly at $75/cleaner-hour",
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
        text: "House cleaning in Seattle costs from $185 depending on home size and cleaning type. A first or deep clean runs $290–350 for a 1-bed up to $935–1,120 for a 5+ bed. Move-out cleaning runs $380–455 up to $1,080–1,295. Recurring maintenance starts at $185. You see an upfront estimate; the final price is billed by the hour at $75 per cleaner-hour ($185 minimum) and confirmed before charging.",
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
        text: "You see an upfront estimate range based on your home size and cleaning type. The final price is billed by the hour — $75 per cleaner-hour, $185 minimum — for the actual time your home takes, and we confirm it with you before charging. The estimate is what we expect the final to be.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any hidden fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No hidden fees. We bill the actual cleaner-hours worked at $75 per cleaner-hour, never more than what the work takes, and we confirm the final price before charging. We may suggest add-ons (like inside fridge or oven) but you decide what's included.",
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
      item: "https://cleenly.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Pricing",
      item: "https://cleenly.app/pricing",
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
            <h1 className="font-display font-normal text-[44px] md:text-[56px] leading-[1.1] tracking-[-0.02em] text-foreground">
              House Cleaning <em className="italic text-foreground-soft font-display">Prices</em> in Seattle
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              House cleaning in Seattle starts at ${PRICE_DISPLAY.minJob}. A
              first or deep clean for a 2-3 bedroom home runs{" "}
              {PRICE_DISPLAY.firstClean.bySize["2"]} to{" "}
              {PRICE_DISPLAY.firstClean.bySize["3"]}. Move-out cleaning for the
              same home runs {PRICE_DISPLAY.moveOut.bySize["2"]} to{" "}
              {PRICE_DISPLAY.moveOut.bySize["3"]}. Recurring maintenance starts
              at {PRICE_DISPLAY.recurring.bySize["1"]}. You see an upfront
              estimate; the final price is billed by the hour — $
              {PRICE_DISPLAY.ratePerCleanerHour} per cleaner-hour, $
              {PRICE_DISPLAY.minJob} minimum — and confirmed with you before
              charging. Below you&apos;ll find detailed pricing by service type
              and what&apos;s included in each.
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
            <h2 className="font-display font-normal text-[32px] md:text-[40px] tracking-[-0.015em] text-foreground mb-4">
              Get Your <em className="italic text-foreground-soft font-display font-normal">Exact Price</em>
            </h2>
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
