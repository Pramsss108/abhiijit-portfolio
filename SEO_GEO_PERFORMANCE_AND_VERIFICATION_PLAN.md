# Portfolio Performance, SEO/GEO and Verification Architecture Plan

**Project:** Abhijit Pramanik portfolio (`public/v3/`)  
**Planning date:** 1 July 2026  
**Status:** Planning only. This document does not approve or apply production changes.  
**Input:** Current repository, the latest local Lighthouse report, and the supplied research note.

---

## 1. Executive decision

The portfolio should remain a static, progressively enhanced website. Moving it to React, Next.js, a CMS, or a server-rendered stack would add risk without solving the current problems. JavaScript execution is already light; the biggest measurable performance problems are first-paint presentation, a large accumulated CSS file, incomplete production compression verification, and a few oversized or incorrectly prioritized images.

The SEO/GEO strategy should also remain simple. There is no special “AI search” file or magic GEO schema to install. Google’s current guidance says the same foundations used for Search also apply to AI Overviews and AI Mode: crawlable pages, helpful original text, clear internal links, good page experience, and structured data that matches visible content. Our advantage should be unusually specific, verifiable first-hand work—not keyword volume or schema quantity.

The current Verification section is truthful but visually too small and passive. It should become an **Evidence Desk**: a controlled, one-view source dossier where a visitor chooses a claim and inspects its source, time window, Abhijit’s exact role, privacy state and supporting artifact. This must not be another carousel, chart, autoplay sequence or four-card grid.

### Recommended order of work

1. Establish a repeatable performance and indexing baseline.
2. Fix first-paint, CSS and asset delivery without redesigning the website.
3. Correct technical SEO metadata, robots, sitemap and entity data.
4. Prepare real evidence records and permission states.
5. Replace the current Verification ledger with the Evidence Desk.
6. Add dedicated case-study URLs only after the homepage and evidence records are stable.
7. Add privacy-respecting measurement after the privacy notice and event plan are approved.

---

## 2. Current repository baseline

These are repository facts, not estimates.

| Item | Current state | Meaning |
|---|---:|---|
| HTML | about 123 KB | Large for one static page; much of it is repeated carousel/SVG markup. |
| Minified CSS | about 277 KB | The largest code-delivery concern. The stylesheet contains many historical override layers. |
| Minified JS | about 29 KB | Already small. A framework migration is unjustified. |
| DOM size | 1,105 elements | Usable, but high for a portfolio and worth reducing carefully. |
| Images in HTML | 34 | 30 are already lazy-loaded. |
| Company-logo payload | about 194 KB across 22 local files | Reasonable; keep lazy loading and original-color assets. |
| Hero responsive WebP | 50–107 KB | Good. Preserve this responsive path. |
| Decorative hero glow | about 102 KB and preloaded high priority | It competes with useful first-screen resources. |
| Proof MacBook portrait | about 998 KB PNG | High-priority conversion candidate even though it is lazy-loaded. |
| Old hero social image | about 933 KB PNG | Used in Open Graph/Twitter metadata; needs a dedicated sharing image. |
| `robots.txt` | Missing | Search engines have no explicit sitemap reference or crawler policy file. |
| `sitemap.xml` | Missing | Important production URLs are not declared in one place. |
| Structured data | One `Person` object | Good start, but contains relative image data and very limited identity links. |
| Title length | 92 characters | Too long and diluted. |
| Meta description | 195 characters | Longer than useful search-result copy and difficult to scan. |
| Meta keywords | Present | Obsolete and removable. |

### Latest stored Lighthouse baseline

The repository’s latest stored mobile Lighthouse report (`perf-reports/verified.json`, captured 30 June 2026) records:

| Metric | Stored result | Target |
|---|---:|---:|
| Performance score | 77 | 90+ lab; field data is the real authority |
| First Contentful Paint | 3.2 s | under 1.8 s lab target |
| Largest Contentful Paint | 4.6 s | under 2.5 s at the 75th percentile |
| Total Blocking Time | 20 ms | already excellent |
| Cumulative Layout Shift | 0.002 | already excellent |
| Total transfer | 904 KiB | under 700 KiB initial target |
| Estimated unused CSS | 178 KiB | strong evidence that CSS consolidation matters |
| Estimated text-compression saving | 325 KiB | production Brotli/Gzip must be verified, not assumed |
| Estimated image-delivery saving | 103 KiB | mainly responsive sizing/format work |

