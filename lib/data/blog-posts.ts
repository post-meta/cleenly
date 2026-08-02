// Blog post data.
//
// Topic selection is not editorial taste. Each of the posts added 2026-08-01
// targets a cluster where GSC already shows impressions and no clicks — the
// frequency cluster alone carries 575 impressions at an average position of 40
// across 61 queries. The posts are the informational front door to those
// commercial queries, and `related` points out of each one into the page that
// closes the question.
//
// Rule for anything added here: no claim about our own volume, history, or
// customers. Six invented specifics were removed from the first three posts on
// 2026-07-31 ("hundreds of move-out cleanings", "most-cited deposit
// deduction"). Prices come from lib/pricing.ts and nowhere else.
//
// Each post has structured sections (no markdown parser needed).
// Add a post by appending an entry; it auto-appears on /blog and gets
// statically generated at build time.

export interface BlogSection {
    heading?: string;
    paragraphs: string[];
    bullets?: string[];
}

/** A pointer out of the post into the page that answers it. */
export interface BlogLink {
    label: string;
    href: string;
}

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string; // ISO date
    readingMinutes: number;
    shortVersion: string;
    sections: BlogSection[];
    /**
     * Where a reader who is convinced should go next. Also the only internal
     * links these posts have: until 2026-08-01 the blog pointed nowhere, and
     * Google had never even crawled the hub.
     */
    related?: BlogLink[];
}

