"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
}

export function FAQAccordion({ items, allowMultiple = false }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {items.map((item, index) => (
        <FAQAccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openItems.has(index)}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}

interface FAQAccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FAQAccordionItemProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/50"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{question}</span>
        <svg
          className={cn(
            "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
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
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 text-muted-foreground">{answer}</div>
        </div>
      </div>
    </div>
  );
}

interface FAQCategoryProps {
  title: string;
  items: FAQItem[];
}

export function FAQCategory({ title, items }: FAQCategoryProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <FAQAccordion items={items} />
    </section>
  );
}
