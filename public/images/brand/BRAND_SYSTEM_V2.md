# AP Identity System V2

## Executive summary

This system refines the existing Abhijit Pramanik dark-gold `<AP/>` code-tag. It does not replace the identity. The refinement makes the initials readable at real interface sizes, limits gold to structural accents, and creates separate compact and display expressions.

## Brand signal

- **Primary traits:** precise, capable, measured, premium.
- **Business signal:** one operator combining strategy, content, development and automation.
- **Audience:** clients who value evidence, craft and direct collaboration.
- **Avoid:** gaming-badge styling, crypto aesthetics, excessive glow, ornamental complexity and generic SaaS gradients.

## Construction

- Outer form: rounded-square dark seal.
- Structural cue: code brackets in gold.
- Initials: ivory `A`, gold `P`.
- Full signature: `<AP/>` on display applications.
- Compact signature: `<AP>` below 64 px. The slash is omitted to protect the `P` counter and prevent visual collision.
- Stroke logic: bracket strokes remain visually heavier than the rim and lighter than the filled initials.
- Corner logic: internal rim follows the outer seal with a consistent optical inset.

## Colour system

| Token | Hex | Role |
| --- | --- | --- |
| Obsidian | `#090B0F` | deepest seal/background |
| Graphite | `#1B1C20` | upper seal tone |
| Heritage gold | `#D8A73E` | rim and structural accent |
| Signal gold | `#F1C45A` | controlled highlight |
| Editorial ivory | `#F7F3E9` | `A` and primary wordmark |

Gold is an accent, not a surface fill. Do not add broad gold outer glows.

## Typography

- Website wordmark: existing display family (`Fraunces`) at weight 600.
- Supporting interface copy: existing body family.
- The wordmark uses tight but not compressed tracking (`-0.02em`) and no text shadow.

## Responsive family

| Asset | Use | Minimum size |
| --- | --- | --- |
| `ap-favicon.svg` | browser tabs and tiny UI | 16 px |
| `ap-logo-primary.svg` | header, footer, social avatar | 24 px |
| `ap-logo-display.svg` | opening reveal and large brand moments | 64 px |
| `ap-logo-lockup.svg` | wide placements and documents | 240 px wide |
| `ap-logo-mono.svg` | single-colour production | 24 px |

## Clear space

Keep clear space equal to one bracket-stroke length around the seal. Do not place copy, rules or container edges inside this area.

## Motion

- Brackets draw together first.
- The slash follows after a short delay.
- `A` and `P` resolve with a short rise and fade.
- No perpetual logo motion.
- Hover movement is limited to a one-pixel lift and a subtle brightness change.
- Reduced-motion preference removes the hover transition and uses the static resolved mark.

## Do

- Use the compact logo in the 42 px website header placement.
- Use the complete display logo in the opening reveal.
- Keep the seal dark on both light and dark backgrounds.
- Preserve the supplied SVG viewBox and geometry.

## Do not

- Do not separate the initials from the code brackets.
- Do not put the slash back into the compact header mark.
- Do not recolour the seal purple, blue or lime.
- Do not add 3D bevels, hard outer halos or animated shimmer loops.
- Do not typeset a substitute `AP` over the mark.

## Source preservation

- `archive-ap-code-tag-original.svg` is the exact archived source identity.
- `refinement-01-faithful.svg`, `refinement-02-responsive.svg` and `refinement-03-integrated-slash.svg` record the evaluated refinement paths.

## Review page

Open `/v3/logo-lab.html` to inspect the refinements, production family, colour system and size stress test.
