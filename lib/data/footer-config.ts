import { getCityBySlug } from './cities';

export const footerConfig = {
    services: [
        { name: 'Regular Cleaning', slug: 'regular-cleaning' },
        { name: 'Deep Cleaning', slug: 'deep-cleaning' },
        { name: 'Move-Out Cleaning', slug: 'move-out-cleaning' },
    ],

    // Top 5 cities for homepage and pages without context
    defaultCities: ['seattle', 'bellevue', 'kirkland', 'redmond', 'tacoma'],

    company: [
        { name: 'About', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'FAQ', href: '/faq' },
        { name: 'For Cleaners', href: '/join' },
    ],

    legal: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
    ],

    contact: {
        email: 'hello@cleenly.app',
    },
};

/**
 * Returns the list of cities for the footer based on context
 */
export function getFooterCities(currentCitySlug?: string): string[] {
    if (!currentCitySlug) {
        return footerConfig.defaultCities;
    }

    const city = getCityBySlug(currentCitySlug);
    if (!city) {
        return footerConfig.defaultCities;
    }

    // Current city + its nearby areas (maximum 5)
    const cities = [currentCitySlug, ...city.nearbyAreas].slice(0, 5);
    return cities;
}
