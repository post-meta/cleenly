import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_SMS_HREF, PHONE_TEL_HREF } from "@/lib/constants";

export function Hero() {
  return (
    <section className="hero py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: lifestyle image */}
          <div>
            <img
              src="/hero-image.jpg"
              alt="A calm clean kitchen with morning light, a single ceramic mug on the counter — the moment after we leave"
              className="w-full h-auto rounded-2xl object-cover aspect-[4/3] shadow-sm"
              width={1024}
              height={768}
              loading="eager"
            />
          </div>

          {/* Right: text */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              House cleaning in Greater Seattle
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              See your price online. Pick a time. We bring our own supplies.
              <br className="hidden md:block" />
              No memberships. No hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/book">See my price now</Link>
              </Button>

              <Button size="lg" variant="secondary" asChild>
                <a href={PHONE_SMS_HREF}>Questions? Text us →</a>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
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
