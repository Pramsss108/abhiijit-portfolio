# Skills Cards — AI Asset Prompts (premium, NOT cheap-AI)

These generate **abstract dark+gold background atmospheres** that sit *behind* each skill card — adding richness and depth while the real animated chart + glass card stay on top. They are deliberately abstract (no objects, no people, no 3D characters) so they never read as cheap AI stock.

## Specs (important)
- **Aspect:** portrait **4:5** (e.g. **1640 × 2048 px**). If your model only does 1:1, use **1600 × 1600** — I'll crop to fit.
- **Format:** PNG or WebP, full-bleed (no transparency needed).
- **Brightness:** must stay **DARK** — the glow lives in the upper ~60%, fading to near-black at the bottom (so the card's text stays readable). The base prompt enforces this.
- **Where to put them:** drop the files in `madquick-clone/public/images/` with the exact names below, then tell me "assets in." I'll wire them at low opacity behind each card and keep the animated chart on top.
- **You don't need all 9.** Even **3–4** is enough — I'll cycle them across cards. Start with the signature ones (SEO, Content, Social, Analytics).

## Delivery
Name them exactly:
`skl-bg-seo.webp` · `skl-bg-content.webp` · `skl-bg-content-marketing.webp` · `skl-bg-social.webp` · `skl-bg-wordpress.webp` · `skl-bg-ai.webp` · `skl-bg-video.webp` · `skl-bg-analytics.webp` · `skl-bg-canva.webp`

---

## BASE STYLE — paste this BEFORE every motif line below
> Ultra-premium **abstract** background for a luxury dark-mode website card. Deep near-black charcoal base (#0b0d10), soft cinematic **warm-gold** volumetric light bloom, fine film grain, elegant negative space. Restrained, expensive, minimal — like a high-end fintech / luxury fashion brand backdrop. Brightest soft glow in the upper-center, fading to **pure near-black at the bottom**. Subtle depth, photographic light quality, 4K, high detail. Cohesive dark + gold palette only.

## NEGATIVE PROMPT — paste in the negative field (SD / Flux / Leonardo)
> text, words, letters, numbers, watermark, logo, UI, dashboard, screenshot, chart, infographic, person, face, hands, body, cartoon, 3d character, mascot, clipart, stock illustration, icons, neon rainbow, oversaturated, busy, cluttered, glossy plastic, cheap, low-res, banding, posterization

---

## The 9 motifs  *(your prompt = BASE + this line)*

1. **SEO Strategy** — `skl-bg-seo.webp`
   > Motif: faint ascending light-trails rising left-to-right like a quiet growth horizon; a soft constellation of connected glowing nodes far in the background. Accent: warm gold.

2. **Content Writing** — `skl-bg-content.webp`
   > Motif: elegant layered ribbons of light, like flowing ink or stacked paper strata catching gold light. Accent: champagne gold.

3. **Content Marketing** — `skl-bg-content-marketing.webp`
   > Motif: soft interconnected glowing pathways converging gently (a calm funnel of light). Accent: warm gold.

4. **Social Media Marketing** — `skl-bg-social.webp`
   > Motif: concentric soft reach-ripples spreading outward like a signal, faint particle bloom. Accent: warm gold (a whisper of soft amber).

5. **WordPress Publishing** — `skl-bg-wordpress.webp`
   > Motif: a calm modular structure of softly-lit rectangular light planes, architectural and orderly, deep in shadow. Accent: gold.

6. **AI & No-Code** — `skl-bg-ai.webp`
   > Motif: a refined particle constellation / soft neural mesh of light points and faint threads — sophisticated, NOT a literal circuit board. Accent: subtle gold.

7. **Video Editing** — `skl-bg-video.webp`
   > Motif: cinematic horizontal light streaks and gentle anamorphic lens bloom / soft bokeh, like a darkened edit suite. Accent: gold, cinematic.

8. **Analytics & Reporting** — `skl-bg-analytics.webp`
   > Motif: softly glowing data strata — faint bands of light rising like ghosted bars/curves deep in the dark. Accent: gold with a faint **emerald-green** growth glow.

9. **Canva Design** — `skl-bg-canva.webp`
   > Motif: overlapping translucent geometric light planes, soft layered color depth — tasteful, restrained. Accent: gold with a faint whisper of warm color.

---

## Optional (nice to have, not required)
- **Section ambient** (`skl-bg-ambient.webp`, **16:9, 2560×1440**) — same BASE, motif: *a vast calm dark-gold light field with a single soft central bloom* — a faint backdrop for the whole Skills band.

## Notes
- Keep them **subtle** — I place them low-opacity behind the content; they add atmosphere, not noise.
- They work **alongside** the coded glow the team is building — I'll use whichever (or both) looks most premium and let you compare.
- Every prompt forbids text/objects/people on purpose; if a result looks busy or "AI-ish," regenerate — the winners will look like an expensive empty room with light in it.
