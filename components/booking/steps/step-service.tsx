"use client";

import { cn } from "@/lib/utils";
import type { ServiceType } from "@/types";

interface ServiceOption {
  id: ServiceType;
  name: string;
  desc: string;
  bestFor: string;
  price: string;
}

const services: ServiceOption[] = [
  {
    id: "regular",
    name: "Regular Cleaning",
    desc: "Routine maintenance. Dusting, vacuuming, bathrooms, kitchen.",
    bestFor: "Weekly or bi-weekly",
    price: "From $165",
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    desc: "Regular, plus inside appliances, baseboards, detailed work.",
    bestFor: "First time or seasonal refresh",
    price: "From $250",
  },
  {
    id: "move_out",
    name: "Move-Out Cleaning",
    desc: "Complete cleaning to landlord standards. Get your deposit back.",
    bestFor: "End of lease",
    price: "From $320",
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
  };

  return (
    <div className="px-5 pb-5">
      <h2 className="font-display font-normal text-[30px] leading-[1.15] mt-4 text-foreground">
        What type of cleaning <em className="font-display italic font-normal text-foreground-soft">do you need?</em>
      </h2>
      <p className="text-[14px] text-foreground-muted mt-2">
        Select the service that best fits your home.
      </p>

      <div className="flex flex-col gap-3 mt-[22px]">
        {services.map((s) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(s.id)}
              className={cn(
                "group relative w-full text-left p-[18px] rounded-xl border-2 transition-all cursor-pointer",
                selected
                  ? "border-foreground bg-surface-warm"
                  : "border-border bg-background hover:border-border-hover"
              )}
              style={{
                transitionDuration: "220ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[17px] font-semibold text-foreground">{s.name}</span>
                <span className="text-[15px] font-semibold text-foreground">{s.price}</span>
              </div>
              <p className="text-[13px] text-foreground-soft mt-1.5 leading-relaxed">
                {s.desc}
              </p>
              <p className="text-[12px] mt-2.5">
                <span className="text-foreground-soft">Best for: </span>
                <span className="text-foreground font-medium">{s.bestFor}</span>
              </p>
              {selected && (
                <div className="absolute top-4 right-4 w-[22px] h-[22px] rounded-full bg-foreground flex items-center justify-center">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FAFAF8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-[18px] text-center text-[12px] text-foreground-soft">
        Not sure?{" "}
        <span className="text-foreground font-medium">
          Regular is great for maintained homes. Deep for first-time.
        </span>
      </p>

      {value && (
        <button
          type="button"
          onClick={onNext}
          className="mt-[22px] w-full bg-accent text-[#FAFAF8] hover:bg-accent-hover font-sans text-[15px] font-medium rounded-md cursor-pointer transition-all flex items-center justify-center"
          style={{
            height: "52px",
            border: "none",
            transitionDuration: "220ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Continue
        </button>
      )}
    </div>
  );
}
