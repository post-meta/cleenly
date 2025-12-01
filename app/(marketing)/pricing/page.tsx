import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SERVICE_TYPES, PRICE_PER_BEDROOM, PRICE_PER_BATHROOM } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Pricing — Cleenly",
  description: "Transparent pricing for house cleaning in Seattle. See rates for regular, deep, and move-out cleaning.",
};

const serviceDetails = {
  regular: {
    included: [
      "Dust all surfaces",
      "Vacuum and mop floors",
      "Clean kitchen surfaces",
      "Clean bathroom (toilet, sink, shower)",
      "Make beds",
      "Take out trash",
      "General tidying",
    ],
    notIncluded: ["Inside appliances", "Inside cabinets", "Windows", "Laundry"],
  },
  deep: {
    included: [
      "Everything in Regular, plus:",
      "Inside oven and microwave",
      "Inside refrigerator",
      "Baseboards and door frames",
      "Light fixtures and ceiling fans",
      "Window sills (interior)",
      "Detailed bathroom scrub",
    ],
    notIncluded: ["Inside cabinets", "Exterior windows", "Laundry"],
  },
  move_out: {
    included: [
      "Everything in Deep, plus:",
      "Inside all cabinets and drawers",
      "Inside closets",
      "Wall spot cleaning",
      "Light switch and outlet cleaning",
      "Full property walkthrough",
      "Get-your-deposit-back detail",
    ],
    notIncluded: ["Exterior windows", "Carpet deep cleaning", "Laundry"],
  },
};

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="text-center">
          <h1>Pricing</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Transparent rates. No hidden fees. Price depends on service type
            and property size.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {Object.entries(SERVICE_TYPES).map(([key, service]) => {
            const details = serviceDetails[key as keyof typeof serviceDetails];
            return (
              <Card key={key} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-semibold">
                      {formatPrice(service.basePrice)}
                    </span>
                    <span className="text-muted-foreground">+ / room</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Included:</p>
                      <ul className="mt-2 space-y-1">
                        {details.included.map((item, i) => (
                          <li
                            key={i}
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
                    </div>

                    <div>
                      <p className="text-sm font-medium">Not included:</p>
                      <ul className="mt-2 space-y-1">
                        {details.notIncluded.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <svg
                              className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/book?service=${key}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Additional Pricing Info */}
        <div className="mt-20">
          <h2 className="text-center">How pricing works</h2>
          <div className="mx-auto mt-8 max-w-2xl space-y-6 text-muted-foreground">
            <p>
              <strong className="text-foreground">Base price</strong> covers a
              standard-sized home. Prices shown are starting points.
            </p>
            <p>
              <strong className="text-foreground">Per bedroom:</strong>{" "}
              +{formatPrice(PRICE_PER_BEDROOM)} for each bedroom
            </p>
            <p>
              <strong className="text-foreground">Per bathroom:</strong>{" "}
              +{formatPrice(PRICE_PER_BATHROOM)} for each bathroom
            </p>
            <p>
              <strong className="text-foreground">Large homes:</strong>{" "}
              Homes over 1,000 sq ft may have additional charges based on actual
              size.
            </p>
            <p>
              Use our{" "}
              <Link href="/book" className="text-foreground underline">
                quote calculator
              </Link>{" "}
              to get an accurate estimate for your specific home.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Button size="lg" asChild>
            <Link href="/book">Get Your Quote</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
