# CLEENLY — CLAUDE.md

Cleaning booking platform, Greater Seattle. Family business (Eugene + wife).
CLEENLY is a cleaning COMPANY, not a marketplace. Customers book "CLEENLY", not individual cleaners.
Production: https://cleenly.app · Supabase project: `onhrawahtfiuqzovglkb` (CityHill org, Pro plan — old `hspmtqlnrmomatmzklnh` is dead, do not reuse)

---

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript strict) · React 19
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Auth:** NextAuth + Supabase Auth + Google OAuth
- **Payments:** Stripe (primary), Venmo/Cash App (interim)
- **Deploy:** Vercel
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React only
- **Animations:** Framer Motion — use sparingly

---

## Project Structure

```
app/
  (public)/           # Marketing pages (/, /pricing, /about, /faq, /join)
  (public)/[city]/    # 22 city landing pages
  (public)/[city]/[service]/  # 220 service-city product pages
  (booking)/book/     # 6-step booking wizard
  (auth)/             # NextAuth + Google OAuth
  (dashboard)/        # Customer dashboard
  api/
    auth/             # NextAuth handlers
    bookings/         # Booking CRUD
    webhooks/stripe/  # Stripe webhook handler

components/
  ui/                 # shadcn/ui (DO NOT EDIT)
  shared/             # service-card, service-carousel, json-ld
  booking/            # Booking wizard step components
  layout/             # Header, Footer, Nav

lib/
  data/
    cities.ts         # 22 cities with landmarks, neighborhoods, content
    services.ts       # 10 service types
  supabase/
    client.ts         # Browser client
    server.ts         # Server client
    types.ts          # Generated DB types
  stripe/
    client.ts
    webhooks.ts
  pricing.ts          # Calculator logic + multipliers
  utils.ts
```

---

## Business Model

- Revenue split: **50/50** (cleaner gets half, CLEENLY gets half)
- Payout system: **MANUAL** (admin enters amount per job, no auto-calculation)
- Payment flow: Customer pays CLEENLY → CLEENLY pays cleaner weekly
- Guest checkout supported (no account required to book)
- 10 service types × 22 cities = 220 product pages

---

## Database Schema (Supabase)

```sql
-- Enums
user_role: admin | customer
booking_status: pending_payment | confirmed | completed | cancelled
payment_method: stripe | venmo | zelle | cash | check | invoice
payment_status: pending | completed | failed | refunded | partial

-- Tables
profiles (id UUID PK = auth.users.id, email, full_name, phone, role, notes, stripe_customer_id)
cleaner_profiles (id UUID PK, full_name, phone, email, photo_url, notes, is_active)
bookings (id, customer_id FK→profiles, cleaner_id FK→cleaner_profiles, service_type, address, city, scheduled_date, time_slot, price_estimate, price_final, status, admin_notes, addons[], special_requests)
payments (id, booking_id FK, amount_paid, method, status, transaction_id, stripe_payment_intent_id)
cleaner_payouts (id, booking_id FK, cleaner_id FK, amount_to_pay, amount_paid, method, transaction_id, notes, paid_at)
cleaner_applications (id, name, email, phone, experience, availability, transportation, city, status)
```

---

## Services (lib/data/services.ts)

| Slug | Name | Tier |
|------|------|------|
| regular-cleaning | Regular Cleaning | Standard |
| deep-cleaning | Deep Cleaning | Standard |
| move-out-cleaning | Move-Out Cleaning | Standard |
| move-in-cleaning | Move-In Cleaning | Standard |
| bi-weekly-service | Bi-Weekly Service | Standard |
| home-organization | Home Organization | Standard |
| pre-event-cleaning | Pre-Event Cleaning | Standard |
| restorative-cleaning | Restorative Cleaning | Standard |
| airbnb-turnover | Airbnb Turnover | Standard |
| post-construction | Post-Construction | Standard |
| damp-season-reset | The Damp-Season Reset | PNW Protocol (signal accent) |
| pollen-purge | The Pollen Purge | PNW Protocol (signal accent) |

PNW Protocol services are climate-specific (`isClimateTier: true`) and render with the Deep Forest signal accent.

---

## Pricing Logic (lib/pricing.ts)

