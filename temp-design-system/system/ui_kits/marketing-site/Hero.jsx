/** @jsx React.createElement */

function Hero() {
  return (
    <section style={{ paddingTop: 64, paddingBottom: 96 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <span className="eyebrow" style={{ display: "inline-block", marginBottom: 24 }}>
              Greater Seattle &middot; instant booking
            </span>
            <h1 style={{ fontSize: 72, marginBottom: 24, maxWidth: 560 }}>
              A cleaner home in <em>three taps.</em>
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, maxWidth: 480, marginBottom: 36, color: "var(--color-foreground-soft)" }}>
              Vetted cleaners. Pacific Northwest standards. Same crew every time —
              the same key under the mat, but better.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 28 }}>
              <a href="#book" style={primaryCta}>Book a cleaning</a>
              <a href="#services" style={ghostCta}>See services</a>
            </div>
            <div style={{ display: "flex", gap: 28, alignItems: "center", color: "var(--color-foreground-muted)", fontSize: 13, flexWrap: "wrap" }}>
              <span style={{ whiteSpace: "nowrap" }}>Licensed &middot; Insured &middot; Bonded</span>
              <span style={{ width: 1, height: 14, background: "var(--color-border)" }}></span>
              <span style={{ whiteSpace: "nowrap" }}>No payment until confirmed</span>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img src="../../assets/hero-image.jpg" alt=""
              style={{ width: "100%", height: 560, objectFit: "cover", borderRadius: 32, display: "block" }}/>
            <div style={{
              position: "absolute", left: -28, bottom: 36,
              background: "#FAFAF8", border: "1px solid var(--color-border)",
              borderRadius: 16, padding: "16px 20px",
              boxShadow: "var(--shadow-lift)",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ width: 36, height: 36, borderRadius: 9999, background: "#DCE5DF", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
              </span>
              <div style={{ whiteSpace: "nowrap" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  <span className="tnum">4.92</span> avg. rating
                </div>
                <div style={{ fontSize: 12, color: "var(--color-foreground-muted)", marginTop: 4 }}>
                  Across 2,400 cleanings this year
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const primaryCta = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "#D97757", color: "#fff",
  height: 56, padding: "0 32px",
  fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500,
  borderRadius: 10, textDecoration: "none",
  whiteSpace: "nowrap",
};
const ghostCta = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "transparent", color: "#2D2826",
  height: 56, padding: "0 26px",
  fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500,
  borderRadius: 10, textDecoration: "none",
  border: "1px solid var(--color-border)",
  whiteSpace: "nowrap",
};

window.Hero = Hero;
