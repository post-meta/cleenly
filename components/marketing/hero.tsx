import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-foreground">We clean. You live.</h1>
          <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
            Cleaning in Seattle. Pick a cleaner, see the price, book online.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/book">Get a Quote</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
