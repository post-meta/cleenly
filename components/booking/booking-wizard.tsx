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
import { calculatePrice } from "@/lib/pricing";
import type {
  ServiceType,
  HomeCondition,
  BookingFormData,
} from "@/types";

const TOTAL_STEPS = 6;

// Generate a simple booking reference
function generateBookingRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function BookingWizard() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") as ServiceType | null;
  const initialNeighborhood = searchParams.get("neighborhood");
  const initialCity = searchParams.get("city");

  const [step, setStep] = useState(initialService ? 2 : 1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    service_type: initialService || undefined,
    address: initialNeighborhood ? `${initialNeighborhood}, ${initialCity || ''}` : undefined,
    condition: "average",
    addons: [],
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
      // Calculate final price (prices are already in cents from pricing.ts)
      const estimate = calculatePrice(
        formData.service_type,
        formData.bedrooms,
        formData.bathrooms,
        (formData.condition || "average") as HomeCondition,
        formData.addons || []
      );

      const finalMin = estimate.min + estimate.addonsTotal;
      const finalMax = estimate.max + estimate.addonsTotal;

      // Validate price calculation
      if (!finalMin || !finalMax || finalMin <= 0 || finalMax <= 0) {
        setErrors({ form: "Price calculation failed. Please go back to Step 3." });
        setIsSubmitting(false);
        return;
      }

      const bookingData = {
        ...formData,
        estimated_min: finalMin,
        estimated_max: finalMax,
      };

      // Debug logging (remove in production)
      console.log("Submitting booking:", {
        estimated_min: finalMin,
        estimated_max: finalMax,
        service_type: formData.service_type,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
      });

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit booking");
      }

      const ref = generateBookingRef();
      setBookingRef(ref);
      setEstimatedMin(finalMin);
      setEstimatedMax(finalMax);
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

  return (
    <div>
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
    </div>
  );
}
