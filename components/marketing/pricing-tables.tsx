import { PRICE_DISPLAY } from "@/lib/pricing";

// First-visit (priced as a deep clean — market standard for a heavier first
// clean). All numbers come from the single source of truth in lib/pricing.ts.
const firstCleanPricing = [
  { size: "1 bedroom", price: PRICE_DISPLAY.firstClean.bySize["1"] },
  { size: "2 bedroom", price: PRICE_DISPLAY.firstClean.bySize["2"] },
  { size: "3 bedroom", price: PRICE_DISPLAY.firstClean.bySize["3"] },
  { size: "4 bedroom", price: PRICE_DISPLAY.firstClean.bySize["4"] },
  { size: "5+ bedroom", price: PRICE_DISPLAY.firstClean.bySize["5+"] },
];

const recurringPricing = [
  { size: "1 bedroom", price: PRICE_DISPLAY.recurring.bySize["1"] },
  { size: "2 bedroom", price: PRICE_DISPLAY.recurring.bySize["2"] },
  { size: "3 bedroom", price: PRICE_DISPLAY.recurring.bySize["3"] },
  { size: "4 bedroom", price: PRICE_DISPLAY.recurring.bySize["4"] },
];

const moveOutPricing = [
  { size: "1 bedroom", price: PRICE_DISPLAY.moveOut.bySize["1"] },
  { size: "2 bedroom", price: PRICE_DISPLAY.moveOut.bySize["2"] },
  { size: "3 bedroom", price: PRICE_DISPLAY.moveOut.bySize["3"] },
  { size: "4 bedroom", price: PRICE_DISPLAY.moveOut.bySize["4"] },
  { size: "5+ bedroom", price: PRICE_DISPLAY.moveOut.bySize["5+"] },
];

interface PricingTableProps {
  data: { size: string; price: string }[];
}

function PricingTable({ data }: PricingTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-semibold md:px-6">
              Home Size
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold md:px-6">
              Estimate
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.size}
              className={index !== data.length - 1 ? "border-b border-border" : ""}
            >
              <td className="px-4 py-3 text-sm md:px-6">{row.size}</td>
              <td className="px-4 py-3 text-sm font-medium md:px-6">
                {row.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PricingTables() {
  return (
    <section className="mt-16">
      <h2 className="font-display font-normal text-[32px] md:text-[40px] tracking-[-0.015em] text-foreground mb-4">
        Pricing by <em className="italic text-foreground-soft font-display">Service Type</em>
      </h2>
      <p className="mt-4 text-muted-foreground">
        These are upfront estimates for the Seattle metro area including
        Bellevue, Kirkland, Redmond, and surrounding cities. The final price is
        billed by the hour — ${PRICE_DISPLAY.ratePerCleanerHour} per
        cleaner-hour, ${PRICE_DISPLAY.minJob} minimum — for the actual time your
        home takes, and we confirm it with you before charging. The estimate is
        what we expect the final to be.
      </p>

      {/* First / Deep Cleaning */}
      <div className="mt-12">
        <h3>First &amp; Deep Cleaning</h3>
        <p className="mt-2 text-muted-foreground">
          Thorough cleaning that covers everything a regular cleaning does, plus
          the areas that usually get skipped. Your first cleaning is priced as a
          deep clean — first visits are always heavier. Also good for a seasonal
          refresh or a home that hasn&apos;t been cleaned in a while.
        </p>
        <div className="mt-6">
          <PricingTable data={firstCleanPricing} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Estimates assume a typical home in average condition. More bathrooms,
          larger square footage, or heavier buildup raise the estimate.
        </p>
      </div>

      {/* Recurring Cleaning */}
      <div className="mt-12">
        <h3>Recurring Cleaning</h3>
        <p className="mt-2 text-muted-foreground">
          Ongoing maintenance from your second visit onward. A home that&apos;s
          kept clean is faster to clean, so recurring visits cost less than the
          first.
        </p>
        <div className="mt-6">
          <PricingTable data={recurringPricing} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Estimates assume the home was deep-cleaned on the first visit and is
          kept in maintained condition.
        </p>
      </div>

      {/* Move-Out Cleaning */}
      <div className="mt-12">
        <h3>Move-Out Cleaning</h3>
        <p className="mt-2 text-muted-foreground">
          Complete cleaning to landlord and property manager standards. Designed
          to help you get your security deposit back. We know what they check.
        </p>
        <div className="mt-6">
          <PricingTable data={moveOutPricing} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Estimates assume an empty or mostly empty home. Homes with heavy
          buildup raise the estimate.
        </p>
      </div>
    </section>
  );
}
