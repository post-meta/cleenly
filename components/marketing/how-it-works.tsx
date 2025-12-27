export function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-muted-foreground mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2">
              Tell us: bedrooms, bathrooms
            </h3>
            <p className="text-sm text-muted-foreground">Takes 30 seconds</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-muted-foreground mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2">
              See price on screen
            </h3>
            <p className="text-sm text-muted-foreground">
              No waiting, no phone calls
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-muted-foreground mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2">
              Pick date & time
            </h3>
            <p className="text-sm text-muted-foreground">
              Next day or next week
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-muted-foreground mb-4">4</div>
            <h3 className="text-lg font-semibold mb-2">Done</h3>
            <p className="text-sm text-muted-foreground">
              Cleaner shows up and cleans
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

