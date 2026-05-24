/** @jsx React.createElement */

const services = [
  {
    id: "regular", name: "Regular Cleaning",
    desc: "Routine maintenance. Dusting, vacuuming, bathrooms, kitchen.",
    bestFor: "Weekly or bi-weekly cleaning",
    price: "From $80",
    img: "../../assets/lifestyle-living-2.jpg",
  },
  {
    id: "deep", name: "Deep Cleaning",
    desc: "Everything in regular plus inside appliances, baseboards, detailed work.",
    bestFor: "First time, seasonal refresh, or overdue cleaning",
    price: "From $140",
    img: "../../assets/service-deep.jpg",
  },
  {
    id: "move-out", name: "Move-Out Cleaning",
    desc: "Complete cleaning to landlord standards. Get your deposit back.",
    bestFor: "End of lease, selling, or move-in prep",
    price: "From $150",
    img: "../../assets/service-move-out.jpg",
  },
  {
    id: "airbnb", name: "Airbnb Turnover",
    desc: "Same-day turnaround between guests. Linens, restocking, photo-ready.",
    bestFor: "Short-term hosts in Seattle metro",
    price: "From $110",
    img: "../../assets/service-airbnb.jpg",
  },
];

function ServiceCards() {
  return (
    <section id="services" style={{ paddingTop: 96, paddingBottom: 96, background: "var(--color-surface-warm)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, marginBottom: 56, alignItems: "end" }}>
          <div>
            <span className="eyebrow">What we do</span>
            <h2 style={{ marginTop: 16, fontSize: 56 }}>
              Four signature <em>protocols.</em>
            </h2>
          </div>
          <p style={{ fontSize: 18, color: "var(--color-foreground-soft)", maxWidth: 460, marginBottom: 8 }}>
            Each service is a defined checklist, a typical duration, and a known
            price range. No call-outs. No surprises after we arrive.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {services.map((s) => (
            <article key={s.id} style={{
              background: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: 24,
              overflow: "hidden",
              display: "grid", gridTemplateColumns: "180px 1fr",
            }}>
              <img src={s.img} alt="" style={{ width: 180, height: "100%", objectFit: "cover" }}/>
              <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                    <h3 style={{ fontSize: 22 }}>{s.name}</h3>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "-0.01em", whiteSpace: "nowrap" }} className="tnum">{s.price}</span>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.55, color: "var(--color-foreground-soft)" }}>{s.desc}</p>
                </div>
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--color-foreground-soft)" }}>Best for: <span style={{ color: "var(--color-foreground)" }}>{s.bestFor}</span></span>
                  <a href="#book" style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)", textDecoration: "none" }}>Book →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

window.ServiceCards = ServiceCards;
