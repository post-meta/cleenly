# Cleenly

Cleaning services booking platform for Greater Seattle area.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.local.example .env.local
```

4. Add your Supabase credentials to `.env.local`

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
cleenly/
├── app/
│   ├── (marketing)/     # Public pages (home, about, pricing)
│   ├── (booking)/       # Booking flow
│   └── api/             # API routes
├── components/
│   ├── ui/              # Base UI components
│   ├── marketing/       # Landing page sections
│   ├── booking/         # Booking form components
│   └── shared/          # Header, Footer
├── lib/                 # Utilities, constants, Supabase client
└── types/               # TypeScript types
```

## Database Setup

Create a `bookings` table in Supabase:

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  service_type TEXT NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  sqft INT,
  address TEXT,
  city TEXT DEFAULT 'Seattle',
  zip TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  estimated_min INT,
  estimated_max INT,
  status TEXT DEFAULT 'new',
  notes TEXT
);
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to add environment variables in Vercel dashboard.
