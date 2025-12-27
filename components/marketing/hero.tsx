import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="hero py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          House Cleaning in Seattle — From $100
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          See your price in 30 seconds. Pick a time. Done.
          <br />
          No hidden fees. No phone calls. No BS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/book">See My Price Now</Link>
          </Button>

          <Button size="lg" variant="secondary" asChild>
            <a href="sms:+12065550199">Questions? Text us →</a>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
          <span>✓ Exact price upfront</span>
          <span>✓ Book in 2 minutes</span>
        </div>
      </div>
    </section>
  );
}

