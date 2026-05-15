"use client";

import { Button } from "@/components/ui/button";
import { formatPriceRange } from "@/lib/utils";

interface StickyPriceFooterProps {
  priceMin: number;
  priceMax: number;
  duration: string;
  serviceName: string;
  onContinue: () => void;
  continueLabel?: string;
  isFinalStep?: boolean;
  isSubmitting?: boolean;
}

export function StickyPriceFooter({
  priceMin,
  priceMax,
  duration,
  serviceName,
  onContinue,
  continueLabel,
  isFinalStep = false,
  isSubmitting = false,
}: StickyPriceFooterProps) {
  const label = continueLabel ?? (isFinalStep ? "Confirm booking" : "Continue");

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border"
      style={{ boxShadow: "var(--shadow-lift)" }}
    >
      <div className="max-w-3xl mx-auto px-6 h-[80px] md:h-[96px] flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] md:text-[14px] font-medium text-foreground-muted truncate">
            {serviceName}
          </span>
          <span
            className="font-display font-normal text-[22px] md:text-[28px] leading-none text-foreground"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {formatPriceRange(priceMin, priceMax)}
          </span>
          <span className="text-[12px] md:text-[13px] text-foreground-muted">
            {duration}
          </span>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          disabled={isSubmitting}
          className="flex-none"
        >
          {isSubmitting ? "Submitting…" : label}
        </Button>
      </div>
    </div>
  );
}
