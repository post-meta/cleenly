import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="bg-muted/40 py-20 md:py-28 text-center border-y border-border">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight text-foreground">
          Ready for a cleaner home?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          See your price in 2 minutes. No memberships, no hidden fees.
        </p>
        <Button size="lg" asChild>
          <Link href="/book">See my price now</Link>
        </Button>
      </div>
    </section>
  );
}
