# Seattle House Cleaning Competitor Pricing Teardown
*Collected 2026-05-23 for CLEENLY pricing realignment evidence base.*
*Researcher: Claude Opus 4.7. Method: WebFetch + curl on each company's pricing/booking page; WebSearch only for discovery.*

---

## Methodology notes

- Where a site hid pricing behind a quote form / phone gate, I report "not published on site" and document the wall instead of guessing.
- Several premium independents (MaidPro, Merry Maids of Bellevue, The Cleaning Authority of Bellevue–Renton, Handy.com booking flow) are sitting behind Cloudflare / 403 / login walls that block automated fetches. They are documented but rely on cached search snippets for any quoted text.
- Specs from the original brief that did NOT exist as published companies: `madronamaids.com` (no such domain; "The Maids of Madrona" is a different brand under maidsseattle.com / The Maids franchise), `cleanerimage.net` (this is a Torrance, CA commercial janitorial — NOT Seattle residential). I swapped in **Simply Clean Seattle** and **JenyClean** in their place since both publish detailed Eastside pricing and were surfaced repeatedly while researching the originally-named competitors.
- Two market-context articles (Tidy's blog + Thumbtack's pricing index) included for benchmark ranges only — not counted toward the 7-9 teardown target.
- All access dates: **2026-05-23**. ZIP context: 98004 (Clyde Hill) / 98101 (downtown Seattle).

---

## Summary table

| # | Company | Class | Regular 2/2 | Deep 2/2 | Move-out 2/2 | Interior windows | Pricing model | Source URL |
|---|---|---|---|---|---|---|---|---|
| 1 | THA House Cleaning | Premium indie (Eastside) | not published | not published | not published | not published | Quote form / call | thacleaning.com (schema: "$150–$3000") |
| 2 | Simply Clean Seattle | Premium indie (Eastside) | $193–$240 (bi-weekly avg $217) | $362–$672 (1-bed–2-bed range) | $289 starting (2bd) | Add-on, price not published | Sqft + bedroom flat + add-ons | seattlesimplyclean.com/seattle-house-cleaning-prices |
| 3 | JenyClean | Premium indie (Eastside) | from **$147**/visit | from **$375**/visit | from **$412**/visit | **$15/window** flat | Flat tier + transparent add-ons | jenyclean.com/cities/bellevue/ + /services/deep-cleaning/ |
| 4 | Bellevue Clean | Mid-premium indie (Eastside) | not published | not published | not published | not published | Quote form / call | bellevueclean.com |
| 5 | MaidPro (Seattle-Bellevue) | Franchise mid-market | blocked (Cloudflare) | blocked | blocked | unknown | Per-sqft on first clean, recurring quote | maidpro.com/seattle-bellevue (403) |
| 6 | The Cleaning Authority (Bellevue-Renton) | Franchise mid-market | not published | not published | not published | not published | Quote form / call | thecleaningauthority.com/bellevue-renton |
| 7 | Merry Maids (Seattle) | Franchise mid-market | not published | not published | not published | not published | Quote form / call | merrymaids.com/home-cleaners-seattle-wa |
| 8 | Handy | Marketplace / tech | not published as flat | n/a (hourly only) | n/a (hourly only) | Add-on, **+~30 min** of booked time | Hourly, min 3 hours, recurring discount | handy.com/services/cleaning-service |
| 9 | NW Maids | Tech-forward indie | not published until form submission | not published | not published | Add-on (explicitly listed; price hidden until form done) | Flat-rate calculator (bd+ba+zip) | nwmaids.com/locations/seattle/ |
| 10 | Tidy.com | (Pivoted — no longer consumer) | n/a — property mgmt fee 3.9% gross + $39/mo | n/a | n/a | n/a | Property mgmt SaaS, not consumer cleaning | tidy.com/pricing |

**Market ranges (Seattle, for orientation, not a single competitor):**
- Rain City Maids guide: standard 1k sqft $120–$150 · 1–2k sqft $150–$250 · 2.5k+ $250–$400+ · deep/move-out $200–$600 · hourly $60–$80 per cleaner (team-of-two $80–$120/hr combined).
- Thumbtack national 2bd: $136–$217 standard · 4bd: $191–$286 standard.
- Care.com individual (W-2/1099) market: Bellevue $28.42–$35.88/hr · Kirkland $28.71–$37.88/hr · Seattle $26.14–$33.22/hr.
- Seattle window-cleaning specialists: $8–$20 per window typical; $10–$15/window average; full interior+exterior $200–$450.

