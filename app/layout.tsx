import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/shared/auth-provider";
import { StickyMobileCTA } from "@/components/shared/sticky-mobile-cta";
import { SITE_URL } from "@/lib/constants";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Cleenly — House Cleaning in Greater Seattle",
  description:
    "Book house cleaning in Greater Seattle. See your price online, pick a time, done.",
  keywords: ["cleaning", "seattle", "house cleaning", "house cleaning service"],
  openGraph: {
    title: "Cleenly — House Cleaning in Greater Seattle",
    description:
      "Book house cleaning in Greater Seattle. See your price online, pick a time, done.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
  },
  ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Guma949TQWe1Cq8uBAHQRg"
          async
        />
      </head>
      <body className="antialiased pb-12 md:pb-0">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        )}
        <AuthProvider>{children}</AuthProvider>
        <StickyMobileCTA />
      </body>
    </html>
  );
}
