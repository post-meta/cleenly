import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_SMS_HREF, PHONE_TEL_HREF } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: lifestyle image */}
          <div className="w-full">
            <img
              src="/hero-image.jpg"
              alt="A calm clean kitchen with morning light, a single ceramic mug on the counter"
              className="w-full h-auto rounded-2xl object-cover aspect-[4/3] shadow-sm"
              loading="eager"
            />
          </div>

          {/* Right: text */}
          <div className="space-y-6 text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              House cleaning in Greater Seattle.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              See your price online. Pick a time. We bring our own supplies. No memberships, no hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link href="/book">See my price now</Link>
              </Button>

              <Button size="lg" variant="secondary" asChild>
                <a href={PHONE_SMS_HREF}>Questions? Text us →</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm text-muted-foreground">
              <span>Exact price upfront</span>
              <span>Book in 2 minutes</span>
              <a href={PHONE_TEL_HREF} className="font-medium text-foreground hover:underline">
                Or call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
