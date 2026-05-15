import type { ReactNode } from "react";

type EditorialPullQuoteProps = {
  children: ReactNode;
  className?: string;
};

export function EditorialPullQuote({ children, className = "" }: EditorialPullQuoteProps) {
  return (
    <blockquote
      className={`font-display italic text-[28px] md:text-[36px] leading-[1.3] text-foreground-soft max-w-[640px] ${className}`.trim()}
    >
      {children}
    </blockquote>
  );
}

export default EditorialPullQuote;
