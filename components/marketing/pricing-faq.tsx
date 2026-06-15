"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Do you charge by the hour or flat rate?",
    answer:
      "You see an upfront estimate based on your home details. We bill the final price by the hour — $75 per cleaner-hour, $185 minimum — for the actual time your home takes, and we confirm it with you before charging. The estimate is what we expect the final to be.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. We bill the actual cleaner-hours worked at $75 per cleaner-hour, never more than what the work takes, and we confirm the final before charging. We may suggest optional add-ons, but you decide.",
  },
  {
    question: "Do recurring cleanings cost less?",
    answer:
      "Yes. From your second visit onward, a maintained home takes fewer hours, so recurring cleanings cost less than the first. A 1-2 bedroom home is typically $185-$225 per recurring visit.",
  },
  {
    question: "What if my home needs more work than expected?",
    answer:
      "If a cleaner arrives and finds the home needs significantly more work (heavy buildup, unusual mess), they'll contact you before proceeding to discuss options.",
  },
  {
    question: "Can I customize what's included?",
    answer:
      "Yes. Add extras like inside fridge, inside oven, or laundry. Skip things you don't need. Your price adjusts accordingly.",
  },
  {
    question: "Do I tip the cleaner?",
    answer:
      "Tips aren't required but are appreciated. You can tip in cash or through the app after your cleaning.",
  },
];

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-20">
      <h2>Pricing FAQ</h2>

      <div className="mt-8 divide-y divide-border rounded-lg border border-border">
        {faqs.map((faq, index) => (
          <div key={index} className="px-6">
            <button
              className="flex w-full items-center justify-between py-5 text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
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
    </section>
  );
}
