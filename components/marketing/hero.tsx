import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex min-h-[80vh] items-center animate-fadeInUp">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6">
        {/* Left Content - 6 columns */}
        <div className="col-span-12 space-y-6 md:col-span-6">
          <h1 className="text-3xl font-semibold text-foreground">
            House Cleaning in Seattle — Book Online in Minutes
          </h1>

          <p className="text-lg text-gray-600">
            See your price upfront. Choose your cleaner. Schedule when it works for you.
          </p>

          <div className="flex items-center gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/book">Get Your Price →</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Right Content - Empty for "Honest Void" asymmetry */}
        <div className="hidden col-span-6 md:block" />
      </div>
    </section>
  );
}
