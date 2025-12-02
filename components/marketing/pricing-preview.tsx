import Link from "next/link";
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
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-semibold">Pricing</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
            Prices depend on home size and cleaning type. Here&apos;s what to
            expect for a 3 bedroom / 2 bathroom home in Seattle:
          </p>
        </div>

        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-4 text-left font-semibold text-foreground">Service</th>
                <th className="py-4 text-left font-semibold text-foreground">Price Range</th>
                <th className="hidden py-4 text-left font-semibold text-foreground sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row) => (
                <tr
                  key={row.service}
                  className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                >
                  <td className="py-4 text-sm font-medium text-foreground">
                    {row.service}
                  </td>
                  <td className="py-4 text-sm text-gray-600">{row.priceRange}</td>
                  <td className="hidden py-4 text-sm text-gray-600 sm:table-cell">
                    {row.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Final price shown before you book. No surprises.
        </p>

        <div className="mt-12 text-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/book">Calculate Your Exact Price</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
