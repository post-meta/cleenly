import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "1",
    title: "Tell us about your place",
    description:
      "Select bedrooms, bathrooms, and the type of cleaning you need. Add any special requests.",
  },
  {
    number: "2",
    title: "Get your price",
    description:
      "See a price range based on your home. Final price confirmed after quick details.",
  },
  {
    number: "3",
    title: "Pick a time",
    description:
      "Choose a date and time slot that works for you. Morning, afternoon, or evening.",
  },
  {
    number: "4",
    title: "Done",
    description:
      "You'll get confirmation and cleaner details. We handle the rest.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 md:py-28">
      <Container>
        <div className="text-center">
          <h2>How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Booking takes about 2 minutes. No account required to see your
            price.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-xl font-semibold text-background">
                {step.number}
              </div>
              <h3 className="text-lg">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
