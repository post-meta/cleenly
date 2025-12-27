import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Shield, Check } from "lucide-react";

export const metadata = {
  title: "How It Works — Cleenly",
  description: "From dirty to clean in four simple steps. No phone calls, no guesswork, no hassle.",
};

const FAQ = [
  {
    question: "What if I need to reschedule?",
    answer: "Easy—just update your booking online up to 24 hours before.",
  },
  {
    question: "Do I need to provide supplies?",
    answer: "Nope. We bring everything needed for a professional clean.",
  },
  {
    question: "How do I know my cleaner is qualified?",
    answer: "All cleaners are background-checked and rated by other customers.",
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            How it works
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
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
              <h2 className="text-2xl font-semibold mb-6">Tell us about your place</h2>
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
                Most Greater Seattle homes: $150-240 for a thorough 3-4 hour clean.
                <br />
                That's $50-60/hour vs the typical $75/hour you'd pay elsewhere.
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
              <h2 className="text-2xl font-semibold mb-6">See your price instantly</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our calculator shows you a price range immediately—no waiting for callbacks,
                no mystery quotes. What you see is what you'll pay, give or take 15% after
                we review the details.
              </p>
              <ul className="space-y-4">
                {[
                  "Transparent pricing: $50-60/hour, all supplies included",
                  "Final price confirmed within 15% after details review",
                  "No hidden fees, no upsells, no surprises"
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

      {/* Comparison Callout */}
      <section className="py-16 bg-muted border-y border-border">
        <Container size="narrow" className="text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg font-medium">
              <div className="text-muted-foreground md:text-right">Traditional services: $75/hr + "additional fees"</div>
              <div className="text-foreground md:text-left">Cleenly: $50-60/hr, everything included</div>
            </div>
            <p className="text-xl font-semibold text-foreground">
              Save $20-30 per hour. On a 3-hour clean, that's $60-90 in your pocket.
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
              <h2 className="text-2xl font-semibold mb-6">Pick your time slot</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Choose a date and time window that works for you. Morning, afternoon,
                or evening—we work around your schedule. We'll confirm availability
                within 2 hours of your request.
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
                Morning (8am-12pm) • Afternoon (12-4pm) • Evening (4-8pm)
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
              <h2 className="text-2xl font-semibold mb-6">Your home gets cleaned</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Your assigned cleaner arrives on time with all supplies and equipment.
                After the cleaning, you can rate the service and leave feedback.
                Not satisfied? We'll make it right.
              </p>
              <ul className="space-y-4">
                {[
                  "Background-checked, vetted independent contractors",
                  "All cleaning supplies and equipment provided",
                  "Rate your cleaner and help us maintain quality",
                  "Satisfaction guaranteed—we fix issues or refund you"
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
              "500+ homes cleaned in Greater Seattle",
              "4.8★ average rating",
              "Licensed & Insured",
              "Background-checked cleaners"
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
            <h2 className="text-3xl font-bold">Why professionals choose Cleenly</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-xl shadow-sm border border-border">
              <div className="flex justify-center mb-6 text-accent">
                <DollarSign className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Honest pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                $50-60/hour with no hidden fees. You know exactly what you're
                paying before you book.
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
              <h3 className="text-xl font-semibold mb-4 text-foreground">Quality guaranteed</h3>
              <p className="text-muted-foreground leading-relaxed">
                Vetted cleaners, full supplies included, and we make it right
                if you're not happy.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white border-t border-border">
        <Container size="narrow" className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
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
