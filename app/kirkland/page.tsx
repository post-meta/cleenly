import type { Metadata } from 'next';
import { services } from '@/lib/data/services';
import { ServiceCard } from '@/components/shared/service-card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'House Cleaning in Kirkland, WA | CLEENLY',
    description: 'House cleaning in Kirkland. Serving homes near Carillon Point, Juanita, and Totem Lake. From $100-$400 based on home size. Book online in 2 minutes.',
    openGraph: {
        title: 'House Cleaning in Kirkland, WA | CLEENLY',
        description: 'House cleaning in Kirkland. From waterfront condos to family homes. Book online in 2 minutes.',
        url: 'https://cleenly.app/kirkland',
        siteName: 'CLEENLY',
        images: [
            {
                url: 'https://cleenly.app/images/kirkland-cleaning-og.jpg',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'House Cleaning in Kirkland, WA | CLEENLY',
        description: 'House cleaning in Kirkland. Book online in 2 minutes.',
        images: ['https://cleenly.app/images/kirkland-cleaning-og.jpg'],
    },
};

const kirklandFAQs = [
    {
        question: "Do you clean condos at Carillon Point?",
        answer: "Yes. We clean waterfront condos throughout Kirkland including Carillon Point, Marina Park, and downtown high-rises. We're familiar with building requirements and HOA rules."
    },
    {
        question: "Can you clean homes with lake views and lots of windows?",
        answer: "Regular cleaning includes window sills and frames. For full window cleaning (inside and outside glass), add it during booking. Popular for Juanita and Houghton waterfront homes."
    },
    {
        question: "Do you serve Totem Lake and Kingsgate?",
        answer: "Yes. We serve all Kirkland neighborhoods including Totem Lake, Kingsgate, Finn Hill, Juanita, Houghton, and downtown Kirkland."
    },
    {
        question: "What if I have a dog or cat?",
        answer: "Pets are fine. Let us know during booking so we can plan accordingly. Most cleaners are comfortable with pets."
    },
    {
        question: "How do you handle cleaning for Google campus employees with busy schedules?",
        answer: "You can book evening or weekend slots. We also offer keyless entry options if you want cleaning while you're at work."
    }
];

export default function KirklandPage() {
    return (
        <main>
            {/* Hero */}
            <section className="py-24 bg-background">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Breadcrumbs */}
                    <nav className="text-sm text-muted-foreground mb-8">
                        <a href="/" className="hover:text-foreground">Home</a>
                        {' '}/{' '}
                        <span>Kirkland</span>
                    </nav>

                    {/* Two-column layout */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div>
                            <h1 className="text-5xl font-bold mb-6">
                                House Cleaning in Kirkland
                            </h1>

                            <p className="text-lg text-muted-foreground mb-4">
                                Serving homes near Carillon Point, Juanita Bay Park,
                                and the Google Kirkland Campus. From waterfront condos
                                to family homes in Totem Lake.
                            </p>

                            <p className="text-2xl font-semibold text-foreground mb-8">
                                $100-$400 based on home size
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="/book?city=kirkland"
                                    className="bg-foreground text-background px-6 py-3 rounded-md hover:bg-foreground/90 transition-colors text-center font-medium"
                                >
                                    Get Your Price →
                                </a>

                                <a
                                    href="#services"
                                    className="border border-border px-6 py-3 rounded-md hover:border-foreground transition-colors text-center font-medium"
                                >
                                    See All Services
                                </a>
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div>
                            <img
                                src="/images/cleaning-kirkland.jpg"
                                alt="House cleaning in Kirkland, WA"
                                className="rounded-lg w-full bg-gray-100 object-cover"
                                width={600}
                                height={400}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Cards Section */}
            <section id="services" className="py-16 bg-background">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-semibold mb-2">
                        Cleaning Services in Kirkland
                    </h2>
                    <p className="text-muted-foreground mb-12">
                        Pick what fits your home.
                    </p>

                    {/* Desktop: Show first 3 in grid */}
                    <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
                        {services.slice(0, 3).map(service => (
                            <ServiceCard
                                key={service.slug}
                                service={service}
                                citySlug="kirkland"
                                cityName="Kirkland"
                            />
                        ))}
                    </div>

                    {/* Mobile: Show all in carousel */}
                    <div className="md:hidden overflow-x-auto hide-scrollbar mb-8">
                        <div className="flex gap-4 pb-4">
                            {services.map(service => (
                                <div key={service.slug} className="min-w-[280px] max-w-[320px]">
                                    <ServiceCard
                                        service={service}
                                        citySlug="kirkland"
                                        cityName="Kirkland"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link to all services */}
                    <div className="text-center">
                        <a
                            href="/services?city=kirkland"
                            className="text-foreground underline hover:no-underline font-medium"
                        >
                            View all 10 services →
                        </a>
                    </div>
                </div>
            </section>

            {/* Trust Strip */}
            <section className="py-4 bg-muted">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <span className="text-green-600">✓</span> Background-checked cleaners
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-600">✓</span> Insured & bonded
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-600">✓</span> 24-hour guarantee
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-600">✓</span> No hidden fees
                        </span>
                    </div>
                </div>
            </section>

            {/* Why Kirkland */}
            <section className="py-12 bg-muted">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-6">
                        Why Kirkland Homeowners Choose CLEENLY
                    </h2>

                    <div className="space-y-4 text-foreground">
                        <p className="text-lg">
                            Google employees and busy Houghton families choose CLEENLY
                            because the price doesn&apos;t change after we arrive.
                        </p>

                        <p>
                            Kirkland homes range from 1970s split-levels in Juanita to
                            ultra-modern waterfront condos at Carillon Point. We know
                            how to clean original hardwood and modern quartz without damage.
                        </p>

                        <p>
                            No generic &quot;one product for everything&quot; approach. Your home
                            gets the right treatment.
                        </p>
                    </div>
                </div>
            </section>

            {/* Neighborhoods */}
            <section className="py-16 bg-background">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-8">
                        Neighborhoods We Serve in Kirkland
                    </h2>

                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            "Downtown Kirkland",
                            "Juanita",
                            "Houghton",
                            "Finn Hill",
                            "Totem Lake",
                            "Kingsgate",
                            "Norkirk"
                        ].map(neighborhood => (
                            <span
                                key={neighborhood}
                                className="bg-muted px-4 py-2 rounded-full text-sm font-medium"
                            >
                                {neighborhood}
                            </span>
                        ))}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Service Area ZIP Codes: 98033, 98034
                    </p>
                </div>
            </section>

            {/* Local FAQ */}
            <section className="py-16 bg-background">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-8">
                        Common Questions in Kirkland
                    </h2>

                    <div className="space-y-4">
                        {kirklandFAQs.map((faq, index) => (
                            <details
                                key={index}
                                className="border border-border rounded-lg p-4 hover:border-foreground/20 transition-colors group"
                            >
                                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                                    <span>{faq.question}</span>
                                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                                        ▼
                                    </span>
                                </summary>
                                <p className="mt-4 text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nearby Areas */}
            <section className="py-12 bg-muted">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-6">
                        We Also Serve Nearby
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Bellevue", slug: "bellevue" },
                            { name: "Redmond", slug: "redmond" },
                            { name: "Bothell", slug: "bothell" },
                            { name: "Woodinville", slug: "woodinville" }
                        ].map(city => (
                            <a
                                key={city.slug}
                                href={`/${city.slug}`}
                                className="block p-4 bg-background rounded-lg border border-border hover:border-foreground transition-colors group"
                            >
                                <span className="font-medium block mb-1 group-hover:text-foreground/80">
                                    {city.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    House Cleaning →
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-[#D97757] text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready for a Cleaner Home in Kirkland?
                    </h2>

                    <p className="text-lg mb-8 opacity-90">
                        Join hundreds of Kirkland families who trust CLEENLY
                        for their weekly and monthly cleanings.
                    </p>

                    <a
                        href="/book?city=kirkland"
                        className="inline-block bg-white text-[#D97757] px-8 py-4 rounded-md font-semibold hover:bg-white/90 transition-colors"
                    >
                        Get Your Price in 2 Minutes
                    </a>
                </div>
            </section>

            {/* Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "CLEENLY - Kirkland",
                        "url": "https://cleenly.app/kirkland",
                        "logo": "https://cleenly.app/logo.png",
                        "image": "https://cleenly.app/images/kirkland-cleaning.jpg",
                        "telephone": "+1-206-XXX-XXXX",
                        "email": "hello@cleenly.app",
                        "priceRange": "$100-$400",
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 47.6769,
                            "longitude": -122.2060
                        },
                        "areaServed": {
                            "@type": "City",
                            "name": "Kirkland",
                            "sameAs": "https://en.wikipedia.org/wiki/Kirkland,_Washington"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Cleaning Services in Kirkland",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Regular Cleaning",
                                        "description": "Routine house cleaning in Kirkland"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Deep Cleaning",
                                        "description": "Thorough deep cleaning in Kirkland"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Move-Out Cleaning",
                                        "description": "End of lease cleaning in Kirkland"
                                    }
                                }
                            ]
                        }
                    })
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
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
                                "name": "Kirkland House Cleaning",
                                "item": "https://cleenly.app/kirkland"
                            }
                        ]
                    })
                }}
            />

        </main>
    );
}
