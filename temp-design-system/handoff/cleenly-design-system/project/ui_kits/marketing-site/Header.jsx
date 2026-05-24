/** @jsx React.createElement */
const { useState } = React;

/**
 * Locked wordmark (variant 03):
 * "Cleenly" set in Instrument Serif italic, weight 400, title case.
 * The italic carries the brand's <em>-on-headline editorial trick.
 */
function Wordmark({ size = 28, color = "var(--color-foreground)", lineHeight = 1 }) {
  return (
    <span aria-label="Cleenly" style={{
      fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400,
      fontSize: size, letterSpacing: "-0.035em",
      color, lineHeight, whiteSpace: "nowrap",
      display: "inline-block",
    }}>Cleenly</span>
  );
}

function Header() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(250, 250, 248, 0.92)",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 0, textDecoration: "none" }}>
          <Wordmark size={32}/>
        </a>
        <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <a href="#services" style={navLink}>Services</a>
          <a href="#areas" style={navLink}>Service areas</a>
          <a href="#trust" style={navLink}>Why Cleenly</a>
          <a href="#" style={navLink}>Sign in</a>
          <a href="#book" className="btn-cta" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#D97757", color: "#fff",
            height: 44, padding: "0 22px",
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
            borderRadius: 10, textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background 220ms cubic-bezier(0.4,0,0.2,1), transform 220ms cubic-bezier(0.4,0,0.2,1)",
          }}>Book a cleaning</a>
        </nav>
      </div>
    </header>
  );
}
const navLink = {
  fontSize: 14, fontWeight: 500, color: "#2D2826",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

window.Header = Header;
window.Wordmark = Wordmark;
