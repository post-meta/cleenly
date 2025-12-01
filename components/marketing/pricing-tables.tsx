import { Container } from "@/components/ui/container";

const regularPricing = [
  { size: "1 bed / 1 bath", price: "$80-$120", duration: "1.5-2 hours" },
  { size: "2 bed / 1 bath", price: "$100-$140", duration: "2-2.5 hours" },
  { size: "2 bed / 2 bath", price: "$120-$160", duration: "2-3 hours" },
  { size: "3 bed / 2 bath", price: "$140-$180", duration: "2.5-3.5 hours" },
  { size: "4 bed / 2.5 bath", price: "$160-$220", duration: "3-4 hours" },
  { size: "4+ bed / 3+ bath", price: "$200-$280", duration: "4-5 hours" },
];

const deepPricing = [
  { size: "1 bed / 1 bath", price: "$140-$180", duration: "2.5-3 hours" },
  { size: "2 bed / 1 bath", price: "$160-$200", duration: "3-3.5 hours" },
  { size: "2 bed / 2 bath", price: "$180-$240", duration: "3-4 hours" },
  { size: "3 bed / 2 bath", price: "$200-$280", duration: "3.5-5 hours" },
  { size: "4 bed / 2.5 bath", price: "$250-$320", duration: "4-6 hours" },
  { size: "4+ bed / 3+ bath", price: "$300-$400", duration: "5-7 hours" },
];

const moveOutPricing = [
  { size: "Studio", price: "$150-$180", duration: "2-3 hours" },
  { size: "1 bed / 1 bath", price: "$180-$220", duration: "3-4 hours" },
  { size: "2 bed / 1 bath", price: "$220-$280", duration: "3.5-4.5 hours" },
  { size: "2 bed / 2 bath", price: "$250-$320", duration: "4-5 hours" },
  { size: "3 bed / 2 bath", price: "$300-$380", duration: "5-6 hours" },
  { size: "4 bed / 2.5 bath", price: "$350-$450", duration: "5-7 hours" },
];

interface PricingTableProps {
  data: { size: string; price: string; duration: string }[];
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
              Price Range
            </th>
            <th className="hidden px-4 py-3 text-left text-sm font-semibold sm:table-cell md:px-6">
              Duration
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
              <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell md:px-6">
                {row.duration}
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
      <h2>Pricing by Service Type</h2>
      <p className="mt-4 text-muted-foreground">
        All prices are for the Seattle metro area including Bellevue, Kirkland,
        Redmond, and surrounding cities. Final price depends on your specific
        home.
      </p>

      {/* Regular Cleaning */}
      <div className="mt-12">
        <h3>Regular Cleaning</h3>
        <p className="mt-2 text-muted-foreground">
          Routine maintenance cleaning. Best for homes that get cleaned
          regularly (weekly or bi-weekly).
        </p>
        <div className="mt-6">
          <PricingTable data={regularPricing} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Prices assume home is in typical condition. First-time cleanings may
          take longer.
        </p>
      </div>

      {/* Deep Cleaning */}
      <div className="mt-12">
        <h3>Deep Cleaning</h3>
        <p className="mt-2 text-muted-foreground">
          Thorough cleaning that covers everything a regular cleaning does, plus
          the areas that usually get skipped. Good for first-time cleanings,
          seasonal refresh, or homes that haven&apos;t been cleaned in a while.
        </p>
        <div className="mt-6">
          <PricingTable data={deepPricing} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Deep cleaning is recommended before starting regular cleaning service.
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
          Price assumes empty or mostly empty home. Homes with heavy buildup may
          cost more.
        </p>
      </div>
    </section>
  );
}
