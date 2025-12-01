import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works — Cleenly",
  description: "Book a cleaning in 4 simple steps. No phone calls, no guesswork.",
};

const steps = [
  {
    number: "1",
    title: "Tell us about your place",
    description:
      "Select the type of cleaning you need, enter the number of bedrooms and bathrooms. If you know your square footage, add that too for a more accurate quote.",
    details: [
      "Regular, deep, or move-out cleaning",
      "Property size affects pricing",
      "Special requests can be noted",
    ],
  },
  {
    number: "2",
    title: "See your price instantly",
    description:
      "Our calculator shows you a price range immediately. No waiting for callbacks, no mystery quotes. What you see is what you'll pay, plus or minus 15%.",
    details: [
      "Transparent pricing algorithm",
      "Final price confirmed after details review",
      "No hidden fees or surprises",
    ],
  },
  {
    number: "3",
    title: "Pick your time slot",
    description:
      "Choose a date and time window that works for you. Morning, afternoon, or evening. We'll confirm availability within 2 hours of your request.",
    details: [
      "Usually available within 2-3 days",
      "Same-day cleaning if slots are open",
      "Easy rescheduling if plans change",
    ],
  },
  {
    number: "4",
    title: "Your home gets cleaned",
    description:
      "Your assigned cleaner arrives on time with all supplies. After the cleaning, you can rate the service and leave feedback. Not satisfied? We'll make it right.",
    details: [
      "Vetted, reviewed cleaners",
      "All supplies provided",
      "Satisfaction guaranteed",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-16 md:py-24">
      <Container size="narrow">
        <div className="text-center">
          <h1>How it works</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From dirty to clean in four simple steps. No phone calls, no
            guesswork, no hassle.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-xl font-semibold text-background">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{step.title}</h2>
                  <p className="mt-3 text-muted-foreground">
                    {step.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <svg
                          className="h-4 w-4 text-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2>Ready to get started?</h2>
          <p className="mt-4 text-muted-foreground">
            Get a quote in under a minute. No commitment until you book.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/book">Get Your Quote</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
