import Link from 'next/link';
import { ServiceData } from '@/lib/data/services';

interface ServiceCardProps {
    service: ServiceData;
    citySlug: string;
    cityName: string;
}

export function ServiceCard({ service, citySlug, cityName }: ServiceCardProps) {
    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-foreground/20 min-w-[280px] max-w-[320px] snap-center">

            {/* Availability Badge */}
            <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Available Today
                </span>
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                    {service.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                    {service.shortDescription}
                </p>
            </div>

            <div className="space-y-4">
                {/* Price & Duration */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-foreground">{service.priceRange}</span>
                        <span className="text-xs text-muted-foreground">Est. Price</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-foreground">{service.duration}</span>
                        <span className="text-xs text-muted-foreground">Duration</span>
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-foreground">{service.rating}</span>
                        <span className="text-muted-foreground">({service.reviews})</span>
                    </div>
                    <span className="h-3 w-[1px] bg-border"></span>
                    <div className="flex items-center gap-1">
                        <span>🔒</span>
                        <span>Insured</span>
                    </div>
                </div>

                {/* Smart SEO Link with sr-only context */}
                <Link
                    href={`/${citySlug}/${service.slug}`}
                    title={`${service.name} in ${cityName}`}
                    className="flex w-full items-center justify-center rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                    Book {service.name}
                    {/* Hidden text for SEO and screen readers */}
                    <span className="sr-only"> in {cityName}</span>
                    <span className="ml-2">→</span>
                </Link>
            </div>
        </div>
    );
}