---

## Detailed teardowns

### 1. THA House Cleaning  (premium-independent, Eastside)
**Source:** https://www.thacleaning.com/ (accessed 2026-05-23)
**Cost guide article:** https://www.thacleaning.com/cost-housecleaning-bellevue-price-guide/

- **Tiers offered:** Regular (weekly/bi-weekly/monthly), Deep, Move-In/Move-Out, Office, One-Time Custom.
- **Concrete prices on site:** Only the schema.org range:
  > `"priceRange": "$150-$3000"`
  and a promo: `"$25 Off Your First Cleaning with Code 'CLEAN25'"`.
- **Pricing model:** Not published — quote form / phone (+1 425 289 9310) / text. Their own "True Cost of Housecleaning Bellevue" guide quotes market hourly $40–$65 per cleaner and flat fees $150–$400, but does NOT publish their own rates inside it.
- **Add-ons / windows handling:** Not published on site.
- **Deep clean inclusion:** Page lists deep cleaning generically; interior windows status not explicitly stated.
- **Display UX:** "Call/text for personalized quote." Phone & quote-form gate.
- **Positioning hooks:** "Founded by Tetyana (Tanya) Silva. 15+ years. Licensed and insured. Angie's List Service Award 4 years running. 120+ Happy Clients. 4.8 rating."
- **Geo coverage:** Bellevue, Kirkland, Redmond, Renton, "entire East Side." Clyde Hill / Medina / 98004 not explicitly named but East Side coverage implies yes.
- **What they do differently:** Owner-named brand ("Tanya"), Angie's-List veteran credibility, lifestyle "smart cleaning choices" language vs. raw price competition.

### 2. Simply Clean Seattle  (premium-independent, Eastside)
**Source:** https://www.seattlesimplyclean.com/seattle-house-cleaning-prices (accessed 2026-05-23)
**Also:** /residential/deep-cleaning, /residential/custom-cleaning, /bellevue/move-out-cleaning

- **Tiers offered:** Recurring (weekly/bi-weekly/monthly), Deep / Spring, Move-In/Move-Out, Custom (task-based, $160 minimum).
- **Concrete prices (flat, by sqft and by bedroom):**

  *Recurring Bi-Weekly (their cheapest tier):*
  > "1,000 sq ft: **$142–$197 (avg $168)** · 2,000 sq ft: **$193–$240 (avg $217)** · 3,000 sq ft: **$217–$272 (avg $242)** · 4,000 sq ft: **$290–$428 (avg $353)**"

  *Monthly:*
  > "1,000 sq ft: $147–$209 (avg $174) · 2,000 sq ft: $201–$254 (avg $225) · 3,000 sq ft: $225–$298 (avg $259) · 4,000 sq ft: $287–$392 (avg $336)"

  *Deep / Spring Cleaning (flat by sqft):*
  > "1,000 sq ft: **$249–$479 (avg $351)** · 2,000 sq ft: **$351–$735 (avg $503)** · 3,000 sq ft: $443–$952 (avg $659) · 4,000 sq ft: $597–$1,293 (avg $894)"

  *Deep cleaning by bedroom count (from /residential/deep-cleaning):*
  > "1 BR: **$284–$550** · 2 BR: **$362–$672** · 3 BR: **$474–$861+** · 4 BR: **$625–$1,194+** · 5 BR: $680–$1,425+"

  *Move-In/Move-Out (flat by sqft):*
  > "1,000 sq ft: **$223–$649 (avg $412)** · 2,000 sq ft: **$490–$1,013 (avg $720)** · 3,000 sq ft: $630–$1,304 (avg $939) · 4,000 sq ft: $802–$1,768 (avg $1,262)"

  *Move-out by bedroom (from /bellevue/move-out-cleaning):*
  > "1 bedroom: **from $239** · 2 bedrooms: **from $289** · 3 bedrooms: **from $339** · 4 bedrooms: **from $399**"

  *Custom (à-la-carte):*
  > "$160 minimum visit fee. Tasks priced individually; total builds as selections are made."

