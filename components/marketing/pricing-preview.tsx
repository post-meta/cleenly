import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const pricingData = [
  {
    service: "Regular Cleaning",
    priceRange: "$140-$170",
    time: "2-3 hours",
  },
  {
    service: "Deep Cleaning",
    priceRange: "$200-$260",
    time: "3-5 hours",
  },
  {
    service: "Move-Out Cleaning",
    priceRange: "$280-$350",
    time: "4-6 hours",
  },
];

export function PricingPreview() {
  return (
    <section id="pricing" className="bg-muted/30 py-20 md:py-28">
      <Container size="narrow">
        <div className="text-center">
          <h2>Pricing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Prices depend on home size and cleaning type. Here&apos;s what to
            expect for a 3 bedroom / 2 bathroom home in Seattle:
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-lg border border-border bg-background">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Price Range
                </th>
                <th className="hidden px-6 py-4 text-left text-sm font-semibold sm:table-cell">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row, index) => (
                <tr
                  key={row.service}
                  className={
                    index !== pricingData.length - 1
                      ? "border-b border-border"
                      : ""
                  }
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {row.service}
                  </td>
                  <td className="px-6 py-4 text-sm">{row.priceRange}</td>
                  <td className="hidden px-6 py-4 text-sm text-muted-foreground sm:table-cell">
                    {row.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Final price shown before you book. No surprises.
        </p>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/book">Calculate Your Exact Price</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
