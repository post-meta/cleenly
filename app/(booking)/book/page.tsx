import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BookingForm } from "@/components/booking/booking-form";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export const metadata = {
  title: "Book Cleaning — Cleenly",
  description: "Get a quote for house cleaning in Greater Seattle area.",
};

export default function BookPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <Container size="narrow">
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              &larr; Back to home
            </Link>
          </div>

          <div className="mb-10">
            <h1>Get a quote</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Fill in your details. See the price. Book when ready.
            </p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <BookingForm />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
