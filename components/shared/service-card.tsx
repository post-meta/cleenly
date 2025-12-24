import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceData } from '@/lib/data/services';

interface ServiceCardProps {
    service: ServiceData;
    citySlug: string;
    cityName: string;
    cityWikipediaUrl?: string;
}

export function ServiceCard({ service, citySlug, cityName, cityWikipediaUrl }: ServiceCardProps) {
    return (
        <Link
            href={`/${citySlug}/${service.slug}`}
            className="group relative flex flex-col h-full justify-between p-6 bg-stone-50/50 hover:bg-stone-100 rounded-xl transition-all duration-300"
        >
            {/* Upper part: Title and Price */}
            <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-xl font-medium text-gray-900 group-hover:text-accent transition-colors">
                        {service.name}
                    </h3>
                </div>

                <div className="text-sm font-medium text-gray-500 mb-4">
                    {service.priceRange}
                </div>

                {/* Description: strictly 3 lines */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {service.shortDescription}
                </p>
            </div>

            {/* Lower part: Interactive element */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">
                    View Details
                </span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>

            {/* SEO Schema (Hidden) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": `${service.name} in ${cityName}`,
                        "description": service.shortDescription,
                        "areaServed": {
                            "@type": "City",
                            "name": cityName,
                            "sameAs": cityWikipediaUrl
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": service.priceRange.replace(/[^0-9-]/g, '').split('-')[0],
                            "priceCurrency": "USD"
                        }
                    })
                }}
            />
            <span className="sr-only">Book {service.name} in {cityName}</span>
        </Link>
    );
}
