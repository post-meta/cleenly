export interface City {
    name: string;
    slug: string;
    neighborhoods: string[];
    landmarks: string[];
    context: string; // Specific city cleaning tip or fact
}

export const CITIES: City[] = [
    {
        name: 'Seattle',
        slug: 'seattle',
        neighborhoods: ['Capitol Hill', 'Ballard', 'Fremont', 'Queen Anne', 'West Seattle', 'Green Lake'],
        landmarks: ['Space Needle', 'Pike Place Market', 'Gas Works Park', 'Alki Beach'],
        context: 'Homes in Seattle often require extra attention to humidity-related dust and seasonal pollen near parks.',
    },
    {
        name: 'Bellevue',
        slug: 'bellevue',
        neighborhoods: ['Downtown', 'West Bellevue', 'Factoria', 'Somerset', 'Crossroads'],
        landmarks: ['Bellevue Square', 'Botanical Garden', 'Downtown Park', 'Meydenbauer Bay'],
        context: 'Bellevue residences frequently include modern high-rises and large estates with specific floor-to-ceiling window care needs.',
    },
    {
        name: 'Kirkland', slug: 'kirkland',
        neighborhoods: ['Downtown', 'Juanita', 'Totem Lake', 'Houghton'],
        landmarks: ['Marina Park', 'Heritage Hall', 'Juanita Beach'],
        context: 'Kirkland homes often feature waterfront properties that require specialized exterior-facing surface detailing.',
    },
    {
        name: 'Redmond', slug: 'redmond',
        neighborhoods: ['Downtown', 'Overlake', 'Education Hill', 'Grass Lawn'],
        landmarks: ['Marymoor Park', 'Microsoft Campus', 'Town Center'],
        context: 'Redmond households often prioritize quick, efficient cleaning schedules that fit into tech-professional lifestyles.',
    },
    {
        name: 'Renton', slug: 'renton',
        neighborhoods: ['The Highlands', 'Cascade', 'Kennydale', 'Benson'],
        landmarks: ['Gene Coulon Park', 'The Landing', 'Boeing Factory'],
        context: 'Renton homes benefit from our detailed move-in/move-out services as the area continues to grow rapidly.',
    },
    // Adding more key cities from the plan...
    { name: 'Issaquah', slug: 'issaquah', neighborhoods: ['Issaquah Highlands', 'Talus', 'Squak Mountain'], landmarks: ['Tiger Mountain', 'Salmon Hatchery'], context: 'Foothill homes in Issaquah often need more frequent dust removal due to wind and nearby trails.' },
    { name: 'Sammamish', slug: 'sammamish', neighborhoods: ['Klahanie', 'Pine Lake'], landmarks: ['Pine Lake Park', 'Beaver Lake'], context: 'Large family homes in Sammamish are our specialty, focusing on high-traffic common areas.' },
    { name: 'Mercer Island', slug: 'mercer-island', neighborhoods: ['North End', 'South End'], landmarks: ['Luther Burbank Park'], context: 'Mercer Island properties often require premium care for sensitive high-end finishes and hardwood floors.' },
    { name: 'Shoreline', slug: 'shoreline', neighborhoods: ['Richmond Beach', 'Echo Lake'], landmarks: ['Shoreview Park'], context: 'Shoreline bungalows and Mid-Century homes benefit from our deep cleaning of classic fixtures.' },
    { name: 'Bothell', slug: 'bothell', neighborhoods: ['Canyon Park', 'Downtown'], landmarks: ['University of Washington Bothell'], context: 'Bothell apartments and single-family homes trust us for reliable, recurring service.' },
];

export const OTHER_CITIES = [
    'Tacoma', 'Everett', 'Woodinville', 'Shoreline', 'Burien', 'Kent', 'Federal Way', 'Auburn', 'Lynnwood', 'Edmonds', 'Lakewood'
];
