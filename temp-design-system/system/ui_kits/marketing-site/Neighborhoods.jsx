/** @jsx React.createElement */

const neighborhoods = [
  ["Capitol Hill", "98102"], ["Ballard", "98107"], ["Queen Anne", "98109"],
  ["Fremont", "98103"], ["Wallingford", "98103"], ["Madrona", "98122"],
  ["West Seattle", "98116"], ["Green Lake", "98103"], ["U District", "98105"],
  ["Bellevue Downtown", "98004"], ["Kirkland", "98033"], ["Redmond", "98052"],
];

function Neighborhoods() {
  return (
    <section id="areas" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="eyebrow">Greater Seattle</span>
          <h2 style={{ marginTop: 16, fontSize: 56 }}>
            Our service <em>areas.</em>
          </h2>
          <p style={{ marginTop: 14, fontSize: 17, color: "var(--color-foreground-soft)", maxWidth: 540, margin: "14px auto 0" }}>
            Same crew, same neighborhood. We assign cleaners by zip so they know
            your building's quirks the second time around.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          maxWidth: 1080, margin: "0 auto",
        }}>
          {neighborhoods.map(([name, zip]) => (
            <a key={name} href="#" style={{
              display: "flex", flexDirection: "column", gap: 6,
              padding: "20px 22px",
              border: "1px solid var(--color-border)",
              borderRadius: 16,
              textDecoration: "none",
              background: "var(--color-background)",
              transition: "border-color 220ms cubic-bezier(0.4,0,0.2,1), background 220ms cubic-bezier(0.4,0,0.2,1)",
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--color-foreground)" }}>{name}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-foreground-muted)" }}>{zip}</span>
            </a>
          ))}
        </div>

        <p style={{ marginTop: 36, textAlign: "center", fontSize: 13, color: "var(--color-foreground-muted)" }}>
          Don't see your neighborhood? <a href="#" style={{ color: "var(--color-foreground)" }}>Tell us where you are</a>.
        </p>
      </div>
    </section>
  );
}

window.Neighborhoods = Neighborhoods;
