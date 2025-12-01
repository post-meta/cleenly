"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";

const faqs = [
  {
    question: "How is the price calculated?",
    answer:
      "Base price depends on the type of cleaning. We add a bit per bedroom and bathroom. Square footage matters too if your place is large. The calculator shows you a range before you book.",
  },
  {
    question: "What if I'm not happy with the cleaning?",
    answer:
      "Tell us within 24 hours. We'll send someone back to fix whatever wasn't done right. No arguing, no extra charge.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "Up to you. Most people leave a key or use a lockbox. If you're home, we ask you to stay out of the way so we can work efficiently.",
  },
  {
    question: "What about supplies and equipment?",
    answer:
      "Cleaners bring their own. If you have specific products you want used, let us know when booking.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We usually have availability within 2-3 days. For specific times or same-day cleaning, book early — slots fill up.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Greater Seattle area — Seattle proper, Bellevue, Kirkland, Redmond, Renton, and surrounding cities. Not sure if we cover your area? Enter your zip code when booking.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28">
      <Container size="narrow">
        <div className="text-center">
          <h2>Common questions</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Things people ask before booking.
          </p>
        </div>

        <div className="mt-12 divide-y divide-border">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                className="flex w-full items-center justify-between text-left"
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
                <p className="mt-3 text-muted-foreground">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
