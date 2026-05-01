import { Container } from "@/components/ui/container";

const photos = [
    {
        src: "/hero-image.jpg",
        alt: "Calm clean kitchen with a single mug on the counter and soft morning light",
        caption: "morning, kitchen",
    },
    {
        src: "/lifestyle-bedroom.jpg",
        alt: "Made bed with crisp linen sheets and a folded throw, soft daylight through sheer curtains",
        caption: "made bed, soft light",
    },
    {
        src: "/lifestyle-living-1.jpg",
        alt: "Tidy living room with a single mug on the coffee table and soft daylight",
        caption: "the room, set in order",
    },
    {
        src: "/hero-kitchen-alt.jpg",
        alt: "Clean kitchen with morning light on a wooden counter and a small plant",
        caption: "the counter, after",
    },
];

export function LifestyleStrip() {
    return (
        <section className="py-24 md:py-32 bg-white">
            <Container>
                <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                        We clean. You live.
                    </h2>
                    <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                        What your home looks like when we&apos;re done — and you can get
                        on with the day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto">
                    {photos.map((photo) => (
                        <figure key={photo.src} className="group">
                            <div className="overflow-hidden rounded-2xl bg-muted shadow-sm">
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                                    width={800}
                                    height={600}
                                    loading="lazy"
                                />
                            </div>
                            <figcaption className="mt-3 text-sm italic text-muted-foreground">
                                — {photo.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </Container>
        </section>
    );
}
