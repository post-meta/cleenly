import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_TEL_HREF, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found | CLEENLY",
  description: "The page you're looking for doesn't exist. Book house cleaning in Seattle online or call us.",
  alternates: { canonical: `${SITE_URL}/404` },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium text-muted-foreground mb-4">404</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you&apos;re looking for moved or never existed.
          Get a price for your cleaning, or call us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/book">Get my price</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a href={PHONE_TEL_HREF}>Call {PHONE_DISPLAY}</a>
          </Button>
        </div>
        <div className="mt-10 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">·</span>
          <Link href="/services" className="hover:underline">Services</Link>
          <span className="mx-2">·</span>
          <Link href="/locations" className="hover:underline">Service area</Link>
          <span className="mx-2">·</span>
          <Link href="/faq" className="hover:underline">FAQ</Link>
        </div>
      </div>
    </main>
  );
}
