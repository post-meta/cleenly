import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

import { JsonLd } from "@/components/shared/json-ld";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { cleanerFAQItems } from "@/lib/cleaner-faq-data";

export const metadata: Metadata = {
  title: "Join CLEENLY | Cleaning Jobs Seattle | Get Customers Without Marketing",
  description:
    "Join CLEENLY as a cleaner. Get customers in Seattle without marketing. You set your rates and schedule. Background check required. Apply in 10 minutes.",
  keywords: [
    "cleaning jobs seattle",
    "house cleaning jobs near me",
    "become a cleaner seattle",
    "independent cleaner jobs",
    "cleaning business customers",
    "join cleaning platform",
    "how to get house cleaning customers",
    "cleaning jobs with flexible schedule",
  ],
  openGraph: {
    title: "Join CLEENLY | Cleaning Jobs Seattle",
    description:
      "Get cleaning customers without marketing. Set your own rates and schedule.",
    type: "website",
    url: "https://cleenly.com/join",
  },
  alternates: {
    canonical: "https://cleenly.com/join",
  },
};

const jobPostingSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Independent House Cleaner",
  description:
    "Join CLEENLY as an independent cleaner. Set your own rates, choose your schedule, get customers without marketing.",
  hiringOrganization: {
    "@type": "Organization",
    name: "CLEENLY",
    sameAs: "https://cleenly.com",
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
  jobBenefits: "Flexible schedule, set your own rates, no marketing needed",
  baseSalary: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: 25,
      maxValue: 45,
      unitText: "HOUR",
    },
  },
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
      item: "https://cleenly.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Join as Cleaner",
      item: "https://cleenly.com/join",
    },
  ],
};

const steps = [
  {
    number: "1",
    title: "Apply",
    description:
      "Fill out a short application. Tell us about your experience, availability, and the areas you serve. Takes about 10 minutes.",
  },
  {
    number: "2",
    title: "Get Verified",
    description:
      "Complete a background check and verify your identity. We also check references. This protects you and our customers.",
  },
  {
    number: "3",
    title: "Set Up Your Profile",
    description:
      "Add your photo, bio, and photos of your work. Set your rates and availability. Your profile is how customers choose you.",
  },
  {
    number: "4",
    title: "Start Getting Bookings",
    description:
      "Customers browse profiles and book directly with you. You accept jobs that fit your schedule. No bidding, no competing on price.",
  },
  {
    number: "5",
    title: "Get Paid",
    description:
      "Customers pay through CLEENLY. You get paid within 2-3 days after each job. Direct deposit to your bank account.",
  },
];

const benefits = [
  {
    title: "You Set Your Rates",
    description:
      'No race to the bottom. You decide what you charge. Customers see your rates upfront and book if it works for them. No haggling, no "can you do it for less?"',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Customers Come to You",
    description:
      "Stop spending money on ads. Stop paying for leads that go nowhere. Customers find you on CLEENLY, see your work, read your reviews, and book.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Flexible Schedule",
    description:
      "Work when you want. Set your availability in the app. Take a week off, block out mornings, only work weekends — your choice.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Guaranteed Payment",
    description:
      "No more chasing payments. Customers pay through the platform before you start. Money is released to you after the job. Direct deposit in 2-3 business days.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Fair Commission",
    description:
      "We take 15% — that's it. No hidden fees, no monthly charges, no surprise deductions. Compare that to Thumbtack's 15-30% or agencies that take 40%+.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Build Your Reputation",
    description:
      "Every good job builds your profile. Customers leave reviews. Good reviews = more bookings = higher rates over time. Your reputation is yours.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "Support When You Need It",
    description:
      "Customer being difficult? Payment issue? Question about a booking? We're here. Real people who respond quickly. We've got your back.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
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
    "Your own cleaning supplies and equipment",
    "Liability insurance (we can help if you don't have it)",
    "Experience with deep cleaning or move-out cleaning",
    "Bilingual (Spanish, Ukrainian, Russian, Chinese)",
  ],
  notRequired: [
    "Business license (you're an independent contractor)",
    "Previous platform experience",
    "Expensive equipment (basic supplies work)",
  ],
};

const testimonials = [
  {
    quote:
      "I was spending $200/month on Thumbtack leads and getting maybe 2-3 actual jobs. On CLEENLY, customers book me directly. No wasted money on leads that don't convert.",
    name: "Maria",
    location: "Seattle",
  },
  {
    quote:
      "I set my own schedule. I take my kid to school, work 10-4, and I'm home for dinner. Try doing that with a cleaning company.",
    name: "Jennifer",
    location: "Bellevue",
  },
  {
    quote:
      "The payment is always on time. I don't chase customers for money anymore. Clean, get paid, done.",
    name: "Alex",
    location: "Renton",
  },
];

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
              Get Cleaning Customers Without the Marketing Headache
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Join CLEENLY. Customers find you. You set your rates. We handle
              the rest.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Seattle & Eastside area
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Average $25-40/hour
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
                <Link href="/join/apply">Apply Now — Takes 10 Minutes</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free to join. No monthly fees. You only pay when you get paid.
            </p>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            How CLEENLY Works for Cleaners
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-5">
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
            Why Cleaners Choose CLEENLY
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

      {/* What You Keep */}
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            What You Keep
          </h2>
          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-8">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Customer pays</span>
                <span className="text-2xl font-bold">$180</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">CLEENLY fee (15%)</span>
                <span className="text-lg text-muted-foreground">-$27</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold">You keep</span>
                <span className="text-3xl font-bold text-success">$153</span>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              That&apos;s it. No other fees. No monthly subscription. No lead
              fees.
            </p>
          </div>
          <div className="mt-8 rounded-lg bg-muted/50 p-6">
            <h3 className="font-semibold">Compare to other platforms:</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Thumbtack:</strong> Pay $15-30 just to respond to a
                lead (no guarantee of booking)
              </li>
              <li>
                • <strong>Care.com:</strong> Monthly subscription + per-lead
                fees
              </li>
              <li>
                • <strong>Agencies:</strong> They keep 40-50% of what customers
                pay
              </li>
            </ul>
            <p className="mt-4 font-medium">
              On CLEENLY: No upfront costs. You only pay when you actually get
              paid.
            </p>
          </div>
        </Container>
      </section>

      {/* Requirements */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            What We Look For
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
                Nice to Have
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
                Not Required
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

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            What Cleaners Say
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-xl border border-border bg-muted/30 p-6"
              >
                <svg
                  className="h-8 w-8 text-muted-foreground/50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="mt-4 text-muted-foreground">
                  {testimonial.quote}
                </p>
                <p className="mt-4 font-medium">
                  — {testimonial.name}, {testimonial.location}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container size="narrow">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Common Questions from Cleaners
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
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Join?</h2>
            <p className="mt-4 text-background/80">
              Apply now. It takes about 10 minutes. We&apos;ll review your
              application and get back to you within 2-3 business days.
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
                <Link href="/join/apply">Start Application →</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-background/60">
              Questions? Email us at{" "}
              <a
                href="mailto:cleaners@cleenly.com"
                className="underline hover:text-background"
              >
                cleaners@cleenly.com
              </a>
            </p>
          </div>
        </Container>
      </section>

      {/* Equal Opportunity */}
      <section className="border-t border-border py-8">
        <Container>
          <p className="text-center text-sm text-muted-foreground">
            CLEENLY is an equal opportunity platform. We welcome cleaners of
            all backgrounds. We do not discriminate based on race, gender,
            religion, national origin, or any other protected status.
          </p>
        </Container>
      </section>
    </>
  );
}
