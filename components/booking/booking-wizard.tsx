"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StepIndicator } from "./step-indicator";
import {
  StepService,
  StepDetails,
  StepPrice,
  StepSchedule,
  StepContact,
  StepConfirmation,
} from "./steps";
import { calculateFirstVisitPrice } from "@/lib/pricing";
import { StickyPriceFooter } from "./sticky-price-footer";
import type {
  Addon,
  ServiceType,
  HomeCondition,
  BookingFormData,
  SavedAddress,
} from "@/types";

const TOTAL_STEPS = 6;

const SERVICE_LABEL: Record<ServiceType, string> = {
  regular: "Regular Cleaning",
  deep: "Deep Cleaning",
  move_out: "Move-Out Cleaning",
};

// Whitelist for the ?service= query param. The calculator only computes the
// three base types (regular/deep/move_out); every marketed specialty service
// maps to its nearest base type and pre-selects it so its "Book" CTA never
// dead-ends. Admin confirms the specialty specifics after the request comes in.
// Unknown slugs land on step 1 with nothing selected.
const SERVICE_PARAM_MAP: Record<string, { service: ServiceType; addons?: Addon[] }> = {
  regular: { service: "regular" },
  deep: { service: "deep" },
  move_out: { service: "move_out" },
  "regular-cleaning": { service: "regular" },
  "deep-cleaning": { service: "deep" },
  "move-out-cleaning": { service: "move_out" },
  "move-in-cleaning": { service: "move_out" },
  "bi-weekly-service": { service: "regular" },
  "home-organization": { service: "deep" },
  "pre-event-cleaning": { service: "deep" },
  "restorative-cleaning": { service: "deep" },
  "airbnb-turnover": { service: "regular" },
  "post-construction": { service: "move_out" },
};

