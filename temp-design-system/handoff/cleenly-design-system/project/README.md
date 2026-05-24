# CLEENLY Design System

> Premium-positioned residential cleaning booking platform for Greater Seattle.
> Web + mobile-web. Brand axis: **Luxury Editorial Magazine × Domestic Stewardship (PNW nature)**.
> Restraint = luxury. Trust through warmth, not corporate blue.

---

## What CLEENLY is

CLEENLY is a booking platform for residential cleaning in Greater Seattle. The
primary product surface is the **booking flow**: address → date → time →
extras → checkout. Mobile-first, instant-book.

The brand reads as an editorial magazine for the home — warm paper backgrounds,
serif display type with single-word italic emphasis, terracotta and deep-forest
accents, photography of light-filled PNW interiors. There are no smiling
cleaners in branded uniforms, no fintech blues, no gradients on CTAs.

### Products represented in this design system
- **Marketing site** (web) — landing page, service pages, neighborhood pages,
  trust/about content.
- **Booking flow** (mobile-web first) — 6-step wizard:
  Service → Details → Price → Schedule → Contact → Confirmation.
  Calendar and time-slot picker are the most-touched UI objects.

### Source materials consulted while building this system
- `cleenly-design-export/` — Next.js / Tailwind v4 export of CLEENLY's design
  tokens and React components. Source of truth for color, type, spacing, radii,
  shadows, motion. (Local mount via File System Access API — pass to designer
  to re-read if rebuilding.)
- `cleenly-design-export/app/globals.css` — Tailwind v4 `@theme` block; all
  tokens.
- `cleenly-design-export/components/ui/` — Button, Card, Input, Select,
  Container, Eyebrow, Stat, DividerWarm, EditorialPullQuote, Carousel.
- `cleenly-design-export/components/booking/` — BookingWizard, StepIndicator,
  StickyPriceFooter, the 6 step screens, PriceDisplay.
- `uploads/` — eight provided JPGs of PNW interiors and service contexts.

---

## Index — what's in this folder

```
README.md                   ← this file (start here)
SKILL.md                    ← Agent Skill manifest — usage spec for AI designers
colors_and_type.css         ← CSS custom properties: color, type, spacing, radii,
                              shadows, motion. Source of truth.
assets/                     ← Photography (PNW interiors, service contexts) +
                              logo SVG
fonts/                      ← Webfont references (Google Fonts CDN; see Fonts
                              note below)
preview/                    ← Design-system review cards (typography, color,
                              spacing, components, brand). Each renders inside
                              the "Design System" tab of this project.
ui_kits/
  marketing-site/           ← Marketing site UI kit (hero, service cards,
                              neighborhood grid, testimonial, trust strip,
                              footer)
  booking-flow/             ← Mobile-web booking wizard (6 steps, sticky price
                              footer, date carousel)
```

---

## Content fundamentals

How CLEENLY writes copy. The voice is the brand.

### Voice
- **Calm, declarative, slightly editorial.** Short sentences. Plain words.
  No exclamation points, no startup-y enthusiasm.
- **You-and-we, not you-only.** "We'll confirm your booking within 2 hours."
  "We never share your information." The brand speaks as a known, present
  steward — not a faceless platform.
- **Concrete, not abstract.** Names actual rooms, supplies, time windows, and
  outcomes. "Inside appliances, baseboards, detailed work." not "premium
  service experience."
- **Warmth through specificity.** "Pets, specific areas to focus on, access
  instructions…" — placeholder text reads like a friend's checklist.

### Tone matrix
| Surface              | Tone                                           |
|----------------------|------------------------------------------------|
| Hero / headlines     | Editorial, magazine-cover restraint            |
| Service descriptions | Direct, specific, no marketing fluff           |
| Booking flow         | Practical, reassuring, neutral                 |
| Trust / fine print   | Plain, candid (never legalese)                 |
| Confirmation         | Warm, grounded ("You're all set!")             |
| Errors               | Helpful, no blame, no jargon                   |

### Casing
- **Sentence case everywhere.** Headlines, buttons, labels, eyebrows-with-
  uppercase-styling are sentence-cased in source ("our service areas" rendered
  via CSS `text-transform: uppercase`).
- **Buttons:** sentence case — "Continue", "See my price", "Confirm booking",
  "Back to home". Never Title Case Like This.
