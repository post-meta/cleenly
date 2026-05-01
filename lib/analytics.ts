"use client";

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

export function trackBookingSubmitted(params: {
  ref: string;
  service: string;
  estimatedMin: number;
  estimatedMax: number;
  city?: string;
}) {
  const value = Math.round((params.estimatedMin + params.estimatedMax) / 2 / 100);
  gtag("event", "generate_lead", {
    currency: "USD",
    value,
    transaction_id: params.ref,
    service_type: params.service,
    city: params.city,
  });
  gtag("event", "booking_submitted", {
    ref: params.ref,
    service: params.service,
    value,
    city: params.city,
  });
}

export function trackPhoneClick(method: "call" | "sms", page?: string) {
  gtag("event", "phone_click", {
    method,
    page_location: page ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
  });
}

export function trackBookingStarted(source?: string) {
  gtag("event", "begin_checkout", {
    item_category: "booking",
    source,
  });
}
