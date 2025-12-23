import { MetadataRoute } from 'next';
import { CITIES } from '@/lib/data/cities';
import { SERVICES_DATA } from '@/lib/data/services-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cleenly.app';

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/pricing',
        '/faq',
        '/book',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // City pages (/locations/[city])
    const cityPages = CITIES.map((city) => ({
        url: `${baseUrl}/locations/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // City + Service pages (/locations/[city]/[service])
    const cityServicePages: MetadataRoute.Sitemap = [];
    CITIES.forEach((city) => {
        SERVICES_DATA.forEach((service) => {
            cityServicePages.push({
                url: `${baseUrl}/locations/${city.slug}/${service.slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            });
        });
    });

    return [...staticPages, ...cityPages, ...cityServicePages];
}
