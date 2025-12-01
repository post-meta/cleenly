# CLEENLY — FAQ PAGE

## Technical Specification

### URL
`/faq`

### Purpose
Main hub for all questions. Optimized for voice search, featured snippets, and AI extraction. Each answer is a self-contained chunk for LLM understanding.

---

## SEO OPTIMIZATION

### Title Tag
```
House Cleaning FAQ Seattle | Common Questions | CLEENLY
```

### Meta Description
```
Answers to common questions about house cleaning in Seattle. Pricing, what's included, booking, cancellation, and more. Find your answer in seconds.
```

### H1
```
Frequently Asked Questions
```

### Target Keywords
**Primary:**
- house cleaning faq
- cleaning service questions seattle
- house cleaning questions

**Long-tail (voice search targets):**
- how much does house cleaning cost in seattle
- what is included in deep cleaning
- how do i book a house cleaner
- can i cancel my cleaning appointment
- do i need to be home for house cleaning
- how long does house cleaning take
- do cleaners bring their own supplies
- how much to tip house cleaner

---

## VOICE SEARCH STRUCTURE

Each answer is:
- 40-60 words (optimal for featured snippets)
- First sentence is the direct answer
- Remaining text provides details and context
- Self-contained (doesn't require reading other sections)

---

## FAQ CATEGORIES

### 1. Pricing & Cost (7 questions)
- How much does house cleaning cost in Seattle?
- How much does deep cleaning cost?
- How much is move-out cleaning in Seattle?
- Do you charge by the hour or flat rate?
- Are there any hidden fees?
- Do you offer discounts for recurring cleanings?
- How much should I tip my house cleaner?

### 2. Services & What's Included (7 questions)
- What is included in regular cleaning?
- What is included in deep cleaning?
- What is included in move-out cleaning?
- What's the difference between regular and deep cleaning?
- Do you clean inside the refrigerator and oven?
- Do you do laundry?
- Do you clean windows?

### 3. Booking & Scheduling (5 questions)
- How do I book a cleaning?
- How far in advance do I need to book?
- Can I request a specific cleaner?
- Can I book a same-day cleaning?
- What time slots are available?

### 4. Cancellation & Changes (4 questions)
- Can I cancel my cleaning appointment?
- Can I reschedule my cleaning?
- What if I need to cancel last minute?
- What is your cancellation policy?

### 5. During the Cleaning (6 questions)
- Do I need to be home during the cleaning?
- How do I give the cleaner access to my home?
- What if I have pets?
- Do cleaners bring their own supplies?
- How long does a cleaning take?
- What if something is damaged during cleaning?

### 6. After the Cleaning (4 questions)
- What if I'm not happy with the cleaning?
- How do I leave a review for my cleaner?
- Can I request the same cleaner every time?
- How do I contact my cleaner directly?

### 7. Trust & Safety (5 questions)
- Are your cleaners background checked?
- Are cleaners insured?
- How do you vet cleaners?
- Is my payment information secure?
- Who has access to my home information?

### 8. Service Areas (3 questions)
- What areas does CLEENLY serve?
- Do you serve my neighborhood?
- Is there extra charge for locations outside Seattle?

### 9. Account & Payment (4 questions)
- Do I need to create an account to book?
- When am I charged for the cleaning?
- What payment methods do you accept?
- How do I get a receipt?

**Total: 45 questions**

---

## JSON-LD SCHEMA

### FAQPage Schema
All 45 questions included in the FAQPage schema for rich results.

### BreadcrumbList Schema
```
Home > FAQ
```

---

## IMPLEMENTATION

### Components
- `FAQAccordion` - Expandable Q&A with smooth animation
- `FAQCategory` - Category wrapper with title and accordion

### Features
- Category navigation (jump links)
- Accordion with one-at-a-time expansion
- Accessible (keyboard navigation, ARIA attributes)
- Quick links to related pages
- Contact CTA section

### Files
- `app/(marketing)/faq/page.tsx`
- `components/marketing/faq-accordion.tsx`
- `lib/faq-data.ts`
