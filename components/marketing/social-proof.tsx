export function SocialProof() {
    return (
        <section className="social-proof py-16">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">
                    What Seattle Families Say
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-6">
                        <div className="flex gap-1 mb-4">
                            <span>⭐⭐⭐⭐⭐</span>
                        </div>
                        <p className="text-sm mb-4 leading-relaxed">
                            "Finally - a cleaning service that doesn't play pricing games.
                            Saw the price, booked, done."
                        </p>
                        <cite className="text-sm text-muted-foreground not-italic">
                            — Sarah M., Capitol Hill
                        </cite>
                    </div>

                    <div className="border rounded-lg p-6">
                        <div className="flex gap-1 mb-4">
                            <span>⭐⭐⭐⭐⭐</span>
                        </div>
                        <p className="text-sm mb-4 leading-relaxed">
                            "You see the price before you book. That's the price you pay.
                            No waiting for quotes or awkward phone calls."
                        </p>
                        <cite className="text-sm text-muted-foreground not-italic">
                            — Mark T., Ballard
                        </cite>
                    </div>

                    <div className="border rounded-lg p-6">
                        <div className="flex gap-1 mb-4">
                            <span>⭐⭐⭐⭐⭐</span>
                        </div>
                        <p className="text-sm mb-4 leading-relaxed">
                            "Booking was fast. The cleaner showed up on time and did a great job.
                            Exactly as described."
                        </p>
                        <cite className="text-sm text-muted-foreground not-italic">
                            — Jessica R., Queen Anne
                        </cite>
                    </div>
                </div>
            </div>
        </section>
    );
}

