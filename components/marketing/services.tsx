import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, Truck } from "lucide-react";

const services = [
  {
    id: "regular",
    icon: Sparkles,
    name: "Regular Cleaning",
    description:
      "The basics done right. Dusting, vacuuming, mopping, bathroom and kitchen cleaning. Good for homes that get cleaned regularly.",
    priceRange: "$100-$150",
    priceNote: "(2-3 bed)",
    bestFor: "Weekly or bi-weekly maintenance",
    includes: [
      "All rooms dusted and vacuumed",
      "Kitchen surfaces wiped",
      "Bathrooms cleaned",
      "Floors mopped",
      "Trash taken out",
    ],
  },
  {
    id: "deep",
    icon: Home,
    name: "Deep Cleaning",
    description:
      "Everything in regular cleaning plus the spots that usually get skipped. Inside the oven, behind the fridge, baseboards, light fixtures.",
    priceRange: "$150-$250",
    priceNote: "(2-3 bed)",
    bestFor: "First-time cleanings, seasonal refresh",
    includes: [
      "Everything in regular cleaning",
      "Appliance interiors",
      "Baseboards and window sills",
      "Ceiling fans",
      "Cabinet fronts",
    ],
  },
  {
    id: "move_out",
    icon: Truck,
    name: "Move-Out Cleaning",
    description:
      "Landlord-ready cleaning to help you get your deposit back. We know what property managers check.",
    priceRange: "$200-$350",
    priceNote: "(2-3 bed)",
    bestFor: "End of lease, selling your home",
    includes: [
      "Deep clean of entire home",
      "Inside all appliances",
      "Inside cabinets and closets",
      "Window tracks",
      "Walls spot-cleaned",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-semibold">Our Services</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
            Three types of cleaning for different situations. Pick what fits your needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col rounded-[12px] border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-accent hover:shadow-xl"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[8px] bg-accent/5 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <service.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-4 text-xl font-semibold text-foreground">
                {service.name}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                {service.description}
              </p>

              <div className="mb-6 flex-1 space-y-4">
                <div className="rounded-[4px] bg-gray-50 px-3 py-2">
                  <p className="text-xs font-medium text-gray-500">
                    Best for: {service.bestFor}
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-gray-600">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href={`/book?service=${service.id}`}>
                    Learn More →
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
