export const SITE_NAME = "Cleenly";
export const SITE_TAGLINE = "We clean. You live.";
export const SITE_DESCRIPTION =
  "Book cleaning services in Greater Seattle area. Choose your cleaner, see the price, book online.";

export const SERVICE_AREA = "Greater Seattle";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export const SERVICE_TYPES = {
  regular: {
    id: "regular",
    name: "Regular Cleaning",
    description: "Routine maintenance cleaning for your home",
    basePrice: 12000, // $120 in cents
  },
  deep: {
    id: "deep",
    name: "Deep Cleaning",
    description: "Thorough top-to-bottom cleaning",
    basePrice: 20000, // $200 in cents
  },
  move_out: {
    id: "move_out",
    name: "Move-out Cleaning",
    description: "Get your deposit back. Full apartment reset",
    basePrice: 25000, // $250 in cents
  },
} as const;

export const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 4pm" },
  { id: "evening", label: "Evening", time: "4pm – 8pm" },
] as const;

// Price modifiers per bedroom/bathroom
export const PRICE_PER_BEDROOM = 2500; // $25 in cents
export const PRICE_PER_BATHROOM = 2000; // $20 in cents
export const PRICE_PER_SQFT = 5; // $0.05 per sqft

// Price range variance (for showing min-max range)
export const PRICE_VARIANCE = 0.15; // 15% variance
