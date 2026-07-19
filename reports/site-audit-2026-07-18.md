# Cleenly site audit — 2026-07-18

Scope: this report consolidates 54 verified findings across seven audit dimensions (pricing, booking funnel, service catalog, SEO/structured data, notifications, chat/voice agents, and dead code) into a deduplicated, prioritized set of 21 distinct issues. Overlapping findings (e.g. the voice-agent stale prices, reported three times, and the "9 of 12 services can't be booked" dead end, reported four times) have been merged. The dominant theme is a single-source-of-truth failure: `lib/pricing.ts` and `lib/data/services.ts` are canonical, but the voice agent prompt, chat prompt, `llms.txt`, the `serviceFromPrice()` schema helper, and the booking wizard have all drifted out of sync — so a given price or service reads differently depending on which surface a customer or crawler lands on. Locations are cited as `file:line` or live URL; every finding below was independently confirmed against code and, where noted, against production.

## Executive summary

- **Voice phone agent quotes a discontinued, lower price set** ($165 minimum and $165/$250/$320 "from" prices) that is below the enforced $185 floor and contradicts every web surface — callers are told a price the business never charges. (`workers/voice-agent/src/prompt.ts:22-25`)
- **Voice agent's booking-lookup tool reads cents as dollars**, reading a $185 estimate aloud as "$18,500" — a 100x inflation delivered to returning callers. (`workers/voice-agent/src/tools.ts:129`)
- **9 of 12 marketed services cannot be booked.** Every service has a "Book This Service" CTA, but the wizard only offers Regular/Deep/Move-Out, so Airbnb, Move-In, Restorative, the two PNW protocols, etc. silently drop the user onto an empty step 1 — a conversion dead end on the funnel that advertises them.
- **The `serviceFromPrice()` helper collapses 12 services into 3 price buckets**, so city/service pages and their Service JSON-LD advertise "from $200" for services whose real floor is $290–$420, and the structured-data `offers.price` disagrees with the visible hero on 11 of 12 standalone pages — a Google structured-data consistency problem and an under-quote.
- **The served `llms.txt` ships stale prices (roughly half the real numbers), only 3 of 12 services, and a wrong `cleenly.com` contact domain**, feeding AI/agent surfaces bad data; a companion root file also points crawlers at a `/locations/[city]` path that 404s.
- **Payment messaging is self-contradictory:** the FAQ says cards aren't accepted yet while the Terms and Privacy pages commit to Stripe credit/debit card processing.
- **Several advertised floors sit below the stated hard $185 minimum** (Airbnb $125, Home Organization $140) or below any price the engine can actually compute ($200/$280 "from" figures), violating the project's own "never write starting at $X when the real price is higher" rule.
- **The chat prompt is stale** — it says "10 total" services but lists 12, still offers the removed PNW protocols as bookable, and quotes square-footage/condition multipliers that no longer match the calculator it directs customers to.

## Findings by severity

### Critical

**Voice phone agent quotes a discontinued, sub-floor price set**
- Location: `workers/voice-agent/src/prompt.ts:22-25`
- Surface: external
- What's wrong: The PRICING FACTS block reads verbatim "Regular cleaning from $165" (22), "Deep cleaning from $250" (23), "Move-out cleaning from $320" (24), "Minimum job is $165" (25). Every other surface uses a $185 minimum and higher "from" prices: `lib/pricing.ts` sets `MIN_JOB_CENTS = 18500` ($185) and `PRICE_DISPLAY.minJob = 185`, `firstClean.from = 200`, `moveOut.from = 280`; the chat prompt (`lib/chat/system-prompt.ts:121`) says "Minimum job: $185". The $165 minimum matches nothing in the codebase (even `recurring.from` is 185). The prompt's own header (line 6) admits "Facts … keep them in sync manually" — they are not in sync.
- Why it matters: The voice agent is a live customer surface. A caller is verbally quoted a floor $20 below the actual invoice minimum and per-service "from" numbers below the site, setting up a price the business never honors — a trust and dispute risk on every phone lead.
- Suggested fix: Replace the four numbers with the canonical values ($185 min, and the current per-service "from" figures), and ideally generate the PRICING FACTS block from `lib/pricing.ts` at build time so it cannot drift again.

### High

