import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { JsonLd } from "@/components/shared/json-ld";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Book House Cleaning Seattle | Get Price in 30 Seconds",
  description:
    "Book house cleaning in Seattle. Enter your home details, see your price instantly, pick a time. No account required. Takes 2 minutes.",
  keywords: [
    "book cleaning seattle",
    "schedule house cleaning seattle",
    "cleaning appointment seattle",
    "book house cleaning online seattle",
    "schedule cleaning service near me",
    "get cleaning quote seattle",
  ],
  openGraph: {
    title: "Book House Cleaning Seattle | CLEENLY",
    description:
      "Book house cleaning in Seattle. See your price instantly, pick a time, confirm in minutes.",
    type: "website",
    url: "https://cleenly.com/book",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book House Cleaning Seattle | CLEENLY",
    description: "Book house cleaning in Seattle. See your price instantly.",
  },
  alternates: {
    canonical: "https://cleenly.com/book",
  },
};

const bookingPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Book House Cleaning Seattle",
  description:
    "Book house cleaning in Seattle. See your price, pick a time, confirm in minutes.",
  url: "https://cleenly.com/book",
  mainEntity: {
    "@type": "Service",
    name: "House Cleaning Booking",
    provider: {
      "@type": "LocalBusiness",
      "@id": "https://cleenly.com/#LocalBusiness",
    },
    areaServed: {
      "@type": "City",
      name: "Seattle",
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://cleenly.com/book",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Cleaning Appointment",
      },
    },
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
      name: "Book",
      item: "https://cleenly.com/book",
    },
  ],
};

export default async function BookPage() {
  const session = await auth();

  return (
    <>
      <JsonLd data={bookingPageSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <Container size="narrow">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>Book</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold md:text-4xl">Book Your Cleaning</h1>
              <p className="mt-2 text-muted-foreground">
                See your price in 30 seconds. No account required.
              </p>
            </div>

            {/* Booking Wizard */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                </div>
              }
            >
              <BookingWizard session={session} />
            </Suspense>
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
}
