/** @jsx React.createElement */

const bedrooms = ["Studio","1","2","3","4","5+"];
const bathrooms = ["1","1.5","2","2.5","3","3.5+"];
const conditions = [
  { id: "clean", label: "Clean", sub: "maintained regularly" },
  { id: "average", label: "Average", sub: "some areas need attention" },
  { id: "needs_work", label: "Needs work", sub: "hasn't been cleaned in a while" },
];

function FieldSelect({ label, value, options, onChange, formatOption }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select value={value || ""} onChange={(e) => onChange(e.target.value)} style={{
          appearance: "none", width: "100%", height: 48,
          padding: "0 38px 0 14px",
          border: "1px solid var(--color-border)", borderRadius: 10,
          fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--color-foreground)",
          background: "var(--color-background)",
        }}>
          <option value="" disabled>Select</option>
          {options.map((o) => <option key={o} value={o}>{formatOption ? formatOption(o) : o}</option>)}
        </select>
        <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#8C8073" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4"/></svg>
      </div>
    </div>
  );
}

function Step2_Details({ data, onChange }) {
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <h2 style={{ fontSize: 30, lineHeight: 1.15, marginTop: 16 }}>Tell us about <em>your place.</em></h2>
      <p style={{ fontSize: 14, color: "var(--color-foreground-muted)", marginTop: 8 }}>So we can give you an accurate price estimate.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22 }}>
        <FieldSelect label="Bedrooms" value={data.bedrooms} options={bedrooms} onChange={(v) => onChange({ bedrooms: v })} formatOption={(o) => o === "Studio" ? "Studio" : o + " bed"}/>
        <FieldSelect label="Bathrooms" value={data.bathrooms} options={bathrooms} onChange={(v) => onChange({ bathrooms: v })} formatOption={(o) => o + " bath"}/>
      </div>

      <div style={{ marginTop: 18 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Home condition</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {conditions.map((c) => {
            const selected = data.condition === c.id;
            return (
              <button key={c.id} type="button" onClick={() => onChange({ condition: c.id })} style={{
                textAlign: "left", padding: "12px 14px",
                borderRadius: 10,
                border: selected ? "2px solid var(--color-foreground)" : "1px solid var(--color-border)",
                background: selected ? "var(--color-surface-warm)" : "var(--color-background)",
                cursor: "pointer",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: "var(--color-foreground-muted)", marginTop: 2 }}>{c.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Special requests <span style={{ color: "var(--color-foreground-muted)", fontWeight: 400 }}>(optional)</span></label>
        <textarea rows={3} placeholder="Pets, specific areas to focus on, access instructions…" style={{
          width: "100%", padding: "12px 14px",
          border: "1px solid var(--color-border)", borderRadius: 10,
          fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--color-foreground)",
          background: "var(--color-background)", resize: "vertical",
        }}/>
      </div>
    </div>
  );
}

window.Step2_Details = Step2_Details;
