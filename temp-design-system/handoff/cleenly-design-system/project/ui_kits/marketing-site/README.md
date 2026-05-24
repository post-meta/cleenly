# CLEENLY Marketing Site — UI Kit

Hi-fi, mostly-cosmetic recreation of the CLEENLY marketing site landing page.
The kit focuses on visual fidelity and reusable components, not real
production routes or data.

## Files

- `index.html` — full landing page composition (Hero → Services → Neighborhoods → Trust → Pull Quote → Footer)
- `Header.jsx`, `Hero.jsx`, `ServiceCards.jsx`, `Neighborhoods.jsx`, `TrustStrip.jsx`, `PullQuote.jsx`, `Footer.jsx`

## What's recreated

| Component        | Source                                                    |
|------------------|-----------------------------------------------------------|
| Hero             | Synthesized from imagery + booking entry CTA              |
| Service cards    | `step-service.tsx` tile pattern, expanded for marketing   |
| Neighborhood grid| New composition using the design vocabulary               |
| Trust strip      | `step-contact.tsx` trust row pattern, expanded            |
| Pull quote       | `editorial-pull-quote.tsx`                                |
| Footer           | New composition using the design vocabulary               |

The marketing landing page itself was not in the design export — these are
high-fidelity compositions using the codebase's component vocabulary and the
brand's editorial register. Cross-reference the booking flow UI kit for the
canonical product surface.
