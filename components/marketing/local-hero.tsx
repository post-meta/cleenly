import { City } from '@/lib/data/cities';
import { ServiceMetadata } from '@/lib/data/services-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LocalHeroProps {
    city: City;
    service?: ServiceMetadata;
}

export function LocalHero({ city, service }: LocalHeroProps) {
    const title = service
        ? `${service.name} in ${city.name}`
        : `House Cleaning Services in ${city.name}`;

    return (
        <section className="relative py-20 bg-gray-50 border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Top-rated professional cleaning for homes and apartments in {city.name}.
                        Serving homeowners near {city.landmarks.slice(0, 2).join(' and ')}.
                        {city.context}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/book">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                                Book in 2 Minutes
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">
                                See All Pricing
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="hidden md:block relative">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-accent/10 rounded-xl">
                                <span className="text-2xl font-bold text-accent">#1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Local Choice</h3>
                                <p className="text-gray-500 text-sm">Trusted in {city.neighborhoods[0]}</p>
                            </div>
                        </div>
                        <ul className="space-y-4">
                            {service?.features.slice(0, 4).map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
