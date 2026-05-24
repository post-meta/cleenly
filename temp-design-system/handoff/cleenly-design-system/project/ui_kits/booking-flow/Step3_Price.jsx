/** @jsx React.createElement */

const includes = [
  "All bathrooms — sinks, toilets, tubs, showers",
  "Kitchen — counters, appliances exterior",
  "All bedrooms — dusting, vacuuming, beds made",
  "Living areas — dusting, vacuuming, surfaces",
  "Floors throughout — vacuum & mop",
  "Trash removed, surfaces wiped",
];

const pnwAddons = [
  { id: "pollen_purge", label: "Pollen Purge", desc: "HEPA vent flush, screen wipe, allergen-grade cloths.", price: "+$35" },
  { id: "damp_season_reset", label: "Damp-Season Reset", desc: "Mildew prevention, cedar-pine mop, vent re-set.", price: "+$45" },
];

const standardAddons = [
  { id: "fridge", label: "Inside fridge", desc: "Shelves, drawers, gaskets.", price: "+$25" },
  { id: "oven", label: "Inside oven", desc: "Racks, glass, deep degrease.", price: "+$30" },
  { id: "windows", label: "Interior windows", desc: "Up to 8 panes.", price: "+$40" },
  { id: "cabinets", label: "Inside cabinets", desc: "Empty interiors only.", price: "+$25" },
];

function Step3_Price({ data, onChange }) {
  const addons = data.addons || [];
  const toggle = (id) => {
    const next = addons.includes(id) ? addons.filter(a => a !== id) : [...addons, id];
    onChange({ addons: next });
  };

  return (
    <div style={{ padding: "0 20px 20px" }} className="animate-fadeInUp">
      <h2 style={{ fontSize: 30, lineHeight: 1.15, marginTop: 16 }}>Your cleaning <em>estimate.</em></h2>
      <p style={{ fontSize: 14, color: "var(--color-foreground-muted)", marginTop: 8 }}>Based on your home details.</p>

      <div style={{ marginTop: 18, padding: "18px 18px", borderRadius: 20, border: "1px solid var(--color-border)", background: "var(--color-surface-warm)" }}>
        <div style={{ fontSize: 12, color: "var(--color-foreground-muted)" }}>Deep Cleaning · 2 bed · 1.5 bath</div>
        <div className="tnum" style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>$165 – $215</div>
        <div style={{ fontSize: 12, color: "var(--color-foreground-muted)", marginTop: 6 }}>Typical duration: 3 – 4 hrs</div>
      </div>

      <div style={{ marginTop: 22 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>This includes:</h3>
        <ul style={{ marginTop: 10, listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
          {includes.map((i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--color-foreground-soft)" }}>
              <svg style={{ flexShrink: 0, marginTop: 2 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(221,213,199,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Signature PNW Protocols</h3>
          <span style={{ background: "var(--color-signal-soft)", color: "var(--color-signal)", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 9999, letterSpacing: "0.04em", textTransform: "uppercase" }}>Recommended</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--color-foreground-muted)", marginTop: 4 }}>Sanitation systems optimized for Western Washington seasons.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {pnwAddons.map((a) => {
            const sel = addons.includes(a.id);
            return (
              <label key={a.id} style={{
                padding: "12px 12px", borderRadius: 14,
                border: sel ? "2px solid var(--color-signal)" : "1px solid var(--color-border)",
                background: sel ? "rgba(220,229,223,0.25)" : "var(--color-background)",
                cursor: "pointer", display: "flex", flexDirection: "column", gap: 8,
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="checkbox" checked={sel} onChange={() => toggle(a.id)} style={{ marginTop: 3, accentColor: "#2D4A3E" }}/>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-foreground-soft)", marginTop: 2, lineHeight: 1.45 }}>{a.desc}</div>
                  </div>
                </div>
                <div style={{ paddingTop: 8, borderTop: "1px solid rgba(221,213,199,0.5)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: "var(--color-signal-soft)", color: "var(--color-signal)", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>PNW</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-signal)" }}>{a.price}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Standard extras</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {standardAddons.map((a) => {
            const sel = addons.includes(a.id);
            return (
              <label key={a.id} style={{
                padding: "10px 12px", borderRadius: 12,
                border: sel ? "2px solid var(--color-foreground)" : "1px solid var(--color-border)",
                background: sel ? "var(--color-surface-warm)" : "var(--color-background)",
                cursor: "pointer", display: "flex", flexDirection: "column", gap: 6,
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="checkbox" checked={sel} onChange={() => toggle(a.id)} style={{ marginTop: 3, accentColor: "#2D2826" }}/>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-foreground-muted)", marginTop: 1 }}>{a.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--color-foreground-soft)" }}>{a.price}</div>
              </label>
            );
          })}
        </div>
      </div>

      <p style={{ marginTop: 20, padding: "12px 14px", background: "var(--color-surface-warm)", borderRadius: 10, fontSize: 12, color: "var(--color-foreground-soft)", lineHeight: 1.5 }}>
        Final price confirmed after booking. No surprises — if anything changes, we'll tell you first.
      </p>
    </div>
  );
}

window.Step3_Price = Step3_Price;
