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

// Hourly priceSpecification reused across Service offers — final price is the
// actual cleaner-hours worked at the single rate, not a flat fee or "starting at".
function hourlyPriceSpecification() {
    return {
        "@type": "UnitPriceSpecification",
        "price": PRICE_DISPLAY.ratePerCleanerHour,
        "priceCurrency": "USD",
        "unitText": "cleaner-hour",
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
            "description": `Upfront estimate from $${serviceFromPrice(service)}. Final price is the actual cleaner-hours worked at $${PRICE_DISPLAY.ratePerCleanerHour}/cleaner-hour ($${PRICE_DISPLAY.minJob} minimum), confirmed before charging.`
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
            "description": `Upfront estimate from $${serviceFromPrice(service)}. Final price is the actual cleaner-hours worked at $${PRICE_DISPLAY.ratePerCleanerHour}/cleaner-hour ($${PRICE_DISPLAY.minJob} minimum), confirmed before charging.`
        },
        "url": `${BASE_URL}/services/${service.slug}`
    };
}

/**
 * LocalBusiness Schema для страницы города
 */
export function generateLocalBusinessSchema(city: CityData) {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#LocalBusiness`,
        "name": "CLEENLY",
        "alternateName": "Pro Craft Cleaning",
        "description": `House cleaning services in ${city.name}, WA. Regular cleaning, deep cleaning, and move-out cleaning.`,
        "url": BASE_URL,
        "telephone": "+1-206-641-4739",
        "email": "hello@cleenly.app",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": city.name,
            "addressRegion": "WA",
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": city.coordinates.lat,
            "longitude": city.coordinates.lng
        },
        "areaServed": {
            "@type": "City",
            "name": city.name
        },
        "priceRange": "$$",
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "08:00",
            "closes": "20:00"
        }
    };
}
