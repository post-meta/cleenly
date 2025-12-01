import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQCategory } from "@/components/marketing/faq-accordion";
import { faqCategories, getAllFAQItems } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "House Cleaning FAQ Seattle | Common Questions | CLEENLY",
  description:
    "Answers to common questions about house cleaning in Seattle. Pricing, what's included, booking, cancellation, and more. Find your answer in seconds.",
  keywords: [
    "house cleaning faq",
    "cleaning service questions seattle",
    "house cleaning questions",
    "how much does house cleaning cost in seattle",
    "what is included in deep cleaning",
    "how do i book a house cleaner",
    "can i cancel my cleaning appointment",
    "do i need to be home for house cleaning",
    "how long does house cleaning take",
    "do cleaners bring their own supplies",
    "how much to tip house cleaner",
  ],
  openGraph: {
    title: "House Cleaning FAQ Seattle | CLEENLY",
    description:
      "Answers to common questions about house cleaning in Seattle. Pricing, what's included, booking, and more.",
    type: "website",
    url: "https://cleenly.com/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "House Cleaning FAQ Seattle | CLEENLY",
    description: "Answers to common questions about house cleaning in Seattle.",
  },
  alternates: {
    canonical: "https://cleenly.com/faq",
  },
};

// Generate FAQPage schema with all questions
function generateFAQSchema() {
  const allItems = getAllFAQItems();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

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
      name: "FAQ",
      item: "https://cleenly.com/faq",
    },
  ],
};

export default function FAQPage() {
  const faqSchema = generateFAQSchema();

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12 md:py-16">
          <Container>
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>FAQ</span>
            </nav>

            {/* Header */}
            <div className="mb-12 max-w-2xl">
              <h1 className="text-3xl font-bold md:text-4xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Quick answers to common questions about booking house cleaning in
                Seattle. Can&apos;t find what you&apos;re looking for? Email us at{" "}
                <a
                  href="mailto:hello@cleenly.com"
                  className="text-foreground underline"
                >
                  hello@cleenly.com
                </a>
              </p>
            </div>

            {/* Category Navigation */}
            <nav className="mb-12 flex flex-wrap gap-2">
              {faqCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  {category.title}
                </a>
              ))}
            </nav>

            {/* FAQ Categories */}
            <div className="space-y-12">
              {faqCategories.map((category) => (
                <div key={category.id} id={category.id}>
                  <FAQCategory title={category.title} items={category.items} />
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <section className="mt-16 rounded-2xl bg-muted/50 p-8 text-center md:p-12">
              <h2 className="text-2xl font-semibold">Still have questions?</h2>
              <p className="mt-3 text-muted-foreground">
                We&apos;re here to help. Get in touch and we&apos;ll respond within 2
                hours.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:hello@cleenly.com"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-medium transition-colors hover:bg-muted"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  hello@cleenly.com
                </a>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  Book a Cleaning
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </section>

            {/* Quick Links */}
            <section className="mt-12 border-t border-border pt-12">
              <h2 className="text-lg font-semibold">Quick Links</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  View Pricing
                </Link>
                <Link
                  href="/book"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Book Online
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  How It Works
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  About CLEENLY
                </Link>
              </div>
            </section>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}
