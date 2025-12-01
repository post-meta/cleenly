"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";

const faqs = [
  {
    question: "How much does house cleaning cost in Seattle?",
    answer:
      "For a 2-3 bedroom home, expect $120-$200 for regular cleaning, $180-$280 for deep cleaning, and $250-$400 for move-out cleaning. Exact price depends on home size and condition. We show you the price before you book.",
  },
  {
    question: "How far in advance do I need to book?",
    answer:
      "We often have availability within 2-3 days. For specific times or move-out cleanings, booking a week ahead helps.",
  },
  {
    question: "What's included in a regular cleaning?",
    answer:
      "Dusting all surfaces, vacuuming floors and carpets, mopping hard floors, cleaning bathrooms (toilet, shower, sink, mirrors), wiping kitchen surfaces, and taking out trash.",
  },
  {
    question: "Do I need to provide cleaning supplies?",
    answer:
      "No. Cleaners bring their own supplies and equipment. If you prefer specific products (eco-friendly, specific brand), let us know in the booking notes.",
  },
  {
    question: "Are your cleaners insured?",
    answer: "Yes. All cleaners on our platform carry liability insurance.",
  },
  {
    question: "What if I need to cancel?",
    answer:
      "Cancel up to 24 hours before your appointment at no charge. Cancellations within 24 hours may have a fee.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Seattle and the Greater Eastside: Bellevue, Kirkland, Redmond, Renton, Kent, Federal Way, Tacoma, Everett, and surrounding areas.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-muted/30 py-20 md:py-28">
      <Container size="narrow">
        <div className="text-center">
          <h2>Frequently Asked Questions</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Common questions about booking house cleaning in Seattle.
          </p>
        </div>

        <div className="mt-12 divide-y divide-border rounded-lg border border-border bg-background">
          {faqs.map((faq, index) => (
            <div key={index} className="px-6">
              <button
                className="flex w-full items-center justify-between py-5 text-left"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                aria-expanded={openIndex === index}
              >
                <span className="pr-4 font-medium">{faq.question}</span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <p className="pb-5 text-muted-foreground">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
