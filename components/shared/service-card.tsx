"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
    service: {
        slug: string;
        name: string;
        shortDescription: string;
        priceRange: string;
        priceMin: number;
        priceMax: number;
        duration: string;
    };
    city: {
        slug: string;
        name: string;
    };
}

export function ServiceCard({ service, city }: ServiceCardProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-[12px] p-8 hover:border-accent/40 transition-all shadow-sm hover:shadow-md flex flex-col h-full group">
            {/* Availability Badge */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span>
                Available Today
            </div>

            {/* Service Name */}
            <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors">{service.name}</h3>

            {/* Description */}
            <p className="text-gray-600 mb-6 text-sm flex-1 leading-relaxed">{service.shortDescription}</p>

            {/* Price & Duration */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-semibold text-foreground">{service.priceRange}</span>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-medium">{service.duration}</div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs">
                    <span className="text-yellow-400">★</span> 4.8 (47)
                </span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs">
                    <span className="text-gray-400">🛡️</span> Insured
                </span>
            </div>

            {/* CTA */}
            <Button variant="secondary" asChild className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
                <Link
                    href={`/${city.slug}/${service.slug}`}
                >
                    Book {service.name} →
                </Link>
            </Button>

            {/* Hidden Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": `${service.name} in ${city.name}`,
                        "description": service.shortDescription,
                        "brand": {
                            "@type": "Brand",
                            "name": "CLEENLY"
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "lowPrice": service.priceMin,
                            "highPrice": service.priceMax,
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock",
                            "url": `https://cleenly.app/${city.slug}/${service.slug}`
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "reviewCount": "47"
                        }
                    })
                }}
            />
        </div>
    );
}
