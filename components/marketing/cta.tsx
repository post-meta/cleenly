import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="bg-surface-warm py-20 md:py-28 text-center border-y border-border">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display font-normal text-[44px] md:text-[56px] leading-[1.1] tracking-[-0.02em] mb-6 text-foreground">
          Ready for a cleaner home?
        </h2>
        <p className="text-[19px] text-foreground-muted max-w-2xl mx-auto mb-10 leading-[1.65]">
          See your price in 2 minutes. No memberships, no hidden fees.
        </p>
        <Button size="lg" asChild>
          <Link href="/book">See my price now</Link>
        </Button>
      </div>
    </section>
  );
}
