# Portfolio Master Plan — Abhijit Pramanik (v3 → v4)
*The hero is locked. This is the definitive, phase-by-phase plan for everything below it. Updated 2026-06-29 (pass 4).*

**North star:** this site is a **$20,000 sales instrument** AND a **hire-me instrument** — it has to convert TWO buyers at once (a client who pays for a project, and an employer who hires the person). Every pixel either builds trust and moves toward the CTA, or it gets cut.

---

## 0 · WHERE WE ARE NOW (what we have)

**Live & good:**
- **Hero** — locked: kinetic headline, rotating skills, typewriter intro, mega-menu, money-green, baked photo, soft glow.
- **Proof / Results** (`#proof-numbers`) — count-up stats + tool ribbon (flush divider) + **3 compact case studies**. *Ribbon→cases spacing fixed.*
- **Services** (`#services`) — 9 disciplines incl. Video Editing; horizontal snap carousel.
- **Selected Work** (`#work`) — pinned-scroll showcase, now **6 REAL screenshots** (AI 3D stock killed): SEO matrix, WordPress blogs, Balihans app (phone frame), influencer, ReachHub calendar + brand creative (PiP), Bongbari 3M.
- **Proof — REAL GRAPHS (Phase A ✅ shipped):** Chart.js views donut (99.3% non-followers) + reach-growth bar (+436.5%, 471.9K→2.53M), animated on scroll, hover tooltips, reduced-motion safe. All from the verified Bongbari insights screenshot.
- **Process** (`#process`) — "A proof-driven process" (the version you like).
- **About** (`#about`) — "Real work. Real proof." + parallax.
- **Contact** (`#contact`) — ambient-glow CTA.
- System: fixed-bg parallax, liquid glass, custom cursor, scroll-entrance effects, reduced-motion safe.

**Deleted (tracked):** the client name-card grid (→ becomes a logo strip when logos arrive) · the big "stack I work in" `#skills` grid (GEO + tools still in the mega-menu).

**Just fixed (adversarial review pass):** removed 3 overclaims (no "behind the rankings", no "400+ across clients" tied to one tracker, "App & Web Dev" → "Mobile App UI"); corrected alt text; fixed the broken/duplicated screen-reader narration; fixed the wide blog strip collapsing on mobile; removed dead JS.

**⚠️ OPEN DECISION — privacy (see §5):** the review flagged 4 of the 6 work screenshots as publishing real client-confidential data / a real person's identity. Your call before any deploy.

---

## 1 · THE FUNNEL — the psychology of the scroll

A visitor scrolls down a ladder of unspoken questions. Each section answers ONE and hands momentum to the next. Same ladder works for a **client** and an **employer** — only the CTA wording flexes.

| # | Section | Their unspoken question | Psychological lever | The "feel" we engineer |
|---|---------|------------------------|---------------------|------------------------|
| 1 | **Hero** | "What is this / is it for me?" | **Pattern interrupt** + bold claim | Stops the scroll in 2s. "I build brands, drive traffic, grow revenue." |
| 2 | **Proof / Results** | "Does it actually work?" | **Specificity + social proof** (real numbers beat adjectives) | The money moment — *real animated graphs* of 3M+, +436.5%, 36+ companies. |
| 3 | **Services** | "What exactly can I hire you for?" | **Clarity / cognitive ease** | "Here's the menu." Outcome-framed, visual, scannable. |
| 4 | **Selected Work** | "Show me real receipts." | **Demonstration > claim** | The 6 real artifacts. "This is not theory." |
| 5 | **Process** | "Is hiring you risky?" | **Loss-aversion / de-risk** | "Here's exactly how it goes." Removes fear. |
| 6 | **About** | "Who am I dealing with?" | **Liking + authority** (the human) | Face, story, the operator at his Mac. Trust + relatability. |
| 7 | **Contact** | "OK — how do I start?" | **Single clear action + reciprocity** | One magnetic CTA, ambient pull. The close. |

**Funnel rules:** proof BEFORE pitch · one idea per screen (≈ one viewport) · every section ends pointing at the next · one repeated CTA verbatim · micro-commitments along the way (a link, a hover, a play) warm them up for the big CTA.

---

## 2 · THE VISUAL SYSTEM — "no boxes, everything visual"

**Your rule:** *no element should be a plain box of writing — every corner should read as an image, a graph, or a designed visual; premium, slim, with a unique effect per section.*

