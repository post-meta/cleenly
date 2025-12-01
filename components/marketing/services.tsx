import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "regular",
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
    <section id="services" className="py-20 md:py-28">
      <Container>
        <div className="text-center">
          <h2>Our Services</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Three types of cleaning for different situations. Pick what fits
            your needs.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription className="mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <span className="text-2xl font-semibold">
                    {service.priceRange}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {service.priceNote}
                  </span>
                </div>
                <p className="mb-4 text-sm">
                  <span className="font-medium">Best for:</span>{" "}
                  <span className="text-muted-foreground">
                    {service.bestFor}
                  </span>
                </p>
                <p className="mb-2 text-sm font-medium">Includes:</p>
                <ul className="space-y-1.5">
                  {service.includes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/book?service=${service.id}`}>
                    Book {service.name}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
