import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SERVICE_TYPES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const serviceDetails = {
  regular: {
    features: [
      "Dusting all surfaces",
      "Vacuuming and mopping floors",
      "Kitchen and bathroom cleaning",
      "Making beds, tidying up",
    ],
  },
  deep: {
    features: [
      "Everything in Regular +",
      "Inside appliances (oven, fridge)",
      "Baseboards and window sills",
      "Light fixtures and fans",
    ],
  },
  move_out: {
    features: [
      "Everything in Deep +",
      "Inside all cabinets and closets",
      "Wall spot cleaning",
      "Full property reset",
    ],
  },
};

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <Container>
        <div className="text-center">
          <h2>What we offer</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Three types of cleaning. Pick what fits your situation.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {Object.entries(SERVICE_TYPES).map(([key, service]) => {
            const details = serviceDetails[key as keyof typeof serviceDetails];
            return (
              <Card key={key} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-3xl font-semibold">
                      {formatPrice(service.basePrice)}
                    </span>
                    <span className="text-muted-foreground">+</span>
                  </div>
                  <ul className="space-y-2">
                    {details.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground"
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
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link href={`/book?service=${key}`}>Select</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
