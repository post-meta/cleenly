"use client";

import { cn } from "@/lib/utils";
import {
  MARKETING_SMS_CONSENT_TEXT,
  TRANSACTIONAL_SMS_CONSENT_TEXT,
} from "@/lib/consent";
import type { BookingFormData, SavedAddress } from "@/types";

interface StepContactProps {
  data: Partial<BookingFormData>;
  onChange: (data: Partial<BookingFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  errors?: Record<string, string>;
  savedAddresses?: SavedAddress[];
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange: (data: Partial<BookingFormData>) => void;
  optional?: boolean;
  error?: string;
  autoComplete?: string;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  value = "",
  onChange,
  optional,
  error,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label className="block text-[13px] font-medium mb-1.5 text-foreground">
        {label}{" "}
        {optional && (
          <span className="text-foreground-muted font-normal">(optional)</span>
        )}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange({ [name]: e.target.value || undefined })}
        autoComplete={autoComplete}
        className={cn(
          "w-full h-[48px] px-3.5 border rounded-md font-sans text-[15px] text-foreground bg-background placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all",
          error ? "border-error focus:ring-error focus:border-error" : "border-border hover:border-border-hover"
        )}
        style={{
          transitionDuration: "220ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      {error && <p className="mt-1 text-[11px] text-error">{error}</p>}
    </div>
  );
}

export function StepContact({
  data,
  onChange,
  onSubmit,
  onBack,
  isSubmitting,
  errors = {},
  savedAddresses = [],
}: StepContactProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ [name]: value || undefined });
  };

  const handleSmsOptIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ sms_opt_in: e.target.checked });
  };

  const handleMarketingSmsOptIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ marketing_sms_opt_in: e.target.checked });
  };

  const isValid = data.name && data.email && data.phone && data.address;

  return (
    <div className="px-5 pb-5">
      <h2 className="font-display font-normal text-[30px] leading-[1.15] mt-4 text-foreground">
        How can we <em className="font-display italic font-normal text-foreground-soft">reach you?</em>
      </h2>
      <p className="text-[14px] text-foreground-muted mt-2">
        We&apos;ll send confirmation to this contact info.
      </p>

      <div className="flex flex-col gap-3.5 mt-[22px]">
        <Field
          label="Your name"
          name="name"
          placeholder="First and last name"
          value={data.name}
          onChange={onChange}
          error={errors.name}
          autoComplete="name"
        />

        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={onChange}
          error={errors.email}
          autoComplete="email"
        />

        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="(206) 555-0123"
          value={data.phone}
          onChange={onChange}
          error={errors.phone}
          autoComplete="tel"
        />

        {savedAddresses.length > 0 && (
          <div>
            <label className="block text-[13px] font-medium mb-1.5 text-foreground">
              Use a saved address
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedAddresses.map((a) => {
                const composed = a.unit ? `${a.street_address}, ${a.unit}` : a.street_address;
                const selected = data.address === composed;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        address: composed,
                        city: a.city || undefined,
                        zip: a.zip_code || undefined,
                        access_instructions:
                          data.access_instructions || a.special_instructions || undefined,
                      })
                    }
                    className={cn(
                      "text-left p-3 border rounded-md transition-colors",
                      selected
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-border-hover"
                    )}
                  >
                    <div className="text-[13px] font-medium text-foreground">
                      {a.label || "Saved address"}
                      {a.is_default ? " · Default" : ""}
                    </div>
                    <div className="text-[12px] text-foreground-muted truncate">
                      {composed}
                      {a.city ? `, ${a.city}` : ""}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] text-foreground-muted mt-1.5">…or type a new one below.</p>
          </div>
        )}

        <Field
          label="Service address"
          name="address"
          placeholder="123 Main St, Seattle, WA 98101"
          value={data.address}
          onChange={onChange}
          error={errors.address}
          autoComplete="street-address"
        />

        <div>
          <label className="block text-[13px] font-medium mb-1.5 text-foreground">
            Access instructions <span className="text-foreground-muted font-normal">(optional)</span>
          </label>
          <textarea
            name="access_instructions"
            rows={3}
            placeholder="How will the cleaner get in? Lockbox code, doorman, you'll be home…"
            value={data.access_instructions || ""}
            onChange={handleChange}
            className="w-full p-[12px_14px] border border-border rounded-md font-sans text-[14px] text-foreground bg-background placeholder:text-foreground-muted resize-y focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all hover:border-border-hover"
            style={{
              transitionDuration: "220ms",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      <p className="mt-3.5 text-[12px] text-foreground-muted">
        We never share your information with anyone except your assigned cleaner.
      </p>

      {/* SMS opt-in checkbox */}
      <label className="mt-3.5 flex gap-2.5 p-[12px_14px] border border-border rounded-md items-start cursor-pointer hover:border-border-hover transition-colors">
        <input
          id="sms_opt_in"
          name="sms_opt_in"
          type="checkbox"
          checked={!!data.sms_opt_in}
          onChange={handleSmsOptIn}
          className="mt-0.5"
          style={{
            width: "16px",
            height: "16px",
            accentColor: "#2D2826",
          }}
        />
        <span className="text-[12px] leading-[1.5] text-foreground font-sans">
          {TRANSACTIONAL_SMS_CONSENT_TEXT}
        </span>
      </label>

      {/* Marketing SMS opt-in checkbox — default UNCHECKED (express written consent, TCPA) */}
      <label className="mt-2.5 flex gap-2.5 p-[12px_14px] border border-border rounded-md items-start cursor-pointer hover:border-border-hover transition-colors">
        <input
          id="marketing_sms_opt_in"
          name="marketing_sms_opt_in"
          type="checkbox"
          checked={!!data.marketing_sms_opt_in}
          onChange={handleMarketingSmsOptIn}
          className="mt-0.5"
          style={{
            width: "16px",
            height: "16px",
            accentColor: "#2D2826",
          }}
        />
        <span className="text-[12px] leading-[1.5] text-foreground font-sans">
          {MARKETING_SMS_CONSENT_TEXT}
        </span>
      </label>

      {errors.form && (
        <p className="mt-2 text-center text-sm text-error">{errors.form}</p>
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
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="flex-1 bg-accent text-[#FAFAF8] hover:bg-accent-hover h-[52px] px-6 font-sans text-[15px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {isSubmitting ? "Submitting..." : "Confirm Booking"}
        </button>
      </div>

      {/* Trust indicators */}
      <div className="mt-[18px] flex flex-col gap-2">
        {[
          "No payment required now",
          "Final price confirmed before charging",
          "Cancel free up to 24 hrs before",
        ].map((t) => (
          <div
            key={t}
            className="flex gap-2 items-center text-[12px] text-foreground-muted"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2D4A3E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
