import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { services, getServiceBySlug, getAllServiceSlugs } from '@/lib/data/services';
import { cities } from '@/lib/data/cities';
import { JsonLd } from '@/components/shared/json-ld';

interface PageProps {
    params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
    return getAllServiceSlugs().map(slug => ({ service: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { service: serviceSlug } = await params;
    const service = getServiceBySlug(serviceSlug);
    if (!service) return {};

    return {
        title: `${service.name} Seattle | ${service.priceRange} | CLEENLY`,
        description: `${service.shortDescription} Serving Seattle, Bellevue, Kirkland, and Greater Eastside. ${service.priceRange}. Book online.`,
        alternates: {
            canonical: `https://cleenly.app/services/${service.slug}`,
        },
    };
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { service: serviceSlug } = await params;
    const service = getServiceBySlug(serviceSlug);
    if (!service) notFound();

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cleenly.app" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://cleenly.app/services" },
            { "@type": "ListItem", "position": 3, "name": service.name }
        ]
    };

    // Топ-6 городов для ссылок
    const topCities = cities.slice(0, 6);

    return (
        <main className="bg-white">
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />

            {/* Breadcrumbs */}
            <nav className="border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-black">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/services" className="hover:text-black">Services</Link>
                    <span className="mx-2">/</span>
                    <span className="text-black">{service.name}</span>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black">
                        {service.name}
                    </h1>
                    <p className="mt-6 text-xl text-gray-500 max-w-2xl">
                        {service.longDescription}
                    </p>
                    <div className="mt-8 flex items-baseline gap-4">
                        <span className="text-3xl font-semibold text-black">{service.priceRange}</span>
                        <span className="text-gray-500">{service.duration}</span>
                    </div>
                    <div className="mt-8">
                        <Link
                            href="/book"
                            className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-black/90 transition-colors"
                        >
                            Book {service.name}
                        </Link>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-8 text-black">What's Included</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {service.checklist.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                                <span className="text-black font-medium text-lg">✓</span>
                                <span className="text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-white">
                        <h3 className="font-semibold mb-3 text-black">Not included (available as add-ons):</h3>
                        <ul className="text-gray-500 space-y-1">
                            {service.notIncluded.map((item, i) => (
                                <li key={i}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Best For */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-8 text-black">Best For</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {service.bestFor.map((item, i) => (
                            <div key={i} className="p-6 border border-gray-200 rounded-lg bg-white">
                                <p className="font-medium text-gray-700">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-8 text-black">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {service.faqs.map((faq, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                <h3 className="font-semibold mb-2 text-black">{faq.question}</h3>
                                <p className="text-gray-500 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* City Links */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-semibold mb-8 text-black">{service.name} by City</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {topCities.map(city => (
                            <Link
                                key={city.slug}
                                href={`/${city.slug}/${service.slug}`}
                                className="p-4 border border-gray-200 rounded-lg text-center hover:border-black/20 transition-colors"
                            >
                                <span className="font-medium text-black">{city.name}</span>
                            </Link>
                        ))}
                    </div>
                    <p className="mt-6 text-gray-400">
                        We serve 20+ cities across Greater Seattle.{' '}
                        <Link href="/services" className="text-black underline underline-offset-4 hover:no-underline">
                            View all locations →
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
