"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeSlot, BookingFormData } from "@/types";

const timeSlots: { id: TimeSlot; label: string; time: string }[] = [
  { id: "morning", label: "Morning", time: "8am - 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm - 4pm" },
  { id: "evening", label: "Evening", time: "4pm - 7pm" },
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
    const result: { date: Date; dateString: string; dayName: string; dayNum: string; month: string }[] = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push({
        date,
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">When works for you?</h2>
        <p className="mt-2 text-muted-foreground">
          Select your preferred date and time slot
        </p>
      </div>

      {/* Date Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium">Select a date</label>
        <div className="grid grid-cols-7 gap-2">
          {dates.map(({ dateString, dayName, dayNum, month }) => (
            <button
              key={dateString}
              type="button"
              onClick={() => handleDateSelect(dateString)}
              className={cn(
                "flex flex-col items-center rounded-lg border p-2 transition-all",
                "hover:border-foreground hover:bg-muted/50",
                data.preferred_date === dateString
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background"
              )}
            >
              <span className="text-xs opacity-70">{dayName}</span>
              <span className="text-lg font-semibold">{dayNum}</span>
              <span className="text-xs opacity-70">{month}</span>
            </button>
          ))}
        </div>
        {errors.preferred_date && (
          <p className="mt-2 text-sm text-error">{errors.preferred_date}</p>
        )}
      </div>

      {/* Time Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium">Select a time slot</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleTimeSelect(slot.id)}
              className={cn(
                "flex flex-col items-center rounded-lg border p-4 transition-all",
                "hover:border-foreground hover:bg-muted/50",
                data.preferred_time === slot.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background"
              )}
            >
              <span className="font-semibold">{slot.label}</span>
              <span className="mt-1 text-sm opacity-70">{slot.time}</span>
            </button>
          ))}
        </div>
        {errors.preferred_time && (
          <p className="mt-2 text-sm text-error">{errors.preferred_time}</p>
        )}
      </div>

      {/* Selected summary */}
      {data.preferred_date && data.preferred_time && (
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm">
            <span className="text-muted-foreground">Selected: </span>
            <span className="font-medium">
              {new Date(data.preferred_date + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              {" "}
              ({timeSlots.find((s) => s.id === data.preferred_time)?.time})
            </span>
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
