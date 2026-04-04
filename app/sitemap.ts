import { MetadataRoute } from 'next';
import { cities } from '@/lib/data/cities';
import { services } from '@/lib/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cleenly.app';

    // Core pages
    const routes = [
        { path: '', priority: 1 },
        { path: '/pricing', priority: 0.9 },
        { path: '/services', priority: 0.9 },
        { path: '/book', priority: 0.9 },
        { path: '/about', priority: 0.7 },
        { path: '/faq', priority: 0.7 },
        { path: '/how-it-works', priority: 0.8 },
        { path: '/join', priority: 0.6 },
        { path: '/locations', priority: 0.6 },
        { path: '/privacy', priority: 0.3 },
        { path: '/terms', priority: 0.3 },
    ].map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route.priority,
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
