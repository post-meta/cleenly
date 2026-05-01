import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

import { JsonLd } from "@/components/shared/json-ld";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { cleanerFAQItems } from "@/lib/cleaner-faq-data";

export const metadata: Metadata = {
  title: "Cleaning jobs in Greater Seattle | Join CLEENLY",
  description:
    "Join the CLEENLY cleaning team in Greater Seattle. 1099 contractor work with steady bookings, flexible scheduling, and a small team that has your back.",
  keywords: [
    "cleaning jobs seattle",
    "house cleaning jobs near me",
    "cleaning team seattle",
    "1099 cleaning contractor",
    "cleaning jobs with flexible schedule",
    "cleaning jobs greater seattle",
  ],
  openGraph: {
    title: "Cleaning jobs in Greater Seattle | Join CLEENLY",
    description:
      "Join the CLEENLY cleaning team. Steady bookings, flexible schedule, real support.",
    type: "website",
    url: "https://cleenly.app/join",
  },
  alternates: {
    canonical: "https://cleenly.app/join",
  },
};

const jobPostingSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "House Cleaner",
  description:
    "Join the CLEENLY cleaning team. 1099 contractor role with steady bookings and flexible scheduling in Greater Seattle.",
  hiringOrganization: {
    "@type": "Organization",
    name: "CLEENLY",
    sameAs: "https://cleenly.app",
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Seattle",
      addressRegion: "WA",
      addressCountry: "US",
    },
  },
  employmentType: "CONTRACTOR",
  workHours: "Flexible",
  jobBenefits: "Flexible schedule, steady bookings, real support",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: cleanerFAQItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
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
      name: "Join Our Team",
      item: "https://cleenly.app/join",
    },
  ],
};

const steps = [
  {
    number: "1",
    title: "Apply",
    description:
      "Fill out a short application — experience, availability, and the areas you can cover. Takes about 10 minutes.",
  },
  {
    number: "2",
    title: "Interview",
    description:
      "We talk through pay, schedule, and how we work. You ask questions. We answer.",
  },
  {
    number: "3",
    title: "Background check",
    description:
      "Standard third-party check. Takes 2-5 business days. Required to clean in homes.",
  },
  {
    number: "4",
    title: "Start cleaning",
    description:
      "We add you to bookings as the schedule allows. Hours ramp up as you build a track record with us.",
  },
];

const benefits = [
  {
    title: "Steady bookings",
    description:
      "We bring you the work — you don't pay for leads, run ads, or chase customers. When the schedule is full, you have hours.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Flexible schedule",
    description:
      "Tell us your availability — we work around it. Take a week off, block out mornings, only work weekends — your choice.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Pay on time",
    description:
      "Customers pay through us before the job is scheduled. You get paid within 2-3 business days after each clean. No chasing customers for money.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Supplies provided",
    description:
      "We bring the supplies — vacuum, microfiber cloths, products, the works. You bring your hands.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Real support",
    description:
      "Customer being difficult? Issue with a booking? We pick up the phone. We don't leave cleaners stuck in awkward situations.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5m2 8l-2 2m4 4a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
  },
  {
    title: "A small team",
    description:
      "CLEENLY is run by a couple based in Greater Seattle. You're working with people, not an algorithm. We know your name.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

const requirements = {
  required: [
    "Cleaning experience (professional or residential)",
    "Reliable transportation",
    "Smartphone with data plan",
    "Pass background check",
    "Legal right to work in the US",
    "Available at least 15 hours per week",
    "Serve Seattle metro area or Eastside",
  ],
  niceToHave: [
    "Liability insurance (we can help if you don't have it)",
    "Experience with deep cleaning or move-out cleaning",
    "Bilingual (Spanish, Ukrainian, Russian, Chinese)",
    "References we can call",
  ],
  notRequired: [
    "Business license (you're a 1099 contractor)",
    "Your own cleaning supplies (we provide them)",
    "Previous gig-platform experience",
  ],
};

export default function JoinPage() {
  return (
    <>
      <JsonLd data={jobPostingSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold md:text-5xl">
              Cleaning jobs in Greater Seattle
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Join the CLEENLY cleaning team. We bring you steady bookings.
              You bring your hands. Supplies are on us.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Seattle &amp; Eastside
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                1099 contractor
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Flexible schedule
              </span>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="text-lg">
                <Link href="/join/apply">Apply now — takes 10 minutes</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free to apply. No fees, no subscriptions.
            </p>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-6 hidden h-0.5 w-full bg-border md:block" />
                )}
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            What we offer
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-border bg-background p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            What we look for
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="flex items-center gap-2 font-semibold text-success">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Required
              </h3>
              <ul className="mt-4 space-y-2">
                {requirements.required.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-success">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Nice to have
              </h3>
              <ul className="mt-4 space-y-2">
                {requirements.niceToHave.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span>○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="flex items-center gap-2 font-semibold text-muted-foreground">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Not required
              </h3>
              <ul className="mt-4 space-y-2">
                {requirements.notRequired.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span>-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container size="narrow">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Common questions
          </h2>
          <div className="mt-12">
            <FAQAccordion items={cleanerFAQItems} />
          </div>
        </Container>
      </section>

      {/* Application CTA */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="rounded-2xl bg-foreground p-8 text-center text-background md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to apply?</h2>
            <p className="mt-4 text-background/80">
              Takes about 10 minutes. We&apos;ll review and get back to you
              within 2-3 business days.
            </p>
            <div className="mt-6 rounded-lg bg-background/10 p-4 text-left text-sm">
              <p className="font-medium text-background">
                What you&apos;ll need:
              </p>
              <ul className="mt-2 space-y-1 text-background/80">
                <li>• Basic info (name, contact, location)</li>
                <li>• Work experience summary</li>
                <li>• Availability (days/times you can work)</li>
                <li>• Areas you can serve</li>
                <li>• Consent for background check</li>
              </ul>
            </div>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/join/apply">Start application →</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-background/60">
              Questions? Email us at{" "}
              <a
                href="mailto:cleaners@cleenly.app"
                className="underline hover:text-background"
              >
                cleaners@cleenly.app
              </a>
            </p>
          </div>
        </Container>
      </section>

      {/* Equal Opportunity */}
      <section className="border-t border-border py-8">
        <Container>
          <p className="text-center text-sm text-muted-foreground">
            CLEENLY is an equal-opportunity employer. We welcome applicants of
            all backgrounds. We do not discriminate based on race, gender,
            religion, national origin, or any other protected status.
          </p>
        </Container>
      </section>
    </>
  );
}
