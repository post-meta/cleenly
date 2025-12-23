import { CITIES } from '@/lib/data/cities';
import { SERVICES_DATA } from '@/lib/data/services-data';
import { LocalHero } from '@/components/marketing/local-hero';
import { LocalFAQ } from '@/components/marketing/local-faq';
import { WhyUs } from '@/components/marketing/why-us';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Services } from '@/components/marketing/services';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ city: string; service: string }>;
}

export async function generateStaticParams() {
    const params: { city: string; service: string }[] = [];

    CITIES.forEach((city) => {
        SERVICES_DATA.forEach((service) => {
            params.push({
                city: city.slug,
                service: service.slug,
            });
        });
    });

    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city: citySlug, service: serviceSlug } = await params;
    const city = CITIES.find((c) => c.slug === citySlug);
    const service = SERVICES_DATA.find((s) => s.slug === serviceSlug);

    if (!city || !service) return {};

    return {
        title: `${service.name} in ${city.name}, WA | ${service.priceRange} | CLEENLY`,
        description: `Book ${service.name.toLowerCase()} in ${city.name}, WA. ${service.description} Serving near ${city.landmarks.slice(0, 2).join(' and ')}. See price & book online.`,
    };
}

export default async function CityServicePage({ params }: Props) {
    const { city: citySlug, service: serviceSlug } = await params;
    const city = CITIES.find((c) => c.slug === citySlug);
    const service = SERVICES_DATA.find((s) => s.slug === serviceSlug);

    if (!city || !service) notFound();

    return (
        <main className="min-h-screen">
            <LocalHero city={city} service={service} />
            <HowItWorks />
            <WhyUs />
            <LocalFAQ city={city} service={service} />
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Looking for other services in {city.name}?</h2>
                    <Services />
                </div>
            </section>
        </main>
    );
}
