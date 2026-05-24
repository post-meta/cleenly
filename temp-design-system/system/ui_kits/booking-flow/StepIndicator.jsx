/** @jsx React.createElement */

function StepIndicator({ current, total }) {
  const labels = ["Service", "Details", "Price", "Schedule", "Contact", "Done"];
  return (
    <div style={{ padding: "8px 16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
          const done = step < current;
          const active = step === current;
          // Done: filled signal (forest) + checkmark
          // Current: outlined walnut (no fill) — distinct from selection-state walnut fill
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
              <div style={{
                width: 28, height: 28, borderRadius: 9999,
                border: `2px solid ${dotBorder}`,
                background: dotBg, color: dotColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, flexShrink: 0,
                transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
              }}>
                {done
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                  : step}
              </div>
              {step < total && <div style={{ flex: 1, height: 2, margin: "0 4px", background: lineColor, transition: "background 220ms cubic-bezier(0.4,0,0.2,1)" }}/>}
            </React.Fragment>
          );
        })}
      </div>
      <p style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "var(--color-foreground-muted)" }}>
        Step {current} of {total}: <span style={{ color: "var(--color-foreground-soft)", fontWeight: 500 }}>{labels[current - 1]}</span>
      </p>
    </div>
  );
}

window.StepIndicator = StepIndicator;