**How we honour it (the principle, not the literal extreme):**
- **Lead every section with a visual**, not a paragraph — a real graph, a real screenshot, a photo, or a designed data-object.
- **Kill bare text-cards.** Where info must be text, it lives *inside* a visual composition (over imagery, beside a chart, as graphic typography) — never a lonely rectangle of sentences.
- **Numbers become graphs, not number-boxes.** (See §3.)
- **Photos do the talking** in human sections. (See §4.)
- **One signature motion per section** — never two (reads cheap). All GPU-only, all reduced-motion safe.
- **Premium + slim:** generous negative space, thin hairlines, one accent (gold), money-green only for growth numbers.

> Reality check: a portfolio still needs *some* words (a buyer reads). "No boxes" = **visual-first, integrated text, zero filler rectangles** — not literally zero text.

---

## 3 · REAL DATA → REAL INTERACTIVE GRAPHS

You're right that this is the upgrade. Claude writes real chart code (Chart.js / D3 / Plotly / Recharts / Mermaid) — for this **static vanilla-JS site** the clean fit is **Chart.js (via CDN, no build)** or **hand-rolled SVG/Canvas** for max-premium control. Recommendation: **Chart.js** for data charts (animated, hover tooltips, responsive) + **custom SVG** for hero/process flourishes. All themed dark+gold, animate on scroll-in, reduced-motion → static final frame.

**Your real numbers → the graph that proves them:**
| Real data (verifiable) | Becomes |
|---|---|
| Bongbari: 3,783,817 views · 2.53M reached · **+436.5% / 90 days** | An animated **growth line chart** (0 → 3.78M) with hover — the centrepiece proof. |
| 36+ companies · 400+ articles · 5+ yrs · 3 countries | Animated **count-ups + a small bar/donut** (replaces the stat number-boxes). |
| *(when you drop them)* GA4 / Search Console traffic, SEMrush rankings | Real **line / area charts** of traffic & position growth — the strongest possible proof. |

*No invented data — charts render only numbers you can back up.*

---

## 4 · PHOTOS — stop the same pic repeating (your concern: "don't look boring")

You have: the **hero headshot** (resume pic, already used) + **3–4 Mac working shots**. The fix for "boring" = **a different photo per human moment**, each doing a job:

| Where | Which photo | Why (psychology) |
|---|---|---|
| **Hero** | the polished headshot (keep) | first impression, authority |
| **About** | a candid **at-the-Mac working** shot | "real operator, hands-on" — relatability + proof of work ethic |
| **Process** | a focused **working / over-the-shoulder** shot behind the stepper | shows the work *happening* — de-risks |
| **Contact** (or Services intro) | an approachable, confident shot | "easy to talk to" — lowers the barrier to reaching out |

