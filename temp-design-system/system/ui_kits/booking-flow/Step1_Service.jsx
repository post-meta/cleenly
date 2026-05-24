/** @jsx React.createElement */

const services = [
  { id: "regular",  name: "Regular Cleaning",   desc: "Routine maintenance. Dusting, vacuuming, bathrooms, kitchen.", bestFor: "Weekly or bi-weekly",            price: "From $80"  },
  { id: "deep",     name: "Deep Cleaning",      desc: "Regular, plus inside appliances, baseboards, detailed work.",   bestFor: "First time or seasonal refresh", price: "From $140" },
  { id: "move_out", name: "Move-Out Cleaning",  desc: "Complete cleaning to landlord standards. Get your deposit back.", bestFor: "End of lease",                price: "From $150" },
];

function Step1_Service({ value, onChange, onNext }) {
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <h2 style={{ fontSize: 30, lineHeight: 1.15, marginTop: 16 }}>What type of cleaning <em>do you need?</em></h2>
      <p style={{ fontSize: 14, color: "var(--color-foreground-muted)", marginTop: 8 }}>Select the service that best fits your home.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
        {services.map((s) => {
          const selected = value === s.id;
          return (
            <button key={s.id} type="button" onClick={() => onChange(s.id)} style={{
              textAlign: "left",
              padding: "18px 18px",
              borderRadius: 20,
              border: selected ? "2px solid var(--color-foreground)" : "2px solid var(--color-border)",
              background: selected ? "var(--color-surface-warm)" : "var(--color-background)",
              cursor: "pointer", position: "relative",
              transition: "all 220ms cubic-bezier(0.4,0,0.2,1)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{s.name}</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{s.price}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-foreground-soft)", marginTop: 6, lineHeight: 1.5 }}>{s.desc}</p>
              <p style={{ fontSize: 12, marginTop: 10 }}>
                <span style={{ color: "var(--color-foreground-soft)" }}>Best for: </span>
                <span style={{ color: "var(--color-foreground)" }}>{s.bestFor}</span>
              </p>
              {selected && (
                <div style={{ position: "absolute", top: 16, right: 16, width: 22, height: 22, borderRadius: 9999, background: "var(--color-foreground)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FAFAF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: "var(--color-foreground-soft)" }}>
        Not sure? <span style={{ color: "var(--color-foreground)" }}>Regular is great for maintained homes. Deep for first-time.</span>
      </p>

      {value && (
        <button onClick={onNext} style={{
          marginTop: 22, width: "100%",
          background: "var(--color-accent)", color: "#fff", border: "none",
          height: 52, fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500,
          borderRadius: 10, cursor: "pointer",
        }}>Continue</button>
      )}
    </div>
  );
}

window.Step1_Service = Step1_Service;