Multipliers:
- bedrooms: 1=0.8x, 2=1.0x, 3=1.15x, 4=1.35x, 5+=1.6x
- bathrooms: 1=0.9x, 2=1.0x, 3=1.15x, 4+=1.3x
- condition: standard=1.0x, needs-extra-work=1.25x

Price calculated client-side, **ALWAYS validated server-side** before charge.

---

## Design System (v2 — premium domestic stewardship)

Source of truth: `~/Downloads/cleenly-design-system-v2.md`. Tokens defined in `app/globals.css @theme` block.

```css
/* Backgrounds */
--color-background:        #FAFAF8;   /* off-white, primary body */
--color-surface-warm:      #F5EFE6;   /* cream-warm section bg */
--color-surface-sand:      #E8E0D2;   /* sand alt section bg */
--color-surface-deep:      #2D2826;   /* charcoal — footer, dark CTAs */

/* Foreground (warm, never pure black) */
--color-foreground:        #2D2826;
--color-foreground-soft:   #4A4540;
--color-foreground-muted:  #8C8073;

/* Accents */
--color-accent:            #D97757;   /* terracotta — primary CTA, brand */
--color-signal:            #2D4A3E;   /* Deep Forest — stewardship, PNW protocol */

/* Warm neutrals (third tier) */
--color-mushroom:          #C9BFB0;
--color-sage:              #B8C2B0;
--color-cedar:             #8C7A65;

/* Greys are warm-shifted (gray-500 = #8C8073, gray-600 = #6B6358, etc.) */
```

**Type stack:**
- `--font-sans`: IBM Plex Sans (body, UI, H2/H3)
- `--font-display`: Instrument Serif (H1, editorial pull-quotes, large stat numbers, climate-tier prices)
- `--font-logo`: OPTIUniversSixtySeven (CLEENLY wordmark only)

**Rules:**
- Every H1 is `font-display` with one short italic phrase (`<em className="italic text-foreground-soft">…</em>`)
- No `text-black` / `text-white` (pure values) — use `text-foreground` / `text-background`
- Radius: prefer `rounded-lg` (16px) for cards/photos, `rounded-md` (10px) for buttons/badges, `rounded-sm` (6px) for form fields
- Shadows: `shadow-soft`/`shadow-card`/`shadow-lift` (charcoal-based, never pure black)
- No emojis in UI · no stock photography · no people in marketing photography · result, not process
- Footer is dark mode (charcoal bg, off-white text, mushroom links)
- PNW Protocol services (Damp-Season Reset, Pollen Purge) carry the Deep Forest signal accent (Eyebrow + check glyphs)

**v2 primitives** (`components/ui/`): `Eyebrow`, `EditorialPullQuote`, `Stat`, `DividerWarm`. Use these instead of ad-hoc inline patterns.

**Forbidden:** electric blue, hospital white, pure black, saturated "eco" green, bright yellow-orange, multiple bright accents on one screen, italic body copy, bold-italic combinations.

---

## Content Rules

**NEVER write:**
- "professional team" / "dedicated professionals"
- "sparkling results" / "spotless clean"
- "we care about your home"
- "quality service" / "exceptional service"
- "trusted by thousands" / "best in class"
- "starting at $X" when real price is higher
- fake urgency ("only 2 slots left")
- "100% satisfaction guaranteed" without actionable guarantee

**ALWAYS write:**
- Short sentences (5-15 words)
- Specific numbers ($140-$180, 2-3 hours)
- Active voice ("We clean" not "Cleaning is provided")
- City-specific details (neighborhoods, housing types, landmarks)
- Concrete guarantees ("not right? we fix it within 24h")

---

## Key Behaviors

1. Touches pricing → validate server-side, never trust client
2. Touches bookings → always write to Supabase
3. New page → add to sitemap.xml and verify meta tags
4. New component → use shadcn/ui primitives
5. Any copy → apply content rules, no marketing language
6. New city/service → update lib/data/*.ts

---

## Commit Style

```
feat: add Stripe payment integration
fix: correct price calculation for 4+ bathrooms
chore: update sitemap with new service pages
content: add Redmond city data
schema: add Service JSON-LD to deep-cleaning pages
```
