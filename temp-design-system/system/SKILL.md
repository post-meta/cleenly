---
name: cleenly-design
description: Use this skill to generate well-branded interfaces and assets for CLEENLY — a premium-positioned residential cleaning booking platform for Greater Seattle. The brand sits on a luxury-editorial / domestic-stewardship axis (warm earth palette, Instrument Serif display + IBM Plex Sans, terracotta + deep-forest accents, PNW interior photography). Contains essential design guidelines, color and type tokens, fonts, assets, and UI kit components for the marketing site and 6-step booking wizard.
user-invocable: true
---

# CLEENLY design — agent skill

Read `README.md` in this folder first. It contains:
- Brand context and product surfaces (marketing site, mobile booking flow).
- **Content fundamentals** — voice, tone matrix, casing, pronouns, copy
  patterns, words the brand uses and avoids.
- **Visual foundations** — color, type, backgrounds, hover/press states,
  borders, radii, shadows, motion, transparency, layout.
- **Iconography** — Lucide-based, no proprietary set.
- **Anti-patterns** — what never to generate.

Then explore:
- `colors_and_type.css` — the canonical token file. Import this in any HTML
  you produce; it sets up `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`,
  `--motion-*`, and the base type hierarchy.
- `preview/` — design-system review cards. Each is a focused specimen
  (one color family, one component state cluster, one type rule). Use them
  as visual reference when building.
- `ui_kits/marketing-site/` — JSX components for the marketing landing page:
  Header, Hero, ServiceCards, Neighborhoods, TrustStrip, PullQuote, Footer.
- `ui_kits/booking-flow/` — JSX components for the 6-step mobile booking
  wizard: Step1_Service → Step6_Confirmation, plus StepIndicator and
  StickyPriceFooter.
- `assets/` — photography (PNW interiors, service contexts) and the CLEENLY
  logo SVG.

## When you create visual artifacts

For slides, mocks, throwaway prototypes:
1. Copy referenced assets out of this folder so the artifact stands alone.
2. Import `colors_and_type.css` (or inline the tokens).
3. Use the JSX components in `ui_kits/` as a starting point — they are
   intentionally simple and cosmetic.
4. Write static HTML for the user to view.

## When you work on production code

You can read the rules and tokens here to become an expert designer for
CLEENLY. The CSS variable names match the source codebase's Tailwind v4
`@theme` block exactly — `--color-accent`, `--color-signal`,
`--color-foreground-soft`, etc.

## Default behavior

If a user invokes this skill with no other guidance:
1. Ask what they want to build or design.
2. Confirm the surface (marketing site? booking flow? a new view?).
3. Ask 3–5 focused questions about audience, primary action, content, and
   any variations they want explored.
4. Act as an expert designer who outputs HTML artifacts or production code
   depending on the need.

## Hard rules — do not violate

- Never use pure `#000000` or `#FFFFFF`.
- Never use bold or semibold weights on Instrument Serif.
- Never use gradients on CTAs.
- Never use sharp 90° card corners.
- Never use cold gray `rgba(0,0,0,…)` shadows — always warm charcoal.
- Never use emoji in product UI.
- Never use bouncy / spring / overshoot motion. 220ms,
  `cubic-bezier(0.4, 0, 0.2, 1)`.
- Always sentence-case buttons and section headers (not Title Case).
- Use the italic single-word `<em>` trick on display headlines.
