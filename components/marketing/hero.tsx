import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="max-w-3xl">
          {/* H1 for SEO - primary keyword */}
          <h1 className="text-foreground">
            House Cleaning in Seattle — Book Online in Minutes
          </h1>
          <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
            See your price upfront. Choose your cleaner. Schedule when it works
            for you.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/book">Get Your Price</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              No hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Vetted cleaners
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              24-hour rebook guarantee
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
