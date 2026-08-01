"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { DayOffer, JobShape, SlotOffer } from "@/lib/availability/resolver";
import type { BookingFormData } from "@/types";

/** A date the crew can take, with only the slots it can actually take. */
type OfferedDay = Pick<DayOffer, "date" | "slots">;

/** One answer, tagged with the job it was asked for. */
interface Resolved {
  job: JobShape;
  days: OfferedDay[];
  degraded: boolean;
}

/**
 * Shape of the /api/availability answer. Every field is optional on purpose:
 * a degraded answer is a normal answer, and this step has to render either way.
 */
interface AvailabilityResponse {
  days?: DayOffer[];
  degraded?: boolean;
}

// The degraded path only: what the step offered before it could read the
// calendar. The live path uses the windows the API returns, which come from
// that day's real working hours.
//
// Evening removed 2026-06-10: can't reliably staff 4pm+ visits.
// TimeSlot type keeps "evening" for legacy bookings already in the DB.
const FALLBACK_SLOTS: SlotOffer[] = [
  { id: "morning", label: "Morning", window: "8am – 12pm", available: true },
  { id: "afternoon", label: "Afternoon", window: "12pm – 4pm", available: true },
];

const SKELETON_CHIPS = [0, 1, 2, 3, 4, 5, 6];

// Timezone-safe YYYY-MM-DD from a local Date. Never use toISOString() here:
// it converts to UTC, which shifts the date by one for Seattle evenings
// (e.g. clicking the 11th stored the 12th).
function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Next 14 days, morning and afternoon. Used when the live answer is unusable. */
function buildFallbackDays(): OfferedDay[] {
  const today = new Date();
  const result: OfferedDay[] = [];

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    result.push({ date: toLocalDateString(date), slots: FALLBACK_SLOTS });
  }
  return result;
}

/** Noon anchor keeps the chip on the same calendar day in every timezone. */
function chipLabels(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return {
    dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
    dayNum: d.getDate().toString(),
    month: d.toLocaleDateString("en-US", { month: "short" }),
  };
}

interface StepScheduleProps {
  data: Partial<BookingFormData>;
  onChange: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
}