- **Add-ons:** "Popular add-ons include interior windows, inside refrigerator, inside oven, and glass shower doors." Specific dollar amounts NOT published in scraped pages.
- **Deep clean inclusion:** Interior windows are explicitly an add-on ("Popular add-ons include interior windows…"), NOT included in deep by default.
- **Display UX:** Public range table + flat-by-bedroom starting prices + separate online quote at quote.seattlesimplyclean.com.
- **Positioning hooks:** "Vetted, Insured, Since 2008. 4.9 stars / 700+ reviews. 24-Hour Re-Clean Guarantee."
- **Geo coverage:** "Service to Clyde Hill, Medina, Bellevue" explicitly confirmed. HQ 1818 Westlake Ave N, Seattle 98109.
- **What they do differently:** Most transparent published pricing of the entire teardown set — they publish FOUR pricing matrices (by sqft × frequency × tier × bedroom) and they have a separate "Custom Cleaning" task-based product at $160 min, which is rare in this market.

### 3. JenyClean  (premium-independent, Eastside)
**Source:** https://jenyclean.com/cities/bellevue/ (accessed 2026-05-23)
**Also:** /services/deep-cleaning/

- **Tiers offered:** Regular (recurring), Deep, Move-In/Move-Out, plus specialty: carpet steam, pet odor, post-construction, organizing.
- **Concrete starting prices:**
  > "Regular Cleaning: **starting from $147 per visit** · Deep Cleaning: **from $375 per visit** · Move-In/Move-Out: **from $412 per visit**"
- **Add-on prices (published verbatim — this is the unicorn):**
  > "Interior window washing: **$15 per window** · Oven interior (single): **$60** · Oven interior (double): **$75** · Refrigerator interior (empty): **$65** · Refrigerator interior (full/partially full): **$75** · Wall washing: **$70/hour** · Laundry service: **$70 flat fee**"
- **Deep clean inclusion:** Windows are NOT in deep clean by default — explicitly listed as a per-window add-on.
- **Display UX:** "Starting from $X" published, plus full add-on price list. No instant calculator, but the published numbers let a customer ballpark.
- **Positioning hooks:** "Family-owned cleaning company serving Eastside communities. Verified Insured & Bonded. Eco-Friendly Products. Same-day booking availability. 3-hour minimum first booking."
- **Geo coverage:** Bellevue, Medina, Clyde Hill, Yarrow Point + broader Eastside. Office address 10655 NE 4th St, Suite 630, Bellevue, WA 98004 (operates AT 98004).
- **What they do differently:** Per-window add-on pricing is the most transparent in the market — this is the direct competitive benchmark for CLEENLY's "interior windows" pain-point story.

### 4. Bellevue Clean  (mid-premium indie)
**Source:** https://bellevueclean.com/ (accessed 2026-05-23)

- **Tiers offered:** Standard, Deep, Move-In/Move-Out, Recurring, Airbnb.
- **Concrete prices:** Not published. "Pricing depends on the size of your home and the type of cleaning you need."
- **Pricing model:** Quote form / phone (425) 230-5343.
- **Add-ons:** Not published.
- **Positioning hooks:** "Ultimate Spotless Clean Home Guarantee" (24h re-clean). "Reliability Promise: $100 compensation for no-shows." "VIP membership with up to 20% savings on recurring."
- **Geo coverage:** Bellevue, Issaquah, **Medina, Mercer Island, Kirkland, Redmond, Renton, Kent, Clyde Hill, Seattle** (explicitly enumerated).
- **What they do differently:** Productized service-guarantee dollar amount ($100 no-show comp) is unusual — most competitors just promise "we'll come back."

### 5. MaidPro (Seattle-Bellevue franchise)  (mid-market franchise)
**Source:** https://www.maidpro.com/seattle-bellevue (accessed 2026-05-23 — **HTTP 403 / Cloudflare challenge**)

