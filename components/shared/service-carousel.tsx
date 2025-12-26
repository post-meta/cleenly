'use client';

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ServiceCard } from "./service-card";
import { ServiceData } from "@/lib/data/services";
import { CityData } from "@/lib/data/cities";

interface ServiceCarouselProps {
    services: ServiceData[];
    city: CityData;
}

export function ServiceCarousel({ services, city }: ServiceCarouselProps) {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4 pb-4">
                {services.map((service, index) => (
                    <CarouselItem key={service.slug} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div className="h-full">
                            <ServiceCard
                                service={service}
                                citySlug={city.slug}
                                cityName={city.name}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Navigation buttons (hidden on mobile for cleanliness, visible on desktop) */}
            <div className="hidden md:block">
                <CarouselPrevious className="-left-12 h-12 w-12 border-none bg-stone-100 hover:bg-stone-200 text-gray-600" />
                <CarouselNext className="-right-12 h-12 w-12 border-none bg-stone-100 hover:bg-stone-200 text-gray-600" />
            </div>
        </Carousel>
    );
}
