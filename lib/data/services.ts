export interface ServiceData {
    slug: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    priceRange: string;
    priceMin: number; // for schema, in dollars
    priceMax: number;
    duration: string;
    checklist: string[];
    notIncluded: string[];
    bestFor: string[];
    faqs: {
        question: string;
        answer: string;
    }[];
}

export const services: ServiceData[] = [
    {
        slug: 'regular-cleaning',
        name: 'Regular Cleaning',
        shortDescription: 'Routine maintenance cleaning for homes that get cleaned regularly.',
        longDescription: 'Regular cleaning covers all the essentials: dusting, vacuuming, mopping, bathroom and kitchen cleaning. Best for homes that are already in good shape and need weekly or bi-weekly maintenance.',
        priceRange: '$100-$200',
        priceMin: 100,
        priceMax: 200,
        duration: '2-3 hours',
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
        slug: 'deep-cleaning',
        name: 'Deep Cleaning',
        shortDescription: 'Thorough cleaning including spots that usually get skipped.',
        longDescription: 'Deep cleaning covers everything in regular cleaning plus the areas that build up over time: inside appliances, baseboards, window sills, ceiling fans, and behind furniture. Recommended for first-time cleanings or homes that need extra attention.',
        priceRange: '$150-$300',
        priceMin: 150,
        priceMax: 300,
        duration: '3-5 hours',
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
        slug: 'move-out-cleaning',
        name: 'Move-Out Cleaning',
        shortDescription: 'Complete cleaning to landlord standards. Get your deposit back.',
        longDescription: 'Move-out cleaning is our most thorough service. We clean to property manager inspection standards — inside all cabinets, closets, appliances, and detailed work on every surface. Designed to help you get your security deposit back.',
        priceRange: '$200-$400',
        priceMin: 200,
        priceMax: 400,
        duration: '4-7 hours',
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
];

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
    return services.find(s => s.slug === slug);
};

export const getAllServiceSlugs = (): string[] => {
    return services.map(s => s.slug);
};
