"use client";

import React from "react";

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
    <div className="px-4 pt-2 pb-0">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const done = step < currentStep;
          const active = step === currentStep;

          // Done: filled signal (forest green) + checkmark SVG
          // Active: outlined charcoal (no fill)
          // Future: hairline border + muted number
          const dotBg = done ? "var(--color-signal)" : "var(--color-background)";
          const dotBorder = done
            ? "var(--color-signal)"
            : active
            ? "var(--color-foreground)"
            : "var(--color-border)";
          const dotColor = done
            ? "#FAFAF8"
            : active
            ? "var(--color-foreground)"
            : "var(--color-foreground-muted)";
          const lineColor = done ? "var(--color-signal)" : "var(--color-border)";

          return (
            <React.Fragment key={step}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  border: `2px solid ${dotBorder}`,
                  background: dotBg,
                  color: dotColor,
                  transitionDuration: "220ms",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 transition-all"
              >
                {done ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < totalSteps && (
                <div
                  style={{
                    height: "2px",
                    background: lineColor,
                    transitionDuration: "220ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  className="flex-1 mx-1 transition-colors"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="mt-2.5 text-center text-[12px] text-foreground-muted">
        Step {currentStep} of {totalSteps}:{" "}
        <span className="text-foreground-soft font-medium">
          {stepLabels[currentStep - 1]}
        </span>
      </p>
    </div>
  );
}
