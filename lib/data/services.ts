export interface ServiceData {
    slug: string;
    name: string;
    shortDescription: string;
    longDescription?: string;
    priceRange: string;
    priceMin?: number;
    priceMax?: number;
    duration: string;
    checklist?: string[];
    notIncluded?: string[];
    bestFor?: string[];
    faqs?: {
        question: string;
        answer: string;
    }[];
    rating: string;
    reviews: number;
}

export const services: ServiceData[] = [
    {
        slug: "regular-cleaning",
        name: "Regular Cleaning",
        shortDescription: "Dust, vacuum, mop. Bathrooms and kitchen cleaned. Good for homes that get cleaned weekly or bi-weekly.",
        longDescription: 'Regular cleaning covers all the essentials: dusting, vacuuming, mopping, bathroom and kitchen cleaning. Best for homes that are already in good shape and need weekly or bi-weekly maintenance.',
        priceRange: "$100-$200",
        priceMin: 100,
        priceMax: 200,
        duration: "2-3 hours",
        rating: "4.9",
        reviews: 127,
        checklist: [
            'Dust all reachable surfaces',
            'Vacuum carpets and rugs',
            'Vacuum and mop hard floors',
            'Clean bathrooms (toilet, shower, sink, mirrors)',
            'Wipe kitchen counters and appliance exteriors',
            'Wipe cabinet fronts',
            'Empty trash can',
            'Make beds (linens changed if left out)',
        ],
        notIncluded: [
            'Inside oven or refrigerator',
            'Inside cabinets',
            'Baseboards',
            'Windows',
            'Laundry',
        ],
        bestFor: [
            'Weekly or bi-weekly maintenance',
            'Homes already in good condition',
            'Busy households needing regular help',
        ],
        faqs: [
            {
                question: 'How often should I book regular cleaning?',
                answer: 'Most customers book every 1-2 weeks. Weekly cleaning keeps your home consistently fresh. Bi-weekly works well for smaller households or homes with less traffic.',
            },
            {
                question: 'What if my home hasn\'t been cleaned in a while?',
                answer: 'We recommend starting with a deep cleaning first, then switching to regular cleaning for maintenance. This gives us a clean baseline to work from.',
            },
            {
                question: 'Can I customize what\'s included?',
                answer: 'Yes. You can add extras like inside refrigerator, oven cleaning, or laundry during booking. You can also skip areas you don\'t need cleaned.',
            },
        ],
    },
    {
        slug: "deep-cleaning",
        name: "Deep Cleaning",
        shortDescription: "Everything in regular cleaning plus inside oven, fridge, baseboards, ceiling fans. Good for first-time or seasonal cleaning.",
        longDescription: 'Deep cleaning covers everything in regular cleaning plus the areas that build up over time: inside appliances, baseboards, window sills, ceiling fans, and behind furniture. Recommended for first-time cleanings or homes that need extra attention.',
        priceRange: "$150-$300",
        priceMin: 150,
        priceMax: 300,
        duration: "3-5 hours",
        rating: "4.8",
        reviews: 89,
        checklist: [
            'Everything in regular cleaning',
            'Inside oven',
            'Inside refrigerator',
            'Inside microwave',
            'Baseboards throughout',
            'Window sills and tracks',
            'Ceiling fans and light fixtures',
            'Door frames and tops of doors',
            'Cabinet fronts (detailed)',
            'Behind and under furniture (accessible areas)',
        ],
        notIncluded: [
            'Inside cabinets and drawers',
            'Walls (full wash)',
            'Exterior windows',
            'Garage',
            'Laundry (available as add-on)',
        ],
        bestFor: [
            'First-time cleanings',
            'Seasonal deep clean (spring, fall)',
            'Homes not cleaned in 1+ months',
            'Before hosting guests or events',
        ],
        faqs: [
            {
                question: 'How long does deep cleaning take?',
                answer: 'Most deep cleanings take 3-5 hours depending on home size. A 3-bedroom home typically takes about 4 hours.',
            },
            {
                question: 'How is deep cleaning different from regular cleaning?',
                answer: 'Regular cleaning maintains surfaces. Deep cleaning tackles buildup — inside appliances, baseboards, ceiling fans, and areas that get skipped during routine cleaning. It takes about 50% longer and costs more.',
            },
            {
                question: 'How often should I get a deep cleaning?',
                answer: 'Most homes benefit from a deep cleaning every 3-6 months. If you have regular cleaning service, you may only need deep cleaning 1-2 times per year.',
            },
        ],
    },
    {
        slug: "move-out-cleaning",
        name: "Move-Out Cleaning",
        shortDescription: "Inside all appliances, cabinets, closets. Window tracks. Walls spot-cleaned. Meets landlord requirements for deposit return.",
        longDescription: 'Move-out cleaning is our most thorough service. We clean to property manager inspection standards — inside all cabinets, closets, appliances, and detailed work on every surface. Designed to help you get your security deposit back.',
        priceRange: "$200-$400",
        priceMin: 200,
        priceMax: 400,
        duration: "4-6 hours",
        rating: "4.9",
        reviews: 156,
        checklist: [
            'Everything in deep cleaning',
            'Inside all cabinets and drawers',
            'Inside all closets (shelves, rods, floors)',
            'Inside pantry',
            'All appliances interior (oven, fridge, dishwasher, microwave)',
            'Window tracks (detailed)',
            'Light fixtures (detailed)',
            'Light switch plates and outlets',
            'Walls spot-cleaned (scuffs, marks)',
            'Blinds or shutters wiped',
            'Garage swept (if applicable)',
            'Patio/balcony swept (if applicable)',
        ],
        notIncluded: [
            'Full wall washing',
            'Carpet shampooing (available as add-on)',
            'Exterior windows',
            'Repairs or painting',
        ],
        bestFor: [
            'End of lease',
            'Selling your home',
            'Move-in preparation',
            'Maximizing security deposit return',
        ],
        faqs: [
            {
                question: 'Will move-out cleaning help me get my deposit back?',
                answer: 'That\'s the goal. We clean to the standards property managers check during inspections. Most customers report getting their full deposit back after our move-out cleaning.',
            },
            {
                question: 'Should the home be empty?',
                answer: 'Ideally yes. Empty homes are faster to clean and we can reach all areas. If furniture remains, we\'ll clean around it but may not be able to reach some spots.',
            },
            {
                question: 'How far in advance should I book?',
                answer: 'Book 5-7 days ahead if possible. Move-out cleanings take longer than regular services, so availability can be limited. Last-minute bookings may be possible depending on schedule.',
            },
        ],
    },
    {
        slug: "move-in-cleaning",
        name: "Move-In Cleaning",
        shortDescription: "Sanitize and prepare your new home before unpacking. Same thoroughness as move-out cleaning.",
        longDescription: 'Start fresh in your new home with our comprehensive Move-In Cleaning service. We sanitize every surface, clean inside cabinets and appliances, and ensure your new space is sparkling clean and ready for your family.',
        priceRange: "$180-$350",
        priceMin: 180,
        priceMax: 350,
        duration: "4-6 hours",
        rating: "4.8",
        reviews: 94,
        checklist: ['Sanitize all surfaces', 'Clean inside cabinets & drawers', 'Appliances inside & out', 'Floors vacuumed & mopped'],
        notIncluded: ['Carpet shampooing', 'Exterior windows'],
        bestFor: ['Moving into a new home', 'New homeowners', 'Post-renovation'],
        faqs: [{ question: 'Do you clean inside cabinets?', answer: 'Yes, move-in cleaning includes cleaning inside all empty cabinets and drawers.' }]
    },
    {
        slug: "bi-weekly-service",
        name: "Bi-Weekly Service",
        shortDescription: "Regular cleaning every two weeks. Maintains your home between deep cleans. Most popular option.",
        longDescription: 'Our most popular service! Bi-weekly cleaning strikes the perfect balance between cost and cleanliness, keeping your home maintained without the hassle. We rotate detailed tasks to ensure deep cleanliness over time.',
        priceRange: "$100-$200",
        priceMin: 100,
        priceMax: 200,
        duration: "2-3 hours",
        rating: "4.9",
        reviews: 203,
        checklist: ['Kitchen & Bathrooms', 'Dusting & Vacuuming', 'Mopping', 'Bed making'],
        notIncluded: ['Inside ovens (add-on)', 'Inside fridge (add-on)'],
        bestFor: ['Maintenance', 'Busy families', 'Pet owners'],
        faqs: [{ question: 'Do I need to be home?', answer: 'No, most clients provide a key or door code.' }]
    },
    {
        slug: "home-organization",
        name: "Home Organization",
        shortDescription: "Declutter and organize closets, pantry, garage. Can be added to any cleaning service.",
        longDescription: 'Transform chaotic spaces into organized havens. Our professional organizers help you declutter, sort, and implement systems that make it easy to stay organized. Perfect for closets, pantries, playrooms, and garages.',
        priceRange: "$80-$150",
        priceMin: 80,
        priceMax: 150,
        duration: "2-4 hours",
        rating: "4.7",
        reviews: 67,
        checklist: ['Decluttering assistance', 'Sorting & categorizing', 'Bin/basket labeling', 'System implementation'],
        notIncluded: ['Cleaning (focus is on organizing)', 'Hauling away trash'],
        bestFor: ['Closets', 'Kitchen pantries', 'Playrooms', 'Garages'],
        faqs: [{ question: 'Do I need to buy bins?', answer: 'We can recommend products or work with what you have.' }]
    },
    {
        slug: "pre-event-cleaning",
        name: "Pre-Event Cleaning",
        shortDescription: "Get your home guest-ready before parties, holidays, or family visits. Deep clean focused on visible areas.",
        longDescription: 'Prepare to host with confidence. Our pre-event cleaning focuses on high-traffic areas, guest bathrooms, and main entertaining spaces to ensure your home looks its absolute best for your guests.',
        priceRange: "$150-$280",
        priceMin: 150,
        priceMax: 280,
        duration: "3-5 hours",
        rating: "4.8",
        reviews: 81,
        checklist: ['Guest bathroom detail', 'Kitchen detail', 'Entryway & living areas', 'Patio sweep'],
        notIncluded: ['Inside appliances', 'Bedrooms (unless requested)'],
        bestFor: ['Parties', 'Holidays', 'Family gatherings'],
        faqs: [{ question: 'How close to the event should I book?', answer: 'We recommend 1-2 days before your event.' }]
    },
    {
        slug: "post-emergency",
        name: "Post-Emergency Cleanup",
        shortDescription: "Clean up after water damage, fire residue, or other emergencies. We work with insurance companies.",
        longDescription: 'Quick response cleaning for when life happens. Whether it\'s a minor leak, a messy spill, or post-party chaos, we help restore order to your home quickly and efficiently.',
        priceRange: "$200-$500",
        priceMin: 200,
        priceMax: 500,
        duration: "4-8 hours",
        rating: "4.9",
        reviews: 42,
        checklist: ['Water extraction (minor)', 'Disinfecting surfaces', 'Debris removal', 'Deep cleaning affected areas'],
        notIncluded: ['Mold remediation', 'Major construction repair', 'Hazardous materials'],
        bestFor: ['After leaks', 'Post-party', 'Unexpected messes'],
        faqs: [{ question: 'How fast can you come?', answer: 'We often have same-day or next-day availability for emergencies.' }]
    },
    {
        slug: "airbnb-turnover",
        name: "Airbnb Turnover",
        shortDescription: "Quick turnaround cleaning between guests. Linens, bathrooms, kitchen. Same-day service available.",
        longDescription: 'Reliable turnover service for short-term rental hosts. We understand the tight schedules and high standards required for 5-star reviews. Includes linen changing, restocking supplies, and damage reporting.',
        priceRange: "$80-$150",
        priceMin: 80,
        priceMax: 150,
        duration: "1-2 hours",
        rating: "4.8",
        reviews: 118,
        checklist: ['Change linens', 'Clean & sanitize bathroom/kitchen', 'Restock amenities', 'Check for damages'],
        notIncluded: ['Laundry off-site (on-site only)', 'Deep stain removal'],
        bestFor: ['Airbnb hosts', 'VRBO hosts', 'Vacation rentals'],
        faqs: [{ question: 'Do you take photos?', answer: 'Yes, we can provide before/after photos for your peace of mind.' }]
    },
    {
        slug: "post-construction",
        name: "Post-Construction",
        shortDescription: "Remove dust, debris, and residue after renovation. Heavy-duty cleaning for new or remodeled homes.",
        longDescription: 'Dust gets everywhere during renovation. Our post-construction cleaning uses HEPA vacuums and specialized techniques to remove fine dust from every surface, including walls, ceilings, and inside cabinets.',
        priceRange: "$250-$600",
        priceMin: 250,
        priceMax: 600,
        duration: "5-10 hours",
        rating: "4.7",
        reviews: 53,
        checklist: ['HEPA vacuuming', 'Wall dusting', 'Inside cabinets & drawers', 'Label removal from fixtures'],
        notIncluded: ['Hauling heavy debris', 'Exterior pressure washing'],
        bestFor: ['Post-renovation', 'New builds', 'Remodeling projects'],
        faqs: [{ question: 'Do you remove stickers from windows?', answer: 'Yes, we safely remove manufacturer stickers and residue.' }]
    }
];

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
    return services.find(s => s.slug === slug);
};

export const getAllServiceSlugs = (): string[] => {
    return services.map(s => s.slug);
};
