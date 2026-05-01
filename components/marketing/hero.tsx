import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_SMS_HREF, PHONE_TEL_HREF } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          House cleaning in Greater Seattle
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          See your price online. Pick a time. We bring our own supplies.
          <br />
          No memberships. No hidden fees.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/book">See my price now</Link>
          </Button>

          <Button size="lg" variant="secondary" asChild>
            <a href={PHONE_SMS_HREF}>Questions? Text us →</a>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
          <span>Exact price upfront</span>
          <span>Book in 2 minutes</span>
          <a href={PHONE_TEL_HREF} className="font-medium text-foreground hover:underline">
            Or call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
