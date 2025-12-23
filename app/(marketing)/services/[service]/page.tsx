import { SERVICES_DATA } from '@/lib/data/services-data';
import { CITIES } from '@/lib/data/cities';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { WhyUs } from '@/components/marketing/why-us';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
    return SERVICES_DATA.map((service) => ({
        service: service.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { service: serviceSlug } = await params;
    const service = SERVICES_DATA.find((s) => s.slug === serviceSlug);

    if (!service) return {};

    return {
        title: `${service.name} Services | Greater Seattle Area | CLEENLY`,
        description: `${service.description} Available in Seattle, Bellevue, Kirkland, and surrounding areas. Professional, high-quality cleaning starting from ${service.priceRange}.`,
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { service: serviceSlug } = await params;
    const service = SERVICES_DATA.find((s) => s.slug === serviceSlug);

    if (!service) notFound();

    return (
        <main className="min-h-screen">
            <section className="py-20 bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-bold mb-6">{service.name} Services</h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {service.description} Our professional team specializes in providing the highest quality {service.name.toLowerCase()} for homes and apartments across the Washington area.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/book">
                                <Button size="lg" className="h-14 px-8 text-lg">Book {service.name} Now</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12">What's Included in {service.name}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.features.map((feature, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                </div>
                                <span className="text-gray-700 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <HowItWorks />
            <WhyUs />

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8">Available in These Cities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {CITIES.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/locations/${city.slug}/${service.slug}`}
                                className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:border-accent hover:text-accent transition-all shadow-sm"
                            >
                                {city.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
