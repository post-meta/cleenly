import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="bg-foreground py-20 text-background md:py-28">
      <Container>
        <div className="text-center">
          <h2 className="text-background">Ready for a clean home?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-background/70">
            Get a quote in under a minute. No commitment until you book.
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
              asChild
            >
              <Link href="/book">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