**Interpretation:** do not spend the first sprint rewriting small JavaScript. The largest gains should come from removing the first-load visual delay, reducing render-blocking CSS, delivering correctly sized images, and confirming production compression.

---

## 3. What to take from the supplied research

### Adopt now

- Modern, responsive image delivery using WebP/AVIF where browser and asset compatibility permit it.
- Lazy loading for genuinely offscreen media, while keeping the actual LCP portrait eager and high priority.
- Brotli/Gzip, long-lived immutable caching for versioned assets, and CDN edge delivery on production.
- A performance budget enforced before deployment.
- Semantic, crawlable HTML with one clear H1 and descriptive section headings.
- Canonical URLs, `robots.txt`, XML sitemap, Search Console and index coverage checks.
- Visible, first-hand case-study text with source, dates, role and outcome.
- Structured data that describes what visitors can actually see.
- Privacy-aware event tracking for proof engagement and contact intent.
- Ethical personalization and proof in future outreach, rather than fabricated urgency.

### Adapt to this portfolio

- **Critical CSS:** first consolidate the 277 KB stylesheet. Do not immediately create a fragile hand-maintained critical-CSS system on top of a cascade with historical overrides.
- **Code splitting:** section-level CSS splitting may help later, but multiple tiny files can add complexity. The first goal is one clean core stylesheet under budget.
- **CDN:** use the production host’s native CDN before introducing AWS/GCP infrastructure. This portfolio does not need Cloud Run, Lambda or Terraform merely to serve static files.
- **Analytics:** start with a small consent-aware analytics implementation. Server-side GTM is unnecessary until traffic volume, data quality or compliance needs justify its operational cost.
- **Schema:** use a small accurate graph (`ProfilePage`/`Person`/`WebSite` and specific case-study entities). Do not apply every schema type mentioned in the research.
- **Dedicated content:** the homepage should remain the conversion overview; the best three case studies can later receive stable crawlable URLs for deeper search intent.

### Explicitly reject or defer

- Do not add fake scarcity, false deadlines, inflated client counts or generic testimonials.
- Do not add `llms.txt`, “AI schema,” hidden answer text or keyword-stuffed GEO sections. Google currently states these are not special requirements for its generative search features.
- Do not migrate to a framework for performance. The existing 29 KB JS bundle is not the bottleneck.
- Do not add a chatbot merely because the research lists one. It adds payload, distraction and privacy work before proving demand.
- Do not add background video, Lottie, 3D libraries or another continuously animated section.
- Do not preload below-the-fold images or decorative effects.
- Do not create thin location pages for India, Dubai and the USA. Mention locations only where real work supports them.
- Do not mark up hidden or unverified claims in JSON-LD.
- Do not expect FAQ schema to create a special GEO advantage. The visible FAQ is useful for people; schema should only be added if it is accurate and maintainable.
- Do not optimize to the outdated FID metric from the supplied report. The current responsiveness Core Web Vital is INP.

---

## 4. Performance architecture

### 4.1 Performance budgets

The budget is a release gate, not an aspiration.

| Budget | Mobile target | Failure action |
|---|---:|---|
| LCP | ≤ 2.5 s at p75; ≤ 3.0 s throttled lab | Block release and inspect LCP phases |
| INP | ≤ 200 ms at p75 | Profile event handlers and main-thread work |
| CLS | ≤ 0.10 | Fix dimensions, font shifts or injected UI |
| TBT (lab proxy) | ≤ 150 ms | Reduce startup/long tasks |
| Initial transfer | ≤ 700 KiB compressed | Identify new/oversized resources |
| Initial JS | ≤ 45 KiB compressed | Reject unnecessary libraries |
| Render-blocking CSS | ≤ 90 KiB compressed first milestone; ≤ 70 KiB preferred | Consolidate/purge before adding styles |
| LCP portrait | ≤ 110 KiB desktop; ≤ 70 KiB mobile | Re-encode and verify `srcset` |
| Below-fold proof image | ≤ 180 KiB per responsive source | Generate correct WebP/AVIF variants |
| DOM elements | ≤ 900 preferred | Remove duplicate decorative/repeated markup |
| Continuous animation | One coordinated frame loop maximum | Pause or remove independent loops |

