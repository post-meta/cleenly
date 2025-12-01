const regularChecklist = {
  allRooms: [
    "Dust all reachable surfaces",
    "Dust ceiling fans and light fixtures",
    "Vacuum carpets and rugs",
    "Vacuum/mop hard floors",
    "Empty trash cans",
    "Wipe light switches and door handles",
  ],
  kitchen: [
    "Wipe countertops and backsplash",
    "Clean stovetop (exterior)",
    "Wipe appliance exteriors (microwave, fridge, dishwasher)",
    "Clean sink and fixtures",
    "Wipe cabinet fronts",
  ],
  bathrooms: [
    "Clean and disinfect toilet (inside and out)",
    "Clean shower/tub",
    "Clean sink and countertop",
    "Clean mirrors",
    "Wipe cabinet fronts",
    "Mop floor",
  ],
  bedrooms: [
    "Make beds (change linens if left out)",
    "Dust furniture",
    "Vacuum floors",
    "Empty trash",
  ],
};

const deepExtras = {
  kitchen: [
    "Inside microwave",
    "Inside oven",
    "Inside refrigerator",
    "Inside dishwasher",
    "Top of refrigerator",
    "Degrease stovetop and hood",
  ],
  bathrooms: [
    "Scrub grout",
    "Clean exhaust fans",
    "Behind toilet",
    "Inside cabinets (wipe down)",
  ],
  allRooms: [
    "Baseboards",
    "Window sills and tracks",
    "Door frames",
    "Behind and under furniture (where accessible)",
    "Light switch plates",
    "Ceiling fan blades",
  ],
};

const moveOutExtras = [
  "Inside all cabinets and drawers",
  "Inside closets (shelves, rods, floor)",
  "Inside pantry",
  "All appliances interior (oven, fridge, dishwasher, microwave)",
  "Window tracks",
  "Walls spot-cleaned (scuffs, marks)",
  "Light fixtures detailed",
  "Blinds/shutters wiped",
  "Garage swept (if applicable)",
  "Patio/balcony swept (if applicable)",
];

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 flex-shrink-0 text-success"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export function PricingChecklists() {
  return (
    <section className="mt-20">
      <h2>What&apos;s Included</h2>

      {/* Regular Cleaning Checklist */}
      <div className="mt-10">
        <h3>Regular Cleaning Checklist</h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              All Rooms
            </h4>
            <ul className="mt-3 space-y-2">
              {regularChecklist.allRooms.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Kitchen
            </h4>
            <ul className="mt-3 space-y-2">
              {regularChecklist.kitchen.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Bathrooms
            </h4>
            <ul className="mt-3 space-y-2">
              {regularChecklist.bathrooms.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Bedrooms
            </h4>
            <ul className="mt-3 space-y-2">
              {regularChecklist.bedrooms.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Deep Cleaning Checklist */}
      <div className="mt-12">
        <h3>Deep Cleaning Checklist</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything in regular cleaning, plus:
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Kitchen
            </h4>
            <ul className="mt-3 space-y-2">
              {deepExtras.kitchen.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Bathrooms
            </h4>
            <ul className="mt-3 space-y-2">
              {deepExtras.bathrooms.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              All Rooms
            </h4>
            <ul className="mt-3 space-y-2">
              {deepExtras.allRooms.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Move-Out Cleaning Checklist */}
      <div className="mt-12">
        <h3>Move-Out Cleaning Checklist</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything in deep cleaning, plus:
        </p>

        <div className="mt-6">
          <ul className="grid gap-2 sm:grid-cols-2">
            {moveOutExtras.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Designed to pass landlord inspection. We know what property managers
          look for.
        </p>
      </div>
    </section>
  );
}
