/** @jsx React.createElement */

function Footer() {
  return (
    <footer style={{ paddingTop: 80, paddingBottom: 56, background: "var(--color-surface-warm)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 64, marginBottom: 56 }}>
          <div>
            <Wordmark size={32}/>
            <div style={{ height: 18 }}></div>
            <p style={{ fontSize: 14, color: "var(--color-foreground-soft)", maxWidth: 280, lineHeight: 1.6 }}>
              Residential cleaning for the Greater Seattle area. Same crew, same
              neighborhood, every time.
            </p>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--color-foreground-muted)" }}>
              <span>hello@cleenly.app</span>
              <span>(206) 555-0123</span>
            </div>
          </div>
          {[
            ["Services", ["Regular cleaning", "Deep cleaning", "Move-out cleaning", "Airbnb turnover"]],
            ["Areas", ["Seattle", "Eastside", "Snohomish", "All neighborhoods"]],
            ["Cleenly", ["Why us", "Our cleaners", "Stewardship", "Careers"]],
          ].map(([title, links]) => (
            <div key={title}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{title}</div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0 }}>
                {links.map((l) => (
                  <li key={l}><a href="#" style={{ fontSize: 14, color: "var(--color-foreground)", textDecoration: "none" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "var(--color-border)", opacity: 0.6 }}></div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 12, color: "var(--color-foreground-muted)" }}>
            © 2026{" "}
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.035em", color: "var(--color-foreground-soft)", fontSize: 14 }}>
              Cleenly
            </span>
            , Inc. &middot; Licensed in Washington state.
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 12, color: "var(--color-foreground-muted)" }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>SMS terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
