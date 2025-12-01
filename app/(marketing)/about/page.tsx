import { Container } from "@/components/ui/container";

export const metadata = {
  title: "About — Cleenly",
  description: "Why we built Cleenly. How we work. What we believe.",
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <Container size="narrow">
        <h1>About Cleenly</h1>

        <div className="mt-8 space-y-6 text-lg text-muted-foreground">
          <p>
            We started Cleenly because booking a cleaner shouldn&apos;t require
            phone calls, back-and-forth emails, or guessing at prices.
          </p>
          <p>
            Most cleaning services in Seattle still operate like it&apos;s 2005.
            You call, leave a voicemail, wait for a callback, describe your
            place three different ways, and finally get a quote that
            somehow changes when the cleaner shows up.
          </p>
          <p>We fixed that.</p>
        </div>

        <h2 className="mt-16">How we work</h2>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-lg font-medium">Transparent pricing</h3>
            <p className="mt-2 text-muted-foreground">
              Our calculator shows you a price range before you book. No
              &quot;starting from&quot; games. The final price might adjust
              slightly based on actual conditions, but you&apos;ll know the
              ballpark immediately.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Vetted cleaners</h3>
            <p className="mt-2 text-muted-foreground">
              Every cleaner on our platform has a track record. You can see
              their reviews, number of completed jobs, and specialties. We
              don&apos;t just verify IDs—we track quality over time.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">We fix problems</h3>
            <p className="mt-2 text-muted-foreground">
              Not happy with a cleaning? Tell us within 24 hours. We send
              someone back. No arguing about what counts as &quot;clean enough.&quot;
              Your satisfaction is the only metric.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">No subscriptions required</h3>
            <p className="mt-2 text-muted-foreground">
              Book once or book regularly—your choice. We&apos;ll offer you
              discounts for recurring cleanings, but there&apos;s no pressure to
              commit.
            </p>
          </div>
        </div>

        <h2 className="mt-16">Service area</h2>
        <p className="mt-4 text-muted-foreground">
          We serve the Greater Seattle area: Seattle, Bellevue, Kirkland,
          Redmond, Renton, Bothell, and surrounding cities. Not sure if we
          cover your neighborhood? Enter your zip code when booking and
          we&apos;ll let you know.
        </p>

        <h2 className="mt-16">Contact</h2>
        <p className="mt-4 text-muted-foreground">
          Questions? Email us at{" "}
          <a
            href="mailto:hello@cleenly.com"
            className="text-foreground underline"
          >
            hello@cleenly.com
          </a>
          . We respond within a day.
        </p>
      </Container>
    </div>
  );
}
