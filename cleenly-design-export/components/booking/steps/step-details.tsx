"use client";

import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import type {
  BedroomCount,
  BathroomCount,
  SqftRange,
  HomeCondition,
  BookingFormData,
} from "@/types";

const bedroomOptions: SelectOption[] = [
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5+", label: "5+ Bedrooms" },
];

const bathroomOptions: SelectOption[] = [
  { value: "1", label: "1 Bathroom" },
  { value: "1.5", label: "1.5 Bathrooms" },
  { value: "2", label: "2 Bathrooms" },
  { value: "2.5", label: "2.5 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
  { value: "3.5+", label: "3.5+ Bathrooms" },
];

const sqftOptions: SelectOption[] = [
  { value: "under_800", label: "Under 800 sq ft" },
  { value: "800_1200", label: "800 - 1,200 sq ft" },
  { value: "1200_1800", label: "1,200 - 1,800 sq ft" },
  { value: "1800_2500", label: "1,800 - 2,500 sq ft" },
  { value: "2500_3500", label: "2,500 - 3,500 sq ft" },
  { value: "over_3500", label: "Over 3,500 sq ft" },
  { value: "not_sure", label: "Not sure" },
];

const conditionOptions: SelectOption[] = [
  { value: "clean", label: "Clean (maintained regularly)" },
  { value: "average", label: "Average (some areas need attention)" },
  { value: "needs_work", label: "Needs work (hasn't been cleaned in a while)" },
];

interface StepDetailsProps {
  data: Partial<BookingFormData>;
  onChange: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
}

export function StepDetails({
  data,
  onChange,
  onNext,
  onBack,
  errors = {},
}: StepDetailsProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ [name]: value || undefined });
  };

  const isValid = data.bedrooms && data.bathrooms;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Tell us about your place</h2>
        <p className="mt-2 text-muted-foreground">
          This helps us give you an accurate price estimate
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            name="bedrooms"
            label="Bedrooms"
            options={bedroomOptions}
            placeholder="Select bedrooms"
            value={data.bedrooms || ""}
            onChange={handleChange}
            error={errors.bedrooms}
          />
          <Select
            name="bathrooms"
            label="Bathrooms"
            options={bathroomOptions}
            placeholder="Select bathrooms"
            value={data.bathrooms || ""}
            onChange={handleChange}
            error={errors.bathrooms}
          />
        </div>

        <Select
          name="sqft_range"
          label="Approximate size (optional)"
          options={sqftOptions}
          placeholder="Select size range"
          value={data.sqft_range || ""}
          onChange={handleChange}
        />

        <Select
          name="condition"
          label="Home condition"
          options={conditionOptions}
          placeholder="Select condition"
          value={data.condition || "average"}
          onChange={handleChange}
        />

        <div>
          <label
            htmlFor="special_requests"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Special requests (optional)
          </label>
          <textarea
            id="special_requests"
            name="special_requests"
            rows={3}
            placeholder="Pets, specific areas to focus on, access instructions..."
            value={data.special_requests || ""}
            onChange={handleChange}
            className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      </div>

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
          See My Price
        </Button>
      </div>
    </div>
  );
}
