"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PriceDisplay } from "./price-display";
import { SERVICE_TYPES, TIME_SLOTS } from "@/lib/constants";
import { calculatePrice } from "@/lib/pricing";
import type { ServiceType, TimeSlot, PriceEstimate, BookingFormData } from "@/types";

const serviceOptions: SelectOption[] = Object.entries(SERVICE_TYPES).map(
  ([key, value]) => ({
    value: key,
    label: value.name,
  })
);

const bedroomOptions: SelectOption[] = [
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5", label: "5+ Bedrooms" },
];

const bathroomOptions: SelectOption[] = [
  { value: "1", label: "1 Bathroom" },
  { value: "2", label: "2 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
  { value: "4", label: "4+ Bathrooms" },
];

const timeOptions: SelectOption[] = TIME_SLOTS.map((slot) => ({
  value: slot.id,
  label: `${slot.label} (${slot.time})`,
}));

export function BookingForm() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") as ServiceType | null;

  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    service_type: initialService || undefined,
    bedrooms: undefined,
    bathrooms: undefined,
  });
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate price when relevant fields change
  useEffect(() => {
    if (formData.service_type && formData.bedrooms && formData.bathrooms) {
      const price = calculatePrice(
        formData.service_type,
        formData.bedrooms,
        formData.bathrooms,
        formData.sqft
      );
      setEstimate(price);
    } else {
      setEstimate(null);
    }
  }, [formData.service_type, formData.bedrooms, formData.bathrooms, formData.sqft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "bedrooms" || name === "bathrooms" || name === "sqft"
          ? value
            ? parseInt(value, 10)
            : undefined
          : value || undefined,
    }));
    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_type) {
      newErrors.service_type = "Please select a service type";
    }
    if (!formData.bedrooms) {
      newErrors.bedrooms = "Please select number of bedrooms";
    }
    if (!formData.bathrooms) {
      newErrors.bathrooms = "Please select number of bathrooms";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.preferred_date) {
      newErrors.preferred_date = "Please select a date";
    }
    if (!formData.preferred_time) {
      newErrors.preferred_time = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !estimate) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimated_min: estimate.min,
          estimated_max: estimate.max,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg
            className="h-8 w-8 text-success"
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
        <h2 className="text-2xl font-semibold">Request received!</h2>
        <p className="mt-3 text-muted-foreground">
          We&apos;ll confirm your booking within 2 hours.
          <br />
          Check your email for details.
        </p>
      </Card>
    );
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Service Selection */}
      <div className="space-y-6">
        <h3>1. Select service</h3>
        <Select
          name="service_type"
          label="Service type"
          options={serviceOptions}
          placeholder="Choose a service"
          value={formData.service_type || ""}
          onChange={handleChange}
          error={errors.service_type}
        />
      </div>

      {/* Property Details */}
      <div className="space-y-6">
        <h3>2. Property details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            name="bedrooms"
            label="Bedrooms"
            options={bedroomOptions}
            placeholder="Select"
            value={formData.bedrooms?.toString() || ""}
            onChange={handleChange}
            error={errors.bedrooms}
          />
          <Select
            name="bathrooms"
            label="Bathrooms"
            options={bathroomOptions}
            placeholder="Select"
            value={formData.bathrooms?.toString() || ""}
            onChange={handleChange}
            error={errors.bathrooms}
          />
        </div>
        <Input
          name="sqft"
          type="number"
          label="Square footage (optional)"
          placeholder="e.g., 1500"
          value={formData.sqft || ""}
          onChange={handleChange}
        />
      </div>

      {/* Price Estimate */}
      <PriceDisplay estimate={estimate} />

      {/* Schedule */}
      <div className="space-y-6">
        <h3>3. Pick a time</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="preferred_date"
            type="date"
            label="Preferred date"
            min={minDate}
            value={formData.preferred_date || ""}
            onChange={handleChange}
            error={errors.preferred_date}
          />
          <Select
            name="preferred_time"
            label="Preferred time"
            options={timeOptions}
            placeholder="Select time slot"
            value={formData.preferred_time || ""}
            onChange={handleChange}
            error={errors.preferred_time}
          />
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-6">
        <h3>4. Contact info</h3>
        <Input
          name="name"
          label="Name (optional)"
          placeholder="Your name"
          value={formData.name || ""}
          onChange={handleChange}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={formData.email || ""}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          name="phone"
          type="tel"
          label="Phone (optional)"
          placeholder="(206) 555-0123"
          value={formData.phone || ""}
          onChange={handleChange}
        />
        <Input
          name="address"
          label="Address (optional)"
          placeholder="123 Main St, Seattle, WA"
          value={formData.address || ""}
          onChange={handleChange}
        />
      </div>

      {errors.form && (
        <p className="text-center text-sm text-error">{errors.form}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Request Booking"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        No payment required now. We&apos;ll confirm availability first.
      </p>
    </form>
  );
}
