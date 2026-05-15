import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PHONE_DISPLAY, PHONE_SMS_HREF, PHONE_TEL_HREF } from "@/lib/constants";

function DotSep() {
  return <span aria-hidden="true" className="text-foreground-muted/50">·</span>;
}

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
          <div className="space-y-8 text-left">
            <Eyebrow>Greater Seattle · House cleaning</Eyebrow>

            <h1 className="font-display font-normal text-[44px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.025em] text-foreground">
              House cleaning that <em className="italic text-foreground-soft">cares for the home,</em> not just cleans it.
            </h1>

            <p className="text-[19px] leading-[1.65] text-foreground-muted max-w-[520px]">
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

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-[14px] text-foreground-muted">
              <span>Exact price upfront</span>
              <DotSep />
              <span>Book in 2 minutes</span>
              <DotSep />
              <a href={PHONE_TEL_HREF} className="font-medium text-foreground hover:text-accent transition-colors">
                Or call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
