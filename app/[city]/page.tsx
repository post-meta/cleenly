import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { cities, getCityBySlug, getAllCitySlugs } from '@/lib/data/cities';
import { services } from '@/lib/data/services';
import { JsonLd } from '@/components/shared/json-ld';
import { CityHero } from '@/components/shared/city-hero';
import { Button } from '@/components/ui/button';
import { AccordionFAQ } from '@/components/shared/accordion-faq';
import { Footer } from '@/components/shared/footer';
import { getCityContent } from '@/lib/utils/content-parser';
import { ServiceCard } from '@/components/shared/service-card';
import { ServiceCarousel } from '@/components/shared/service-carousel';

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
    const content = getCityContent(citySlug);
    if (!city || !content) notFound();

    if (!city || !content) notFound();

    const faqs = content.localFAQs.length > 0 ? content.localFAQs : [
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

    // AI-Enhanced Content Generation
    const enhancedDescription = content.cityIntro || (
        city.description +
        (city.landmarks?.length ? ` Proudly serving ${city.professions?.[0] || 'homes'} near ${city.landmarks.slice(0, 2).join(' and ')}.` : '')
    );

    return (
        <main className="bg-background">

            {/* Breadcrumbs */}
            <nav className="border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{city.name}</span>
                </div>
            </nav>

            {/* Hero */}
            <CityHero cityName={city.name} description={enhancedDescription} />

            {/* How It Works */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-3">
                                1
                            </div>
                            <h3 className="font-medium mb-1">Pick your service</h3>
                            <p className="text-sm text-gray-500">Regular, Deep, or Move-Out</p>
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-3">
                                2
                            </div>
                            <h3 className="font-medium mb-1">See your price</h3>
                            <p className="text-sm text-gray-500">$100-$400 based on home size</p>
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-3">
                                3
                            </div>
                            <h3 className="font-medium mb-1">Book online</h3>
                            <p className="text-sm text-gray-500">Choose date and time</p>
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-3">
                                4
                            </div>
                            <h3 className="font-medium mb-1">We clean</h3>
                            <p className="text-sm text-gray-500">Show up on time, guaranteed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Services Carousel Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-semibold text-foreground">Our Services in {city.name}</h2>
                        <Link
                            href="/services"
                            className="hidden md:block text-sm text-gray-500 hover:text-foreground transition-colors"
                        >
                            View all services →
                        </Link>
                    </div>

                    <ServiceCarousel>
                        {services.map(service => (
                            <ServiceCard
                                key={service.slug}
                                service={service}
                                citySlug={city.slug}
                                cityName={city.name}
                                cityWikipediaUrl={city.wikipediaUrl}
                            />
                        ))}
                    </ServiceCarousel>

                    {/* Mobile "View all" link */}
                    <div className="mt-8 text-center md:hidden">
                        <Link
                            href="/services"
                            className="text-sm font-medium text-foreground underline underline-offset-4"
                        >
                            See all cleaning options →
                        </Link>
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
                                    <Link
                                        key={hood}
                                        href={`/book?city=${city.slug}&neighborhood=${encodeURIComponent(hood)}`}
                                        className="px-4 py-2 bg-gray-50 rounded-[4px] text-sm text-gray-600 border border-gray-200/50 hover:border-accent/40 hover:bg-white hover:text-accent transition-all"
                                    >
                                        {hood}
                                    </Link>
                                ))}
                            </div>
                            <p className="mt-8 text-xs text-gray-400 tracking-wider uppercase">
                                Service Area ZIPs: {city.zipCodes.join(', ')}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-6 text-foreground">Why {city.name} Homeowners Choose CLEENLY</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {content.whyChoose || "Our professional cleaners are background-checked, insured, and dedicated to making your home shine. We understand the local needs of our community and provide tailored cleaning services that fit your schedule and lifestyle."}
                            </p>
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

            {content.isLoaded && (
                <div className="hidden">Localized content loaded for {city.slug}</div>
            )}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "LocalBusiness",
                                "@id": `https://cleenly.app/${city.slug}/#LocalBusiness`,
                                "name": "CLEENLY",
                                "description": `House cleaning services in ${city.name}, WA`,
                                "url": `https://cleenly.app/${city.slug}`,
                                "telephone": "+1-206-555-0199",
                                "email": "hello@cleenly.app",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": city.name,
                                    "addressRegion": "WA",
                                    "addressCountry": "US"
                                },
                                "geo": {
                                    "@type": "GeoCoordinates",
                                    "latitude": city.coordinates.lat,
                                    "longitude": city.coordinates.lng
                                },
                                "areaServed": {
                                    "@type": "City",
                                    "name": city.name,
                                    "sameAs": city.wikipediaUrl
                                },
                                "priceRange": "$$",
                                "hasOfferCatalog": {
                                    "@type": "OfferCatalog",
                                    "name": "Cleaning Services",
                                    "itemListElement": services.map(service => ({
                                        "@type": "Offer",
                                        "itemOffered": {
                                            "@type": "Service",
                                            "name": service.name
                                        }
                                    }))
                                }
                            },
                            {
                                "@type": "BreadcrumbList",
                                "itemListElement": [
                                    {
                                        "@type": "ListItem",
                                        "position": 1,
                                        "name": "Home",
                                        "item": "https://cleenly.app"
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 2,
                                        "name": city.name
                                    }
                                ]
                            },
                            {
                                "@type": "FAQPage",
                                "mainEntity": faqs.map(faq => ({
                                    "@type": "Question",
                                    "name": faq.question,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": faq.answer
                                    }
                                }))
                            }
                        ]
                    })
                }}
            />
            <Footer currentCity={city.slug} />
        </main>
    );
}
