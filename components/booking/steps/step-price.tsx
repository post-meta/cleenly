"use client";

import { cn } from "@/lib/utils";
import {
  calculatePrice,
  formatPriceRange,
  getEstimatedDuration,
  serviceIncludes,
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

const pnwAddonsList = [
  { id: "pollen_purge" as Addon, label: "Pollen Purge", desc: "HEPA vent flush, screen wipe, allergen-grade cloths.", price: "+$35" },
  { id: "damp_season_reset" as Addon, label: "Damp-Season Reset", desc: "Mildew prevention, cedar-pine mop, vent re-set.", price: "+$45" },
];

const standardAddonsList = [
  { id: "fridge" as Addon, label: "Inside fridge", desc: "Shelves, drawers, gaskets.", price: "+$25" },
  { id: "oven" as Addon, label: "Inside oven", desc: "Racks, glass, deep degrease.", price: "+$30" },
  { id: "cabinets" as Addon, label: "Inside cabinets", desc: "Empty interiors only.", price: "+$25" },
];

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
    <div className="px-5 pb-5 animate-fadeInUp">
      <h2 className="font-display font-normal text-[30px] leading-[1.15] mt-4 text-foreground">
        Your cleaning <em className="font-display italic font-normal text-foreground-soft">estimate.</em>
      </h2>
      <p className="text-[14px] text-foreground-muted mt-2">
        Based on your home details.
      </p>

      {/* Summary card */}
      <div className="mt-[18px] p-[18px] rounded-xl border border-border bg-surface-warm">
        <div className="text-[12px] text-foreground-muted font-medium">
          {serviceNames[serviceType]} · {bedroomLabels[bedrooms]} · {bathroomLabels[bathrooms]}
        </div>
        <div className="tnum font-display font-normal text-[44px] tracking-tight mt-1.5 leading-none text-foreground">
          {formatPriceRange(totalMin, totalMax)}
        </div>
        <div className="text-[12px] text-foreground-muted mt-1.5">
          Typical duration: {duration}
        </div>
      </div>

      {/* What's included */}
      <div className="mt-[22px]">
        <h3 className="text-[16px] font-semibold text-foreground">This includes:</h3>
        <ul className="mt-2.5 flex flex-col gap-2">
          {includes.map((item, index) => (
            <li key={index} className="flex gap-2.5 text-[13px] text-foreground-soft leading-normal">
              <svg
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-signal"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add-ons Section */}
      <div className="mt-[22px] pt-[18px] border-t border-border/60">
        {/* Signature PNW Protocols */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-foreground">Signature PNW Protocols</h3>
            <span className="bg-signal-soft text-signal text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Recommended
            </span>
          </div>
          <p className="text-[12px] text-foreground-muted mt-1">
            Sanitation systems optimized for Western Washington seasons.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {pnwAddonsList.map((a) => {
              const isSelected = addons.includes(a.id);
              return (
                <label
                  key={a.id}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 select-none relative",
                    isSelected
                      ? "border-2 border-signal bg-[rgba(220,229,223,0.25)]"
                      : "border-border bg-background hover:border-border-hover"
                  )}
                  style={{
                    transitionDuration: "220ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAddonToggle(a.id)}
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-signal"
                      style={{ accentColor: "#2D4A3E" }}
                    />
                    <div>
                      <div className="text-[13px] font-semibold text-foreground leading-tight">
                        {a.label}
                      </div>
                      <div className="text-[11px] text-foreground-soft mt-1 leading-normal">
                        {a.desc}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 mt-auto border-t border-border/50 flex justify-between items-center">
                    <span className="bg-signal-soft text-signal text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      PNW
                    </span>
                    <span className="text-[12px] font-semibold text-signal">
                      {a.price}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Standard Extras */}
        <div className="mt-5">
          <h3 className="text-[16px] font-semibold text-foreground">Standard extras</h3>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {standardAddonsList.map((a) => {
              const isSelected = addons.includes(a.id);
              return (
                <label
                  key={a.id}
                  className={cn(
                    "p-2.5_3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 select-none",
                    isSelected
                      ? "border-2 border-foreground bg-surface-warm"
                      : "border-border bg-background hover:border-border-hover"
                  )}
                  style={{
                    padding: "10px 12px",
                    transitionDuration: "220ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAddonToggle(a.id)}
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-foreground"
                      style={{ accentColor: "#2D2826" }}
                    />
                    <div>
                      <div className="text-[13px] font-semibold text-foreground leading-tight">
                        {a.label}
                      </div>
                      <div className="text-[11px] text-foreground-muted mt-0.5 leading-normal">
                        {a.desc}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[12px] font-semibold text-foreground-soft mt-auto">
                    {a.price}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="mt-5 p-[12px_14px] bg-surface-warm rounded-md text-[12px] text-foreground-soft leading-normal">
        Final price confirmed after booking. No surprises — if anything changes, we&apos;ll tell you first.
      </p>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="border border-border bg-background hover:bg-gray-50 text-foreground h-[52px] px-6 font-sans text-[15px] font-medium rounded-md cursor-pointer transition-all flex items-center justify-center"
          style={{
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-accent text-[#FAFAF8] hover:bg-accent-hover h-[52px] px-6 font-sans text-[15px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center"
          style={{
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