**Voice agent booking-lookup reads cents as dollars (100x inflation)**
- Location: `workers/voice-agent/src/tools.ts:129`
- Surface: external
- What's wrong: `lookupBooking` builds `estimate_range: `$${match.estimated_min}-$${match.estimated_max}`` with no `/100` conversion. `bookings.estimated_min/max` are stored in cents (`app/api/bookings/route.ts:110-111`, fed by `priceFromHours` which returns cents, e.g. `Math.max(hours*7500, 18500)`). Every other surface divides by 100. So the model is fed "estimate_range: $18500-$22200" and reads "$18,500 to $22,200" aloud for a $185–$222 job.
- Why it matters: A returning caller asking the phone agent about their estimate hears a number 100x too high. This is a live, model-callable tool (`TOOL_DEFINITIONS[0]`, `prompt.ts:17` instructs its use).
- Suggested fix: Divide `estimated_min`/`estimated_max` by 100 (or reuse `formatPrice`) before interpolating into `estimate_range`.

**`serviceFromPrice()` under-quotes specialty services and emits a JSON-LD offer price that disagrees with the visible hero**
- Location: `app/[city]/[service]/page.tsx:26-35`; `lib/utils/schema-generators.ts:10-19,72-74,149-151`
- Surface: external
- What's wrong: `serviceFromPrice()` only special-cases move-out/post-construction ($280) and bi-weekly/recurring ($185); everything else returns `firstClean.from` = $200. This drives the visible "Estimate from" (`page.tsx:134`), the title/meta (`page.tsx:57-58`), and the `Offer` JSON-LD price + description (`schema-generators.ts:72-74,149-151`). But `services.ts` prices Restorative $320–$750, Pollen Purge $295–$545, Damp-Season $285–$535, Pre-Event $235–$420, Post-Construction $420–$950. Live: `https://cleenly.app/tacoma/restorative-cleaning` renders "Estimate from $200" while `https://cleenly.app/services/restorative-cleaning` shows "$320–$750". Walking all 12 services, only bi-weekly matches; the JSON-LD `offers.price` mismatches the visible range on the other 11 (live-verified on `/services/pollen-purge`: visible "$295–$545" but `"price":200`).
- Why it matters: Same service, two contradictory prices; the site systematically under-quotes its highest-value services, and Google sees a structured-data price that contradicts on-page content on nearly every programmatic page.
- Suggested fix: Have `serviceFromPrice()` (and the JSON-LD generator) read each service's actual `priceFrom`/`priceRange` from `services.ts` instead of collapsing into three buckets.

**9 of 12 marketed services cannot be booked — CTAs dead-end on a 3-option wizard**
- Location: `components/booking/booking-wizard.tsx:32-42`; `components/booking/steps/step-service.tsx:16-39`; `app/(marketing)/services/page.tsx:116`; `app/(marketing)/services/[service]/page.tsx:106-110`; `app/[city]/[service]/page.tsx:197`
- Surface: external
- What's wrong: `StepService` offers only regular/deep/move_out, and `SERVICE_PARAM_MAP` whitelists only those slugs (+ their `-cleaning` variants). But `/services` maps all 12 services, each linking `/book?service=<slug>`, and every city/service page CTAs to `/book`. The other 9 slugs — move-in-cleaning, bi-weekly-service, home-organization, pre-event-cleaning, restorative-cleaning, airbnb-turnover, post-construction, damp-season-reset, pollen-purge — are unrecognized, so the user lands on step 1 with nothing pre-selected and the wanted service unavailable. The wizard comment at `booking-wizard.tsx:32-34` claiming PNW bundle slugs map to "deep cleaning with the protocol pre-selected as an add-on" is stale (those add-ons were removed from `VALID_ADDONS`).
- Why it matters: The marketing funnel advertises services the funnel itself cannot fulfill — a silent conversion dead end for two-thirds of the catalog.
- Suggested fix: Either implement selection for all catalogued services, or (short term) map each unbookable slug to its nearest bookable base service and pre-select it, and remove the stale comment.

**Homepage "Pacific Northwest Protocols" advertise Book buttons that dead-end**
- Location: `components/marketing/pricing-section.tsx:6,34-46` (rendered by `app/(marketing)/page.tsx:75`); `components/booking/booking-wizard.tsx:35-42`
- Surface: external
- What's wrong: `PROTOCOL_SLUGS = ['damp-season-reset','pollen-purge']` renders "Book The Damp-Season Reset"/"Book The Pollen Purge" buttons ($285/$295) on the homepage, linking (live-confirmed) to `/book?service=damp-season-reset` and `/book?service=pollen-purge`. Neither slug exists in `SERVICE_PARAM_MAP`, so both open on an empty step 1. These services are also still defined in `services.ts:272-333`, in `sitemap.ts:31`, and in the chat prompt (#11/#12) — a removal that left every surface except the wizard behind.
- Why it matters: The two services most prominently featured on the homepage cannot be booked; this is the same dead end as the finding above but on the highest-traffic page.
- Suggested fix: Decide whether the PNW protocols are live. If yes, wire them into the wizard; if no, remove them from the homepage, sitemap, chat prompt, and `services.ts`.

