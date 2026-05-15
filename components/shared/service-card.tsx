import Link from 'next/link';
import type { ServiceData } from '@/lib/data/services';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
    service: ServiceData;
    citySlug?: string;
    cityName?: string;
}

function CheckGlyph({ tone = "default" }: { tone?: "default" | "signal" }) {
    const color = tone === "signal" ? "text-signal" : "text-foreground-soft";
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className={`mt-1 flex-none ${color}`}
        >
            <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ServiceCard({ service, citySlug, cityName }: ServiceCardProps) {
    const eyebrowTone = service.isClimateTier ? "signal" : "default";
    const eyebrowText = service.category ?? "Service";
    const checkTone = service.isClimateTier ? "signal" : "default";

    const priceDisplay = service.priceFrom ?? service.priceRange.split('-')[0];

    const bookHref = citySlug
        ? `/${citySlug}/${service.slug}`
        : `/book?service=${service.slug}`;

    const buttonLabel = citySlug && cityName
        ? `Book ${service.name}`
        : `Book ${service.name}`;

    return (
        <article className="bg-background border border-border rounded-lg p-6 md:p-8 hover:shadow-card transition-shadow duration-[var(--motion-base)] flex flex-col h-full">
            <Eyebrow tone={eyebrowTone}>{eyebrowText}</Eyebrow>

            <h3 className="mt-3 text-[22px] md:text-[24px] font-semibold tracking-[-0.005em] text-foreground">
                {service.name}
            </h3>

            <p className="mt-3 text-[15px] leading-[1.6] text-foreground-muted">
                {service.shortDescription}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
                <span
                    className="font-display font-normal text-[36px] md:text-[44px] leading-none text-foreground"
                    style={{ fontFeatureSettings: '"tnum"' }}
                >
                    {priceDisplay}
                </span>
                <span className="text-[14px] text-foreground-muted">starting</span>
            </div>

            <p className="mt-1 text-[14px] text-foreground-muted">
                {service.duration} · supplies included
            </p>

            {service.checklist && service.checklist.length > 0 && (
                <ul className="mt-6 space-y-2 flex-grow">
                    {service.checklist.slice(0, 5).map((item) => (
                        <li key={item} className="flex gap-3 text-[14px] text-foreground-soft leading-[1.5]">
                            <CheckGlyph tone={checkTone} />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}

            <Button variant="secondary" className="mt-8 w-full" asChild>
                <Link href={bookHref}>
                    {buttonLabel}
                    {cityName && <span className="sr-only"> in {cityName}</span>}
                </Link>
            </Button>

            {citySlug && cityName && (
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
                            }
                        })
                    }}
                />
            )}
        </article>
    );
}
