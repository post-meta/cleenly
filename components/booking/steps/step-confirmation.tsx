"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPriceRange } from "@/lib/pricing";
import type { ServiceType, TimeSlot, BookingFormData } from "@/types";

const serviceNames: Record<ServiceType, string> = {
  regular: "Regular Cleaning",
  deep: "Deep Cleaning",
  move_out: "Move-Out Cleaning",
};

const timeSlotLabels: Record<TimeSlot, string> = {
  morning: "Morning (8am - 12pm)",
  afternoon: "Afternoon (12pm - 4pm)",
  evening: "Evening (4pm - 7pm)",
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
  const formattedDate = data.preferred_date
    ? new Date(data.preferred_date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-8">
      {/* Success header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <svg
            className="h-10 w-10 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">You&apos;re all set!</h2>
        <p className="mt-2 text-muted-foreground">
          Booking reference: <span className="font-mono font-semibold">#{bookingRef}</span>
        </p>
      </div>

      {/* Booking summary */}
      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">{serviceNames[data.service_type!]}</h3>
        <p className="mt-1 text-muted-foreground">{data.address}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Date: </span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Time: </span>
            <span className="font-medium">
              {data.preferred_time && timeSlotLabels[data.preferred_time]}
            </span>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <span className="text-muted-foreground">Estimated Price: </span>
          <span className="text-lg font-semibold">
            {formatPriceRange(estimatedMin, estimatedMax)}
          </span>
        </div>
      </div>

      {/* Confirmation message */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm">
        <p>
          We&apos;ll confirm your exact price and cleaner details within 2 hours.
        </p>
        <p className="mt-2 text-muted-foreground">
          Check your email at <span className="font-medium text-foreground">{data.email}</span> for updates.
        </p>
      </div>

      {/* What happens next */}
      <div>
        <h3 className="font-semibold">What happens next</h3>
        <ol className="mt-4 space-y-4">
          {[
            "We'll match you with an available cleaner",
            "You'll get an email with cleaner details and exact price",
            "On the day, your cleaner will arrive during your time slot",
            "After cleaning, you'll receive a receipt and can leave a review",
          ].map((step, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-semibold">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>

      {/* Questions */}
      <p className="text-center text-sm text-muted-foreground">
        Questions? Email us at{" "}
        <a
          href="mailto:hello@cleenly.com"
          className="text-foreground underline"
        >
          hello@cleenly.com
        </a>
      </p>
    </div>
  );
}
