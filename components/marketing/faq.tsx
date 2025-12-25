"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    id: "cost",
    question: "How much does house cleaning cost in Seattle?",
    answer:
      "For a 2-3 bedroom home, expect $120-$200 for regular cleaning, $180-$280 for deep cleaning, and $250-$400 for move-out cleaning. Exact price depends on home size and condition. We show you the price before you book.",
  },
  {
    id: "advance",
    question: "How far in advance do I need to book?",
    answer:
      "We often have availability within 2-3 days. For specific times or move-out cleanings, booking a week ahead helps.",
  },
  {
    id: "included",
    question: "What's included in a regular cleaning?",
    answer:
      "Dusting all surfaces, vacuuming floors and carpets, mopping hard floors, cleaning bathrooms (toilet, shower, sink, mirrors), wiping kitchen surfaces, and taking out trash.",
  },
  {
    id: "supplies",
    question: "Do I need to provide cleaning supplies?",
    answer:
      "No. Cleaners bring their own supplies and equipment. If you prefer specific products (eco-friendly, specific brand), let us know in the booking notes.",
  },
  {
    id: "insured",
    question: "Are your cleaners insured?",
    answer: "Yes. All cleaners on our platform carry liability insurance.",
  },
  {
    id: "cancel",
    question: "What if I need to cancel?",
    answer:
      "Cancel up to 24 hours before your appointment at no charge. Cancellations within 24 hours may have a fee.",
  },
  {
    id: "areas",
    question: "What areas do you serve?",
    answer:
      "Seattle and the Greater Eastside: Bellevue, Kirkland, Redmond, Renton, Kent, Federal Way, Tacoma, Everett, and surrounding areas.",
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
                  openId === faq.id ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
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
              variant="outline"
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
