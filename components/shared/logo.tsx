import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  eeClassName?: string;
}

export function Logo({ className, eeClassName }: LogoProps) {
  return (
    <span className={cn("text-logo tracking-[-0.02em] font-normal inline-block select-none", className)}>
      CL
      <span className={cn("font-display italic text-foreground-soft px-[1px] normal-case", eeClassName)}>
        EE
      </span>
      NLY
    </span>
  );
}
