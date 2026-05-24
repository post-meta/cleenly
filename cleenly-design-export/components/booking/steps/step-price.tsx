"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <div className="space-y-6 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Your cleaning estimate</h2>
        <p className="mt-2 text-muted-foreground">
          Based on your home details, here&apos;s what to expect
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          {serviceNames[serviceType]}: {bedroomLabels[bedrooms]} /{" "}
          {bathroomLabels[bathrooms]}
        </p>
        <p className="mt-3 text-4xl font-bold text-foreground">
          {formatPriceRange(totalMin, totalMax)}
        </p>
        {estimate.addonsTotal > 0 && (
          <p className="mt-1 text-sm text-signal font-medium">
            (includes {formatPrice(estimate.addonsTotal)} in signature add-ons)
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          Typical duration: {duration}
        </p>
      </div>

      {/* What's included */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">This includes:</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {includes.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-signal"
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
              <span className="text-foreground-soft">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add-ons Section */}
      <div className="space-y-8 pt-4 border-t border-border/60">
        {/* Signature PNW Protocols */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Signature PNW Protocols</h3>
            <span className="inline-flex items-center rounded-full bg-signal-soft px-2.5 py-0.5 text-xs font-semibold text-signal">
              Recommended
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Specialized sanitation systems optimized for Western Washington seasons and environments.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["pollen_purge", "damp_season_reset"] as Addon[]).map((addon) => {
              const isSelected = addons.includes(addon);
              return (
                <label
                  key={addon}
                  className={cn(
                    "flex flex-col justify-between cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 select-none relative",
                    "hover:border-signal hover:shadow-sm",
                    isSelected
                      ? "border-signal bg-signal-soft/10 ring-1 ring-signal"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAddonToggle(addon)}
                      className="mt-1 h-5 w-5 rounded border-border text-signal focus:ring-2 focus:ring-signal focus:ring-offset-2 cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-foreground block leading-tight">
                        {addonInfo[addon].label}
                      </span>
                      {addonInfo[addon].description && (
                        <span className="mt-1.5 text-xs text-foreground-soft block leading-relaxed">
                          {addonInfo[addon].description}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center">
                    <span className="inline-flex items-center rounded-md bg-signal-soft px-1.5 py-0.5 text-[10px] font-medium text-signal uppercase tracking-wider">
                      PNW Stewardship
                    </span>
                    <span className="text-sm font-semibold text-signal">
                      {addonInfo[addon].price}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Standard Extras */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">Standard Home Extras</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Deep focus cleaning inside appliances and custom high-touch zones.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["fridge", "oven", "cabinets", "laundry", "windows"] as Addon[]).map((addon) => {
              const isSelected = addons.includes(addon);
              return (
                <label
                  key={addon}
                  className={cn(
                    "flex flex-col justify-between cursor-pointer rounded-xl border p-4 transition-all duration-200 select-none",
                    "hover:border-foreground hover:bg-muted/10",
                    isSelected
                      ? "border-foreground bg-muted/30"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAddonToggle(addon)}
                      className="mt-1 h-4.5 w-4.5 rounded border-border text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-foreground text-sm block leading-tight">
                        {addonInfo[addon].label}
                      </span>
                      {addonInfo[addon].description && (
                        <span className="mt-1 text-[11px] text-foreground-muted block leading-normal">
                          {addonInfo[addon].description}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/40 text-right">
                    <span className="text-xs font-semibold text-foreground-soft">
                      {addonInfo[addon].price}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        Final price confirmed after booking. No surprises — if anything changes,
        we&apos;ll tell you first.
      </p>

      <div className="flex gap-3 pt-4">
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
