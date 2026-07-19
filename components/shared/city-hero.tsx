"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { getCityHeroVariant } from "@/lib/data/city-hero-variants";
import { PRICE_DISPLAY } from "@/lib/pricing";

// Pick the canonical "from" price for a service from the single source of truth.
// Move-related services price on the move-out table; everything else on the
// first/deep table. Recurring-style maintenance uses the recurring floor.
function fromPriceForService(serviceName: string): number {
    const name = serviceName.toLowerCase();
    if (name.includes("move-out") || name.includes("move out") || name.includes("post-construction")) {
        return PRICE_DISPLAY.moveOut.from;
    }
    if (name.includes("bi-weekly") || name.includes("recurring")) {
        return PRICE_DISPLAY.recurring.from;
    }
    return PRICE_DISPLAY.firstClean.from;
}

interface CityHeroProps {
    cityName: string;
    citySlug?: string;
    description: string;
}

export function CityHero({ cityName, citySlug, description }: CityHeroProps) {
    const variant = getCityHeroVariant(citySlug);

    return (
        <section className="relative flex min-h-[70vh] items-center overflow-hidden animate-fadeInUp bg-background py-16 md:py-0">
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 relative z-10 w-full">
                {/* Left Content - 6 columns */}
                <div className="col-span-12 space-y-8 md:col-span-6 flex flex-col justify-center">
                    <h1 className="font-display font-normal text-[44px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.025em] text-foreground">
                        House cleaning <em className="italic text-foreground-soft">{variant.italicPhrase}</em> in {cityName}.
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed">
                        {description || variant.subtitle.replace("{city}", cityName)}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                        <Button variant="primary" size="lg" asChild>
                            <Link href="/book">Get your price →</Link>
                        </Button>
                        <Button variant="link" asChild>
                            <Link href="/services">See all services</Link>
                        </Button>
                    </div>
                </div>

                {/* Right Content - Hero Image */}
                <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                    <Image
                        src="/hero-image.jpg"
                        alt={`Calm clean kitchen in a ${cityName} home with soft morning light`}
                        width={800}
                        height={600}
                        priority
                        className="w-full h-auto rounded-xl object-cover aspect-[4/3] shadow-lg"
                    />
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-6 hidden md:block opacity-50">
                <p className="text-sm font-medium tracking-widest uppercase text-gray-500">
                    We clean. You live.
                </p>
            </div>
        </section>
    );
}

interface ServiceHeroProps {
    cityName: string;
    serviceName: string;
    introText: string;
    /** The service's real "from" floor (service.priceMin) — keeps the hero in sync with the page + JSON-LD. */
    fromPrice: number;
    /** Deprecated: no longer used; accepted for call-site compatibility. */
    priceRange?: string;
    citySlug: string;
    heroImage?: string;
}

export function ServiceHero({ cityName, serviceName, introText, citySlug, heroImage, fromPrice }: ServiceHeroProps) {
    const imageSrc = heroImage || "/hero-image.jpg";
    return (
        <section className="relative flex min-h-[70vh] items-center overflow-hidden animate-fadeInUp bg-background py-16 md:py-0">
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 relative z-10 w-full">
                {/* Left Content - hero image */}
                <div className="col-span-12 md:col-span-6 flex items-center justify-center order-1 md:order-1">
                    <Image
                        src={imageSrc}
                        alt={`${serviceName} in ${cityName}`}
                        width={800}
                        height={600}
                        priority
                        className="w-full h-auto rounded-2xl object-cover aspect-[4/3] shadow-sm"
                    />
                </div>

                {/* Right Content - text */}
                <div className="col-span-12 space-y-8 md:col-span-6 flex flex-col justify-center order-2 md:order-2">
                    {/* TODO: per-service italic phrases pending sign-off (Chunk E). Typography in font-display, no italic phrase yet. */}
                    <h1 className="font-display font-normal text-[44px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.025em] text-foreground">
                        {serviceName} in {cityName} — from ${fromPrice}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        {introText}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                        <Button variant="primary" size="lg" asChild>
                            <Link href="/book">Get your price →</Link>
                        </Button>
                        <Button variant="link" asChild>
                            <Link href={`/${citySlug}`}>More in {cityName}</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-6 hidden md:block opacity-50">
                <p className="text-sm font-medium tracking-widest uppercase text-gray-500">
                    We clean. You live.
                </p>
            </div>
        </section>
    );
}
