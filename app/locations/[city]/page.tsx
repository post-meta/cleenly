import { CITIES } from '@/lib/data/cities';
import { SERVICES_DATA } from '@/lib/data/services-data';
import { LocalHero } from '@/components/marketing/local-hero';
import { LocalFAQ } from '@/components/marketing/local-faq';
import { PricingPreview } from '@/components/marketing/pricing-preview';
import { WhyUs } from '@/components/marketing/why-us';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
    return CITIES.map((city) => ({
        city: city.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = CITIES.find((c) => c.slug === citySlug);

    if (!city) return {};

    return {
        title: `House Cleaning Services in ${city.name}, WA | CLEENLY`,
        description: `Professional house cleaning in ${city.name}, WA. Trusted by homes in ${city.neighborhoods.slice(0, 3).join(', ')}. Book online in 2 minutes.`,
    };
}

export default async function CityPage({ params }: Props) {
    const { city: citySlug } = await params;
    const city = CITIES.find((c) => c.slug === citySlug);

    if (!city) notFound();

    return (
        <main className="min-h-screen">
            <LocalHero city={city} />
            <PricingPreview />
            <HowItWorks />
            <WhyUs />
            <LocalFAQ city={city} />
        </main>
    );
}
