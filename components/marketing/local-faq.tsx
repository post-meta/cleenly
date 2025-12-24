import { CityData } from '@/lib/data/cities';
import { ServiceData } from '@/lib/data/services';

interface LocalFAQProps {
    city: CityData;
    service?: ServiceData;
}

export function LocalFAQ({ city, service }: LocalFAQProps) {
    const serviceName = service?.name || 'Cleaning Services';

    const faqs = [
        {
            q: `How much does ${serviceName.toLowerCase()} cost in ${city.name}?`,
            a: `${serviceName} in ${city.name} typically ranges from ${service?.priceRange || '$100-$300'}. The exact price depends on your home's square footage and current condition.`,
        },
        {
            q: `Which areas of ${city.name} do you serve?`,
            a: `We serve all neighborhoods across ${city.name}, including ${city.neighborhoods.slice(0, 3).join(', ')}, and surrounding areas.`,
        },
        {
            q: `How long does ${serviceName.toLowerCase()} take?`,
            a: `Most ${serviceName.toLowerCase()} appointments in ${city.name} take between ${service?.duration || '2-4 hours'}.`,
        },
        {
            q: `Are your cleaners insured?`,
            a: `Yes, all cleaners on the CLEENLY platform are fully insured and background-checked for your peace of mind.`,
        },
    ];

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
            },
        })),
    };

    return (
        <section className="py-16 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Common Questions about {serviceName} in {city.name}
                </h2>
                <div className="space-y-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6">
                            <h3 className="text-xl font-semibold mb-3">{faq.q}</h3>
                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