export function StepSchedule({
  data,
  onChange,
  onNext,
  onBack,
  errors = {},
}: StepScheduleProps) {
  const [resolved, setResolved] = useState<Resolved | null>(null);

  // The job the crew is being asked to fit in. Identity changes only when one
  // of these answers changes, so the wizard re-rendering does not refetch.
  const job = useMemo<JobShape | null>(() => {
    if (!data.service_type || !data.bedrooms || !data.bathrooms) return null;
    return {
      serviceType: data.service_type,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      condition: data.condition,
      sqftRange: data.sqft_range,
    };
  }, [data.service_type, data.bedrooms, data.bathrooms, data.condition, data.sqft_range]);

  useEffect(() => {
    if (!job) return;

    const controller = new AbortController();

    fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? (res.json() as Promise<AvailabilityResponse>) : null))
      .then((json) => {
        if (controller.signal.aborted) return;

        const days = (json?.days ?? [])
          .filter((d) => d.available !== false)
          .map((d) => ({
            date: d.date,
            slots: (d.slots ?? []).filter((s) => s.available !== false),
          }))
          .filter((d) => d.slots.length > 0);

        setResolved({
          job,
          days,
          degraded: json?.degraded === true || days.length === 0,
        });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        // A calendar we cannot read is not the customer's problem.
        setResolved({ job, days: [], degraded: true });
      });

    return () => controller.abort();
  }, [job]);

  const fallback = useMemo(() => buildFallbackDays(), []);

  // An answer counts only while it belongs to the job on screen. Change a
  // bedroom on step 2 and the previous answer stops being the truth.
  const answer = resolved && resolved.job === job ? resolved : null;
  const loading = job !== null && answer === null;
  const degraded = !answer || answer.degraded;
  const days = degraded ? fallback : answer.days;

  const selectedDay = days.find((d) => d.date === data.preferred_date);
  const slots = selectedDay?.slots ?? [];
  const showsFullDay = slots.some((s) => s.id === "full_day");

  // A date or slot that is no longer on offer (the job grew, someone else took
  // the morning) must not stay selected behind the customer's back.
  useEffect(() => {
    if (loading || !data.preferred_date) return;

    const day = days.find((d) => d.date === data.preferred_date);
    if (!day) {
      onChange({ preferred_date: undefined, preferred_time: undefined });
      return;
    }
    if (data.preferred_time && !day.slots.some((s) => s.id === data.preferred_time)) {
      onChange({ preferred_time: undefined });
    }
  }, [days, loading, data.preferred_date, data.preferred_time, onChange]);

  const handleDateSelect = (date: string) => {
    const day = days.find((d) => d.date === date);
    const keepsSlot =
      Boolean(data.preferred_time) &&
      Boolean(day?.slots.some((s) => s.id === data.preferred_time));

    onChange(
      keepsSlot
        ? { preferred_date: date }
        : { preferred_date: date, preferred_time: undefined }
    );
  };

  const handleTimeSelect = (slot: SlotOffer) => {
    // SlotId is a subset of TimeSlot, so every id the resolver offers — including
    // "full_day" — is a value /api/bookings accepts and the DB column stores.
    onChange({ preferred_time: slot.id });
  };

  const isValid = data.preferred_date && data.preferred_time;
  const selectedWindow = slots.find((s) => s.id === data.preferred_time)?.window;

  return (
    <div className="px-5 pb-5">
      <h2 className="font-display font-normal text-[30px] leading-[1.15] mt-4 text-foreground">
        When works <em className="font-display italic font-normal text-foreground-soft">for you?</em>
      </h2>
      <p className="text-[14px] text-foreground-muted mt-2">
        Pick a date and time window.
      </p>

      {/* Date Selection */}
      <div className="mt-[22px]">
        <label className="block text-[13px] font-medium mb-2.5 text-foreground">Select a date</label>

        {loading ? (
          <div
            role="status"
            className="flex gap-2 overflow-hidden pb-1.5"
          >
            <span className="sr-only">Loading dates</span>
            {SKELETON_CHIPS.map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="shrink-0 min-w-[52px] min-h-[64px] rounded-md bg-surface-warm animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1.5 hide-scrollbar snap-x">
            {days.map(({ date }) => {
              const { dayName, dayNum, month } = chipLabels(date);
              const sel = data.preferred_date === date;
              return (
                <button
                  key={date}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => handleDateSelect(date)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-[8px_0] border rounded-md cursor-pointer transition-all shrink-0 snap-center min-w-[52px] min-h-[64px]",
                    sel
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:border-border-hover"
                  )}
                  style={{
                    transitionDuration: "220ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <span className="text-[11px] opacity-70">{dayName}</span>
                  <span className="text-[17px] font-semibold leading-none my-0.5">{dayNum}</span>
                  <span className="text-[10px] opacity-70">{month}</span>
                  {sel && (
                    <svg
                      className="absolute top-1 right-1"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!loading && degraded && (
          <p className="mt-2 text-[12px] text-foreground-muted">
            Pick a time that suits you and we&apos;ll confirm it with you.
          </p>
        )}

        {errors.preferred_date && (
          <p className="mt-1 text-[11px] text-error">{errors.preferred_date}</p>
        )}
      </div>

      {/* Time Selection — slots belong to the chosen date */}
      {!loading && selectedDay && (
        <div className="mt-[22px]">
          <label className="block text-[13px] font-medium mb-2.5 text-foreground">Select a time slot</label>
          <div
            className={cn(
              "grid gap-2.5",
              slots.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {slots.map((slot) => {
              const sel = data.preferred_time === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  aria-pressed={sel}
                  onClick={() => handleTimeSelect(slot)}
                  className={cn(
                    "p-[14px_8px] rounded-md border transition-all cursor-pointer flex flex-col items-center gap-0.5 shrink-0",
                    sel
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:border-border-hover"
                  )}
                  style={{
                    transitionDuration: "220ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <span className="flex items-center gap-1.5 text-[14px] font-semibold">
                    {sel && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {slot.label}
                  </span>
                  <span className="text-[11px] opacity-70">{slot.window}</span>
                </button>
              );
            })}
          </div>

          {showsFullDay && (
            <p className="mt-2 text-[12px] text-foreground-muted">
              This one takes most of a day.
            </p>
          )}

          {errors.preferred_time && (
            <p className="mt-1 text-[11px] text-error">{errors.preferred_time}</p>
          )}
        </div>
      )}

      {/* Selected summary */}
      {data.preferred_date && data.preferred_time && (
        <div className="mt-4.5 p-[12px_14px] bg-surface-warm rounded-md text-[13px]">
          <span className="text-foreground-muted">Selected: </span>
          <span className="font-semibold text-foreground">
            {new Date(data.preferred_date + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {selectedWindow ? ` (${selectedWindow})` : ""}
          </span>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="border border-border bg-background hover:bg-gray-50 text-foreground h-[52px] px-6 font-sans text-[15px] font-medium rounded-md cursor-pointer transition-all flex items-center justify-center"
          style={{
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-accent text-[#FAFAF8] hover:bg-accent-hover h-[52px] px-6 font-sans text-[15px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
