import { formatPriceRange } from "@/lib/utils";
import type { PriceEstimate } from "@/types";

interface PriceDisplayProps {
  estimate: PriceEstimate | null;
}

export function PriceDisplay({ estimate }: PriceDisplayProps) {
  if (!estimate) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
        <p className="text-muted-foreground">
          Select service type and property details to see price
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Estimated price
      </p>
      <p className="mt-2 text-3xl font-semibold">
        {formatPriceRange(estimate.min, estimate.max)}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Final price confirmed after booking
      </p>
    </div>
  );
}
