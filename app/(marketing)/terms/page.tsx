import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Terms of Service | CLEENLY",
  description:
    "CLEENLY terms of service. Booking rules, cancellation policy, refunds, and user responsibilities for house cleaning services in Seattle.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://cleenly.com/terms",
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service",
  description:
    "CLEENLY terms of service, cancellation policy, and booking rules",
  url: "https://cleenly.com/terms",
  dateModified: "2025-12-01",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://cleenly.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Terms of Service",
      item: "https://cleenly.com/terms",
    },
  ],
};

const sections = [
  { id: "introduction", title: "Introduction and Acceptance" },
  { id: "service", title: "Description of Service" },
  { id: "eligibility", title: "User Eligibility" },
  { id: "account", title: "Account Registration" },
  { id: "booking", title: "Booking and Service" },
  { id: "cancellation", title: "Cancellation Policy", important: true },
  { id: "rescheduling", title: "Rescheduling Policy" },
  { id: "payment", title: "Payment Terms", important: true },
  { id: "refunds", title: "Refund Policy", important: true },
  { id: "guarantee", title: "Service Guarantee", important: true },
  { id: "responsibilities", title: "User Responsibilities" },
  { id: "damage", title: "Damage and Liability" },
  { id: "contractor", title: "Independent Contractor Relationship" },
  { id: "ip", title: "Intellectual Property" },
  { id: "prohibited", title: "Prohibited Conduct" },
  { id: "disputes", title: "Dispute Resolution" },
  { id: "governing-law", title: "Governing Law" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "termination", title: "Termination" },
  { id: "general", title: "General Provisions" },
];

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd data={pageSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="py-12 md:py-16">
        <Container size="narrow">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Terms of Service</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">Terms of Service</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last Updated: December 2025
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-8 flex flex-wrap gap-2">
            <a
              href="#cancellation"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
            >
              Cancellation Policy
            </a>
            <a
              href="#refunds"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
            >
              Refund Policy
            </a>
            <a
              href="#guarantee"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
            >
              Service Guarantee
            </a>
            <a
              href="#payment"
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
            >
              Payment Terms
            </a>
          </div>

          {/* Table of Contents */}
          <nav className="mb-12 rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="mb-4 font-semibold">Table of Contents</h2>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={
                      section.important
                        ? "font-medium text-foreground hover:underline"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {index + 1}. {section.title}
                    {section.important && " ★"}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="prose prose-neutral max-w-none space-y-12">
            {/* 1. Introduction */}
            <section id="introduction">
              <h2 className="text-xl font-semibold">
                1. Introduction and Acceptance
              </h2>
              <p className="mt-4 text-muted-foreground">
                Welcome to CLEENLY. These Terms of Service (&quot;Terms&quot;)
                govern your use of the CLEENLY website (cleenly.com) and
                services. CLEENLY is a platform that connects customers with
                independent cleaning professionals in the Seattle area.
              </p>
              <p className="mt-4 text-muted-foreground">
                By using CLEENLY, you agree to these Terms. If you do not agree,
                please do not use our services.
              </p>
              <p className="mt-4 text-muted-foreground">
                CLEENLY reserves the right to modify these Terms at any time. We
                will notify you of significant changes by email or by posting a
                notice on our website. Your continued use of CLEENLY after
                changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* 2. Description of Service */}
            <section id="service">
              <h2 className="text-xl font-semibold">2. Description of Service</h2>
              <p className="mt-4 text-muted-foreground">
                CLEENLY operates a marketplace platform that:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Allows customers to book house cleaning services</li>
                <li>
                  Connects customers with vetted, independent cleaning
                  professionals
                </li>
                <li>Facilitates scheduling, payment, and communication</li>
                <li>Provides customer support for booking-related issues</li>
              </ul>
              <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                <p className="font-medium">Important</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  CLEENLY is a platform, not a cleaning company. Cleaners on our
                  platform are independent contractors, not CLEENLY employees.
                  CLEENLY facilitates the connection and transaction but does not
                  directly employ the cleaners or supervise their work.
                </p>
              </div>
            </section>

            {/* 3. User Eligibility */}
            <section id="eligibility">
              <h2 className="text-xl font-semibold">3. User Eligibility</h2>
              <p className="mt-4 text-muted-foreground">
                To use CLEENLY, you must:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Be at least 18 years old</li>
                <li>
                  Have the legal authority to enter into a binding agreement
                </li>
                <li>Provide accurate and complete information</li>
                <li>Have a valid payment method</li>
                <li>
                  Have the right to authorize access to the service address
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                CLEENLY services are currently available only in the Seattle
                metropolitan area and surrounding cities in Washington State.
              </p>
            </section>

            {/* 4. Account Registration */}
            <section id="account">
              <h2 className="text-xl font-semibold">4. Account Registration</h2>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">Account Creation:</strong>{" "}
                Creating an account is optional for booking but required for
                managing recurring appointments and preferences.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">Account Security:</strong>{" "}
                You are responsible for maintaining the confidentiality of your
                account credentials. Notify us immediately if you suspect
                unauthorized access.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">
                  Accurate Information:
                </strong>{" "}
                You agree to provide accurate, current, and complete information.
                CLEENLY may suspend or terminate accounts with false information.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">One Account:</strong> Each
                person may have only one CLEENLY account. Duplicate accounts may
                be terminated.
              </p>
            </section>

            {/* 5. Booking and Service */}
            <section id="booking">
              <h2 className="text-xl font-semibold">5. Booking and Service</h2>
              <h3 className="mt-6 font-medium">Booking Process</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-muted-foreground">
                <li>
                  You select the type of cleaning service, provide home details,
                  and choose a date/time
                </li>
                <li>
                  CLEENLY provides a price estimate based on information you
                  provide
                </li>
                <li>
                  You confirm the booking and provide payment information
                </li>
                <li>CLEENLY matches you with an available cleaner</li>
                <li>
                  You receive confirmation with cleaner details and final price
                </li>
              </ol>

              <h3 className="mt-6 font-medium">Price Estimates</h3>
              <p className="mt-2 text-muted-foreground">
                Prices shown during booking are estimates based on information
                you provide. Final price may vary if:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  Home size or condition differs significantly from description
                </li>
                <li>Additional services are requested on-site</li>
                <li>Access issues cause delays</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                You will be notified of any price changes before being charged.
              </p>

              <h3 className="mt-6 font-medium">Service Address & Access</h3>
              <p className="mt-2 text-muted-foreground">
                You must provide accurate address and access instructions.
                CLEENLY is not responsible for delays or failed appointments due
                to incorrect information. If access is not provided and the
                cleaner cannot enter, cancellation fees may apply.
              </p>
            </section>

            {/* 6. Cancellation Policy */}
            <section id="cancellation">
              <h2 className="text-xl font-semibold">
                6. Cancellation Policy
                <span className="ml-2 rounded bg-foreground px-2 py-1 text-xs text-background">
                  IMPORTANT
                </span>
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-success/50 bg-success/10 p-4">
                  <p className="font-medium text-success">
                    More than 24 hours before appointment
                  </p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>✓ Full refund</li>
                    <li>✓ No cancellation fee</li>
                    <li>✓ Cancel online or email hello@cleenly.com</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-warning/50 bg-warning/10 p-4">
                  <p className="font-medium text-warning">
                    12-24 hours before appointment
                  </p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>• 50% cancellation fee may apply</li>
                    <li>• Remaining 50% refunded</li>
                    <li>• This compensates the cleaner who reserved time</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-error/50 bg-error/10 p-4">
                  <p className="font-medium text-error">
                    Less than 12 hours before appointment
                  </p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>• Full charge may apply</li>
                    <li>• No refund</li>
                    <li>• Cleaner has already committed their time</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-error/50 bg-error/10 p-4">
                  <p className="font-medium text-error">No-Show</p>
                  <ul className="mt-2 text-sm text-muted-foreground">
                    <li>• Full charge applies</li>
                    <li>• No refund</li>
                  </ul>
                </div>
              </div>

              <h3 className="mt-6 font-medium">How to Cancel</h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Use the cancellation link in your confirmation email</li>
                <li>
                  Email{" "}
                  <a
                    href="mailto:hello@cleenly.com"
                    className="text-foreground underline"
                  >
                    hello@cleenly.com
                  </a>{" "}
                  with your booking reference
                </li>
                <li>Log into your account and cancel from booking history</li>
              </ul>

              <h3 className="mt-6 font-medium">Exceptions</h3>
              <p className="mt-2 text-muted-foreground">
                We understand emergencies happen. If you have an emergency
                (medical, family, etc.), contact us and we will review your
                situation individually. Repeat emergency cancellations may be
                evaluated.
              </p>

              <h3 className="mt-6 font-medium">CLEENLY Cancellations</h3>
              <p className="mt-2 text-muted-foreground">
                In rare cases, CLEENLY may need to cancel your booking (cleaner
                illness, emergency, etc.). If this happens, you receive a full
                refund, we will attempt to reschedule or find an alternative
                cleaner, and we will notify you as soon as possible.
              </p>
            </section>

            {/* 7. Rescheduling Policy */}
            <section id="rescheduling">
              <h2 className="text-xl font-semibold">7. Rescheduling Policy</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    More than 24 hours before:
                  </strong>{" "}
                  Free rescheduling, subject to availability
                </li>
                <li>
                  <strong className="text-foreground">
                    Less than 24 hours before:
                  </strong>{" "}
                  Treated as cancellation + new booking, cancellation fees may
                  apply
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Reschedule via the link in your confirmation email, your account,
                or by emailing hello@cleenly.com.
              </p>
            </section>

            {/* 8. Payment Terms */}
            <section id="payment">
              <h2 className="text-xl font-semibold">
                8. Payment Terms
                <span className="ml-2 rounded bg-foreground px-2 py-1 text-xs text-background">
                  IMPORTANT
                </span>
              </h2>
              <ul className="mt-4 space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Payment Method:</strong> We
                  accept major credit cards, debit cards, Apple Pay, and Google
                  Pay. Payment is processed securely through Stripe.
                </li>
                <li>
                  <strong className="text-foreground">Authorization:</strong>{" "}
                  Your payment method is authorized when you book. You are not
                  charged until after the cleaning is completed.
                </li>
                <li>
                  <strong className="text-foreground">Final Charge:</strong> The
                  final charge is processed within 24 hours of service
                  completion. It may differ from the estimate if service scope
                  changed, home conditions required extra time, or you approved
                  additional charges.
                </li>
                <li>
                  <strong className="text-foreground">Declined Payment:</strong>{" "}
                  If your payment method is declined, you must provide a valid
                  alternative within 48 hours or your booking may be cancelled.
                </li>
                <li>
                  <strong className="text-foreground">Tips:</strong> Tips are
                  optional but appreciated. You can tip in cash or through the
                  platform after service completion. 100% of tips go to the
                  cleaner.
                </li>
                <li>
                  <strong className="text-foreground">Disputes:</strong> If you
                  believe a charge is incorrect, contact hello@cleenly.com within
                  7 days. We will review and resolve the issue.
                </li>
              </ul>
            </section>

            {/* 9. Refund Policy */}
            <section id="refunds">
              <h2 className="text-xl font-semibold">
                9. Refund Policy
                <span className="ml-2 rounded bg-foreground px-2 py-1 text-xs text-background">
                  IMPORTANT
                </span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">
                  Refunds for Cancellations:
                </strong>{" "}
                See Cancellation Policy above.
              </p>

              <h3 className="mt-6 font-medium">Refunds for Service Issues</h3>
              <p className="mt-2 text-muted-foreground">
                If you are not satisfied with your cleaning:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-muted-foreground">
                <li>Contact us within 24 hours of service completion</li>
                <li>Describe the specific issues</li>
                <li>Provide photos if applicable</li>
              </ol>

              <h3 className="mt-6 font-medium">Our Resolution Process</h3>
              <ul className="mt-3 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    First Option — Re-Clean:
                  </strong>{" "}
                  We will send a cleaner to address the specific issues at no
                  additional charge. This is our preferred resolution.
                </li>
                <li>
                  <strong className="text-foreground">
                    Second Option — Partial Refund:
                  </strong>{" "}
                  If a re-clean doesn&apos;t resolve the issue or isn&apos;t
                  practical, we may offer a partial refund proportional to the
                  unsatisfactory portion of the service.
                </li>
                <li>
                  <strong className="text-foreground">
                    Third Option — Full Refund:
                  </strong>{" "}
                  In rare cases of significant service failure, we may offer a
                  full refund. This is evaluated case by case.
                </li>
              </ul>

              <h3 className="mt-6 font-medium">What Is NOT Covered</h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Complaints made more than 24 hours after service</li>
                <li>
                  Issues not related to cleaning quality (personality conflicts,
                  minor time variations)
                </li>
                <li>Pre-existing damage or conditions</li>
                <li>Areas you did not request to be cleaned</li>
                <li>
                  Unreasonable expectations beyond the service booked
                </li>
              </ul>

              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">Refund Processing:</strong>{" "}
                Approved refunds are processed within 5-7 business days to your
                original payment method.
              </p>
            </section>

            {/* 10. Service Guarantee */}
            <section id="guarantee">
              <h2 className="text-xl font-semibold">
                10. Service Guarantee
                <span className="ml-2 rounded bg-foreground px-2 py-1 text-xs text-background">
                  IMPORTANT
                </span>
              </h2>
              <div className="mt-6 rounded-lg border-2 border-success bg-success/10 p-6">
                <h3 className="font-semibold text-success">
                  CLEENLY&apos;s 24-Hour Guarantee
                </h3>
                <p className="mt-2 text-muted-foreground">
                  If something isn&apos;t right with your cleaning, tell us
                  within 24 hours and we&apos;ll make it right:
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground">
                  <li>We&apos;ll send someone back to fix the specific issues</li>
                  <li>No extra charge for the re-clean</li>
                  <li>
                    If re-clean doesn&apos;t solve it, we&apos;ll discuss refund
                    options
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-muted-foreground">
                This guarantee requires reporting issues within 24 hours,
                specific description of what wasn&apos;t done correctly, photos
                of problem areas (when applicable), and reasonable opportunity to
                resolve the issue.
              </p>
            </section>

            {/* 11. User Responsibilities */}
            <section id="responsibilities">
              <h2 className="text-xl font-semibold">11. User Responsibilities</h2>
              <p className="mt-4 text-muted-foreground">
                As a CLEENLY customer, you agree to:
              </p>
              <ul className="mt-3 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Accurate Information:
                  </strong>{" "}
                  Provide accurate home details, contact information, and access
                  instructions.
                </li>
                <li>
                  <strong className="text-foreground">Safe Environment:</strong>{" "}
                  Ensure the property is safe for the cleaner. This includes
                  securing aggressive pets, disclosing hazards, and providing
                  working utilities.
                </li>
                <li>
                  <strong className="text-foreground">Respect:</strong> Treat
                  cleaners with respect. Harassment, discrimination, or
                  inappropriate behavior will result in account termination.
                </li>
                <li>
                  <strong className="text-foreground">Legal Compliance:</strong>{" "}
                  Ensure you have the legal right to authorize cleaning at the
                  service address.
                </li>
                <li>
                  <strong className="text-foreground">Valuables:</strong> Secure
                  valuable items, cash, and sensitive documents.
                </li>
                <li>
                  <strong className="text-foreground">
                    Prohibited Requests:
                  </strong>{" "}
                  Do not ask cleaners to perform work outside the scope of
                  cleaning services.
                </li>
              </ul>
            </section>

            {/* 12. Damage and Liability */}
            <section id="damage">
              <h2 className="text-xl font-semibold">12. Damage and Liability</h2>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">Cleaner Insurance:</strong>{" "}
                All cleaners on the CLEENLY platform carry liability insurance
                that covers accidental damage during cleaning.
              </p>
              <h3 className="mt-6 font-medium">Reporting Damage</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-muted-foreground">
                <li>Report damage within 24 hours of service completion</li>
                <li>Provide photos and description of damage</li>
                <li>
                  Email{" "}
                  <a
                    href="mailto:hello@cleenly.com"
                    className="text-foreground underline"
                  >
                    hello@cleenly.com
                  </a>{" "}
                  with &quot;Damage Report&quot; in subject line
                </li>
              </ol>
              <p className="mt-4 text-muted-foreground">
                Legitimate claims are processed through the cleaner&apos;s
                insurance. Resolution typically takes 10-15 business days.
                Maximum claim amount is $10,000 per incident.
              </p>
            </section>

            {/* 13. Independent Contractor */}
            <section id="contractor">
              <h2 className="text-xl font-semibold">
                13. Independent Contractor Relationship
              </h2>
              <p className="mt-4 text-muted-foreground">
                Cleaners on CLEENLY are independent contractors, not employees.
                This means CLEENLY does not control how cleaners perform their
                work, does not provide equipment or supplies to cleaners, and
                cleaners set their own schedules and accept bookings at their
                discretion.
              </p>
              <p className="mt-4 text-muted-foreground">
                This does not affect your rights as a customer. The Service
                Guarantee and our policies apply regardless of employment status.
              </p>
            </section>

            {/* 14. Intellectual Property */}
            <section id="ip">
              <h2 className="text-xl font-semibold">14. Intellectual Property</h2>
              <p className="mt-4 text-muted-foreground">
                The CLEENLY website, logo, designs, and content are owned by
                CLEENLY and protected by copyright and trademark laws. By
                submitting reviews, photos, or other content, you grant CLEENLY a
                non-exclusive, royalty-free license to use, display, and
                distribute that content.
              </p>
            </section>

            {/* 15. Prohibited Conduct */}
            <section id="prohibited">
              <h2 className="text-xl font-semibold">15. Prohibited Conduct</h2>
              <p className="mt-4 text-muted-foreground">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Use CLEENLY for any unlawful purpose</li>
                <li>Provide false or misleading information</li>
                <li>Harass, abuse, or harm cleaners or CLEENLY staff</li>
                <li>
                  Circumvent the platform (booking directly with cleaners you
                  found through CLEENLY)
                </li>
                <li>
                  Use automated tools to access or scrape our platform
                </li>
                <li>
                  Interfere with the security or operation of the platform
                </li>
                <li>Post false reviews or manipulate the rating system</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Violation of these terms may result in account suspension or
                termination.
              </p>
            </section>

            {/* 16. Dispute Resolution */}
            <section id="disputes">
              <h2 className="text-xl font-semibold">16. Dispute Resolution</h2>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">Informal Resolution:</strong>{" "}
                Before initiating formal proceedings, you agree to contact
                CLEENLY at hello@cleenly.com and attempt to resolve any dispute
                informally for at least 30 days.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">Arbitration:</strong> Any
                dispute that cannot be resolved informally shall be resolved by
                binding arbitration in accordance with the rules of the American
                Arbitration Association. The arbitration shall take place in King
                County, Washington.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">Class Action Waiver:</strong>{" "}
                You agree to resolve disputes with CLEENLY individually and waive
                any right to participate in a class action lawsuit or class-wide
                arbitration.
              </p>
            </section>

            {/* 17. Governing Law */}
            <section id="governing-law">
              <h2 className="text-xl font-semibold">17. Governing Law</h2>
              <p className="mt-4 text-muted-foreground">
                These Terms are governed by the laws of the State of Washington,
                without regard to conflict of law principles. Any legal action
                must be brought in the courts of King County, Washington.
              </p>
            </section>

            {/* 18. Limitation of Liability */}
            <section id="liability">
              <h2 className="text-xl font-semibold">
                18. Limitation of Liability
              </h2>
              <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <p className="mt-3">
                  CLEENLY IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY
                  KIND. CLEENLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED,
                  INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="mt-3">
                  CLEENLY&apos;S TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE
                  TERMS OR YOUR USE OF THE SERVICE IS LIMITED TO THE AMOUNT YOU
                  PAID FOR THE SPECIFIC SERVICE GIVING RISE TO THE CLAIM.
                </p>
                <p className="mt-3">
                  CLEENLY IS NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS,
                  DATA, OR GOODWILL.
                </p>
              </div>
            </section>

            {/* 19. Indemnification */}
            <section id="indemnification">
              <h2 className="text-xl font-semibold">19. Indemnification</h2>
              <p className="mt-4 text-muted-foreground">
                You agree to indemnify, defend, and hold harmless CLEENLY, its
                officers, directors, employees, and agents from any claims,
                liabilities, damages, losses, or expenses (including reasonable
                attorneys&apos; fees) arising from your use of CLEENLY, your
                violation of these Terms, your violation of any third
                party&apos;s rights, or any content you submit to CLEENLY.
              </p>
            </section>

            {/* 20. Termination */}
            <section id="termination">
              <h2 className="text-xl font-semibold">20. Termination</h2>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">By You:</strong> You may stop
                using CLEENLY at any time. To delete your account, email
                hello@cleenly.com.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">By CLEENLY:</strong> We may
                suspend or terminate your account at any time for violation of
                these Terms, fraudulent activity, or any other reason at our
                discretion. We will attempt to notify you before termination
                unless prohibited by law or immediate termination is necessary.
              </p>
              <p className="mt-4 text-muted-foreground">
                <strong className="text-foreground">
                  Effect of Termination:
                </strong>{" "}
                Upon termination, your right to use CLEENLY ends. Provisions that
                by their nature should survive termination will survive.
              </p>
            </section>

            {/* 21. General Provisions */}
            <section id="general">
              <h2 className="text-xl font-semibold">21. General Provisions</h2>
              <ul className="mt-4 space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Entire Agreement:</strong>{" "}
                  These Terms constitute the entire agreement between you and
                  CLEENLY regarding the use of our services.
                </li>
                <li>
                  <strong className="text-foreground">Severability:</strong> If
                  any provision of these Terms is found unenforceable, the
                  remaining provisions remain in effect.
                </li>
                <li>
                  <strong className="text-foreground">Waiver:</strong> Failure to
                  enforce any provision is not a waiver of that provision or any
                  other.
                </li>
                <li>
                  <strong className="text-foreground">Assignment:</strong> You
                  may not assign these Terms. CLEENLY may assign these Terms
                  without restriction.
                </li>
                <li>
                  <strong className="text-foreground">Contact:</strong> Questions
                  about these Terms? Email{" "}
                  <a
                    href="mailto:hello@cleenly.com"
                    className="text-foreground underline"
                  >
                    hello@cleenly.com
                  </a>{" "}
                  with &quot;Terms Question&quot; in the subject line.
                </li>
              </ul>
            </section>
          </div>

          {/* Back to top */}
          <div className="mt-12 border-t border-border pt-8">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ↑ Back to top
            </a>
          </div>
        </Container>
      </div>
    </>
  );
}
