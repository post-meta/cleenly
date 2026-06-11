import Link from "next/link";

const neighborhoods = [
  ["Capitol Hill", "98102"],
  ["Ballard", "98107"],
  ["Queen Anne", "98109"],
  ["Fremont", "98103"],
  ["Wallingford", "98103"],
  ["Madrona", "98122"],
  ["West Seattle", "98116"],
  ["Green Lake", "98103"],
  ["U District", "98105"],
  ["Bellevue Downtown", "98004"],
  ["Kirkland", "98033"],
  ["Redmond", "98052"],
];

export function ServiceAreas() {
  return (
    <section id="areas" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-14">
          <span className="eyebrow">Greater Seattle</span>
          <h2 className="mt-4 text-[48px] md:text-[56px] leading-[1.1] tracking-[-0.015em] font-display font-normal text-foreground">
            Our service <em className="italic text-foreground-soft font-display font-normal">areas.</em>
          </h2>
          <p className="mt-3.5 text-[17px] text-foreground-soft leading-relaxed max-w-[540px] mx-auto font-sans">
            We keep your crew the same whenever we can — they learn your
            building's quirks the second time around.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-[1080px] mx-auto">
          {neighborhoods.map(([name, zip]) => (
            <Link
              key={name}
              href={`/book?neighborhood=${encodeURIComponent(name)}&city=Seattle`}
              className="flex flex-col gap-1.5 p-5 border border-border rounded-[16px] bg-background transition-all duration-300 hover:border-border-hover"
            >
              <span className="text-[16px] font-semibold text-foreground tracking-tight">
                {name}
              </span>
              <span className="font-mono text-[12px] text-foreground-muted">
                {zip}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-9 text-center text-[13px] text-foreground-muted">
          Don't see your neighborhood?{" "}
          <Link href="/book" className="text-foreground hover:underline">
            Tell us where you are
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

