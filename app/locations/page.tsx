import Link from 'next/link';
import { Metadata } from 'next';
import { regions } from '@/lib/data/regions';
import { getCityBySlug } from '@/lib/data/cities';
import { services } from '@/lib/data/services';
import { JsonLd } from '@/components/shared/json-ld';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Service Areas | House Cleaning in 22 Seattle Cities | CLEENLY',
    description: 'CLEENLY serves 22 cities across Greater Seattle: Seattle, Bellevue, Kirkland, Redmond, Tacoma, Everett, and more. Find house cleaning in your area.',
    alternates: {
        canonical: 'https://cleenly.app/locations',
    },
};

export default function LocationsPage() {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cleenly.app" },
            { "@type": "ListItem", "position": 2, "name": "Locations" }
        ]
    };

    // Count total cities
    const totalCities = Object.values(regions).reduce(
        (sum, region) => sum + region.cities.length,
        0
    );

    return (
        <main className="bg-background">
            <JsonLd data={breadcrumbSchema} />

            {/* Breadcrumbs */}
            <nav className="border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Locations</span>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-20 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
                        House Cleaning Service Areas
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 max-w-2xl leading-relaxed">
                        We serve {totalCities} cities across Greater Seattle.
                        Regular cleaning, deep cleaning, and move-out cleaning available in all locations.
                    </p>
                </div>
            </section>

            {/* Regions Grid */}
            <section className="pb-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(regions).map(([regionName, regionData]) => (
                            <div key={regionName} className="border border-gray-200 rounded-[12px] p-8 bg-white hover:border-accent/40 transition-all shadow-sm">
                                <h2 className="text-xl font-semibold mb-2 text-foreground">{regionName}</h2>
                                <p className="text-sm text-gray-500 mb-6">
                                    {regionData.description}
                                </p>
                                <ul className="space-y-2">
                                    {regionData.cities.map((slug) => {
                                        const city = getCityBySlug(slug);
                                        if (!city) return null;
                                        return (
                                            <li key={slug}>
                                                <Link
                                                    href={`/${slug}`}
                                                    className="text-foreground hover:text-accent hover:underline transition-colors"
                                                >
                                                    {city.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-2xl font-semibold mb-8 text-foreground">Services Available in All Locations</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service.slug}
                                className="bg-white p-8 rounded-[12px] border border-gray-200 hover:border-accent/40 transition-all shadow-sm"
                            >
                                <h3 className="text-lg font-semibold mb-2 text-foreground">{service.name}</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {service.shortDescription}
                                </p>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-xl font-semibold text-foreground">{service.priceRange}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{service.duration}</span>
                                </div>
                                <Button variant="link" asChild className="p-0 h-auto">
                                    <Link href={`/services/${service.slug}`}>
                                        Learn More →
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">Don't see your city?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        We're expanding. Enter your ZIP code to check availability or join our waitlist.
                    </p>
                    <Button variant="primary" size="lg" asChild>
                        <Link href="/book">
                            Check Availability →
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}
