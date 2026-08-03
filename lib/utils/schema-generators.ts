import { CityData } from '@/lib/data/cities';
import { ServiceData } from '@/lib/data/services';
import { PRICE_DISPLAY } from '@/lib/pricing';

const BASE_URL = 'https://cleenly.app';

// Each service's real "from" floor comes straight from its own priceMin in
// lib/data/services.ts (the single source of truth), so the JSON-LD Offer price
// matches the price shown on the page instead of a bucketed approximation.
function serviceFromPrice(service: ServiceData): number {
    return service.priceMin ?? PRICE_DISPLAY.firstClean.from;
}

// priceSpecification reused across Service offers. Public copy quotes a price
// for the job, so the schema states the minimum and the estimate floor rather
// than a rate per hour.
function hourlyPriceSpecification() {
    return {
        "@type": "PriceSpecification",
        "priceCurrency": "USD",
        "minPrice": PRICE_DISPLAY.minJob
    };
}

/**
 * Service Schema для страницы город+услуга
 */
export function generateServiceSchema(city: CityData, service: ServiceData) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${service.name} in ${city.name}`,
        "description": `House ${service.name.toLowerCase()} in ${city.name}, WA. ${service.shortDescription}`,
        "serviceType": service.name,
        "provider": {
            "@type": "LocalBusiness",
            "@id": `${BASE_URL}/#LocalBusiness`,
            "name": "CLEENLY",
            "telephone": "+1-206-641-4739",
            "email": "hello@cleenly.app",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Seattle",
                "addressRegion": "WA",
                "addressCountry": "US"
            }
        },
        "areaServed": {
            "@type": "City",
            "name": city.name,
            "containedInPlace": {
                "@type": "State",
                "name": "Washington"
            }
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": city.coordinates.lat,
            "longitude": city.coordinates.lng
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": serviceFromPrice(service),
            "priceSpecification": hourlyPriceSpecification(),
            "description": `Upfront estimate from $${serviceFromPrice(service)}. The final price never goes above the top of your estimate, and we confirm it before charging.`
        },
        "url": `${BASE_URL}/${city.slug}/${service.slug}`
    };
}

/**
 * FAQPage Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(
    items: Array<{ name: string; url?: string }>
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            ...(item.url && { "item": item.url })
        }))
    };
}

/**
 * Service Schema for the standalone /services/[service] page (no city scope).
 * Lists all served cities in areaServed so Google understands geographic coverage.
 */
export function generateGenericServiceSchema(service: ServiceData, allCities: CityData[]) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": `${service.name} in Greater Seattle. ${service.shortDescription}`,
        "serviceType": service.name,
        "provider": {
            "@type": "LocalBusiness",
            "@id": `${BASE_URL}/#LocalBusiness`,
            "name": "CLEENLY",
            "telephone": "+1-206-641-4739",
            "email": "hello@cleenly.app",
            "url": BASE_URL,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Seattle",
                "addressRegion": "WA",
                "addressCountry": "US"
            }
        },
        "areaServed": allCities.map(city => ({
            "@type": "City",
            "name": city.name,
            "containedInPlace": { "@type": "State", "name": "Washington" }
        })),
        "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": serviceFromPrice(service),
            "priceSpecification": hourlyPriceSpecification(),
            "description": `Upfront estimate from $${serviceFromPrice(service)}. The final price never goes above the top of your estimate, and we confirm it before charging.`
        },
        "url": `${BASE_URL}/services/${service.slug}`
    };
}

/**
 * LocalBusiness Schema для страницы города
 */
// CLEENLY is a service-area business: the crew travels, there is no storefront
// a customer walks into. The declared locality is the home base (Tacoma, as
// stated in public/llms.txt), and every city we actually cover is listed in
// areaServed so Google can match the site to the Google Business Profile
// instead of guessing from a single city name.
const HOME_BASE = {
    locality: "Tacoma",
    region: "WA",
    lat: 47.2529,
    lng: -122.4443,
} as const;

export function generateLocalBusinessSchema(city: CityData, allCities?: CityData[]) {
    const served = (allCities ?? [city]).map(c => ({
        "@type": "City",
        "name": `${c.name}, WA`
    }));

    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#LocalBusiness`,
        "name": "CLEENLY",
        "alternateName": "Pro Craft Cleaning",
        "description": "House cleaning across Greater Seattle — from Everett in the north through Seattle and the Eastside to Tacoma, Lakewood, and Gig Harbor. Regular cleaning, deep cleaning, and move-out cleaning.",
        "url": BASE_URL,
        "telephone": "+1-206-641-4739",
        "email": "hello@cleenly.app",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": HOME_BASE.locality,
            "addressRegion": HOME_BASE.region,
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": HOME_BASE.lat,
            "longitude": HOME_BASE.lng
        },
        "areaServed": served,
        "priceRange": "$$",
        // When a visit can actually happen. Mirrored from availability_rules,
        // which in turn matches the main hours on the Google Business Profile —
        // Saturday really is shorter. The 08:00-20:00 seven-day block that used
        // to sit here matched none of them.
        //
        // The phone is answered around the clock by the voice agent, and the
        // profile states that separately under "online service hours". That is
        // reachability, not a slot someone can book, so it does not belong here.
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday"],
                "opens": "09:00",
                "closes": "16:00"
            }
        ]
    };
}
