"use client";

import { cn } from "@/lib/utils";
import type { ServiceType } from "@/types";

interface ServiceOption {
  id: ServiceType;
  name: string;
  description: string;
  bestFor: string;
  fromPrice: string;
}

const services: ServiceOption[] = [
  {
    id: "regular",
    name: "Regular Cleaning",
    description: "Routine maintenance. Dusting, vacuuming, bathrooms, kitchen.",
    bestFor: "Weekly or bi-weekly cleaning",
    fromPrice: "From $80",
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    description:
      "Everything in regular plus inside appliances, baseboards, detailed work.",
    bestFor: "First time, seasonal refresh, or overdue cleaning",
    fromPrice: "From $140",
  },
  {
    id: "move_out",
    name: "Move-Out Cleaning",
    description: "Complete cleaning to landlord standards. Get your deposit back.",
    bestFor: "End of lease, selling, or move-in prep",
    fromPrice: "From $150",
  },
];

interface StepServiceProps {
  value?: ServiceType;
  onChange: (value: ServiceType) => void;
  onNext: () => void;
}

export function StepService({ value, onChange, onNext }: StepServiceProps) {
  const handleSelect = (serviceId: ServiceType) => {
    onChange(serviceId);
    // Auto-advance after selection
    setTimeout(onNext, 150);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">What type of cleaning do you need?</h2>
        <p className="mt-2 text-muted-foreground">
          Select the service that best fits your needs
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => handleSelect(service.id)}
            className={cn(
              "group relative w-full rounded-xl border-2 p-6 text-left transition-all",
              "hover:border-foreground hover:shadow-md",
              value === service.id
                ? "border-foreground bg-muted/50"
                : "border-border bg-background"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="mt-1 text-muted-foreground">
                  {service.description}
                </p>
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Best for: </span>
                  <span className="text-foreground">{service.bestFor}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold">{service.fromPrice}</span>
                {value === service.id && (
                  <div className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">
                    <svg
                      className="h-4 w-4"
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
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Not sure which to choose?{" "}
        <span className="text-foreground">
          Regular is great for maintained homes. Deep for first-time or seasonal.
        </span>
      </p>
    </div>
  );
}
