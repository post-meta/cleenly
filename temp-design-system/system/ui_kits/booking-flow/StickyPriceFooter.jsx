/** @jsx React.createElement */

function StickyPriceFooter({ serviceName, priceMin, priceMax, duration, onContinue, label, disabled }) {
  return (
    <div style={{
      borderTop: "1px solid var(--color-border)",
      background: "var(--color-background)",
      padding: "14px 20px 22px",
      boxShadow: "0 -8px 24px rgba(45, 40, 38, 0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
    }}>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-foreground-muted)" }}>{serviceName}</span>
        <span className="tnum" style={{
          fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24,
          lineHeight: 1, color: "var(--color-foreground)", marginTop: 2,
        }}>
          ${priceMin} – ${priceMax}
        </span>
        <span style={{ fontSize: 11, color: "var(--color-foreground-muted)", marginTop: 2 }}>{duration}</span>
      </div>
      <button onClick={onContinue} disabled={disabled} style={{
        flex: "none",
        background: disabled ? "var(--color-gray-300)" : "var(--color-accent)",
        color: "#fff",
        border: "none",
        height: 52, padding: "0 24px",
        fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500,
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 220ms cubic-bezier(0.4,0,0.2,1)",
      }}>
        {label || "Continue"}
      </button>
    </div>
  );
}

window.StickyPriceFooter = StickyPriceFooter;
