const steps = [
  {
    number: "1",
    title: "Tell us about your place",
    description:
      "Select bedrooms, bathrooms, and the type of cleaning you need. Add any special requests.",
  },
  {
    number: "2",
    title: "Get your price",
    description:
      "See a price range based on your home. Final price confirmed after quick details.",
  },
  {
    number: "3",
    title: "Pick a time",
    description:
      "Choose a date and time slot that works for you. Morning, afternoon, or evening.",
  },
  {
    number: "4",
    title: "Done",
    description:
      "You'll get confirmation and cleaner details. We handle the rest.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="mb-6 text-2xl font-semibold">How It Works</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-gray-600">
            Booking takes about 2 minutes. No account required to see your price.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="space-y-4">
              <div className="text-4xl font-semibold text-accent">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
