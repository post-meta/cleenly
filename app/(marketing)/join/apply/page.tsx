"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import type { CleanerApplicationFormData } from "@/types/cleaner";

const TOTAL_STEPS = 5;

const cityOptions: SelectOption[] = [
  { value: "seattle", label: "Seattle" },
  { value: "bellevue", label: "Bellevue" },
  { value: "kirkland", label: "Kirkland" },
  { value: "redmond", label: "Redmond" },
  { value: "renton", label: "Renton" },
  { value: "kent", label: "Kent" },
  { value: "tacoma", label: "Tacoma" },
  { value: "everett", label: "Everett" },
  { value: "bothell", label: "Bothell" },
  { value: "other", label: "Other" },
];

const referralOptions: SelectOption[] = [
  { value: "google", label: "Google Search" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "friend", label: "Friend/Family" },
  { value: "other_cleaner", label: "Another CLEENLY cleaner" },
  { value: "other", label: "Other" },
];

const yearsOptions: SelectOption[] = [
  { value: "less_than_1", label: "Less than 1 year" },
  { value: "1_2", label: "1-2 years" },
  { value: "2_5", label: "2-5 years" },
  { value: "5_plus", label: "5+ years" },
];

const hoursOptions: SelectOption[] = [
  { value: "10_15", label: "10-15 hours" },
  { value: "15_25", label: "15-25 hours" },
  { value: "25_35", label: "25-35 hours" },
  { value: "35_plus", label: "35+ hours" },
];

const daysOptions = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const timesOptions = [
  { value: "morning", label: "Morning (8am-12pm)" },
  { value: "afternoon", label: "Afternoon (12pm-4pm)" },
  { value: "evening", label: "Evening (4pm-8pm)" },
];

