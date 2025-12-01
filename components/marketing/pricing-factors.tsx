export function PricingFactors() {
  return (
    <section className="mt-20">
      <h2>What Affects Your Price</h2>
      <p className="mt-4 text-muted-foreground">
        Your final price depends on several factors:
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <h4 className="font-semibold">Home size</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            More bedrooms and bathrooms = more surfaces to clean = higher price.
            Square footage matters too — a 1,500 sq ft 2-bedroom costs more than
            a 900 sq ft 2-bedroom.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Cleaning type</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Regular cleaning costs less than deep cleaning. Move-out cleaning is
            the most thorough and costs the most.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Home condition</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            A home that&apos;s cleaned regularly takes less time than one that
            hasn&apos;t been cleaned in months. First-time cleanings often take
            longer.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Extras</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Add-ons like inside refrigerator, inside oven, or laundry add to the
            base price. You choose what&apos;s included.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Frequency</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Weekly cleanings cost less per visit than one-time cleanings.
            Bi-weekly falls in between.
          </p>
        </div>
      </div>
    </section>
  );
}
