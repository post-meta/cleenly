export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  id: string;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    title: "Pricing & Cost",
    id: "pricing",
    items: [
      {
        question: "How much does house cleaning cost in Seattle?",
        answer:
          "House cleaning in Seattle costs $100-$400 depending on home size and cleaning type. Regular cleaning for a 2-3 bedroom home runs $120-$180. Deep cleaning costs $180-$280. Move-out cleaning ranges from $250-$400. CLEENLY shows you the exact price before you book — no surprises.",
      },
      {
        question: "How much does deep cleaning cost?",
        answer:
          "Deep cleaning in Seattle costs $150-$300 for most homes. A 2-bedroom apartment typically costs $150-$200. A 3-bedroom house runs $200-$280. Larger homes (4+ bedrooms) cost $280-$400. Price includes inside appliances, baseboards, and detailed cleaning of all surfaces.",
      },
      {
        question: "How much is move-out cleaning in Seattle?",
        answer:
          "Move-out cleaning in Seattle costs $200-$400 depending on home size. A 1-bedroom apartment runs $180-$220. A 2-3 bedroom home costs $250-$380. This includes cleaning to landlord inspection standards — inside cabinets, appliances, and all surfaces to help you get your deposit back.",
      },
      {
        question: "Do you charge by the hour or flat rate?",
        answer:
          "CLEENLY uses flat-rate pricing based on your home size and cleaning type. You see the exact price before booking. No hourly surprises — the price shown is the price you pay. This makes it easier to budget and eliminates uncertainty about final cost.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No hidden fees. The price you see at booking is the price you pay. We may suggest optional add-ons (like inside refrigerator or oven cleaning) but you decide what's included. There are no surprise charges, service fees, or taxes added later.",
      },
      {
        question: "Do you offer discounts for recurring cleanings?",
        answer:
          "Yes. Weekly cleanings are typically 10-15% less per visit than one-time cleanings. Bi-weekly cleanings are 5-10% less. The discount is applied automatically when you select recurring service during booking. No coupon codes needed.",
      },
      {
        question: "How much should I tip my house cleaner?",
        answer:
          "Tipping is not required but appreciated. If you're happy with the cleaning, 15-20% is standard. You can tip in cash directly to the cleaner or add a tip through the app after your appointment. Many customers tip $20-$40 for a regular cleaning.",
      },
    ],
  },
  {
    title: "Services & What's Included",
    id: "services",
    items: [
      {
        question: "What is included in regular cleaning?",
        answer:
          "Regular cleaning includes: dusting all surfaces, vacuuming carpets and floors, mopping hard floors, cleaning bathrooms (toilet, shower, sink, mirrors), wiping kitchen counters and appliance exteriors, and emptying trash. This is maintenance cleaning for homes that are cleaned regularly.",
      },
      {
        question: "What is included in deep cleaning?",
        answer:
          "Deep cleaning includes everything in regular cleaning plus: inside oven and refrigerator, inside microwave, baseboards, window sills, ceiling fans, light fixtures, cabinet fronts, door frames, and behind furniture. It's recommended for first-time cleanings or homes that haven't been cleaned in a while.",
      },
      {
        question: "What is included in move-out cleaning?",
        answer:
          "Move-out cleaning includes deep cleaning plus: inside all cabinets and drawers, inside closets, inside all appliances, window tracks, walls spot-cleaned, light fixtures detailed, and garage/patio swept. Designed to pass landlord inspection and help you get your security deposit back.",
      },
      {
        question: "What's the difference between regular and deep cleaning?",
        answer:
          "Regular cleaning covers everyday surfaces — dusting, vacuuming, bathrooms, kitchen surfaces. Deep cleaning adds detailed work: inside appliances, baseboards, window sills, ceiling fans, and areas that get skipped during routine cleaning. Deep cleaning takes 1.5-2x longer and costs about 40-50% more.",
      },
      {
        question: "Do you clean inside the refrigerator and oven?",
        answer:
          "Inside refrigerator and oven are included in deep cleaning and move-out cleaning. For regular cleaning, they're available as add-ons ($20-$25 each). If you want these included, select the add-on during booking or request a deep cleaning which covers them automatically.",
      },
      {
        question: "Do you do laundry?",
        answer:
          "Laundry is available as an add-on service. We can wash, dry, and fold clothes for $25 per load. Select this option during booking. Laundry is not included in regular, deep, or move-out cleaning by default — it's always optional.",
      },
      {
        question: "Do you clean windows?",
        answer:
          "Interior window cleaning is available as an add-on at $5 per window. This includes washing the inside glass and wiping the frame. Exterior window cleaning and high windows requiring ladders are not available through CLEENLY — we recommend a specialized window cleaning service for those.",
      },
    ],
  },
  {
    title: "Booking & Scheduling",
    id: "booking",
    items: [
      {
        question: "How do I book a cleaning?",
        answer:
          "Book online at cleenly.com/book. Enter your home details (bedrooms, bathrooms), see your price, choose a date and time, and provide contact info. Takes about 2 minutes. No account required. You'll receive confirmation by email within 2 hours with cleaner details.",
      },
      {
        question: "How far in advance do I need to book?",
        answer:
          "We often have availability within 2-3 days. For specific times or move-out cleanings, booking 5-7 days ahead helps ensure your preferred slot. Same-day or next-day booking may be available depending on cleaner schedules — check online for current availability.",
      },
      {
        question: "Can I request a specific cleaner?",
        answer:
          "Yes. Once you've had a cleaning, you can request the same cleaner for future appointments. During booking, you'll see if your preferred cleaner is available. If they're not, you can choose another cleaner or wait for their next opening.",
      },
      {
        question: "Can I book a same-day cleaning?",
        answer:
          "Sometimes. Same-day availability depends on cleaner schedules. Check online — if slots are available, you can book. For guaranteed availability, booking 2-3 days ahead is recommended. Move-out cleanings typically need more advance notice.",
      },
      {
        question: "What time slots are available?",
        answer:
          "Cleaning appointments are available 7 days a week. Time slots include: Morning (8am-12pm), Afternoon (12pm-4pm), and Evening (4pm-7pm). Your cleaner will arrive within your selected window. Exact arrival time is confirmed the day before.",
      },
    ],
  },
  {
    title: "Cancellation & Changes",
    id: "cancellation",
    items: [
      {
        question: "Can I cancel my cleaning appointment?",
        answer:
          "Yes. Cancel up to 24 hours before your appointment at no charge. Cancellations within 24 hours may be subject to a cancellation fee (typically 50% of the booking). To cancel, use the link in your confirmation email or contact hello@cleenly.com.",
      },
      {
        question: "Can I reschedule my cleaning?",
        answer:
          "Yes. Reschedule up to 24 hours before your appointment at no charge. Log into your account or use the link in your confirmation email to select a new date and time. Changes within 24 hours may be subject to a fee depending on cleaner availability.",
      },
      {
        question: "What if I need to cancel last minute?",
        answer:
          "Cancellations less than 24 hours before the appointment may incur a fee (typically 50% of booking value). This compensates the cleaner who reserved time for you. If you have an emergency, contact us at hello@cleenly.com — we handle situations case by case.",
      },
      {
        question: "What is your cancellation policy?",
        answer:
          "Cancel more than 24 hours before: full refund, no fee. Cancel 12-24 hours before: 50% fee may apply. Cancel less than 12 hours or no-show: full charge may apply. Emergencies are handled individually. Recurring customers with good history get more flexibility.",
      },
    ],
  },
  {
    title: "During the Cleaning",
    id: "during",
    items: [
      {
        question: "Do I need to be home during the cleaning?",
        answer:
          "No. Many customers are not home during cleaning. You can leave access instructions (lockbox code, hide a key, smart lock code, doorman). Your cleaner will follow your instructions and lock up when finished. You'll receive a notification when cleaning is complete.",
      },
      {
        question: "How do I give the cleaner access to my home?",
        answer:
          "Common options: lockbox with key, smart lock temporary code, leave key with doorman/concierge, key under mat (provide location), or be home to let them in. Add access instructions during booking. Your cleaner will confirm they understand before arriving.",
      },
      {
        question: "What if I have pets?",
        answer:
          "Let us know about pets during booking. Most cleaners are comfortable with dogs and cats. Note if pets will be home, if they're friendly or nervous, and any special instructions (keep certain doors closed, avoid startling the cat, etc.). Aggressive pets should be secured.",
      },
      {
        question: "Do cleaners bring their own supplies?",
        answer:
          "Yes. Cleaners bring all necessary cleaning supplies and equipment — vacuums, mops, sprays, cloths, etc. If you prefer specific products (eco-friendly, particular brand, or have allergies), note this during booking and the cleaner will accommodate or you can provide your own.",
      },
      {
        question: "How long does a cleaning take?",
        answer:
          "Time depends on home size and cleaning type. Regular cleaning: 1.5-3 hours. Deep cleaning: 3-5 hours. Move-out cleaning: 4-7 hours. A typical 3-bedroom regular cleaning takes about 2.5 hours. First-time cleanings usually take longer than recurring visits.",
      },
      {
        question: "What if something is damaged during cleaning?",
        answer:
          "All cleaners on CLEENLY carry liability insurance. If something is damaged, report it within 24 hours. Take photos and email hello@cleenly.com with details. We'll work with the cleaner and their insurance to resolve the issue. Genuine accidents are covered.",
      },
    ],
  },
  {
    title: "After the Cleaning",
    id: "after",
    items: [
      {
        question: "What if I'm not happy with the cleaning?",
        answer:
          "Contact us within 24 hours. Describe what wasn't done properly. We'll send someone back to fix it at no extra charge. No arguing, no runaround. If a re-clean doesn't resolve it, we'll discuss a partial refund. We'd rather fix problems than have unhappy customers.",
      },
      {
        question: "How do I leave a review for my cleaner?",
        answer:
          "After your cleaning, you'll receive an email with a link to leave a review. Rate your experience and write a comment if you'd like. Reviews help good cleaners get more bookings and help other customers choose. We appreciate honest feedback — positive or constructive.",
      },
      {
        question: "Can I request the same cleaner every time?",
        answer:
          "Yes. After your first cleaning, you can add that cleaner to your favorites. When booking future appointments, you'll see their availability first. If you set up recurring service, we'll try to assign the same cleaner each time unless they're unavailable.",
      },
      {
        question: "How do I contact my cleaner directly?",
        answer:
          "For privacy, direct contact info isn't shared before the first appointment. On the day of cleaning, you'll be able to message your cleaner through the app for coordination (running late, access issues, etc.). After the cleaning, you can save them to favorites for future bookings.",
      },
    ],
  },
  {
    title: "Trust & Safety",
    id: "trust",
    items: [
      {
        question: "Are your cleaners background checked?",
        answer:
          "Yes. Every cleaner on CLEENLY passes a background check before being approved. This includes criminal history check and identity verification. We also check references and work history. Only cleaners who pass all checks are accepted to the platform.",
      },
      {
        question: "Are cleaners insured?",
        answer:
          "Yes. All cleaners on CLEENLY carry liability insurance. This covers accidental damage to your property during cleaning. If something is broken or damaged, report it within 24 hours and the insurance covers legitimate claims.",
      },
      {
        question: "How do you vet cleaners?",
        answer:
          "Our vetting process includes: identity verification, background check, reference check, cleaning experience verification, and an interview. Once approved, cleaners build reviews from customers. Cleaners with consistently poor reviews are removed from the platform.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes. We use Stripe for payment processing — the same service used by Amazon, Google, and thousands of major companies. Your card details are encrypted and never stored on our servers. We're PCI compliant. You can also use Apple Pay or Google Pay.",
      },
      {
        question: "Who has access to my home information?",
        answer:
          "Only your assigned cleaner sees your address and access instructions. Our support team can access booking details to help resolve issues. We never sell or share your information with third parties. See our Privacy Policy for full details on data handling.",
      },
    ],
  },
  {
    title: "Service Areas",
    id: "areas",
    items: [
      {
        question: "What areas does CLEENLY serve?",
        answer:
          "CLEENLY serves Seattle and the Greater Eastside including: Bellevue, Kirkland, Redmond, Renton, Kent, Federal Way, Tacoma, Everett, Shoreline, Bothell, Woodinville, Sammamish, Issaquah, and surrounding cities in King, Pierce, and Snohomish counties.",
      },
      {
        question: "Do you serve my neighborhood?",
        answer:
          "We serve most Seattle neighborhoods including Capitol Hill, Ballard, Fremont, Queen Anne, University District, Beacon Hill, West Seattle, Columbia City, Ravenna, Wallingford, Green Lake, and others. Enter your address during booking to confirm we cover your area.",
      },
      {
        question: "Is there extra charge for locations outside Seattle?",
        answer:
          "No extra charge for any city we serve. Pricing is based on home size and cleaning type, not location. Whether you're in downtown Seattle or Redmond, the same pricing applies. If your area isn't served yet, enter your email and we'll notify you when we expand there.",
      },
    ],
  },
  {
    title: "Account & Payment",
    id: "account",
    items: [
      {
        question: "Do I need to create an account to book?",
        answer:
          "No account required to book or see prices. You can complete the entire booking as a guest using just your email. Creating an account is optional but lets you: manage bookings, save favorite cleaners, view cleaning history, and rebook faster.",
      },
      {
        question: "When am I charged for the cleaning?",
        answer:
          "Your card is authorized when you book but not charged until after the cleaning is complete. If you cancel within the free cancellation window (24+ hours before), nothing is charged. This protects you from paying for services not received.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, Amex, Discover), debit cards, Apple Pay, and Google Pay. Payment is processed securely through Stripe. We don't accept cash or checks for booking — though you can tip your cleaner in cash if you prefer.",
      },
      {
        question: "How do I get a receipt?",
        answer:
          "A receipt is automatically emailed after your cleaning is complete. It includes: services provided, final price, cleaner name, and date. You can also view all receipts in your account under \"Cleaning History.\" Need a receipt resent? Email hello@cleenly.com.",
      },
    ],
  },
];

// Generate flat list of all questions for schema
export function getAllFAQItems(): FAQItem[] {
  return faqCategories.flatMap((category) => category.items);
}
