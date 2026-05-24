type StatProps = {
  number: string;
  label: string;
  tone?: "default" | "signal";
  className?: string;
};

export function Stat({ number, label, tone = "default", className = "" }: StatProps) {
  const numColor = tone === "signal" ? "text-signal" : "text-foreground";

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <span
        className={`font-display font-normal text-[56px] md:text-[72px] leading-none tracking-[-0.02em] ${numColor}`}
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {number}
      </span>
      <span className="text-[14px] text-foreground-muted">{label}</span>
    </div>
  );
}

export default Stat;
