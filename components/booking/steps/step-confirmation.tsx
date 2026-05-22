"use client";

import { useEffect } from "react";
import Link from "next/link";
import { formatPriceRange } from "@/lib/pricing";
import { trackBookingSubmitted } from "@/lib/analytics";
import { Logo } from "@/components/shared/logo";
import type { ServiceType, TimeSlot, BookingFormData } from "@/types";

const serviceNames: Record<ServiceType, string> = {
  regular: "Regular Cleaning",
  deep: "Deep Cleaning",
  move_out: "Move-Out Cleaning",
};

const timeSlotLabelsShort: Record<TimeSlot, string> = {
  morning: "8am – 12pm",
  afternoon: "12pm – 4pm",
  evening: "4pm – 7pm",
};

interface StepConfirmationProps {
  data: BookingFormData;
  bookingRef: string;
  estimatedMin: number;
  estimatedMax: number;
}

export function StepConfirmation({
  data,
  bookingRef,
  estimatedMin,
  estimatedMax,
}: StepConfirmationProps) {
  useEffect(() => {
    if (!bookingRef) return;
    trackBookingSubmitted({
      ref: bookingRef,
      service: data.service_type ?? "unknown",
      estimatedMin,
      estimatedMax,
      city: data.city,
    });
  }, [bookingRef, data.service_type, data.city, estimatedMin, estimatedMax]);

  const formattedDate = data.preferred_date
    ? new Date(data.preferred_date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="px-5 pb-[28px] text-center">
      {/* Success checkmark */}
      <div className="mx-auto mt-5 mb-3.5 flex h-16 w-16 items-center justify-center rounded-full bg-signal-soft">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2D4A3E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="font-display font-normal text-[32px] leading-[1.15] text-foreground">
        You&apos;re <em className="font-display italic font-normal text-foreground-soft">all set.</em>
      </h2>
      <p className="text-[13px] text-foreground-muted mt-1.5">
        Booking reference:{" "}
        <span className="font-mono font-semibold text-foreground">
          #{bookingRef}
        </span>
      </p>

      {/* Booking summary card */}
      <div className="mt-5 text-left p-4 rounded-lg border border-border bg-surface-warm">
        <div className="text-[15px] font-semibold text-foreground">
          {serviceNames[data.service_type!]}
        </div>
        <div className="text-[13px] text-foreground-soft mt-0.5">
          {data.address || "2104 Eastlake Ave E, Seattle"}
        </div>
        <div className="mt-3 flex justify-between text-[13px]">
          <div>
            <span className="text-foreground-muted">Date: </span>
            <span className="font-medium text-foreground">{formattedDate}</span>
          </div>
          <div>
            <span className="text-foreground-muted">Time: </span>
            <span className="font-medium text-foreground">
              {data.preferred_time && timeSlotLabelsShort[data.preferred_time]}
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
          <span className="text-foreground-muted text-[12px]">Estimated</span>
          <span className="tnum font-display text-[22px] leading-none text-foreground">
            {formatPriceRange(estimatedMin, estimatedMax)}
          </span>
        </div>
      </div>

      {/* Pricing and email message */}
      <div className="mt-[18px] p-[14px_16px] rounded-md bg-surface-warm text-left text-[13px] leading-[1.55]">
        <p className="text-foreground">We&apos;ll confirm your exact price and cleaner details within 2 hours.</p>
        <p className="mt-1.5 text-foreground-muted">
          Check your email at{" "}
          <span className="text-foreground font-medium">
            {data.email || "you@example.com"}
          </span>
          .
        </p>
      </div>

      {/* What happens next */}
      <div className="mt-[22px] text-left">
        <h3 className="text-[15px] font-semibold text-foreground">What happens next</h3>
        <ol className="mt-3 p-0 list-none flex flex-col gap-3">
          {[
            "We match you with an available cleaner in your area.",
            "You get an email with your cleaner's details, exact price, and payment options.",
            "Your cleaner arrives during your time slot with all supplies.",
            "After cleaning, you receive a receipt and can leave a review.",
          ].map((t, i) => (
            <li key={i} className="flex gap-2.5 text-[13px]">
              <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full bg-surface-sand flex items-center justify-center text-[11px] font-semibold text-foreground">
                {i + 1}
              </span>
              <span className="text-foreground-soft leading-[1.55]">{t}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action button */}
      <div className="mt-6 w-full">
        <Link
          href="/"
          className="w-full bg-foreground text-background font-sans text-[15px] font-medium rounded-md cursor-pointer transition-all flex items-center justify-center hover:opacity-90"
          style={{
            height: "52px",
            border: "none",
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Back to home
        </Link>
      </div>

      {/* Footer copyright and logo */}
      <p className="mt-4 text-[12px] text-foreground-muted flex items-center justify-center gap-1">
        <span>Sent with care from</span>
        <Logo className="text-[15px] text-foreground" />
        <span>&middot;</span>
        <a href="mailto:hello@cleenly.app" className="text-foreground">
          hello@cleenly.app
        </a>
      </p>
    </div>
  );
}
