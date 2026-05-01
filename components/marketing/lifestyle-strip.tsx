import { Container } from "@/components/ui/container";

const photos = [
    {
        src: "/hero-image.jpg",
        alt: "A calm clean kitchen with morning light, a single ceramic mug on the counter",
    },
    {
        src: "/lifestyle-bedroom.jpg",
        alt: "A made bed with crisp linen sheets and a folded throw, soft daylight through sheer curtains",
    },
    {
        src: "/lifestyle-living-1.jpg",
        alt: "A tidy living room with a single mug on the coffee table and soft daylight",
    },
];

export function LifestyleStrip() {
    return (
        <section className="py-24 md:py-32 bg-white">
            <Container>
                <div className="text-center mb-14 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                        We clean. You live.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {photos.map((photo) => (
                        <div key={photo.src} className="overflow-hidden rounded-2xl bg-muted shadow-sm">
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 ease-out hover:scale-[1.02]"
                                width={800}
                                height={1000}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
