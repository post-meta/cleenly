export function TrustStrip() {
  const items = [
    { icon: "shield", label: "Licensed", sub: "Washington state" },
    { icon: "umbrella", label: "Insured", sub: "General liability" },
    { icon: "tag", label: "Price upfront", sub: "The price you see is what you pay" },
    { icon: "redo", label: "24-hour re-clean", sub: "Not right? We come back free" },
    { icon: "box", label: "Own supplies", sub: "We bring everything" },
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
                {it.icon === "tag" && (
                  <>
                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>
                    <circle cx="7.5" cy="7.5" r=".5" fill="#DCE5DF"/>
                  </>
                )}
                {it.icon === "redo" && (
                  <>
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </>
                )}
                {it.icon === "box" && (
                  <>
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                    <path d="m3.3 7 8.7 5 8.7-5"/>
                    <path d="M12 22V12"/>
                  </>
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