- **Service names** are the one Title-Cased exception: "Regular Cleaning",
  "Deep Cleaning", "Move-Out Cleaning". They function as proper nouns.

### Pronouns
- **"We"** for CLEENLY. Singular agent voice — never "the team", "our company".
- **"You / your"** for the customer. Never "the customer", "users", "the
  homeowner".
- **"Your cleaner"** — the human doing the work is always referenced as a
  specific person assigned to the customer ("we'll match you with an available
  cleaner in your area"), never "our staff" or "our team".

### Specific copy patterns

**The italic-word trick (display headlines only):**
Wrap a single word in `<em>` inside an `<h1>`/`<h2>`. Renders italic in a
softer foreground color. Pick the noun, not the verb.
> A cleaner home in <em>three taps.</em>
> Our service <em>areas.</em>

**Trust signal pattern (terse, comma-separated):**
> Licensed · Insured · Bonded
> No payment required now. Final price confirmed before charging. Cancel
> free up to 24 hours before.

**Price hedging — promise, not weasel:**
> "Final price confirmed after booking. No surprises — if anything changes,
> we'll tell you first."

**Empty / waiting states:**
> "Select service type and property details to see price"
> Neutral, instructive. Never "Loading…" with a spinner.

**Form helpers — name the friction, not the rule:**
> "How will the cleaner get in? Lockbox code, doorman, you'll be home…"
> Not "Please enter access information."

### Emoji
**No emoji in product surfaces.** They break the editorial register. The
codebase's README uses them for navigation (🎨 📂 ⚠️) but no shipped UI does.

### Words the brand uses
"home" (not "house" or "property") · "stewardship" · "reset" (as in
"seasonal reset") · "signature" (for PNW-specific add-ons) · "average / clean
/ needs work" (home condition labels) · "your place" (informal, in step
headers).

### Words the brand avoids
"premium" (shown, not stated) · "best" / "#1" · "trusted by X customers"
without a number we can verify · "magical" / "delight" / "transform" ·
"experience" as a noun · "solution" · any superlatives.

---

## Visual foundations

### Color
Warm earth palette. **Never pure black or pure white.** Backgrounds are warm
paper (`#FAFAF8`), foregrounds are warm charcoal (`#2D2826`). Shadows are
always mixed with `rgba(45, 40, 38, …)`, never `rgba(0, 0, 0, …)`.

- **Primary accent — terracotta `#D97757`.** Used on primary CTAs, focus rings,
  link hover, selection highlight. Hover `#C26544`. Soft tint `#F4DDD0` for
  badges and quiet accents.
- **Signal — deep forest `#2D4A3E`.** Used for PNW-stewardship moments
  (signature add-ons, eco indicators, success states). Soft tint `#DCE5DF`.
- **Surfaces** — three layers: `--color-background` (warm paper, app shell),
  `--color-surface-warm` (cream cards), `--color-surface-sand` (warmer
  emphasis), `--color-surface-deep` (walnut, full-bleed contrast sections —
  used sparingly and never for body text).
- **Text** — three weights of warm charcoal: `--color-foreground` (primary),
  `--color-foreground-soft` (secondary), `--color-foreground-muted` (tertiary
  / captions).

No gradients on CTAs. No saturated fintech blue. No cold gray shadows.

### Typography
Strict two-font pairing.

- **Display — Instrument Serif.** Display-only. **Always weight 400**, never
  bold or semibold. Generous tracking-tight (`-0.02em`). The editorial trick:
  wrap one word in `<em>` to render it italic in a softer foreground color.
- **Body / UI — IBM Plex Sans.** Weights 400 / 500 / 600 only. Body is 17px /
  1.7. Eyebrows are 13px, weight 500, uppercase, tracked `0.08em`.

Logo wordmark uses OPTIUniversSixtySeven (proprietary). Not available in this
export — we fall back to the logo SVG (`assets/cleenly-logo.svg`) and an IBM
Plex Sans logotype substitute. **See "Fonts" note below.**

### Backgrounds & imagery
- **Warm paper** is the default app surface. Sections are separated by
  **hairline dividers** (1px warm border at ~40-60% opacity), not by alternating
  color blocks.
- **Full-bleed photography** for hero and service-context moments. Imagery is
  **warm and bright** — PNW interiors with natural daylight, neutral linens,
  wood, ceramics, soft plants. No people in branded uniforms, no stock-photo
  smiles, no cartoon illustrations.
