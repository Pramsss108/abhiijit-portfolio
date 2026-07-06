# abhiijit.works — Full Audit & Roadmap (2026-07-06)

**Source:** 21-agent end-to-end audit (SEO, GEO, performance, accessibility, content facts, code logic, security, links, mobile, chat UX) — 96 findings, 53 adversarially confirmed. Full evidence per finding: [AUDIT_FINDINGS_FULL.md](AUDIT_FINDINGS_FULL.md).

**How to read status:** ✅ done · ✅ done · shipped 2026-07-06 late session · ⬜ planned.

---

## Phase 0 — Already shipped today (context)

- ✅ Site restored after CNAME wipe (`abhiijit.works` 200, domain re-linked via Pages API, CNAME now in every build)
- ✅ AI worker moved off the dead `api-inference.huggingface.co` to the HF router — chatbot answers again
- ✅ Chat UI readable & on-brand (solid panel, purge-safe `ai-ab-*` styles, typing dots, mobile sizing)
- ✅ `chat.source.js` restored as editable source (build was minifying `chat.js` onto itself)

---

## Phase 1 — Domain-integrity fixes (CRITICAL, minutes each)

The single-i domain `abhijit.works` **does not exist**. Google is being told that's our canonical home. This silently kills indexing.

| # | Item | Where | Status |
|---|------|-------|--------|
| 1.1 | sitemap.xml URLs → `abhiijit.works` (both `<loc>` entries point at the dead domain — **zero valid URLs today**) | `public/sitemap.xml:4,10` | ✅ |
| 1.2 | robots.txt `Sitemap:` line → `abhiijit.works` | `public/robots.txt:4` | ✅ |
| 1.3 | privacy.html canonical + visible footer domain → `abhiijit.works` | `public/privacy.html:11`, `public/v3/privacy.html:11` | ✅ |
| 1.4 | Test suite asserts the WRONG single-i canonical (invites regression) | `scripts/test-v3.mjs:81,261`, `scripts/test-release.mjs:31-32`, `scripts/test-v3-inline.mjs:204` | ✅ |
| 1.5 | `www.abhiijit.works` HTTPS = 404. Add DNS CNAME `www` → `pramsss108.github.io` at your DNS provider; GitHub auto-301s to apex. **Only you can do this (DNS login).** | DNS provider dashboard | ⬜ USER |
| 1.6 | Delete dead Netlify/Apache artifacts that document the wrong domain (`_redirects`, `.htaccess`, `_headers` — GitHub Pages ignores all three) | `public/_redirects`, `public/.htaccess`, `public/_headers` | ✅ |

## Phase 2 — Scroll performance (your #1 complaint)

Audit + hands-on profiling identified the lag sources; fixes in this session:

| # | Item | Status |
|---|------|--------|
| 2.1 | Process stepper: `min-height:100vh` pin + full height rebuild on every resize/viewport-chrome change → jank | ✅ |
| 2.2 | Unthrottled scroll/pointer handlers in `app.js` (custom cursor, parallax, progress) → passive listeners + rAF coalescing | ✅ |
| 2.3 | Backdrop-filter / heavy box-shadow layers animating during scroll → promote to compositor (`will-change`, transform-only animations) or simplify | ✅ |
| 2.4 | LCP is JS-gated: hero image + H1 sit at `opacity:0` until deferred JS adds `.is-visible` — first paint wasted | ✅ |
| 2.5 | Hero glow PNG 104 KB (heavier than the portrait) above the fold | ✅ |
| 2.6 | `content-visibility: auto` for below-fold sections (already partially used — extend correctly) | ✅ |
| 2.7 | reel-04.mp4 is 5.5 MB (2.6–3.5× sibling reels) → re-encode | ⬜ |
| 2.8 | Chart.js from CDN at runtime (no preconnect, no SRI) → self-host or lazy-init on scroll into stats | ⬜ |
| 2.9 | Strip 1.93 MB of PNG `<picture>` fallbacks modern browsers never fetch but that bloat the repo/deploy | ⬜ |
| 2.10 | Ship minified index.html (143 KB raw, 6.5 KB comments, dev `?edit` script in prod — see 6.4) | ⬜ |

## Phase 3 — Mobile overhaul (you audit when done)

| # | Item | Status |
|---|------|--------|
| 3.1 | **Hero on mobile: restore Abhijit's presence** (portrait invisible/cropped-out on phones — "I am not there") + rebalance type, proof cards, CTAs at 375–430px | ✅ |
| 3.2 | Chat input 14px + autofocus → iOS zooms on every open. Input → 16px, focus only on desktop | ✅ |
| 3.3 | Chat FAB/panel: iOS safe-area insets (`env(safe-area-inset-*)`) | ✅ |
| 3.4 | Touch targets ≥44px: chat close (32), send (40), carousel dots (24), pause (34), arrows (42) | ✅ |
| 3.5 | Mobile menu: no max-height/scroll — WhatsApp CTA unreachable landscape | ✅ |
| 3.6 | Reconcile colliding breakpoint systems (min-width:768 tablet rules vs max-width:820 phone overrides both active 768–820) | ✅ |
| 3.7 | Section-by-section pass at 375px: proof bar, skills carousel, evidence desk, case studies, process stepper, FAQ, contact, footer | ✅ |
| 3.8 | Sub-8px text in media wall/player (0.4rem = 6.4px) → floor at 11–12px | ✅ |
| 3.9 | `100vh` → `100dvh`/`svh` where viewport chrome matters (stepper, mega-menu) | ✅ |

