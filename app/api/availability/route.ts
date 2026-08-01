/**
 * Public availability lookup for the booking wizard.
 *
 * Takes a job shape, returns the days and half-day slots that can actually
 * take it, plus whether a matching request can be confirmed without a human.
 *
 * AN EMPTY `days` ARRAY MEANS "ASK THE CUSTOMER TO REQUEST A TIME".
 * It never means the calendar is closed for good. The horizon is two weeks,
 * a calendar sync can be down, and the owner can still fit a job in by hand.
 * The wizard must fall back to a request form, not to a dead end. Same for
 * `degraded: true`, which is the same fallback after a server-side failure.
 *
 * `staleFeeds` from the resolver never crosses to the browser: it names
 * internal systems, and the customer has no use for it. It is logged here and
 * already shows up in the response as autoConfirm: false.
 */

import { NextRequest, NextResponse } from "next/server";
import { resolveAvailability, type JobShape } from "@/lib/availability/resolver";
import type {
  BathroomCount,
  BedroomCount,
  HomeCondition,
  ServiceType,
  SqftRange,
} from "@/types";

export const dynamic = "force-dynamic";

const VALID_SERVICE_TYPES: ServiceType[] = ["regular", "deep", "move_out"];
const VALID_BEDROOMS: BedroomCount[] = ["studio", "1", "2", "3", "4", "5+"];
const VALID_BATHROOMS: BathroomCount[] = ["1", "1.5", "2", "2.5", "3", "3.5+"];
const VALID_CONDITIONS: HomeCondition[] = ["clean", "average", "needs_work"];
const VALID_SQFT_RANGES: SqftRange[] = [
  "under_800",
  "800_1200",
  "1200_1800",
  "1800_2500",
  "2500_3500",
  "over_3500",
  "not_sure",
];

interface AvailabilityRequestBody {
  serviceType?: unknown;
  bedrooms?: unknown;
  bathrooms?: unknown;
  condition?: unknown;
  sqftRange?: unknown;
  recurring?: unknown;
}

function isOneOf<T extends string>(value: unknown, allowed: T[]): value is T {
  return typeof value === "string" && (allowed as string[]).includes(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AvailabilityRequestBody;

    // Basic validation
    if (!body || !body.serviceType || !body.bedrooms || !body.bathrooms) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Enum validation — reject garbage instead of sizing a job from it.
    if (!isOneOf(body.serviceType, VALID_SERVICE_TYPES)) {
      return NextResponse.json({ error: "Invalid service type" }, { status: 400 });
    }
    if (!isOneOf(body.bedrooms, VALID_BEDROOMS)) {
      return NextResponse.json({ error: "Invalid bedrooms value" }, { status: 400 });
    }
    if (!isOneOf(body.bathrooms, VALID_BATHROOMS)) {
      return NextResponse.json({ error: "Invalid bathrooms value" }, { status: 400 });
    }

    let condition: HomeCondition | undefined;
    if (body.condition !== undefined && body.condition !== null) {
      if (!isOneOf(body.condition, VALID_CONDITIONS)) {
        return NextResponse.json({ error: "Invalid condition value" }, { status: 400 });
      }
      condition = body.condition;
    }

    let sqftRange: SqftRange | undefined;
    if (body.sqftRange !== undefined && body.sqftRange !== null) {
      if (!isOneOf(body.sqftRange, VALID_SQFT_RANGES)) {
        return NextResponse.json({ error: "Invalid sqft range" }, { status: 400 });
      }
      sqftRange = body.sqftRange;
    }

    if (body.recurring !== undefined && typeof body.recurring !== "boolean") {
      return NextResponse.json({ error: "Invalid recurring value" }, { status: 400 });
    }

    const job: JobShape = {
      serviceType: body.serviceType,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      condition,
      sqftRange,
      recurring: body.recurring === true,
    };

    const { days, autoConfirm, staleFeeds } = await resolveAvailability(job);

    // Owner-facing signal only. A stale feed already withdrew auto-confirm.
    if (staleFeeds.length > 0) {
      console.warn(
        "Availability feeds stale, auto-confirm withdrawn:",
        staleFeeds.join(", ")
      );
    }

    // cleanerHours stays server-side. It is the hours half of the hours × rate
    // pricing mechanic, and the owner took the rate out of customer-facing
    // surfaces on purpose — shipping the divisor next to a displayed price puts
    // it back for anyone reading the network tab. The wizard does not use it.
    return NextResponse.json({ days, autoConfirm });
  } catch (error) {
    // Fail soft, not shut. A broken read must not show the customer a dead
    // calendar — the wizard reads this as "request a time" and carries on.
    console.error("Availability API error:", error);
    return NextResponse.json({ days: [], degraded: true });
  }
}
