import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cleenly — Cleaning Services in Seattle",
  description:
    "Book cleaning services in Greater Seattle area. Choose your cleaner, see the price, book online.",
  keywords: ["cleaning", "seattle", "house cleaning", "maid service"],
  openGraph: {
    title: "Cleenly — Cleaning Services in Seattle",
    description:
      "Book cleaning services in Greater Seattle area. Choose your cleaner, see the price, book online.",
    type: "website",
    locale: "en_US",
  },
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
