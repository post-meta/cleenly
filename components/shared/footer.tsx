import Link from "next/link";
import { Container } from "@/components/ui/container";

const footerLinks = {
  services: [
    { href: "/book?service=regular", label: "Regular Cleaning" },
    { href: "/book?service=deep", label: "Deep Cleaning" },
    { href: "/book?service=move_out", label: "Move-out Cleaning" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/#faq", label: "FAQ" },
  ],
  forCleaners: [{ href: "/join", label: "Join as a Cleaner" }],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <Container size="wide" className="py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand / NAP */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              CLEENLY
            </Link>
            {/* NAP for Local SEO */}
            <address className="mt-4 not-italic text-sm text-muted-foreground">
              <p>Seattle, WA</p>
              <p className="mt-1">
                <a
                  href="mailto:hello@cleenly.com"
                  className="transition-colors hover:text-foreground"
                >
                  hello@cleenly.com
                </a>
              </p>
            </address>
            <p className="mt-4 text-sm text-muted-foreground">
              House cleaning booking platform serving Seattle and the Greater
              Eastside.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold">Services</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Cleaners */}
          <div>
            <h4 className="text-sm font-semibold">For Cleaners</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.forCleaners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} CLEENLY. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
