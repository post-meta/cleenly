import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "About CLEENLY | Seattle House Cleaning Booking Platform",
  description:
    "CLEENLY is a house cleaning booking platform in Seattle. We built it because booking cleaning shouldn't be complicated. See prices upfront, choose your cleaner, book in minutes.",
  keywords: [
    "cleenly about",
    "seattle cleaning service about",
    "house cleaning company seattle",
    "local cleaning service seattle",
    "cleaning booking platform",
  ],
  openGraph: {
    title: "About CLEENLY | Seattle House Cleaning Platform",
    description:
      "We built CLEENLY because booking cleaning shouldn't be this hard. See prices upfront, choose your cleaner, book in minutes.",
    type: "website",
    url: "https://cleenly.com/about",
  },
  alternates: {
    canonical: "https://cleenly.com/about",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://cleenly.com/#Organization",
  name: "CLEENLY",
  alternateName: "Cleenly",
  description:
    "House cleaning booking platform serving Seattle and Greater Eastside. Customers see prices upfront, choose cleaners, and book online.",
  url: "https://cleenly.com",
  logo: "https://cleenly.com/logo.png",
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
    email: "hello@cleenly.com",
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
      item: "https://cleenly.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: "https://cleenly.com/about",
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

          {/* Hero - Entity Definition for LLM */}
          <h1>About CLEENLY</h1>
          <div className="mt-8 space-y-4 text-lg text-muted-foreground">
            <p>
              CLEENLY is a house cleaning booking platform serving Seattle and
              the Greater Eastside. We connect customers with vetted cleaning
              professionals through a simple online booking system. You see the
              price before you book, choose your cleaner, and schedule in
              minutes.
            </p>
            <p>
              We&apos;re not a cleaning company. We&apos;re a platform that
              helps good cleaners find customers, and helps customers find
              reliable cleaning help.
            </p>
          </div>

          {/* Why We Built This */}
          <section className="mt-16">
            <h2>Why We Built This</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                We built CLEENLY because booking a cleaning shouldn&apos;t be
                this hard.
              </p>
              <p>Here&apos;s what we kept running into:</p>
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
                You book through a service and someone shows up. Maybe
                they&apos;re great. Maybe not. We wanted to know who we&apos;re
                letting into our home.
              </p>
              <p>
                <strong className="text-foreground">Phone tag to book.</strong>{" "}
                Calling, leaving messages, waiting for callbacks. In 2024. We
                wanted to book like we book everything else — online, in a few
                minutes.
              </p>
              <p>
                So we built what we wanted: a platform where you see prices
                upfront, choose the actual person coming to clean, and book
                without phone calls.
              </p>
              <p>
                That&apos;s it. Nothing revolutionary. Just booking a cleaning
                without the hassle.
              </p>
            </div>
          </section>

          {/* How CLEENLY Works */}
          <section className="mt-16">
            <h2>How CLEENLY Works</h2>

            <div className="mt-8">
              <h3 className="text-lg font-semibold">For Customers</h3>
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
                    — based on your home, not some made-up &quot;starting at&quot;
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>
                    <strong className="text-foreground">Browse cleaners</strong>{" "}
                    — profiles, reviews, photos of their work
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>
                    <strong className="text-foreground">Pick a time</strong> —
                    morning, afternoon, or evening
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">5.</span>
                  <span>
                    <strong className="text-foreground">Book</strong> —
                    confirmation and cleaner details sent to you
                  </span>
                </li>
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                Takes about 2 minutes. No account needed to see prices.
              </p>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold">For Cleaners</h3>
              <p className="mt-4 text-muted-foreground">
                CLEENLY helps independent cleaners and small cleaning businesses
                find customers without the marketing headache.
              </p>
              <p className="mt-3 text-muted-foreground">
                You set your availability. You set your rates. We send you
                customers. You keep most of what you earn — our platform fee is
                transparent and predictable.
              </p>
              <p className="mt-3 text-muted-foreground">
                No chasing leads. No competing on price against everyone else.
                Customers choose you based on your profile, reviews, and the
                work you show.
              </p>
            </div>
          </section>

          {/* Our Principles */}
          <section className="mt-16">
            <h2>Our Principles</h2>
            <p className="mt-4 text-muted-foreground">
              A few things we believe in:
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold">
                  Price on screen = price you pay
                </h3>
                <p className="mt-2 text-muted-foreground">
                  When you see $160, you pay $160. Not $160 &quot;starting
                  at&quot; that becomes $220 after mysterious add-ons. If
                  something changes the price (you want inside the oven cleaned,
                  home is bigger than expected), we tell you before you&apos;re
                  charged.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  You know who&apos;s coming
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Every cleaner on CLEENLY has a profile — photo, bio, reviews
                  from real customers. You&apos;re not getting &quot;a team
                  member.&quot; You&apos;re choosing a specific person to let
                  into your home.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Problems get fixed</h3>
                <p className="mt-2 text-muted-foreground">
                  Something&apos;s not right after a cleaning? Tell us within 24
                  hours. We&apos;ll send someone back to fix it. No
                  interrogation, no runaround. We&apos;d rather re-do a cleaning
                  than have you unhappy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Cleaners get paid fairly
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We take a platform fee to keep CLEENLY running. Cleaners keep
                  the majority of what you pay. We&apos;re transparent about the
                  split. Underpaid cleaners don&apos;t stick around, and we want
                  good people on the platform.
                </p>
              </div>
            </div>
          </section>

          {/* For Cleaners */}
          <section className="mt-16">
            <h2>For Cleaners</h2>
            <p className="mt-4 text-muted-foreground">
              If you&apos;re an independent cleaner or run a small cleaning
              business in the Seattle area, CLEENLY might be a good fit.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">What we offer:</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success">•</span>
                    Customers who&apos;ve already decided to book (not
                    &quot;leads&quot; to chase)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">•</span>
                    You set your rates and availability
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">•</span>
                    Your own profile where you can show off your work
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">•</span>
                    Transparent platform fee — you know what you&apos;re keeping
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success">•</span>
                    No competition to be the cheapest
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">What we look for:</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    Reliable, on-time, does good work
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    Background check passed
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    Liability insurance (we can help if you don&apos;t have it)
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    Available for at least 15 hours/week
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link href="/join">Apply to Join CLEENLY</Link>
              </Button>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-16">
            <h2>Contact</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Have questions? Running into an issue? Just want to say hi?
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:hello@cleenly.com"
                  className="text-foreground underline"
                >
                  hello@cleenly.com
                </a>
              </p>
              <p>
                For booking or account questions, email is fastest. We usually
                respond within a few hours during business days.
              </p>
              <p className="text-sm">
                We&apos;re a small team based in Seattle. We read every email.
              </p>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
