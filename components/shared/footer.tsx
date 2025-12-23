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
    <footer className="border-t border-gray-200 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Logo & Tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-semibold text-foreground hover:text-accent transition-colors">
              CLEENLY
            </Link>
            <p className="mt-3 text-sm text-gray-500 font-medium tracking-wider">
              We clean. You live.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Services</h4>
            <ul className="space-y-3">
              {footerConfig.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-gray-600 hover:text-foreground transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Cities</h4>
            <ul className="space-y-3">
              {citySlugs.map((slug) => {
                const city = getCityBySlug(slug);
                if (!city) return null;

                // If currentService exists, link to city+service
                const href = currentService
                  ? `/${slug}/${currentService}`
                  : `/${slug}`;

                return (
                  <li key={slug}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 hover:text-foreground transition-colors"
                    >
                      {city.name}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link
                  href="/locations"
                  className="text-sm text-foreground hover:text-accent font-medium transition-colors"
                >
                  All locations →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3">
              {footerConfig.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-600">
            <a
              href={`mailto:${footerConfig.contact.email}`}
              className="hover:text-foreground transition-colors"
            >
              {footerConfig.contact.email}
            </a>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <span>© {currentYear} CLEENLY</span>
            <span className="text-gray-300">·</span>
            {footerConfig.legal.map((item, i) => (
              <span key={item.href} className="flex items-center gap-3">
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
                {i < footerConfig.legal.length - 1 && <span className="text-gray-300">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
