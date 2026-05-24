"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  "Service",
  "Details",
  "Price",
  "Schedule",
  "Contact",
  "Done",
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Desktop: Full labels */}
      <div className="hidden sm:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  step < currentStep
                    ? "border-success bg-success text-white"
                    : step === currentStep
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {step < currentStep ? (
                  <svg
                    className="h-5 w-5"
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
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  step <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {stepLabels[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-12 lg:w-20",
                  step < currentStep ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Dots only */}
      <div className="flex sm:hidden items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              step < currentStep
                ? "bg-success"
                : step === currentStep
                ? "bg-foreground"
                : "bg-border"
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground sm:hidden">
        Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
      </p>
    </div>
  );
}
