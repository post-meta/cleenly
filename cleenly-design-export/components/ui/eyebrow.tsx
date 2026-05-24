import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  tone?: "default" | "signal" | "accent";
  className?: string;
};

export function Eyebrow({ children, tone = "default", className = "" }: EyebrowProps) {
  const colorClass = {
    default: "text-foreground-muted",
    signal: "text-signal",
    accent: "text-accent",
  }[tone];

  return (
    <span
      className={`text-[13px] font-medium tracking-[0.08em] uppercase ${colorClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

export default Eyebrow;
