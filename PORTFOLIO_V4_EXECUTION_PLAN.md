# V4 Section Upgrade Plan — Make Every Section as Premium as the Hero

*The Hero and the Proof section are locked and loved. This plan drags every other section up to that same bar.*

**How to read this:** Skim the **Scorecard** first to see where each section stands. Then read the section you want to fix — each one tells you *what it looks like now*, *what's good*, *what fails*, *the fix in plain words (with the exact photo/screenshot it should use)*, and *what I need from you*. Approve the **Phases** one at a time; nothing ships without your green light.

> Live files this plan touches: `madquick-clone/public/v3/index.html`, `madquick-clone/public/v3/styles.css`, `madquick-clone/public/v3/app.js` (your site on `localhost:5055/v3/`). Your real photos and screenshots already sit in `madquick-clone/public/images/`.

---

## The Two Quality Bars (the rubric we copy)

Everything below must *feel* like the **Hero (#home)** and the **Proof scene (#proof-numbers)**. Here is exactly what makes those two premium, in plain words:

- **It leads with a real picture, not a paragraph.** The Hero opens on a real cut-out photo of you. The Proof scene opens on you + a real coded chart that draws itself. The eye lands on *something real* before it reads a single word.
- **The "floating metric card" look (the chok-chok).** Glass cards with: a soft **gold halo** glow behind them, a **left-to-right shine sweep** that glints across on entry/hover, a gentle **idle float**, and numbers that **count up** from 0. That combination is the signature "expensive" feel.
- **The section presents itself as you scroll in.** Pure-CSS scroll-driven motion (`animation-timeline: view()`): the *person/photo resolves first*, the *copy lands last*. No scroll-snap, no jank — it glides. One signature move per section, nothing busy.
- **Soft over hard, hairline over heavy.** Photo bottoms fade out (masked), ribbon edges fade out, dividers are thin gold hairlines — never thick boxes or hard cut lines. Dark + gold everywhere; **money-green only on a growth number**.
- **Only real numbers.** 3.78M views, +436.5% reach/90d, 400+ articles, 36+ companies, +117% clicks / +114% impressions, #1 wedding venues Kolkata. Decorative shapes never pretend to be exact data.

**The glow rule (hard-won, do not break):** a photo's gold glow is ONE soft radial-gradient *behind* the cut-out. Never a drop-shadow rim (it traces the rectangle and makes a box), never a blurred photo copy. Keep photos `overflow: visible`.

---

## The Golden Rule (the pass/fail test for every section)

> **"A box and writing with NO PIC in that section is a very, very bad AI-generated website — not 1% of the quality we built."**

So the test for **every** section is one yes/no question:

**Is this section built around a real visual — a photo, a screenshot, a real coded chart, or a designed composition?**

- **YES** → text is allowed to live *inside* that visual composition. Pass.
- **NO** (it's just rectangles of text — cards, columns, lists, chips — even with pretty glass and glow) → **FAIL.** Decorative icons, ghost numerals, and CSS glows do **not** count as a real visual.

---

## Scorecard

| Section | Grade | Real visual? | Golden-rule verdict | The one biggest problem |
|---|---|---|---|---|
| **Services — "Services built on proof"** (`#services`) | **3 / 10** | ❌ No | **FAIL (worst offender)** | 9 identical text-and-icon boxes that *promise* proof but show none — the textbook "AI features grid" |
| **Case Studies** (`#proof-numbers .proof__cases`) | **3 / 10** | ❌ No | **FAIL** | 3 text-only glass cards (name + word-metric + paragraph + chips), zero imagery, sitting right under the gorgeous Proof marquees |
| **Selected Work / showcase** (`#work`) | **8 / 10** | ✅ Yes | **PASS** | Already near the bar; 4 of its 6 screenshots need privacy anonymizing before public launch |
| **About Me** (`#about`) | **4 / 10** | ⚠️ Partial | **FAIL (half the section)** | Left = recycled hero photo (banned); right = a lonely text column; whole panel is off-brand violet, not dark+gold |
| **Process — "A proof-driven process"** (`#process`) | **3 / 10** | ❌ No | **FAIL** | 6 numbered text cards; the premium scrubbing stepper is fully built but **dead** (never switched on) |
| **Contact** (`#contact`) | **3 / 10** | ❌ No | **FAIL** | One big centered text box with glows — the most template-looking, most AI-looking block on the page, no face at the moment trust matters most |

*Selected Work proves the bar is reachable in this codebase — it's the model the other five should copy.*

---

## Section-by-section plan

### 1. Services — "Services built on proof" (`#services`) — **TOP PRIORITY**

**What it is now.** A centered header ("Services built on proof") over a horizontal-scrolling row of **9 identical glass cards** (SEO Strategy, Content Writing, Content Marketing, Social Media, WordPress Publishing, AI & No-Code, Video Editing, Analytics & Reporting, Canva Design). Every card is the same recipe: a thin line-drawn SVG icon (magnifying glass, pencil, speaker…), a title, one sentence. Nice per-card touches — pointer-following gold glow, 3D tilt, gold sheen — but **not one photo, screenshot, or chart anywhere.** *(Note: the gold prev/next arrows are now actually wired in `app.js`, so the carousel works — the older audit said they were dead; that's fixed.)*

**✅ What's already good**
- Headline is already your target line: "Services **built on proof**" with the gold gradient.
- Premium glass surface + gold hairline + per-card glow/tilt are real and on-brand.
- Fully responsive and accessible (role=list, reduced-motion + touch fallbacks), arrows now functional.

**❌ What fails the bar**
- **No real visual at all** — 9 text+icon boxes are *exactly* the banned "AI features grid."
- The copy promises proof ("documented, measured, repeatable across 36+ companies") while the cards deliver **zero proof** — no number, no screen, no artifact. It contradicts its own headline.
- All 9 weighted equally — no signal of your strongest disciplines (SEO/content, where the 400+ articles and #1 rankings live).
- No signature "presents itself" entrance like Hero/Proof; just a generic reveal.

**The modern fix — concrete layout idea.** Stop building a grid of glyphs. Build a **"signature 3 + supporting strip"** that leads with you and proves each service with a real screen:

- **Anchor the whole section on a real photo of you working.** Use the **candid MacBook cut-out** (`/images/abhijit-macbook.png`, already on disk, currently unused) on the left with a soft gold halo behind it — so the section opens on a *human at his craft*, not icons.
- **Promote 3 "signature" service cards** (your strongest, the ones with real numbers) into **large proof tiles**, each LED by a real screenshot instead of an icon:
  - **SEO Strategy** → `work-seo-strategy.png` (the keyword matrix) + stamp **"#1 ranked wedding venues, Kolkata"**.
  - **Content Writing** → `work-wordpress-blogs.png` (the publish tracker) + stamp **"400+ articles"**.
  - **Analytics & Reporting** → the GSC chart (the +117% clicks / +114% impressions data) + stamp **"+436.5% reach / 90d"** in money-green.
- **Demote the other 6** (Content Marketing, Social Media, WordPress Publishing, AI & No-Code, Video Editing, Canva Design) into a **slim secondary strip** of small calm tiles — present, but clearly supporting. That hierarchy + negative space is what reads premium instead of a flat 3×3 wall.
- Borrow the chok-chok: each signature tile gets the gold halo + shine-sweep on its screenshot, and any numeric stamp **counts up**.

**The ONE signature motion.** As the section scrolls in: your working photo **resolves first**, then the 3 signature proof tiles **settle and shine-sweep in sequence**, copy last — same `animation-timeline: view()` choreography as Proof. Keep the now-working carousel for the supporting strip only, with **mask-faded edges** so cards ramp out softly instead of hard-cutting.

**Assets I need from you**
- ✅ Already have: `abhijit-macbook.png/.webp`, `work-seo-strategy.png`, `work-wordpress-blogs.png`.
- The **GSC screenshot or CSV** for the Analytics tile (the +117% / +114% chart) — or confirm I should render it as a coded mini-chart from the real numbers.
- **Privacy call:** confirm `work-seo-strategy.png` and `work-wordpress-blogs.png` are safe to show, or which client names/data to blur first.
- Confirm the 3 "signature" picks (I propose SEO, Content Writing, Analytics).

---

### 2. Case Studies (`#proof-numbers .proof__cases`) — **TOP PRIORITY**

**What it is now.** A 3-column grid of glass cards (Ymedia, RuDe Labs, Pursueit Dubai). Each is **pure text**: client name + role, a big word-metric ("33 articles · 30 days", "100+ videos optimized", "International SEO + Social"), a clamped paragraph, little tool pills (WordPress, SEMrush…), and a "Visit →" link on two of three. **Zero images, charts, or designed graphics** in the whole block — confirmed. The "01/02/03" corners are just text numerals. It sits *directly under* the beautiful Proof marquees, so the quality drop is jarring.

**✅ What's already good**
- Honest, well-written scope per client ("no rounding up" tone).
- Premium glass + hairline + tilt finish; already slimmed per earlier feedback.

**❌ What fails the bar**
- **No visual in any of the 3 cards** — straight golden-rule failure, the most AI-looking block right after the best one.
- The big "metrics" are inconsistent and non-numeric ("International SEO + Social"), so they read as filler and can't even use the count-up treatment.
- Uneven row: RuDe Labs has no "Visit" link while the others do.
- It **duplicates** the Selected Work story (Pursueit, SEO, WordPress, social all appear in both) — but with text instead of the real screenshots Selected Work already shows.

**The modern fix — concrete layout idea.** Two honest options; I recommend **B**:

- **Option A — give each card a real visual top** (match Selected Work's device-frame look): drop a real screenshot into a browser/phone frame at the top of each card. Ymedia → an article/tracker thumbnail; RuDe Labs → a YouTube channel screenshot showing optimized titles; Pursueit → the Dubai blog page or `work-seo-strategy.png`. Where no clean screenshot exists, **make the number the visual**: a small real coded mini-chart (e.g. 33 articles shown as 33 tiny stacked bars) — illustrative shape, never a fake exact value. Add the chok-chok: gold halo + shine-sweep + count-up on the real numbers, normalize every card to a real comparable number, and give every card the same "Visit →" treatment.
- **Option B (recommended) — fold Case Studies INTO Selected Work and delete the text cards.** Selected Work already proves Pursueit / WordPress / social with real screenshots. Add Ymedia and RuDe Labs as **two more screenshot cards** in that stream, then remove the lonely text block entirely. This kills the weakest, most-AI block *and* the duplication in one move — cleaner and faster than dressing up text cards.

**The ONE signature motion.** Whichever option: the **visual resolves first, copy second**, using the same scroll-driven entrance as Proof — no generic reveal fade.

**Assets I need from you**
- A real screenshot per case (if keeping Option A): Ymedia article/tracker; a RuDe Labs YouTube page; Pursueit blog page (or reuse `work-seo-strategy.png`).
- If no screenshot exists for a card, the **single real number** for it (exact article count, exact #videos optimized) so it becomes a coded mini-chart.
- **Your decision: A or B.** (I lean B.)
- The correct real big-number per case so a count-up makes sense.

---

### 3. Selected Work / showcase (`#work`) — the model to copy

**What it is now.** The strongest non-hero section: a pinned sticky narrative on the left (live "01 · 06" counter + gold progress bar) while a stream of **6 real screenshots** scrolls past on the right, each in a designed device frame — browser windows with traffic-light dots (`work-seo-strategy.png`, `work-wordpress-blogs.png`, `work-social-influencer.webp`, `work-social-calendar.webp` with a picture-in-picture brand inset), a real **phone frame** for the Balihans app (`work-app-balihans.webp`), and a featured "My own page" ribbon card with the **3,783,817-views** Bongbari screenshot (`bongbari-proof.jpg`).

**✅ What's already good** — Essentially at the bar: real screenshots in real frames, native aspect ratios (no cropping), and a true signature motion (pinned narrative + active-item swap + cross-fading blurb + counter + progress fill) with a clean reduced-motion fallback.

**❌ What fails the bar** — Only one real risk: **4 of the 6 screenshots show real client data/faces** and must be anonymized before public launch.

**The modern fix** — Leave the design alone. Just **anonymize the 4 privacy-flagged shots** (blur client faces/handles/data). If we adopt Case Studies **Option B**, add Ymedia + RuDe Labs here as two more frames.

**Assets I need from you** — The privacy call on the 4 shots, plus (if Option B) Ymedia + RuDe Labs screenshots.

---

### 4. About Me (`#about`)

**What it is now.** A two-column split. **Left** = a portrait in a tall frame with a violet placeholder, violet bottom glow, an "Available for work" pill, and a "25 · Based in India · Working worldwide" caption. **Right** = pure text: eyebrow, headline "Real work. Real proof.", a 3-paragraph bio, 4 outline stat chips (5+ Years / 3 Countries / 36+ Companies / Dubai to USA), two buttons. The photo on the left is **the recycled hero file** (`/images/abhijit-hero-v6.png`, line 929 — byte-identical to the hero) which the brief explicitly bans.

**✅ What's already good**
- It's at least photo-led on the left (a real face, not clip-art).
- Motion engineering is premium-grade (scroll-driven with graceful fallback, fully reduced-motion safe).
- Copy is honest; chips already de-loud-ified into hairline outline pills.

**❌ What fails the bar**
- **Recycled hero headshot** — the single most explicit instruction here is unmet, and a real candid already exists unused (`/images/abhijit-macbook.png`).
- **Right half is a lonely text column** — golden-rule failure for half the section.
- **Off-brand violet/indigo/lime** — About is the lone purple island on a dark+gold site.
- No gold halo + shine-sweep + idle float on the portrait; three competing motions instead of one signature move; stats are flat text chips, not a count-up data-viz.

**The modern fix.**
- **Swap to the candid MacBook cut-out** (`/images/abhijit-macbook.png`) — instantly reads as "here's me actually doing the work," not the hero copy-pasted. Clean cut-out on a soft **gold** halo (radial-gradient only — the glow rule), masked bottom fade.
- **Re-skin violet → dark+gold.** Drop the violet placeholder and "text-violet"/"text-lime" accents; give the photo the family's gold halo + shine-sweep.
- **Kill the text column:** turn the 4 stats into **floating glass metric cards** (5+ yrs · 36+ companies · 3 countries) over/beside the photo, with the Proof-style **count-up**. Now the section leads with a visual composition.
- **Cut the bio** from 3 paragraphs to ~2 tight lines that overlap the photo/cards — text inside the picture, never a standalone box.

**The ONE signature motion.** Candid photo resolves first → stat cards count up → short copy lands last. Drop the separate headline-wipe + chip-pop so it's one confident move.

**Assets I need from you**
- ✅ Already have: `abhijit-macbook.png/.webp` (run through rembg if you want a cleaner cut-out — say the word).
- Optional: one privacy-safe screenshot to layer as a second proof object (e.g. the GSC chart).
- Confirm the 3 numbers to surface (5+ years, 36+ companies, 3 countries) and whether to add a green growth figure here.

---

### 5. Process — "A proof-driven process" (`#process`)

**What it is now.** Six numbered glass cards (01 Understand → 06 Document the proof) down a thin centered gold rail, each just a heading + one sentence, with ghost outline numerals behind. **No image, screenshot, chart, or logo anywhere.** Critically: the **premium scrubbing pinned stepper is fully built but switched OFF** — the JavaScript looks for an element marked `[data-stepper]` (`app.js` line 1242) and that marker **doesn't exist in the HTML**, so the fancy experience never runs. What visitors get is a flat static list, and steps only light up on mouse-hover (dead on phones).

**✅ What's already good** — Six honest, well-written steps; consistent dark+gold styling; the rail progress-fill works; and the entire scrubbing-stepper design is **already coded** in CSS and JS (it just needs to be turned on); reduced-motion fallbacks are handled.

**❌ What fails the bar**
- **No real visual in any step** — golden-rule failure.
- The signature motion is **dead code** (missing `[data-stepper]` marker + the wrapper element the CSS expects).
- "Proof-driven" is claimed but never *shown* — tools (SEMrush, RankMath, Analytics, Meta, WordPress) are bare words, no logos, no screens; step 06 literally promises proof the section never displays.
- Active state is hover-only → flat and dead on mobile. No closing real metric.

**The modern fix — "working desk" scene.** Make it two panels:
- **Left:** the real MacBook cut-out (`/images/abhijit-macbook.png`) on dark+gold glass with a soft radial glow.
- **Right:** the six steps. As you scroll, the active step lights gold **and the left visual swaps to the real artifact for that step** — so every step is anchored to something you can *see*: step 02 → `work-seo-strategy.png` (keyword/SEMrush), steps 03–04 → `work-wordpress-blogs.png`, step 05 → the GSC/Analytics chart, step 06 → a mini Proof card reusing **3.78M views / +436.5% reach**.
- **Turn the signature motion ON:** add the missing `data-stepper` marker + wrapper so the section pins and the steps scrub active↔dim with a "Step N / 6" counter — and trigger on **scroll position, not hover**, so it works on phones.
- Show the tools as small **monochrome-gold logo chips** inside the relevant step, and end step 06 with one **money-green metric lockup** so the process visibly pays off.

**The ONE signature motion.** The scroll-driven scrub (already built) — left visual swaps per active step, counter advances, rail fills.

**Assets I need from you**
- ✅ Already have: `abhijit-macbook.png`, `work-seo-strategy.png`, `work-wordpress-blogs.png`, `bongbari-proof.jpg`.
- The **GSC chart/CSV** for step 05.
- Logo marks (monochrome/gold) for SEMrush, RankMath, Google Analytics, Meta Business Suite, WordPress — or confirm I source clean ones.
- Privacy call on the screenshots used here.

---

### 6. Contact (`#contact`)

**What it is now.** A single centered glass box: eyebrow, big headline (restating the services list a 4th time), a lead paragraph, two side-by-side buttons (WhatsApp + Contact Me), an email line, and three text "assurance" chips ("Reply within 24 hours", "Work directly with me", "Proof-backed, not promises"). Behind it: a drifting aurora glow, grain, gradient hairline, panel tilt, magnetic buttons. **No photo, screenshot, chart, or designed visual** — just two tiny button icons. It's the most template-looking block on the page, at the exact moment trust matters most.

**✅ What's already good** — Real working actions (WhatsApp `wa.me/918777849865`, mailto `growabhijit@gmail.com`, LinkedIn), on-brand dark+gold, and the magnetic-CTA + tilt interactions already exist and are reduced-motion safe. Solid accessibility.

**❌ What fails the bar**
- **No human face** at the close — Hero and Proof both lead with you; the closing section shows nobody.
- **No real visual of any kind** — one text box dressed in glow. Golden-rule failure.
- Two competing CTAs; centered/symmetric layout (not premium-editorial); the 3 "assurances" are unverifiable text claims on a *proof-first* site.
- Doesn't use the locked motions (no shine-sweep, no count-up, no `view()` entrance) — heavy decorative glow piled on emptiness.

**The modern fix.**
- **Lead with your face.** Real cut-out (a warm headshot, or the MacBook shot) on the left; copy + **one** magnetic CTA on the right (two-column desktop, stacked mobile). Same soft gold halo + masked bottom fade as Hero/Proof.
- **Collapse to one hero CTA:** make **"Chat on WhatsApp"** the single big gold magnetic button (with the shine-sweep); demote email + LinkedIn to quiet text links beneath.
- **Turn the 3 word-assurances into a tiny real proof ledger** — small count-up tiles reusing already-verified numbers (**3.78M views · 36+ companies · 3 countries**). Even the close shows proof, not promises. No new assets needed.
- Replace the centered box with an **asymmetric editorial composition** (photo bleeding to one edge, soft fade, copy in negative space); calm the aurora down to one quiet halo so the face is the hero.

**The ONE signature motion.** Same `view()` entrance as Proof: photo resolves first, copy + CTA settle last.

**Assets I need from you**
- A real cut-out for the close (warm headshot or MacBook shot — I can reuse what's on disk).
- Which CTA is primary (I propose WhatsApp).
- Confirm the 2–3 numbers for the closing ledger.

---

## Phase-wise execution plan

Ordered by impact. Each phase stands alone — you review and approve before the next. Each bumps the `styles.css` version so your Chrome pulls fresh styles (otherwise fixes "don't work" for you), and I verify on your real Chrome, not just the headless preview.

### Phase 1 — Services becomes "proof you can see" *(TODO — highest impact)*
- **Goal:** Kill the single worst golden-rule offender. Turn 9 icon-boxes into a photo-anchored "signature 3 + supporting strip."
- **Steps:** place the candid MacBook photo as the anchor → build 3 large proof tiles led by `work-seo-strategy.png`, `work-wordpress-blogs.png`, and the Analytics chart, each stamped with a real number (one money-green) → demote the other 6 to a slim masked-edge strip → add the `view()` entrance + shine-sweep.
- **What you'll see when done:** the section opens on *you working*, three big tiles each showing a real screen + a counting-up real number, and the rest as a calm supporting row — no naked icon grid.
- **Touches:** `#services` in index.html/styles.css/app.js · assets: macbook + 2 screenshots (have), GSC chart (need).

### Phase 2 — Case Studies: fix or fold *(TODO — highest impact)*
- **Goal:** Remove the text-only block under the Proof marquees.
- **Steps:** **if Option B** (recommended) — add Ymedia + RuDe Labs as two screenshot frames inside Selected Work, delete the text cards. **If Option A** — give each card a real screenshot top (or a coded mini-chart of its real number), normalize metrics, even up the "Visit →" links, add halo + shine + count-up.
- **What you'll see when done:** no more lonely text cards; the case stories are told with real screens, and the duplication with Selected Work is gone.
- **Touches:** `#proof-numbers .proof__cases` (+ `#work` if Option B) · assets: per-case screenshots/numbers (need) + your A/B decision.

### Phase 3 — Process: turn the dead stepper ON + anchor every step in a real screen *(TODO — big "wow", low risk; the motion is pre-built)*
- **Goal:** Activate the already-coded scrubbing stepper and make every step show a real artifact.
- **Steps:** add the missing `data-stepper` marker + wrapper so `initProcessStepper` runs → make the left visual swap to the real screenshot per active step → switch active-state trigger from hover to scroll (works on phones) → add monochrome-gold tool logos → close step 06 on a green metric lockup.
- **What you'll see when done:** the section pins and walks the visitor through your method step by step, each step showing the real screen that proves it, with a "Step N / 6" counter — working on desktop *and* mobile.
- **Touches:** `#process` in index.html/styles.css/app.js · assets: macbook + screenshots (have), GSC chart + tool logos (need).

### Phase 4 — About: candid photo, dark+gold reskin, floating stat cards *(TODO)*
- **Goal:** Replace the recycled hero photo, kill the text column, end the violet island.
- **Steps:** swap to `abhijit-macbook.png` on a gold halo → reskin violet→dark+gold → convert the 4 text chips into floating count-up metric cards → trim bio to ~2 lines over the composition → one `view()` motion.
- **What you'll see when done:** a fresh "me at work" moment in dark+gold, numbers that count up beside the photo, almost no standalone text.
- **Touches:** `#about` · assets: macbook (have), optional second screenshot.

### Phase 5 — Contact: a human close with one CTA + a proof ledger *(TODO)*
- **Goal:** Replace the AI text-box with a face-led editorial close.
- **Steps:** add the cut-out photo (gold halo) → collapse to one magnetic WhatsApp CTA, demote the rest → turn the 3 word-assurances into a count-up proof ledger (3.78M · 36+ · 3 countries) → asymmetric layout → one `view()` entrance, quiet the aurora.
- **What you'll see when done:** a warm, confident close — your face, one clear button, real numbers — instead of a glowing empty box.
- **Touches:** `#contact` · assets: one cut-out (have) + primary-CTA confirmation.

### Phase 6 — Privacy pass + final polish *(TODO — must finish before public launch)*
- **Goal:** Make every real screenshot safe to publish, then sweep for finish.
- **Steps:** anonymize the 4 privacy-flagged shots (blur faces/handles/client data) everywhere they appear (Selected Work, Services, Process, Case Studies) → final pass for masked edges, hairlines, consistent gold halos, count-up timing, reduced-motion + mobile checks.
- **What you'll see when done:** every screenshot is launch-safe, and all six upgraded sections feel like one premium family.
- **Touches:** all sections using screenshots · assets: your privacy call.

> **Already DONE (the locked bar):** Hero (#home), Proof scene (#proof-numbers — graphs + count-up + chok-chok + `view()` entrance), and Selected Work (#work) design. Everything in Phases 1–6 is **TODO**.

---

## Decisions & assets I need from you

**Decisions**
- **Case Studies:** Option **A** (give each card a real screenshot/mini-chart) or Option **B** (fold into Selected Work and delete the text cards)? *I recommend B.*
- **Services:** confirm the 3 "signature" services to feature — I propose **SEO Strategy, Content Writing, Analytics**.
- **Contact:** primary CTA = **WhatsApp** (recommended) or email?
- **Privacy:** which of the 4 flagged screenshots can I show as-is, and which client names/faces/data must I blur first? Nothing public-facing ships until this is settled.

**Photos** *(✅ = already on disk in `madquick-clone/public/images/`)*
- ✅ `abhijit-macbook.png/.webp` — the candid "at the Mac" cut-out (currently unused; the star of Services, Process, About).
- ✅ `abhijit-hero-v6.png` — keep for Hero only; stop reusing it in About.
- Optional: a warm headshot for the Contact close (or I reuse what's on disk).

**Screenshots** *(✅ = on disk)*
- ✅ `work-seo-strategy.png`, `work-wordpress-blogs.png`, `work-social-influencer.webp`, `work-social-calendar.webp`, `work-social-brand.webp`, `work-app-balihans.webp`, `bongbari-proof.jpg`.
- **Need:** Ymedia (articles/tracker) and a RuDe Labs YouTube page — only if Case Studies Option A, or for the Option-B folding.

**GSC data**
- The **Search Console screenshot or CSV** behind +117% clicks / +114% impressions — needed for the Services Analytics tile and Process step 05 (or confirm I render it as a coded mini-chart from the real numbers).

**Logos**
- Monochrome/gold marks for **SEMrush, RankMath, Google Analytics, Meta Business Suite, WordPress** for the Process tool chips — or confirm I source clean ones.

**Numbers (all already verified — I will not invent any):** 3.78M views · +436.5% reach/90d · 400+ articles · 36+ companies · 5+ years · 3 countries · +117% clicks / +114% impressions · #1 ranked wedding venues, Kolkata.