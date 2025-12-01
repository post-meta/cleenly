# CLEENLY — Project Brief for Claude Code

## PROJECT OVERVIEW

CLEENLY — a home cleaning booking platform for the Greater Seattle area (Seattle, Bellevue, Redmond, Kirkland, Tacoma, Everett, etc.). Two-sided marketplace: customers find cleaners, cleaning services get bookings.

**Tagline:** "We clean. You live."

**Philosophy:** No marketing fluff. Speak plainly, like explaining to a friend. Clear but not generic. No: "professional team", "sparkling results", "we care", "dedicated", "passionate".

-----

## TECH STACK

### Core

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel

### Additional

- **UI components:** shadcn/ui (install as needed)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod for validation
- **Animations:** Framer Motion (minimal, only where needed)
- **Fonts:** Google Fonts — Inter (primary)

### Do NOT use

- Styled-components
- Material UI
- Bootstrap
- Any heavy UI libraries

-----

## PROJECT STRUCTURE

```
cleenly/
├── app/
│   ├── (marketing)/          # Public pages
│   │   ├── page.tsx          # Landing page
│   │   ├── how-it-works/
│   │   ├── pricing/
│   │   └── about/
│   ├── (booking)/            # Booking flow
│   │   ├── book/
│   │   └── cleaners/
│   ├── (dashboard)/          # Dashboard (later)
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn components
│   ├── marketing/            # Landing components
│   ├── booking/              # Booking components
│   └── shared/               # Shared components
├── lib/
│   ├── supabase/
│   ├── utils.ts
│   └── constants.ts
├── types/
├── hooks/
└── public/
    └── images/
```

-----

## DESIGN SYSTEM

### Color Palette

```css
/* Primary */
--background: #FFFFFF
--foreground: #0A0A0A
--muted: #F5F5F5
--muted-foreground: #737373

/* Accents */
--primary: #0A0A0A          /* Black — primary buttons */
--primary-foreground: #FFFFFF
--secondary: #F5F5F5        /* Light gray — secondary elements */

/* Status */
--success: #22C55E
--warning: #F59E0B
--error: #EF4444

/* Borders */
--border: #E5E5E5
--border-hover: #D4D4D4
```

### Typography

```css
/* Headings */
h1: 48px/52px, font-weight: 600, letter-spacing: -0.02em
h2: 36px/40px, font-weight: 600, letter-spacing: -0.01em
h3: 24px/32px, font-weight: 600
h4: 20px/28px, font-weight: 500

/* Text */
body: 16px/24px, font-weight: 400
small: 14px/20px
caption: 12px/16px

/* Font */
font-family: 'Inter', system-ui, sans-serif
```

### Spacing & Grid

```css
/* Spacing scale */
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

/* Container */
max-width: 1200px
padding-x: 24px (mobile: 16px)

/* Border radius */
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-full: 9999px
```

### Buttons

```
Primary: black bg, white text, hover: #262626
Secondary: white bg, black border, hover: #F5F5F5
Ghost: no bg, hover: #F5F5F5

Sizes:
- sm: h-9, px-3, text-sm
- md: h-11, px-6, text-base
- lg: h-14, px-8, text-lg

All buttons: font-medium, rounded-lg, transition-colors
```

### Cards

```
background: white
border: 1px solid var(--border)
border-radius: var(--radius-lg)
padding: 24px
hover: border-color var(--border-hover), subtle shadow

No gradients, no shadows by default
```

-----

## CONTENT & COPYWRITING

### Tone of Voice

- Direct, no fluff
- Like talking to a friend who knows the industry
- DO NOT use: "professional team", "quality service", "personalized approach", "sparkling", "dedicated", "passionate", "we care"
- DO use: simple verbs, specifics, numbers where relevant

### Key Messages for Landing Page

**Hero Section:**

```
Headline: "We clean. You live."
Subheadline: "Home cleaning in Greater Seattle. See pricing, pick a time, book online."
CTA: "Get an estimate"
```

**How It Works:**

```
1. "Tell us about your place" — Home type, bedrooms, bathrooms, what needs cleaning
2. "Get your price" — Price range instantly. Final quote after quick details
3. "Pick a time" — Choose what works. Confirmation within 2 hours
4. "Done" — Cleaner arrives on time. Something off? We'll fix it
```

**Why CLEENLY:**

```
- "Upfront pricing" — Calculator shows range right away. No "starting from" games
- "Vetted cleaners" — Every cleaner has reviews and job history
- "We'll make it right" — Issue with the clean? We come back and fix it. No runaround
```

**DO NOT use:**

