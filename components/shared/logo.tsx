import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      aria-label="Cleenly"
      className={cn(
        "font-display italic font-normal tracking-[-0.035em] leading-none inline-block whitespace-nowrap select-none",
        className
      )}
    >
      Cleenly
    </span>
  );
}
