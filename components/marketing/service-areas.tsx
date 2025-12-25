import { Container } from "@/components/ui/container";

export function ServiceAreas() {
  return (
    <section id="service-areas" className="py-20 md:py-28 bg-gray-50">
      <Container>
        <div className="text-center">
          <h2>Service Areas</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            CLEENLY serves Seattle and surrounding cities in King, Pierce, and
            Snohomish counties.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">Seattle</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Capitol Hill, Ballard, Fremont, Queen Anne, University District,
              Beacon Hill, West Seattle, Columbia City, Ravenna, Wallingford,
              Green Lake, and more.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Eastside</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Bellevue, Kirkland, Redmond, Bothell, Woodinville, Sammamish,
              Issaquah, Mercer Island.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">South King County</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Renton, Kent, Federal Way, Auburn, Burien, Tukwila.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">North & Pierce County</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Shoreline, Edmonds, Lynnwood, Everett, Tacoma, Lakewood,
              University Place.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