### 4.2 P0: first-paint and LCP

1. **Make the opening curtain non-blocking.** It already runs once per session and is skipped on compact/reduced-motion devices, but it can still delay a first desktop visit. Keep the visual identity while allowing the hero to paint beneath it. Target a maximum 450–600 ms visible overlay or turn it into a small logo flourish that never owns the full viewport.
2. **Keep only the true LCP asset at high priority.** Preserve the responsive `abhijit-hero-v7` preload and eager image. Remove high-priority loading from the decorative `hero-glow-720.webp`; recreate it as CSS if visual parity is possible, otherwise load it normally.
3. **Self-host the exact font cuts used above the fold.** Subset Fraunces and Inter to WOFF2, preload only the two essential files, and keep `font-display: swap`. This removes two third-party connection hops and makes font behavior controllable.
4. **Shorten the render-blocking stylesheet path.** Consolidate the override layers before attempting asynchronous CSS loading. A broken first paint is worse than a slightly larger stylesheet.
5. **Measure LCP phase breakdown.** Record TTFB, resource-load delay, resource duration and element-render delay. If the image is downloaded early but LCP remains late, the curtain/reveal logic—not compression—is the cause.

### 4.3 P0: CSS consolidation

The stylesheet is the main maintenance and delivery risk.

Recommended end state:

```text
public/v3/styles/
  tokens.css          colour, type, spacing, motion tokens
  foundation.css      reset, typography, containers, accessibility
  header-hero.css     first-screen styles
  proof.css           proof scene + company divider
  evidence.css        new Evidence Desk
  expertise.css       ten-skill carousel only
  work.css            case studies and selected work
  lower-page.css      process, about, FAQ, contact, footer
  utilities.css       reduced motion, content visibility, helpers
```

For production, these can still be bundled into one minified file. The separation is for ownership and removal of contradictory overrides, not necessarily more network requests.

Rules for the cleanup:

- Inventory the final computed styles for each section at desktop and mobile.
- Move only the winning declarations into the new files.
- Delete superseded override layers after screenshot and DOM comparison.
- Use cascade layers (`@layer reset, tokens, base, components, utilities`) if browser support requirements allow it.
- Stop adding emergency rules to the bottom of `styles.css` once migration starts.
- Preserve reduced-motion behavior and `content-visibility` optimizations.
- Run screenshot comparison at 390×844, 768×1024, 1440×900 and 1920×1080.

### 4.4 P0: media and social assets

- Convert `abhijit-macbook.png` (about 998 KB) into responsive WebP/AVIF sources around 480, 720 and 960 pixels. Preserve the transparent edge quality and verify the existing CSS glow does not create a box.
- Create a dedicated 1200×630 Open Graph image, ideally a compressed JPEG under 200 KB. Do not use the old 933 KB transparent hero PNG for link previews.
- Make `og:image`, `twitter:image` and JSON-LD image URLs absolute production URLs.
- Continue lazy loading the work images. Add `srcset`/`sizes` to any screenshot rendered substantially smaller than its source dimensions.
- Keep company logos in original colors. Do not rasterize clean SVG assets merely for uniformity.
- Do not preload any logo, proof screenshot, case-study image or Verification artifact.

### 4.5 P1: runtime and motion governor

The site should feel premium because motion responds immediately, not because everything moves continuously.

- Coordinate scroll progress, cursor position and other per-frame work through one requestAnimationFrame scheduler.
- Keep pointer tracking passive and perform only transform/opacity writes inside animation frames.
- The custom cursor must not interpolate so slowly that it trails the real pointer. Target visual latency below one frame on normal hardware; disable the effect on coarse pointers.
- Pause canvas, ticker and carousel activity when the document is hidden or the relevant section is not near the viewport.
- On low-power devices (`prefers-reduced-motion`, coarse pointer, low device memory or low hardware concurrency), use the static background and native controls.
- Never animate layout properties (`top`, `left`, `width`, `height`) during continuous interactions.
- Do not add perpetual motion to the Evidence Desk. Its only flourish should run once after an intentional click/focus selection.
- Consolidate IntersectionObservers by behavior where practical, but only after profiling; current TBT is already strong.

