# CLEENLY CRM + FINANCE SYSTEM (SIMPLIFIED)
## Complete Implementation Guide — Manual Payroll Version

**Objective:** Build admin dashboard to manage bookings, track payments, and handle cleaner payouts with MANUAL payout amounts (no automatic percentages).

**Tech Stack:** Next.js 15 (App Router), Supabase (PostgreSQL + Auth + RLS), TypeScript, Tailwind v4, Server Actions.

**Timeline:** 2-3 weeks for MVP.

---

## CORE PHILOSOPHY: Manual Control

**What we're building:**
- Track bookings (who, what, when, where)
- Record payments from customers (Stripe, Venmo, Cash, Check)
- YOU decide how much to pay each cleaner manually
- System tracks what you owe and what you've paid
- NO automatic percentage calculations

**Why manual payouts:**
- Different cleaners, different rates
- Can give bonuses for difficult jobs
- Can adjust for job complexity
- Flexibility to negotiate individually
- Simpler to start, add automation later if needed

---

## PHASE 1: DATABASE FOUNDATION (Day 1-2)

### Task 1.1: Run SQL Migration

**File:** `supabase/migrations/001_crm_finance_core.sql`

**Execute in Supabase SQL Editor:**

```sql
-- ============================================
-- CLEENLY CRM + FINANCE SCHEMA
-- Version: 2.0 (Manual Payroll)
-- ============================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TYPE booking_status AS ENUM (
  'pending_payment',
  'confirmed',
  'completed',
  'cancelled'
);

CREATE TYPE payment_method AS ENUM (
  'stripe',
  'venmo',
  'zelle',
  'cash',
  'check',
  'invoice'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded',
  'partial'
);

-- ============================================
-- 2. CORE TABLES
-- ============================================

-- 2.1 PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  
  -- CRM fields
  notes TEXT,
  stripe_customer_id TEXT UNIQUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 CLEANER PROFILES (SIMPLIFIED - no commission rates)
CREATE TABLE IF NOT EXISTS public.cleaner_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic info
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  
  -- Just notes, no business logic fields
  notes TEXT,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Who
  customer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  cleaner_id UUID REFERENCES public.cleaner_profiles(id) ON DELETE SET NULL,
  
  -- What
  service_type TEXT NOT NULL,
  bedrooms INT,
  bathrooms INT,
  square_feet INT,
  
  -- Where
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'WA',
  zip TEXT NOT NULL,
  
  -- When
  scheduled_date DATE NOT NULL,
  scheduled_start TIME,
  scheduled_end TIME,
  estimated_duration NUMERIC(3,1),
  
  -- Status
  status booking_status DEFAULT 'pending_payment',
  
  -- Money
  price_estimated DECIMAL(10,2),
  price_final DECIMAL(10,2) NOT NULL,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 PAYMENTS (money IN from customers)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  
  amount_paid DECIMAL(10,2) NOT NULL,
  
  method payment_method NOT NULL,
  status payment_status DEFAULT 'completed',
  
  -- External references
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  check_number TEXT,
  transaction_id TEXT,
  
  -- Audit trail
  processed_by UUID REFERENCES public.profiles(id),
  processed_at TIMESTAMPTZ,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 CLEANER PAYOUTS (money OUT - MANUAL ENTRY)
CREATE TABLE IF NOT EXISTS public.cleaner_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cleaner_id UUID REFERENCES public.cleaner_profiles(id) ON DELETE RESTRICT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE RESTRICT NOT NULL,
  
  -- YOU manually enter this amount
  amount_to_pay DECIMAL(10,2) NOT NULL,
  
  -- Payment details (filled when you actually pay)
  amount_paid DECIMAL(10,2),
  method TEXT,
  transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 CUSTOMER NOTES
CREATE TABLE IF NOT EXISTS public.customer_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. INDEXES
-- ============================================

CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_cleaner ON public.bookings(cleaner_id);
CREATE INDEX idx_bookings_date ON public.bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

CREATE INDEX idx_payments_booking ON public.payments(booking_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_stripe ON public.payments(stripe_payment_intent_id) 
  WHERE stripe_payment_intent_id IS NOT NULL;

CREATE INDEX idx_payouts_cleaner ON public.cleaner_payouts(cleaner_id);
CREATE INDEX idx_payouts_booking ON public.cleaner_payouts(booking_id);
CREATE INDEX idx_payouts_unpaid ON public.cleaner_payouts(cleaner_id, amount_paid) 
  WHERE amount_paid IS NULL;

CREATE INDEX idx_customer_notes_customer ON public.customer_notes(customer_id);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;

-- ADMIN POLICIES
CREATE POLICY "Admins: full access profiles" 
  ON public.profiles FOR ALL 
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins: full access cleaners" 
  ON public.cleaner_profiles FOR ALL 
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins: full access bookings" 
  ON public.bookings FOR ALL 
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins: full access payments" 
  ON public.payments FOR ALL 
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins: full access payouts" 
  ON public.cleaner_payouts FOR ALL 
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admins: full access notes" 
  ON public.customer_notes FOR ALL 
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- CUSTOMER POLICIES
CREATE POLICY "Customers: read own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Customers: read own bookings" 
  ON public.bookings FOR SELECT 
  USING (customer_id = auth.uid());

CREATE POLICY "Customers: read own payments" 
  ON public.payments FOR SELECT 
  USING (booking_id IN (SELECT id FROM bookings WHERE customer_id = auth.uid()));

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Calculate total paid for a booking
CREATE OR REPLACE FUNCTION get_booking_total_paid(booking_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount_paid), 0)
    FROM payments
    WHERE booking_id = booking_uuid 
      AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql;

-- Calculate cleaner unpaid balance
CREATE OR REPLACE FUNCTION get_cleaner_unpaid_balance(cleaner_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount_to_pay - COALESCE(amount_paid, 0)), 0)
    FROM cleaner_payouts
    WHERE cleaner_id = cleaner_uuid
      AND (amount_paid IS NULL OR amount_paid < amount_to_pay)
  );
END;
$$ LANGUAGE plpgsql;
```

