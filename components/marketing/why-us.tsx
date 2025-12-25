import { Container } from "@/components/ui/container";
import { DollarSign, UserCheck, Calendar, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: DollarSign,
    title: "Upfront pricing",
    description:
      "You see the price before you book. The price on screen is the price you pay. No \"starting at\" games.",
  },
  {
    icon: UserCheck,
    title: "Vetted cleaners",
    description:
      "Every cleaner on our platform has been background-checked and has reviews from real customers.",
  },
  {
    icon: Calendar,
    title: "Easy rescheduling",
    description:
      "Plans change. Reschedule or cancel up to 24 hours before your appointment, no fees.",
  },
  {
    icon: ShieldCheck,
    title: "24-hour guarantee",
    description:
      "Something not right? Tell us within 24 hours and we'll send someone to fix it. No charge.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <Container>
        <div className="text-center">
          <h2>Why CLEENLY</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We keep things simple. Here&apos;s what that actually means.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="group">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[12px] bg-accent/5 text-accent transition-transform group-hover:scale-110">
                <reason.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{reason.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