**Served `llms.txt` ships stale prices, only 3 services, and a wrong contact domain**
- Location: `public/llms.txt` (served at `https://cleenly.app/llms.txt`); companion `llms.txt:19-21,30` at repo root
- Surface: external
- What's wrong: The live file advertises Regular $100–$200, Deep $150–$300, Move-Out $200–$400 — roughly half the real numbers (first/deep from $200 ranging $290–$1,120; move-out from $280 ranging $380–$1,295; $75/cleaner-hour, $185 min), lists only 3 of 12 services, and gives a wrong contact domain (`cleenly.com` / `hello@cleenly.com`). A second, non-served root copy points agents at `https://cleenly.app/locations/[city]`, which 404s (`/locations` is a single page; `/locations/seattle` returns HTTP 404).
- Why it matters: `llms.txt` is the file AI assistants and agents read; it currently feeds them stale prices, a truncated catalog, and a dead contact domain.
- Suggested fix: Regenerate `public/llms.txt` from canonical pricing/services data, fix the contact domain, and delete or reconcile the stale root `llms.txt`.

**Payment acceptance is contradicted across FAQ, Terms, and Privacy**
- Location: `lib/faq-data.ts:283`; `app/(marketing)/terms/page.tsx:415`; `app/(marketing)/privacy/page.tsx:165-167,308-309,435-438`
- Surface: external
- What's wrong: The FAQ says cards aren't accepted yet, while Terms §8 states "Payment is processed securely through Stripe and accepts major credit and debit cards" and Privacy commits to Stripe card processing in three places (§2, §4, §6).
- Why it matters: Customers get a different answer about how they pay depending on which legal/help page they read; legal pages that overstate live capability carry compliance risk.
- Suggested fix: Determine the actual payment state and make FAQ, Terms, and Privacy agree on it.

### Medium

**Move-In falls through the move-out price guard → "from $200" instead of $280**
- Location: `app/[city]/[service]/page.tsx:28`; `lib/utils/schema-generators.ts:12`; `lib/data/services.ts:179-192`
- Surface: external
- What's wrong: The guard matches `move-out`/`move out`/`post-construction` but not `move-in`, so "Move-In Cleaning" returns `firstClean.from` = $200. But `services.ts` prices Move-In identically to Move-Out ($380–$1,295, `priceFrom` $280, "Same thoroughness as move-out"). Live `/seattle/move-in-cleaning` renders title/estimate/JSON-LD "from $200", $80 under its Move-Out twin, while `/services/move-in-cleaning` shows "$380–$1,295".
- Why it matters: A distinct matching bug that under-quotes Move-In on every city page and contradicts its own standalone hero.
- Suggested fix: Add `move-in` to the move-out price branch (covered automatically if `serviceFromPrice()` is switched to read real per-service prices).

**Regular/Deep cards and homepage floors ("from $200"/"from $280") sit below the $290/$380 ranges and below any computable estimate**
- Location: `lib/data/services.ts:33-36,81-84,132-135`; `components/shared/service-card.tsx:34`; `PRICE_DISPLAY.firstClean/moveOut`
- Surface: external
- What's wrong: Regular and Deep set `priceRange` "$290–$1,120" but `priceFrom` "$200"; ServiceCard/StepService render the $200/$280 "from" figures while detail heroes and `PRICE_DISPLAY.bySize['1']` show $290–350 / $380–455. Engine minimums confirm the floors are unreachable: studio deep = 2.9h × $75 ≈ $218 (×1.1 avg ≈ $239), studio move-out = 3.8h × $75 ≈ $285 — both above $200/$280. This trips the repo rule "NEVER write starting at $X when the real price is higher."
- Why it matters: The lowest advertised numbers correspond to no quote the calculator can produce, so customers anchor on a price they'll never be offered.
- Suggested fix: Set the advertised "from" figures to the true minimum the engine can compute for each service (or reconcile `priceFrom` with `priceRange`).

