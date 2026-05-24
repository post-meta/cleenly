/** @jsx React.createElement */

function TrustStrip() {
  const items = [
    { icon: "shield", label: "Licensed", sub: "Washington state" },
    { icon: "umbrella", label: "Insured", sub: "$2M general liability" },
    { icon: "badge", label: "Bonded", sub: "Every cleaner, every job" },
    { icon: "leaf", label: "Eco-certified", sub: "Cedar-pine cleaning system" },
    { icon: "check", label: "Background-checked", sub: "Annual re-verification" },
  ];
  return (
    <section id="trust" style={{ padding: "72px 0", background: "var(--color-surface-deep)", color: "#F5EFE6" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="eyebrow" style={{ color: "#C9BFB0" }}>Why CLEENLY</span>
          <h2 style={{ marginTop: 14, fontSize: 56, color: "#F5EFE6" }}>
            Stewardship, not <em style={{ color: "#A89B8A" }}>service.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
          {items.map((it) => (
            <div key={it.label} style={{
              padding: "22px 18px",
              border: "1px solid rgba(245, 239, 230, 0.12)",
              borderRadius: 16,
              background: "rgba(245, 239, 230, 0.04)",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DCE5DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {it.icon === "shield" && <>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </>}
                {it.icon === "umbrella" && <>
                  <path d="M22 12a10 10 0 0 0-20 0z"/>
                  <path d="M12 12v8a2 2 0 0 0 4 0"/>
                </>}
                {it.icon === "badge" && <>
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
                  <path d="m9 12 2 2 4-4"/>
                </>}
                {it.icon === "leaf" && <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2c1.7 5.3 1.8 10.8 0 16-2.3 6-7.5 7-12 5"/>}
                {it.icon === "check" && <path d="M9 12l2 2 4-4M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>}
              </svg>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#F5EFE6" }}>{it.label}</div>
                <div style={{ fontSize: 12, color: "#A89B8A", marginTop: 4, lineHeight: 1.45 }}>{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.TrustStrip = TrustStrip;
