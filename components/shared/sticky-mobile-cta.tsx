"use client";

import { usePathname } from "next/navigation";
import { Phone, MessageSquare } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL_HREF, PHONE_SMS_HREF } from "@/lib/constants";

const HIDE_ON_PREFIXES = ["/admin", "/dashboard", "/login", "/register", "/forgot-password", "/reset-password", "/book"];

function trackPhoneClick(method: "call" | "sms") {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "phone_click", {
      method,
      page_location: window.location.pathname,
    });
  }
}

export function StickyMobileCTA() {
  const pathname = usePathname() || "/";
  if (HIDE_ON_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-border bg-background md:hidden">
      <a
        href={PHONE_TEL_HREF}
        onClick={() => trackPhoneClick("call")}
        className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground"
        aria-label={`Call ${PHONE_DISPLAY}`}
      >
        <Phone className="h-4 w-4" />
        Call {PHONE_DISPLAY}
      </a>
      <a
        href={PHONE_SMS_HREF}
        onClick={() => trackPhoneClick("sms")}
        className="flex items-center justify-center gap-2 border-l border-border py-3 text-sm font-medium text-background bg-foreground"
        aria-label="Text us"
      >
        <MessageSquare className="h-4 w-4" />
        Text us
      </a>
    </div>
  );
}
