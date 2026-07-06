# Hero Section Revert & Fix Plan
Date: 2026-06-25

## What Went Wrong

The original MadQuick → Abhijit conversion used `abhijit-homepage.js` to replace text.
My edits broke the flow by changing HTML text directly AND adding CSS injection
that conflicted with the existing JS replacements.

## Original Flow (How It Worked Before My Changes)

1. HTML has MadQuick text: "Welcome to Madquick", "We Are Connecting You", "With The"
2. Fancy text in HTML: `|Software|Website|App|Seo`, loop=yes, delay=2500
3. `abhijit-homepage.js` `applyPortfolioCopy()` runs on DOMContentLoaded:
   - `replaceExactText()` → "Madquick" → "Abhijit Pramanik"
   - `updateHeroMotionText()` → changes fancy text to "|CONTENT|SOCIAL|WORDPRESS|SEO", loop=yes
   - `updateProjects()` → replaces carousel headings via serviceMap

## What Needs Fixing

### 1. Revert HTML hero text (index.html)
- "Abhijit Pramanik" → "Welcome to Abhijit Pramanik" (match what JS expects)
- "Proof-Backed" → DELETE entire line (restore original "We Are Connecting You")
- "Digital Work in" → "With The" (original)
- Fancy text: keep "|SEO Strategy|Content Writing|WordPress|Social Media|AI Workflows|Video Editing|Analytics" with loop=yes, delay=2200

### 2. Remove bad CSS injection (abhijit-homepage.js)
- Delete the heroStyle CSS block I added at the top of the IIFE
- Let the original CSS from post-32487.css handle spacing

### 3. Fix updateHeroMotionText (abhijit-homepage.js)
- Skills: "|SEO Strategy|Content Writing|WordPress|Social Media|AI Workflows|Video Editing|Analytics"
- loop="yes", delay="2200"
- Remove letter-fix setTimeout hack

### 4. Clean up unused files
- Delete `public/js/skill-popups.js` (never referenced anymore)
