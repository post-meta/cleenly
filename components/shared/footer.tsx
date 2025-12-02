import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

          {/* Company Info */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">CLEENLY</h4>
            <p className="text-sm text-gray-600">
              House cleaning in Seattle. Simple, honest, reliable.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/book?service=regular" className="text-sm text-gray-600 hover:text-foreground">Regular Cleaning</Link></li>
              <li><Link href="/book?service=deep" className="text-sm text-gray-600 hover:text-foreground">Deep Cleaning</Link></li>
              <li><Link href="/book?service=move_out" className="text-sm text-gray-600 hover:text-foreground">Move-Out</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-foreground">About</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-600 hover:text-foreground">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} CLEENLY. Seattle, WA.
          </p>
        </div>
      </div>
    </footer>
  );
}