- **Tiers offered (per search snippets):** Standard, Deep ("49-point checklist"), One-Time, Weekly/Bi-Weekly, No-Contract.
- **Concrete prices:** Blocked by Cloudflare bot challenge from both WebFetch and direct curl. MaidPro's national pattern is "first clean priced per square foot (≈$0.40–0.50/sqft), then recurring quoted per-visit" — this is NOT verifiable from their actual site in this session.
- **Positioning hooks:** "Woman-owned, locally operated, in business since 2000. 49-point checklist. No contracts."
- **Geo coverage:** Seattle + Bellevue franchise — service-areas page confirms Eastside coverage (specific 98004/Clyde Hill not verified due to block).
- **Display UX:** Quote form + phone — site enforces Cloudflare JS challenge that prevents automated reads.
- **What they do differently:** Brand-name "49-point checklist" is the productized differentiator; pricing intentionally opaque.

### 6. The Cleaning Authority (Bellevue–Renton)  (mid-market franchise)
**Source:** https://www.thecleaningauthority.com/bellevue-renton/our-cleaning-services/house-cleaning/ (accessed 2026-05-23)

- **Tiers offered:** "Detail Clean Rotation" (their signature recurring system — rotates focus areas across visits), one-time, move-in/move-out.
- **Concrete prices:** Not published.
  > "The price of your home cleaning will vary based on several factors, including the size of the area to be cleaned, the frequency of cleaning visits, the condition of the space, the unique features of your home, the materials required, and even the presence of pets!"
- **Pricing model:** Quote form / phone (425) 276-7769.
- **Add-ons:** Not published.
- **Positioning hooks:** "Free price estimates. Customizable. Weekly, bi-weekly, monthly frequencies."
- **Geo coverage:** Bellevue, Bothell, Covington, Fairwood, Issaquah, Kent, Maple Valley, Mercer Island, Newcastle, Renton. **Clyde Hill, Medina, Kirkland NOT enumerated.**
- **What they do differently:** "Detail Clean Rotation" — instead of cleaning the whole house every time, they rotate detail focus across visits (a productized way to keep recurring rates lower).

### 7. Merry Maids (Seattle / Bellevue)  (mid-market franchise)
**Source:** https://merrymaids.com/home-cleaners-seattle-wa and /bellevue/ (accessed 2026-05-23)

- **Tiers offered:** Regular/routine cleaning, one-time cleaning (special occasions).
- **Concrete prices:** Not published. Pages contain zero `$` figures in the served HTML.
- **Pricing model:** Quote form / phone.
- **Add-ons:** Not published.
- **Positioning hooks:** "40 years of experience. Insured and bonded."
- **Geo coverage:** Seattle + Bellevue franchise pages exist; Yelp shows the Bellevue location ("Merry Maids of Bellevue") may be CLOSED (status flagged on Yelp listing as of 2026). Bellevue franchise viability uncertain.
- **What they do differently:** Brand recognition only — the Bellevue location's possible closure is a meaningful market gap.

### 8. Handy  (marketplace / tech-forward)
**Source:** https://www.handy.com/services/cleaning-service and /services/home-cleaning (accessed 2026-05-23)

