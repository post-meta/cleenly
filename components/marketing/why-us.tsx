import { Container } from "@/components/ui/container";

const reasons = [
  {
    title: "Upfront pricing",
    description:
      "You see the price before you book. The price on screen is the price you pay. No \"starting at\" games.",
  },
  {
    title: "Vetted cleaners",
    description:
      "Every cleaner on our platform has been background-checked and has reviews from real customers.",
  },
  {
    title: "Easy rescheduling",
    description:
      "Plans change. Reschedule or cancel up to 24 hours before your appointment, no fees.",
  },
  {
    title: "24-hour guarantee",
    description:
      "Something not right? Tell us within 24 hours and we'll send someone to fix it. No charge.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="text-center">
          <h2>Why CLEENLY</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We keep things simple. Here&apos;s what that actually means.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title}>
              <h3 className="text-lg font-semibold">{reason.title}</h3>
              <p className="mt-2 text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
