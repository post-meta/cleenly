import { Container } from "@/components/ui/container";

const photos = [
    {
        src: "/hero-image.jpg",
        alt: "Calm clean kitchen with a single mug on the counter and soft morning light",
        caption: "Kitchen",
    },
    {
        src: "/lifestyle-bedroom.jpg",
        alt: "Made bed with crisp linen sheets and a folded throw, soft daylight through sheer curtains",
        caption: "Bedroom",
    },
    {
        src: "/lifestyle-living-1.jpg",
        alt: "Tidy living room with a single mug on the coffee table and soft daylight",
        caption: "Living room",
    },
    {
        src: "/hero-kitchen-alt.jpg",
        alt: "Clean kitchen with morning light on a wooden counter and a small plant",
        caption: "Morning",
    },
];

export function LifestyleStrip() {
    return (
        <section className="py-20 md:py-28 bg-white">
            <Container>
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        We clean. You live.
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                        What your home looks like when we&apos;re done — and you can get on with your day.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {photos.map((photo) => (
                        <figure key={photo.src} className="space-y-2">
                            <div className="overflow-hidden rounded-lg bg-muted">
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    className="w-full h-auto object-cover aspect-[4/3]"
                                    width={512}
                                    height={384}
                                    loading="lazy"
                                />
                            </div>
                            <figcaption className="text-xs uppercase tracking-widest text-muted-foreground text-center">
                                {photo.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </Container>
        </section>
    );
}