**Airbnb ($125) and Home Organization ($140) advertise floors below the hard $185 minimum, and the card contradicts its own hourly math**
- Location: `lib/data/services.ts:213-215,261-264`; `components/shared/service-card.tsx:34,67`
- Surface: external
- What's wrong: Airbnb Turnover `priceFrom` "$125", Home Organization `priceRange` "$140–$260" — both below the "$185. No visit is priced below $185" floor the chat prompt asserts. The card also shows "$125 estimate · 1–2 hours · billed by the hour, $75/cleaner-hour"; a two-cleaner team at $75/cleaner-hour for 1–2 hours cannot yield $125.
- Why it matters: The advertised copy undercuts the business's own stated minimum and is internally arithmetically impossible.
- Suggested fix: Raise both floors to at least $185 (or the real computed minimum) and reconcile the hours × rate framing on the card.

**`/services` says "Three service levels" but renders all 12 cards**
- Location: `app/(marketing)/services/page.tsx:9-10,54,73`
- Surface: external
- What's wrong: The hero (line 54) says "Three service levels designed for your home's needs" and the metadata title (line 9) scopes to "Regular, Deep, Move-Out", but line 73 maps the full 12-entry services array with no filter, rendering all cards (Move-In, Bi-Weekly, Home Organization, Pre-Event, Restorative, Airbnb, Post-Construction, and both PNW protocols).
- Why it matters: The page's own framing contradicts what it displays, and the SEO title misrepresents the catalog.
- Suggested fix: Either update the hero/metadata to reflect the full catalog, or filter the grid to the three levels the copy promises.

**Chat prompt is stale: "10 total" but 12 services, removed PNW protocols still offered, wrong sqft/condition multipliers**
- Location: `lib/chat/system-prompt.ts:62,103-107,115-116`
- Surface: external
- What's wrong: Line 62 declares "SERVICES (10 total)" but the list runs 1–12, including #11 Damp-Season Reset and #12 Pollen Purge presented as bookable via `cleenly.app/book` (where they don't exist). Line 115 states sqft multipliers "+10%/+20%/+35%" but `pricing.ts` `sqftMultiplier` is +5%/+10%/+18%/+22%; line 116 says condition "+25%" vs the engine's `needs_work` +22%.
- Why it matters: The customer-facing bot quotes a service count, a catalog, and pricing math that no longer match the calculator it points people to.
- Suggested fix: Regenerate the services list and pricing-logic lines from canonical data; fix the "10 total" header.

**FAQ promises a "choose your cleaner during booking" feature the wizard doesn't have**
- Location: `lib/faq-data.ts:110-112`
- Surface: external
- What's wrong: The FAQ says "During booking, you'll see if your preferred cleaner is available … you can choose another cleaner or wait." The 6-step wizard (Service, Details, Price, Schedule, Contact, Confirmation) has no cleaner-selection step and no availability display; `cleaner_id` is a manual admin assignment. A second FAQ answer (`faq-data.ts:203-205`) correctly hedges ("tell us at booking or by email … we try to send the same cleaner"), so the two answers disagree.
- Why it matters: Overpromises a self-serve capability that doesn't exist, setting a false expectation at the point of booking.
- Suggested fix: Rewrite `110-112` to match the actual "request, admin-assigned" flow described at `203-205`.

**Cleaner-application alert is fire-and-forget — the serverless-freeze bug the booking route was already fixed for**
- Location: `app/api/cleaner-applications/route.ts:160-172`
- Surface: internal
- What's wrong: The route calls `notifyNewApplication({...}).catch(...)` and returns without awaiting. `app/api/bookings/route.ts:259-267` was deliberately switched to `await Promise.allSettled([...])` with the comment that on Vercel the function is frozen once the response is sent, cutting off fire-and-forget sends (especially slower Resend emails). The application handler has the identical Telegram + Resend send but does not await it.
- Why it matters: New cleaner-application alerts to the owner can be silently dropped after the HTTP response returns.
- Suggested fix: Await the notification (mirror the `Promise.allSettled` pattern from the booking route).

**New-application owner alert links to `/admin/applications/{id}`, a route that 404s**
- Location: `lib/notifications.ts:358,377`
- Surface: internal
- What's wrong: `notifyNewApplication` builds the Telegram and email "Open in admin" link as `${SITE_URL}/admin/applications/${a.id}`. `app/admin` has only `page.tsx`, `bookings`, `cleaners`, and `finance` — no `applications` route. The booking alert (`notifications.ts:329`) correctly links to the existing `/admin/bookings/${b.id}`.
- Why it matters: The owner clicking the link in a new-applicant alert hits a 404.
- Suggested fix: Point the link at the real applications view (or build one), or link to the admin list.

### Low