### 4.6 P1: production delivery

The repository already contains `_headers` and `.htaccess` compression/cache intent. Production must prove those rules are actually applied.

- Verify `Content-Encoding: br` or `gzip` on HTML, CSS, JS, JSON and SVG.
- Verify one-year immutable caching for versioned CSS/JS.
- Fingerprint or version long-lived image URLs before changing the image cache from seven days to one year.
- Ensure HTML remains `max-age=0, must-revalidate` or uses an equally safe deployment strategy.
- Serve HTTP/2 or HTTP/3 through the production CDN.
- Add a deployment smoke test that checks status, content type, encoding, cache policy and canonical headers.
- Do not add a service worker in this phase. It is unnecessary and creates cache invalidation risk.

### 4.7 Performance QA commands/artifacts

Add a repeatable `perf` workflow later:

```text
perf-reports/
  baseline-mobile.json
  baseline-desktop.json
  candidate-mobile.json
  candidate-desktop.json
  budget-summary.md
```

Required checks:

- Lighthouse mobile and desktop, three runs each; compare the median.
- Chrome performance trace for LCP and pointer interaction.
- Network check with cache disabled and a second check with a warm cache.
- No-JS smoke test for readable content and navigation.
- Reduced-motion smoke test.
- Production-header check; localhost compression results are not production evidence.

---

## 5. Technical SEO plan

### 5.1 Metadata corrections

Current title and description are too long. The final wording should be decided after the production domain and target audience are confirmed, but the shape should be:

```text
Title: Abhijit Pramanik | SEO, Social Media & Web Portfolio
Description: SEO, social media, content and website work by Abhijit Pramanik, with documented results, case studies and source-backed project evidence.
```

Actions:

- Keep the title around 50–65 characters where possible.
- Keep the description around 140–160 useful characters; do not treat this as a hard ranking rule.
- Remove `<meta name="keywords">`.
- Confirm that `https://abhijit.works/` is the real production canonical before deployment.
- Redirect `/v3/` and any duplicate index URLs to the selected canonical rather than merely declaring it.
- Use absolute Open Graph/Twitter image URLs and a dedicated share image.
- Add `og:image:width`, `og:image:height` and `og:image:type`.
- Keep one H1. Existing section H2 structure can remain after heading-order validation.

### 5.2 Crawl and indexation files

Create at the production web root:

```text
robots.txt
sitemap.xml
```

`robots.txt` should permit the public portfolio and declare the sitemap. It should not attempt to hide sensitive artifacts that are publicly addressable; private evidence must never be deployed to a public URL.

The sitemap should initially include only canonical, indexable pages:

- Homepage
- Privacy & Evidence Policy
- Later: approved case-study pages

Do not include local previews, archived clones, tuning routes, test pages, private proof directories or duplicate service pages.

### 5.3 Structured data graph

Use one small, consistent JSON-LD graph rather than many disconnected blocks:

```text
WebSite
└── ProfilePage (homepage)
    └── mainEntity → Person (Abhijit Pramanik)
        ├── sameAs → verified professional/social profiles
        ├── knowsAbout → visible capability entities
        └── subjectOf → approved case-study CreativeWork pages
```

Corrections to the existing `Person` data:

- Use absolute image URLs.
- Add only verified public `sameAs` links, such as LinkedIn, Instagram or another professional profile. WhatsApp alone is not an identity graph.
- Keep `jobTitle` recruiter-friendly and consistent with the visible hero/About text. Avoid making Abhijit sound like an agency.
- Do not encode “36+ companies,” performance metrics or clients into schema unless the same information is visible, current and defensible.
- If dedicated case studies are created, describe each as visible `CreativeWork` content with author/creator, date, about, image and URL. Do not invent a non-standard `CaseStudy` type.
- Validate syntax with Schema.org tooling and Google’s Rich Results Test, while remembering that valid schema does not guarantee a rich result.

