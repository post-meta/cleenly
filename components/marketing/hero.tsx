import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden animate-fadeInUp">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 relative z-10">
        {/* Left Content - 6 columns */}
        <div className="col-span-12 space-y-8 md:col-span-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
            House Cleaning in Seattle — Book Online in Minutes
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            See your price upfront. Choose your cleaner. Schedule when it works for you.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/book">Get Your Price →</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="col-span-12 md:col-span-6 flex items-center justify-center">
          <img
            src="/hero-image.jpg"
            alt="Bright empty living room with morning light"
            className="w-full h-auto rounded-[8px] object-cover aspect-[16/9] md:aspect-auto"
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-6">
        <p className="text-sm font-medium tracking-widest uppercase text-gray-500 opacity-80">
          We clean. You live.
        </p>
      </div>
    </section>
  );
}
