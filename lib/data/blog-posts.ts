// Blog post data. Educational content with no company-specific claims —
// safe to publish before competitive positioning is finalized.
//
// Each post has structured sections (no markdown parser needed).
// Add a post by appending an entry; it auto-appears on /blog and gets
// statically generated at build time.

export interface BlogSection {
    heading?: string;
    paragraphs: string[];
    bullets?: string[];
}

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string; // ISO date
    readingMinutes: number;
    shortVersion: string;
    sections: BlogSection[];
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
                    "Here's what we've found across hundreds of move-out cleanings in Greater Seattle: landlords have a short, predictable list, and most of it has nothing to do with what online checklists emphasize.",
                ],
            },
            {
                heading: "What landlords actually inspect",
                paragraphs: [
                    "Property managers and landlords work fast. A typical inspection is 15-30 minutes for a 1-2 bedroom unit. They aren't running a white-glove test — they're checking specific failure points that come up in their tenant turnover logs.",
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
                    "If you only have time to focus on two areas before move-out, focus on these two — they account for most disputed deposit cases:",
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
                    "Hire a cleaner if: the unit hasn't been deep-cleaned in 6+ months, you have a tight move-out window, you have pets (pet hair is the most-cited deposit deduction), or you have a security deposit larger than the cost of cleaning. Math is straightforward — if cleaning costs less than the deposit you might lose, hire.",
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
        excerpt: "Pet hair is the most-cited reason customers say a clean was \"not bad, but not great.\" The reason is geometry — most cleaners only get the easy 80%. Here's where the missed 20% lives.",
        publishedAt: "2026-05-01",
        readingMinutes: 4,
        shortVersion: "Pet hair hides in five places that vacuums skip without specific technique: under the lower edge of upholstered furniture, in the seam between cushions, on the sides of bedding, embedded in rug fibers (not on top), and around the legs of dining chairs. A cleaning that doesn't address those five areas will look fine but feel disappointing within two days.",
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
                    "Pet-owners who add this single line to their booking notes — \"please use a rubber tool on the couch and rug\" — get noticeably better results.",
                ],
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
