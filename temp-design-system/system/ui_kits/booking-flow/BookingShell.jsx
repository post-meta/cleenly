/** @jsx React.createElement */
const { useState } = React;

// Locked wordmark (variant 03): "Cleenly" in Instrument Serif italic, weight 400.
function Wordmark({ size = 24, color = "var(--color-foreground)" }) {
  return (
    <span aria-label="Cleenly" style={{
      fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400,
      fontSize: size, letterSpacing: "-0.035em",
      color, lineHeight: 1, whiteSpace: "nowrap",
      display: "inline-block",
    }}>Cleenly</span>
  );
}

function BookingShell() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    service: "deep",
    bedrooms: "2",
    bathrooms: "1.5",
    condition: "average",
    addons: ["damp_season_reset"],
    date: null,
    time: null,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const next = () => setStep((s) => Math.min(s + 1, 6));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const serviceLabel = { regular: "Regular Cleaning", deep: "Deep Cleaning", move_out: "Move-Out Cleaning" }[data.service];
  const priceMin = 165, priceMax = 215;
  const duration = "3 – 4 hrs";

  const showSticky = step >= 2 && step <= 5;
  const isFinal = step === 5;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-background)" }}>
      {/* Status bar (faux iOS) */}
      <div style={{ height: 44, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
        <span>9:41</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <svg width="16" height="11" viewBox="0 0 16 11"><path d="M1 8h2v2H1zM5 6h2v4H5zM9 4h2v6H9zM13 2h2v8h-2z" fill="#2D2826"/></svg>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M8 9.5C8 9.5 5 6 1 6c4 0 7-3 7-3s3 3 7 3c-4 0-7 3.5-7 3.5z" stroke="#2D2826" strokeWidth="1.2"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="#2D2826"/><rect x="2" y="2" width="17" height="7" rx="1" fill="#2D2826"/><rect x="21" y="3.5" width="2" height="4" rx="0.5" fill="#2D2826"/></svg>
        </span>
      </div>

      {/* Top bar */}
      {step < 6 && (
        <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={back} disabled={step === 1} style={{
            background: "transparent", border: "none", cursor: step === 1 ? "default" : "pointer",
            opacity: step === 1 ? 0.3 : 1, padding: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 14, color: "var(--color-foreground)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </button>
          <Wordmark size={24}/>
          <button style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8, fontSize: 14, color: "var(--color-foreground-muted)" }}>Save</button>
        </div>
      )}

      {/* Step indicator */}
      {step < 6 && <StepIndicator current={step} total={6}/>}

      {/* Step body */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
        {step === 1 && <Step1_Service value={data.service} onChange={(v) => update({ service: v })} onNext={next}/>}
        {step === 2 && <Step2_Details data={data} onChange={update}/>}
        {step === 3 && <Step3_Price data={data} onChange={update}/>}
        {step === 4 && <Step4_Schedule data={data} onChange={update}/>}
        {step === 5 && <Step5_Contact data={data} onChange={update}/>}
        {step === 6 && <Step6_Confirmation data={data} bookingRef={"K4T9M"}/>}
      </div>

      {/* Sticky footer */}
      {showSticky && (
        <StickyPriceFooter
          serviceName={serviceLabel}
          priceMin={priceMin} priceMax={priceMax}
          duration={duration}
          onContinue={next}
          label={isFinal ? "Confirm booking" : "Continue"}
        />
      )}
    </div>
  );
}

window.BookingShell = BookingShell;
