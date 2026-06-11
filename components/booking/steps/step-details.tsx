"use client";

import { cn } from "@/lib/utils";
import type {
  BedroomCount,
  BathroomCount,
  SqftRange,
  HomeCondition,
  BookingFormData,
} from "@/types";

interface StepDetailsProps {
  data: Partial<BookingFormData>;
  onChange: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
}

const bedrooms = ["studio", "1", "2", "3", "4", "5+"];
const bathrooms = ["1", "1.5", "2", "2.5", "3", "3.5+"];

// "not_sure" is intentionally not offered — square footage drives the price.
const sqftOptions: { id: SqftRange; label: string }[] = [
  { id: "under_800", label: "Under 800 sq ft" },
  { id: "800_1200", label: "800–1,200 sq ft" },
  { id: "1200_1800", label: "1,200–1,800 sq ft (+10%)" },
  { id: "1800_2500", label: "1,800–2,500 sq ft (+20%)" },
  { id: "2500_3500", label: "2,500–3,500 sq ft (+35%)" },
  { id: "over_3500", label: "3,500+ sq ft (+35%)" },
];

// Concrete question instead of self-graded "condition" — maps to the same
// clean / average / needs_work values, no DB migration.
const lastCleanedOptions: { id: HomeCondition; label: string; sub: string }[] = [
  { id: "clean", label: "Within the last month", sub: "base price" },
  { id: "average", label: "1–6 months ago", sub: "+10%" },
  { id: "needs_work", label: "6+ months / never", sub: "+25%" },
];

function FieldSelect({
  label,
  value,
  options,
  onChange,
  formatOption,
  error,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (v: string) => void;
  formatOption?: (o: string) => string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium mb-1.5 text-foreground">{label}</label>
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full h-[48px] pl-3.5 pr-9 border border-border rounded-md font-sans text-[15px] text-foreground bg-background focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer"
        >
          <option value="" disabled>Select</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {formatOption ? formatOption(o) : o}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          stroke="#8C8073"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8l4 4 4-4" />
        </svg>
      </div>
      {error && <p className="mt-1 text-[11px] text-error">{error}</p>}
    </div>
  );
}

export function StepDetails({
  data,
  onChange,
  onNext,
  onBack,
  errors = {},
}: StepDetailsProps) {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ special_requests: e.target.value || undefined });
  };

  const isValid = data.bedrooms && data.bathrooms && data.sqft_range;

  return (
    <div className="px-5 pb-5">
      <h2 className="font-display font-normal text-[30px] leading-[1.15] mt-4 text-foreground">
        Tell us about <em className="font-display italic font-normal text-foreground-soft">your place.</em>
      </h2>
      <p className="text-[14px] text-foreground-muted mt-2">
        So we can give you an accurate price estimate.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-[22px]">
        <FieldSelect
          label="Bedrooms"
          value={data.bedrooms}
          options={bedrooms}
          onChange={(v) => onChange({ bedrooms: v as BedroomCount })}
          formatOption={(o) => (o === "studio" ? "Studio" : `${o} bed`)}
          error={errors.bedrooms}
        />
        <FieldSelect
          label="Bathrooms"
          value={data.bathrooms}
          options={bathrooms}
          onChange={(v) => onChange({ bathrooms: v as BathroomCount })}
          formatOption={(o) => `${o} bath`}
          error={errors.bathrooms}
        />
      </div>

      <div className="mt-[18px]">
        <FieldSelect
          label="Approximate size"
          value={data.sqft_range}
          options={sqftOptions.map((o) => o.id)}
          onChange={(v) => onChange({ sqft_range: v as SqftRange })}
          formatOption={(o) => sqftOptions.find((opt) => opt.id === o)?.label ?? o}
          error={errors.sqft_range}
        />
      </div>

      <div className="mt-[18px]">
        <label className="block text-[13px] font-medium mb-2 text-foreground">
          When was your home last professionally cleaned?
        </label>
        <div className="flex flex-col gap-2">
          {lastCleanedOptions.map((c) => {
            const selected = data.condition === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ condition: c.id })}
                className={cn(
                  "text-left p-[12px_14px] rounded-md border transition-all cursor-pointer flex items-baseline justify-between gap-3",
                  selected
                    ? "border-2 border-foreground bg-surface-warm"
                    : "border-border bg-background hover:border-border-hover"
                )}
                style={{
                  transitionDuration: "220ms",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span className="text-[14px] font-semibold text-foreground">{c.label}</span>
                <span className="text-[12px] text-foreground-muted">{c.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[18px]">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!data.pets_at_home}
            onChange={(e) => onChange({ pets_at_home: e.target.checked })}
            className="h-4 w-4 shrink-0 cursor-pointer"
            style={{ accentColor: "#2D2826" }}
          />
          <span className="text-[14px] text-foreground">
            Pets at home{" "}
            <span className="text-[12px] text-foreground-muted">
              (doesn&apos;t change the price — helps your cleaner plan)
            </span>
          </span>
        </label>
      </div>

      <div className="mt-[18px]">
        <label className="block text-[13px] font-medium mb-1.5 text-foreground">
          Special requests <span className="text-foreground-muted font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Specific areas to focus on, access instructions…"
          value={data.special_requests || ""}
          onChange={handleTextareaChange}
          className="w-full p-[12px_14px] border border-border rounded-md font-sans text-[14px] text-foreground bg-background resize-y focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
        />
      </div>

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
          See My Price
        </button>
      </div>
    </div>
  );
}