## Phase 4 — AI brain & worker hardening

| # | Item | Status |
|---|------|--------|
| 4.1 | **Rebuild `portfolio_data.json` from the real extracted experience data** (PDF/document/Trello extractions) — all clients, not "MadQuick = the video editing" | ✅ |
| 4.2 | Fix bot handing out dead email `contact@abhiijit.works` → `growabhijit@gmail.com` | ✅ |
| 4.3 | Sync headline facts into brain: 36+ companies, 400+ articles, 3.78M views, +117%, six-step process | ✅ |
| 4.4 | Worker hardening: CORS locked to `https://abhiijit.works`, CORS headers on error responses too, max body/messages/length caps, history trimming server-side | ✅ |
| 4.5 | Prompt-injection resistance: instruction hardening + never reveal system prompt/data dump | ✅ |
| 4.6 | Rate limiting (best-effort free tier: per-IP counter via Cloudflare cache/KV or Durable Object later) | ⬜ |
| 4.7 | max_tokens 300 truncates answers mid-sentence → 380 + "keep answers under 120 words" instruction | ✅ |
| 4.8 | Client: keep last N messages only, input maxlength, retry affordance preserving the failed message, IME composition guard on Enter | ✅ |
| 4.9 | ⚠️ ROTATE the HF key (it was pasted in chat) — huggingface.co → tokens → new token → `npx wrangler secret put HUGGINGFACE_API_KEY` | ⬜ USER |

## Phase 5 — GEO (AI-search visibility)

| # | Item | Status |
|---|------|--------|
| 5.1 | `llms.txt` at site root: who Abhijit is, services, headline numbers, contact | ✅ |
| 5.2 | FAQPage JSON-LD for the 7-question FAQ section | ✅ |
| 5.3 | Merge the two disconnected Person JSON-LD nodes via `@id`; add Service/Offer schema for the 3 sellable services | ⬜ |
| 5.4 | Add quotable third-person sentences binding "Abhijit Pramanik" to facts in visible prose (AI engines lift these verbatim) | ⬜ |
| 5.5 | VideoObject `uploadDate` on all six videos (also required by Google for rich results) | ✅ |
| 5.6 | Person.sameAs: identity profiles only (move WhatsApp action link out; model contact as ContactPoint) | ⬜ |

## Phase 6 — Content & copy corrections (all confirmed)

| # | Item | Status |
|---|------|--------|
| 6.1 | Remove live placeholder: "I will add a safe screenshot here." (+117% evidence panel) | ✅ |
| 6.2 | 3.78M (hero card) vs different statsbar value in same viewport — reconcile | ✅ |
| 6.3 | "Madquick" vs "MadQuick" — pick one everywhere | ✅ |
| 6.4 | +114% → correct math (192k→412k = +114.6% → say +115% or "2.1×") | ✅ |
| 6.5 | "Zest Money" → "ZestMoney" | ✅ |
| 6.6 | Spelling consistency: Specialising vs Maximize (pick US or UK) | ⬜ |
| 6.7 | Title tag 86 chars → ~55–60 ("Abhijit Pramanik — Proof-Backed SEO, Content & Video") | ✅ |
| 6.8 | "400+ articles" narrated against single-client tracker — clarify career-total vs Pursueit | ⬜ |
| 6.9 | Remove obsolete meta keywords tag | ✅ |

## Phase 7 — Accessibility (worst offenders first)

| # | Item | Status |
|---|------|--------|
| 7.1 | Closed chat panel stays focusable (CSS overrides `hidden`) → `visibility:hidden` when closed; Escape closes; focus returns to toggle; `aria-expanded` on toggle; `aria-live=polite` on messages | ✅ |
| 7.2 | Pause/stop control for auto-moving marquees & word rotator (SC 2.2.2) | ⬜ |
| 7.3 | Captions/transcripts for showreel videos (Level A) — needs your captions | ⬜ USER+ME |
| 7.4 | Contrast: "6 selected edits" cue text, carousel dots | ⬜ |
| 7.5 | Remaining ARIA cleanups (tablist children, FAQ collapse visibility, redundant labels) | ⬜ |

## Phase 8 — Platform hygiene & trust

| # | Item | Status |
|---|------|--------|
| 8.1 | apple-touch-icon is SVG (iOS ignores) + `/favicon.ico` 404 → ship 180px PNG + ico | ⬜ |
| 8.2 | Web app manifest | ⬜ |
| 8.3 | Analytics: zero measurement today → add privacy-friendly analytics (GoatCounter/Plausible free tier) so you can SEE visitors | ⬜ |
| 8.4 | Obfuscate the plaintext Gmail against scrapers (JS-assembled or contact form) | ⬜ |
| 8.5 | Remove dev "Hero Editor" (`?edit`) from production build | ⬜ |
| 8.6 | Purge 14+ legacy WordPress/Elementor pages still carrying the dead domain from the repo | ⬜ |
| 8.7 | Re-encode reel-04.mp4; optimize byjus.svg (32 KB logo) | ⬜ |

---

## Suggested order of attack after this session

1. **You:** DNS `www` CNAME (1.5) + rotate HF key (4.9) — ten minutes, only you have the logins.
2. Phase 2 leftovers (2.7–2.10) + Phase 5 leftovers — one sitting.
3. Phase 7 accessibility sweep — one sitting.
4. Phase 8 hygiene — opportunistic.

*Everything marked 🔧 is being implemented right now and will be deployed + verified today.*
