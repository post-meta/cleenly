import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Privacy Policy | CLEENLY",
  description:
    "CLEENLY privacy policy. How we collect, use, and protect your personal information when you book house cleaning services.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://cleenly.com/privacy",
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  description:
    "CLEENLY privacy policy - how we collect, use, and protect your information",
  url: "https://cleenly.com/privacy",
  inLanguage: "en-US",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://cleenly.com/#WebSite",
  },
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
      name: "Privacy Policy",
      item: "https://cleenly.com/privacy",
    },
  ],
};

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-collect", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "information-sharing", title: "Information Sharing" },
  { id: "data-retention", title: "Data Retention" },
  { id: "data-security", title: "Data Security" },
  { id: "your-rights", title: "Your Rights" },
  { id: "ccpa", title: "California Privacy Rights (CCPA)" },
  { id: "cookies", title: "Cookies and Tracking" },
  { id: "third-party", title: "Third-Party Links" },
  { id: "children", title: "Children's Privacy" },
  { id: "international", title: "International Users" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={pageSchema} />
      <JsonLd data={breadcrumbSchema} />


      <main className="flex-1 py-12 md:py-16">
        <Container size="narrow">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Privacy Policy</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last Updated: December 2025
            </p>
          </div>

          {/* Table of Contents */}
          <nav className="mb-12 rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="mb-4 font-semibold">Table of Contents</h2>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="prose prose-neutral max-w-none space-y-12">
            {/* Introduction */}
            <section id="introduction">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p className="mt-4 text-muted-foreground">
                CLEENLY (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
                operates a house cleaning booking platform serving Seattle and
                the Greater Eastside. This Privacy Policy explains how we
                collect, use, disclose, and protect your personal information
                when you use our website (cleenly.com) and services.
              </p>
              <p className="mt-4 text-muted-foreground">
                By using CLEENLY, you agree to the collection and use of
                information as described in this policy. If you do not agree,
                please do not use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section id="information-collect">
              <h2 className="text-xl font-semibold">
                2. Information We Collect
              </h2>

              <h3 className="mt-6 font-medium">Information You Provide</h3>
              <p className="mt-2 text-muted-foreground">
                When you use CLEENLY, you may provide us with:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Contact Information:
                  </strong>{" "}
                  Name, email address, phone number
                </li>
                <li>
                  <strong className="text-foreground">Service Address:</strong>{" "}
                  The address where cleaning will be performed
                </li>
                <li>
                  <strong className="text-foreground">
                    Access Instructions:
                  </strong>{" "}
                  How to enter your home (lockbox codes, door codes, special
                  instructions)
                </li>
                <li>
                  <strong className="text-foreground">
                    Payment Information:
                  </strong>{" "}
                  Credit card or payment method details (processed securely by
                  Stripe)
                </li>
                <li>
                  <strong className="text-foreground">Communications:</strong>{" "}
                  Messages you send us or your cleaner through our platform
                </li>
                <li>
                  <strong className="text-foreground">Preferences:</strong>{" "}
                  Cleaning preferences, special requests, pet information
                </li>
                <li>
                  <strong className="text-foreground">
                    Account Information:
                  </strong>{" "}
                  If you create an account, your login credentials
                </li>
              </ul>

              <h3 className="mt-6 font-medium">
                Information Collected Automatically
              </h3>
              <p className="mt-2 text-muted-foreground">
                When you visit our website, we automatically collect:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Device Information:
                  </strong>{" "}
                  Browser type, operating system, device type
                </li>
                <li>
                  <strong className="text-foreground">Usage Data:</strong>{" "}
                  Pages visited, time spent, clicks, referral source
                </li>
                <li>
                  <strong className="text-foreground">IP Address:</strong> Used
                  to determine approximate location for service area
                  verification
                </li>
                <li>
                  <strong className="text-foreground">Cookies:</strong> Small
                  files stored on your device to improve your experience (see
                  Cookies section)
                </li>
              </ul>

              <h3 className="mt-6 font-medium">
                Information from Third Parties
              </h3>
              <p className="mt-2 text-muted-foreground">
                We may receive information from:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Payment Processors:
                  </strong>{" "}
                  Transaction confirmations from Stripe
                </li>
                <li>
                  <strong className="text-foreground">
                    Background Check Services:
                  </strong>{" "}
                  For cleaners joining our platform (not for customers)
                </li>
                <li>
                  <strong className="text-foreground">
                    Analytics Providers:
                  </strong>{" "}
                  Aggregated usage statistics
                </li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use">
              <h2 className="text-xl font-semibold">
                3. How We Use Your Information
              </h2>
              <p className="mt-4 text-muted-foreground">
                We use your information to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Provide Services:</strong>{" "}
                  Process bookings, match you with cleaners, facilitate cleaning
                  appointments
                </li>
                <li>
                  <strong className="text-foreground">Communicate:</strong> Send
                  booking confirmations, reminders, updates, and respond to
                  inquiries
                </li>
                <li>
                  <strong className="text-foreground">Process Payments:</strong>{" "}
                  Charge for services and process refunds when applicable
                </li>
                <li>
                  <strong className="text-foreground">
                    Improve Our Platform:
                  </strong>{" "}
                  Analyze usage patterns to improve features and user experience
                </li>
                <li>
                  <strong className="text-foreground">
                    Safety and Security:
                  </strong>{" "}
                  Verify identities, prevent fraud, ensure platform safety
                </li>
                <li>
                  <strong className="text-foreground">Legal Compliance:</strong>{" "}
                  Meet legal obligations and respond to lawful requests
                </li>
                <li>
                  <strong className="text-foreground">Marketing:</strong> Send
                  promotional emails (only with your consent, and you can opt
                  out anytime)
                </li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section id="information-sharing">
              <h2 className="text-xl font-semibold">4. Information Sharing</h2>
              <p className="mt-4 text-muted-foreground">
                We share your information only in these circumstances:
              </p>

              <h3 className="mt-6 font-medium">With Your Cleaner</h3>
              <p className="mt-2 text-muted-foreground">
                We share your name, service address, access instructions, and
                cleaning preferences with the cleaner assigned to your booking.
                This is necessary to provide the service.
              </p>

              <h3 className="mt-6 font-medium">With Service Providers</h3>
              <p className="mt-2 text-muted-foreground">
                We use third-party services to operate our platform:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Stripe:</strong> Payment
                  processing
                </li>
                <li>
                  <strong className="text-foreground">Supabase:</strong> Database
                  hosting
                </li>
                <li>
                  <strong className="text-foreground">Vercel:</strong> Website
                  hosting
                </li>
                <li>
                  <strong className="text-foreground">Google:</strong> Analytics
                  and maps
                </li>
                <li>
                  <strong className="text-foreground">
                    Email service providers:
                  </strong>{" "}
                  Sending notifications
                </li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                These providers access only the information needed to perform
                their services and are bound by confidentiality agreements.
              </p>

              <h3 className="mt-6 font-medium">For Legal Reasons</h3>
              <p className="mt-2 text-muted-foreground">
                We may disclose information if required by law, court order, or
                government request, or to protect our rights, safety, or
                property.
              </p>

              <h3 className="mt-6 font-medium">Business Transfers</h3>
              <p className="mt-2 text-muted-foreground">
                If CLEENLY is acquired or merged, your information may be
                transferred to the new owner. We will notify you before this
                happens.
              </p>

              <h3 className="mt-6 font-medium">With Your Consent</h3>
              <p className="mt-2 text-muted-foreground">
                We may share information for other purposes if you give us
                explicit consent.
              </p>

              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="font-medium">
                  We Never Sell Your Personal Information
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  We do not sell, rent, or trade your personal information to
                  third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section id="data-retention">
              <h2 className="text-xl font-semibold">5. Data Retention</h2>
              <p className="mt-4 text-muted-foreground">
                We retain your information for as long as necessary to provide
                services and fulfill the purposes described in this policy:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Account Information:
                  </strong>{" "}
                  Kept while your account is active, deleted within 30 days of
                  account deletion request
                </li>
                <li>
                  <strong className="text-foreground">Booking History:</strong>{" "}
                  Retained for 3 years for customer service and legal purposes
                </li>
                <li>
                  <strong className="text-foreground">Payment Records:</strong>{" "}
                  Retained for 7 years as required by financial regulations
                </li>
                <li>
                  <strong className="text-foreground">Communications:</strong>{" "}
                  Retained for 2 years
                </li>
                <li>
                  <strong className="text-foreground">
                    Automatically Collected Data:
                  </strong>{" "}
                  Retained for 1 year
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                You can request deletion of your data at any time (see Your
                Rights section).
              </p>
            </section>

            {/* Data Security */}
            <section id="data-security">
              <h2 className="text-xl font-semibold">6. Data Security</h2>
              <p className="mt-4 text-muted-foreground">
                We take reasonable measures to protect your information:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Encryption:</strong> All
                  data transmitted between your browser and our servers is
                  encrypted using TLS/SSL
                </li>
                <li>
                  <strong className="text-foreground">Secure Storage:</strong>{" "}
                  Data is stored on secure servers with access controls
                </li>
                <li>
                  <strong className="text-foreground">Payment Security:</strong>{" "}
                  Payment information is processed by Stripe (PCI-DSS compliant)
                  and never stored on our servers
                </li>
                <li>
                  <strong className="text-foreground">Access Controls:</strong>{" "}
                  Only authorized personnel can access personal data, and only
                  when necessary
                </li>
                <li>
                  <strong className="text-foreground">Regular Reviews:</strong>{" "}
                  We regularly review our security practices
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                No system is 100% secure. While we strive to protect your
                information, we cannot guarantee absolute security. If you
                believe your account has been compromised, contact us immediately
                at{" "}
                <a
                  href="mailto:hello@cleenly.com"
                  className="text-foreground underline"
                >
                  hello@cleenly.com
                </a>
                .
              </p>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <h2 className="text-xl font-semibold">7. Your Rights</h2>
              <p className="mt-4 text-muted-foreground">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Access:</strong> Request a
                  copy of the personal information we hold about you
                </li>
                <li>
                  <strong className="text-foreground">Correction:</strong>{" "}
                  Request correction of inaccurate information
                </li>
                <li>
                  <strong className="text-foreground">Deletion:</strong> Request
                  deletion of your personal information
                </li>
                <li>
                  <strong className="text-foreground">Portability:</strong>{" "}
                  Request your data in a portable format
                </li>
                <li>
                  <strong className="text-foreground">Opt-Out:</strong> Opt out
                  of marketing communications at any time
                </li>
                <li>
                  <strong className="text-foreground">Restriction:</strong>{" "}
                  Request we limit how we use your data
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                To exercise any of these rights, email us at{" "}
                <a
                  href="mailto:hello@cleenly.com"
                  className="text-foreground underline"
                >
                  hello@cleenly.com
                </a>{" "}
                with &quot;Privacy Request&quot; in the subject line. We will
                respond within 30 days.
              </p>
            </section>

            {/* CCPA */}
            <section id="ccpa">
              <h2 className="text-xl font-semibold">
                8. California Privacy Rights (CCPA)
              </h2>
              <p className="mt-4 text-muted-foreground">
                If you are a California resident, you have additional rights
                under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Right to Know:</strong> You
                  can request what personal information we collect, use, and
                  disclose
                </li>
                <li>
                  <strong className="text-foreground">Right to Delete:</strong>{" "}
                  You can request deletion of your personal information
                </li>
                <li>
                  <strong className="text-foreground">
                    Right to Opt-Out of Sale:
                  </strong>{" "}
                  We do not sell personal information, so this does not apply
                </li>
                <li>
                  <strong className="text-foreground">
                    Right to Non-Discrimination:
                  </strong>{" "}
                  We will not discriminate against you for exercising your
                  privacy rights
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                To make a CCPA request, email{" "}
                <a
                  href="mailto:hello@cleenly.com"
                  className="text-foreground underline"
                >
                  hello@cleenly.com
                </a>{" "}
                with &quot;CCPA Request&quot; in the subject line. We may need to
                verify your identity before processing your request.
              </p>
              <p className="mt-4 text-muted-foreground">
                California residents may also designate an authorized agent to
                make requests on their behalf.
              </p>
            </section>

            {/* Cookies */}
            <section id="cookies">
              <h2 className="text-xl font-semibold">9. Cookies and Tracking</h2>
              <p className="mt-4 text-muted-foreground">
                We use cookies and similar technologies to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Essential Cookies:</strong>{" "}
                  Enable core functionality (logging in, processing bookings)
                </li>
                <li>
                  <strong className="text-foreground">Analytics Cookies:</strong>{" "}
                  Understand how visitors use our site (Google Analytics)
                </li>
                <li>
                  <strong className="text-foreground">Preference Cookies:</strong>{" "}
                  Remember your settings and preferences
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                You can control cookies through your browser settings. Disabling
                cookies may affect some features of our website.
              </p>
              <p className="mt-4 text-muted-foreground">
                We do not respond to &quot;Do Not Track&quot; signals because
                there is no industry standard for this yet. However, you can opt
                out of analytics tracking by using browser extensions or privacy
                tools.
              </p>
            </section>

            {/* Third-Party Links */}
            <section id="third-party">
              <h2 className="text-xl font-semibold">10. Third-Party Links</h2>
              <p className="mt-4 text-muted-foreground">
                Our website may contain links to third-party websites. We are not
                responsible for the privacy practices of these websites. We
                encourage you to read their privacy policies before providing any
                personal information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section id="children">
              <h2 className="text-xl font-semibold">
                11. Children&apos;s Privacy
              </h2>
              <p className="mt-4 text-muted-foreground">
                CLEENLY is not intended for children under 18. We do not
                knowingly collect personal information from children. If you
                believe we have collected information from a child, please
                contact us immediately at{" "}
                <a
                  href="mailto:hello@cleenly.com"
                  className="text-foreground underline"
                >
                  hello@cleenly.com
                </a>{" "}
                and we will delete it.
              </p>
            </section>

            {/* International Users */}
            <section id="international">
              <h2 className="text-xl font-semibold">12. International Users</h2>
              <p className="mt-4 text-muted-foreground">
                CLEENLY operates in the United States. If you are accessing our
                services from outside the US, your information will be
                transferred to and processed in the United States. By using
                CLEENLY, you consent to this transfer.
              </p>
            </section>

            {/* Changes */}
            <section id="changes">
              <h2 className="text-xl font-semibold">
                13. Changes to This Policy
              </h2>
              <p className="mt-4 text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of significant changes by:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Posting the new policy on this page</li>
                <li>Updating the &quot;Last Updated&quot; date</li>
                <li>Sending an email notification for material changes</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Your continued use of CLEENLY after changes indicates acceptance
                of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section id="contact">
              <h2 className="text-xl font-semibold">14. Contact Us</h2>
              <p className="mt-4 text-muted-foreground">
                If you have questions about this Privacy Policy or our privacy
                practices, contact us:
              </p>
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-6">
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:hello@cleenly.com"
                    className="text-foreground underline"
                  >
                    hello@cleenly.com
                  </a>
                </p>
                <p className="mt-2 text-muted-foreground">
                  Subject Line: Privacy Inquiry
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  We aim to respond to all inquiries within 5 business days.
                </p>
              </div>
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
      </main>
    </>
  );
}