### 5.4 Search-oriented content architecture

The homepage can target the person/entity query and broad capability intent. Deeper proof should eventually live at stable URLs:

```text
/
/case-studies/bongbari-social-growth/
/case-studies/seo-organic-click-growth/
/case-studies/pursueit-seo-social-content/
/privacy/
```

Each case study must contain:

1. Context and business/site type.
2. Abhijit’s exact role and whether the work was direct, contract, team-based or owned.
3. Starting condition and time window.
4. Decisions/actions—not only a service list.
5. Result with units and comparison method.
6. Evidence source and privacy state.
7. Artifact with descriptive alt text.
8. What cannot be publicly shown and why.
9. Date published and date last verified.
10. A contextual link back to the relevant homepage expertise and contact path.

This is stronger for recruiters, clients and AI retrieval systems than adding more generic service copy to the homepage.

### 5.5 Search Console launch sequence

- Verify the production domain property.
- Submit the sitemap.
- Inspect the homepage, privacy page and each approved case-study URL.
- Check rendered HTML, canonical selection and mobile usability.
- Monitor indexed pages and exclusions weekly during the first month.
- Record branded and capability queries separately.
- Do not infer AI Overview traffic from a custom “GEO score.” Google reports AI-feature traffic within normal Web search reporting.

---

## 6. GEO / answer-engine plan

For this project, GEO means making first-hand work easy to retrieve, understand and cite. It does not mean creating a second layer of robotic copy.

### 6.1 Content format

- Begin important sections with a direct factual answer, then provide evidence.
- Keep capability language conversational and first-person: “I planned…”, “I built…”, “I measured…”.
- Use explicit entity names, dates, locations and roles where permission allows.
- Keep each metric next to its source and comparison window.
- Write short descriptive captions for artifacts; do not rely on images to carry key facts.
- Give case-study pages focused titles that answer a real query rather than vague campaign names.
- Use visible “Last verified” dates on evidence records.
- Link related concepts together: SEO strategy → relevant case study → source dossier → contact.

### 6.2 Answer blocks worth adding naturally

These can be included in case studies or the FAQ, not forced into every section:

- What exactly did Abhijit do on this project?
- Which parts were owned work versus client work?
- What source was used for the result?
- What period does the metric cover?
- Can the underlying proof be viewed publicly?
- Does Abhijit build custom-coded and template-based websites?
- Can one person handle SEO, social content and website delivery together?

Each answer should be 40–100 words, specific and linked to evidence when available.

### 6.3 Entity consistency checklist

The following must agree across the hero, About, FAQ, resume, schema and social profiles:

- Name spelling
- Primary professional title
- Starting year / years of experience
- Current location or service regions, if publicly stated
- Owned properties versus client properties
- Contact email
- Public profile URLs
- Company count and article count methodology

One inconsistent experience statement weakens both human trust and machine/entity confidence.

### 6.4 GEO non-goals

- No AI-generated bulk articles.
- No keyword variants inserted only for bots.
- No hidden FAQ answers.
- No fabricated citations or third-party validation.
- No special AI crawler files presented as a ranking shortcut.
- No schema values that are absent from visible content.

---

## 7. Recommended Verification redesign: the Evidence Desk

### 7.1 Why the current section feels weak

The current Verification section is a heading plus a compact two-column ledger. It explains methodology, but it does not let a skeptical visitor inspect anything. It is visually subordinate to the proof graph above and the animated expertise carousel below, so it reads like a disclaimer instead of a signature credibility experience.

Making it larger by adding four glowing cards would repeat the site’s existing visual language. Making it a carousel would hide proof and repeat an interaction already used for Skills. Making another graph would confuse “visualized result” with “verification.”

### 7.2 Core concept

