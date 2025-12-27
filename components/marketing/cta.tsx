import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="bg-foreground py-20 text-background md:py-28 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Ready for a clean home?
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
          See your price in 2 minutes. No phone calls. No BS.
        </p>
        <Button
          size="lg"
          className="bg-background text-foreground hover:bg-background/90"
          asChild
        >
          <Link href="/book">See My Price Now</Link>
        </Button>
      </div>
    </section>
  );
}

