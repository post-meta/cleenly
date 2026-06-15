import Image from "next/image";
import Link from "next/link";
import { PRICE_DISPLAY } from "@/lib/pricing";

const services = [
  {
    id: "regular",
    name: "Regular Cleaning",
    desc: "Routine maintenance. Dusting, vacuuming, bathrooms, kitchen.",
    bestFor: "Weekly or bi-weekly cleaning",
    // First visit is priced as a deep clean (heavier first clean).
    price: `From $${PRICE_DISPLAY.firstClean.from}`,
    img: "/lifestyle-living-2.jpg",
    slug: "regular-cleaning",
    href: "/book?service=regular-cleaning",
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    desc: "Everything in regular plus inside appliances, baseboards, detailed work.",
    bestFor: "First time, seasonal refresh, or overdue cleaning",
    price: `From $${PRICE_DISPLAY.firstClean.from}`,
    img: "/service-deep.jpg",
    slug: "deep-cleaning",
    href: "/book?service=deep-cleaning",
  },
  {
    id: "move-out",
    name: "Move-Out Cleaning",
    desc: "Complete cleaning to landlord standards. Get your deposit back.",
    bestFor: "End of lease, selling, or move-in prep",
    price: `From $${PRICE_DISPLAY.moveOut.from}`,
    img: "/service-move-out.jpg",
    slug: "move-out-cleaning",
    href: "/book?service=move-out-cleaning",
  },
  {
    id: "airbnb",
    name: "Airbnb Turnover",
    desc: "Same-day turnaround between guests. Linens, restocking, photo-ready.",
    bestFor: "Short-term hosts in Seattle metro",
    price: `From $${PRICE_DISPLAY.minJob}`,
    img: "/service-airbnb.jpg",
    slug: "airbnb-turnover",
    href: "/book",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-surface-warm">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-16 mb-14 items-end">
          <div>
            <span className="eyebrow">What we do</span>
            <h2 className="mt-4 text-[48px] md:text-[56px] leading-[1.1] tracking-[-0.020em] font-display font-normal text-foreground">
              Four signature <em className="italic text-foreground-soft font-display font-normal">protocols.</em>
            </h2>
          </div>
          <p className="text-[18px] leading-[1.55] text-foreground-soft max-w-[460px] lg:mb-2">
            Each service is a defined checklist, a typical duration, and an
            upfront estimate. We bill the final price by the hour — $75 per
            cleaner-hour, $185 minimum — and confirm it before charging.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {services.map((s) => (
            <article
              key={s.id}
              className="bg-background border border-border rounded-[24px] overflow-hidden grid grid-cols-1 sm:grid-cols-[180px_1fr] transition-all duration-300 hover:border-border-hover shadow-sm"
            >
              <div className="relative h-[200px] sm:h-full min-h-[180px] w-full">
                <Image
                  src={s.img}
                  alt={s.name}
                  fill
                  className="object-cover"
                  sizes="(max-w-640px) 100vw, 180px"
                />
              </div>
              <div className="p-6 md:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline gap-3">
                    <h3 className="text-[22px] font-sans font-semibold text-foreground tracking-tight">
                      {s.name}
                    </h3>
                    <span
                      className="font-display font-normal text-[22px] tracking-[-0.01em] text-foreground whitespace-nowrap tnum"
                    >
                      {s.price}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-[1.55] text-foreground-soft">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4.5 border-t border-border flex items-center justify-between">
                  <span className="text-[13px] text-foreground-soft">
                    Best for: <span className="text-foreground font-medium">{s.bestFor}</span>
                  </span>
                  <Link
                    href={s.href}
                    className="text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

