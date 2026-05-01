"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    id: "cost",
    question: "How much does house cleaning cost in Seattle?",
    answer:
      "For a 2-bedroom home: $100-$200 for regular cleaning, $150-$300 for deep cleaning, $200-$400 for move-out. Exact price depends on home size and condition. The booking calculator shows your price before you book.",
  },
  {
    id: "included",
    question: "What's included in a regular cleaning?",
    answer:
      "Dusting, vacuuming, mopping, kitchen surfaces (counters, sink, outside of appliances), bathrooms (toilet, shower, sink, mirrors), beds made, trash out. Inside oven/fridge and baseboards are part of deep cleaning.",
  },
  {
    id: "not-happy",
    question: "What if I'm not happy with the clean?",
    answer:
      "Tell us within 24 hours and we come back to fix it. No charge.",
  },
  {
    id: "insured",
    question: "Are your cleaners insured?",
    answer: "Yes — our cleaners carry liability insurance.",
  },
  {
    id: "supplies",
    question: "Do I need to provide cleaning supplies?",
    answer:
      "No. We bring our own supplies and equipment. If you prefer specific products (eco-friendly, fragrance-free), tell us in the booking notes.",
  },
  {
    id: "same-cleaner",
    question: "Will I get the same cleaner every time?",
    answer:
      "We keep your cleaner the same whenever we can — that's how cleanings get faster and better over time. On busy weeks we may send a teammate; if you've booked recurring service, we'll always tell you in advance.",
  },
  {
    id: "advance",
    question: "How far in advance do I need to book?",
    answer:
      "Most weeks we have availability within 2-3 days. For move-out cleanings or specific time slots, booking a week ahead is safer.",
  },
  {
    id: "cancel",
    question: "What if I need to cancel?",
    answer:
      "Cancel free up to 24 hours before. Cancellations within 24 hours may have a fee.",
  },
  {
    id: "areas",
    question: "What areas do you serve?",
    answer:
      "Greater Seattle: Seattle, Bellevue, Kirkland, Redmond, Renton, Kent, Federal Way, Tacoma, Everett, and surrounding cities.",
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <section id="faq" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-0 border-t border-gray-200">
          {displayedFaqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200 py-6">
              <button
                onClick={() => toggle(faq.id)}
                className="flex w-full items-center justify-between text-left group"
                aria-expanded={openId === faq.id}
              >
                <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:text-accent",
                    openId === faq.id ? "rotate-180" : ""
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openId === faq.id ? "max-h-72 opacity-100 mt-4" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!showAll && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => setShowAll(true)}
              className="gap-2"
            >
              Show More Questions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
