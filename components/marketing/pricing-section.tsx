import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServiceBySlug } from "@/lib/data/services";

const cards = [
    {
        slug: "regular-cleaning",
        bookingParam: "regular",
        bullets: [
            "All rooms: dust, vacuum, mop",
            "Kitchen: counters, sink, outside appliances",
            "Bathrooms: toilet, shower, sink, mirror",
        ],
        meta: "Typical 2BR home, 2-3 hours",
    },
    {
        slug: "deep-cleaning",
        bookingParam: "deep",
        bullets: [
            "Everything in Regular +",
            "Inside oven & fridge",
            "Baseboards, window sills, light fixtures",
        ],
        meta: "Typical 2BR home, 3-5 hours",
    },
    {
        slug: "move-out-cleaning",
        bookingParam: "move_out",
        bullets: [
            "Everything in Deep +",
            "Inside cabinets, closets, drawers",
            "Landlord inspection checklist",
        ],
        meta: "Depends on size & condition",
    },
];

export function PricingSection() {
    return (
        <section className="pricing py-16 bg-muted">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-4">
                    Simple, honest pricing
                </h2>
                <p className="text-center text-muted-foreground mb-12">
                    Price depends on your home size and condition.
                    The calculator shows your exact price before you book.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {cards.map((card) => {
                        const service = getServiceBySlug(card.slug);
                        if (!service) return null;
                        return (
                            <div key={card.slug} className="bg-background border rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                                <div className="text-3xl font-bold mb-1">{service.priceRange}</div>
                                <div className="text-sm text-muted-foreground mb-6">{card.meta}</div>

                                <ul className="space-y-2 text-sm mb-6">
                                    {card.bullets.map((bullet) => (
                                        <li key={bullet} className="flex gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button className="w-full" asChild>
                                    <Link href={`/book?service=${card.bookingParam}`}>Get exact price</Link>
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
