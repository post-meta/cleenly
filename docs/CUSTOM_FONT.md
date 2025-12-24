# Custom Font Integration - OPTIUniversSixtySeven

## Overview
The custom font **OPTIUniversSixtySeven** has been integrated into the Cleenly project for use in logos and large headings to create a distinctive brand identity.

## File Location
- **Font file**: `/public/fonts/OPTIUniversSixtySeven.otf`
- **CSS definition**: `/app/globals.css`

## CSS Variables
Two CSS variables have been created for font usage:

```css
--font-sans: "IBM Plex Sans", system-ui, -apple-system, sans-serif;
--font-display: "OPTIUniversSixtySeven", "IBM Plex Sans", system-ui, sans-serif;
```

## Utility Classes

### `.font-display`
Applies the display font family.

```tsx
<h1 className="font-display">Your Heading</h1>
```

### `.text-logo`
Applies the display font with optimized letter-spacing for logo usage.

```tsx
<Link href="/" className="text-logo">CLEENLY</Link>
```

## Usage Examples

### Logo in Header
```tsx
<Link href="/" className="text-xl text-logo text-foreground">
  CLEENLY
</Link>
```

### Large Headings (Hero Section)
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground">
  House Cleaning in Seattle
</h1>
```

### Section Headings
```tsx
<h2 className="font-display">Why CLEENLY</h2>
```

## Where It's Applied

1. **Marketing Header** (`components/shared/header.tsx`)
   - Desktop logo
   - Mobile menu logo

2. **Dashboard Header** (`components/dashboard/header.tsx`)
   - Logo link

3. **Hero Section** (`components/marketing/hero.tsx`)
   - Main H1 heading

4. **Footer** (`components/shared/footer.tsx`)
   - Company name/logo

## Best Practices

1. **Use for branding**: Apply to all instances of "CLEENLY" logo
2. **Use for impact**: Apply to large headings (H1, H2) on marketing pages
3. **Don't overuse**: Keep body text and smaller headings in IBM Plex Sans
4. **Maintain hierarchy**: Use `font-display` for primary headings, `font-sans` for everything else

## Font Loading
The font uses `font-display: swap` to ensure text remains visible during font loading, preventing FOIT (Flash of Invisible Text).
