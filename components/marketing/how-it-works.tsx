export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell us about your home",
      sub: "Bedrooms, bathrooms — takes 30 seconds",
    },
    {
      n: "02",
      title: "See your price on screen",
      sub: "No waiting, no phone calls",
    },
    {
      n: "03",
      title: "Pick a date and time",
      sub: "Next day or next week",
    },
    {
      n: "04",
      title: "Live your day",
      sub: "We arrive with our supplies and get to work",
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 tracking-tight">
          How it works
        </h2>

        <div className="grid md:grid-cols-4 gap-10 md:gap-8">
          {steps.map((step, i) => (
            <div key={step.n} className="text-center md:text-left">
              <div className="text-sm font-medium tracking-widest text-accent mb-3">
                {step.n}
              </div>
              <h3 className="text-lg font-semibold mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

