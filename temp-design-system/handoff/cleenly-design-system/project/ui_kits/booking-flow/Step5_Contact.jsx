/** @jsx React.createElement */

function Field({ label, name, type, placeholder, value, onChange, optional }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
        {label} {optional && <span style={{ color: "var(--color-foreground-muted)", fontWeight: 400 }}>(optional)</span>}
      </label>
      <input
        type={type || "text"} name={name} placeholder={placeholder} value={value || ""}
        onChange={(e) => onChange({ [name]: e.target.value })}
        style={{
          width: "100%", height: 48, padding: "0 14px",
          border: "1px solid var(--color-border)", borderRadius: 10,
          fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--color-foreground)",
          background: "var(--color-background)",
        }}
      />
    </div>
  );
}

function Step5_Contact({ data, onChange }) {
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <h2 style={{ fontSize: 30, lineHeight: 1.15, marginTop: 16 }}>How can we <em>reach you?</em></h2>
      <p style={{ fontSize: 14, color: "var(--color-foreground-muted)", marginTop: 8 }}>We'll send confirmation to this contact info.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
        <Field label="Your name" name="name" placeholder="First and last name" value={data.name} onChange={onChange}/>
        <Field label="Email" name="email" type="email" placeholder="you@example.com" value={data.email} onChange={onChange}/>
        <Field label="Phone" name="phone" type="tel" placeholder="(206) 555-0123" value={data.phone} onChange={onChange}/>
        <Field label="Service address" name="address" placeholder="123 Main St, Seattle, WA 98101" value={data.address} onChange={onChange}/>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
            Access instructions <span style={{ color: "var(--color-foreground-muted)", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea rows={3} placeholder="How will the cleaner get in? Lockbox code, doorman, you'll be home…" style={{
            width: "100%", padding: "12px 14px",
            border: "1px solid var(--color-border)", borderRadius: 10,
            fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--color-foreground)",
            background: "var(--color-background)", resize: "vertical",
          }}/>
        </div>
      </div>

      <p style={{ marginTop: 14, fontSize: 12, color: "var(--color-foreground-muted)" }}>
        We never share your information with anyone except your assigned cleaner.
      </p>

      <label style={{ marginTop: 14, display: "flex", gap: 10, padding: "12px 14px", border: "1px solid var(--color-border)", borderRadius: 10, alignItems: "flex-start", cursor: "pointer" }}>
        <input type="checkbox" style={{ marginTop: 2, accentColor: "#2D2826" }}/>
        <span style={{ fontSize: 12, lineHeight: 1.5, color: "var(--color-foreground)" }}>
          I agree to receive SMS notifications about my booking from CLEENLY. Message and data rates may apply. Reply STOP to unsubscribe.
        </span>
      </label>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        {["No payment required now", "Final price confirmed before charging", "Cancel free up to 24 hrs before"].map((t) => (
          <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "var(--color-foreground-muted)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

window.Step5_Contact = Step5_Contact;
