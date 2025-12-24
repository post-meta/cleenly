"use client";

import React from 'react';

interface ServiceCarouselProps {
    children: React.ReactNode;
}

export function ServiceCarousel({ children }: ServiceCarouselProps) {
    return (
        <div className="relative w-full overflow-hidden">
            {/* Gradient hints for scrollability */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 md:hidden" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 md:hidden" />

            {/* Scrollable container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 pt-2 px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible hide-scrollbar">
                {children}
            </div>
        </div>
    );
}