Build a one-view **Evidence Desk**: a quiet, investigative interface inspired by an audit file rather than a dashboard.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ VERIFICATION                                                        │
│ Every number has a source, a window and a named role.               │
├───────────────────────┬──────────────────────────────────────────────┤
│ CLAIM INDEX           │ ACTIVE EVIDENCE DOSSIER                      │
│                       │                                              │
│ 01  3.78M views       │ META INSIGHTS · AP-SOC-378-90D              │
│     Public artifact ● │ ┌───────────────────┐  Claim: 3,783,817     │
│                       │ │ proof screenshot  │  Window: 90 days      │
│ 02  +117% clicks      │ │ with safe crop    │  Role: owner/operator │
│     Source record ◐   │ └───────────────────┘  Status: documented   │
│                       │                                              │
│ 03  400+ articles     │ SOURCE → WINDOW → ROLE → PERMISSION         │
│     Aggregate only ◐  │                                              │
│                       │ [Open full case study] [Evidence policy]     │
│ 04  36+ companies     │                                              │
│     Archive record ◐  │ Last checked: YYYY-MM-DD                     │
└───────────────────────┴──────────────────────────────────────────────┘
```

This is a selectable dossier, not an autoplay slider:

- The left claim index is always visible on desktop.
- Selecting a claim replaces the dossier content on the right.
- Nothing advances automatically.
- The URL hash can update (`#evidence-click-growth`) so a claim can be linked directly.
- The default selection is the strongest artifact that is safe to publish.
- All four claims remain present as semantic text in the HTML.

### 7.3 Why this architecture is different

- **Not a graph:** it displays provenance rather than re-visualizing performance.
- **Not a carousel:** no autoplay, drag, arrows, horizontal movement or hidden sequence.
- **Not another card grid:** one focused inspection surface gives the section hierarchy.
- **Not a generic timeline:** the sequence is logical—claim to source to window to role to permission—not merely chronological.
- **User-controlled:** a recruiter can inspect the one claim they care about without waiting.
- **SEO-safe:** all evidence summaries exist in semantic HTML, not canvas or image-only content.

### 7.4 Visual direction

Keep the existing black/champagne system, but change the material language:

- Use a matte document surface with one crisp perimeter line, not glow-heavy glass cards.
- Give every claim a short evidence ID, such as `AP-SEO-117-06M`.
- Use restrained source stamps: `PUBLIC`, `REDACTED`, `AGGREGATE`, `AVAILABLE ON REQUEST`.
- Place metadata in a narrow monospace or tabular-numeral treatment while headlines remain Fraunces.
- Show artifact crops at a readable size with explicit captions.
- Use real redaction bars only where necessary; do not use fake “classified” decoration.
- A single thin gold “scanner” line may cross the artifact once after an intentional selection. Duration: 400–550 ms. No loop.
- The selected claim receives one precise gold rule and a status dot; unselected claims remain fully legible.
- Use no 3D tilt, no cursor magnetism and no continuous glow animation in this section.

### 7.5 Interaction model

#### Desktop

- Four claim buttons form a vertical index.
- Arrow Up/Down changes selection; Enter follows a case-study/evidence link.
- Hover may preview selection only if it does not cause accidental content changes; click/focus is safer and preferred.
- Dossier content uses a 180–240 ms opacity/translate transition.
- Artifact scanner runs once per intentional selection.
- Focus remains visible and is never moved unexpectedly.

#### Mobile

- Convert the same content to four native `<details>` dossiers.
- First dossier may be open by default; no horizontal layout or tablist dependency.
- Opening one item does not trap page scrolling.
- Artifact image remains lazy-loaded until its dossier approaches the viewport.
- No scanner animation when reduced motion is requested.

#### No JavaScript

- Render all claim summaries and source metadata in a readable vertical list.
- Artifacts and links remain accessible.
- The section cannot depend on JS to expose essential proof text.

### 7.6 Evidence record model

Every claim needs the same fields before it enters the interface:

```json
{
  "id": "AP-SEO-117-06M",
  "claim": "+117% organic clicks",
  "exactValue": "8,480 to 18,400 clicks",
  "source": "Google Search Console",
  "property": "bongbari.com",
  "window": "latest six months vs previous six months",
  "role": "owner and SEO operator",
  "method": "comparison of identical six-month periods",
  "artifact": "/images/evidence/gsc-click-growth-960.webp",
  "artifactAlt": "...",
  "permission": "owned data",
  "publicStatus": "public-redacted",
  "lastVerified": "YYYY-MM-DD",
  "caseStudyUrl": "/case-studies/seo-organic-click-growth/"
}
```

