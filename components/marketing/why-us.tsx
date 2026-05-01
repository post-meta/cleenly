import { Container } from "@/components/ui/container";
import { DollarSign, MessageSquare, Calendar, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: DollarSign,
    title: "Price upfront",
    description:
      "You see your exact price before you book. No \"starting at\" games, no quote calls.",
  },
  {
    icon: MessageSquare,
    title: "A real person answers",
    description:
      "Call or text the number on this page. You'll reach us, not a chatbot.",
  },
  {
    icon: Calendar,
    title: "Easy rescheduling",
    description:
      "Plans change. Reschedule or cancel up to 24 hours before, no fees.",
  },
  {
    icon: ShieldCheck,
    title: "24-hour re-clean",
    description:
      "Something not right? Tell us within 24 hours and we come back to fix it.",
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