**FAQ cleaning-duration labels drift from `services.ts` and the chat prompt**
- Location: `lib/faq-data.ts:179`
- Surface: external
- What's wrong: The FAQ says "Regular cleaning: 1.5–3 hours … Move-out cleaning: 4–7 hours." `services.ts` gives regular "2–3 hours" (line 37) and move-out "4–6 hours" (line 136), matching the chat prompt. Deep (3–5) is consistent; the regular lower bound and move-out upper bound each differ by an hour.
- Why it matters: Minor customer-visible inconsistency in how long a job takes.
- Suggested fix: Align the FAQ durations with `services.ts`.

**Laundry add-on is priced, validated, and advertised but not selectable in the wizard**
- Location: `components/booking/steps/step-price.tsx:45`; `lib/pricing.ts:129-158`; `lib/chat/system-prompt.ts:117,199`
- Surface: external
- What's wrong: The add-on step renders only `standardAddonIds = ['fridge','oven','cabinets']`, but "laundry" is a full first-class add-on in `addonPrices` (2500), `addonInfo` ("+$25/load"), and the server's `VALID_ADDONS`, and the chat FAQ tells customers laundry "$25/load" appears in the booking calculator.
- Why it matters: A customer told by chat that laundry is a calculator add-on won't find it there. (Distinct from the PNW add-ons, which were intentionally removed everywhere; laundry remains everywhere except the UI.)
- Suggested fix: Add `laundry` to `standardAddonIds`, or remove the laundry claim from chat/pricing if it's discontinued.

**Leftover "evening" time-slot label after the slot was removed**
- Location: `components/booking/steps/step-confirmation.tsx:16-20`
- Surface: internal
- What's wrong: `timeSlotLabelsShort` still contains `evening: '4pm – 7pm'` although the evening slot was removed 2026-06-10 (`step-schedule.tsx` offers only morning/afternoon; `route.ts` `VALID_TIME_SLOTS` dropped evening). Cosmetically, `step-schedule.tsx:113` also lays out two slots in a `grid-cols-3` grid.
- Why it matters: Stale label for a retired slot the business no longer staffs; the grid layout is a minor visual defect.
- Suggested fix: Remove the evening label (kept only for the legacy `TimeSlot` type) and change the grid to two columns.

**`/how-it-works` has no self-canonical and breaks the title convention**
- Location: `app/(marketing)/how-it-works/page.tsx:7-10`
- Surface: external
- What's wrong: The metadata sets only title/description with no `alternates.canonical`, and the live head emits no `<link rel="canonical">`, while `/about`, `/faq`, `/pricing`, `/services` all set self-canonicals. Its title "How It Works — Cleenly" also diverges from the site-wide "… | CLEENLY" pattern.
- Why it matters: Minor SEO/branding inconsistency; missing canonical on one indexable page.
- Suggested fix: Add `alternates.canonical` and align the title to the "| CLEENLY" convention.

**Bothell/Woodinville region drift: "Eastside" vs "North Sound"**
- Location: `lib/data/regions.ts` vs `lib/data/city-hero-variants.ts`
- Surface: internal
- What's wrong: `regions.ts` groups bothell/woodinville under "Eastside" (used by `/locations`), while `city-hero-variants.ts` `CITY_GROUPS.northSound` includes them (used by `city-hero.tsx`), so those city pages get North Sound hero copy but `/locations` files them under Eastside. Separately, the "North Sound" description says "Shoreline to Everett" though Shoreline is in the "Seattle Area" group (weaker nitpick).
- Why it matters: Cross-file inconsistency in how two cities are regionally presented across live surfaces.
- Suggested fix: Pick one region for Bothell/Woodinville and align both files; reword the North Sound corridor phrase.

**Project `CLAUDE.md` documents pricing multipliers that no longer exist**
- Location: `.claude/CLAUDE.md` ("Pricing Logic (lib/pricing.ts)" section)
- Surface: internal
- What's wrong: The doc lists bedroom 0.8x–1.6x and bathroom 0.9x–1.3x multipliers and condition standard/needs-extra-work 1.0x/1.25x. The engine uses absolute `baseManHours` per bedroom, `bathroomMultiplier` {1:1.0 … 3.5+:1.3}, `conditionMultiplier` {clean:1.0, average:1.1, needs_work:1.22}, plus an undocumented `sqftMultiplier`.
- Why it matters: Stale internal documentation misleads future changes to the pricing engine.
- Suggested fix: Rewrite the section to match the current `lib/pricing.ts` model.

## Counts

By severity:

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 6 |
| Medium | 8 |
| Low | 6 |
| **Total** | **21** |

By surface:

| Surface | Count |
|---------|-------|
| External (customer/crawler-facing) | 16 |
| Internal (code/ops/docs) | 5 |
| **Total** | **21** |
