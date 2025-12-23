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
        neighborhoods: ['Capitol Hill', 'Ballard', 'Fremont', 'Queen Anne', 'West Seattle', 'Green Lake', 'Beacon Hill', 'Columbia City'],
        landmarks: ['Space Needle', 'Pike Place Market', 'Gas Works Park', 'Alki Beach'],
        context: 'Homes in Seattle often require extra attention to humidity-related dust and seasonal pollen near the city\'s many parks.',
    },
    {
        name: 'Bellevue',
        slug: 'bellevue',
        neighborhoods: ['Downtown', 'West Bellevue', 'Factoria', 'Somerset', 'Crossroads', 'Wilburton'],
        landmarks: ['Bellevue Square', 'Botanical Garden', 'Downtown Park', 'Meydenbauer Bay'],
        context: 'Bellevue residences frequently include modern high-rises and large estates with specific floor-to-ceiling window care needs.',
    },
    {
        name: 'Kirkland', slug: 'kirkland',
        neighborhoods: ['Downtown', 'Juanita', 'Totem Lake', 'Houghton', 'Bridle Trails'],
        landmarks: ['Marina Park', 'Heritage Hall', 'Juanita Beach'],
        context: 'Kirkland homes often feature waterfront properties that require specialized exterior-facing surface detailing and window care.',
    },
    {
        name: 'Redmond', slug: 'redmond',
        neighborhoods: ['Downtown', 'Overlake', 'Education Hill', 'Grass Lawn', 'Union Hill'],
        landmarks: ['Marymoor Park', 'Microsoft Campus', 'Town Center'],
        context: 'Redmond households often prioritize quick, efficient cleaning schedules that fit into busy tech-professional lifestyles.',
    },
    {
        name: 'Renton', slug: 'renton',
        neighborhoods: ['The Highlands', 'Cascade', 'Kennydale', 'Benson', 'Fairwood'],
        landmarks: ['Gene Coulon Park', 'The Landing', 'Boeing Factory'],
        context: 'Renton homes benefit from our detailed move-in/move-out services as the area continues to see rapid residential growth.',
    },
    {
        name: 'Issaquah', slug: 'issaquah',
        neighborhoods: ['Issaquah Highlands', 'Talus', 'Squak Mountain', 'Mirrormont'],
        landmarks: ['Tiger Mountain', 'Salmon Hatchery', 'Village Theatre'],
        context: 'Foothill homes in Issaquah often need more frequent dust removal due to mountain winds and nearby hiking trails.'
    },
    {
        name: 'Sammamish', slug: 'sammamish',
        neighborhoods: ['Klahanie', 'Pine Lake', 'Sahalee', 'Trossachs'],
        landmarks: ['Pine Lake Park', 'Beaver Lake', 'Sammamish Commons'],
        context: 'Large family homes in Sammamish are our specialty, focusing on high-traffic common areas and detailed kitchen sanitization.'
    },
    {
        name: 'Mercer Island', slug: 'mercer-island',
        neighborhoods: ['North End', 'South End', 'First Hill'],
        landmarks: ['Luther Burbank Park', 'Aubrey Davis Park'],
        context: 'Mercer Island properties often require premium care for sensitive high-end finishes, custom cabinetry, and hardwood floors.'
    },
    {
        name: 'Shoreline', slug: 'shoreline',
        neighborhoods: ['Richmond Beach', 'Echo Lake', 'Highland Terrace', 'Ridgecrest'],
        landmarks: ['Shoreview Park', 'Richmond Beach Saltwater Park'],
        context: 'Shoreline bungalows and Mid-Century Modern homes benefit from our specialized deep cleaning of classic fixtures and vintage tiling.'
    },
    {
        name: 'Bothell', slug: 'bothell',
        neighborhoods: ['Canyon Park', 'Downtown', 'North Creek', 'Maywood'],
        landmarks: ['UW Bothell', 'Anderson School', 'Bothell Landing'],
        context: 'Bothell\'s mix of modern apartments and established single-family homes trust us for reliable, recurring cleaning services.'
    },
    {
        name: 'Tacoma', slug: 'tacoma',
        neighborhoods: ['North End', 'South Tacoma', 'Hilltop', 'Point Ruston'],
        landmarks: ['Point Defiance Park', 'Museum of Glass', 'Union Station'],
        context: 'Tacoma\'s historic homes often feature unique architectural details that require careful, specialized dusting and floor care.'
    },
    {
        name: 'Everett', slug: 'everett',
        neighborhoods: ['Northwest', 'Bayside', 'Port Gardner', 'Silver Lake'],
        landmarks: ['Everett Waterfront', 'Angel of the Winds Arena', 'Naval Station Everett'],
        context: 'Everett residents appreciate our thorough approach to maritime-related window grime and industrial-area dust management.'
    },
    {
        name: 'Woodinville', slug: 'woodinville',
        neighborhoods: ['Hollywood District', 'Wine Country', 'West Ridge'],
        landmarks: ['Chateau Ste. Michelle', 'Cottage Lake'],
        context: 'Woodinville homes, especially in the wine country areas, often need deep cleaning after seasonal entertaining and events.'
    },
    {
        name: 'Burien', slug: 'burien',
        neighborhoods: ['Seahurst', 'Gregory Heights', 'Lake Burien'],
        landmarks: ['Seahurst Park', 'Burien Town Square'],
        context: 'Burien\'s coastal properties benefit from our specialized salt-air window cleaning and high-moisture area maintenance.'
    },
    {
        name: 'Kent', slug: 'kent',
        neighborhoods: ['East Hill', 'West Hill', 'Kent Valley', 'Panther Lake'],
        landmarks: ['ShoWare Center', 'Kent Station'],
        context: 'Kent\'s diverse residential areas trust us for efficient, high-quality cleaning that meets the needs of active families.'
    },
    {
        name: 'Federal Way', slug: 'federal-way',
        neighborhoods: ['Twin Lakes', 'Adelaide', 'Dumas Bay'],
        landmarks: ['Wild Waves', 'Dash Point State Park'],
        context: 'Federal Way homes near the water often require more frequent window and exterior surface maintenance.'
    },
    {
        name: 'Auburn', slug: 'auburn',
        neighborhoods: ['Lakeland Hills', 'West Valley', 'Lea Hill'],
        landmarks: ['Emerald Downs', 'Muckleshoot Casino'],
        context: 'Auburn property owners, especially in Lakeland Hills, rely on our detailed deep cleaning for large, multi-story residences.'
    },
    {
        name: 'Lynnwood', slug: 'lynnwood',
        neighborhoods: ['Alderwood Manor', 'Meadowdale', 'Martha Lake'],
        landmarks: ['Alderwood Mall', 'Lynnwood Convention Center'],
        context: 'Lynnwood households benefit from our flexible scheduling that aligns with the fast-paced lifestyle of the Snohomish County hub.'
    },
    {
        name: 'Edmonds', slug: 'edmonds',
        neighborhoods: ['Bowl', 'Woodway', 'Westgate'],
        landmarks: ['Edmonds Ferry', 'Underwater Park', 'Frances Anderson Center'],
        context: 'Edmonds\' seaside charm comes with specific maintenance needs for antique fixtures and maritime-exposed windows.'
    },
    {
        name: 'Lakewood', slug: 'lakewood',
        neighborhoods: ['Oakbrook', 'Steilacoom', 'Tillicum'],
        landmarks: ['Thornewood Castle', 'Lakewold Gardens'],
        context: 'Lakewood residents trust us for cleaning historic estates and modern lakeside properties with equal precision.'
    }
];

