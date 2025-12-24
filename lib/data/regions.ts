export const regions = {
    'Seattle Area': {
        description: 'Seattle and surrounding neighborhoods',
        cities: ['seattle', 'shoreline', 'burien', 'tukwila'],
    },
    'Eastside': {
        description: 'Bellevue, Kirkland, Redmond and neighboring cities',
        cities: ['bellevue', 'kirkland', 'redmond', 'sammamish', 'issaquah', 'bothell', 'woodinville', 'mercer-island', 'medina', 'clyde-hill'],
    },
    'South King County': {
        description: 'Renton, Kent, and south King County',
        cities: ['renton', 'kent', 'federal-way', 'auburn'],
    },
    'North Sound': {
        description: 'Shoreline to Everett',
        cities: ['edmonds', 'lynnwood', 'everett'],
    },
    'Pierce County': {
        description: 'Tacoma and south Sound',
        cities: ['tacoma', 'lakewood'],
    },
};

export const getRegionNames = () => Object.keys(regions);