export const blogPosts: BlogPost[] = [
    {
        slug: "move-out-cleaning-what-landlords-actually-inspect",
        title: "Move-out cleaning: what your landlord actually inspects",
        excerpt: "A practical list of what gets checked at move-out and what doesn't — so you spend money on the things that affect your deposit, not the ones that don't.",
        publishedAt: "2026-05-01",
        readingMinutes: 6,
        shortVersion: "Landlords mostly inspect kitchen appliances inside and out, bathroom grout and fixtures, walls for damage beyond normal wear, and floors. They rarely inspect things tenants stress about: dust on top of fans, the inside of your closet rod, the back of the toilet tank. Spend your cleaning budget where it gets graded.",
        sections: [
            {
                paragraphs: [
                    "Most renters going through a move-out clean spend the most effort on the wrong areas. Not because the wrong areas are dirty — they're often the cleanest. But because the cleaning industry sells \"deep clean\" as an exhaustive checklist, and your landlord isn't grading the same checklist your cleaner is.",
                    "Landlords work from a short, predictable list, and most of it has nothing to do with what online checklists emphasize.",
                ],
            },
            {
                heading: "What landlords actually inspect",
                paragraphs: [
                    "Property managers and landlords work fast. A typical inspection is 15-30 minutes for a 1-2 bedroom unit. They aren't running a white-glove test — they're checking the same handful of failure points, in the same order, every time.",
                ],
                bullets: [
                    "Kitchen: inside oven, inside fridge, inside microwave, top of range hood, around the burners, the seal around the dishwasher, the inside of the dishwasher",
                    "Bathroom: grout discoloration in the shower, the area behind the toilet, hard-water buildup on the showerhead and faucets, the exhaust fan cover",
                    "Walls: holes from picture hooks, scuffs at child or chair height, marks above the kitchen counter",
                    "Floors: condition of carpets in high-traffic paths and around the bed, condition of hardwood under the dining table, scratches at the entry door",
                    "Windows: tracks (especially sliding patio doors), the bottom inch of the glass on inside windows",
                    "Closets: floor and shelves, door tracks, any forgotten items",
                ],
            },
            {
                heading: "What they almost never inspect",
                paragraphs: [
                    "These get cleaned on a thorough job — they're not skipped. But they don't drive deposit decisions, and we mention this so you know not to obsess over them:",
                ],
                bullets: [
                    "Top of the refrigerator (out of sight)",
                    "Back of the stove (only checked if the stove is pulled out, which most landlords don't do)",
                    "Inside the toilet tank",
                    "Light bulbs (working/not working is checked, but not cleaned)",
                    "Dust on top of door frames or ceiling fans",
                    "The inside of cabinets unless tenants left items behind",
                ],
            },
            {
                heading: "The two things that swing deposits",
                paragraphs: [
                    "If you only have time to focus on two areas before move-out, focus on these two — they are what a walkthrough lingers on:",
                    "First: the kitchen. The inside of the oven, the inside of the fridge, and grease on the range hood. These are visible, slow to clean, and create the strongest impression in the first 60 seconds of a walkthrough. A spotless kitchen sets the tone for the entire inspection.",
                    "Second: the bathroom grout and shower. Hard-water buildup, mildew at the bottom of the shower wall, and discolored grout are the things landlords photograph for deposit deductions because they're documented and unambiguous. A scrub here pays for itself.",
                ],
            },
            {
                heading: "Things to do that aren't cleaning",
                paragraphs: [
                    "Two non-cleaning steps protect your deposit more than most cleaning steps:",
                ],
                bullets: [
                    "Take photos of every room with timestamps the day you hand back the keys. Wide shots and close-ups of any wear. This is your evidence if there's a dispute.",
                    "Be present for the walkthrough if you can. Most landlords are reasonable when you're standing there. Most disputes happen when the inspection is solo and emotional.",
                ],
            },
            {
                heading: "When to hire a cleaner vs. do it yourself",
                paragraphs: [
                    "If you're moving with help and have a free day, doing the move-out cleaning yourself can save $200-$400. The areas that take the longest are the oven, fridge, and bathroom grout — budget 4-5 hours for a 2-bedroom.",
                    "Hire a cleaner if: the unit hasn't been deep-cleaned in 6+ months, you have a tight move-out window, you have pets (pet hair is the hardest thing on the list to fully remove without the right tool), or you have a security deposit larger than the cost of cleaning. Math is straightforward — if cleaning costs less than the deposit you might lose, hire.",
                ],
            },
        ],
    },
    {
        slug: "deep-clean-vs-regular-clean",
        title: "Deep clean vs. regular clean: when do you actually need each?",
        excerpt: "The difference isn't about effort or quality. It's about which surfaces get touched. A practical guide to picking the right service so you don't overpay or under-clean.",
        publishedAt: "2026-05-01",
        readingMinutes: 5,
        shortVersion: "Regular cleaning maintains a home that's already in good shape. Deep cleaning resets a home that's been let go, or hits the buildup areas (inside appliances, baseboards, behind furniture) that regular cleaning skips. Most homes need a deep clean every 6 months and regular cleaning between.",
        sections: [
            {
                paragraphs: [
                    "Cleaning services usually offer at least two tiers, and the names get confusing fast. \"Deep,\" \"detailed,\" \"premium,\" \"thorough\" — they mostly mean the same thing, but the price gap is 50-100%. Worth understanding what you're paying for.",
                ],
            },
            {
                heading: "What regular cleaning actually does",
                paragraphs: [
                    "Regular cleaning maintains. It assumes your home is already in reasonable shape and resets the surfaces that get used daily.",
                ],
                bullets: [
                    "Dusting visible surfaces — countertops, side tables, shelves, dressers",
                    "Vacuuming carpets and rugs in main rooms and traffic paths",
                    "Mopping hard floors after vacuuming",
                    "Kitchen: counters, sink, outside of appliances, stovetop",
                    "Bathrooms: toilet, shower, sink, mirror",
                    "Making beds, emptying trash, basic tidying",
                ],
            },
            {
                heading: "What deep cleaning adds",
                paragraphs: [
                    "Deep cleaning gets the buildup areas. These are surfaces that don't need attention every week — but they accumulate over months and get visibly grimy if ignored.",
                ],
                bullets: [
                    "Inside the oven, inside the fridge, inside the microwave",
                    "Baseboards (the strip where the wall meets the floor)",
                    "Window sills and the inside tracks of windows",
                    "Behind and under furniture that can be moved (couch, bed, dining chairs)",
                    "Door frames and the tops of doors",
                    "Light fixtures and ceiling fans",
                    "Cabinet fronts (a detailed wipe, not a casual one)",
                ],
            },
            {
                heading: "How to decide which one you need",
                paragraphs: [
                    "Two questions tell you almost always:",
                    "First: when was the last time someone deep-cleaned this home? If it's been six months or more, get a deep clean. If less, regular is fine.",
                    "Second: how does the kitchen look? Specifically, the front of the lower cabinets near the trash can, the sides of the stove, the top of the range hood. If those areas have visible buildup, you need a deep clean — regular cleaning won't catch them.",
                    "If you're moving in or moving out, always go with deep or move-out cleaning. The marginal cost is small, and you only do this once.",
                ],
            },
            {
                heading: "The honest case for both",
                paragraphs: [
                    "Most homes do well on a 6-month cycle: one deep clean (March, September) plus regular cleaning every 1-2 weeks between. The deep clean catches buildup before it becomes a stain that doesn't come out. The regular cleaning keeps the surface fresh.",
                    "Skipping the deep clean and only doing regulars works for the first six months. By month nine, you'll notice the kitchen and bathroom edges look tired even after a regular clean. That's the buildup signal — book the deep clean.",
                ],
            },
        ],
    },
    {
        slug: "pet-hair-where-it-actually-hides",
        title: "Pet hair: where it actually hides and why most cleaners miss it",
        excerpt: "Pet hair is why a clean can look finished and still feel unfinished. The reason is geometry — a standard vacuum pass gets the easy part. Here's where the rest of it lives.",
        publishedAt: "2026-05-01",
        readingMinutes: 4,
        shortVersion: "Pet hair hides in five places that vacuums skip without specific technique: under the lower edge of upholstered furniture, in the seam between cushions, on the sides of bedding, embedded in rug fibers (not on top), and around the legs of dining chairs. A cleaning that skips those five areas looks finished and feels unfinished as soon as you sit down on the couch.",
        sections: [
            {
                paragraphs: [
                    "Pet owners notice what non-pet-owners don't. The ankle test — running your hand along the side of the couch — finds hair that vacuums don't. That's not the cleaner being lazy. It's geometry plus the wrong tool.",
                ],
            },
            {
                heading: "The five places pet hair lives that most cleans miss",
                paragraphs: [
                    "A standard vacuum pass picks up surface hair on flat carpet and most rugs. It does not reliably get the following five locations. Most weekly cleanings skip them unless the cleaner specifically targets pet homes.",
                ],
                bullets: [
                    "The bottom 2 inches of upholstered furniture sides and back, where the fabric meets the floor — vacuum hose nozzles can't reach the corner geometry without dedicated technique",
                    "The crevice between seat cushions and the back of couches, where shed hair settles and felts together over days",
                    "The sides of bedding and the inside fold of duvet covers, especially if a pet sleeps on or near the bed",
                    "Embedded rug fibers, not the surface — pet hair works downward into rug pile and a normal vacuum stroke doesn't lift it. A rubber-bristle pet attachment or a dampened rubber glove pulls it out",
                    "Around the legs of dining chairs and bar stools, where hair circulates with foot traffic and re-deposits in a circle pattern around each leg",
                ],
            },
            {
                heading: "Why a normal vacuum doesn't fix this",
                paragraphs: [
                    "Vacuums move air. Pet hair, especially from cats and short-haired dogs, has microscopic barbs that grip fabric. The hair is held in place mechanically, not just sitting on the surface. Air flow alone doesn't break that grip on upholstery or in rug pile.",
                    "What works is friction — a rubber tool that grabs the hair and lifts it. A rubber-bristle pet attachment on a vacuum, a damp microfiber cloth, or even a rubber glove rubbed across upholstery in one direction. The tool matters more than the suction.",
                ],
            },
            {
                heading: "What to ask a cleaner if you have pets",
                paragraphs: [
                    "If you're booking a cleaning and you have pets, two questions tell you whether this cleaner will get it right:",
                ],
                bullets: [
                    "\"Do you bring a rubber pet-hair tool, or just a vacuum?\" The right answer is: yes, we bring one, or we ask if you have one we can borrow. The wrong answer is silence.",
                    "\"Do you address the sides of the couch and the seat-cushion crevices?\" The right answer is: yes, that's a specific pass we do on every visit. The wrong answer is: we vacuum everything.",
                ],
            },
            {
                paragraphs: [
                    "If you have pets, add one line to your booking notes: \"please use a rubber tool on the couch and rug.\" It gets the right tool in the door instead of leaving it to chance.",
                ],
            },
        ],
    },
    {
        slug: "how-often-should-you-have-your-house-cleaned",
        title: "How often should you have your house cleaned?",
        excerpt: "Weekly, every two weeks, monthly, or just once. The interval comes from four things about your household — not from what a cleaning company would rather sell you.",
        publishedAt: "2026-08-01",
        readingMinutes: 6,
        shortVersion: "Every two weeks is the interval this work is built around. Weekly earns its cost when you have pets, small children, or someone home all day. Monthly works for one or two tidy people, but each visit has to be longer to make up the gap. Pick the interval from how fast your kitchen and bathrooms turn, and change it once you see how the house holds.",
        sections: [
            {
                paragraphs: [
                    "There is no correct interval. There is only how fast your particular home goes from clean to not-clean, and that varies more between two houses on the same street than between two neighbourhoods.",
                    "The useful way to decide is to stop thinking about a schedule and start thinking about two rooms. Kitchens and bathrooms set the pace. Bedrooms and living rooms tolerate a long gap; a shower does not. If you know how those two rooms behave in your house, you know your interval.",
                ],
            },
            {
                heading: "Four things that set the pace",
                paragraphs: [
                    "These four account for most of the difference between two homes of the same size. Count yours before you pick a frequency.",
                ],
                bullets: [
                    "People and pets per square foot. Four people in 1,100 square feet generate more than two people in 2,400. A shedding dog counts roughly like an extra person.",
                    "Whether shoes come off at the door. This one is close to a switch. A shoes-off house keeps floors presentable two to three times longer, and Pacific Northwest streets are wet most of the year.",
                    "Whether the house is occupied during the day. A home office in daily use means a kitchen used three times a day instead of once, and a bathroom used all day rather than twice.",
                    "Hard floors versus carpet. Hard floors show dust sooner and clean faster. Carpet hides it and holds it. The one that looks dirty first is not the one that is dirty first.",
                ],
            },
            {
                heading: "Every two weeks",
                paragraphs: [
                    "This is the interval the work is designed around, and it is the sensible place to start. Two weeks is short enough that nothing has time to bond to a surface — soap film wipes off instead of needing to be dissolved, kitchen grease is still soft, grout has not started to shade.",
                    "The practical test: if your bathroom looks fine on day ten and questionable on day fourteen, every two weeks is your answer. You are cleaning just before the point where it gets harder.",
                ],
            },
            {
                heading: "Weekly",
                paragraphs: [
                    "Weekly is not twice the cleaning. It is a different relationship with the house. Nothing accumulates, so each visit is lighter, and the home stays at a level that a fortnightly schedule touches only on the day itself.",
                    "It earns the difference in three situations: a shedding pet, children under about six, or a household where someone is home all day. In all three the load is continuous rather than occasional, and two weeks is long enough for it to become work rather than upkeep.",
                ],
            },
            {
                heading: "Monthly",
                paragraphs: [
                    "Monthly is a real option and it suits a specific household: one or two adults, out most of the day, no pets, shoes off. Under those conditions thirty days does less damage than you would think.",
                    "The honest part is that a monthly visit cannot be a lighter visit. Thirty days puts down a film in the kitchen and hard-water marks in the shower that fourteen days does not, and both take longer to remove than to prevent. A monthly clean that is priced and scheduled like a fortnightly one will leave you disappointed at the edges.",
                ],
            },
            {
                heading: "Not on a schedule at all",
                paragraphs: [
                    "Sometimes the interval is the wrong question. A one-off makes more sense when the trigger is an event rather than a rhythm — before family arrives, after a renovation, at the end of a lease, or when a house has simply got away from you and needs a reset before any schedule would help.",
                    "In that case book the reset first and decide about a rhythm afterwards, once you can see what the house looks like maintained.",
                ],
            },
            {
                heading: "What it costs to guess wrong",
                paragraphs: [
                    "Very little, which is the point. Recurring visits with us start at $185, the first visit is priced as a deep clean because it is heavier, and you can reschedule or cancel free up to 24 hours before a visit.",
                    "Start at every two weeks. After three visits you will know whether the house is arriving at each one already tired, which means go weekly, or still looking fine, which means you can stretch. That is a better answer than any rule of thumb, including this one.",
                ],
            },
        ],
        related: [
            {
                label: "Bi-weekly service",
                href: "/services/bi-weekly-service",
            },
            {
                label: "Regular cleaning",
                href: "/services/regular-cleaning",
            },
            {
                label: "See your price",
                href: "/book",
            },
        ],
    },
    {
        slug: "monthly-cleaning-what-it-holds",
        title: "Monthly cleaning: what it holds, and when it stops being enough",
        excerpt: "Thirty days is a long time in a kitchen. What a monthly clean can realistically keep on top of, the three signs it has stopped working, and why the visit has to be longer than a fortnightly one.",
        publishedAt: "2026-08-01",
        readingMinutes: 6,
        shortVersion: "Monthly suits one or two adults who are out during the day, with no pets and shoes off at the door. It stops working when the shower needs scrubbing rather than wiping, when the kitchen has a film you can feel, or when the visit keeps running long. A monthly visit takes longer than a fortnightly one, because thirty days lets things bond that fourteen days does not.",
        sections: [
            {
                paragraphs: [
                    "Monthly is the cheapest schedule that still counts as having a cleaner, which is why it is the one people hope will work. For the right household it does.",
                    "It also has a clear failure mode, and it is worth knowing what that looks like before you are in it rather than after.",
                ],
            },
            {
                heading: "What thirty days does that fourteen does not",
                paragraphs: [
                    "The difference is not quantity. It is chemistry. Most household soil is easy to remove while it is still loose and difficult once it has bonded to the surface, and the crossover happens somewhere in the third and fourth week.",
                ],
                bullets: [
                    "Kitchen: airborne cooking grease settles on cabinet fronts and the wall behind the range as a film. At two weeks it wipes off. At four it needs a degreaser and a second pass.",
                    "Shower: soap and minerals from hard water build in layers. Early it is a wipe. Later it is a scrub, and later still it stops coming off entirely and becomes etching.",
                    "Toilet and sink: the mineral ring at the waterline is the clearest thirty-day marker in the house. It does not appear at two weeks.",
                    "Floors: grit gets walked into hard floors and ground in. What would have been a mop becomes a mop plus edges and corners.",
                    "Dust: not really a timing problem. Dust behaves about the same at two weeks and four. It is the only thing on this list that does not punish you for waiting.",
                ],
            },
            {
                heading: "Three signs monthly has stopped being enough",
                paragraphs: [
                    "Any one of these on its own is worth acting on. Two together means the interval is fighting you.",
                ],
                bullets: [
                    "The shower needs scrubbing rather than wiping. This is the earliest reliable signal, and the one that costs the most to ignore, because mineral buildup eventually stops being reversible.",
                    "You can feel a film on the kitchen cabinet doors near the range. Sight is a poor test here; touch is accurate.",
                    "You find yourself tidying properly the night before the cleaner comes — not putting things away, but actually cleaning. That means the visit is no longer covering the gap, and you have quietly become the person filling it.",
                ],
            },
            {
                heading: "Why a monthly visit costs more than a fortnightly one",
                paragraphs: [
                    "Per visit, not per month. A home cleaned every two weeks arrives at each visit already close to where it should be, so the visit is maintenance. A home cleaned every thirty days needs part of every visit spent undoing the extra sixteen days before any maintenance starts.",
                    "This is also why the arithmetic rarely favours monthly as strongly as it looks. Two lighter visits and one longer visit can land closer together than people expect, and the fortnightly home spends the whole month in better condition rather than half of it.",
                ],
            },
            {
                heading: "Who monthly genuinely suits",
                paragraphs: [
                    "One or two adults, out of the house during the working day, no pets, shoes off at the door, and a preference for hard floors over carpet. Under those conditions the house generates slowly enough that thirty days is inside the easy window rather than past it.",
                    "It also suits a second home, a property between tenancies, or any house that is simply not being lived in hard. Occupancy matters more than square footage.",
                ],
            },
            {
                heading: "A third option",
                paragraphs: [
                    "If monthly is nearly working, the fix is usually not to jump to fortnightly. It is to keep the monthly rhythm and let one visit a year be a proper deep clean — the one that resets the shower, the inside of the oven, the baseboards, and everything else that a maintenance visit is not scoped to reach.",
                    "That keeps the running cost close to where you wanted it while stopping the slow accumulation that eventually makes monthly untenable. Recurring visits start at $185; a deep clean starts at $290 and is priced by the size and condition of the home.",
                ],
            },
        ],
        related: [
            {
                label: "Regular cleaning",
                href: "/services/regular-cleaning",
            },
            {
                label: "Deep cleaning",
                href: "/services/deep-cleaning",
            },
            {
                label: "Prices",
                href: "/pricing",
            },
        ],
    },
    {
        slug: "why-the-first-cleaning-costs-more",
        title: "Why the first cleaning costs more than the ones after it",
        excerpt: "Nearly every cleaning company charges more for the first visit, and the reason is simpler than it looks. What the first clean reaches, what it costs, and when it isn't heavier at all.",
        publishedAt: "2026-08-01",
        readingMinutes: 5,
        shortVersion: "The first visit is priced as a deep clean because it is one. It reaches the places a maintenance visit is not scoped to touch — inside appliances, baseboards, window tracks, behind furniture — and those have been accumulating for as long as the house has gone without them. First and deep cleans start at $290. Recurring visits after that start at $185.",
        sections: [
            {
                paragraphs: [
                    "You get a quote for a recurring clean, and the first visit is noticeably more than the number you were expecting to pay every two weeks. It reads like a setup fee, or like the price will keep moving.",
                    "It is neither. The first visit is a different job, and it is worth understanding the difference, because it also tells you what you are buying afterwards.",
                ],
            },
            {
                heading: "Maintenance assumes a starting point",
                paragraphs: [
                    "A recurring clean is priced on the assumption that the home is already close to where it should be. It keeps a line that has already been drawn. That is what makes it quick and what makes it affordable.",
                    "The first visit has no such starting point. Whatever the house has accumulated since the last thorough clean — six months, two years, since it was built — is still there, and it has to be dealt with once before maintenance means anything. Cleaning a maintained home and resetting an unmaintained one are not the same task with different amounts of effort. They are different tasks.",
                ],
            },
            {
                heading: "What the first visit reaches",
                paragraphs: [
                    "These are the areas a maintenance visit does not include, and where nearly all of the extra time goes.",
                ],
                bullets: [
                    "Inside the oven, the refrigerator, and the microwave",
                    "Baseboards throughout, which are slow because they are hand work at floor level",
                    "Window sills and the tracks, which hold grit and, in this climate, damp",
                    "Door frames and the tops of doors",
                    "Light fixtures and ceiling fan blades",
                    "Behind and under furniture that can be moved",
                    "Cabinet fronts, properly, rather than a pass",
                ],
            },
            {
                heading: "The numbers",
                paragraphs: [
                    "A first or deep clean starts at $290 and is estimated from the size of the home, the number of bathrooms, the square footage, and the condition it is in. A one-bedroom runs $290–350; a three-bedroom runs $545–650.",
                    "Recurring visits from the second one onward start at $185, and most homes sit between $185 and $305 depending on size. The gap between the two numbers is the whole point: you pay once to draw the line, then pay less to hold it.",
                    "You see the estimate before you book, and the final price never goes above the top of it.",
                ],
            },
            {
                heading: "When the first visit is not heavier",
                paragraphs: [
                    "Sometimes it genuinely is not, and it is worth saying so before you book rather than after.",
                ],
                bullets: [
                    "The home was deep cleaned recently by someone else and has been maintained since.",
                    "It is new construction that has already had its post-construction clean.",
                    "It is a small, lightly occupied space — a studio used a few nights a week does not accumulate like a family home.",
                    "You are moving out rather than starting a schedule. That is a move-out clean, priced from $380, and a different scope again: it includes the insides of cabinets and closets, because the unit is being handed back empty.",
                ],
            },
            {
                heading: "What this means when you book",
                paragraphs: [
                    "Tell the truth about the condition of the home in the booking form. Under-describing it does not make the visit cheaper — it makes the estimate wrong, and an estimate that is wrong helps nobody.",
                    "If the home turns out to need more than described, we call before we start rather than after we finish. And the price you were shown is a ceiling, not an opening position.",
                ],
            },
        ],
        related: [
            {
                label: "Deep cleaning",
                href: "/services/deep-cleaning",
            },
            {
                label: "How pricing works",
                href: "/pricing",
            },
            {
                label: "See your price",
                href: "/book",
            },
        ],
    },
    {
        slug: "airbnb-turnover-same-day-changeover",
        title: "Airbnb turnover: what a same-day changeover actually needs",
        excerpt: "Checkout at 11, check-in at 3. What fits in that window, why laundry decides everything, and how to brief a cleaner so nothing needs a second trip.",
        publishedAt: "2026-08-01",
        readingMinutes: 6,
        shortVersion: "A same-day changeover is a deadline with a cleaning job inside it. Laundry is almost always the binding constraint, not the cleaning — which is why two sets of linens per bed is the single highest-value thing a host can buy. Brief the cleaner on the restock list and the check-in time, not on the cleaning.",
        sections: [
            {
                paragraphs: [
                    "Turnover cleaning gets described as regular cleaning done faster. It is not. A guest-ready unit has requirements a lived-in home does not — nothing personal left behind, consumables restocked, linens fresh, and every surface photographable — and all of it has to happen inside a fixed window that someone else set.",
                    "Miss the window and the cost is not a rescheduled visit. It is a guest standing outside.",
                ],
            },
            {
                heading: "The window is shorter than it looks",
                paragraphs: [
                    "Checkout at 11 and check-in at 3 reads like four hours. It is not. Subtract travel in, the walk-through, travel out, and the buffer you need in case the previous guest left late, and the real working window is closer to two and a half hours.",
                    "That is enough for a one or two bedroom unit cleaned by two people, provided nothing goes wrong. It is not enough to also discover that you are short a fitted sheet.",
                ],
            },
            {
                heading: "Laundry is the constraint, not the cleaning",
                paragraphs: [
                    "This is the part that is easy to underestimate. The cleaning itself is predictable and compresses well. Laundry does not compress at all — a wash plus a dry cycle runs most of the available window, and it runs at the same speed whether one person or three is standing next to the machine.",
                    "There are only three ways out of it, and the first is much better than the other two.",
                ],
                bullets: [
                    "Keep two full sets of linens per bed and two sets of towels per bathroom. The dirty set leaves with the cleaner or goes in the machine unattended; the fresh set goes straight on. The window stops depending on a dryer.",
                    "Use an off-site laundry service on a fixed collection rhythm. Works well above a certain number of units, adds a dependency below it.",
                    "Run the laundry during the clean and hope the dryer finishes. This is the default, and it is the one that fails on the day a guest checks out late.",
                ],
            },
            {
                heading: "The restock list is the part that gets forgotten",
                paragraphs: [
                    "Cleaning is visible, so it gets attention. Consumables are invisible until a guest needs one at midnight. Write the list down once, keep the stock in one cupboard, and make checking it part of the changeover rather than something you remember on the drive home.",
                ],
                bullets: [
                    "Toilet paper: one on the holder, two visible spares per bathroom",
                    "Hand soap, dish soap, dishwasher tablets, a sponge that is not the previous guest's sponge",
                    "Bin liners in every bin, including the bathroom",
                    "Coffee, tea, salt, pepper, oil — whatever your listing photos imply",
                    "Anything the listing explicitly promises. A photographed welcome basket is a promise.",
                ],
            },
            {
                heading: "What guests actually photograph",
                paragraphs: [
                    "A guest who is annoyed does not write a paragraph. They take a picture of one thing and attach it to a review. The candidates are all geometry — places a fast pass misses because they are awkward to reach, not because they are hard to clean.",
                ],
                bullets: [
                    "Hair. Bathroom floor edges, the shower drain, the corner behind the toilet. Hair is the hardest thing on this list to remove completely and the easiest for a guest to photograph.",
                    "The inside of the microwave and the kettle or coffee machine",
                    "Under the bed, and the gap between the mattress and the headboard",
                    "The bin, if the previous liner was reused",
                    "The kitchen sink and the tap, which show water spots in every photograph taken with a flash",
                ],
            },
            {
                heading: "How to brief a cleaner",
                paragraphs: [
                    "Do not brief on cleaning. Brief on the constraints, because those are the things a cleaner cannot infer from the unit.",
                ],
                bullets: [
                    "The check-in time, not the checkout time. The deadline is what matters.",
                    "Where the linens, towels, and consumables live, and how many should be out at the end.",
                    "Which door, which code, and where to park. A cleaner circling for a space is a changeover that starts late.",
                    "Who to contact if something is broken or missing, and whether they should proceed or wait.",
                    "Whether to photograph the finished unit. Worth asking for if you are not going to see it yourself.",
                ],
            },
            {
                heading: "Booking it",
                paragraphs: [
                    "We cover turnovers across Greater Seattle, from Everett down through Seattle and the Eastside to Tacoma and Gig Harbor. Give us the checkout and check-in times in the booking form and we work to the window you set.",
                    "You see the estimate before you book, supplies are included, and the final price never goes above the top of your estimate.",
                ],
            },
        ],
        related: [
            {
                label: "Airbnb turnover",
                href: "/services/airbnb-turnover",
            },
            {
                label: "Where we work",
                href: "/locations",
            },
            {
                label: "See your price",
                href: "/book",
            },
        ],
    },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find(p => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
    return blogPosts.map(p => p.slug);
}
