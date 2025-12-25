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
    <section id="pricing" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-semibold">Simple, Flat Pricing</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
            No hourly rates or hidden fees. Here&apos;s what to
            expect for a typical 3 bedroom / 2 bathroom home in Seattle:
          </p>
        </div>

        <div className="overflow-hidden rounded-[16px] border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-8 py-5 text-sm font-semibold text-foreground">Service</th>
                  <th className="px-8 py-5 text-sm font-semibold text-foreground">Price Range</th>
                  <th className="hidden px-8 py-5 text-sm font-semibold text-foreground sm:table-cell">Estimated Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pricingData.map((row) => (
                  <tr
                    key={row.service}
                    className="transition-colors hover:bg-gray-50/30"
                  >
                    <td className="px-8 py-6">
                      <span className="text-base font-medium text-foreground">
                        {row.service}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-base font-semibold text-accent">
                        {row.priceRange}
                      </span>
                    </td>
                    <td className="hidden px-8 py-6 sm:table-cell">
                      <span className="text-sm text-gray-500">
                        {row.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 space-y-8 text-center">
          <p className="text-sm text-gray-500">
            * Final price depends on your specific home condition and selected add-ons.
          </p>
          <Button asChild variant="primary" size="lg" className="h-16 px-10 text-lg">
            <Link href="/book">Calculate Your Exact Price →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
