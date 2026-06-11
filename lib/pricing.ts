import type {
  ServiceType,
  BedroomCount,
  BathroomCount,
  SqftRange,
  HomeCondition,
  Addon,
  PriceEstimate,
} from "@/types";

// Minimum job total (in cents). No visit goes out below this —
// drive time + setup + supplies make smaller jobs unprofitable.
export const MIN_JOB_CENTS = 16500;

// Base prices by service type and bedroom count (in cents)
// Seattle 2026 market-aligned; aggressive premium-mid positioning.
const basePrices: Record<ServiceType, Record<BedroomCount, number>> = {
  regular: {
    studio: 14000,
    "1": 16500,
    "2": 20000,
    "3": 24000,
    "4": 30000,
    "5+": 36000,
  },
  deep: {
    studio: 20000,
    "1": 25000,
    "2": 33500,
    "3": 40000,
    "4": 48000,
    "5+": 59000,
  },
  move_out: {
    studio: 25000,
    "1": 32000,
    "2": 42000,
    "3": 52000,
    "4": 62000,
    "5+": 75000,
  },
};

// Bathroom multiplier
const bathroomMultiplier: Record<BathroomCount, number> = {
  "1": 1.0,
  "1.5": 1.1,
  "2": 1.15,
  "2.5": 1.2,
  "3": 1.25,
  "3.5+": 1.35,
};

// Condition multiplier
const conditionMultiplier: Record<HomeCondition, number> = {
  clean: 1.0,
  average: 1.1,
  needs_work: 1.25,
};

// Square footage multiplier. Protects against "2 bedrooms in 2,800 sqft".
// Keys match the existing SqftRange enum — no DB migration needed.
// "not_sure" is no longer offered in the wizard; kept at 1.0 for old rows.
const sqftMultiplier: Record<SqftRange, number> = {
  under_800: 1.0,
  "800_1200": 1.0,
  "1200_1800": 1.1,
  "1800_2500": 1.2,
  "2500_3500": 1.35,
  over_3500: 1.35,
  not_sure: 1.0,
};

// Add-on prices (in cents)
export const addonPrices: Record<Addon, number> = {
  fridge: 2500,
  oven: 2000,
  cabinets: 3000,
  laundry: 2500,
  pollen_purge: 9500,
  damp_season_reset: 8500,
};

// Addon display info
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

// Calculate price range
export function calculatePrice(
  serviceType: ServiceType,
  bedrooms: BedroomCount,
  bathrooms: BathroomCount,
  condition: HomeCondition = "average",
  addons: Addon[] = [],
  sqftRange?: SqftRange
): PriceEstimate {
  const base = basePrices[serviceType][bedrooms];
  const bathMult = bathroomMultiplier[bathrooms];
  const condMult = conditionMultiplier[condition];
  const sqftMult = sqftRange ? sqftMultiplier[sqftRange] : 1.0;

  let calculated = base * bathMult * condMult * sqftMult;

  // Minimum job floor — addons go on top.
  calculated = Math.max(calculated, MIN_JOB_CENTS);

  // Calculate addons total
  const addonsTotal = addons.reduce((sum, addon) => sum + addonPrices[addon], 0);

  return {
    min: Math.round(calculated),
    max: Math.round(calculated * 1.2),
    base: Math.round(calculated),
    addonsTotal,
  };
}

export interface FirstVisitEstimate {
  /** What the customer pays on the first visit. For regular this is the deep-clean table. */
  firstVisit: PriceEstimate;
  /** Per-visit price from visit two onward (regular table). For deep/move_out same as firstVisit. */
  recurring: PriceEstimate;
  /** True when serviceType is regular and the first visit is priced as a deep clean. */
  firstVisitIsDeep: boolean;
}

// Every regular booking is in practice a first visit (no recurring system yet).
// Owner decision: the first cleaning is always heavier — first visit prices by
// the deep table, visit two onward by the regular table. Deep/move-out unchanged.
export function calculateFirstVisitPrice(
  serviceType: ServiceType,
  bedrooms: BedroomCount,
  bathrooms: BathroomCount,
  condition: HomeCondition = "average",
  addons: Addon[] = [],
  sqftRange?: SqftRange
): FirstVisitEstimate {
  const recurring = calculatePrice(serviceType, bedrooms, bathrooms, condition, addons, sqftRange);

  if (serviceType !== "regular") {
    return { firstVisit: recurring, recurring, firstVisitIsDeep: false };
  }

  const firstVisit = calculatePrice("deep", bedrooms, bathrooms, condition, addons, sqftRange);
  return { firstVisit, recurring, firstVisitIsDeep: true };
}

// Format price from cents to dollars
export function formatPrice(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

// Format price range
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

// Get estimated duration based on service and home size
export function getEstimatedDuration(
  serviceType: ServiceType,
  bedrooms: BedroomCount
): string {
  const durations: Record<ServiceType, Record<BedroomCount, string>> = {
    regular: {
      studio: "1-1.5 hours",
      "1": "1.5-2 hours",
      "2": "2-2.5 hours",
      "3": "2.5-3.5 hours",
      "4": "3-4 hours",
      "5+": "4-5 hours",
    },
    deep: {
      studio: "2-2.5 hours",
      "1": "2.5-3 hours",
      "2": "3-4 hours",
      "3": "3.5-5 hours",
      "4": "4-6 hours",
      "5+": "5-7 hours",
    },
    move_out: {
      studio: "2-3 hours",
      "1": "3-4 hours",
      "2": "4-5 hours",
      "3": "5-6 hours",
      "4": "5-7 hours",
      "5+": "6-8 hours",
    },
  };

  return durations[serviceType][bedrooms];
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