- **Dot-grid empty state:**
  `background: radial-gradient(circle, #C9BFB0 2px, transparent 1px) 24px 24px;`
  Used behind blank-canvas moments (no bookings yet, empty calendars).
- **No repeating textures or noisy backgrounds.** No gradients except very
  occasionally as a 2-stop tonal wash on dark surfaces.

### Borders, corners, shadows
- **Hairline borders** are the workhorse. `1px solid #DDD5C7` (`--color-border`)
  or `border/40-60` opacity for sub-dividers.
- **Radii hierarchy** —
  - `xs 4px` rare detail
  - `sm 6px` inputs, checkboxes
  - `md 10px` buttons (h-11 standard)
  - `lg 16px` cards
  - `xl 24px` booking step containers
  - `2xl 32px` hero blocks
  - `full` pills, avatars
  **No sharp 90° card corners anywhere.**
- **Shadows** — three named tokens, all warm charcoal:
  - `--shadow-soft` passive lift (chips, small cards)
  - `--shadow-card` standard card resting state
  - `--shadow-lift` active / sticky / floating elements

### Hover & press states
- **Buttons (primary):** background darkens to `--color-accent-hover`, button
  translates `-translate-y-0.5` (2px lift) plus shadow ramps from `soft` →
  `card`. Press resets translate to `0`. No bounce.
- **Buttons (secondary):** border darkens from `--color-border` to
  `--color-foreground`, background tints to `--color-gray-50`.
- **Cards:** border darkens to `--color-border-hover`. No scale, no shadow
  bloom.
- **Selectable tiles (service / date / time / addon):** when selected, border
  jumps to 2px, fill flips to muted/foreground. Signal-toned addons (PNW
  protocols) use `border-signal` + `ring-1 ring-signal` + `bg-signal-soft/10`.

### Motion
- **220ms base, `cubic-bezier(0.4, 0, 0.2, 1)`.** Vintage / heavy, never
  bouncy. No spring physics. No overshoot.
- Named tokens: `--motion-fast 150ms`, `--motion-base 220ms`,
  `--motion-slow 400ms`.
- **Key animations:**
  - `fadeInUp 0.8s ease-out` — scroll-revealed sections, step transitions.
  - `float 6s ease-in-out infinite` — decorative tertiary elements only.
  - No bounce, wobble, jiggle, parallax, or "delight" animations.

### Transparency & blur
- Used sparingly. Soft surface tints (`bg-muted/30`, `bg-signal-soft/10`) for
  callout boxes, not glass-morphism.
- **No backdrop-blur on navigation bars.** Sticky elements use solid
  background + hairline border + `--shadow-lift`.

### Layout rules
- Container widths via `--max-width`: narrow `48rem` (forms, readable copy),
  default `80rem`, wide `96rem` (full-bleed hero edges).
- Generous vertical rhythm — section padding `--spacing-md` (72px) to
  `--spacing-xl` (120px). Editorial whitespace is the brand.
- **Mobile-first.** Booking flow targets ≥ 44×44 hit areas; calendar slots
  52×64. Sticky bottom bars use `pb-[env(safe-area-inset-bottom)]` so they
  clear the iOS home indicator.

### Cards (the canonical card)
```
border: 1px solid var(--color-border);     /* hairline */
background: var(--color-background);
border-radius: var(--radius-lg);           /* 16px */
padding: 24px;
transition: border-color 220ms var(--motion-ease);
&:hover { border-color: var(--color-border-hover); }
/* No shadow at rest. Add --shadow-card only when card floats. */
```

---

## Iconography

CLEENLY ships **no proprietary icon set**. The codebase uses **Lucide React**
(via `lucide-react` package), which is the same set as the Lucide CDN. Icons
appear in source as e.g. `<ArrowLeft className="h-4 w-4" />` and
`<ArrowRight />` inside the Carousel component.

### What CLEENLY uses icons for
- **Directional arrows** inside the date carousel and "back/forward" buttons.
- **Inline check marks** as bullet glyphs in service-includes lists, trust
  rows, and the confirmation success state. These are hand-rolled SVGs in the
  source (`stroke="currentColor"` with the standard checkmark path) — they
  inherit text color (`--color-signal` for eco/success contexts,
  `--color-foreground` for neutral lists).
