"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface CityHeroProps {
    cityName: string;
    description: string;
}

export function CityHero({ cityName, description }: CityHeroProps) {
    return (
        <section className="relative flex min-h-[70vh] items-center overflow-hidden animate-fadeInUp bg-background py-16 md:py-0">
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 relative z-10 w-full">
                {/* Left Content - 6 columns */}
                <div className="col-span-12 space-y-8 md:col-span-6 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
                        House Cleaning in {cityName} — Book Online in Minutes
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed">
                        {description || `House cleaning for ${cityName} homes. See your price upfront. Choose your cleaner. Schedule when it works for you.`}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                        <Button variant="primary" size="lg" asChild>
                            <Link href="/book">Get Your Price →</Link>
                        </Button>
                        <Button variant="link" asChild>
                            <Link href="/services">See All Services</Link>
                        </Button>
                    </div>
                </div>

                {/* Right Content - Hero Image */}
                <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                    <img
                        src="/hero-image.jpg"
                        alt={`Bright empty living room in ${cityName} with morning light`}
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
    priceRange: string;
    citySlug: string;
}

export function ServiceHero({ cityName, serviceName, introText, priceRange, citySlug }: ServiceHeroProps) {
    return (
        <section className="relative flex min-h-[70vh] items-center overflow-hidden animate-fadeInUp bg-background py-16 md:py-0">
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 relative z-10 w-full">
                {/* Left Content - 6 columns */}
                <div className="col-span-12 space-y-8 md:col-span-6 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
                        {serviceName} in {cityName} — Starting at {priceRange.split('-')[0]}
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed">
                        {introText}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                        <Button variant="primary" size="lg" asChild>
                            <Link href="/book">Get Your Price →</Link>
                        </Button>
                        <Button variant="link" asChild>
                            <Link href={`/${citySlug}`}>More in {cityName}</Link>
                        </Button>
                    </div>
                </div>

                {/* Right Content - Hero Image */}
                <div className="col-span-12 md:col-span-6 flex items-center justify-center">
                    <img
                        src="/hero-image.jpg"
                        alt={`${serviceName} service in ${cityName}`}
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
