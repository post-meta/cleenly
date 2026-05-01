export const SITE_NAME = "Cleenly";
export const SITE_TAGLINE = "We clean. You live.";
export const SITE_DESCRIPTION =
  "Book cleaning services in Greater Seattle area. Choose your cleaner, see the price, book online.";

export const SITE_URL = "https://cleenly.app";
export const SERVICE_AREA = "Greater Seattle";

export const PHONE_E164 = "+12066414739";
export const PHONE_DISPLAY = "(206) 641-4739";
export const PHONE_TEL_HREF = `tel:${PHONE_E164}`;
export const PHONE_SMS_HREF = `sms:${PHONE_E164}`;
export const SUPPORT_EMAIL = "hello@cleenly.app";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
] as const;

// Service types used as labels in booking form select.
// Authoritative pricing logic lives in lib/pricing.ts (calculator).
// Authoritative display ranges live in lib/data/services.ts (priceRange field per service).
export const SERVICE_TYPES = {
  regular: {
    id: "regular",
    name: "Regular Cleaning",
    description: "Routine maintenance cleaning for your home",
  },
  deep: {
    id: "deep",
    name: "Deep Cleaning",
    description: "Thorough top-to-bottom cleaning",
  },
  move_out: {
    id: "move_out",
    name: "Move-out Cleaning",
    description: "Get your deposit back. Full apartment reset",
  },
} as const;

export const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 4pm" },
  { id: "evening", label: "Evening", time: "4pm – 8pm" },
] as const;
