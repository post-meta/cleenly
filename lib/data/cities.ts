export interface CityData {
    slug: string;
    name: string;
    county: string;
    state: 'WA';
    coordinates: { lat: number; lng: number };
    zipCodes: string[];
    neighborhoods: string[];
    nearbyAreas: string[]; // slugs соседних городов
    description: string;
    wikipediaUrl?: string;
    landmarks?: string[];
    professions?: string[];
}

export const cities: CityData[] = [
    // === SEATTLE ===
    {
        slug: 'seattle',
        name: 'Seattle',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.6062, lng: -122.3321 },
        zipCodes: ['98101', '98102', '98103', '98104', '98105', '98106', '98107', '98109', '98112', '98115', '98116', '98117', '98118', '98119', '98121', '98122', '98125', '98126', '98133', '98136', '98144', '98199'],
        neighborhoods: ['Capitol Hill', 'Ballard', 'Fremont', 'Queen Anne', 'University District', 'Beacon Hill', 'West Seattle', 'Columbia City', 'Ravenna', 'Wallingford', 'Green Lake', 'Northgate', 'South Lake Union', 'Downtown', 'Madison Park', 'Magnolia'],
        nearbyAreas: ['shoreline', 'burien', 'tukwila', 'bellevue'],
        description: 'Serving all Seattle neighborhoods from Ballard to Beacon Hill, Capitol Hill to West Seattle.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Seattle',
        landmarks: ['Space Needle', 'Pike Place Market', 'University of Washington', 'Amazon Spheres'],
        professions: ['tech workers', 'healthcare professionals', 'busy families']
    },

    // === EASTSIDE ===
    {
        slug: 'bellevue',
        name: 'Bellevue',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.6101, lng: -122.2015 },
        zipCodes: ['98004', '98005', '98006', '98007', '98008'],
        neighborhoods: ['Downtown Bellevue', 'Crossroads', 'Factoria', 'Somerset', 'Newport', 'Eastgate', 'Bridle Trails', 'Wilburton'],
        nearbyAreas: ['kirkland', 'redmond', 'mercer-island', 'seattle'],
        description: 'Serving Bellevue from Downtown to Factoria, Crossroads to Somerset.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Bellevue,_Washington',
        landmarks: ['Bellevue Square', 'Downtown Park', 'Meydenbauer Bay Park'],
        professions: ['tech executives', 'families', 'professionals']
    },
    {
        slug: 'kirkland',
        name: 'Kirkland',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.6769, lng: -122.2060 },
        zipCodes: ['98033', '98034'],
        neighborhoods: ['Downtown Kirkland', 'Juanita', 'Houghton', 'Finn Hill', 'Totem Lake', 'Kingsgate', 'Norkirk'],
        nearbyAreas: ['bellevue', 'redmond', 'bothell', 'woodinville'],
        description: 'Serving all Kirkland neighborhoods from the waterfront to Totem Lake.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Kirkland,_Washington',
        landmarks: ['Kirkland Waterfront', 'Marina Park', 'The Village at Totem Lake'],
        professions: ['Google employees', 'families', 'remote workers']
    },
    {
        slug: 'redmond',
        name: 'Redmond',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.6740, lng: -122.1215 },
        zipCodes: ['98052', '98053'],
        neighborhoods: ['Downtown Redmond', 'Education Hill', 'Overlake', 'Idylwood', 'Grass Lawn', 'Willows', 'Bear Creek'],
        nearbyAreas: ['kirkland', 'bellevue', 'sammamish', 'woodinville'],
        description: 'Serving Redmond from Downtown to Overlake, Education Hill to Bear Creek.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Redmond,_Washington',
        landmarks: ['Microsoft Campus', 'Marymoor Park', 'Redmond Town Center'],
        professions: ['Microsoft employees', 'engineers', 'families']
    },
    {
        slug: 'sammamish',
        name: 'Sammamish',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.6163, lng: -122.0356 },
        zipCodes: ['98074', '98075'],
        neighborhoods: ['Sammamish Plateau', 'Pine Lake', 'Beaver Lake', 'Klahanie', 'Inglewood'],
        nearbyAreas: ['redmond', 'issaquah', 'bellevue'],
        description: 'Serving the Sammamish Plateau and surrounding neighborhoods.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Sammamish,_Washington',
        landmarks: ['Pine Lake Park', 'Beaver Lake Park', 'Soaring Eagle Park'],
        professions: ['families', 'commuters', 'homeowners']
    },
    {
        slug: 'issaquah',
        name: 'Issaquah',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.5301, lng: -122.0326 },
        zipCodes: ['98027', '98029'],
        neighborhoods: ['Issaquah Highlands', 'Gilman Village', 'Olde Town', 'Talus', 'Squak Mountain'],
        nearbyAreas: ['sammamish', 'bellevue', 'renton'],
        description: 'Serving Issaquah from Olde Town to Issaquah Highlands.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Issaquah,_Washington',
        landmarks: ['Issaquah Alps', 'Cougar Mountain Zoo', 'Gilman Village'],
        professions: ['Costco employees', 'outdoor enthusiasts', 'families']
    },
    {
        slug: 'bothell',
        name: 'Bothell',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.7623, lng: -122.2054 },
        zipCodes: ['98011', '98012', '98021'],
        neighborhoods: ['Downtown Bothell', 'Canyon Park', 'North Creek', 'Queensgate'],
        nearbyAreas: ['kirkland', 'woodinville', 'kenmore', 'lynnwood'],
        description: 'Serving Bothell and Canyon Park area.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Bothell,_Washington',
        landmarks: ['UW Bothell', 'Bothell Landing', 'McMenamins Anderson School'],
        professions: ['biotech workers', 'students', 'families']
    },
    {
        slug: 'woodinville',
        name: 'Woodinville',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.7543, lng: -122.1635 },
        zipCodes: ['98072', '98077'],
        neighborhoods: ['Downtown Woodinville', 'Hollywood Hill', 'Wellington', 'Wine Country'],
        nearbyAreas: ['kirkland', 'redmond', 'bothell'],
        description: 'Serving Woodinville including the wine country and Hollywood Hill.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Woodinville,_Washington',
        landmarks: ['Chateau Ste. Michelle', 'Hollywood Schoolhouse', 'Sammamish River Trail'],
        professions: ['winery staff', 'commuters', 'homeowners']
    },
    {
        slug: 'mercer-island',
        name: 'Mercer Island',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.5707, lng: -122.2221 },
        zipCodes: ['98040'],
        neighborhoods: ['North End', 'South End', 'Town Center', 'East Seattle'],
        nearbyAreas: ['bellevue', 'seattle', 'renton'],
        description: 'Serving all of Mercer Island.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Mercer_Island,_Washington',
        landmarks: ['Luther Burbank Park', 'Mercer Island Community Center'],
        professions: ['executives', 'professionals', 'families']
    },
    {
        slug: 'medina',
        name: 'Medina',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.6207, lng: -122.2284 },
        zipCodes: ['98039'],
        neighborhoods: ['Medina', 'Evergreen Point'],
        nearbyAreas: ['bellevue', 'kirkland', 'clyde-hill'],
        description: 'Serving Medina and Evergreen Point.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Medina,_Washington',
        landmarks: ['Medina Park', 'Evergreen Point Floating Bridge'],
        professions: ['executives', 'tech leaders']
    },
    {
        slug: 'clyde-hill',
        name: 'Clyde Hill',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.6318, lng: -122.2176 },
        zipCodes: ['98004'],
        neighborhoods: ['Clyde Hill'],
        nearbyAreas: ['bellevue', 'medina', 'kirkland'],
        description: 'Serving Clyde Hill and surrounding areas.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Clyde_Hill,_Washington',
        landmarks: ['Clyde Hill view points'],
        professions: ['professionals', 'families']
    },

    // === SOUTH KING COUNTY ===
    {
        slug: 'renton',
        name: 'Renton',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.4829, lng: -122.2171 },
        zipCodes: ['98055', '98056', '98057', '98058', '98059'],
        neighborhoods: ['Downtown Renton', 'Highlands', 'Fairwood', 'Kennydale', 'Benson Hill', 'Cascade'],
        nearbyAreas: ['seattle', 'bellevue', 'kent', 'tukwila'],
        description: 'Serving Renton from the Highlands to Fairwood.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Renton,_Washington',
        landmarks: ['The Landing', 'Gene Coulon Memorial Beach Park', 'Boeing Renton Factory'],
        professions: ['Boeing employees', 'families', 'commuters']
    },
    {
        slug: 'kent',
        name: 'Kent',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.3809, lng: -122.2348 },
        zipCodes: ['98030', '98031', '98032', '98042'],
        neighborhoods: ['Downtown Kent', 'East Hill', 'West Hill', 'Panther Lake', 'Meridian'],
        nearbyAreas: ['renton', 'auburn', 'federal-way', 'covington'],
        description: 'Serving Kent from Downtown to East Hill.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Kent,_Washington',
        landmarks: ['Kent Station', 'ShoWare Center', 'Lake Meridian Park'],
        professions: ['families', 'industrial workers', 'commuters']
    },
    {
        slug: 'federal-way',
        name: 'Federal Way',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.3223, lng: -122.3126 },
        zipCodes: ['98003', '98023'],
        neighborhoods: ['Downtown Federal Way', 'Twin Lakes', 'Redondo', 'Dash Point', 'Steel Lake'],
        nearbyAreas: ['kent', 'tacoma', 'auburn', 'des-moines'],
        description: 'Serving Federal Way from Twin Lakes to Dash Point.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Federal_Way,_Washington',
        landmarks: ['Wild Waves', 'The Commons at Federal Way', 'Dash Point State Park'],
        professions: ['families', 'commuters']
    },
    {
        slug: 'auburn',
        name: 'Auburn',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.3073, lng: -122.2285 },
        zipCodes: ['98001', '98002', '98092'],
        neighborhoods: ['Downtown Auburn', 'Lea Hill', 'Lake Tapps', 'West Auburn'],
        nearbyAreas: ['kent', 'federal-way', 'covington', 'puyallup'],
        description: 'Serving Auburn and Lea Hill area.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Auburn,_Washington',
        landmarks: ['Emerald Downs', 'The Outlet Collection Seattle', 'Auburn Game Farm Park'],
        professions: ['families', 'industrial workers']
    },
    {
        slug: 'burien',
        name: 'Burien',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.4704, lng: -122.3468 },
        zipCodes: ['98146', '98148', '98166'],
        neighborhoods: ['Downtown Burien', 'Boulevard Park', 'White Center', 'Seahurst', 'Gregory Heights'],
        nearbyAreas: ['seattle', 'tukwila', 'seatac', 'normandy-park'],
        description: 'Serving Burien, Seahurst, and White Center.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Burien,_Washington',
        landmarks: ['Seahurst Park', 'Olde Burien', 'Burien Town Square'],
        professions: ['families', 'commuters']
    },
    {
        slug: 'tukwila',
        name: 'Tukwila',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.4740, lng: -122.2610 },
        zipCodes: ['98168', '98178', '98188'],
        neighborhoods: ['Westfield Southcenter', 'Riverton', 'Allentown', 'Tukwila Hill'],
        nearbyAreas: ['seattle', 'renton', 'burien', 'seatac'],
        description: 'Serving Tukwila and Southcenter area.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Tukwila,_Washington',
        landmarks: ['Westfield Southcenter', 'Museum of Flight (nearby)', 'Starfire Sports'],
        professions: ['retail workers', 'families', 'commuters']
    },

    // === NORTH ===
    {
        slug: 'shoreline',
        name: 'Shoreline',
        county: 'King County',
        state: 'WA',
        coordinates: { lat: 47.7557, lng: -122.3415 },
        zipCodes: ['98133', '98155', '98177'],
        neighborhoods: ['Richmond Beach', 'Ridgecrest', 'Echo Lake', 'Innis Arden', 'Hillwood'],
        nearbyAreas: ['seattle', 'edmonds', 'lake-forest-park', 'mountlake-terrace'],
        description: 'Serving Shoreline from Richmond Beach to Ridgecrest.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Shoreline,_Washington',
        landmarks: ['Shoreline Community College', 'Richmond Beach Saltwater Park'],
        professions: ['educators', 'families', 'commuters']
    },
    {
        slug: 'edmonds',
        name: 'Edmonds',
        county: 'Snohomish County',
        state: 'WA',
        coordinates: { lat: 47.8107, lng: -122.3774 },
        zipCodes: ['98020', '98026'],
        neighborhoods: ['Downtown Edmonds', 'Perrinville', 'Esperance', 'Meadowdale'],
        nearbyAreas: ['shoreline', 'lynnwood', 'mountlake-terrace', 'mukilteo'],
        description: 'Serving Edmonds and the waterfront area.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Edmonds,_Washington',
        landmarks: ['Edmonds Ferry Terminal', 'Edmonds Center for the Arts', 'Marina Beach Park'],
        professions: ['retirees', 'families', 'artists']
    },
    {
        slug: 'lynnwood',
        name: 'Lynnwood',
        county: 'Snohomish County',
        state: 'WA',
        coordinates: { lat: 47.8209, lng: -122.3151 },
        zipCodes: ['98036', '98037', '98087'],
        neighborhoods: ['Alderwood', 'Martha Lake', 'Meadowdale', 'Lynnwood Bowl'],
        nearbyAreas: ['edmonds', 'mountlake-terrace', 'bothell', 'everett'],
        description: 'Serving Lynnwood and Alderwood area.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Lynnwood,_Washington',
        landmarks: ['Alderwood Mall', 'Lynnwood Convention Center'],
        professions: ['families', 'retail workers', 'commuters']
    },
    {
        slug: 'everett',
        name: 'Everett',
        county: 'Snohomish County',
        state: 'WA',
        coordinates: { lat: 47.9790, lng: -122.2021 },
        zipCodes: ['98201', '98203', '98204', '98208'],
        neighborhoods: ['Downtown Everett', 'Bayside', 'Delta', 'Riverside', 'Silver Lake', 'Pinehurst'],
        nearbyAreas: ['mukilteo', 'lynnwood', 'marysville', 'lake-stevens'],
        description: 'Serving Everett from Downtown to Silver Lake.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Everett,_Washington',
        landmarks: ['Boeing Everett Factory', 'Angel of the Winds Arena', 'Naval Station Everett'],
        professions: ['Boeing employees', 'naval personnel', 'families']
    },

    // === PIERCE COUNTY ===
    {
        slug: 'tacoma',
        name: 'Tacoma',
        county: 'Pierce County',
        state: 'WA',
        coordinates: { lat: 47.2529, lng: -122.4443 },
        zipCodes: ['98402', '98403', '98404', '98405', '98406', '98407', '98408', '98409', '98418', '98422', '98465'],
        neighborhoods: ['Downtown Tacoma', 'Stadium District', 'Proctor', 'North End', 'West End', 'South Tacoma', '6th Avenue', 'Old Town'],
        nearbyAreas: ['lakewood', 'university-place', 'fircrest', 'federal-way'],
        description: 'Serving all Tacoma neighborhoods from the North End to South Tacoma.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Tacoma,_Washington',
        landmarks: ['Museum of Glass', 'Point Defiance Park', 'Tacoma Dome'],
        professions: ['artists', 'doctors', 'families']
    },
    {
        slug: 'lakewood',
        name: 'Lakewood',
        county: 'Pierce County',
        state: 'WA',
        coordinates: { lat: 47.1718, lng: -122.5185 },
        zipCodes: ['98498', '98499'],
        neighborhoods: ['Lakewood Towne Center', 'Lake City', 'Tillicum', 'American Lake'],
        nearbyAreas: ['tacoma', 'university-place', 'steilacoom'],
        description: 'Serving Lakewood and surrounding areas.',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Lakewood,_Washington',
        landmarks: ['Lakewold Gardens', 'Thornewood Castle', 'American Lake'],
        professions: ['military personnel', 'families']
    },
];

export const getCityBySlug = (slug: string): CityData | undefined => {
    return cities.find(c => c.slug === slug);
};

export const getAllCitySlugs = (): string[] => {
    return cities.map(c => c.slug);
};
