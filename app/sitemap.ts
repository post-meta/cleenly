import { MetadataRoute } from 'next';
import { getIndexableCities } from '@/lib/data/cities';
import { services } from '@/lib/data/services';
import { blogPosts } from '@/lib/data/blog-posts';

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
        { path: '/blog', priority: 0.7 },
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

    // City Landing pages (/[city]) — only indexable cities.
    // Non-indexable cities still render and accept GBP parasite traffic, but
    // are excluded from sitemap.xml and emit `robots: noindex, follow`.
    const indexableCities = getIndexableCities();
    const cityRoutes = indexableCities.map((city) => ({
        url: `${baseUrl}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // City + Service combo pages (/[city]/[service]) — only for indexable cities.
    const comboRoutes = [];
    for (const city of indexableCities) {
        for (const service of services) {
            comboRoutes.push({
                url: `${baseUrl}/${city.slug}/${service.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            });
        }
    }

    // Blog posts (/blog/[slug])
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...serviceRoutes, ...cityRoutes, ...comboRoutes, ...blogRoutes];
}
