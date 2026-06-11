"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, MessageSquare } from "lucide-react";
import { PHONE_SMS_HREF } from "@/lib/constants";

const HIDE_ON_PREFIXES = ["/admin", "/dashboard", "/login", "/register", "/forgot-password", "/reset-password", "/book"];

function trackCta(event: "book_click" | "phone_click", params: Record<string, string> = {}) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, {
      ...params,
      page_location: window.location.pathname,
    });
  }
}

export function StickyMobileCTA() {
  const pathname = usePathname() || "/";
  if (HIDE_ON_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-border bg-background md:hidden">
      <Link
        href="/book"
        onClick={() => trackCta("book_click", { source: "sticky_mobile" })}
        className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#FAFAF8] bg-accent"
        aria-label="Book a cleaning"
      >
        <CalendarCheck className="h-4 w-4" />
        Book a cleaning
      </Link>
      <a
        href={PHONE_SMS_HREF}
        onClick={() => trackCta("phone_click", { method: "sms" })}
        className="flex items-center justify-center gap-2 border-l border-border py-3 text-sm font-medium text-foreground"
        aria-label="Text us"
      >
        <MessageSquare className="h-4 w-4" />
        Text us
      </a>
    </div>
  );
}
