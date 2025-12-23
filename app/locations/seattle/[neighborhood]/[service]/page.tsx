import { SEATTLE_NEIGHBORHOODS } from '@/lib/data/cities';
import { SERVICES_DATA } from '@/lib/data/services-data';
import { LocalHero } from '@/components/marketing/local-hero';
import { LocalFAQ } from '@/components/marketing/local-faq';
import { WhyUs } from '@/components/marketing/why-us';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Services } from '@/components/marketing/services';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ neighborhood: string; service: string }>;
}

export async function generateStaticParams() {
    const params: { neighborhood: string; service: string }[] = [];

    SEATTLE_NEIGHBORHOODS.forEach((nh) => {
        SERVICES_DATA.forEach((service) => {
            params.push({
                neighborhood: nh.slug,
                service: service.slug,
            });
        });
    });

    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { neighborhood: nhSlug, service: serviceSlug } = await params;
    const nh = SEATTLE_NEIGHBORHOODS.find((n) => n.slug === nhSlug);
    const service = SERVICES_DATA.find((s) => s.slug === serviceSlug);

    if (!nh || !service) return {};

    return {
        title: `${service.name} in ${nh.name}, Seattle WA | CLEENLY`,
        description: `Book ${service.name.toLowerCase()} in ${nh.name}, Seattle. Serving near ${nh.landmarks.slice(0, 2).join(' and ')}. Transparent pricing and instant booking.`,
    };
}

export default async function SeattleNeighborhoodServicePage({ params }: Props) {
    const { neighborhood: nhSlug, service: serviceSlug } = await params;
    const nh = SEATTLE_NEIGHBORHOODS.find((n) => n.slug === nhSlug);
    const service = SERVICES_DATA.find((s) => s.slug === serviceSlug);

    if (!nh || !service) notFound();

    return (
        <main className="min-h-screen">
            <LocalHero city={nh} service={service} />
            <HowItWorks />
            <WhyUs />
            <LocalFAQ city={nh} service={service} />
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Looking for other services in {nh.name}?</h2>
                    <Services />
                </div>
            </section>
        </main>
    );
}