- **No filled icons**, no two-tone icons, no duotone. Stroke-only, 1.5–2px
  weight, matching Lucide's defaults.
- **Hit areas around icons must be ≥ 44px square** even when the visual icon
  is 16–24px.

### Substitution for this design system
Because we have no codebase access to bundle `lucide-react`'s sprite, the
preview cards and UI kits in this folder load **Lucide via CDN**:
```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="arrow-right"></i>
<script>lucide.createIcons();</script>
```
**Flag:** this is identical to the Lucide React set in spirit but loaded
differently. Production should keep `lucide-react`. The checkmarks in
confirmation / service-include lists remain inline SVG (matches source).

### Logo — two locked wordmarks

CLEENLY ships **two** wordmark treatments. They are never mixed inside the
same composition — each surface picks one.

**Primary · utility (variant 05).** `CL` + `EE` + `NLY` where:
- `CL` and `NLY` are set in **OPTIUniversSixtySeven CAPS** at
  `--color-foreground`, letter-spacing −0.02em.
- The middle **`EE`** is set in **Instrument Serif italic** at
  `--color-foreground-soft` — same color/weight contract as `<em>` inside
  display headlines. The brand cites its own editorial trick inside the
  wordmark.

Used on every chrome surface: marketing header, footer, app/PWA icon,
booking topbar. Below ~14px the italic differentiation gets muddy — drop to
pure OPTIUniversSixtySeven for favicon / status-bar.

**Secondary · editorial (variant 11).** `Clee` + `nly` where:
- `Clee` is set in **Instrument Serif 400 upright**, title case.
- `nly` is set in **Instrument Serif 400 italic** at `--color-foreground-soft`.
- Letter-spacing −0.035em.

Used only in editorial moments: email sign-offs ("Sent with care from
Cleenly"), confirmation-page byline, pull-quote attribution, print copyright
lines, business cards. Never on product chrome.

In React, primary: `<Wordmark size={32}/>` (already used in Header / Footer /
BookingShell). Editorial: inline span — see Footer / Step6_Confirmation / PullQuote.

The **mark** (square lockup for app/PWA icon) is a single `C` in
OPTIUniversSixtySeven on warm paper inside an 80×80 walnut tile with
`radius-md`. No italic in the mark — too small to read.

`assets/cleenly-logo.svg` — primary wordmark "CLEENLY" set in a custom letterform
(approximated from OPTIUniversSixtySeven). **No mark / no symbol** — the brand
is wordmark-only at this stage. There is also a 1-letter "C" lockup for app
icons and small spaces.

### Emoji
**Never used in product UI.** Used in source-code documentation only.

### Unicode special characters
- `·` (middle dot, U+00B7) as separator in trust rows: "Licensed · Insured ·
  Bonded".
- `—` (em dash) for editorial connective phrases: "we'll confirm your booking
  within 2 hours."
- `→` and `←` only inside running copy, never as standalone affordance icons.

---

## Fonts — all brand fonts present

This export now ships all three brand fonts locally in `fonts/`:
- **IBM Plex Sans** (Regular 400, SemiBold 600) — body, UI.
- **Instrument Serif** (Regular 400, Italic) — display.
- **OPTIUniversSixtySeven** (Regular 400) — wordmark / logo only.

`@font-face` declarations live at the top of `colors_and_type.css`. CSS
variables: `--font-sans`, `--font-display`, `--font-logo`.

**Note:** IBM Plex Sans **Medium (500)** was not supplied. The `@font-face`
block maps weight 500 to the SemiBold file so existing `font-weight: 500`
rules still resolve to a real face. Drop a Medium .ttf into `fonts/` if you
need that weight distinct.

---

## Anti-patterns — never generate

- Pure `#000000` or `#FFFFFF` anywhere.
- Bold or semibold weights on Instrument Serif (display serif).
- Saturated fintech blues, cold grays.
- Cartoon illustrations or stock-photo smiling cleaners in branded uniforms.
- Gradients on CTAs.
- Sharp 90° card corners.
- Cold gray shadows (`rgba(0,0,0,…)`).
- Title Case Like This on buttons or section headers.
- Emoji in shipped UI.
- Backdrop-blur navigation bars.
- Bouncy / spring / overshoot animations.
