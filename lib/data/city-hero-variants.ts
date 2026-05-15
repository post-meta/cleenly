// Per-city hero copy variations. Used by <CityHero>.
// The headline template is unified: "House cleaning <em>{italicPhrase}</em> in {city}."
// Italic phrases approved in design system v2 (§ 5.3.1).

export interface CityHeroVariant {
    italicPhrase: string;
    subtitle: string;
}

const VARIANTS: Record<string, CityHeroVariant> = {
    eastside: {
        italicPhrase: "for homes built to last,",
        subtitle: "See your price online. Pick a time. We bring our own supplies and do the work ourselves.",
    },
    southSound: {
        italicPhrase: "for the way you actually live,",
        subtitle: "Real prices online — no calls required. We bring our own supplies and clean to a checklist you can see before you book.",
    },
    seattle: {
        italicPhrase: "that quietly takes care of it,",
        subtitle: "See your price online. Pick a time. We work in older homes, dense apartments, and everything in between.",
    },
    northSound: {
        italicPhrase: "that fits how you live in this climate,",
        subtitle: "See your price online. Pick a time. We bring our own supplies and clean to a checklist you can see.",
    },
    default: {
        italicPhrase: "for the way you actually live,",
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
