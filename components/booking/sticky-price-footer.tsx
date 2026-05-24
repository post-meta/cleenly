"use client";

import { formatPriceRange } from "@/lib/pricing";

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
  const disabled = isSubmitting;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border"
      style={{
        boxShadow: "0 -8px 24px rgba(45, 40, 38, 0.06)",
        padding: "14px 20px 22px",
      }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[12px] font-medium text-foreground-muted truncate">
            {serviceName}
          </span>
          <span
            className="tnum font-display font-normal text-[24px] leading-none text-foreground mt-0.5"
          >
            {formatPriceRange(priceMin, priceMax)}
          </span>
          <span className="text-[11px] text-foreground-muted mt-0.5">
            {duration}
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={disabled}
          className="flex-none text-[15px] font-medium font-sans rounded-md transition-all ease-out cursor-pointer"
          style={{
            background: disabled ? "var(--color-gray-300)" : "var(--color-accent)",
            color: "#FAFAF8",
            height: "52px",
            padding: "0 24px",
            border: "none",
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {isSubmitting ? "Submitting…" : label}
        </button>
      </div>
    </div>
  );
}
