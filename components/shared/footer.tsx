import Link from "next/link";
import { Logo } from "./logo";
import { Eyebrow } from "@/components/ui/eyebrow";
import { footerConfig, getFooterCities } from "@/lib/data/footer-config";
import { getCityBySlug } from "@/lib/data/cities";
import { PHONE_DISPLAY, PHONE_SMS_HREF, SUPPORT_EMAIL } from "@/lib/constants";

interface FooterProps {
  currentCity?: string;
  currentService?: string;
}

export function Footer({ currentCity, currentService }: FooterProps = {}) {
  const citySlugs = getFooterCities(currentCity);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-warm pt-20 pb-14">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-block text-[28px] text-foreground no-underline">
              <Logo />
            </Link>
            <p className="mt-5 max-w-[280px] text-[14px] leading-[1.6] text-foreground-soft">
              Residential cleaning for the Greater Seattle area. We keep your
              crew the same whenever we can.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-[13px] text-foreground-muted">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-foreground-muted no-underline hover:text-foreground transition-colors"
              >
                {SUPPORT_EMAIL}
              </a>
              <a
                href={PHONE_SMS_HREF}
                className="text-foreground-muted no-underline hover:text-foreground transition-colors"
              >
                Text {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div>
            <Eyebrow className="mb-4 block">Services</Eyebrow>
            <ul className="flex flex-col gap-2.5 list-none p-0">
              {footerConfig.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[14px] text-foreground no-underline transition-colors hover:text-accent"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow className="mb-4 block">Areas</Eyebrow>
            <ul className="flex flex-col gap-2.5 list-none p-0">
              {citySlugs.map((slug) => {
                const city = getCityBySlug(slug);
                if (!city) return null;

                const href = currentService ? `/${slug}/${currentService}` : `/${slug}`;

                return (
                  <li key={slug}>
                    <Link
                      href={href}
                      className="text-[14px] text-foreground no-underline transition-colors hover:text-accent"
                    >
                      {city.name}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-1">
                <Link
                  href="/locations"
                  className="text-[14px] font-medium text-accent no-underline transition-colors hover:text-accent-hover"
                >
                  All neighborhoods →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Eyebrow className="mb-4 block">Cleenly</Eyebrow>
            <ul className="flex flex-col gap-2.5 list-none p-0">
              {footerConfig.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-foreground no-underline transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-warm" />

        {/* pr-20 keeps the legal links clear of the fixed chat widget (56px button at right-4/right-6) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pr-20 text-[12px] text-foreground-muted">
          <div>
            © {currentYear}{" "}
            <span className="font-display italic font-normal tracking-[-0.035em] text-[14px] text-foreground-soft">
              Cleenly
            </span>
            , Inc. · Licensed in Washington state.
          </div>
          <div className="flex gap-[18px]">
            {footerConfig.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground-muted no-underline transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
