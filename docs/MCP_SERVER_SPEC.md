# CLEENLY MCP Server — Technical Specification

**Status:** Design (not implemented)
**Inspired by:** Kolmo Construction MCP (36 tools, Seattle, production)
**Target:** 12 tools, single-turn workflow, no auth for discovery

---

## Architecture

```
/.well-known/mcp.json     → MCP discovery document
/api/mcp                  → Streamable HTTP MCP endpoint (main)
/llms.txt                 → Short structured knowledge (upgrade existing)
/llms-full.txt            → Full knowledge base dump (new)
```

**Transport:** Streamable HTTP (same as Kolmo)
**Auth:** None for read tools. Rate-limited. `submit_booking_request` requires Turnstile token.
**Framework:** Next.js 16 API route + `@modelcontextprotocol/sdk`

---

## Tool Inventory (12 tools)

### Category 1: Business Information (2 tools)

#### `get_business_info`
Returns company details, hours, contact, coverage area.

```json
{
  "name": "get_business_info",
  "description": "Get CLEENLY business information including hours, contact, service area, and company overview",
  "inputSchema": { "type": "object", "properties": {} }
}
```

Response includes: name, phone, email, hours, website, booking_url, coverage_cities[], company_overview, differentiators[].

#### `check_service_area`
Check if a specific city/ZIP is within CLEENLY coverage.

```json
{
  "name": "check_service_area",
  "description": "Check if CLEENLY serves a specific city or ZIP code in Greater Seattle Area",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City name or ZIP code" }
    },
    "required": ["location"]
  }
}
```

Response: { covered: boolean, city: string, neighborhoods: string[], local_context: string }

---

### Category 2: Services (2 tools)

#### `list_services`
Returns all available cleaning services with pricing ranges and descriptions.

```json
{
  "name": "list_services",
  "description": "List all CLEENLY cleaning services with pricing, duration, and descriptions",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": { "type": "string", "enum": ["standard", "pnw_protocol", "all"], "default": "all" }
    }
  }
}
```

Response: Array of { slug, name, price_range, duration, description, best_for, category }.

#### `get_service_details`
Deep info on a specific service including what's included, addons, local tips.

```json
{
  "name": "get_service_details",
  "description": "Get detailed information about a specific CLEENLY service including scope, addons, and local context",
  "inputSchema": {
    "type": "object",
    "properties": {
      "service": { "type": "string", "description": "Service slug (e.g., deep-cleaning, move-out-cleaning)" }
    },
    "required": ["service"]
  }
}
```

---

### Category 3: Pricing & Quoting (2 tools)

#### `get_instant_quote`
Calculate exact price for a cleaning job. Single-turn — returns full breakdown.

```json
{
  "name": "get_instant_quote",
  "description": "Get an instant price quote for a CLEENLY cleaning service based on home details",
  "inputSchema": {
    "type": "object",
    "properties": {
      "service_type": { "type": "string", "enum": ["regular", "deep", "move_out"] },
      "bedrooms": { "type": "string", "enum": ["studio", "1", "2", "3", "4", "5+"] },
      "bathrooms": { "type": "string", "enum": ["1", "1.5", "2", "2.5", "3", "3.5+"] },
      "condition": { "type": "string", "enum": ["clean", "average", "needs_work"], "default": "average" },
      "addons": {
        "type": "array",
        "items": { "type": "string", "enum": ["fridge", "oven", "cabinets", "laundry", "pollen_purge", "damp_season_reset"] }
      },
      "city": { "type": "string", "description": "City for local pricing context" }
    },
    "required": ["service_type", "bedrooms", "bathrooms"]
  }
}
```

Response: { price_range: { min, max }, breakdown: { base, bathroom_multiplier, condition_multiplier, addons_total }, duration_estimate, booking_url }.

#### `list_addons`
Available add-on services with pricing and descriptions.

```json
{
  "name": "list_addons",
  "description": "List available cleaning add-ons with prices and descriptions",
  "inputSchema": { "type": "object", "properties": {} }
}
```

---

### Category 4: Availability (2 tools)

#### `check_availability`
Check next available slots for a given service and city.

```json
{
  "name": "check_availability",
  "description": "Check next available time slots for CLEENLY cleaning in a specific city",
  "inputSchema": {
    "type": "object",
    "properties": {
      "city": { "type": "string" },
      "service_type": { "type": "string", "enum": ["regular", "deep", "move_out"] },
      "preferred_date": { "type": "string", "format": "date", "description": "Preferred date (YYYY-MM-DD)" }
    },
    "required": ["city"]
  }
}
```

Response: { available_slots: [{ date, time_slot, estimated_arrival }], next_available: date, same_day_available: boolean }.

