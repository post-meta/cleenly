import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "Booking Paused | CLEENLY",
  description:
    "CLEENLY is not accepting new bookings right now. We'll be back soon.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://cleenly.app/book",
  },
};

export default function BookPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <Container size="narrow">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl text-foreground">
              Booking is{" "}
              <em className="italic text-foreground-soft">paused</em>
            </h1>
            <p className="mt-6 text-foreground-soft md:text-lg">
              We&apos;re not taking new clients right now.
            </p>
            <p className="mt-3 text-foreground-soft md:text-lg">
              We&apos;ll be back soon. Thank you for your patience.
            </p>
            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-foreground-soft"
              >
                Back to home
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
