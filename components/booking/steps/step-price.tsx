"use client";

import { Button } from "@/components/ui/button";
import {
  calculatePrice,
  formatPriceRange,
  formatPrice,
  getEstimatedDuration,
  serviceIncludes,
  addonInfo,
} from "@/lib/pricing";
import type {
  ServiceType,
  BedroomCount,
  BathroomCount,
  HomeCondition,
  Addon,
  BookingFormData,
} from "@/types";

const serviceNames: Record<ServiceType, string> = {
  regular: "Regular Cleaning",
  deep: "Deep Cleaning",
  move_out: "Move-Out Cleaning",
};

const bedroomLabels: Record<BedroomCount, string> = {
  studio: "Studio",
  "1": "1 bed",
  "2": "2 bed",
  "3": "3 bed",
  "4": "4 bed",
  "5+": "5+ bed",
};

const bathroomLabels: Record<BathroomCount, string> = {
  "1": "1 bath",
  "1.5": "1.5 bath",
  "2": "2 bath",
  "2.5": "2.5 bath",
  "3": "3 bath",
  "3.5+": "3.5+ bath",
};

interface StepPriceProps {
  data: Partial<BookingFormData>;
  onChange: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepPrice({ data, onChange, onNext, onBack }: StepPriceProps) {
  const serviceType = data.service_type!;
  const bedrooms = data.bedrooms!;
  const bathrooms = data.bathrooms!;
  const condition = data.condition || "average";
  const addons = data.addons || [];

  const estimate = calculatePrice(
    serviceType,
    bedrooms,
    bathrooms,
    condition as HomeCondition,
    addons
  );

  const duration = getEstimatedDuration(serviceType, bedrooms);
  const includes = serviceIncludes[serviceType];

  const handleAddonToggle = (addon: Addon) => {
    const currentAddons = data.addons || [];
    const newAddons = currentAddons.includes(addon)
      ? currentAddons.filter((a) => a !== addon)
      : [...currentAddons, addon];
    onChange({ addons: newAddons });
  };

  const totalMin = estimate.min + estimate.addonsTotal;
  const totalMax = estimate.max + estimate.addonsTotal;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Your cleaning estimate</h2>
        <p className="mt-2 text-muted-foreground">
          Based on your home details, here&apos;s what to expect
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          {serviceNames[serviceType]}: {bedroomLabels[bedrooms]} /{" "}
          {bathroomLabels[bathrooms]}
        </p>
        <p className="mt-3 text-4xl font-bold">
          {formatPriceRange(totalMin, totalMax)}
        </p>
        {estimate.addonsTotal > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            (includes {formatPrice(estimate.addonsTotal)} in add-ons)
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          Typical duration: {duration}
        </p>
      </div>

      {/* What's included */}
      <div>
        <h3 className="text-lg font-semibold">This includes:</h3>
        <ul className="mt-3 space-y-2">
          {includes.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
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
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add-ons */}
      <div>
        <h3 className="text-lg font-semibold">Add extras (optional)</h3>
        <div className="mt-3 space-y-2">
          {(Object.keys(addonInfo) as Addon[]).map((addon) => (
            <label
              key={addon}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <input
                type="checkbox"
                checked={addons.includes(addon)}
                onChange={() => handleAddonToggle(addon)}
                className="h-5 w-5 rounded border-border text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <span className="flex-1">{addonInfo[addon].label}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {addonInfo[addon].price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Note */}
      <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        Final price confirmed after booking. No surprises — if anything changes,
        we&apos;ll tell you first.
      </p>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Continue to Scheduling
        </Button>
      </div>
    </div>
  );
}
