"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
    id?: string;
    question: string;
    answer: string;
}

interface AccordionFAQProps {
    faqs: FAQItem[];
    title: string;
}

export function AccordionFAQ({ faqs, title }: AccordionFAQProps) {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenId(openId === index ? null : index);
    };

    return (
        <section className="bg-white py-24 md:py-32">
            <div className="mx-auto max-w-3xl px-6">
                <div className="mb-16 text-center md:text-left">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                </div>

                <div className="space-y-0">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 py-6">
                            <button
                                onClick={() => toggle(index)}
                                className="flex w-full items-center justify-between text-left"
                                aria-expanded={openId === index}
                            >
                                <h3 className="text-sm md:text-base font-semibold text-foreground pr-4">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200",
                                        openId === index ? "rotate-180" : ""
                                    )}
                                />
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    openId === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                                )}
                            >
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