- "100% satisfaction guaranteed" (vague)
- "Best service in Seattle" (empty)
- "Team of professionals" (cliché)
- "Trust us" (cringe)
- "Sparkling results" (every cleaner says this)
- "We care about your home" (meaningless)

-----

## MVP SCOPE — Phase 1

### Pages for First Version

1. **Landing Page** `/`
- Hero with CTA to calculator
- How it works (3-4 steps)
- Service types (regular, deep clean, move-out)
- Pricing preview
- FAQ
- Footer

2. **Calculator / Booking Start** `/book`
- Service type selection
- Home parameters (beds, baths, sqft optional)
- Price range display
- Date/time picker
- Contact details (email, phone)
- (No payment for now — booking goes to Supabase)

3. **About** `/about`
- Short story: why we built this
- Our principles (3-4 points)
- Contact

4. **Pricing** `/pricing`
- Price table by service type
- What's included in each type
- Link to calculator

### Components for MVP

```
Header (navigation)
Footer
Button (variants: primary, secondary, ghost)
Card
Input
Select
Calculator form
PriceDisplay
ServiceCard
StepIndicator
FAQ accordion
```

-----

## DATABASE (Supabase)

### Tables for MVP

```sql
-- Booking requests
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contact
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,

  -- Parameters
  service_type TEXT NOT NULL, -- 'regular', 'deep', 'move_out'
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  sqft INT,

  -- Address
  address TEXT,
  city TEXT DEFAULT 'Seattle',
  zip TEXT,

  -- Time
  preferred_date DATE,
  preferred_time TEXT, -- 'morning', 'afternoon', 'evening'

  -- Price
  estimated_min INT, -- in cents
  estimated_max INT,

  -- Status
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'confirmed', 'completed', 'cancelled'
  notes TEXT
);

-- Later: cleaners, users, reviews
```

-----

## WORKFLOW FOR CLAUDE CODE

### Work Principles

1. **Commit immediately after significant changes**
- Created new page → commit + push
- Added component → commit + push
- Configured something → commit + push
- Don't accumulate changes

2. **Commit Format**

```
feat: add landing page hero section
feat: create price calculator component
fix: mobile navigation overflow
style: update button hover states
chore: configure Supabase client
```

3. **Order of Work**
- First: structure and configs
- Then: base components (ui)
- Then: pages
- Then: integrations (Supabase)

-----

## CODE EXAMPLES

### Button Component

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background hover:bg-foreground/90",
        secondary: "border border-border bg-background hover:bg-muted",
        ghost: "hover:bg-muted",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Hero Section

```tsx
// components/marketing/hero.tsx
export function Hero() {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            We clean. You live.
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Home cleaning in Greater Seattle. See pricing, pick a time, book online.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg">Get an estimate</Button>
            <Button variant="secondary" size="lg">How it works</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### Price Calculator Logic

```tsx
// lib/pricing.ts
export const PRICING = {
  regular: {
    base: 8000, // $80 in cents
    perBedroom: 2000, // $20
    perBathroom: 1500, // $15
  },
  deep: {
    base: 15000,
    perBedroom: 3000,
    perBathroom: 2500,
  },
  move_out: {
    base: 20000,
    perBedroom: 3500,
    perBathroom: 3000,
  },
}

export function calculatePrice(
  serviceType: keyof typeof PRICING,
  bedrooms: number,
  bathrooms: number
): { min: number; max: number } {
  const pricing = PRICING[serviceType]
  const base = pricing.base +
    (bedrooms * pricing.perBedroom) +
    (bathrooms * pricing.perBathroom)

  return {
    min: base,
    max: Math.round(base * 1.2), // 20% buffer for condition
  }
}
```

-----

## IMPORTANT NOTES

1. **Language:** English only. Target audience is Greater Seattle area.
2. **Mobile first:** All components mobile-first, then scale up.
3. **Performance:**
- Use next/image for images
- Minimize client components
- Server Components where possible
4. **Accessibility:**
- All interactive elements with focus states
- Semantic HTML
- aria-labels where needed
5. **SEO:**
- Metadata for each page
- Open Graph tags
- Proper heading structure
- Local SEO keywords: "house cleaning Seattle", "cleaning service Bellevue", "maid service Redmond", etc.

-----

## SERVICE AREA

Greater Seattle includes:
- Seattle (all neighborhoods)
- Bellevue
- Redmond
- Kirkland
- Renton
- Bothell
- Everett
- Tacoma
- Kent
- Federal Way
- Sammamish
- Issaquah
- Mercer Island
- Woodinville
- Lynnwood
