import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Shield, Check } from "lucide-react";
import { PRICE_DISPLAY } from "@/lib/pricing";

export const metadata = {
  title: "How It Works | CLEENLY",
  description: "From dirty to clean in four simple steps. No phone calls, no guesswork, no hassle.",
  alternates: {
    canonical: "https://cleenly.app/how-it-works",
  },
};

const FAQ = [
  {
    question: "What if I need to reschedule?",
    answer: "Easy—just update your booking online up to 24 hours before.",
  },
  {
    question: "Do I need to provide supplies?",
    answer: "Nope. We bring all supplies and equipment.",
  },
  {
    question: "How do I know my cleaner is qualified?",
    answer: "Everyone who cleans for us is background-checked. We're a small team, so most cleanings are done by us personally.",
  },
  {
    question: "What if I'm not satisfied?",
    answer: "Tell us within 24 hours. We'll send someone to fix it, free of charge.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container size="narrow" className="text-center">
          <h1 className="font-display font-normal text-[44px] md:text-[56px] lg:text-[64px] leading-[1.1] tracking-[-0.02em] text-foreground">
            How it <em className="italic text-foreground-soft font-display">works</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-foreground-muted leading-relaxed">
            From dirty to clean in four simple steps. No phone calls, no guesswork, no hassle.
          </p>
        </Container>
      </section>

      {/* Step 1 */}
      <section className="py-16 bg-white border-t border-border">
        <Container size="narrow">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
              1
            </div>
            <div className="flex-1">
              <h2 className="font-display font-normal text-[28px] md:text-[32px] tracking-[-0.01em] mb-6 leading-tight text-foreground">
                Tell us about <em className="italic text-foreground-soft font-display">your place</em>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Select the type of cleaning you need, enter the number of bedrooms and bathrooms.
                Know your square footage? Add it for a more accurate quote.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Regular, deep, or move-out cleaning available",
                  "Property size affects pricing (larger homes = more time needed)",
                  "Special requests? Note them in the booking form"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
                A first clean for most Greater Seattle homes estimates around{" "}
                {PRICE_DISPLAY.firstClean.bySize["2"]} for a 2-bedroom and{" "}
                {PRICE_DISPLAY.firstClean.bySize["3"]} for a 3-bedroom.
                <br />
                {PRICE_DISPLAY.framing}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Step 2 */}
      <section className="py-16 bg-white border-t border-border">
        <Container size="narrow">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
              2
            </div>
            <div className="flex-1">
              <h2 className="font-display font-normal text-[28px] md:text-[32px] tracking-[-0.01em] mb-6 leading-tight text-foreground">
                See your price <em className="italic text-foreground-soft font-display">instantly</em>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our calculator shows you a price range immediately—no waiting for callbacks,
                no mystery quotes. The final price is based on the actual time it takes,
                billed by the hour, and we confirm it with you before charging.
              </p>
              <ul className="space-y-4">
                {[
                  `Billed by the hour: $${PRICE_DISPLAY.ratePerCleanerHour} per cleaner-hour, all supplies included`,
                  `Estimate range up front, $${PRICE_DISPLAY.minJob} minimum job`,
                  "Final price confirmed with you before we charge"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Callout */}
      <section className="py-16 bg-muted border-y border-border">
        <Container size="narrow" className="text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg font-medium">
              <div className="text-muted-foreground md:text-right">One rate, no add-on fees</div>
              <div className="text-foreground md:text-left">
                ${PRICE_DISPLAY.ratePerCleanerHour} per cleaner-hour, supplies included
              </div>
            </div>
            <p className="text-xl font-semibold text-foreground">
              You get an estimate range up front. The final price is the actual cleaner-hours
              worked at ${PRICE_DISPLAY.ratePerCleanerHour}/hour (${PRICE_DISPLAY.minJob} minimum), confirmed before we charge.
            </p>
          </div>
        </Container>
      </section>

      {/* Step 3 */}
      <section className="py-16 bg-white">
        <Container size="narrow">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
              3
            </div>
            <div className="flex-1">
              <h2 className="font-display font-normal text-[28px] md:text-[32px] tracking-[-0.01em] mb-6 leading-tight text-foreground">
                Pick your <em className="italic text-foreground-soft font-display">time slot</em>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Choose a date and time window that works for you. Morning or
                afternoon—we work around your schedule. We'll confirm availability,
                usually within a couple of hours.
              </p>
              <ul className="space-y-4 mb-6">
                {[
                  "Usually available within 2-3 days (often sooner)",
                  "Same-day cleaning if we have an opening",
                  "Easy rescheduling if your plans change"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-sm text-muted-foreground font-medium">
                Morning (8am-12pm) • Afternoon (12-4pm)
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Step 4 */}
      <section className="py-16 bg-white border-t border-border">
        <Container size="narrow">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
              4
            </div>
            <div className="flex-1">
              <h2 className="font-display font-normal text-[28px] md:text-[32px] tracking-[-0.01em] mb-6 leading-tight text-foreground">
                Your home <em className="italic text-foreground-soft font-display">gets cleaned</em>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Your cleaner arrives on time with all supplies and equipment.
                We confirm the final price with you before charging.
                Not satisfied? We'll make it right.
              </p>
              <ul className="space-y-4">
                {[
                  "Background-checked and covered by liability insurance",
                  "We bring all supplies and equipment",
                  "Final price confirmed before we charge",
                  "Something off? Tell us within 24 hours. We come back to fix it, free."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-border">
        <Container>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              "Greater Seattle service area",
              "Online booking",
              "Liability insurance",
              "24-hour re-clean guarantee"
            ].map((badge, i) => (
              <div key={i} className="px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium text-muted-foreground">
                {badge}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose Cleenly */}
      <section className="py-20 bg-muted border-t border-border">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-display font-normal text-[36px] md:text-[44px] tracking-[-0.015em] text-foreground">
              Why people choose <em className="italic text-foreground-soft font-display">Cleenly</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-xl shadow-sm border border-border">
              <div className="flex justify-center mb-6 text-accent">
                <DollarSign className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Honest pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                ${PRICE_DISPLAY.ratePerCleanerHour} per cleaner-hour, no hidden fees. You get an upfront
                estimate, and we confirm the final price before charging.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-sm border border-border">
              <div className="flex justify-center mb-6 text-accent">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Your time matters</h3>
              <p className="text-muted-foreground leading-relaxed">
                Book online in 2 minutes. No phone calls, no back-and-forth,
                no guesswork.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-sm border border-border">
              <div className="flex justify-center mb-6 text-accent">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">We fix it free</h3>
              <p className="text-muted-foreground leading-relaxed">
                Background-checked cleaners, full supplies included, and if
                something's not right we come back within 24 hours.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white border-t border-border">
        <Container size="narrow" className="text-center">
          <h2 className="font-display font-normal text-[36px] md:text-[44px] tracking-[-0.015em] text-foreground mb-6">
            Ready to <em className="italic text-foreground-soft font-display">get started?</em>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Get a quote in under a minute. No commitment until you book.
          </p>
          <Button size="lg" asChild className="h-16 px-12 text-lg">
            <Link href="/book">Get Your Quote in 60 Seconds</Link>
          </Button>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-t border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {FAQ.map((item, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">{item.question}</h4>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
