/** @jsx React.createElement */

const slots = [
  { id: "morning", label: "Morning", time: "8am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 4pm" },
  { id: "evening", label: "Evening", time: "4pm – 7pm" },
];

function Step4_Schedule({ data, onChange }) {
  const today = new Date();
  const dates = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      iso: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      num: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }

  return (
    <div style={{ padding: "0 20px 20px" }}>
      <h2 style={{ fontSize: 30, lineHeight: 1.15, marginTop: 16 }}>When works <em>for you?</em></h2>
      <p style={{ fontSize: 14, color: "var(--color-foreground-muted)", marginTop: 8 }}>Pick a date and time window.</p>

      <div style={{ marginTop: 22 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Select a date</label>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }} className="hide-scrollbar">
          {dates.map((d) => {
            const sel = data.date === d.iso;
            return (
              <button key={d.iso} type="button" onClick={() => onChange({ date: d.iso })} style={{
                flex: "0 0 auto",
                minWidth: 52, minHeight: 64,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "8px 0",
                border: sel ? "1px solid var(--color-foreground)" : "1px solid var(--color-border)",
                background: sel ? "var(--color-foreground)" : "var(--color-background)",
                color: sel ? "var(--color-background)" : "var(--color-foreground)",
                borderRadius: 10,
                cursor: "pointer",
              }}>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{d.day}</span>
                <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1, margin: "2px 0" }}>{d.num}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{d.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Select a time slot</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {slots.map((s) => {
            const sel = data.time === s.id;
            return (
              <button key={s.id} type="button" onClick={() => onChange({ time: s.id })} style={{
                padding: "14px 8px",
                borderRadius: 10,
                border: sel ? "1px solid var(--color-foreground)" : "1px solid var(--color-border)",
                background: sel ? "var(--color-foreground)" : "var(--color-background)",
                color: sel ? "var(--color-background)" : "var(--color-foreground)",
                cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{s.time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {data.date && data.time && (
        <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--color-surface-warm)", borderRadius: 10, fontSize: 13 }}>
          <span style={{ color: "var(--color-foreground-muted)" }}>Selected: </span>
          <span style={{ fontWeight: 600 }}>
            {new Date(data.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {" "}({slots.find(s => s.id === data.time)?.time})
          </span>
        </div>
      )}
    </div>
  );
}

window.Step4_Schedule = Step4_Schedule;
