# CLEENLY — CLAUDE.md

Cleaning booking platform, Greater Seattle. Family business (Eugene + wife).
CLEENLY is a cleaning COMPANY, not a marketplace. Customers book "CLEENLY", not individual cleaners.
Production: https://cleenly.app · Supabase project: `hspmtqlnrmomatmzklnh`

---

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript strict)
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

| Slug | Name | Rate |
|------|------|------|
| regular-cleaning | Regular Cleaning | $50/hr |
| deep-cleaning | Deep Cleaning | $60/hr |
| move-out-cleaning | Move-Out Cleaning | $60/hr |
| move-in-cleaning | Move-In Cleaning | $60/hr |
| bi-weekly-service | Bi-Weekly Service | $50/hr |
| home-organization | Home Organization | $50/hr |
| pre-event-cleaning | Pre-Event Cleaning | $50/hr |
| post-emergency | Post-Emergency | $60/hr |
| airbnb-turnover | Airbnb Turnover | $50/hr |
| post-construction | Post-Construction | $60/hr |

---

## Pricing Logic (lib/pricing.ts)

Multipliers:
- bedrooms: 1=0.8x, 2=1.0x, 3=1.15x, 4=1.35x, 5+=1.6x
- bathrooms: 1=0.9x, 2=1.0x, 3=1.15x, 4+=1.3x
- condition: standard=1.0x, needs-extra-work=1.25x

Price calculated client-side, **ALWAYS validated server-side** before charge.

---

## Design System

```css
--background: #FFFFFF
--foreground: #0A0A0A
--muted: #F5F5F5
--muted-foreground: #6B7280
--border: #E5E5E5
--primary: #0A0A0A
--primary-foreground: #FFFFFF
/* Accent (CTA only): #D97757 (terracotta orange) */
```

**Rules:**
- Font: Inter (next/font)
- Max content width: 800px centered
- No gradients, no shadows on cards (use border)
- Buttons: black fill + white text (primary), white fill + black border (outline)
- Terracotta orange for main CTA only
- No emojis in UI
- No stock photography
- Page rhythm: alternate white and #F5F5F5 sections
- Reference page: "How It Works" = canonical design template

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
