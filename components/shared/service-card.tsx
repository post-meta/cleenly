import Link from 'next/link';
import type { ServiceData } from '@/lib/data/services';

interface ServiceCardProps {
    service: ServiceData;
    citySlug: string;
    cityName: string;
}

export function ServiceCard({ service, citySlug, cityName }: ServiceCardProps) {
    return (
        <article className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 hover:shadow-lg transition-all group flex flex-col h-full">
            {/* Badge */}
            <div className="mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                    Available Today
                </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 group-hover:text-foreground/80">
                {service.name}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 min-h-[60px] flex-grow">
                {service.shortDescription}
            </p>

            {/* Price & Duration */}
            <div className="flex items-center justify-between border-t border-border pt-4 mb-4">
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Price</p>
                    <p className="text-lg font-semibold text-[#D97757]">
                        {service.priceRange}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Time</p>
                    <p className="text-lg font-semibold">
                        {service.duration}
                    </p>
                </div>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span>⭐ {service.rating} ({service.reviews})</span>
                <span>🔒 Insured</span>
            </div>

            {/* CTA */}
            <Link
                href={`/${citySlug}/${service.slug}`}
                className="block w-full text-center border border-border px-4 py-2 rounded-md hover:border-foreground hover:bg-foreground hover:text-background transition-colors font-medium"
            >
                Book {service.name}
                <span className="sr-only"> in {cityName}</span>
                <span className="ml-1">→</span>
            </Link>

            {/* Service Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "serviceType": service.name,
                        "name": `${service.name} in ${cityName}`,
                        "provider": {
                            "@type": "LocalBusiness",
                            "name": "CLEENLY"
                        },
                        "areaServed": {
                            "@type": "City",
                            "name": cityName,
                            "sameAs": `https://en.wikipedia.org/wiki/${cityName},_Washington`
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": service.priceRange.split("-")[0].replace("$", ""),
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": service.rating,
                            "reviewCount": service.reviews
                        }
                    })
                }}
            />
        </article>
    );
}
