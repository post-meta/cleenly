/** @jsx React.createElement */

function PullQuote() {
  return (
    <section style={{ padding: "112px 0" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
        <span className="eyebrow" style={{ color: "var(--color-signal)" }}>From Madrona, 2 years in</span>
        <blockquote style={{
          marginTop: 28,
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: 44,
          lineHeight: 1.25,
          letterSpacing: "-0.015em",
          color: "var(--color-foreground-soft)",
        }}>
          "The same crew. The same care. Like a key under the mat — but better.
          We came home Thursday and the place smelled like cedar and rain."
        </blockquote>
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9999, background: "var(--color-surface-sand)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 16, color: "var(--color-foreground)" }}>R</div>
          <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-foreground)" }}>
          — <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: "-0.035em", fontSize: 17 }}>
            Reema <span style={{ fontStyle: "italic", color: "var(--color-foreground-soft)" }}>K.</span>
          </span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-foreground-muted)" }}>Bi-weekly &middot; Madrona</div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.PullQuote = PullQuote;
