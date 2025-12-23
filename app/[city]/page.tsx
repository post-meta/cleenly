import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { cities, getCityBySlug, getAllCitySlugs } from '@/lib/data/cities';
import { services } from '@/lib/data/services';
import { JsonLd } from '@/components/shared/json-ld';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/lib/utils/schema-generators';
import { CityHero } from '@/components/shared/city-hero';
import { Button } from '@/components/ui/button';
import { AccordionFAQ } from '@/components/shared/accordion-faq';
import { Footer } from '@/components/shared/footer';

interface PageProps {
    params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
    return getAllCitySlugs().map(slug => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);
    if (!city) return {};

    return {
        title: `House Cleaning ${city.name} WA | Book Online | CLEENLY`,
        description: `Professional house cleaning in ${city.name}. Regular cleaning, deep cleaning, and move-out cleaning. Serving ${city.neighborhoods.slice(0, 3).join(', ')}. Book online.`,
        alternates: {
            canonical: `https://cleenly.app/${city.slug}`,
        },
    };
}

export default async function CityPage({ params }: PageProps) {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);
    if (!city) notFound();

    const localBusinessSchema = generateLocalBusinessSchema(city);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://cleenly.app' },
        { name: city.name }
    ]);

    const faqs = [
        {
            question: `How much does house cleaning cost in ${city.name}?`,
            answer: `Local rates in ${city.name} vary by home size. Regular cleaning typically starts at $100, deep cleaning at $150, and move-out cleaning at $200. We offer instant upfront pricing during booking.`
        },
        {
            question: "Are your cleaners insured?",
            answer: "Yes, all professional cleaners on the CLEENLY platform are fully insured and background-checked for your peace of mind."
        },
        {
            question: "Do I need to be home during the cleaning?",
            answer: "No, most our clients provide entry instructions (key box, smart lock) and go about their day. We'll secure everything when we're finished."
        }
    ];

    return (
        <main className="bg-background">
            <JsonLd data={localBusinessSchema} />
            <JsonLd data={breadcrumbSchema} />

            {/* Breadcrumbs */}
            <nav className="border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{city.name}</span>
                </div>
            </nav>

            {/* Hero */}
            <CityHero cityName={city.name} description={city.description} />

            {/* Services Grid */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center md:text-left mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">Cleaning Services in {city.name}</h2>
                        <p className="text-gray-600 max-w-2xl">
                            Choose the service level that fits your home's needs. All bookings in {city.name} include our satisfaction guarantee.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map(service => (
                            <div
                                key={service.slug}
                                className="bg-white p-8 rounded-[12px] border border-gray-100 hover:border-accent/40 transition-all shadow-sm hover:shadow-md flex flex-col"
                            >
                                <h3 className="text-xl font-semibold mb-3 text-foreground">{service.name}</h3>
                                <p className="text-gray-600 mb-6 text-sm flex-1">{service.shortDescription}</p>

                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-2xl font-semibold text-foreground">{service.priceRange}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">{service.duration}</span>
                                </div>

                                <Button variant="secondary" asChild className="w-full">
                                    <Link href={`/${city.slug}/${service.slug}`}>
                                        View Details →
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <AccordionFAQ faqs={faqs} title={`Common Questions in ${city.name}`} />

            {/* Neighborhoods & Service Areas */}
            <section className="py-24 border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-2xl font-semibold mb-6 text-foreground">Neighborhoods Served</h2>
                            <div className="flex flex-wrap gap-2">
                                {city.neighborhoods.map(hood => (
                                    <span
                                        key={hood}
                                        className="px-4 py-2 bg-gray-50 rounded-[4px] text-sm text-gray-600 border border-gray-200/50"
                                    >
                                        {hood}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-8 text-xs text-gray-400 tracking-wider uppercase">
                                Service Area ZIPs: {city.zipCodes.join(', ')}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-6 text-foreground">Also Serving Nearby</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {city.nearbyAreas.map(areaSlug => {
                                    const nearbyCity = getCityBySlug(areaSlug);
                                    if (!nearbyCity) return null;
                                    return (
                                        <Link
                                            key={areaSlug}
                                            href={`/${areaSlug}`}
                                            className="px-4 py-3 border border-gray-200 rounded-[4px] bg-white hover:border-accent/40 hover:bg-gray-50 transition-all text-sm text-gray-600"
                                        >
                                            {nearbyCity.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Brand CTA */}
            <section className="py-24 bg-accent text-white overflow-hidden relative">
                <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                        Ready for a cleaner home in {city.name}?
                    </h2>
                    <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto">
                        Join hundreds of {city.name} families who trust CLEENLY for their weekly and monthly cleanings.
                    </p>
                    <Button variant="secondary" size="lg" asChild className="bg-white text-accent border-none hover:bg-white/90">
                        <Link href="/book">Get Your Price in 2 Minutes</Link>
                    </Button>
                </div>
            </section>

            <Footer currentCity={city.slug} />
        </main>
    );
}
