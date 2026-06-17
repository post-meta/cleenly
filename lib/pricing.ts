import type {
  ServiceType,
  BedroomCount,
  BathroomCount,
  SqftRange,
  HomeCondition,
  Addon,
  PriceEstimate,
} from "@/types";

// ============================================================================
// CLEENLY PRICING — SINGLE SOURCE OF TRUTH
// ----------------------------------------------------------------------------
// Market-calibrated for Greater Seattle (2025-26 research: Simply Clean,
// NW Maids, Seattle Green Maids, Rain City Maids, Thumbtack).
//
// ONE rate per cleaner-hour. Price varies by HOURS, which vary by service,
// home size, bathrooms, condition, and square footage. The estimate range
// shown up front is hours × rate — i.e. the estimate EQUALS what gets billed.
// Final price is the actual hours worked × the same rate. No flat-rate fiction,
// no "starting at $X" floor that can't be reached.
// ============================================================================

// $75 per cleaner-hour. Seattle pro market is $60-80/cleaner-hour (NW Maids
// posts $65); we sit premium-mid. A standard job is a two-cleaner team, so the
// hour figures below are TOTAL cleaner-hours (man-hours), not wall-clock.
export const HOURLY_RATE_CENTS = 7500;

// Minimum job total (cents). Covers drive time, setup, and supplies; below this
// a two-person visit isn't worth dispatching.
export const MIN_JOB_CENTS = 18500;

// ── CANONICAL MARKETING DISPLAY — single source for every price shown on site ──
// Market-calibrated (Greater Seattle 2025-26), matches the engine above at
// average condition / a representative home. Import this everywhere instead of
// hardcoding prices, so a recalibration propagates and nothing drifts.
export const PRICE_DISPLAY = {
  ratePerCleanerHour: 75,
  minJob: 185,
  // A first-time clean is priced as a deep clean (heavier first visit — market standard).
  firstClean: {
    from: 200,
    bySize: {
      "1": "$290–350",
      "2": "$440–530",
      "3": "$545–650",
      "4": "$685–825",
      "5+": "$935–1,120",
    } as Record<string, string>,
  },
  moveOut: {
    from: 280,
    bySize: {
      "1": "$380–455",
      "2": "$585–705",
      "3": "$740–885",
      "4": "$815–975",
      "5+": "$1,080–1,295",
    } as Record<string, string>,
  },
  // Lighter ongoing maintenance, from visit two onward.
  recurring: {
    from: 185,
    bySize: {
      "1": "$185–220",
      "2": "$190–225",
      "3": "$220–260",
      "4": "$255–305",
    } as Record<string, string>,
  },
  // Honest one-line framing — reuse where copy describes how pricing works.
  framing:
    "You see an upfront estimate. We bill the final price by the hour — $75 per cleaner-hour, $185 minimum — and confirm it with you before charging.",
} as const;

// Central estimated cleaner-hours for a FIRST / DEEP clean, by service & size.
// A first cleaning is always heavier than ongoing maintenance — market standard
// that the first clean runs ~2x a recurring visit. "regular" first visit is
// priced on the deep table (no recurring system live yet); recurring (visit 2+)
// uses the lighter table further down.
const baseManHours: Record<ServiceType, Record<BedroomCount, number>> = {
  regular: { studio: 2.9, "1": 3.5, "2": 4.5, "3": 5.3, "4": 6.4, "5+": 7.8 },
  deep: { studio: 2.9, "1": 3.5, "2": 4.5, "3": 5.3, "4": 6.4, "5+": 7.8 },
  move_out: { studio: 3.8, "1": 4.6, "2": 6.0, "3": 7.2, "4": 7.6, "5+": 9.0 },
};

// Lighter ongoing maintenance (visit 2+) — maintains an already-clean home.
// Roughly half the first-visit hours; near-flat by bedroom (a clean home is
// quick regardless of bathrooms/sqft), tuned to the Seattle recurring market
// (~$165 1BR, $183 2BR, $213 3BR, $233 4BR).
const recurringManHours: Record<BedroomCount, number> = {
  studio: 2.0,
  "1": 2.2,
  "2": 2.5,
  "3": 2.9,
  "4": 3.4,
  "5+": 4.3,
};

// Bathroom multiplier — more bathrooms = more time.
const bathroomMultiplier: Record<BathroomCount, number> = {
  "1": 1.0,
  "1.5": 1.08,
  "2": 1.13,
  "2.5": 1.18,
  "3": 1.23,
  "3.5+": 1.3,
};

// Condition multiplier (first/deep clean). A messier home takes longer.
const conditionMultiplier: Record<HomeCondition, number> = {
  clean: 1.0,
  average: 1.1,
  needs_work: 1.22,
};

// Square footage multiplier — protects against "2 bedrooms in 2,800 sqft".
const sqftMultiplier: Record<SqftRange, number> = {
  under_800: 1.0,
  "800_1200": 1.0,
  "1200_1800": 1.05,
  "1800_2500": 1.1,
  "2500_3500": 1.18,
  over_3500: 1.22,
  not_sure: 1.0,
};

// Add-on prices (cents) — flat, on top of the hourly estimate.
export const addonPrices: Record<Addon, number> = {
  fridge: 2500,
  oven: 2000,
  cabinets: 3000,
  laundry: 2500,
  pollen_purge: 9500,
  damp_season_reset: 8500,
};