// Generate a simple booking reference
function generateBookingRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function BookingWizard({
  savedAddresses = [],
  defaultContact,
}: {
  savedAddresses?: SavedAddress[];
  defaultContact?: { name?: string; email?: string; phone?: string };
} = {}) {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const initialServiceEntry = serviceParam ? SERVICE_PARAM_MAP[serviceParam] : undefined;
  const initialNeighborhood = searchParams.get("neighborhood");
  const initialCity = searchParams.get("city");

  const [step, setStep] = useState(initialServiceEntry ? 2 : 1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    service_type: initialServiceEntry?.service,
    address: initialNeighborhood ? `${initialNeighborhood}, ${initialCity || ''}` : undefined,
    condition: "average",
    addons: initialServiceEntry?.addons ?? [],
    // Prefill contact for logged-in customers (editable).
    name: defaultContact?.name,
    email: defaultContact?.email,
    phone: defaultContact?.phone,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string>("");
  const [estimatedMin, setEstimatedMin] = useState(0);
  const [estimatedMax, setEstimatedMax] = useState(0);

  // Clear errors when step changes
  useEffect(() => {
    setErrors({});
  }, [step]);

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear related errors
    Object.keys(data).forEach((key) => {
      if (errors[key]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.service_type) {
          newErrors.service_type = "Please select a service type";
        }
        break;
      case 2:
        if (!formData.bedrooms) {
          newErrors.bedrooms = "Please select number of bedrooms";
        }
        if (!formData.bathrooms) {
          newErrors.bathrooms = "Please select number of bathrooms";
        }
        if (!formData.sqft_range) {
          newErrors.sqft_range = "Please select approximate square footage";
        }
        break;
      case 4:
        if (!formData.preferred_date) {
          newErrors.preferred_date = "Please select a date";
        }
        if (!formData.preferred_time) {
          newErrors.preferred_time = "Please select a time slot";
        }
        break;
      case 5:
        if (!formData.name) {
          newErrors.name = "Please enter your name";
        }
        if (!formData.email) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone) {
          newErrors.phone = "Phone number is required";
        }
        if (!formData.address) {
          newErrors.address = "Please enter your service address";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    // Validate required fields for price calculation
    if (!formData.service_type || !formData.bedrooms || !formData.bathrooms) {
      setErrors({ form: "Missing required details. Please go back and complete all steps." });
      return;
    }

    setIsSubmitting(true);

    try {
      // First-visit price (deep table for regular) — what the customer actually pays.
      // The server recalculates this from raw params; this is only a sanity check.
      const { firstVisit } = calculateFirstVisitPrice(
        formData.service_type,
        formData.bedrooms,
        formData.bathrooms,
        (formData.condition || "average") as HomeCondition,
        formData.addons || [],
        formData.sqft_range
      );

      const finalMin = firstVisit.min + firstVisit.addonsTotal;
      const finalMax = firstVisit.max + firstVisit.addonsTotal;

      // Validate price calculation
      if (!finalMin || !finalMax || finalMin <= 0 || finalMax <= 0) {
        setErrors({ form: "Price calculation failed. Please go back to Step 3." });
        setIsSubmitting(false);
        return;
      }

      // Pets checkbox is informational only — pass it to the cleaner via notes.
      const specialRequests = [
        formData.pets_at_home ? "Pets at home." : null,
        formData.special_requests || null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

      const bookingData = {
        ...formData,
        pets_at_home: undefined,
        special_requests: specialRequests,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit booking");
      }

      // Confirmation shows the server-computed estimate (source of truth).
      const result = await response.json().catch(() => null);
      const serverMin = result?.booking?.estimated_min;
      const serverMax = result?.booking?.estimated_max;

      const ref = generateBookingRef();
      setBookingRef(ref);
      setEstimatedMin(typeof serverMin === "number" ? serverMin : finalMin);
      setEstimatedMax(typeof serverMax === "number" ? serverMax : finalMax);
      setStep(6);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({ form: error instanceof Error ? error.message : "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show step indicator on confirmation page
  const showStepIndicator = step < 6;

  // Live price estimate for the sticky footer (visible Step 2+, hidden Step 1 and confirmation)
  const canEstimate = Boolean(
    formData.service_type && formData.bedrooms && formData.bathrooms
  );
  const showStickyFooter = step >= 2 && step <= 5 && canEstimate;
  // First-visit price (deep table for regular) — what the customer actually pays.
  const liveFirstVisit = canEstimate
    ? calculateFirstVisitPrice(
        formData.service_type as ServiceType,
        formData.bedrooms!,
        formData.bathrooms!,
        (formData.condition || "average") as HomeCondition,
        formData.addons || [],
        formData.sqft_range
      )
    : null;
  const liveEstimate = liveFirstVisit ? liveFirstVisit.firstVisit : null;
  const liveTotalMin = liveEstimate ? liveEstimate.min + liveEstimate.addonsTotal : 0;
  const liveTotalMax = liveEstimate ? liveEstimate.max + liveEstimate.addonsTotal : 0;
  const isContactStep = step === 5;

  return (
    <div className={showStickyFooter ? "pb-[80px] md:pb-[96px]" : undefined}>
      {showStepIndicator && (
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
      )}

      {step === 1 && (
        <StepService
          value={formData.service_type}
          onChange={(value) => updateFormData({ service_type: value })}
          onNext={goNext}
        />
      )}

      {step === 2 && (
        <StepDetails
          data={formData}
          onChange={updateFormData}
          onNext={goNext}
          onBack={goBack}
          errors={errors}
        />
      )}

      {step === 3 && (
        <StepPrice
          data={formData}
          onChange={updateFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 4 && (
        <StepSchedule
          data={formData}
          onChange={updateFormData}
          onNext={goNext}
          onBack={goBack}
          errors={errors}
        />
      )}

      {step === 5 && (
        <StepContact
          data={formData}
          onChange={updateFormData}
          onSubmit={handleSubmit}
          onBack={goBack}
          isSubmitting={isSubmitting}
          errors={errors}
          savedAddresses={savedAddresses}
        />
      )}

      {step === 6 && (
        <StepConfirmation
          data={formData as BookingFormData}
          bookingRef={bookingRef}
          estimatedMin={estimatedMin}
          estimatedMax={estimatedMax}
        />
      )}

      {showStickyFooter && liveEstimate && (
        <StickyPriceFooter
          priceMin={liveTotalMin}
          priceMax={liveTotalMax}
          serviceName={SERVICE_LABEL[formData.service_type as ServiceType]}
          onContinue={isContactStep ? handleSubmit : goNext}
          isFinalStep={isContactStep}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
