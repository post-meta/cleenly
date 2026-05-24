# 🎨 CLEENLY Design System & UI Components Export

Welcome to the clean, isolated design export of **CLEENLY** (v2 Editorial Magazine / Domestic Stewardship). 

This folder contains the core layout, visual tokens, and React components representing the frontend styling ecosystem. It has been stripped of all heavy server routes, API endpoints, and database handlers to **minimize token usage** while retaining 100% of the UI design fidelity.

---

## 📂 Exported Folder Structure

```
cleenly-design-export/
├── app/
│   └── globals.css              ← Color tokens, fonts, spacing, animations (SOURCE OF TRUTH)
├── components/
│   ├── ui/                      ← Atoms: Button, Card, Input, Select, Checkbox, Container
│   └── booking/                 ← Molecules: Booking Wizard steps, Carousel DatePicker, PriceBar
├── lib/
│   └── utils.ts                 ← Tailwind CSS class merger utility: cn() helper
└── README.md                    ← This guide
```

---

## ⚠️ CRITICAL: Tailwind CSS v4 Theme Architecture

> [!IMPORTANT]
> **No `tailwind.config.ts` exists in this project!** 
> CLEENLY is powered by **Tailwind CSS v4**. In v4, the entire theme, color definitions, fonts, spacing, shadows, animations, and radii are declared directly inside the CSS file using the `@theme` directive.
>
> 📍 **Source of Truth:** All design system tokens are located in [app/globals.css](file:///Users/ekrasnoperov/GITHUB-PROJECT/cleenly-app/cleenly/cleenly-design-export/app/globals.css#L13-L130).

---

## 📜 Key Visual Rules & Design Principles

### 1. Color Palette (Warm & Human)
* **Backgrounds & Surfaces:**
  * `--color-background`: `#FAFAF8` (Soft warm white paper feel)
  * `--color-surface-warm`: `#F5EFE6` (Warm cream/linen)
  * `--color-surface-sand`: `#E8E0D2` (Soft warm sand)
  * `--color-surface-deep`: `#2D2826` (Warm charcoal/damp wood)
* **Accents:**
  * `--color-accent`: `#D97757` (Burnt terracotta/clay) — *Primary CTA button/focus*
  * `--color-signal`: `#2D4A3E` (Deep forest green) — *Stewardship, cleanliness, and ecological reset indicators*
* **Neutrals:**
  * `--color-foreground`: `#2D2826` (Soft warm black, never pure `#000000`)
  * `--color-foreground-soft`: `#4A4540` (Slate charcoal for subheadings)

### 2. Typography & Editorial Hierarchy
* **Sans-Serif (Body & Inputs):** `"IBM Plex Sans"`, system-ui, sans-serif
* **Display Serif (Luxury Accent):** `"Instrument Serif"`, Georgia, serif
  * ⚠️ **RULE:** Always render serif display headings with `font-normal` (weight `400`). **Never apply bold weights** (`font-bold`, `font-semibold`) to display serif text as it degrades visual typography!
  * ✍️ **Italic Emphasize:** To capture the luxury magazine feel, nest `em` elements inside display headings:
    `Our <em className="italic text-foreground-soft font-display font-normal">Service Areas</em>`

### 3. Borders, Radii, and Shadows
* **Hairline Borders:** Sections are separated by fine, semi-transparent warm borders: `border border-border/60` or `border-t border-b border-border/40` (`#DDD5C7`).
* **Radius Hierarchy:**
  * `rounded-sm` (`6px`): Inputs, select fields, checkboxes.
  * `rounded-md` (`10px`): Main buttons (`h-11`).
  * `rounded-lg` (`16px`): Content grids, region cards.
  * `rounded-xl` (`24px`): Interactive booking steps, containers.
* **Charcoal Shadows (Never Pure Black):**
  * `shadow-soft` (passive): `0 1px 2px rgba(45, 40, 38, 0.04), 0 4px 12px rgba(45, 40, 38, 0.04)`
  * `shadow-lift` (active/hover): `0 4px 8px rgba(45, 40, 38, 0.08), 0 16px 40px rgba(45, 40, 38, 0.08)`

---

## 🛠️ Key Component Guides

* **[components/ui/button.tsx](file:///Users/ekrasnoperov/GITHUB-PROJECT/cleenly-app/cleenly/cleenly-design-export/components/ui/button.tsx):** Uses strict height constraints and flexible flex-centering. Standard action height is `h-11` with `rounded-md` (10px).
* **[components/booking/steps/step-schedule.tsx](file:///Users/ekrasnoperov/GITHUB-PROJECT/cleenly-app/cleenly/components/booking/steps/step-schedule.tsx):** Features a horizontally-scrollable, swipeable mobile date carousel with robust `52x64px` touch targets (Fitts' Law) instead of cluttered desktop grids.
* **[components/booking/sticky-price-footer.tsx](file:///Users/ekrasnoperov/GITHUB-PROJECT/cleenly-app/cleenly/components/booking/sticky-price-footer.tsx):** Implements dynamic Safe Area padding calculations (`pb-[calc(1rem+env(safe-area-inset-bottom))]`) to raise sticky mobile buttons perfectly above the iOS Home Indicator gesture bar.
