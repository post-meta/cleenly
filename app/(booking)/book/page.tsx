import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { BookingWizard } from "@/components/booking";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import type { SavedAddress } from "@/types";

export const metadata: Metadata = {
  title: "Book Premium House Cleaning | CLEENLY",
  description:
    "See your price online and pick a convenient time slot in 2 minutes. Transparent local rates in Seattle.",
  alternates: {
    canonical: "https://cleenly.app/book",
  },
};

function BookingWizardFallback() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-8 bg-muted rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-muted rounded-xl"></div>
        <div className="h-24 bg-muted rounded-xl"></div>
        <div className="h-24 bg-muted rounded-xl"></div>
      </div>
      <div className="h-12 bg-muted rounded-xl w-full"></div>
    </div>
  );
}

export default async function BookPage() {
  // Logged-in customers get their saved addresses + contact prefilled.
  const session = await auth();
  const uid = (session?.user as { id?: string } | undefined)?.id;

  let savedAddresses: SavedAddress[] = [];
  let defaultContact: { name?: string; email?: string; phone?: string } | undefined;

  if (uid) {
    const [addrRes, userRes] = await Promise.all([
      supabase
        .from("addresses")
        .select("id, label, street_address, unit, city, state, zip_code, special_instructions, is_default")
        .eq("user_id", uid)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("users").select("name, email, phone").eq("id", uid).single(),
    ]);
    savedAddresses = (addrRes.data as SavedAddress[]) || [];
    if (userRes.data) {
      defaultContact = {
        name: userRes.data.name || undefined,
        email: userRes.data.email || undefined,
        phone: userRes.data.phone || undefined,
      };
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <Container size="narrow">
          <div className="mb-10 text-center">
            <h1 className="font-display font-normal text-[36px] md:text-[48px] tracking-tight text-foreground">
              Book Your <em className="italic text-foreground-soft font-display">Service</em>
            </h1>
            <p className="mt-3 text-base text-foreground-muted">
              See your precise, transparent estimate online. Select your parameters below and request a slot in 2 minutes.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-border shadow-soft p-6 md:p-10">
            <Suspense fallback={<BookingWizardFallback />}>
              <BookingWizard savedAddresses={savedAddresses} defaultContact={defaultContact} />
            </Suspense>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
