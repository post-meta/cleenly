import { CityData } from '@/lib/data/cities';
import { ServiceData } from '@/lib/data/services';

const BASE_URL = 'https://cleenly.app';

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
            "telephone": "+1-206-555-0199",
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
            "@type": "AggregateOffer",
            "lowPrice": service.priceMin,
            "highPrice": service.priceMax,
            "priceCurrency": "USD"
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
 * LocalBusiness Schema для страницы города
 */
export function generateLocalBusinessSchema(city: CityData) {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#LocalBusiness`,
        "name": "CLEENLY",
        "description": `House cleaning services in ${city.name}, WA. Regular cleaning, deep cleaning, and move-out cleaning.`,
        "url": BASE_URL,
        "telephone": "+1-206-555-0199",
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