#### `get_scheduling_info`
General scheduling policies (cancellation, rescheduling, recurring options).

```json
{
  "name": "get_scheduling_info",
  "description": "Get CLEENLY scheduling policies including cancellation, rescheduling, and recurring service options",
  "inputSchema": { "type": "object", "properties": {} }
}
```

---

### Category 5: Social Proof (2 tools)

#### `get_reviews`
Customer reviews, filterable by city and service type.

```json
{
  "name": "get_reviews",
  "description": "Get CLEENLY customer reviews, optionally filtered by city or service",
  "inputSchema": {
    "type": "object",
    "properties": {
      "city": { "type": "string" },
      "service_type": { "type": "string" },
      "limit": { "type": "integer", "default": 5, "maximum": 20 }
    }
  }
}
```

#### `get_rating_summary`
Aggregate rating stats (overall, by service, by city).

```json
{
  "name": "get_rating_summary",
  "description": "Get CLEENLY aggregate ratings and review statistics",
  "inputSchema": { "type": "object", "properties": {} }
}
```

---

### Category 6: Actions (2 tools)

#### `submit_booking_request`
Submit a booking inquiry. Returns confirmation or next steps. Rate-limited + Turnstile.

```json
{
  "name": "submit_booking_request",
  "description": "Submit a cleaning booking request to CLEENLY. Returns confirmation details and next steps.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "phone": { "type": "string" },
      "service_type": { "type": "string", "enum": ["regular", "deep", "move_out"] },
      "bedrooms": { "type": "string" },
      "bathrooms": { "type": "string" },
      "city": { "type": "string" },
      "preferred_date": { "type": "string", "format": "date" },
      "time_preference": { "type": "string", "enum": ["morning", "afternoon", "flexible"] },
      "special_requests": { "type": "string" },
      "dry_run": { "type": "boolean", "default": true, "description": "Preview without submitting" }
    },
    "required": ["name", "email", "service_type", "bedrooms", "bathrooms", "city"]
  }
}
```

**Critical:** `dry_run: true` by default. Agent previews before committing. This prevents accidental bookings.

#### `get_booking_url`
Returns the direct booking URL with pre-filled parameters.

```json
{
  "name": "get_booking_url",
  "description": "Get a pre-filled CLEENLY booking URL for the customer to complete payment",
  "inputSchema": {
    "type": "object",
    "properties": {
      "service_type": { "type": "string" },
      "bedrooms": { "type": "string" },
      "bathrooms": { "type": "string" },
      "city": { "type": "string" }
    }
  }
}
```

---

## Implementation Plan

### Phase 1: Read-only (Week 1)
- `get_business_info`
- `check_service_area`
- `list_services`
- `get_service_details`
- `get_instant_quote`
- `list_addons`
- `get_reviews`
- `get_rating_summary`

Deliverable: 8 read-only tools, no database calls needed (all from static data + pricing logic).

### Phase 2: Availability (Week 2)
- `check_availability`
- `get_scheduling_info`

Requires: Supabase query for existing bookings to calculate available slots.

### Phase 3: Transactional (Week 3)
- `submit_booking_request`
- `get_booking_url`

Requires: Rate limiting, Turnstile verification, Supabase write, email notification.

### Phase 4: Discovery & Monitoring (Week 4)
- Deploy `/.well-known/mcp.json`
- Upgrade `/llms.txt` to comprehensive format
- Create `/llms-full.txt`
- Register on Smithery/Glama
- Set up Otterly.AI monitoring

---

## Key Design Decisions (from Kolmo learnings)

1. **Single-turn everything.** `get_instant_quote` returns full breakdown in one call. No "start quote wizard".
2. **Value-first, lead-capture last.** 10 tools give information freely. Only 2 collect data.
3. **Dry-run by default.** `submit_booking_request` previews before committing. Agent sees what will happen.
4. **No auth for discovery.** All read tools require no authentication. Rate limit only.
5. **Local context in every response.** City-specific tips, PNW climate context, neighborhood awareness.
6. **Honest pricing.** Exact calculator, not "starting at $X". Range shows min/max with multiplier explanation.

---

## Dependencies

- `@modelcontextprotocol/sdk` — MCP server implementation
- Existing `lib/pricing.ts` — pricing logic (already built)
- Existing `lib/data/cities.ts` — city data (already built)
- Existing `lib/data/services.ts` — service catalog (already built)
- Supabase — for availability checks and booking writes only

---

## Security

- Rate limiting: 60 req/min per IP for read tools, 5 req/min for write tools
- Turnstile token required for `submit_booking_request` (non-dry-run)
- No PII exposed in read responses
- Booking writes logged with source=mcp tag for attribution tracking
- Input validation via Zod schemas (reuse existing)
