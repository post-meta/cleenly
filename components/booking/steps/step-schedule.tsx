"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { TimeSlot, BookingFormData } from "@/types";

const timeSlots: { id: TimeSlot; label: string; time: string }[] = [
  { id: "morning", label: "Morning", time: "8am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 4pm" },
  { id: "evening", label: "Evening", time: "4pm – 7pm" },
];

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
  // Generate next 14 days
  const dates = useMemo(() => {
    const result: { dateString: string; dayName: string; dayNum: string; month: string }[] = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push({
        dateString: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: date.getDate().toString(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return result;
  }, []);

  const handleDateSelect = (dateString: string) => {
    onChange({ preferred_date: dateString });
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    onChange({ preferred_time: timeSlot });
  };

  const isValid = data.preferred_date && data.preferred_time;

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
        <div className="flex gap-2 overflow-x-auto pb-1.5 hide-scrollbar snap-x">
          {dates.map(({ dateString, dayName, dayNum, month }) => {
            const sel = data.preferred_date === dateString;
            return (
              <button
                key={dateString}
                type="button"
                onClick={() => handleDateSelect(dateString)}
                className={cn(
                  "flex flex-col items-center justify-center p-[8px_0] border rounded-md cursor-pointer transition-all shrink-0 snap-center min-w-[52px] min-h-[64px]",
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
              </button>
            );
          })}
        </div>
        {errors.preferred_date && (
          <p className="mt-1 text-[11px] text-error">{errors.preferred_date}</p>
        )}
      </div>

      {/* Time Selection */}
      <div className="mt-[22px]">
        <label className="block text-[13px] font-medium mb-2.5 text-foreground">Select a time slot</label>
        <div className="grid grid-cols-3 gap-2.5">
          {timeSlots.map((slot) => {
            const sel = data.preferred_time === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleTimeSelect(slot.id)}
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
                <span className="text-[14px] font-semibold">{slot.label}</span>
                <span className="text-[11px] opacity-70">{slot.time}</span>
              </button>
            );
          })}
        </div>
        {errors.preferred_time && (
          <p className="mt-1 text-[11px] text-error">{errors.preferred_time}</p>
        )}
      </div>

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
            {" "}
            ({timeSlots.find((s) => s.id === data.preferred_time)?.time})
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