Rule: **never repeat the hero pic** elsewhere; vary angle/crop so each section feels fresh. *(Drop me the 3–4 files and I'll grade them to match the hero and place them.)*

---

## 5 · ⚠️ PRIVACY — the open decision (review findings)

The adversarial review flagged the work screenshots (all currently local-only, nothing is public yet):
- **#4 Influencer (Diksha)** — *critical*: real face, name, handle, personal website, "verified", follower count. Publishing a named client's identity without consent.
- **#6 ReachHub calendar** — *critical*: client-confidential strategy + names other real people (captions, targets).
- **#1 Pursueit keyword matrix** — *high*: client's confidential SEO roadmap, fully readable.
- **#3 WordPress tracker** — *high*: client internal tracker + leaks a **draft preview URL** (`?p=1836&preview=true`).
- #2 app & #5 brand creative — low risk (still confirm the brands are OK being named).

**My recommendation:** keep them as proof but **anonymize** — crop/blur faces, names, handles, client URLs and the draft link; for #4 either remove or crop to just the metric. This keeps the credibility without the exposure. *Your call — they're your clients and your risk.*

---

## 6 · PHASED EXECUTION (one part at a time, as you asked)

- **Phase A — Real graphs ✅ DONE**: Chart.js added; Proof section now has the Bongbari views donut + reach-growth bar (real data, animated, hoverable). Replaced number-boxes with live graphs.
- **Phase B — Photos**: grade + place the 3–4 Mac shots (About, Process, Contact); ensure each section stays one-view.
- **Phase C — "No-box" visual pass**: section by section, convert remaining text-cards to visual-first compositions (service tiles w/ micro-viz, case-study metric mini-charts, quotes as graphic type).
- **Phase D — Per-section signature motion + slim polish**: one unique trending effect each; tighten every section to ~one viewport.
- **Phase E — Privacy remediation + final QA**: apply your §5 decision; mobile/contrast/reduced-motion/overflow sweep.

---

## 7 · DECISIONS I NEED FROM YOU
1. **Privacy (§5)** — anonymize / keep as-is / remove the riskiest / remove all?
2. **Photos (§4)** — drop the 3–4 Mac working shots (file paths). Keep current hero headshot?
3. **Charts (§3)** — Chart.js (fast, interactive) vs hand-rolled SVG (no dependency)?
4. **Start with Phase A (real graphs)?** — my recommended first move.

---

## APPENDIX — reference (kept from earlier research)

**High-converting flow (research-backed):** Hero claim → social proof → results → services → real work → process → about → CTA. Principles: one idea/screen · proof before pitch · real beats polished-fake · one repeated CTA · one continuous dark+gold surface · momentum into each next section.

**Per-section signature motion (target):** Hero = staggered reveal + rotating skills *(done)* · Proof = count-up + chart draw-in + screenshot un-blur · Services = horizontal snap carousel *(done)* · Work = pinned scroll storytelling *(done)* · Process = scroll-pinned stepper · About = portrait parallax + line reveal · Contact = ambient glow + magnetic button. **One moment per section, 600–900ms eases, off-main-thread, full reduced-motion fallback.**

**Beat Madquick on:** real screenshots (not AI 3D) · bespoke scroll-driven motion (not template AOS) · one continuous dark+gold surface (not light/flat) · scrubbable process (not click-tabs). *(Local ref clone served at `/madquick-ref/`.)*

---

## 🎬 PROOF SCENE — 30-PHASE ENHANCEMENT PLAN (2026-06-29)
*The "Real work, measured" scene — must outshine the hero. Photo LEFT, phrase + real line graph RIGHT.*

**A · Exposure & photo (the "bad exposure" fix)**
1. ✅ Wire the `?edit` tuner to THIS scene (was driving the hero) — dial grade/glow/cards live, copy, I bake.
2. Re-grade for balanced exposure — contrast 1.91 + heavy glow blows the highlights; dial down contrast or glow opacity live.
3. Bottom-edge mask on the photo so it melts into the bg (no hard cut-off).
4. Gold rim-light hugging the silhouette (depth, separate from the grade).
5. Balance glow opacity vs photo brightness so the blazer/face don't wash out.
6. Bake the final dialed grade once you lock it.

**B · Composition & position**
7. ✅ Center + contain the photo so it's never cut off.
8. Fixed scene height that fits photo + phrase + graph in one desktop view.
9. Align headline baseline to the photo eyeline (rhythm).
10. Tune the 2-col ratio so neither side crowds.
11. Breathing room around the line graph (clear of cards).
12. Soft floor shadow/reflection to ground the photo.

**C · Floating cards**
13. ✅ Cards clear of the right-side graph (re-dial live for exact).
14. ✅ Three hero cards only (3.78M · +436.5% · #1) — no clutter.
15. Count-up animation on card numbers on enter.
16. Subtle shine-sweep across cards (premium).
17. ✅ Staggered idle float; gentle entrance.
18. Never cover his face/eyes.

**D · Line graph (right, real, coded)**
19. ✅ Real Chart.js line — search clicks 8.48K→18.4K (+117%).
20. Plot the FULL daily/monthly curve from your **GSC CSV export** (needs your file).
21. Gold/green gradient stroke + glow + animated draw-on.
22. Add impressions as a faint secondary line (192K→412K).

**E · Mobile**
23. ✅ Scene stacks; cards become a static column under the photo.
24. ✅ Photo + glow resize for small screens.
25. Line graph full-width + readable ticks on mobile.
26. QA 360 / 390 / 768 — zero overflow.

**F · Richness & polish**
27. Premium headline treatment ("Your growth is my job.") — size/tracking/weight.
28. Faint animated grain/sheen over the scene (texture, like the hero grain).
29. Reduced-motion: freeze floats + chart anim, static final frame.
30. Final QA — contrast, alt text, no overflow, performance.

**Done (29/30):** 1-19, 21-30 all shipped + adversarially reviewed (grain z-index, chart aria-label, reduced-motion underline fixed). Plus: card placement v2 (a BEHIND), scroll-magnet (proximity snap so the section can't be cut off), dual-line graph (clicks + impressions).
**ONLY remaining — phase 20:** the FULL daily Search Console curve — blocked on Abhijit's **GSC CSV export** (graph currently shows the real 2-period growth for both series). Optional lows skipped: stale grain comment, will-change trim, background-cascade hardening.
