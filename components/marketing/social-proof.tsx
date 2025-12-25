import { Star } from "lucide-react";

export function SocialProof() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <div className="mb-6 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                </div>

                <figure>
                    <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
                        &quot;Booked my first clean in under 2 minutes. Cleaner showed up on time. Place looks great.&quot;
                    </blockquote>
                    <figcaption className="mt-6 text-base text-muted-foreground">
                        — Sarah, Capitol Hill
                    </figcaption>
                </figure>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
                    <span>150+ homes cleaned this month</span>
                    <span className="hidden md:inline text-gray-300">•</span>
                    <span>4.8 average rating</span>
                </div>
            </div>
        </section>
    );
}
