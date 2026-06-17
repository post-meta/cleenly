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
          "It depends on home size, condition, and cleaning type. A first clean (priced as a deep clean) runs about $290–350 for a 1-bedroom, $440–530 for a 2-bedroom, and $545–650 for a 3-bedroom. Recurring visits from your second clean on are lighter — roughly $185–260 for most homes. You see an upfront estimate range when you book; the final price is based on actual time, billed at $75 per cleaner-hour ($185 minimum), and we confirm it with you before charging.",
      },
      {
        question: "How much does deep cleaning cost?",
        answer:
          "Deep cleaning estimates run about $290–350 for a 1-bedroom, $440–530 for a 2-bedroom, $545–650 for a 3-bedroom, and $685–825 for a 4-bedroom typical home in average condition. A first clean is priced as a deep clean. These are estimate ranges — the final price is based on actual time at $75 per cleaner-hour ($185 minimum), confirmed before charging. Deep cleaning covers inside appliances, baseboards, and detailed cleaning of all surfaces.",
      },
      {
        question: "How much is move-out cleaning in Seattle?",
        answer:
          "Move-out estimates run about $380–455 for a 1-bedroom, $585–705 for a 2-bedroom, $740–885 for a 3-bedroom, and $815–975 for a 4-bedroom. This covers cleaning to landlord inspection standards — inside cabinets, appliances, and all surfaces to help you get your deposit back. The estimate is a range; the final price is based on actual time at $75 per cleaner-hour ($185 minimum), confirmed with you before charging.",
      },
      {
        question: "Do you charge by the hour or flat rate?",
        answer:
          "By the hour. We give you an upfront estimate range based on your home size and cleaning type, then bill the final price on actual cleaner-hours worked — $75 per cleaner-hour, with a $185 minimum job. A standard visit is a two-cleaner team. The estimate is usually close to the final, and we confirm the final price with you before charging — never any surprise total after the fact.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No hidden fees. You get an upfront estimate range, and the final price is based on actual cleaner-hours at $75 per cleaner-hour ($185 minimum) — we confirm it with you before charging. We may suggest optional add-ons (like inside refrigerator or oven cleaning) but you decide what's included. No surprise service fees or taxes added later.",
      },
      {
        question: "Do you offer discounts for recurring cleanings?",
        answer:
          "Yes. Weekly and bi-weekly visits cost less than a first clean — your home stays maintained, so each visit takes less time. From your second visit on, most homes run about $185–260 per visit. Mention your preferred frequency at booking and we'll confirm the recurring estimate along with your first visit.",
      },
      {
        question: "How much should I tip my house cleaner?",
        answer:
          "Tipping is not required but appreciated. If you're happy with the cleaning, 15-20% is standard. Cash directly to your cleaner works best. Many customers tip $20-$40 for a regular cleaning.",
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
          "Inside refrigerator and oven are included in deep cleaning and move-out cleaning. For regular cleaning, they're available as add-ons (inside refrigerator +$25, inside oven +$20). If you want these included, select the add-on during booking or request a deep cleaning which covers them automatically.",
      },
      {
        question: "Do you do laundry?",
        answer:
          "Laundry is available as an add-on service. We can wash, dry, and fold clothes for $25 per load. Select this option during booking. Laundry is not included in regular, deep, or move-out cleaning by default — it's always optional.",
      },
      {
        question: "Do you clean windows?",
        answer:
          "Interior windows are cleaned as time allows during standard and deep cleaning — we don't itemize per pane. For homes with many large windows (view homes, sunrooms), mention it in the special requests field at booking and we'll quote a custom add-on. We reach what a step stool can reach — vaulted ceilings, atrium glass, and any high-reach interior windows need a specialized window service, same as exterior windows.",
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
          "Book online at cleenly.app/book. Enter your home details (bedrooms, bathrooms), see your estimate, choose a date and time, and provide contact info. Takes about 2 minutes. No account required. We confirm by email, usually within a couple of hours.",
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
          "Cleaning appointments are available 7 days a week. Time slots: Morning (8am-12pm) and Afternoon (12pm-4pm). Your cleaner will arrive within your selected window. Exact arrival time is confirmed the day before.",
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
          "Yes. Cancel up to 24 hours before your appointment at no charge. Cancellations within 24 hours may be subject to a cancellation fee (typically 50% of the booking). To cancel, use the link in your confirmation email or contact hello@cleenly.app.",
      },
      {
        question: "Can I reschedule my cleaning?",
        answer:
          "Yes. Reschedule up to 24 hours before your appointment at no charge. Log into your account or use the link in your confirmation email to select a new date and time. Changes within 24 hours may be subject to a fee depending on cleaner availability.",
      },
      {
        question: "What if I need to cancel last minute?",
        answer:
          "Cancellations less than 24 hours before the appointment may incur a fee (typically 50% of booking value). This compensates the cleaner who reserved time for you. If you have an emergency, contact us at hello@cleenly.app — we handle situations case by case.",
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
          "CLEENLY carries general liability insurance. If something is damaged, report it within 24 hours. Take photos and email hello@cleenly.app with details. We'll make it right. Genuine accidents are covered.",
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
          "We'll ask how it went after your cleaning — just reply to that email, or write us anytime at hello@cleenly.app. We read every message. Honest feedback — positive or constructive — is how we get better.",
      },
      {
        question: "Can I request the same cleaner every time?",
        answer:
          "Yes — just tell us at booking or by email. If you set up recurring service, we try to send the same cleaner each time; that's how cleanings get faster and better. On busy weeks we may send a teammate, and we'll tell you in advance.",
      },
      {
        question: "How do I contact my cleaner directly?",
        answer:
          "Call or text us at (206) 641-4739, or email hello@cleenly.app — we coordinate directly with your cleaner. Running late, access issues, special instructions on cleaning day: one message to us and your cleaner knows.",
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
          "Yes. Everyone who cleans for CLEENLY is background-checked before working in homes — including the extra cleaners we bring in when the schedule fills up.",
      },
      {
        question: "Are cleaners insured?",
        answer:
          "Yes. CLEENLY carries general liability insurance, which covers accidental damage during cleaning. If something is broken or damaged, report it within 24 hours and we'll make it right.",
      },
      {
        question: "How do you vet cleaners?",
        answer:
          "We're a small team — most cleanings are done by us personally. When we bring in extra cleaners, they're people we know and trust: background-checked, experienced, and they work alongside us before working alone. Cleaners who don't keep our quality standards don't keep working with us.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "We don't collect card details on the site — booking requires no payment information at all. You pay after the cleaning is complete, and we confirm payment options with your booking.",
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
          "No account required to book or see prices. You can complete the entire booking as a guest using just your email. Creating an account is optional but lets you manage bookings and rebook faster.",
      },
      {
        question: "When am I charged for the cleaning?",
        answer:
          "You don't pay anything when you book. We confirm your booking and final price first, and you pay after the cleaning is complete. Cancel 24+ hours ahead and you owe nothing.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We currently take Venmo, Zelle, cash, or check after the cleaning is complete. Card payments are coming soon. We'll confirm payment options together with your booking.",
      },
      {
        question: "How do I get a receipt?",
        answer:
          "We email a receipt after your cleaning is complete — services provided, final price, and date. Need a receipt resent or an invoice for your records? Email hello@cleenly.app.",
      },
    ],
  },
];

// Generate flat list of all questions for schema
export function getAllFAQItems(): FAQItem[] {
  return faqCategories.flatMap((category) => category.items);
}
