type DividerWarmProps = {
  className?: string;
};

export function DividerWarm({ className = "" }: DividerWarmProps) {
  return <div className={`h-px w-full bg-border ${className}`.trim()} />;
}

export default DividerWarm;
