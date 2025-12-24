"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="text-xl text-logo text-foreground">
            {SITE_NAME}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Button asChild variant="primary" size="sm">
              <Link href="/book">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-sm text-foreground md:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-xl text-logo text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              {SITE_NAME}
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-sm text-foreground"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-gray-600 transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-4">
              <Link
                href="/login"
                className="text-lg font-medium text-gray-600 transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-lg font-medium text-gray-600 transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Create account
              </Link>
              <Button asChild variant="primary" size="lg" className="w-full">
                <Link href="/book" onClick={() => setIsMenuOpen(false)}>
                  Book Now
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
