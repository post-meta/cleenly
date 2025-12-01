import type {
  ServiceType,
  BedroomCount,
  BathroomCount,
  HomeCondition,
  Addon,
  PriceEstimate,
} from "@/types";

// Base prices by service type and bedroom count (in cents)
const basePrices: Record<ServiceType, Record<BedroomCount, number>> = {
  regular: {
    studio: 8000,
    "1": 10000,
    "2": 12000,
    "3": 14000,
    "4": 18000,
    "5+": 22000,
  },
  deep: {
    studio: 14000,
    "1": 16000,
    "2": 20000,
    "3": 24000,
    "4": 30000,
    "5+": 38000,
  },
  move_out: {
    studio: 15000,
    "1": 18000,
    "2": 25000,
    "3": 32000,
    "4": 40000,
    "5+": 50000,
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

// Add-on prices (in cents)
export const addonPrices: Record<Addon, number> = {
  fridge: 2500,
  oven: 2000,
  cabinets: 3000,
  laundry: 2500,
  windows: 500,
};

// Addon display info
export const addonInfo: Record<Addon, { label: string; price: string }> = {
  fridge: { label: "Inside refrigerator", price: "+$25" },
  oven: { label: "Inside oven", price: "+$20" },
  cabinets: { label: "Inside cabinets", price: "+$30" },
  laundry: { label: "Laundry (wash, dry, fold)", price: "+$25/load" },
  windows: { label: "Interior windows", price: "+$5/window" },
};

// Calculate price range
export function calculatePrice(
  serviceType: ServiceType,
  bedrooms: BedroomCount,
  bathrooms: BathroomCount,
  condition: HomeCondition = "average",
  addons: Addon[] = []
): PriceEstimate {
  const base = basePrices[serviceType][bedrooms];
  const bathMult = bathroomMultiplier[bathrooms];
  const condMult = conditionMultiplier[condition];

  const calculated = base * bathMult * condMult;

  // Calculate addons total
  const addonsTotal = addons.reduce((sum, addon) => sum + addonPrices[addon], 0);

  return {
    min: Math.round(calculated),
    max: Math.round(calculated * 1.2),
    base: Math.round(calculated),
    addonsTotal,
  };
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
