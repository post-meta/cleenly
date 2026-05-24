/** @jsx React.createElement */

function Step6_Confirmation({ data, bookingRef }) {
  const ref = bookingRef;
  return (
    <div style={{ padding: "0 20px 28px", textAlign: "center" }}>
      <div style={{ margin: "20px auto 14px", width: 64, height: 64, borderRadius: 9999, background: "var(--color-signal-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 style={{ fontSize: 32 }}>You're <em>all set.</em></h2>
      <p style={{ fontSize: 13, color: "var(--color-foreground-muted)", marginTop: 6 }}>
        Booking reference: <span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--color-foreground)" }}>#{ref}</span>
      </p>

      <div style={{ marginTop: 20, textAlign: "left", padding: "16px 16px", borderRadius: 16, border: "1px solid var(--color-border)", background: "var(--color-surface-warm)" }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Deep Cleaning</div>
        <div style={{ fontSize: 13, color: "var(--color-foreground-soft)", marginTop: 2 }}>{data.address || "2104 Eastlake Ave E, Seattle"}</div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <div><span style={{ color: "var(--color-foreground-muted)" }}>Date: </span><span style={{ fontWeight: 500 }}>Thu, Nov 16</span></div>
          <div><span style={{ color: "var(--color-foreground-muted)" }}>Time: </span><span style={{ fontWeight: 500 }}>12pm – 4pm</span></div>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--color-foreground-muted)", fontSize: 12 }}>Estimated</span>
          <span className="tnum" style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>$165 – $215</span>
        </div>
      </div>

      <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 10, background: "var(--color-surface-warm)", textAlign: "left", fontSize: 13, lineHeight: 1.55 }}>
        <p>We'll confirm your exact price and cleaner details within 2 hours.</p>
        <p style={{ marginTop: 6, color: "var(--color-foreground-muted)" }}>
          Check your email at <span style={{ color: "var(--color-foreground)", fontWeight: 500 }}>{data.email || "you@example.com"}</span>.
        </p>
      </div>

      <div style={{ marginTop: 22, textAlign: "left" }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>What happens next</h3>
        <ol style={{ marginTop: 12, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "We match you with an available cleaner in your area.",
            "You get an email with your cleaner's details, exact price, and payment options.",
            "Your cleaner arrives during your time slot with all supplies.",
            "After cleaning, you receive a receipt and can leave a review.",
          ].map((t, i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 13 }}>
              <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 9999, background: "var(--color-surface-sand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{i+1}</span>
              <span style={{ color: "var(--color-foreground-soft)", lineHeight: 1.55 }}>{t}</span>
            </li>
          ))}
        </ol>
      </div>

      <button style={{
        marginTop: 24, width: "100%",
        background: "var(--color-foreground)", color: "var(--color-background)", border: "none",
        height: 52, fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500,
        borderRadius: 10, cursor: "pointer",
      }}>Back to home</button>

      <p style={{ marginTop: 16, fontSize: 12, color: "var(--color-foreground-muted)" }}>
        Sent with care from{" "}
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: "-0.035em", color: "var(--color-foreground)", fontSize: 15 }}>
          Clee<span style={{ fontStyle: "italic", color: "var(--color-foreground-soft)" }}>nly</span>
        </span>
        {" "}&middot; <a href="mailto:hello@cleenly.app" style={{ color: "var(--color-foreground)" }}>hello@cleenly.app</a>
      </p>
    </div>
  );
}

window.Step6_Confirmation = Step6_Confirmation;
