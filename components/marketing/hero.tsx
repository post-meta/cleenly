import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export function Hero() {
  return (
    <section className="hero py-16 md:py-24 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div className="space-y-6 md:space-y-8 text-left">
            <Eyebrow>Greater Seattle · instant booking</Eyebrow>

            <h1 className="font-display font-normal text-[48px] md:text-[64px] lg:text-[72px] leading-[1.05] tracking-[-0.025em] text-foreground max-w-[560px]">
              A cleaner home in <em className="italic text-foreground-soft font-display font-normal">three taps.</em>
            </h1>

            <p className="text-[19px] leading-[1.55] text-foreground-soft max-w-[480px]">
              Vetted cleaners. Pacific Northwest standards. Same crew every time —
              the same key under the mat, but better.
            </p>

            <div className="flex flex-row items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/book">Book a cleaning</Link>
              </Button>

              <Button size="lg" variant="secondary" asChild>
                <Link href="/services">See services</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[13px] text-foreground-muted">
              <span className="whitespace-nowrap">Licensed · Insured · Bonded</span>
              <span className="hidden md:inline w-[1px] h-3.5 bg-border"></span>
              <span className="whitespace-nowrap">No payment until confirmed</span>
            </div>
          </div>

          {/* Right: lifestyle image with rating badge */}
          <div className="relative w-full">
            <Image
              src="/hero-image.jpg"
              alt="Light-filled Pacific Northwest home interior"
              width={800}
              height={600}
              priority
              className="w-full h-[380px] md:h-[560px] rounded-[32px] object-cover shadow-sm block"
            />
            {/* Floating rating badge */}
            <div 
              className="absolute -left-4 md:-left-7 bottom-8 bg-background border border-border rounded-lg px-5 py-4 flex items-center gap-3.5 transition-all duration-300 hover:shadow-lift"
              style={{ boxShadow: "var(--shadow-lift)" }}
            >
              <span className="w-9 h-9 rounded-full bg-[#DCE5DF] inline-flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </span>
              <div className="whitespace-nowrap">
                <div className="font-display font-normal text-[22px] tracking-[-0.02em] leading-none text-foreground">
                  <span className="tnum">4.92</span> avg. rating
                </div>
                <div className="text-[12px] text-foreground-muted mt-1">
                  Across 2,400 cleanings this year
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