The JSON above describes the content model. Essential text should still be pre-rendered into HTML; do not make a runtime fetch the only source of indexable evidence.

### 7.7 Initial evidence inventory

| Claim | Current source statement | Existing artifact | Work required before build |
|---|---|---|---|
| 3.78M views | Meta Insights, Bongbari owned property, 90 days | `bongbari-proof.jpg` exists | Confirm exact dates, role language and safe crop; create responsive WebP/AVIF. |
| +117% clicks | Google Search Console, latest six months vs previous six months | Current page has a drawn chart, not a source artifact | Capture/export a permission-safe GSC artifact; record exact dates and starting/ending values. |
| 400+ articles | WordPress and publishing trackers | No single public source artifact identified | Define counting method, duplicate policy and a redacted tracker sample. |
| 36+ companies | Resume and project archive | Company logos plus resume/project records | Define what counts as company/project, relationship type and permission status. |

Do not label all four claims “verified” in the same way. Use accurate status language:

- **Public source artifact** — visitor can inspect the supporting image/link.
- **Documented, redacted** — artifact exists but sensitive details are removed.
- **Aggregate methodology** — total is derived from multiple records with the method explained.
- **Private record available on request** — evidence exists but cannot be published.
- **Independently verified** — use only if a genuine independent verifier has checked it.

### 7.8 Recommended content copy shape

Section heading:

> **See what each number is built on.**

Supporting line:

> Choose a result to inspect its source, time window, my role and what can be shown publicly.

Do not overuse “proof-backed,” “trust,” “credible,” or “verified.” The interface should demonstrate those qualities through fields and artifacts.

### 7.9 Proposed implementation files

```text
public/v3/index.html                 semantic Evidence Desk markup
public/v3/styles/evidence.css       isolated section styles
public/v3/app.js                    small selection enhancement only
public/images/evidence/             approved responsive artifacts
content/evidence-manifest.json      private build/QA source, not sensitive data
scripts/validate-evidence.mjs       checks required fields and public file paths
public/v3/privacy.html              evidence/publication policy updates
```

Sensitive raw exports must remain outside `public/`. Only approved redacted derivatives belong in `public/images/evidence/`.

---

## 8. Privacy-respecting measurement plan

Do not install a full analytics stack until the privacy notice and event names are approved.

Recommended first events:

| Event | Trigger | Purpose |
|---|---|---|
| `evidence_select` | Visitor intentionally selects a dossier | Which proof matters most |
| `evidence_artifact_open` | Visitor opens a full artifact | Depth of trust engagement |
| `case_study_open` | Visitor follows a case-study link | Proof-to-detail progression |
| `contact_intent` | WhatsApp/email/project CTA click | High-intent conversion |
| `resume_open` | Resume link opened | Recruiter intent |

Rules:

- Do not track hover, cursor movement or every carousel impression.
- Do not include names, emails or evidence IDs containing client-sensitive data in analytics payloads.
- Respect consent requirements for the chosen analytics provider and visitor regions.
- Establish a baseline before A/B testing.
- Test one high-impact change at a time.
- Do not optimize for raw time-on-page; use evidence engagement and contact intent.

---

## 9. Phased execution plan

### Phase 0 — decisions and evidence permissions

- Confirm the production domain/canonical URL.
- Confirm public LinkedIn/Instagram/professional profile URLs.
- Approve the exact title/job description used across hero, About and schema.
- Confirm exact time windows for the four headline metrics.
- Classify each artifact as public, redacted, aggregate or private.
- Decide whether the three strongest case studies can receive public URLs.

**Exit gate:** no contradictory identity or metric data remains.

### Phase 1 — performance without visual redesign

- Capture fresh three-run mobile/desktop baselines.
- Shorten or make the curtain non-blocking.
- remove decorative high-priority loading.
- Self-host/subset fonts.
- Create responsive proof portrait assets.
- Create the dedicated social-share image.
- Verify production Brotli/Gzip and cache headers.

**Exit gate:** median mobile LCP improves materially with no regression to CLS, TBT or visual quality.

### Phase 2 — CSS consolidation