// Add-on display info
export const addonInfo: Record<Addon, { label: string; price: string; description?: string }> = {
  fridge: {
    label: "Inside refrigerator",
    price: "+$25",
    description: "Deep scrub of shelves, drawers, and interior door gaskets.",
  },
  oven: {
    label: "Inside oven",
    price: "+$20",
    description: "Eco-friendly heat treatment and degreasing of grates and interior walls.",
  },
  cabinets: {
    label: "Inside cabinets",
    price: "+$30",
    description: "Emptying, dusting, wiping, and organizing interior shelving.",
  },
  laundry: {
    label: "Laundry (wash, dry, fold)",
    price: "+$25/load",
    description: "Washing, tumble drying, and neat folding of one load of linens/clothes.",
  },
  pollen_purge: {
    label: "The Pollen Purge Protocol",
    price: "+$95",
    description: "HEPA return-air vent vacuuming, window sill/track detailing, and deep anti-allergen fabric/upholstery dusting.",
  },
  damp_season_reset: {
    label: "Damp-Season Mold Reset",
    price: "+$85",
    description: "Targeted eco-mold prevention spray, deep bathroom tile/grout steam scrub, and sill sanitation.",
  },
};

// Turn cleaner-hours into a {min,max} price band, floored at the job minimum.
function priceFromHours(hours: number): { min: number; max: number } {
  const calc = Math.max(hours * HOURLY_RATE_CENTS, MIN_JOB_CENTS);
  return { min: Math.round(calc), max: Math.round(calc * 1.2) };
}

// First/deep clean estimate for a given configuration.
export function calculatePrice(
  serviceType: ServiceType,
  bedrooms: BedroomCount,
  bathrooms: BathroomCount,
  condition: HomeCondition = "average",
  addons: Addon[] = [],
  sqftRange?: SqftRange
): PriceEstimate {
  const hours =
    baseManHours[serviceType][bedrooms] *
    bathroomMultiplier[bathrooms] *
    conditionMultiplier[condition] *
    (sqftRange ? sqftMultiplier[sqftRange] : 1.0);

  const { min, max } = priceFromHours(hours);
  const addonsTotal = addons.reduce((sum, addon) => sum + addonPrices[addon], 0);

  return { min, max, base: min, addonsTotal };
}

// Ongoing maintenance (visit 2+) estimate. A maintained home is quick and
// predictable, so it's driven by bedroom count alone (no condition/bath/sqft
// compounding) — that's what keeps it near the market recurring rate.
function calculateRecurringPrice(
  bedrooms: BedroomCount,
  _bathrooms: BathroomCount,
  addons: Addon[] = [],
  _sqftRange?: SqftRange
): PriceEstimate {
  const { min, max } = priceFromHours(recurringManHours[bedrooms]);
  const addonsTotal = addons.reduce((sum, addon) => sum + addonPrices[addon], 0);

  return { min, max, base: min, addonsTotal };
}

export interface FirstVisitEstimate {
  /** What the customer pays on the first visit. For regular this is the deep table. */
  firstVisit: PriceEstimate;
  /** Per-visit price from visit two onward (lighter maintenance). Deep/move-out = same as firstVisit. */
  recurring: PriceEstimate;
  /** True when serviceType is regular and the first visit is priced as a deep clean. */
  firstVisitIsDeep: boolean;
}

// Every regular booking is in practice a first visit (no recurring system yet).
// The first cleaning is always heavier — first visit prices on the deep table;
// visit two onward uses the lighter maintenance table. Deep/move-out unchanged.
export function calculateFirstVisitPrice(
  serviceType: ServiceType,
  bedrooms: BedroomCount,
  bathrooms: BathroomCount,
  condition: HomeCondition = "average",
  addons: Addon[] = [],
  sqftRange?: SqftRange
): FirstVisitEstimate {
  if (serviceType !== "regular") {
    const flat = calculatePrice(serviceType, bedrooms, bathrooms, condition, addons, sqftRange);
    return { firstVisit: flat, recurring: flat, firstVisitIsDeep: false };
  }

  const firstVisit = calculatePrice("deep", bedrooms, bathrooms, condition, addons, sqftRange);
  const recurring = calculateRecurringPrice(bedrooms, bathrooms, addons, sqftRange);
  return { firstVisit, recurring, firstVisitIsDeep: true };
}

// Final billable amount (cents) from actual cleaner-hours worked. Single rate;
// no floor here — the admin sees the total and can override before invoicing.
export function calculateHourlyTotalCents(hours: number): number {
  return Math.round(hours * HOURLY_RATE_CENTS);
}

// Format price from cents to dollars
export function formatPrice(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

// Format price range
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

// Estimated wall-clock duration (a two-cleaner team works ~2x faster than the
// man-hour figure). Derived from the same hours that drive price.
export function getEstimatedDuration(
  serviceType: ServiceType,
  bedrooms: BedroomCount
): string {
  const manHours = baseManHours[serviceType][bedrooms];
  const lo = Math.max(1, Math.floor(manHours / 2));
  const hi = Math.ceil(manHours / 2) + 1;
  return `${lo}-${hi} hours`;
}

// What's included by service type
export const serviceIncludes: Record<ServiceType, string[]> = {
  regular: [
    "Dust all surfaces, ceiling fans, light fixtures",
    "Vacuum carpets/rugs, mop hard floors",
    "Wipe kitchen counters, stovetop, appliance exteriors",
    "Clean bathrooms (toilet, shower, sink, mirrors)",
    "Make beds, empty trash",
  ],
  deep: [
    "Everything in Regular Cleaning, plus:",
    "Inside microwave, oven, refrigerator",
    "Degrease stovetop and hood",
    "Baseboards, window sills, door frames",
    "Scrub grout, exhaust fans, behind toilet",
    "Behind and under furniture",
  ],
  move_out: [
    "Everything in Deep Cleaning, plus:",
    "Inside all cabinets, drawers, closets",
    "Window tracks, walls spot-cleaned",
    "Light fixtures detailed, blinds wiped",
    "Garage/patio swept if applicable",
  ],
};
