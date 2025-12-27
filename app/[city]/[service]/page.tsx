import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { cities, getCityBySlug } from '@/lib/data/cities';
import { services, getServiceBySlug } from '@/lib/data/services';
import { JsonLd } from '@/components/shared/json-ld';
import {
    generateServiceSchema,
    generateFAQSchema,
    generateBreadcrumbSchema
} from '@/lib/utils/schema-generators';
import { ServiceHero } from '@/components/shared/city-hero';
import { Button } from '@/components/ui/button';
import { AccordionFAQ } from '@/components/shared/accordion-faq';
import { Footer } from '@/components/shared/footer';
import { getCityContent, getServiceIntro } from '@/lib/utils/content-parser';

interface PageProps {
    params: Promise<{ city: string; service: string }>;
}

// Генерируем все комбинации при билде
export async function generateStaticParams() {
    const params = [];
    for (const city of cities) {
        for (const service of services) {
            params.push({ city: city.slug, service: service.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: citySlug, service: serviceSlug } = await params;
    const city = getCityBySlug(citySlug);
    const service = getServiceBySlug(serviceSlug);
    if (!city || !service) return {};

    return {
        title: `${service.name} ${city.name} WA | ${service.priceRange} | CLEENLY`,
        description: `${service.name} in ${city.name}, Washington. ${service.priceRange}. Serving ${city.neighborhoods.slice(0, 3).join(', ')}. Book online in 2 minutes.`,
        alternates: {
            canonical: `https://cleenly.app/${city.slug}/${service.slug}`,
        },
    };
}

export default async function CityServicePage({ params }: PageProps) {
    const { city: citySlug, service: serviceSlug } = await params;
    const city = getCityBySlug(citySlug);
    const service = getServiceBySlug(serviceSlug);

    if (!city || !service) notFound();

    const content = getCityContent(citySlug);
    const serviceIntro = getServiceIntro(citySlug, serviceSlug);

    const serviceSchema = generateServiceSchema(city, service);
    const localFaqs = content?.localFAQs || [];
    const allFaqs = [...localFaqs, ...(service.faqs || [])];
    const faqSchema = generateFAQSchema(allFaqs);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://cleenly.app' },
        { name: city.name, url: `https://cleenly.app/${city.slug}` },
        { name: service.name }
    ]);

    return (
        <main className="bg-background">
            <JsonLd data={serviceSchema} />
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />

            {/* Breadcrumbs */}
            <nav className="border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/${city.slug}`} className="hover:text-foreground">{city.name}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{service.name}</span>
                </div>
            </nav>

            <ServiceHero
                cityName={city.name}
                serviceName={service.name}
                introText={serviceIntro || `House ${service.name.toLowerCase()} in ${city.name}.`}
                priceRange={service.priceRange}
                citySlug={city.slug}
            />

            {/* Pricing Details */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="mx-auto max-w-3xl px-6">
                    <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-semibold mb-2">Pricing for {city.name}</h2>
                            <p className="text-gray-500 text-sm">Transparent pricing based on local rates in {city.name}, Washington.</p>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                <span className="text-gray-600">Service</span>
                                <span className="font-semibold text-foreground">{service.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                <span className="text-gray-600">Area</span>
                                <span className="font-semibold text-foreground">{city.name}, WA</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-gray-600">Estimated Price</span>
                                <span className="text-2xl font-semibold text-accent">{service.priceRange}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inclusions & Highlights */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div>
                            <h2 className="text-2xl font-semibold mb-8">What's Included</h2>
                            {service.checklist && service.checklist.length > 0 && (
                                <ul className="space-y-4">
                                    {service.checklist.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                                                ✓
                                            </span>
                                            <span className="text-gray-700 leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-8">Why {city.name} Homeowners Choose Us</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed italic">
                                "{service.longDescription}"
                            </p>
                            <div className="bg-accent/5 p-8 rounded-[12px] border-l-4 border-accent">
                                <p className="text-gray-700 font-medium">
                                    {content?.whyChoose || `House ${service.name.toLowerCase()} tailored for your home in ${city.name}. Every cleaner is background-checked and insured.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Local FAQs */}
            <AccordionFAQ faqs={allFaqs} title={`${service.name} FAQ for ${city.name}`} />

            {/* Service Coverage */}
            <section className="py-24 border-t border-gray-100 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-xl font-semibold mb-6">Service Coverage in {city.name}</h2>
                    <div className="flex flex-wrap justify-center gap-2">
                        {city.neighborhoods.map(hood => (
                            <Link
                                key={hood}
                                href={`/book?city=${city.slug}&service=${service.slug}&neighborhood=${encodeURIComponent(hood)}`}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-[4px] text-xs text-gray-500 hover:border-accent/40 hover:text-accent transition-all"
                            >
                                {hood}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-accent text-white relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                        Book your {service.name.toLowerCase()} in {city.name}
                    </h2>
                    <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto">
                        See your exact price in seconds. No estimates, no hidden fees.
                    </p>
                    <Button variant="secondary" size="lg" asChild className="bg-white text-accent border-transparent hover:bg-white/90">
                        <Link href="/book">Get Your Price Now →</Link>
                    </Button>
                </div>
            </section>

            {content?.isLoaded && (
                <div className="hidden">Localized content loaded for {city.slug}/{service.slug}</div>
            )}
            <Footer currentCity={city.slug} currentService={service.slug} />
        </main>
    );
}