const areaOptions = [
  { value: "seattle_downtown", label: "Seattle - Downtown" },
  { value: "seattle_capitol_hill", label: "Seattle - Capitol Hill" },
  { value: "seattle_ballard", label: "Seattle - Ballard/Fremont" },
  { value: "seattle_university", label: "Seattle - University District" },
  { value: "seattle_west", label: "Seattle - West Seattle" },
  { value: "seattle_south", label: "Seattle - South Seattle" },
  { value: "bellevue", label: "Bellevue" },
  { value: "kirkland", label: "Kirkland" },
  { value: "redmond", label: "Redmond" },
  { value: "renton", label: "Renton" },
  { value: "kent", label: "Kent" },
  { value: "tacoma", label: "Tacoma" },
  { value: "everett", label: "Everett" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
            step < currentStep
              ? "bg-success text-white"
              : step === currentStep
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground"
          )}
        >
          {step < currentStep ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            step
          )}
        </div>
      ))}
    </div>
  );
}

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CleanerApplicationFormData>({
    available_days: [],
    preferred_times: [],
    service_areas: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      updateField(name, (e.target as HTMLInputElement).checked);
    } else {
      updateField(name, value);
    }
  };

  const toggleArrayValue = (name: string, value: string) => {
    const current = (formData[name as keyof CleanerApplicationFormData] as string[]) || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(name, next);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.first_name) newErrors.first_name = "First name is required";
        if (!formData.last_name) newErrors.last_name = "Last name is required";
        if (!formData.email) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone) newErrors.phone = "Phone is required";
        if (!formData.city) newErrors.city = "City is required";
        break;
      case 2:
        if (formData.has_experience === undefined) {
          newErrors.has_experience = "Please select an option";
        }
        if (formData.has_transportation === undefined) {
          newErrors.has_transportation = "Please select an option";
        }
        break;
      case 3:
        if (!formData.hours_per_week) newErrors.hours_per_week = "Please select hours";
        if (!formData.available_days?.length) {
          newErrors.available_days = "Please select at least one day";
        }
        if (!formData.service_areas?.length) {
          newErrors.service_areas = "Please select at least one area";
        }
        break;
      case 4:
        if (!formData.work_authorized) {
          newErrors.work_authorized = "You must be authorized to work in the US";
        }
        if (!formData.is_adult) {
          newErrors.is_adult = "You must be at least 18 years old";
        }
        if (!formData.background_consent) {
          newErrors.background_consent = "Background check consent is required";
        }
        break;
      case 5:
        if (!formData.bio || formData.bio.length < 50) {
          newErrors.bio = "Please write at least 50 characters about yourself";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/cleaner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Application error:", error);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-12 md:py-16">
        <Container size="narrow">
          <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center md:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <svg
                className="h-10 w-10 text-success"
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
            <h1 className="text-2xl font-bold md:text-3xl">
              Thanks for applying!
            </h1>
            <p className="mt-4 text-muted-foreground">
              We&apos;ve received your application. Here&apos;s what happens
              next:
            </p>
            <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium">
                  1
                </span>
                <span className="text-muted-foreground">
                  We review your application (1-2 business days)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium">
                  2
                </span>
                <span className="text-muted-foreground">
                  If approved, we send you a link to complete the background
                  check
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium">
                  3
                </span>
                <span className="text-muted-foreground">
                  Background check takes 2-5 business days
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted font-medium">
                  4
                </span>
                <span className="text-muted-foreground">
                  Once cleared, you set up your profile and start accepting
                  bookings
                </span>
              </li>
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              Questions? Email{" "}
              <a
                href="mailto:cleaners@cleenly.com"
                className="text-foreground underline"
              >
                cleaners@cleenly.com
              </a>
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <Container size="narrow">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/join" className="hover:text-foreground">
            Join
          </Link>
          <span className="mx-2">/</span>
          <span>Apply</span>
        </nav>

        <h1 className="mb-2 text-2xl font-bold md:text-3xl">
          Cleaner Application
        </h1>
        <p className="mb-8 text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </p>

        <StepIndicator currentStep={step} />

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="first_name"
                label="First Name"
                placeholder="Your first name"
                value={formData.first_name || ""}
                onChange={handleInputChange}
                error={errors.first_name}
                autoComplete="given-name"
              />
              <Input
                name="last_name"
                label="Last Name"
                placeholder="Your last name"
                value={formData.last_name || ""}
                onChange={handleInputChange}
                error={errors.last_name}
                autoComplete="family-name"
              />
            </div>
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email || ""}
              onChange={handleInputChange}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              name="phone"
              type="tel"
              label="Phone"
              placeholder="(206) 555-0123"
              value={formData.phone || ""}
              onChange={handleInputChange}
              error={errors.phone}
              autoComplete="tel"
            />
            <Select
              name="city"
              label="City/Area"
              options={cityOptions}
              placeholder="Select your city"
              value={formData.city || ""}
              onChange={handleInputChange}
              error={errors.city}
            />
            <Select
              name="referral_source"
              label="How did you hear about CLEENLY? (optional)"
              options={referralOptions}
              placeholder="Select"
              value={formData.referral_source || ""}
              onChange={handleInputChange}
            />
            <div className="flex justify-end">
              <Button onClick={goNext}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Experience</h2>

            <div>
              <label className="mb-3 block font-medium">
                Do you have professional cleaning experience?
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="has_experience"
                    checked={formData.has_experience === true}
                    onChange={() => updateField("has_experience", true)}
                    className="h-4 w-4"
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="has_experience"
                    checked={formData.has_experience === false}
                    onChange={() => updateField("has_experience", false)}
                    className="h-4 w-4"
                  />
                  No
                </label>
              </div>
              {errors.has_experience && (
                <p className="mt-1 text-sm text-error">{errors.has_experience}</p>
              )}
            </div>

            {formData.has_experience && (
              <>
                <Select
                  name="years_experience"
                  label="How many years of experience?"
                  options={yearsOptions}
                  placeholder="Select"
                  value={formData.years_experience || ""}
                  onChange={handleInputChange}
                />
                <Input
                  name="previous_platforms"
                  label="Previous platforms or companies (optional)"
                  placeholder="e.g., Thumbtack, Handy, own business"
                  value={formData.previous_platforms || ""}
                  onChange={handleInputChange}
                />
              </>
            )}

            <div>
              <label className="mb-3 block font-medium">
                Do you have your own cleaning supplies?
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="has_supplies"
                    checked={formData.has_supplies === true}
                    onChange={() => updateField("has_supplies", true)}
                    className="h-4 w-4"
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="has_supplies"
                    checked={formData.has_supplies === false}
                    onChange={() => updateField("has_supplies", false)}
                    className="h-4 w-4"
                  />
                  No / Some
                </label>
              </div>
            </div>

            <div>
              <label className="mb-3 block font-medium">
                Do you have reliable transportation?
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="has_transportation"
                    checked={formData.has_transportation === true}
                    onChange={() => updateField("has_transportation", true)}
                    className="h-4 w-4"
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="has_transportation"
                    checked={formData.has_transportation === false}
                    onChange={() => updateField("has_transportation", false)}
                    className="h-4 w-4"
                  />
                  No
                </label>
              </div>
              {errors.has_transportation && (
                <p className="mt-1 text-sm text-error">
                  {errors.has_transportation}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={goBack}>
                Back
              </Button>
              <Button onClick={goNext}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 3: Availability */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Availability</h2>

            <Select
              name="hours_per_week"
              label="How many hours per week can you work?"
              options={hoursOptions}
              placeholder="Select"
              value={formData.hours_per_week || ""}
              onChange={handleInputChange}
              error={errors.hours_per_week}
            />

            <div>
              <label className="mb-3 block font-medium">
                Which days are you available?
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOptions.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleArrayValue("available_days", day.value)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm transition-colors",
                      formData.available_days?.includes(day.value)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.available_days && (
                <p className="mt-1 text-sm text-error">{errors.available_days}</p>
              )}
            </div>

            <div>
              <label className="mb-3 block font-medium">
                Preferred time slots (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {timesOptions.map((time) => (
                  <button
                    key={time.value}
                    type="button"
                    onClick={() => toggleArrayValue("preferred_times", time.value)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm transition-colors",
                      formData.preferred_times?.includes(time.value)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block font-medium">
                Which areas can you serve?
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {areaOptions.map((area) => (
                  <button
                    key={area.value}
                    type="button"
                    onClick={() => toggleArrayValue("service_areas", area.value)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-left text-sm transition-colors",
                      formData.service_areas?.includes(area.value)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
              {errors.service_areas && (
                <p className="mt-1 text-sm text-error">{errors.service_areas}</p>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={goBack}>
                Back
              </Button>
              <Button onClick={goNext}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 4: Legal */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Legal Requirements</h2>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                <input
                  type="checkbox"
                  name="work_authorized"
                  checked={formData.work_authorized || false}
                  onChange={handleInputChange}
                  className="mt-0.5 h-5 w-5"
                />
                <div>
                  <p className="font-medium">
                    I am legally authorized to work in the United States
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You must have legal work authorization to join CLEENLY
                  </p>
                </div>
              </label>
              {errors.work_authorized && (
                <p className="text-sm text-error">{errors.work_authorized}</p>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                <input
                  type="checkbox"
                  name="is_adult"
                  checked={formData.is_adult || false}
                  onChange={handleInputChange}
                  className="mt-0.5 h-5 w-5"
                />
                <div>
                  <p className="font-medium">I am at least 18 years old</p>
                  <p className="text-sm text-muted-foreground">
                    You must be 18 or older to use the platform
                  </p>
                </div>
              </label>
              {errors.is_adult && (
                <p className="text-sm text-error">{errors.is_adult}</p>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                <input
                  type="checkbox"
                  name="background_consent"
                  checked={formData.background_consent || false}
                  onChange={handleInputChange}
                  className="mt-0.5 h-5 w-5"
                />
                <div>
                  <p className="font-medium">
                    I consent to a background check
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Background check includes criminal history and identity
                    verification. This protects you and customers.
                  </p>
                </div>
              </label>
              {errors.background_consent && (
                <p className="text-sm text-error">{errors.background_consent}</p>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={goBack}>
                Back
              </Button>
              <Button onClick={goNext}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 5: About */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">About You</h2>

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium"
              >
                Tell us about yourself and your cleaning experience *
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder="Share your cleaning experience, what services you specialize in, and what makes you great at what you do..."
                value={formData.bio || ""}
                onChange={handleInputChange}
                className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                Minimum 50 characters.{" "}
                {formData.bio ? `${formData.bio.length} characters` : "0 characters"}
              </p>
              {errors.bio && (
                <p className="mt-1 text-sm text-error">{errors.bio}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="motivation"
                className="mb-2 block text-sm font-medium"
              >
                Why do you want to join CLEENLY? (optional)
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={3}
                placeholder="What attracted you to CLEENLY? What are your goals?"
                value={formData.motivation || ""}
                onChange={handleInputChange}
                className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            {errors.form && (
              <p className="text-center text-sm text-error">{errors.form}</p>
            )}

            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="text-muted-foreground">
                By submitting, you agree to our{" "}
                <Link href="/terms" className="text-foreground underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-foreground underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={goBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
