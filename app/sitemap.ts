import { MetadataRoute } from 'next';
import { cities } from '@/lib/data/cities';
import { services } from '@/lib/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cleenly.app';

    // Core pages
    const routes = [
        '',
        '/services',
        '/login',
        '/forgot-password',
        '/book',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Service Detail pages (/services/[service])
    const serviceRoutes = services.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // City Landing pages (/[city])
    const cityRoutes = cities.map((city) => ({
        url: `${baseUrl}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // City + Service combo pages (/[city]/[service])
    const comboRoutes = [];
    for (const city of cities) {
        for (const service of services) {
            comboRoutes.push({
                url: `${baseUrl}/${city.slug}/${service.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            });
        }
    }

    return [...routes, ...serviceRoutes, ...cityRoutes, ...comboRoutes];
}
