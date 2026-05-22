export function PullQuote() {
  return (
    <section className="py-28 bg-background">
      <div className="max-w-[880px] mx-auto px-6 md:px-8 text-center">
        <span className="eyebrow block text-signal">From Madrona, 2 years in</span>
        <blockquote className="mt-7 font-display font-normal italic text-[36px] md:text-[44px] leading-[1.25] tracking-[-0.015em] text-foreground-soft">
          "The same crew. The same care. Like a key under the mat — but better.
          We came home Thursday and the place smelled like cedar and rain."
        </blockquote>
        <div className="mt-7 flex items-center justify-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-surface-sand flex items-center justify-center font-display font-normal text-[16px] text-foreground">
            R
          </div>
          <div className="text-left">
            <div className="text-[13px] font-semibold text-foreground">
              —{" "}
              <span className="font-display font-normal tracking-[-0.035em] text-[17px]">
                Reema <span className="italic text-foreground-soft">K.</span>
              </span>
            </div>
            <div className="text-[12px] text-foreground-muted">
              Bi-weekly · Madrona
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PullQuote;
