# Clean Portfolio Editing Workflow

## Goal
Keep the original Madquick/Elementor export styling intact and change only Abhijit-specific content.

## Current Safe Setup
- Source styling comes from the restored export in `public/index.html`.
- The original backup remains in `_backup_before_convert/index.html`.
- Personal text edits live in `public/js/portfolio-copy.js`.
- The old custom style override `public/css/abhijit-homepage.css` is not linked from the restored homepage.

## Rule
Do not change global CSS, body background, section layout, popup layout, carousel layout, or Elementor-generated spacing unless a visual test proves it is required.

## How To Edit Text Safely
1. Keep `public/index.html` structurally close to `_backup_before_convert/index.html`.
2. Put wording changes in `public/js/portfolio-copy.js`.
3. Use exact text replacement for normal content.
4. Skip layout-sensitive widgets like the hero fancy-text span unless the text is short enough for the original layout.
5. For hero rotating words, use short labels only:
   - SEO
   - Content
   - Web Dev
   - Social
   - AI Work
   - Video
   - Viral
   - Digital
   - Portfolio
   - Analytics
   - Branding

## Why This Is Safer
The exported website already has complex Elementor/Woodmart CSS and JavaScript. Adding broad custom CSS can override hidden responsive rules and cause:
- background color bleed
- popup duplication
- header overflow
- hero text overlap
- mobile hamburger/logo collision

The safe path is a copy layer first, visual styling second only when needed.

## Measurable QA Before Saying Done
Run browser checks for:
- no `abhijit-homepage.css` linked on the homepage
- desktop hero text does not overlap
- mobile hero word fits viewport
- mobile logo does not touch hamburger
- Skills popup has one visible content block
- scrolling does not show unintended global color bleed
- screenshot saved for desktop, popup, and mobile

## When To Use Elementor
Use real WordPress + Elementor only if the goal is visual restructuring, not simple copy replacement.

Recommended future stack for true Elementor editing:
- local WordPress
- Elementor import of the original template
- export static site after edits
- compare screenshots against the backup

For now, no new library is needed. Puppeteer is enough for local visual QA.
