# CLEENLY — BOOK PAGE (Calculator + Booking Flow)

## Technical Specification

### URL
`/book`

### Purpose
Main conversion point. User enters home parameters, gets price, selects time, provides contact info. Minimum friction.

---

## SEO OPTIMIZATION

### Title Tag
```
Book House Cleaning Seattle | Get Price in 30 Seconds | CLEENLY
```

### Meta Description
```
Book house cleaning in Seattle. Enter your home details, see your price instantly, pick a time. No account required. Takes 2 minutes.
```

### H1
```
Book Your Cleaning
```

### Target Keywords
**Primary:**
- book cleaning seattle
- schedule house cleaning seattle
- cleaning appointment seattle

**Long-tail:**
- book house cleaning online seattle
- schedule cleaning service near me
- get cleaning quote seattle

---

## BOOKING FLOW STEPS

```
Step 1: Service Type
Step 2: Home Details
Step 3: Your Price
Step 4: Date & Time
Step 5: Contact Info
Step 6: Confirmation
```

---

## STEP DETAILS

### Step 1: Service Type
- Regular Cleaning (from $80)
- Deep Cleaning (from $140)
- Move-Out Cleaning (from $150)

### Step 2: Home Details
- Bedrooms (Studio, 1-5+)
- Bathrooms (1-3.5+)
- Approximate size (optional)
- Home condition
- Special requests

### Step 3: Price Display
- Shows calculated price range
- Includes what's covered
- Optional add-ons (fridge, oven, cabinets, laundry, windows)
- Estimated duration

### Step 4: Schedule
- Date picker (next 14 days)
- Time slots: Morning, Afternoon, Evening

### Step 5: Contact
- Name, Email, Phone (required)
- Service address (required)
- Access instructions (optional)

### Step 6: Confirmation
- Booking reference
- Summary of booking
- What happens next

---

## PRICE CALCULATION

Base prices by service type and bedroom count (in cents):

### Regular Cleaning
- Studio: $80
- 1 bed: $100
- 2 bed: $120
- 3 bed: $140
- 4 bed: $180
- 5+ bed: $220

### Deep Cleaning
- Studio: $140
- 1 bed: $160
- 2 bed: $200
- 3 bed: $240
- 4 bed: $300
- 5+ bed: $380

### Move-Out Cleaning
- Studio: $150
- 1 bed: $180
- 2 bed: $250
- 3 bed: $320
- 4 bed: $400
- 5+ bed: $500

### Multipliers
- Bathroom multiplier: 1.0 to 1.35
- Condition multiplier: 1.0 (clean) to 1.25 (needs work)
- Range: Base to Base * 1.2

### Add-ons
- Inside refrigerator: +$25
- Inside oven: +$20
- Inside cabinets: +$30
- Laundry: +$25/load
- Interior windows: +$5/window

---

## JSON-LD SCHEMA

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Book House Cleaning Seattle",
  "mainEntity": {
    "@type": "Service",
    "name": "House Cleaning Booking",
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://cleenly.com/book"
      }
    }
  }
}
```

---

## IMPLEMENTATION

### Components Created
- `BookingWizard` - Main multi-step form controller
- `StepIndicator` - Progress indicator
- `StepService` - Service type selection cards
- `StepDetails` - Home details form
- `StepPrice` - Price display with add-ons
- `StepSchedule` - Date and time picker
- `StepContact` - Contact information form
- `StepConfirmation` - Booking confirmation

### Files
- `app/(booking)/book/page.tsx`
- `components/booking/booking-wizard.tsx`
- `components/booking/step-indicator.tsx`
- `components/booking/steps/*.tsx`
- `lib/pricing.ts` - Price calculation logic
- `types/index.ts` - Updated type definitions