### Task 1.2: Generate TypeScript Types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

**Create `types/index.ts`:**
```typescript
import { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type CleanerProfile = Database['public']['Tables']['cleaner_profiles']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type CleanerPayout = Database['public']['Tables']['cleaner_payouts']['Row'];

export type BookingWithRelations = Booking & {
  customer: Profile;
  cleaner: CleanerProfile | null;
  payments: Payment[];
  payouts: CleanerPayout[];
};

export type PaymentMethod = Database['public']['Enums']['payment_method'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type BookingStatus = Database['public']['Enums']['booking_status'];
```

---

## PHASE 2-3: AUTH & LAYOUT (Day 3-5)

### Middleware, Login, Admin Shell

**These remain the same as original guide** — no changes needed for manual payroll.

Implement:
- `middleware.ts` (protect /admin routes)
- `app/login/page.tsx` (admin login)
- `app/admin/layout.tsx` (sidebar + header)
- `components/admin/sidebar.tsx`

---

## PHASE 4: CORE FEATURES (Day 6-12)

### Task 4.1: Bookings List

**Same as original** — no changes.

### Task 4.2: Record Payment Action (SIMPLIFIED)

**File:** `app/actions/finance.ts`

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function recordPayment({
  bookingId,
  amountPaid,
  method,
  notes,
  transactionId,
  checkNumber,
}: {
  bookingId: string;
  amountPaid: number;
  method: string;
  notes?: string;
  transactionId?: string;
  checkNumber?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Create payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      booking_id: bookingId,
      amount_paid: amountPaid,
      method,
      status: 'completed',
      transaction_id: transactionId,
      check_number: checkNumber,
      notes,
      processed_by: user.id,
      processed_at: new Date().toISOString(),
    });

  if (paymentError) throw paymentError;

  // Get booking total
  const { data: booking } = await supabase
    .from('bookings')
    .select('price_final')
    .eq('id', bookingId)
    .single();

  // Check if booking is now fully paid
  const { data: totalPaid } = await supabase
    .rpc('get_booking_total_paid', { booking_uuid: bookingId });

  if (totalPaid >= booking.price_final) {
    await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/admin/finance');

  return { success: true };
}

