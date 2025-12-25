import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react'; // Changed icon for a more modern feel
import { ServiceData } from '@/lib/data/services';
import { cn } from '@/lib/utils'; // Assuming cn exists, if not I'll use template literals but standard shadcn projects have it

interface ServiceCardProps {
    service: ServiceData;
    citySlug: string;
    cityName: string;
    cityWikipediaUrl?: string;
    index?: number; // Added index for gradient selection
}

const GRADIENTS = [
    // 1. Blue -> Pink (Like "Back To School")
    "bg-gradient-to-br from-blue-300 via-blue-400 to-purple-400 text-white",
    // 2. Dark/Rich (Like "Make The Most") - tweaked for readability
    "bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 text-white",
    // 3. Yellow -> Orange (Like "Shop Smarter") - need dark text for this one? Or just darker orange.
    // Let's go with a vibrant Orange -> Red for white text safety
    "bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white",
    // 4. Pink -> Purple (Like "Do Like The Greats")
    "bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-500 text-white",
    // 5. Teal -> Blue (Fresh option)
    "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 text-white",
];

export function ServiceCard({ service, citySlug, cityName, cityWikipediaUrl, index = 0 }: ServiceCardProps) {
    // Select gradient based on index
    const gradientClass = GRADIENTS[index % GRADIENTS.length];

    return (
        <Link
            href={`/${citySlug}/${service.slug}`}
            className={cn(
                "group relative flex flex-col h-[420px] justify-between p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl",
                gradientClass
            )}
        >
            {/* Background "Card Stack" Effect (Pseudo-element optional, kept simple for now) */}

            {/* Top Content */}
            <div className="space-y-4">
                <h3 className="text-3xl font-bold leading-tight tracking-tight">
                    {service.name}
                </h3>

                <p className="font-medium opacity-90 text-lg">
                    {service.priceRange}
                </p>

                <p className="text-base opacity-80 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                </p>
            </div>

            {/* Bottom Content */}
            <div className="mt-auto pt-6 flex items-center justify-between">
                <div>
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium border border-white/10 group-hover:bg-white/30 transition-colors">
                        Book Now
                    </span>
                </div>

                {/* Arrow Button */}
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 transform group-hover:rotate-45">
                    <ArrowUpRight className="w-5 h-5" />
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
