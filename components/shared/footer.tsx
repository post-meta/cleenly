import Link from 'next/link';
import { footerConfig, getFooterCities } from '@/lib/data/footer-config';
import { getCityBySlug } from '@/lib/data/cities';

interface FooterProps {
  currentCity?: string;
  currentService?: string;
}

export function Footer({ currentCity, currentService }: FooterProps = {}) {
  const citySlugs = getFooterCities(currentCity);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-deep text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-logo text-background hover:text-accent transition-colors">
              CLEENLY
            </Link>
            <p className="mt-3 text-sm text-mushroom font-medium tracking-wider">
              We clean. You <em className="italic">live.</em>
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Services</h4>
            <ul className="space-y-3">
              {footerConfig.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-mushroom hover:text-background transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Cities</h4>
            <ul className="space-y-3">
              {citySlugs.map((slug) => {
                const city = getCityBySlug(slug);
                if (!city) return null;

                const href = currentService
                  ? `/${slug}/${currentService}`
                  : `/${slug}`;

                return (
                  <li key={slug}>
                    <Link
                      href={href}
                      className="text-sm text-mushroom hover:text-background transition-colors"
                    >
                      {city.name}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link
                  href="/locations"
                  className="text-sm text-background hover:text-accent font-medium transition-colors"
                >
                  All locations →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Company</h4>
            <ul className="space-y-3">
              {footerConfig.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-mushroom hover:text-background transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-foreground-soft flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-mushroom">
            <a
              href={`mailto:${footerConfig.contact.email}`}
              className="hover:text-background transition-colors"
            >
              {footerConfig.contact.email}
            </a>
          </div>

          <div className="flex items-center gap-3 text-mushroom">
            <span>© {currentYear} CLEENLY</span>
            <span className="text-foreground-soft">·</span>
            {footerConfig.legal.map((item, i) => (
              <span key={item.href} className="flex items-center gap-3">
                <Link
                  href={item.href}
                  className="hover:text-background transition-colors"
                >
                  {item.name}
                </Link>
                {i < footerConfig.legal.length - 1 && <span className="text-foreground-soft">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
