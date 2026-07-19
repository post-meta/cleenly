import { ServiceCard } from "@/components/shared/service-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getServiceBySlug } from "@/lib/data/services";

const STANDARD_SLUGS = ["regular-cleaning", "deep-cleaning", "move-out-cleaning"];

export function PricingSection() {
    const standard = STANDARD_SLUGS.map(getServiceBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));

    return (
        <section className="pricing py-20 md:py-28 bg-background">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14 md:mb-20">
                    <h2 className="font-display font-normal text-[36px] md:text-[44px] tracking-[-0.015em] text-foreground">
                        Simple, honest <em className="italic text-foreground-soft font-display">pricing</em>
                    </h2>
                    <p className="mt-4 text-[17px] text-foreground-muted max-w-2xl mx-auto">
                        Price depends on your home size and condition. The calculator shows your exact price before you book.
                    </p>
                </div>

                {/* Standard tier */}
                <div className="mb-6">
                    <Eyebrow>Standard</Eyebrow>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {standard.map((service) => (
                        <ServiceCard key={service.slug} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
