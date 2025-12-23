import { SERVICES_DATA } from '@/lib/data/services-data';
import { CITIES } from '@/lib/data/cities';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WhyUs } from '@/components/marketing/why-us';
import { PricingPreview } from '@/components/marketing/pricing-preview';

export default function ServicesPage() {
    return (
        <main className="min-h-screen">
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-5xl font-bold mb-6">Our Cleaning Services</h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl">
                        Professional, reliable, and premium cleaning services tailored to your home's needs in the Greater Seattle area.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {SERVICES_DATA.map((service) => (
                            <div key={service.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                                <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
                                <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                                <ul className="space-y-3 mb-8">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link href={`/services/${service.slug}`} className="mt-auto">
                                    <Button variant="outline" className="w-full">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-3xl font-bold mb-8">Areas We Serve</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {CITIES.map((city) => (
                                <Link
                                    key={city.slug}
                                    href={`/locations/${city.slug}`}
                                    className="text-gray-600 hover:text-accent transition-colors"
                                >
                                    {city.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <PricingPreview />
            <WhyUs />
        </main>
    );
}
