export function TrustStrip() {
  const items = [
    { icon: "shield", label: "Licensed", sub: "Washington state" },
    { icon: "umbrella", label: "Insured", sub: "$2M general liability" },
    { icon: "badge", label: "Bonded", sub: "Every cleaner, every job" },
    { icon: "leaf", label: "Eco-certified", sub: "Cedar-pine cleaning system" },
    { icon: "check", label: "Background-checked", sub: "Annual re-verification" },
  ];

  return (
    <section id="trust" className="py-20 bg-surface-deep text-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <span className="eyebrow block" style={{ color: "#C9BFB0" }}>Why CLEENLY</span>
          <h2 className="mt-3.5 text-[48px] md:text-[56px] leading-[1.1] tracking-[-0.015em] font-display font-normal text-[#F5EFE6]">
            Stewardship, not <em className="italic font-display font-normal text-[#A89B8A]">service.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[18px]">
          {items.map((it) => (
            <div
              key={it.label}
              className="p-5.5 border border-[#F5EFE6]/12 rounded-[16px] bg-[#F5EFE6]/4 flex flex-col gap-3"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DCE5DF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {it.icon === "shield" && (
                  <>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </>
                )}
                {it.icon === "umbrella" && (
                  <>
                    <path d="M22 12a10 10 0 0 0-20 0z"/>
                    <path d="M12 12v8a2 2 0 0 0 4 0"/>
                  </>
                )}
                {it.icon === "badge" && (
                  <>
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </>
                )}
                {it.icon === "leaf" && (
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2c1.7 5.3 1.8 10.8 0 16-2.3 6-7.5 7-12 5"/>
                )}
                {it.icon === "check" && (
                  <path d="M9 12l2 2 4-4M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
                )}
              </svg>
              <div>
                <div className="text-[15px] font-semibold text-[#F5EFE6]">{it.label}</div>
                <div className="text-[12px] text-[#A89B8A] mt-1.5 leading-[1.45]">{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

