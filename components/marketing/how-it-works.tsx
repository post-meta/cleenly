import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "1",
    title: "Enter your details",
    description:
      "Tell us your home type, number of rooms, and what needs cleaning.",
  },
  {
    number: "2",
    title: "Get a price",
    description:
      "See the price range right away. Final price after we confirm the details.",
  },
  {
    number: "3",
    title: "Pick a time",
    description:
      "Choose when works for you. Confirmation within 2 hours.",
  },
  {
    number: "4",
    title: "Done",
    description:
      "Your cleaner shows up on time. Not happy? We'll come back and fix it.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20 md:py-28">
      <Container>
        <div className="text-center">
          <h2>How it works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Four steps from dirty to clean. No phone calls, no surprises.
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
