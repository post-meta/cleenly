"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, PHONE_DISPLAY, PHONE_TEL_HREF } from "@/lib/constants";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-8 py-[18px]">
        <Link
          href="/"
          className="text-[26px] md:text-[28px] text-foreground no-underline"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-foreground no-underline transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}

          <a
            href={PHONE_TEL_HREF}
            className="flex items-center gap-1.5 text-[14px] font-medium text-foreground no-underline hover:text-accent transition-colors"
          >
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>

          {!isLoading && (
            <>
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-[14px] font-medium text-foreground no-underline transition-colors hover:text-accent"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[14px] font-medium text-foreground transition-colors hover:text-accent"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-[14px] font-medium text-foreground no-underline transition-colors hover:text-accent"
                >
                  Sign in
                </Link>
              )}
            </>
          )}

          <Button asChild variant="primary" size="sm">
            <Link href="/book">Book a cleaning</Link>
          </Button>
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-sm text-foreground md:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="text-[26px] text-foreground no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              <Logo />
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
                className="text-[18px] font-medium text-foreground no-underline transition-colors hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <a
              href={PHONE_TEL_HREF}
              className="flex items-center gap-2 text-[18px] font-medium text-foreground no-underline hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>

            <div className="mt-2 flex flex-col gap-5">
              {!isLoading && (
                <>
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-[18px] font-medium text-foreground no-underline transition-colors hover:text-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="text-left text-[18px] font-medium text-foreground transition-colors hover:text-accent"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-[18px] font-medium text-foreground no-underline transition-colors hover:text-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        className="text-[18px] font-medium text-foreground no-underline transition-colors hover:text-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </>
              )}
              <Button asChild variant="primary" size="lg" className="w-full">
                <Link href="/book" onClick={() => setIsMenuOpen(false)}>
                  Book a cleaning
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
