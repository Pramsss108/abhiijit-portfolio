# v3 portfolio — agent guide (READ FIRST)

One static site: `index.html` + `styles.css` (huge, append-override) + one vanilla-JS IIFE `app.js`. Served by browser-sync on **:5055** (`npm run dev --prefix madquick-clone`). Dark + gold premium brand.

## 🛑 HARD-WON GOTCHAS — do not repeat these (they cost hours)

### 1. The photo GLOW must be ONE radial-gradient behind it. Nothing else.
The "Proof, not promises" scene (`.proof-scene`) photo is a transparent PNG cut-out. To put a glow behind it:
- ✅ **DO:** a single `radial-gradient` on `.proof-scene__visual::before` (pure CSS, blurred, behind the photo). It can't box.
- ❌ **NEVER** put a `drop-shadow()` gold rim on the cut-out — it traces the photo's **rectangle**, not the silhouette → a hard rounded-rectangle **box**. This is THE bug that wasted hours.
- ❌ **NEVER** use a blurred **copy** of the photo (a "bloom" `<img>`) for the glow — it boxes.
- ❌ **NEVER** rely on a dark "bottomfade" band over a gold-tinted section bg — the band's rectangle shows.
- ⚠️ `overflow: clip` on a photo **clips its drop-shadow into a box**. Keep photos `overflow: visible`.
- The hero glow (`.hero__halo`) blends only because its section bg is plain dark + the gold is a soft screen-blended radial. Match that, don't copy the bloom.

### 1b. "The slider" = the two marquee ribbons; any solid bar butting the dark = a HARD EDGE.
Below the proof content sit two sliding ribbons (`.marquee--skills` = solid gold bar, `.marquee--tools` = dark bar). The gold bar slamming flat against the dark proof scene reads as a **hard horizontal line** — the user calls it "the slider hard edge." Fix = fade the band's edges, don't hard-cut: a vertical `mask-image: linear-gradient(180deg, transparent, #000 12%, #000 88%, transparent)` on `#proof-numbers .marquees` (id+class beats the `.marquees{mask:none}`) so the gold ramps out of the dark. Same rule everywhere: a solid-fill bar against the dark page needs a soft edge (mask/fade), never a raw cut.

### 2. The browser CACHES styles.css — bump the version on EVERY change.
The user's Chrome silently serves a **stale** `styles.css` even after refresh, so real fixes "don't work" for them. The `<link rel="stylesheet" href="styles.css?v=…">` in index.html carries a version query — **bump it** (and any index.html edit triggers a full browser-sync reload that pulls fresh CSS). Verify on the user's **real Chrome** (computer-use screenshot), not only the headless preview.

### 3. The headless preview renderer defaults to ~122px — useless for desktop.
Call `preview_resize` with **explicit `width:1440, height:900`** (NOT the `desktop` preset) before measuring, or every `getBoundingClientRect`/computed-style reads as mobile and misleads you.

### 4. Don't pile up override layers — rebuild broken blocks with fresh classes.
`styles.css` already has ~20 appended `#proof-numbers` override layers. When an element is mysteriously hidden/broken by the cascade (the headline was stuck invisible), stop `!important`-patching — **rebuild that block with brand-new isolated class names** (the right column was rebuilt as `.pscene-*`, no `reveal`, one clean CSS block). Fresh classes = zero old rules can touch them.

### 5. Apply the user's dialed `?edit` tuner values VERBATIM.
`localhost:5055/v3/?edit` is a live tuner (now wired to the proof scene) for photo grade / glow / card positions. When the user pastes "Copy everything", bake the exact numbers — never substitute your own grade. He reacts strongly to changed values.

### 6. The PROOF ENTRANCE is pure-CSS `animation-timeline: view()` — two cascade traps WILL bite you.
The proof "presents itself" via scroll-driven `view()` animations (styles.css end block: `pe-present` on the photo, `pe-sheet` on `.proof-scene__inner`, `pe-present-soft` on `.pscene-copy`, `pe-lip` on `.content-panel::before`). NO scroll-snap, NO JS — the section already slides over the sticky hero (`.hero--editorial` sticky + `.content-panel`); the entrance just makes that legible. Two traps cost real time here:
- **`!important` author declarations OVERRIDE CSS animations.** An animated property (opacity/transform) must have NO `!important` rule touching it, or it freezes at that value. The old force-show wall (~line 9307) pinned `.proof-scene__visual.reveal{opacity:1!important}` — that froze the photo entrance at opacity 0. Fix was to REMOVE the photo from that wall (scroll-snap is gone, so the IO reveals it normally) and let the animation own opacity/transform un-`!important`.
- **The `animation:` shorthand RESETS `animation-timeline` to `auto`.** Always write `animation: name … ; animation-timeline: view(); animation-range: …;` with the timeline/range AFTER the shorthand (or use longhands). With `!important` on the shorthand the reset wins and the timeline silently unbinds.
Safety: gated behind `@supports (animation-timeline: view())` + `prefers-reduced-motion: no-preference`; an `@supports not(...)` floor + a `prefers-reduced-motion: reduce` net keep the proof fully visible otherwise. ALWAYS verify by sweeping scroll in the headless preview and reading the photo's computed `opacity` across vTop (must go 0 → 1 as it enters, then HOLD 1) — a static screenshot won't catch a frozen `view()` animation.

## Production asset build

`styles.css` and `app.js` are the editable sources. The live page loads the optimized `styles.min.css` and `app.min.js`. After changing either source, regenerate both production files with the Phase 2 build pipeline, then bump their query version in `index.html`:

```powershell
npm.cmd run build:v3 --prefix madquick-clone
```

The build runs PurgeCSS with runtime-state safelists, CSSO restructuring and Terser. Do not replace it with direct esbuild CSS minification; that would restore roughly 70 KB of discarded production CSS. After building, run `node --check madquick-clone/public/v3/app.min.js` and the desktop/mobile interaction smoke tests.

## Verify visually
The user grants Chrome at screenshot-only ("read") tier — you can screenshot but not scroll/click it. Use computer-use screenshots to SEE the real desktop result; use the headless preview (resized to 1440) for DOM/computed-style inspection. Both, not one.
