export interface ServiceMetadata {
    id: string;
    slug: string;
    name: string;
    description: string;
    priceRange: string;
    duration: string;
    features: string[];
}

export const SERVICES_DATA: ServiceMetadata[] = [
    {
        id: 'regular',
        slug: 'regular-cleaning',
        name: 'Regular Cleaning',
        description: 'Perfect for maintaining a tidy home on a weekly or bi-weekly basis.',
        priceRange: '$100 - $200',
        duration: '2-3 Hours',
        features: [
            'Dusting all surfaces',
            'Vacuuming & Mopping',
            'Bathroom sanitization',
            'Kitchen exterior cleaning',
            'Trash removal',
        ],
    },
    {
        id: 'deep',
        slug: 'deep-cleaning',
        name: 'Deep Cleaning',
        description: 'Complete top-to-bottom scrub for homes that haven’t been cleaned in 30+ days.',
        priceRange: '$150 - $350',
        duration: '3-5 Hours',
        features: [
            'Inside appliances (Oven/Fridge)',
            'Baseboard scrubbing',
            'Inside window sills',
            'Door frames & switches',
            'Detailed kitchen/bath scrub',
        ],
    },
    {
        id: 'move-out',
        slug: 'move-out-cleaning',
        name: 'Move-Out Cleaning',
        description: 'Helping you get your security deposit back with landlord-standard cleaning.',
        priceRange: '$200 - $450',
        duration: '4-6 Hours',
        features: [
            'Inside all cabinets & drawers',
            'Full appliance deep clean',
            'Inside windows & tracks',
            'Wall spot cleaning',
            'Full floor sanitization',
        ],
    },
];