export const SEATTLE_NEIGHBORHOODS: City[] = [
    { name: 'Capitol Hill', slug: 'capitol-hill', neighborhoods: [], landmarks: ['Volunteer Park', 'Cal Anderson Park'], context: 'Capitol Hill apartments and townhomes require efficient cleaning of compact, high-use living spaces.' },
    { name: 'Ballard', slug: 'ballard', neighborhoods: [], landmarks: ['Ballard Locks', 'Golden Gardens'], context: 'Ballard\'s mix of historic cottages and new builds benefit from our specialized dust and window care.' },
    { name: 'Fremont', slug: 'fremont', neighborhoods: [], landmarks: ['Fremont Troll', 'Lenin Statue'], context: 'Fremont residents appreciate our attention to detail in artistic, uniquely structured homes and studios.' },
    { name: 'Queen Anne', slug: 'queen-anne', neighborhoods: [], landmarks: ['Kerry Park', 'Counterbalance'], context: 'Queen Anne estates and historic homes require premium care for sensitive hardwood and classic fixtures.' },
    { name: 'West Seattle', slug: 'west-seattle', neighborhoods: [], landmarks: ['Alki Beach', 'Lincoln Park'], context: 'West Seattle coastal homes need regular attention to window clarity and moisture-prone areas.' },
    { name: 'Green Lake', slug: 'green-lake', neighborhoods: [], landmarks: ['Green Lake Park', 'Bathhouse Theatre'], context: 'Homes near Green Lake benefit from frequent allergen removal and floor sanitization for active households.' },
    { name: 'Downtown', slug: 'downtown', neighborhoods: [], landmarks: ['Pike Place', 'Central Library'], context: 'Downtown high-rises often feature panoramic windows and high-end finishes that require specialized care.' },
    { name: 'South Lake Union', slug: 'south-lake-union', neighborhoods: [], landmarks: ['Lake Union Park', 'MOHAI'], context: 'SLU professionals value our quick, reliable services for modern apartments and shared living spaces.' },
];