- Inventory final computed styles.
- Create section-owned CSS modules.
- Remove superseded overrides.
- Bundle/minify for production.
- Perform multi-viewport screenshot and interaction QA.

**Exit gate:** minified CSS under 90 KB first milestone, or a documented reason for any excess; no broken carousel, proof glow, cursor or reduced-motion mode.

### Phase 3 — technical SEO/GEO foundation

- Correct title, description, social metadata and absolute URLs.
- Add `robots.txt` and `sitemap.xml`.
- Build the small structured-data graph.
- Validate canonicals and redirects.
- Verify Search Console and submit sitemap.
- Add entity/date/role/source consistency checks.

**Exit gate:** production pages are crawlable, canonical and schema-valid; all structured data matches visible text.

### Phase 4 — evidence content preparation

- Create the four approved evidence records.
- Produce redacted, responsive artifact images.
- Write descriptive alt text and captions.
- Add last-verified dates.
- Update Privacy & Evidence Policy.

**Exit gate:** every public claim has source, window, role, method, permission state and an approved artifact or explicit private status.

### Phase 5 — Evidence Desk build

- Implement semantic HTML first.
- Build desktop claim index and dossier panel.
- Build mobile `<details>` layout.
- Add keyboard behavior, hash links and one-shot selection transition.
- Test no-JS and reduced-motion states.
- Add analytics hooks without activating a provider until privacy approval.

**Exit gate:** the section fits within one desktop viewport at 900px height in its default state, exposes all claims accessibly, and adds no continuous animation or page-scroll interception.

### Phase 6 — dedicated case studies and measurement

- Publish only the strongest evidence-ready case studies.
- Add contextual internal links.
- Update sitemap/schema.
- Activate consent-aware measurement.
- Observe for at least two weeks before changing design based on behavior.

**Exit gate:** each case study is independently useful, indexable, source-backed and not duplicate homepage copy.

---

## 10. Definition of done

### Performance

- LCP, INP and CLS meet the agreed budget in field or representative lab testing.
- No first-load animation prevents meaningful content from painting.
- CSS is consolidated and no longer maintained through endless bottom-of-file overrides.
- Production compression and caching are proven with response headers.
- No cursor, canvas or carousel activity continues unnecessarily offscreen.

### SEO/GEO

- Production canonical, redirects, robots and sitemap agree.
- Metadata is concise and the share image is purpose-built.
- One consistent person/entity description appears across visible content and JSON-LD.
- Important facts are available as readable text.
- Case studies clearly state context, role, action, result, source and date.
- No special GEO hacks, hidden content or misleading schema exists.

### Verification

- The section is visually important without imitating the graph or Skills carousel.
- Visitors choose a claim; nothing autoplays.
- Every claim exposes source, time window, role, method and permission status.
- Public artifacts are readable, optimized and appropriately redacted.
- “Independently verified” is never used without an independent verifier.
- Mobile, keyboard, no-JS and reduced-motion experiences remain complete.

---

## 11. Decisions required before implementation

1. Confirm whether `https://abhijit.works/` is the final production canonical.
2. Provide the public professional profile URLs that may be included in `sameAs`.
3. Approve which evidence artifacts may be public versus redacted/private.
4. Provide the exact start/end dates behind `3.78M`, `+117%`, `400+` and `36+`.
5. Confirm the preferred section name: **Evidence Desk**, **Source Dossier**, or a simpler visible label such as **Verification** with “Evidence Desk” used only internally.
6. Confirm whether three dedicated case-study pages are allowed after the homepage work is stable.

---

## 12. Primary references

- [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search Central: Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Search Central: Crawling and indexing](https://developers.google.com/search/docs/crawling-indexing)
- [Google Search Central: Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google Search Central: Structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [web.dev: Web Vitals](https://web.dev/articles/vitals)
- [Schema.org](https://schema.org/)

---

## Final recommendation

Approve Phases 0–1 first. They produce measurable speed improvements and resolve evidence ambiguity without changing the visual system. Build the Evidence Desk only after the four claim records and permissions are complete; otherwise a larger Verification design will amplify the same lack of inspectable detail that makes the current section feel weak.
