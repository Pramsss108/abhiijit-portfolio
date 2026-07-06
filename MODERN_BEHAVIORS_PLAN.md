# Modern Behaviours & Engagement Plan
*The interaction layer that makes the portfolio feel alive and expensive — without ever feeling gimmicky or janky. Read alongside the section roadmap in `PORTFOLIO_V4_EXECUTION_PLAN.md`.*

**How to read this:** each idea has **what it is**, **why it engages**, **fit** (does it match the slim/premium, no-cheap-AI north star), and **effort**. Priorities: **P0** = do now, high impact; **P1** = strong, soon; **P2** = optional/experimental; **AVOID** = looks cheap, skip.

---

## ✅ Already live (the premium behaviours we built)
- **Scroll-driven "presents itself" entrances** (`animation-timeline: view()`) — Proof section resolves as you scroll in.
- **Pen-draw charts** — the Proof line draws point-by-point (~2.5s).
- **Glass metric cards** — gold halo glow + left-to-right **shine-sweep** + idle float + **count-up** numbers.
- **Skills carousel** — auto-advance + arrows + drag/swipe + keyboard + dots + pause; per-card animated graphs + real AI background atmospheres.
- **Pinned-scroll storytelling** — the Work section (left pins, right scrolls).
- **Custom cursor, magnetic CTA, reduced-motion safety** throughout.

This is already top ~5% behaviour. The list below is how we push to top 1%.

---

## 🎯 THE ASK: control the carousel with the scroll wheel
**What it is:** when the pointer is **over the Skills carousel**, the mouse wheel / trackpad advances the cards sideways instead of (or before) scrolling the page.

**Why it engages:** it turns a passive scroll into a tactile "I'm driving this" moment — premium and modern (Apple/Linear-style).

**The safe rule (critical — or it feels like a trap):**
- Horizontal trackpad swipe (`deltaX`) → moves the carousel natively. Always.
- Vertical wheel while hovering → advance **one card per gesture** with a short cooldown — but **release to the page** the moment there are no more cards in that direction (no dead-end scroll-jacking).
- Pause auto-advance while the user is driving; resume after a beat.
- Respect `prefers-reduced-motion` (no capture) and touch (native swipe already works).

**Fit:** ✅ premium. **Effort:** small (one handler in `initSkills`). **Priority: P0** — I'll add it on top of the perfected carousel.

---

## P0 — do now (high impact, on-brand)
| Behaviour | What it is | Why it engages | Effort |
|---|---|---|---|
| **Wheel/trackpad carousel control** | the ask above | tactile control | S |
| **Cursor-follow spotlight on cards** | a soft gold light that tracks the pointer across the hovered card surface | makes the card feel lit and reactive | S |
| **Neighbour-dim on hover** | hovered card lifts + sharpens; siblings dim/desaturate slightly | directs the eye, feels curated | S |
| **Active-card focus in carousel** | the centred card is brighter/larger; off-centre cards recede | depth + a clear "hero" at all times | S–M |

## P1 — strong, soon
| Behaviour | What it is | Why it engages | Effort |
|---|---|---|---|
| **Subtle 3D tilt** | cards/photos tilt a few degrees toward the cursor (parallax) | physicality without gimmick | S |
| **Scroll-progress accent** | a 2px gold progress line at the very top of the page | quiet "you're making progress" cue | S |
| **Magnetic dots/arrows** | carousel controls gently pull toward the cursor | premium micro-feel | S |
| **Text mask reveals** | headlines wipe/clip in on entry (not just fade) | editorial, high-status | S |
| **Sticky "Let's talk" after Proof** | the CTA quietly docks once they've seen the proof | conversion at peak trust | M |
| **Copy-to-clipboard contact** | click email/handle → copies + a soft toast | frictionless, modern | S |

## P2 — optional / experimental (try, keep only if it stays classy)
| Behaviour | What it is | Note |
|---|---|---|
| **Pinned scroll-scrub carousel** | pin Skills and scrub cards with scroll (Apple-style) | powerful but conflicts with the "one-view compact" goal — only if we change that decision |
| **Live timezone chip** | "available across India · Dubai · USA" with a real local-time tick | real, subtle credibility |
| **Hover-to-reveal source** | hover a stat → a tiny "where this number comes from" line | reinforces "numbers are real" |
| **Ambient section backdrop** | the `skl-bg-ambient.webp` faint behind the whole Skills band | extra depth |

## ❌ AVOID (these read cheap / hurt the brand)
- Heavy parallax on everything, cursor trails, confetti, bouncing emojis.
- Auto-playing sound or video with sound.
- Full scroll-jacking that traps the page; long fake loaders.
- Tilt/zoom so strong it feels like a toy.
- Any AI-stock 3D imagery (the whole point is bespoke, coded motion).

---

## 🛡️ Guardrails (so "modern" never becomes "janky")
- **GPU-only** motion (transform/opacity/stroke) — never animate layout.
- **Reduced-motion** path for every effect (final state, no auto-move).
- **Never trap scroll** — always release at boundaries.
- **One signature motion per section** — stack micro-interactions, not competing big moves.
- **Mobile = calm** — heavy hover effects are pointer-only; touch stays simple.
- Verify each on real Chrome (desktop + phone) before it ships.

---

## Suggested order
1. **P0 set** on the freshly-perfected Skills carousel (wheel control, cursor spotlight, neighbour-dim, active-card focus).
2. **P1 conversion + polish** (sticky CTA after Proof, copy-to-clipboard, scroll-progress, text reveals) — these lift hire/convert.
3. **P2** only the ones that test classy.

*Then resume the section roadmap (`PORTFOLIO_V4_EXECUTION_PLAN.md`): Case Studies → Process (turn the dead stepper on) → About → Contact → privacy pass.*
