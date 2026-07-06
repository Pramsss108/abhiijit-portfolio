# Phase 0-2 and Evidence Desk implementation report

Date: 2026-07-02  
Project: Abhijit Pramanik portfolio (`public/v3/`)  
Local preview: `http://localhost:5055/v3/` and `http://localhost:5055/`

## Executive status

Phases 0, 1 and 2 are implemented. The planned Verification redesign is also implemented as the Evidence Desk. The production root now serves the same portfolio document as the v3 preview, all confirmed profiles are wired, the evidence records are machine-validated, and the final desktop/mobile interaction suite passes.

No exact evidence date was fabricated. The retained Meta artifact visibly contains `30 Mar - 27 Jun` and `Last 90 days`, so that partial range is published with an explicit note that the crop does not show the year. The Search Console comparison remains labelled as two consecutive six-month periods with exact dates not retained.

## 2026-07-03 content and video polish

The portfolio was checked against the extracted experience data in the sibling
`career-dashboard/data/` folder. The main sources are:

- `experience_claims.json`: 303 extracted claims, including 259 marked safe;
- `experience_attachment_summaries.json`: 131 extracted work assets;
- `experience_graph.json`: normalized companies, projects, skills and proof links;
- `experience_ledger_export.json`: consolidated work ledger;
- `Video Editing Resume Abhijit.txt`: video roles and work across PursueIt Dubai,
  Aura Love Yourself USA and Balihans Bengaluru.

Changes made from that review:

- Replaced Verification jargon such as “Claim Index,” “artifact,” “aggregate
  methodology” and “evidence dossier” with direct professional language.
- Rewrote the six Process steps in plain English.
- Rewrote About to cover SEO, content, social media, websites, motion graphics
  and video editing without agency-style language.
- Added the user-confirmed `300+ videos edited` claim to the manifest.
- Updated video capability copy from short-form only to reels, ads, live
  footage, motion graphics and longer videos.
- Added a compact video editing bay inside Case Studies: three primary reel
  frames, one additional reel slot and two landscape slots.
- Added a native full-screen dialog viewer. Empty slots show a clear pending
  state; filling `data-video-src` activates real playback without changing the UI.
- Added `public/videos/README.md` and a six-slot JSON upload map.
- Compressed Verification to one desktop viewport at supported desktop heights.
- Added wider static warm/cool light fields to Evidence, Skills, Work, Process,
  About, FAQ and Contact. No new background image or animation was added.
- Fixed the Process heading being clipped by an old reveal class.

Final post-polish Lighthouse sample:

| Metric | Desktop | Mobile |
|---|---:|---:|
| Performance | 97 | 74 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 610 ms | 2,865 ms |
| LCP | 1,270 ms | 5,715 ms |
| TBT | 0 ms | 33 ms |
| CLS | 0 | 0 |

The six empty video slots add no video network requests. Current production
CSS is approximately 34.1 KB Brotli and JavaScript is approximately 8.9 KB
Brotli. Visual QA files include `video-showcase-desktop.png`,
`video-showcase-mobile.png`, `process-background-desktop.png`, and the updated
Evidence screenshots under `perf-reports/phase-012/`.

## Phase 0 — identity, canonical and evidence decisions

Completed:

- Confirmed production canonical: `https://abhijit.works/`.
- Confirmed LinkedIn: `https://www.linkedin.com/in/abhijitsprofile/`.
- Confirmed Bongbari Instagram: `https://www.instagram.com/thebongbari/` / `@thebongbari`.
- Updated every active Bongbari link and visible handle.
- Added a structured evidence manifest at `content/evidence-manifest.json`.
- Added a validation command: `npm.cmd run validate:evidence`.
- Created the 1200 x 630 social-sharing image `public/images/abhijit-portfolio-share.jpg`.
- Wired canonical, Open Graph, Twitter and Person JSON-LD URLs to the production domain.
- Added `robots.txt` and a one-URL canonical `sitemap.xml`.
- Added Apache and Netlify-style `/v3/` to `/` redirect rules.
- Updated the build so `public/v3/index.html` remains the editable source and is copied to `public/index.html` for the production root.

Evidence status:

| Claim | Public status | Date/window status |
|---|---|---|
| 3,783,817 views | Public Meta Insights artifact from the owned `@thebongbari` page | 30 Mar-27 Jun, 90 days; year is not visible in the retained crop |
| +117% organic clicks | Owned Google Search Console record; public source crop still required | Two consecutive six-month periods; exact dates not retained |
| 400+ articles | Permission-safe career aggregate from publishing records | Career window since 2019 |
| 36+ companies | Resume/project archive with direct, contract and team relationships | Career window since 2019 |

## Phase 1 — loading and runtime performance

Completed:

- Removed Google Fonts from the critical path.
- Added self-hosted, subset Fraunces normal and italic fonts.
- Added a measured `Fraunces Fallback` face using Georgia at `86.5% size-adjust`; loaded and blocked-font tests now produce identical hero dimensions.
- Changed font loading to avoid a late visual swap.
- Added smaller responsive hero and proof portrait sources.
- Corrected the hero preload to the real image family.
- Removed the decorative glow preload.
- Reduced the opening curtain to roughly 680 ms and limited it to the first desktop view per session.
- The curtain is skipped on mobile, returning navigation and reduced-motion mode.
- Split startup initialization across frames.
- Deferred proof-chart loading until the proof area approaches the viewport.
- Paused continuous marquee/hero motion while it is off screen.
- Added `content-visibility` and measured intrinsic-size fallbacks to lower sections.

