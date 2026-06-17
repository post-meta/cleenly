import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "About CLEENLY | Greater Seattle House Cleaning",
  description:
    "CLEENLY is a small house cleaning team serving Greater Seattle. We built a simpler way to book — see your price online, pick a time, done.",
  keywords: [
    "cleenly about",
    "seattle house cleaning company",
    "local cleaning service seattle",
    "greater seattle cleaning",
  ],
  openGraph: {
    title: "About CLEENLY | Greater Seattle House Cleaning",
    description:
      "We built CLEENLY because booking cleaning shouldn't be this hard. See your price online and book in minutes.",
    type: "website",
    url: "https://cleenly.app/about",
  },
  alternates: {
    canonical: "https://cleenly.app/about",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://cleenly.app/#Organization",
  name: "CLEENLY",
  alternateName: "Cleenly",
  description:
    "House cleaning company serving Greater Seattle. Customers see their price online and book in minutes.",
  url: "https://cleenly.app",
  logo: "https://cleenly.app/logo.png",
  foundingDate: "2024",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Seattle",
      addressRegion: "WA",
      addressCountry: "US",
    },
  },
  areaServed: {
    "@type": "State",
    name: "Washington",
  },
  knowsAbout: [
    "House Cleaning",
    "Deep Cleaning",
    "Move-Out Cleaning",
    "Cleaning Services",
    "Home Services",
  ],
  slogan: "We clean. You live.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@cleenly.app",
    availableLanguage: ["English"],
  },
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
      name: "About",
      item: "https://cleenly.app/about",
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="py-16 md:py-24">
        <Container size="narrow">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>About</span>
          </nav>

          {/* Hero image */}
          <div className="mb-12 overflow-hidden rounded-2xl bg-muted shadow-sm">
            <Image
              src="/lifestyle-living-1.jpg"
              alt="A calm clean living room with a single mug on the coffee table and soft daylight"
              width={1000}
              height={562}
              priority
              className="w-full h-auto object-cover aspect-[16/9]"
            />
          </div>

          {/* Hero */}
          <h1 className="font-display font-normal text-[44px] md:text-[56px] leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
            About <em className="italic text-foreground-soft font-display">CLEENLY</em>
          </h1>
          <div className="mt-8 space-y-4 text-lg text-muted-foreground">
            <p>
              CLEENLY is a small house cleaning team serving Greater Seattle.
              We built a simpler way to book a clean — you see your price
              online, pick a time, and we show up.
            </p>
            <p>
              We do the cleaning ourselves and bring in extra cleaners as
              needed when the schedule gets full. Either way, you&apos;re
              booking CLEENLY.
            </p>
          </div>

          {/* Why We Built This */}
          <section className="mt-16">
            <h2 className="font-display font-normal text-[32px] md:text-[40px] tracking-[-0.015em] text-foreground mb-6">
              Why we <em className="italic text-foreground-soft font-display font-normal">built this</em>
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                We built CLEENLY because booking a cleaning shouldn&apos;t be
                this hard.
              </p>
              <p>Here&apos;s what kept getting in the way:</p>
              <p>
                <strong className="text-foreground">
                  &quot;Starting at $99&quot; that turned into $180.
                </strong>{" "}
                Prices on websites that meant nothing once you actually tried to
                book. We wanted to see the real price before committing.
              </p>
              <p>
                <strong className="text-foreground">
                  No idea who&apos;s coming.
                </strong>{" "}
                You book through a service and someone different shows up every
                time. We wanted consistency — the same team in your home as
                often as possible.
              </p>
              <p>
                <strong className="text-foreground">Phone tag to book.</strong>{" "}
                Calling, leaving messages, waiting for callbacks. We wanted to
                book like we book everything else — online, in a few minutes.
              </p>
              <p>
                So we built what we wanted: an honest price online, a real time
                slot, and people who actually show up to clean.
              </p>
            </div>
          </section>

          {/* How CLEENLY Works */}
          <section className="mt-16">
            <h2 className="font-display font-normal text-[32px] md:text-[40px] tracking-[-0.015em] text-foreground mb-6">
              How it <em className="italic text-foreground-soft font-display font-normal">works</em>
            </h2>

            <div className="mt-8">
              <ol className="mt-4 space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>
                    <strong className="text-foreground">
                      Tell us about your place
                    </strong>{" "}
                    — bedrooms, bathrooms, type of cleaning
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>
                    <strong className="text-foreground">
                      See your price range
                    </strong>{" "}
                    — based on your home, not a generic &quot;starting at&quot;
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>
                    <strong className="text-foreground">Pick a time</strong> —
                    morning or afternoon
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>
                    <strong className="text-foreground">We clean</strong> —
                    we bring our own supplies and equipment
                  </span>
                </li>
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                Takes about 2 minutes to book. No account needed to see prices.
              </p>
            </div>
          </section>

          {/* Our Principles */}
          <section className="mt-16">
            <h2 className="font-display font-normal text-[32px] md:text-[40px] tracking-[-0.015em] text-foreground mb-6">
              Our <em className="italic text-foreground-soft font-display font-normal">principles</em>
            </h2>
            <p className="mt-4 text-muted-foreground">
              A few things we believe in:
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold">
                  An honest estimate, confirmed before you&apos;re charged
                </h3>
                <p className="mt-2 text-muted-foreground">
                  You see a real price range before you book — based on your
                  home, not a teaser. The final price is billed by the hour and
                  we confirm it with you before charging. If something changes it
                  (you want inside the oven cleaned, the home is bigger than
                  described), we tell you before, never after.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Same team when we can
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We try to send you the same cleaner every time — that&apos;s
                  how cleanings get faster and better. On busy weeks we may
                  send a teammate. If you&apos;ve booked recurring service,
                  we&apos;ll always tell you in advance who&apos;s coming.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Problems get fixed</h3>
                <p className="mt-2 text-muted-foreground">
                  Something&apos;s not right after a cleaning? Tell us within 24
                  hours. We&apos;ll come back to fix it. No interrogation, no
                  runaround.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  We&apos;re a small team
                </h3>
                <p className="mt-2 text-muted-foreground">
                  CLEENLY is run by a small group based in Greater Seattle. When
                  the schedule fills up, we bring in extra cleaners we trust to
                  cover the load. Either way, you&apos;re working with us — not
                  a marketplace, not an algorithm matching you to a stranger.
                </p>
              </div>
            </div>
          </section>

          {/* Cleaner recruitment teaser */}
          <section className="mt-16">
            <h2 className="font-display font-normal text-[32px] md:text-[40px] tracking-[-0.015em] text-foreground mb-6">
              Want to <em className="italic text-foreground-soft font-display font-normal">clean with us?</em>
            </h2>
            <p className="mt-4 text-muted-foreground">
              We&apos;re always interested in hearing from reliable cleaners in
              the Greater Seattle area. If you do good work and want steady
              hours, get in touch.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/join">Apply to join our team</Link>
              </Button>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-16">
            <h2 className="font-display font-normal text-[32px] md:text-[40px] tracking-[-0.015em] text-foreground mb-6">
              Get in <em className="italic text-foreground-soft font-display font-normal">touch</em>
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Have questions? Running into an issue? Just want to say hi?
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:hello@cleenly.app"
                  className="text-foreground underline"
                >
                  hello@cleenly.app
                </a>
              </p>
              <p>
                For booking or account questions, email is fastest. We usually
                respond within a few hours during business days.
              </p>
              <p className="text-sm">
                We&apos;re a small team based in Greater Seattle. We read every
                email.
              </p>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
