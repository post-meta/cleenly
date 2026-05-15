import { ServiceCard } from "@/components/shared/service-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getServiceBySlug } from "@/lib/data/services";

const STANDARD_SLUGS = ["regular-cleaning", "deep-cleaning", "move-out-cleaning"];
const PROTOCOL_SLUGS = ["damp-season-reset", "pollen-purge"];

export function PricingSection() {
    const standard = STANDARD_SLUGS.map(getServiceBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));
    const protocols = PROTOCOL_SLUGS.map(getServiceBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));

    return (
        <section className="pricing py-20 md:py-28 bg-background">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14 md:mb-20">
                    <h2 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.01em] text-foreground">
                        Simple, honest pricing
                    </h2>
                    <p className="mt-4 text-[17px] text-foreground-muted max-w-2xl mx-auto">
                        Price depends on your home size and condition. The calculator shows your exact price before you book.
                    </p>
                </div>

                {/* Standard tier */}
                <div className="mb-6">
                    <Eyebrow>Standard</Eyebrow>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mb-16 md:mb-20">
                    {standard.map((service) => (
                        <ServiceCard key={service.slug} service={service} />
                    ))}
                </div>

                {/* Pacific Northwest Protocols */}
                {protocols.length > 0 && (
                    <>
                        <div className="mb-6">
                            <Eyebrow tone="signal">Pacific Northwest Protocols</Eyebrow>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {protocols.map((service) => (
                                <ServiceCard key={service.slug} service={service} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
