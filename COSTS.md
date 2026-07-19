# CLEENLY — Costs (append-only log)

## Voice agent (Twilio ConversationRelay + Claude Haiku 4.5 + CF Worker) — 2026-07-17

Number: +1 425 230 5957. Worker: `cleenly-voice-agent.e-s-krasnoperov.workers.dev`.

### Per-minute running cost
| Component | Rate | Notes |
|---|---|---|
| Twilio inbound voice (US local) | $0.0085/min | the call leg |
| Twilio ConversationRelay | $0.070/min | bundles STT + TTS |
| Claude Haiku 4.5 | ~$0.005/min | see below |
| **Total** | **~$0.084/min** | Twilio ≈ 94% of it |

Twilio Gather speech-recognition per-use charges ($0.02+/use) do NOT apply — ConversationRelay bundles STT into its $0.07/min.

### Claude Haiku 4.5 detail
- Price: $1.00/M input, $5.00/M output.
- **No prompt caching**: no `cache_control` in `anthropic.ts`, and the system+tools prefix (~1500 tokens) is below Haiku's 4096-token cache minimum — caching wouldn't engage even if added.
- Each caller turn re-sends system (~625 tok) + tool defs (~875 tok) + growing history. `MAX_TOKENS=600` caps output.
- ~3-min call ≈ 8 model calls ≈ ~14k input + ~400 output ≈ **$0.015–0.02/call**.

### Per-call totals
| Call length | Twilio | Claude | Total |
|---|---|---|---|
| 1.5 min (quick) | ~$0.12 | ~$0.01 | **~$0.13** |
| 3 min (typical) | ~$0.24 | ~$0.017 | **~$0.25** |
| 5 min (long) | ~$0.39 | ~$0.025 | **~$0.42** |

### Fixed monthly
- Twilio number: $1.15/mo.
- Cloudflare Workers: $0 (free tier 100k req/day; a call = handful of requests).
- Anthropic: pay-as-you-go, no subscription (key = shared `ELISHA`; move to a dedicated Cleenly key for clean attribution).

### Monthly at volume (typical 3-min call ≈ $0.25)
- 50 calls/mo: ~$12.50 + $1.15 = **~$14/mo**
- 200 calls/mo: ~$50 + $1.15 = **~$51/mo**

### Cost levers if needed
- Shorten calls (agent already terse, MAX_TOKENS=600).
- ConversationRelay ($0.07/min) is the floor — no cheaper Twilio path for AI voice.
- Claude is already the cheapest tier (Haiku); not worth optimizing vs Twilio's 94% share.
