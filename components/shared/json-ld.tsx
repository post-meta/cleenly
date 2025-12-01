interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://cleenly.com/#LocalBusiness",
  name: "CLEENLY",
  description:
    "House cleaning booking platform serving Seattle and Greater Eastside. Book online, see prices upfront, choose your cleaner.",
  url: "https://cleenly.com",
  telephone: "+1-206-555-0123",
  email: "hello@cleenly.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seattle",
    addressRegion: "WA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "47.6062",
    longitude: "-122.3321",
  },
  areaServed: [
    { "@type": "City", name: "Seattle" },
    { "@type": "City", name: "Bellevue" },
    { "@type": "City", name: "Kirkland" },
    { "@type": "City", name: "Redmond" },
    { "@type": "City", name: "Renton" },
    { "@type": "City", name: "Kent" },
    { "@type": "City", name: "Tacoma" },
    { "@type": "City", name: "Everett" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "08:00",
    closes: "20:00",
  },
  priceRange: "$$",
  paymentAccepted: ["Credit Card", "Debit Card"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Regular Cleaning",
          description:
            "Routine house cleaning including dusting, vacuuming, mopping, bathroom and kitchen cleaning",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Deep Cleaning",
          description:
            "Thorough cleaning including inside appliances, baseboards, light fixtures, and hard-to-reach areas",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Move-Out Cleaning",
          description:
            "Complete cleaning to landlord standards, helping maximize security deposit return",
        },
      },
    ],
  },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does house cleaning cost in Seattle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "House cleaning in Seattle typically costs $120-$200 for a standard 2-3 bedroom home. Regular cleaning runs $100-$150, deep cleaning $150-$250, and move-out cleaning $200-$350. CLEENLY shows exact prices before booking.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book a cleaning with CLEENLY?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter your home details, see your price instantly, pick a date and time, and confirm. Takes about 2 minutes. No account required to get a quote.",
      },
    },
    {
      "@type": "Question",
      name: "What areas does CLEENLY serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CLEENLY serves Seattle and the Greater Eastside including Bellevue, Kirkland, Redmond, Renton, Kent, Tacoma, and Everett.",
      },
    },
    {
      "@type": "Question",
      name: "What if I'm not happy with the cleaning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contact us within 24 hours and we'll send someone back to fix it at no extra charge.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to be home during the cleaning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Many customers give access instructions (lockbox code, smart lock, etc.) and aren't home during cleaning.",
      },
    },
    {
      "@type": "Question",
      name: "How far in advance do I need to book?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We often have availability within 2-3 days. For specific times or move-out cleanings, booking a week ahead helps.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to provide cleaning supplies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Cleaners bring their own supplies and equipment. If you prefer specific products, let us know in the booking notes.",
      },
    },
  ],
};
