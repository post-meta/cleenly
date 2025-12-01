import { Container } from "@/components/ui/container";

const reasons = [
  {
    title: "Clear pricing",
    description:
      "The calculator shows you a range right away. No \"starting from\" asterisks.",
  },
  {
    title: "Vetted cleaners",
    description:
      "Everyone on the platform has reviews and order history. No random strangers.",
  },
  {
    title: "We fix mistakes",
    description:
      "Not happy with the result? Tell us. We'll send someone to make it right.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <Container>
        <div className="text-center">
          <h2>Why Cleenly</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We keep things simple. Here&apos;s what that means.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-center md:text-left">
              <h3 className="text-lg">{reason.title}</h3>
              <p className="mt-2 text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