- **Tiers offered:** Single-service hourly (no separate "deep" vs "standard" SKU — the cleaner does what you ask within the booked hours).
- **Concrete prices:** Not published as flat rates. Generic promo: **"30% off your first booking"** + **"From $39"** (per Tidy's competitor analysis, requires recurring plan; not visible on Handy's own pages without entering ZIP + form).
- **Pricing model:** Hourly. **Minimum booking 3 hours.** Recommended duration scales 3 → 10+ hours by home size. Recurring weekly/biweekly/monthly discounts. Plans with min-term (3/6/12 months) have **$99 early-cancellation fee**.
- **Add-ons:** Inside cabinets, refrigerator interior, oven interior, laundry, **interior windows** — each **adds ~30 minutes** to booked time (NOT a flat dollar — it consumes hours).
- **Deep clean inclusion:** No "deep" SKU. Customer requests deep tasks; cleaner consumes hours. Windows = +30 min as add-on.
- **Display UX:** Instant quote calculator requiring ZIP + bedrooms + bathrooms + date. Calculator does not render dollar amounts in static HTML (it's JS-gated post-ZIP).
- **Positioning hooks:** "Upfront pricing. Highly rated pros. No hidden fees (except $99 cancel)." Marketplace — Handy is not the cleaner.
- **Geo coverage:** Seattle is one of "hundreds of cities" — service-area granularity not published; presumed 98004 served.
- **What they do differently:** Time-not-tasks model. Add-ons cost MINUTES, not dollars. This is a fundamentally different mental model from flat-rate competitors, and arguably hostile to a Clyde Hill customer with 25 windows ("I bought 3 hours but windows alone would eat all 3").

### 9. NW Maids  (tech-forward indie)
**Source:** https://nwmaids.com/locations/seattle/, /locations/kirkland/, /deep-cleaning/, /booking/ (accessed 2026-05-23)

- **Tiers offered:** Standard, Deep, Move-In/Move-Out.
- **Concrete prices:** Not published on any page I could fetch — the instant calculator requires form completion (ZIP, bedrooms, bathrooms, date, time, **phone, email**) before rendering a number. Form-submission attempt against Gravity Forms backend returned the form page, not a quote (Cloudflare on AJAX endpoints).
- **Pricing model:** Flat-rate by bedrooms × bathrooms × ZIP. Recurring discounts:
  > "Monthly clients enjoy **10% off**, biweekly clients **15% off**, and weekly clients **20% off** each clean."
- **Add-ons (categories explicitly named):** "inside windows, inside refrigerator, inside oven, inside cabinets, inside basement, laundry." Dollar amounts not exposed pre-submission.
- **Deep clean inclusion:** Interior windows are explicitly NOT in the default deep clean — listed as add-on.
- **Display UX:** "Instant quote in 60 seconds" — but the 60 seconds includes giving them your phone + email. Lead capture, not transparency.
- **Positioning hooks:** "Flat rates, no estimates. No price gouging. Hundreds of 5-star reviews. Established 2013."
- **Geo coverage:** Seattle, Kirkland, Tacoma, Portland — separate location pages. Clyde Hill / Medina / 98004 not explicitly enumerated; presumed serviced via Bellevue/Kirkland coverage.
- **What they do differently:** Marketing as "instant flat-rate" while functionally being a lead-capture form — pricing is NOT public the way Simply Clean's or JenyClean's is.

### 10. Tidy.com  (REPOSITIONED — no longer consumer-relevant)
**Source:** https://www.tidy.com/pricing (accessed 2026-05-23)
**Why included:** The brief named Tidy as a "tech-forward instant-quote" competitor. They are NOT that anymore.

- **What Tidy is now:** An **"AI Property Manager"** SaaS for short-term rental owners (Airbnb hosts), priced at **"3.9% of gross bookings, cleaning & maintenance work, $39/month minimum"**. Plus optional WiFi+noise sensors ($250/unit), payment processing fees (3.9% CC / 1.7% ACH).
- **Implication:** Tidy is no longer competition for a Clyde Hill homeowner booking a deep clean. They competed against MaidPro / Handy in 2018; they've pivoted to property management infra. **They should be removed from the CLEENLY competitor set going forward.**
- Tidy's own consumer-facing blog (https://www.tidy.com/blog/how-much-does-maid-service-cost) is still a good market benchmark article but isn't a competitor anymore.

---

## Cross-cuts

### Interior windows handling — the CLEENLY thesis test
| Company | Windows in deep by default? | Windows pricing | Format |
|---|---|---|---|
| Simply Clean | **No, add-on** | Not published | Selected at booking |
| JenyClean | **No, add-on** | **$15/window** | Per-window flat — published |
| NW Maids | **No, add-on** | Hidden behind form | Selected in calculator |
| Handy | **No, add-on** | **+30 min** of booked time | Hours, not dollars |
| THA, Bellevue Clean, MaidPro, The Cleaning Authority, Merry Maids | Unknown — not published | Unknown | Quote form |

**Finding:** Nobody includes interior windows in default deep cleaning. The most transparent operator (JenyClean) publishes **$15/window flat**. The market window-cleaning specialist rate is **$8–$20/window** (typical $10–$15).

CLEENLY's current configuration: `windows: 500` cents = **$5/window** flat. That is **1/3 the JenyClean rate and 1/2 the bottom of the specialist range.** This is either a strategic giveaway (good positioning hook: "we don't gouge on windows") OR a margin leak on Clyde Hill homes with 25+ windows (a 25-window job at $5 = $125 added; JenyClean would charge $375 for the same; specialist would charge $250-500).

### Pricing display patterns
1. **Fully transparent:** Simply Clean (4 published matrices), JenyClean (starting-from + per-add-on).
2. **Tech opaque:** NW Maids ("instant quote" = lead form), Handy (calculator requires ZIP).
3. **Pure quote/call:** THA, MaidPro, Merry Maids, The Cleaning Authority, Bellevue Clean.
4. **Schema.org range only:** THA exposes `"$150-$3000"` in JSON-LD; no actual rate card.
5. **Reposition out of segment:** Tidy.

### Geo coverage map for Clyde Hill / Medina / 98004
| Company | Clyde Hill explicit | Medina explicit | Operates AT 98004 |
|---|---|---|---|
| THA | Implied (Eastside) | Implied | No (Seattle / West Seattle HQ) |
| Simply Clean | **YES** | **YES** | No (Seattle 98109) |
| JenyClean | **YES** | **YES** | **YES — office at 98004** |
| Bellevue Clean | **YES** | **YES** | Bellevue area |
| MaidPro | Unverified (blocked) | Unverified | — |
| The Cleaning Authority | NOT enumerated | NOT enumerated | No (Bellevue–Renton territory) |
| Merry Maids | Unverified (Bellevue franchise may be closed) | Unverified | — |
| Handy | Implied (US-wide) | Implied | n/a |
| NW Maids | Not enumerated, likely yes via Bellevue/Kirkland | Not enumerated | No |

**Finding:** **JenyClean is the only competitor with a physical office at 98004.** Simply Clean and Bellevue Clean are the only others to explicitly name Clyde Hill + Medina in coverage copy. The big franchises (Merry Maids, The Cleaning Authority) under-index on the premium Eastside microzip CLEENLY targets.

---

## CLEENLY positioning observation

**Internal CLEENLY pricing** (from `lib/pricing.ts`, with bathroom mult 1.15 for 2ba and condition mult 1.1 for "average" — the realistic default):

| Service | 2bd/2ba base | × 1.15 bath × 1.1 condition | Min–Max range (×1.2 max) |
|---|---|---|---|
| Regular | $200 | **$253** | **$253–$304** |
| Deep | $335 | **$424** | **$424–$508** |
| Move-out | $420 | **$531** | **$531–$638** |

(The brief's "$230-$280 / $385-$460 / $480-$580" range appears to be the base × bath only without condition mult, OR the "clean" condition rather than "average" default — worth double-checking which the customer sees first in the wizard.)

**Where CLEENLY sits vs each cluster:**

- **vs premium independents (Simply Clean, JenyClean, THA):** CLEENLY's 2bd/2ba regular at $253–$304 sits **ABOVE Simply Clean's recurring** ($193–$240 bi-weekly avg $217 for 2,000 sqft) and **ABOVE JenyClean's "from $147"** starting tier. CLEENLY's 2bd/2ba deep at $424–$508 sits **INSIDE Simply Clean's 2BR deep range** ($362–$672) and **ABOVE JenyClean's "from $375"** floor. CLEENLY's 2bd/2ba move-out at $531–$638 sits **BELOW Simply Clean's 2,000 sqft move-out** ($490–$1,013 avg $720) and **ABOVE JenyClean's "from $412"** floor. Net: CLEENLY is positioned mid-to-upper inside the premium-indie band — appropriate for the targeted Eastside, but the regular tier is the cluster where CLEENLY looks priciest vs published indie floors. For a 2bd/2ba in Bellevue, a price-shopping customer comparing CLEENLY's $253–304 regular to JenyClean's $147 and Simply Clean's $193–240 will see CLEENLY as a premium choice; the brand has to earn that gap. The "premium domestic stewardship" voice is the right narrative wrapper for it.

- **vs franchise mid-market (MaidPro, Merry Maids, The Cleaning Authority):** None publish prices, so direct comparison isn't possible. Market intel from Care.com (Bellevue $28-36/hr individual labor) implies franchise team-of-two visits land $80–120/hr × 2-3 hr ≈ $160-360 for a 2bd. CLEENLY's $253–304 regular probably overlaps the upper-middle of franchise pricing. The franchises' weakness is opacity + the Eastside premium-microzip gap (especially Merry Maids of Bellevue being possibly closed); CLEENLY's pricing is defensible IF the brand promise is delivered.

- **vs tech-forward (Handy, NW Maids):** Handy at "min 3 hours" with windows costing 30 minutes of booked time is a different product entirely — it competes on impulse / instant-book, not on stewardship. NW Maids' opaque "instant flat rate" calculator is a near-direct competitor in mechanism but their actual prices are hidden until lead capture. CLEENLY's `/pricing` page (if it publishes the actual ranges) would be MORE transparent than NW Maids — that's a positioning hook the brand should lean into.

**Two pricing-display recommendations from this teardown (not asked, but worth flagging):**

1. **Interior windows pricing is CLEENLY's biggest under-priced lever.** At $5/window vs market floor $15/window (JenyClean) and specialist $8-20, CLEENLY is leaving roughly $10/window of margin on the table on every Clyde Hill home. A 25-window Medina house = $250 of unrealized margin per deep clean. Consider $10/window as a still-aggressive-but-not-charity price point, or productize "All Windows Package" at flat $99/$149/$199 for sub-15/15-25/25+ window homes.

2. **CLEENLY is one of TWO Seattle-Eastside cleaners that should publish a transparent price matrix.** Simply Clean and JenyClean publish theirs; THA, MaidPro, Merry Maids, The Cleaning Authority, Bellevue Clean, NW Maids all gate prices behind forms. Joining the transparent two (and publishing more clearly than Simply Clean's frequency-matrix swamp) is a differentiator that aligns with the "domestic stewardship" voice. The brand promise "no surprise pricing" lives or dies on whether `/pricing` actually quotes numbers.

---

## Sources

**Premium independents:**
- THA House Cleaning — https://www.thacleaning.com/ · https://www.thacleaning.com/cost-housecleaning-bellevue-price-guide/ · https://www.thacleaning.com/house-cleaning-services-seattle/
- Simply Clean Seattle — https://www.seattlesimplyclean.com/seattle-house-cleaning-prices · https://www.seattlesimplyclean.com/residential/deep-cleaning · https://www.seattlesimplyclean.com/residential/custom-cleaning · https://www.seattlesimplyclean.com/bellevue/move-out-cleaning
- JenyClean — https://jenyclean.com/cities/bellevue/ · https://jenyclean.com/services/deep-cleaning/
- Bellevue Clean — https://bellevueclean.com/

**Franchise mid-market:**
- MaidPro Seattle–Bellevue — https://www.maidpro.com/seattle-bellevue (HTTP 403 / Cloudflare)
- The Cleaning Authority of Bellevue–Renton — https://www.thecleaningauthority.com/bellevue-renton/our-cleaning-services/house-cleaning/
- Merry Maids — https://merrymaids.com/home-cleaners-seattle-wa · https://www.merrymaids.com/bellevue/

**Tech-forward:**
- Handy — https://www.handy.com/services/cleaning-service · https://www.handy.com/services/home-cleaning
- NW Maids — https://nwmaids.com/locations/seattle/ · https://nwmaids.com/locations/kirkland/ · https://nwmaids.com/deep-cleaning/ · https://nwmaids.com/booking/
- Tidy.com (now property mgmt) — https://www.tidy.com/pricing · https://www.tidy.com/blog/how-much-does-maid-service-cost

**Market benchmarks (context, not competitors):**
- Rain City Maids guide — https://www.raincitymaids.com/seattle-house-cleaning-prices/
- Thumbtack national pricing — https://www.thumbtack.com/p/house-cleaning-prices
- Care.com Seattle/Bellevue hourly — https://www.care.com/cost/house-cleaning/seattle-wa
- West Seattle Window Cleaner pricing guide — https://www.westseattlewindowcleaner.com/post/how-much-does-window-washing-cost-in-seattle
