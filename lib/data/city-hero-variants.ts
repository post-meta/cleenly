// Per-city hero copy variations. Use {city} as a token replaced with the city name.
// Variants are soft and verifiable — no battle stance, no competitor callouts.
// Add a city to a group below to change which variant it gets.

export interface CityHeroVariant {
    headline: string;
    subtitle: string;
}

const VARIANTS: Record<string, CityHeroVariant> = {
    eastside: {
        headline: "House cleaning in {city} — book online in minutes",
        subtitle: "See your price online. Pick a time. We bring our own supplies and do the work ourselves.",
    },
    southSound: {
        headline: "House cleaning in {city}",
        subtitle: "Real prices online — no calls required. We bring our own supplies and clean to a checklist you can see before you book.",
    },
    seattle: {
        headline: "House cleaning in {city}",
        subtitle: "See your price online. Pick a time. We work in older homes, dense apartments, and everything in between.",
    },
    northSound: {
        headline: "House cleaning in {city}",
        subtitle: "See your price online. Pick a time. We bring our own supplies and clean to a checklist you can see.",
    },
    default: {
        headline: "House cleaning in {city} — book online in minutes",
        subtitle: "See your price online. Pick a time. We bring our own supplies.",
    },
};

const CITY_GROUPS: Record<string, string[]> = {
    eastside: ["bellevue", "redmond", "kirkland", "sammamish", "mercer-island", "medina", "clyde-hill", "issaquah"],
    southSound: ["tacoma", "lakewood", "federal-way", "kent", "auburn", "renton"],
    seattle: ["seattle", "shoreline", "burien", "tukwila"],
    northSound: ["everett", "edmonds", "lynnwood", "bothell", "woodinville"],
};

export function getCityHeroVariant(citySlug?: string): CityHeroVariant {
    if (!citySlug) return VARIANTS.default;
    for (const [group, slugs] of Object.entries(CITY_GROUPS)) {
        if (slugs.includes(citySlug)) {
            return VARIANTS[group];
        }
    }
    return VARIANTS.default;
}