## Phase 2 — production assets and manual CSS consolidation

Completed:

- Added a production pipeline using PurgeCSS, CSSO and Terser.
- Added `npm.cmd run build:v3`.
- Production CSS and JavaScript are regenerated from editable source files.
- Removed the unused standalone PurgeCSS config after consolidating the build configuration into `scripts/build-v3.mjs`.
- Manually removed superseded page-background and hero-background declarations that were still competing in the cascade.
- Replaced the opaque flat content-panel fill with one authoritative CSS-only atmospheric treatment.
- Consolidated the old Verification ledger CSS into the isolated Evidence Desk component.
- Corrected Skills carousel list semantics and enlarged dot hit targets to 24 px while retaining the visible 9 px dots.

Current asset sizes:

| Asset | Raw | Gzip level 9 | Brotli quality 11 |
|---|---:|---:|---:|
| `styles.min.css` | 212,571 bytes | 41,103 bytes | 32,654 bytes |
| `app.min.js` | 30,673 bytes | server-dependent | server-dependent |
| Evidence WebP | 14,320 bytes | already image-compressed | already image-compressed |

The raw CSS is not below the original aspirational 90 KB milestone. Reaching that number would require rewriting mature hero, proof and carousel components, not merely deleting unused rules. The current production transfer is approximately 32.7 KB with Brotli. The new Evidence Desk and atmosphere increased Brotli CSS by only about 1.5 KB compared with the pre-desk build.

## Evidence Desk architecture

The previous compact ledger was replaced with a focused audit folio:

- Four claims remain semantic, indexable HTML.
- Desktop uses a persistent claim index and one active dossier.
- Up/Down, Left/Right, Home and End keys change the selected dossier.
- Selection updates a shareable evidence hash such as `#evidence-search`.
- Mobile uses native `<details>` disclosures and never captures vertical scrolling.
- No JavaScript leaves all four dossiers open and readable.
- Reduced-motion mode disables the one-shot artifact scanner.
- The scanner runs only after an intentional selection and never loops.
- The Bongbari dossier uses a real 14.3 KB WebP artifact.
- Search, publishing and company records use honest source-status views rather than simulated screenshots.
- Public, owned, aggregate and private statuses are visually and verbally distinct.

## Background and visual treatment

The black background was not replaced with another image or canvas. The opaque content panel was the reason the earlier global atmosphere disappeared after the hero.

The final treatment uses:

- one fine champagne point field;
- four very low-opacity warm/cool radial light fields;
- the existing near-black tonal gradient;
- no network request;
- no continuous animation;
- no blur filter on the full-page layer;
- no reduced-motion cost.

The effect is visible in empty space but stays below text and card contrast.

## Automated test results

### Functional suite

Command: `npm.cmd run test:v3`

Passed:

- canonical URL is `https://abhijit.works/`;
- production root and v3 preview serve the same current portfolio;
- all four evidence claims render;
- real artifact loads successfully;
- desktop claim index initializes;
- keyboard selection and URL hash update work;
- mobile claim rail is removed and native disclosures work;
- only one mobile dossier is open after interaction;
- all four claims remain readable without JavaScript;
- opening curtain is absent under reduced motion;
- scanner animation is disabled under reduced motion;
- desktop, mobile, no-JS and reduced-motion horizontal overflow are all zero;
- legacy `.proof-ledger` markup is absent;
- content-panel atmosphere is present in computed CSS.

### Lighthouse

Final desktop run:

| Metric | Result |
|---|---:|
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 539 ms |
| LCP | 1,069 ms |
| TBT | 41 ms |
| CLS | 0 |

Final repeated mobile sample after the redesign:

| Metric | Median/result |
|---|---:|
| Performance | 74 median across 3 throttled runs |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 2,585 ms median |
| LCP | 5,286 ms median |
| TBT | 197 ms median |
| CLS | 0 |

Local mobile Lighthouse includes BrowserSync's injected development client and does not receive production Brotli/cache headers. Production must be tested again after deployment. The mobile LCP remains the main performance limitation; the Evidence Desk is below the fold and did not materially worsen it.

## Visual QA artifacts

- `perf-reports/phase-012/evidence-desktop.png`
- `perf-reports/phase-012/evidence-mobile.png`
- `perf-reports/phase-012/evidence-final-desktop-4.json`
- `perf-reports/phase-012/evidence-final-mobile-2.json`
- `perf-reports/phase-012/evidence-final-mobile-3.json`
- `perf-reports/phase-012/evidence-final-mobile-4.json`

## Remaining work

1. Deploy the `public/` output to the production host.
2. Confirm that the host honors either `.htaccess` or `_redirects`, then test the live `/v3/` to `/` 301.
3. Verify live Brotli/Gzip, immutable CSS/JS caching and image caching headers.
4. If available later, replace the Search Console summary with a permission-safe real export and record its exact comparison dates.
5. If the Meta screenshot year is recoverable, add it to the manifest and visible window.
6. A complete rewrite of every historical hero/proof CSS override remains optional. It carries visual regression risk and offers little network benefit while production CSS transfers at approximately 32.7 KB Brotli.

## Repeatable commands

```powershell
cd "D:\A scret project\Word hacker 404\madquick-clone"
npm.cmd run validate:evidence
npm.cmd run build:v3
npm.cmd run test:v3
```
