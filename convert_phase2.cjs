/**
 * Portfolio Conversion Script — Phase 2: Homepage Content
 * Edits index.html block by block with Abhijit's career data.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('Phase 2: Editing Homepage...');

// ═══════════════════════════════════════════════
// BLOCK 3: Update the hero headings
// "Designing,Launching and Helping Startups!" → Personal version
// ═══════════════════════════════════════════════
html = html.replace(
  /Designing,Launching and Helping Startups!/g,
  'Strategizing, Creating & Growing Brands!'
);
html = html.replace(
  /Turning Clicks into Connections with Powerful Experiences/g,
  'Turning Ideas into Digital Experiences for 36+ Companies'
);

// ═══════════════════════════════════════════════
// BLOCK 4: Update the "creativity within Everyone" paragraph
// ═══════════════════════════════════════════════
html = html.replace(
  /Our mission is to nurture that creativity and empower individuals to build unique[\s\S]*?not just co-workers\./,
  "At 22, I've partnered with 36+ companies globally — from Dubai-based fitness platforms to Kolkata startups — mastering SEO, content strategy, social media, WordPress, and AI-powered workflows. My journey spans crafting 400+ SEO articles, managing 25+ social accounts, building WordPress sites, and integrating AI for smarter marketing solutions. I'm skilled with SEMrush, Google Analytics, RankMath, Meta Business Suite, and CapCut. Let's create something amazing together!"
);

// Update the animated text to rotate relevant words
html = html.replace(
  /data-text="Everyone,Everyone,Everyone"/g,
  'data-text="Brands,Startups,Creators"'
);

// Update the span text for the animated rotator
// Replace all instances of "Everyone" in the animated text spans
html = html.replace(
  /(<span class="dynamic-text-letter[^"]*">)E(<\/span>)/g,
  '$1B$2'
);

// ═══════════════════════════════════════════════
// BLOCK 6: Stats Counters — Update numbers
// ═══════════════════════════════════════════════
// The stats section typically has counter widgets. Let's update visible text.
html = html.replace(/500\+\s*Projects?/gi, '40+ Projects');
html = html.replace(/100\+\s*Clients?/gi, '36+ Companies');
html = html.replace(/50\+\s*Team\s*Members?/gi, '3+ Years Experience');
html = html.replace(/24\/7\s*Support/gi, '11 Core Skills');

// ═══════════════════════════════════════════════
// BLOCK 7: Testimonials → Proof-Based Impact Cards
// ═══════════════════════════════════════════════
// Replace testimonial names and text (3 cards)
// Card 1
html = html.replace(
  /John\s*Smith/gi,
  "Rabin's Photography"
);
html = html.replace(
  /Sarah\s*Johnson/gi,
  'Pursueit Dubai'
);
html = html.replace(
  /Mike\s*Williams/gi,
  'Balihans Bengaluru'
);

// Replace generic testimonial text with impact statements
// We need to be careful with the exact text — let's target common patterns
const testimonialReplacements = [
  {
    pattern: /(?:Great|Excellent|Amazing|Outstanding|Wonderful)[^<]*(?:service|work|team|experience|quality)[^<]*/i,
    replacement: 'Increased our social media followers from 5k to 25k through strategic campaigns. Curated visually appealing content and monitored analytics to optimize engagement consistently.'
  },
  {
    pattern: /(?:professional|dedicated|talented)[^<]*(?:recommend|satisfied|pleased|happy)[^<]*/i,
    replacement: 'Managed end-to-end SEO content strategy for our Dubai-based fitness platform. Delivered consistent keyword research, on-page optimization, and content that drove 25% more organic traffic.'
  },
  {
    pattern: /(?:highly|best|top)[^<]*(?:recommend|team|service|quality|work)[^<]*/i,
    replacement: 'Led comprehensive marketing strategy including SEO, copywriting, WordPress updates, email campaigns, and Canva design. Supported lead generation targeting ServiceNow directors on LinkedIn.'
  }
];

// ═══════════════════════════════════════════════
// BLOCK 8: CTA Section
// ═══════════════════════════════════════════════
html = html.replace(
  /Let['']?s\s*Build\s*Something\s*Amazing/gi,
  "Ready to Grow Your Digital Presence?"
);
html = html.replace(
  /Get\s*(?:a\s*)?(?:Free\s*)?(?:Quote|Consultation|Started)/gi,
  'Hire Me'
);

// ═══════════════════════════════════════════════
// NAVIGATION: "Services" → "Skills"
// ═══════════════════════════════════════════════
html = html.replace(
  />Services</g,
  '>Skills<'
);

// Write back
fs.writeFileSync(filePath, html, 'utf8');
console.log('✅ Homepage updated successfully!');
