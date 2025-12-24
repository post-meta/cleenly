import Link from 'next/link';
import { Metadata } from 'next';
import { services } from '@/lib/data/services';
import { JsonLd } from '@/components/shared/json-ld';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, Truck } from "lucide-react";

export const metadata: Metadata = {
    title: 'Cleaning Services Seattle | Regular, Deep, Move-Out | CLEENLY',
    description: 'Professional home cleaning services in Greater Seattle. Regular cleaning from $100, deep cleaning from $150, move-out cleaning from $200. Book online.',
    alternates: {
        canonical: 'https://cleenly.app/services',
    },
};

const iconMap = {
    'regular-cleaning': Sparkles,
    'deep-cleaning': Home,
    'move-out-cleaning': Truck,
};

export default function ServicesPage() {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cleenly.app" },
            { "@type": "ListItem", "position": 2, "name": "Services" }
        ]
    };

    return (
        <main className="bg-background">
            <JsonLd data={breadcrumbSchema} />

            {/* Breadcrumbs */}
            <nav className="border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">Services</span>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative flex min-h-[60vh] items-center overflow-hidden animate-fadeInUp py-20">
                <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 relative z-10 w-full">
                    <div className="col-span-12 space-y-8 md:col-span-10 lg:col-span-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
                            Our Cleaning Services
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                            Three service levels designed for your home's needs. From routine maintenance to deep refreshing, we've got you covered.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Button variant="primary" size="lg" asChild>
                                <Link href="/book">Book Now →</Link>
                            </Button>
                            <Button variant="link" asChild>
                                <Link href="/pricing">View Full Pricing</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="pb-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-8 md:grid-cols-3">
                        {services.map((service) => {
                            const Icon = iconMap[service.slug as keyof typeof iconMap] || Sparkles;
                            return (
                                <div
                                    key={service.slug}
                                    className="group flex flex-col rounded-[12px] border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-accent hover:shadow-xl"
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[8px] bg-accent/5 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <h2 className="mb-4 text-xl font-semibold text-foreground">
                                        {service.name}
                                    </h2>
                                    <p className="mb-6 text-sm leading-relaxed text-gray-600">
                                        {service.shortDescription}
                                    </p>

                                    <div className="mb-6 flex-1 space-y-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-semibold text-foreground">{service.priceRange}</span>
                                            <span className="text-xs text-gray-400 uppercase tracking-wider">{service.duration}</span>
                                        </div>

                                        <ul className="space-y-3 text-sm text-gray-600">
                                            {service.checklist.slice(0, 5).map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                                                        ✓
                                                    </span>
                                                    {item}
                                                </li>
                                            ))}
                                            {service.checklist.length > 5 && (
                                                <li className="text-xs text-gray-400 pl-6">
                                                    +{service.checklist.length - 5} more inclusions
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="mt-auto space-y-4 pt-6 border-t border-gray-50">
                                        <Button variant="primary" asChild className="w-full">
                                            <Link href={`/book?service=${service.slug}`}>
                                                Book This Service
                                            </Link>
                                        </Button>
                                        <Button variant="link" asChild className="w-full text-center">
                                            <Link href={`/services/${service.slug}`}>
                                                Detailed Checklist →
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-2xl font-semibold mb-6">Fully Local & Insured</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                        CLEENLY operates throughout the Greater Seattle area. Every cleaner on our platform is background-checked and fully insured.
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-400 uppercase tracking-widest">
                        <span>Background Checked</span>
                        <span>•</span>
                        <span>100% Guaranteed</span>
                        <span>•</span>
                        <span>Locally Owned</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
