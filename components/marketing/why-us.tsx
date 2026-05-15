import { Container } from "@/components/ui/container";

function Glyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="text-foreground-soft"
    >
      <circle cx="10" cy="10" r="3" fill="currentColor" />
    </svg>
  );
}

const reasons = [
  {
    title: "Price upfront",
    description:
      "You see your exact price before you book. No \"starting at\" games, no quote calls.",
  },
  {
    title: "Two ways to book",
    description:
      "Book online in 2 minutes — that's the easiest path. Or call us if you'd rather talk to someone.",
  },
  {
    title: "Easy rescheduling",
    description:
      "Plans change. Reschedule or cancel up to 24 hours before, no fees.",
  },
  {
    title: "24-hour re-clean",
    description:
      "Something not right? Tell us within 24 hours and we come back to fix it.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <Container>
        <div className="text-center">
          <h2 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.01em] text-foreground">
            Why CLEENLY
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] text-foreground-muted">
            We keep things simple. Here&apos;s what that actually means.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title}>
              <div className="mb-5">
                <Glyph />
              </div>
              <h3 className="text-[18px] font-medium text-foreground">{reason.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
