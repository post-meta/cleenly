"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BookingFormData } from "@/types";

interface StepContactProps {
  data: Partial<BookingFormData>;
  onChange: (data: Partial<BookingFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  errors?: Record<string, string>;
}

export function StepContact({
  data,
  onChange,
  onSubmit,
  onBack,
  isSubmitting,
  errors = {},
}: StepContactProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ [name]: value || undefined });
  };

  const isValid = data.name && data.email && data.phone && data.address;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">How can we reach you?</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;ll send confirmation and updates to this contact info
        </p>
      </div>

      <div className="space-y-4">
        <Input
          name="name"
          label="Your name"
          placeholder="First and last name"
          value={data.name || ""}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={data.email || ""}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          name="phone"
          type="tel"
          label="Phone"
          placeholder="(206) 555-0123"
          value={data.phone || ""}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
        />

        <Input
          name="address"
          label="Service address"
          placeholder="123 Main St, Seattle, WA 98101"
          value={data.address || ""}
          onChange={handleChange}
          error={errors.address}
          autoComplete="street-address"
        />

        <div>
          <label
            htmlFor="access_instructions"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Access instructions (optional)
          </label>
          <textarea
            id="access_instructions"
            name="access_instructions"
            rows={3}
            placeholder="How will the cleaner get in? Lockbox code, doorman, you'll be home..."
            value={data.access_instructions || ""}
            onChange={handleChange}
            className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        We never share your information with anyone except your assigned cleaner.
      </p>

      {errors.form && (
        <p className="text-center text-sm text-error">{errors.form}</p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Submitting..." : "Confirm Booking"}
        </Button>
      </div>

      {/* Trust indicators */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          No payment required now
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Final price confirmed before charging
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Cancel free up to 24 hours before
        </span>
      </div>
    </div>
  );
}