// NEW: Create payout with MANUAL amount
export async function createPayout({
  bookingId,
  cleanerId,
  amountToPay,
  notes,
}: {
  bookingId: string;
  cleanerId: string;
  amountToPay: number;
  notes?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cleaner_payouts')
    .insert({
      booking_id: bookingId,
      cleaner_id: cleanerId,
      amount_to_pay: amountToPay,
      notes,
    });

  if (error) throw error;

  revalidatePath('/admin/bookings');
  revalidatePath('/admin/finance');

  return { success: true };
}

// Mark payout as paid
export async function markPayoutPaid({
  payoutId,
  method,
  transactionId,
}: {
  payoutId: string;
  method: string;
  transactionId?: string;
}) {
  const supabase = await createClient();

  // Get payout to know amount
  const { data: payout } = await supabase
    .from('cleaner_payouts')
    .select('amount_to_pay')
    .eq('id', payoutId)
    .single();

  if (!payout) throw new Error('Payout not found');

  const { error } = await supabase
    .from('cleaner_payouts')
    .update({
      amount_paid: payout.amount_to_pay,
      method,
      transaction_id: transactionId,
      paid_at: new Date().toISOString(),
    })
    .eq('id', payoutId);

  if (error) throw error;

  revalidatePath('/admin/finance');
  return { success: true };
}
```

### Task 4.3: Booking Detail Page (WITH MANUAL PAYOUT)

**File:** `app/admin/bookings/[id]/page.tsx`

```typescript
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { RecordPaymentForm } from '@/components/admin/record-payment-form';
import { CreatePayoutForm } from '@/components/admin/create-payout-form';
import { MarkPayoutPaidForm } from '@/components/admin/mark-payout-paid-form';

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:profiles!customer_id(*),
      cleaner:cleaner_profiles(*),
      payments(*),
      payouts:cleaner_payouts(*)
    `)
    .eq('id', params.id)
    .single();

  if (!booking) notFound();

  const totalPaid = booking.payments
    ?.filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount_paid || 0), 0) || 0;

  const payoutExists = booking.payouts && booking.payouts.length > 0;
  const totalToPay = booking.payouts
    ?.reduce((sum, p) => sum + Number(p.amount_to_pay || 0), 0) || 0;
  const totalPaidToCleaner = booking.payouts
    ?.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold">
            Booking #{booking.id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground">
            {new Date(booking.scheduled_date).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Customer & Service Details - same as before */}
      {/* ... */}

      {/* Payment from Customer */}
      <div className="bg-background border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Payment from Customer</h2>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-medium ${
              totalPaid >= booking.price_final 
                ? 'text-green-600' 
                : 'text-yellow-600'
            }`}>
              {totalPaid >= booking.price_final ? '✓ Paid' : '⚠ Pending'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-semibold">
              ${totalPaid} / ${booking.price_final}
            </span>
          </div>
        </div>

        {/* Payment History */}
        {booking.payments && booking.payments.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-sm font-medium">Payment History</p>
            {booking.payments.map((payment) => (
              <div key={payment.id} className="flex justify-between text-sm border-t pt-2">
                <div>
                  <span className="text-muted-foreground">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{payment.method}</span>
                </div>
                <span className="font-medium">${payment.amount_paid}</span>
              </div>
            ))}
          </div>
        )}

        {totalPaid < booking.price_final && (
          <RecordPaymentForm 
            bookingId={booking.id} 
            amountDue={booking.price_final - totalPaid} 
          />
        )}
      </div>

      {/* Cleaner Payout - MANUAL VERSION */}
      {booking.cleaner_id && (
        <div className="bg-background border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Payout to Cleaner</h2>
          
          {!payoutExists ? (
            // No payout set yet - show form to create one
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Customer paid: ${totalPaid}
              </p>
              <p className="text-sm text-muted-foreground">
                No payout set for {booking.cleaner.full_name}
              </p>
              
              <CreatePayoutForm 
                bookingId={booking.id}
                cleanerId={booking.cleaner_id}
                customerPaid={totalPaid}
              />
            </div>
          ) : (
            // Payout exists - show details
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount to Pay</span>
                <span className="font-semibold">${totalToPay}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className={`font-medium ${
                  totalPaidToCleaner >= totalToPay 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
                }`}>
                  ${totalPaidToCleaner}
                </span>
              </div>

              <div className="flex justify-between items-center font-semibold pt-2 border-t">
                <span>Balance</span>
                <span className={
                  totalPaidToCleaner >= totalToPay 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }>
                  ${totalToPay - totalPaidToCleaner}
                </span>
              </div>

              {/* Payout Details */}
              {booking.payouts.map((payout) => (
                <div key={payout.id} className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(payout.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {payout.notes && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Note: </span>
                      <span>{payout.notes}</span>
                    </div>
                  )}

                  {!payout.amount_paid && (
                    <MarkPayoutPaidForm payoutId={payout.id} />
                  )}

                  {payout.amount_paid && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paid via</span>
                        <span className="capitalize">{payout.method}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paid on</span>
                        <span>
                          {new Date(payout.paid_at).toLocaleDateString()}
                        </span>
                      </div>
                      {payout.transaction_id && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Transaction ID</span>
                          <span className="font-mono text-xs">
                            {payout.transaction_id}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending_payment: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded text-sm font-medium ${colors[status] || ''}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
```

### Task 4.4: Create Payout Form Component

**File:** `components/admin/create-payout-form.tsx`

```typescript
'use client';

import { useState } from 'react';
import { createPayout } from '@/app/actions/finance';

export function CreatePayoutForm({
  bookingId,
  cleanerId,
  customerPaid,
}: {
  bookingId: string;
  cleanerId: string;
  customerPaid: number;
}) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createPayout({
        bookingId,
        cleanerId,
        amountToPay: parseFloat(amount),
        notes,
      });

      alert('Payout created successfully');
    } catch (error) {
      alert('Failed to create payout: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Quick suggestion buttons
  const suggestions = [
    { label: '80%', value: customerPaid * 0.8 },
    { label: '85%', value: customerPaid * 0.85 },
    { label: '90%', value: customerPaid * 0.9 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          How much to pay cleaner?
        </label>
        
        {/* Quick buttons */}
        <div className="flex gap-2 mb-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => setAmount(suggestion.value.toFixed(2))}
              className="px-3 py-1 text-sm border rounded hover:bg-muted"
            >
              {suggestion.label} (${suggestion.value.toFixed(2)})
            </button>
          ))}
        </div>

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. 'Standard rate' or 'Bonus for difficult job'"
          className="w-full px-3 py-2 border rounded-lg"
          rows={2}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Payout'}
      </button>
    </form>
  );
}
```

### Task 4.5: Mark Payout Paid Form

**File:** `components/admin/mark-payout-paid-form.tsx`

```typescript
'use client';

import { useState } from 'react';
import { markPayoutPaid } from '@/app/actions/finance';

export function MarkPayoutPaidForm({ payoutId }: { payoutId: string }) {
  const [method, setMethod] = useState('venmo');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await markPayoutPaid({
        payoutId,
        method,
        transactionId: transactionId || undefined,
      });

      alert('Payout marked as paid');
    } catch (error) {
      alert('Failed to mark as paid: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4 p-4 bg-muted rounded-lg">
      <p className="text-sm font-medium">Mark as Paid</p>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="venmo">Venmo</option>
            <option value="zelle">Zelle</option>
            <option value="check">Check</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Transaction ID
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Mark as Paid'}
      </button>
    </form>
  );
}
```

---

## PHASE 5: FINANCE DASHBOARD (Day 13-14)

### Task 5.1: Finance Overview

**File:** `app/admin/finance/page.tsx`

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function FinancePage() {
  const supabase = await createClient();

  // Get unpaid cleaner payouts grouped by cleaner
  const { data: payouts } = await supabase
    .from('cleaner_payouts')
    .select(`
      *,
      cleaner:cleaner_profiles(*),
      booking:bookings(scheduled_date, service_type, price_final)
    `)
    .is('amount_paid', null)
    .order('created_at', { ascending: false });

  // Group by cleaner
  const payoutsByCleanerMap = new Map();
  
  payouts?.forEach(payout => {
    const cleanerId = payout.cleaner_id;
    if (!payoutsByCleanerMap.has(cleanerId)) {
      payoutsByCleanerMap.set(cleanerId, {
        cleaner: payout.cleaner,
        payouts: [],
        totalOwed: 0,
      });
    }
    const entry = payoutsByCleanerMap.get(cleanerId);
    entry.payouts.push(payout);
    entry.totalOwed += Number(payout.amount_to_pay);
  });

  const payoutsByLeaner = Array.from(payoutsByCleanerMap.values());
  const totalOwedToAllCleaners = payoutsByLeaner.reduce(
    (sum, entry) => sum + entry.totalOwed,
    0
  );

  // Get pending customer payments
  const { data: pendingPayments } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:profiles!customer_id(*)
    `)
    .in('status', ['pending_payment'])
    .order('scheduled_date', { ascending: true });

  const totalPendingRevenue = pendingPayments?.reduce(
    (sum, b) => sum + Number(b.price_final),
    0
  ) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Finance</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">
            Pending Customer Payments
          </p>
          <p className="text-3xl font-semibold">
            ${totalPendingRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingPayments?.length || 0} bookings
          </p>
        </div>

        <div className="bg-background border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">
            Owed to Cleaners
          </p>
          <p className="text-3xl font-semibold text-red-600">
            ${totalOwedToAllCleaners.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {payoutsByLeaner.length} cleaners
          </p>
        </div>
      </div>

      {/* Unpaid Cleaners */}
      <div className="bg-background border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Unpaid Cleaner Payouts</h2>
        
        {payoutsByLeaner.length === 0 ? (
          <p className="text-muted-foreground text-sm">All caught up! 🎉</p>
        ) : (
          <div className="space-y-6">
            {payoutsByLeaner.map((entry) => (
              <div key={entry.cleaner.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{entry.cleaner.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.payouts.length} unpaid job{entry.payouts.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-red-600">
                    ${entry.totalOwed.toFixed(2)}
                  </p>
                </div>

                {/* Job Details */}
                <div className="space-y-2">
                  {entry.payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex justify-between text-sm bg-muted p-3 rounded"
                    >
                      <div>
                        <span className="font-medium">
                          {new Date(payout.booking.scheduled_date).toLocaleDateString()}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">
                          {payout.booking.service_type}
                        </span>
                        {payout.notes && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-muted-foreground italic">
                              {payout.notes}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="font-semibold">
                        ${payout.amount_to_pay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Customer Payments */}
      {pendingPayments && pendingPayments.length > 0 && (
        <div className="bg-background border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Pending Customer Payments
          </h2>
          <div className="space-y-3">
            {pendingPayments.map((booking) => (
              <div
                key={booking.id}
                className="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <p className="font-medium">{booking.customer.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.scheduled_date).toLocaleDateString()} • 
                    <span className="capitalize ml-1">{booking.service_type}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${booking.price_final}</p>
                  
                    href={`/admin/bookings/${booking.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## PHASE 6: TESTING & DEPLOYMENT (Day 15-16)

### Testing Checklist

**Manual Payout Workflows:**
- [ ] Create booking, assign cleaner
- [ ] Record customer payment (Stripe)
- [ ] Create payout with custom amount ($150, $170, $200)
- [ ] Mark payout as paid via Venmo
- [ ] Verify balance updates in finance dashboard

**Cash-to-Cleaner Scenario:**
- [ ] Customer pays cleaner $200 cash
- [ ] Record payment: method=cash, notes="paid cleaner directly"
- [ ] Create payout: $0 with note "Already received $200, owes me $30"
- [ ] Verify shows correctly in finance

**Bonus Scenario:**
- [ ] Difficult job, customer paid $300
- [ ] Create payout: $270 (90% instead of usual 85%)
- [ ] Add note: "Bonus for extra work"
- [ ] Mark as paid

### Deploy
```bash
git add .
git commit -m "feat: CRM with manual payroll system"
git push origin main
```

---

## KEY DIFFERENCES FROM AUTO-CALCULATION VERSION

| Feature | Auto Version | Manual Version |
|---------|-------------|----------------|
| Commission rate | Stored in cleaner_profiles (85%) | Not stored |
| Payout creation | Automatic on payment | Manual entry by you |
| Amount calculation | `amount * 0.85` | You type the amount |
| Flexibility | Fixed % per cleaner | Different amount every job |
| Complexity | More SQL, more logic | Simpler schema, simpler code |

---

## FUTURE ENHANCEMENTS (Phase 2)

After 3-6 months of manual payroll:

1. **Add "Suggested Amount" Helper**
   - Show average % you've been paying
   - Quick buttons: "Pay usual $170"

2. **Batch Payout**
   - Select multiple unpaid payouts
   - "Pay all via Venmo" button

3. **Payout Templates**
   - Save common amounts per cleaner
   - "Maria usually gets $170 for regular clean"

4. **Commission Rate (Optional)**
   - Add back to schema IF you want automation
   - But keep manual override always available

---

*Implementation Guide v2.0 - Manual Payroll Edition*