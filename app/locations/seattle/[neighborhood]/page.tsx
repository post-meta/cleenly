import { SEATTLE_NEIGHBORHOODS } from '@/lib/data/cities';
import { LocalHero } from '@/components/marketing/local-hero';
import { LocalFAQ } from '@/components/marketing/local-faq';
import { PricingPreview } from '@/components/marketing/pricing-preview';
import { WhyUs } from '@/components/marketing/why-us';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ neighborhood: string }>;
}

export async function generateStaticParams() {
    return SEATTLE_NEIGHBORHOODS.map((nh) => ({
        neighborhood: nh.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { neighborhood: nhSlug } = await params;
    const nh = SEATTLE_NEIGHBORHOODS.find((n) => n.slug === nhSlug);

    if (!nh) return {};

    return {
        title: `House Cleaning in ${nh.name}, Seattle WA | CLEENLY`,
        description: `Professional house cleaning services in ${nh.name}. Trusted by residents near ${nh.landmarks.slice(0, 2).join(' and ')}. Book online in 2 minutes.`,
    };
}

export default async function SeattleNeighborhoodPage({ params }: Props) {
    const { neighborhood: nhSlug } = await params;
    const nh = SEATTLE_NEIGHBORHOODS.find((n) => n.slug === nhSlug);

    if (!nh) notFound();

    return (
        <main className="min-h-screen">
            <LocalHero city={nh} />
            <PricingPreview />
            <HowItWorks />
            <WhyUs />
            <LocalFAQ city={nh} />
        </main>
    );
}
