# Abhijit Works Portfolio Conversion Plan

Status: planning only. No website implementation is done in this document.

Target domain: `https://abhijit.works`

Source site being reused: `madquick-clone/public`

Main data source for Abhijit's real work: `career-dashboard/data/experience_graph.*` and related Experience Brain files.

## 1. What I Checked

I inspected the extracted Madquick site files and the Experience Brain data already created in the dashboard.

Checked local site files:

- `madquick-clone/public/index.html`
- `madquick-clone/public/about-us.html`
- `madquick-clone/public/SEO.html`
- `madquick-clone/public/content-writing.html`
- `madquick-clone/public/custom-web-development.html`
- `madquick-clone/public/js/app.js`
- `madquick-clone/public/images/*`
- `madquick-clone/scrape.js`
- existing conversion scripts in `madquick-clone/convert_phase*.cjs`, `fix_text_domain.cjs`, and `final_fix.cjs`

Checked Experience Brain files:

- `career-dashboard/data/experience_graph.md`
- `career-dashboard/data/experience_graph.json`
- `career-dashboard/data/experience_skill_map.json`
- `career-dashboard/data/experience_audit_report.md`
- `career-dashboard/data/experience_project_attachment_rollups.md`

## 2. Current Extract Status

The extracted site is a static WordPress + Elementor + Woodmart export. It is not a clean React app.

It has:

- Static HTML pages in `public/`
- Duplicate page names in some places, for example `about-us.html` and `About Us.html`
- CSS and JS from Elementor, Woodmart, Swiper, WooCommerce, and form widgets
- Existing generated-looking visual assets under `public/images`
- A backup copy at `madquick-clone/_backup_before_convert`
- Past conversion scripts that already tried to replace Madquick with Abhijit branding

The scraper used `website-scraper` with Puppeteer and `scrollToBottom`, so the extract likely captured lazy-loaded sections after scrolling.

## 3. Important Finding: Motion And Scroll

The site is not fully static visually. The extract includes movement systems:

- Elementor entrance animations such as `fadeIn`, `slideInRight`, `slideInLeft`, `bounceIn`, `bounceInUp`
- Swiper sliders and carousels
- Marquee CSS through `el-marquee.min.css`
- Scroll-to-top behavior
- Reading progress bar script
- Elementor motion effects with scroll-based translate settings
- Hover transforms, especially cards moving upward on hover

So some elements move because:

- they animate when the page loads,
- they animate when the user scrolls,
- they move in carousels/marquees,
- they move on hover.

Recommendation: keep the useful motion style, but simplify the content engine. The current exported HTML is too heavy to keep editing manually forever.

## 4. Current Problems Found

These are real issues found in the extracted files.

| Problem | Current example | Why it is wrong | Correct direction |
|---|---|---|---|
| Person treated as company | `At Abhijit Pramanik, we believe...` in `about-us.html` | Abhijit Pramanik is a person, not a company | `I help brands...` or `Abhijit works with brands...` |
| Fake company structure | `Copyright 2024 Abhijit Pramanik PVT LTD` | No PVT LTD should be claimed unless it is real | `Copyright 2026 Abhijit Pramanik` |
| Agency CTA wording | `Join us and flourish with Abhijit Pramanik` | Sounds like a company hiring page | `Work with Abhijit` or `Explore proof-backed work` |
| Fake testimonials | Generic names like Emma Turner, Anjali Verma, Priya Kaur | They are not verified testimonials | Replace with Proof-Based Impact Cards |
| Wrong page identity | Page metadata says `Web Development Company` | Portfolio should be personal brand, not a web agency | `Digital Marketing, SEO, Content, WordPress, AI workflow portfolio` |
| Generic service copy | `Why Choose Us`, `Our Previous Works`, agency-style paragraphs | Sounds like copied service agency language | Rewrite from Experience Brain proof |
| Canonical not production-ready | canonical is `/` | Domain should be exact | `https://abhijit.works/` |

## 5. Brand Decision Log

These decisions come from the user's answers.

| Topic | Decision |
|---|---|
| Logo | User will provide final logo later |
| Temporary logo | Use text-based `AP` or `AP | Abhijit Pramanik` only as placeholder |
| Hero visuals | Generate new modern skill-themed visuals later |
| Testimonials | Use Proof-Based Impact Cards, not fake reviews |
| Domain | `abhijit.works` |
| Madquick | Madquick is a client/project, not a family company |
| "Family" meaning | Skill families and broad work categories |

## 6. Wording Rules For The Portfolio

Never write:

- `At Abhijit Pramanik`
- `Abhijit Pramanik PVT LTD`
- `Our company`
- `Our agency`
- `Our team`, unless a real team is being shown
- fake review quotes
- fake metrics not present in the Experience Brain

Use these instead:

- `I help brands with...`
- `Abhijit Pramanik works across...`
- `Selected client work includes...`
- `Proof-backed projects across SEO, content, WordPress, social media, video, AI workflows, and support operations`
- `Client project: Madquick`
- `Verified from Trello, LinkedIn, resume sources, or attachment evidence`

## 7. Best Visual Direction: Hybrid 3D + 2D Proof

The best approach is not full 3D everywhere.

Use 3D only for first impression:

- Hero section
- Skill-family visual system
- Maybe one interactive rotating "work brain" object

Use 2D for trust and readability:

- Proof cards
- Client/project cards
- timelines
- skill matrices
- attachment summaries
- case studies

Reason: hiring managers and clients must quickly understand proof. Heavy 3D can look impressive but can also hide the real work. A hybrid approach gives modern impact without losing clarity.

## 8. Existing Visual Assets Found

The site already has these draft assets:

- `hero_seo_3d.png`
- `hero_content_3d.png`
- `hero_wordpress_3d.png`
- `hero_social_3d.png`
- `hero_video_3d.png`
- `hero_ai_3d.png`

Plan:

- Treat these as draft assets.
- Keep only if they look professional in the final page.
- Regenerate or replace any asset that has unreadable text, fake metrics, too much neon clutter, or wrong service meaning.
- Prefer clean hero artwork where the first view clearly says: SEO, content, WordPress, social media, AI workflows, and proof-backed delivery.

## 9. Experience Brain Data To Use

The current Experience Graph says:

- Projects mapped: 40
- Companies detected: 36
- Usable ready projects: 36
- Verified entries: 6
- Raw Trello cards: 37
- Active Trello cards: 34
- Claim facts seeded: 303
- Date facts: 85

Skill routes currently available:

| Skill route | Project count | Portfolio use |
|---|---:|---|
| SEO | 22 | SEO case studies, keyword research, on-page, off-page, semantic SEO |
| Content Writing | 27 | blogs, web copy, captions, article strategy |
| Social Media | 21 | Instagram, Facebook, LinkedIn, calendars, Meta Business Suite |
| WordPress | 26 | CMS publishing, site updates, SEO publishing, RankMath |
| Video Editing | 13 | reels, motion, post-production, CapCut/Premiere style work |
| Canva Design | 16 | banners, social creatives, product creatives, visual assets |
| Analytics | 14 | reports, tracking, campaign analysis |
| Paid Media | 4 | ads, PPC, Facebook/Google ads support |
| Customer Support | 9 | calling, verification, support, research |
| AI and No-Code | 24 | AI workflows, prompt workflows, no-code app building |
| Digital Marketing | 9 | broader strategy, growth, lead generation |

## 10. Skill Families For Portfolio

The portfolio should organize work by broad skill families, not random service pages.

Recommended families:

1. SEO and Content Strategy
2. Social Media and Growth
3. WordPress and Website Operations
4. Video, Motion, and Creative Production
5. Analytics, Reporting, and Research
6. Paid Media and Funnel Support
7. AI, No-Code, and Vibe Coding
8. Customer Verification and Support Operations

Each family should show:

- what Abhijit does,
- proof projects,
- tools used,
- example outputs,
- evidence confidence,
- relevant client/project names.

## 11. Client/Project Mapping

Use the Experience Brain project index as the source of truth.

High-priority projects for homepage:

| Project | Best portfolio family | Why it should be shown |
|---|---|---|
| Pursueit Dubai | SEO, Content, Social Media, WordPress | Strong multi-skill international proof |
| Balihans Bengaluru | Digital Marketing, SEO, Analytics, Client Communication | LinkedIn verified and broad experience |
| ReachHub | SEO, Social Media, UTM, WordPress | Strong tactical marketing proof |
| Ymedia | SEO, Content, WordPress | Keyword research and crypto/news content proof |
| Aura Love Yourself USA | SEO, Social Media, Motion, Paid Media | Important verified/profile source proof |
| Revenue Rushy Inc. | SEO, Social Media, Digital Marketing | LinkedIn profile source proof |
| MAMAI CARE | Social Media, Canva, Product Creative | Visual/social proof |
| Madquick | Content, WordPress, Video/Audio/Creative | Client project, not family company |
| Greenverze | SEO, WordPress, Content | WordPress and SEO publishing proof |
| Panalal Bengali Grocery | Social, Paid Media, Canva | Local brand marketing proof |
| Rabin's Photography | Social Media, Photography marketing | Local service brand proof |
| Lazy Quote Lab | Social, Content, Design | Campaign and story-template proof |

Secondary archive projects:

- Betterzila B2B SaaS
- Bilex
- CS MOCK
- IDEOHOLICS
- IIMI
- Indica Ai
- Kutum Bari
- OTAKUKART
- Pathshala
- RuDe Labs Private Limited
- BYJUS
- Marpu Foundation
- Zest Money
- X1RACE
- Kodeclamp
- Kaboodle
- Pregamate
- Dinco Automobiles
- Google Project
- Pocket F.M

Manual/sensitive handling:

- Personal Client should not be displayed publicly unless the user approves.
- OTHERS and "Click here to Connect" should stay excluded.

## 12. What To Do When There Is No Real Testimonial

Do not invent testimonials.

Use Proof-Based Impact Cards.

Each card should show:

- Company/project name
- Role or work type
- Skill family
- Tools used
- What was done
- Proof source
- Proof confidence
- Evidence type: Trello card, attachment summary, LinkedIn entry, resume source, website capture, manual verification
- Optional result if verified

Example card structure:

```text
Pursueit Dubai
Family: SEO, Content, Social Media, WordPress
Proof: Trello + LinkedIn profile
Work shown: keyword research, LSI/PAA optimization, blog strategy, WordPress publishing, social posts
Tools: SEMrush, Meta Business Suite, WordPress, Google Sheets
Confidence: ready
```

For projects with weak evidence:

- Show them in archive only.
- Label as `Needs date proof` or `Evidence light`.
- Do not put them in hero or headline proof.

## 13. Page Architecture

The portfolio can keep the current multi-page structure, but the meaning must change.

Recommended pages:

| Current page | Future page | Purpose |
|---|---|---|
| `index.html` | Home | Strong personal portfolio landing page |
| `about-us.html` | About Abhijit | Personal story, education, work style, proof summary |
| `SEO.html` | SEO and Content Strategy | SEO/content proof and case studies |
| `content-writing.html` | Writing and Content Systems | blogs, captions, web copy, content workflows |
| `custom-web-development.html` | WordPress and Website Operations | WordPress, CMS, landing pages, no-code |
| `no-code-development.html` | AI and No-Code Workflow | vibe coding, automations, AI-assisted builds |
| `app-development.html` | Portfolio Systems and Tools | local tools, dashboards, no-code/app experiments |
| `agency-hosting.html` | Analytics and Reporting | reporting, dashboards, tracking |
| `website-security.html` | Operations and Quality | QA, maintenance, site hygiene, reliability |
| `contact-us.html` | Contact | email, phone, Trello/portfolio links, form |

Optional future page:

- `proof-archive.html`: all 36 ready/usable companies with filters.

## 14. Homepage Block-By-Block Plan

### Block 1: Header

Current: AP text logo and agency-style nav.

Plan:

- Keep temporary `AP` text mark until final logo is provided.
- Nav should be simple: Home, Work, Skill Families, Proof, About, Contact.
- Remove shopping/account/wishlist/cart remnants if any appear from Woodmart.
- Add primary CTA: `View proof` or `Work with me`.

### Block 2: Hero

Current: `Welcome to Abhijit Pramanik`, agency styling, carousel/visual motion.

Plan:

- Headline should make the person clear.
- Example:

```text
Abhijit Pramanik
SEO, content, WordPress, social media, and AI workflow portfolio.
```

- Use a modern generated visual that represents a portfolio brain, not a fake agency.
- Mention 36+ proof-backed projects only if it stays aligned with the graph.
- Do not use fake company claims.

### Block 3: Proof Strip

Current: service carousel and visual blocks.

Plan:

- Show verified counts:
  - 36 companies detected
  - 40 mapped projects
  - 303 claim facts seeded
  - 11 skill routes
- Keep numbers proof-based, not inflated.
- Link to proof archive.

### Block 4: Skill Families

Current: service cards like No Code Development, Software Development, SEO, Hosting.

Plan:

- Replace with actual skill families:
  - SEO and Content
  - Social Media Growth
  - WordPress Operations
  - Creative Production
  - AI and No-Code
  - Analytics and Reporting
  - Support and Verification
- Cards should open relevant proof projects.

### Block 5: Selected Work

Current: `Our Previous Works` with agency portfolio names.

Plan:

- Rename to `Selected Proof-Backed Work`.
- Use real projects:
  - Pursueit Dubai
  - Balihans Bengaluru
  - ReachHub
  - Ymedia
  - Aura Love Yourself USA
  - Madquick
  - MAMAI CARE
  - Rabin's Photography
- Each card should show skills and evidence.

### Block 6: Proof-Based Impact Cards

Current: `Sweet Reviews From Our Clients` with generic testimonials.

Plan:

- Replace with proof cards.
- No quotes unless user provides real testimonial text.
- Show "what the proof says" rather than "what a fake client said".

### Block 7: Timeline

Current: about/mission/vision sections are agency style.

Plan:

- Use real work chronology:
  - ReachHub
  - Balihans
  - Revenue Rushy
  - Pursueit Dubai
  - current project-based portfolio
- Only show dates where safe/verified.
- If dates are missing, say `Project proof available` instead of inventing dates.

### Block 8: Tools Stack

Plan:

- Show grouped tools:
  - SEMrush, Ubersuggest, Google Analytics
  - WordPress, RankMath, Elementor
  - Meta Business Suite, Instagram, LinkedIn
  - Canva, CapCut, Premiere-style workflow
  - Google Sheets, UTM builders
  - AI/no-code tools

### Block 9: Contact CTA

Current: agency-style "join us" CTA.

Plan:

- Change to personal CTA:
  - `Have a role, project, or collaboration?`
  - `Contact Abhijit`
  - `Download resume`
  - `View proof archive`

### Block 10: Footer

Current: `Abhijit Pramanik PVT LTD`.

Plan:

- Use:

```text
Copyright 2026 Abhijit Pramanik. Built as a proof-backed personal portfolio.
```

- Add domain canonical logic for `abhijit.works`.

## 15. About Page Plan

The About page should become personal, not agency-style.

Sections:

1. Short intro
2. Work philosophy
3. Education
4. Proof-backed experience summary
5. Skill family map
6. How Abhijit works with brands
7. Contact

Rewrite example:

Current bad direction:

```text
At Abhijit Pramanik, we believe...
```

Correct direction:

```text
I combine SEO research, content strategy, WordPress execution, social media workflows, and AI-assisted systems to help brands publish better, move faster, and show measurable proof.
```

## 16. Service Page Conversion Plan

### SEO Page

Use projects:

- Pursueit Dubai
- Ymedia
- ReachHub
- Balihans
- Greenverze
- OTAKUKART
- RuDe Labs

Core proof:

- keyword research
- LSI/PAA work
- on-page SEO
- blog strategy
- WordPress SEO publishing
- SEMrush/Ubersuggest

### Content Writing Page

Use projects:

- Pursueit Dubai
- Ymedia
- Bilex
- Betterzila
- Pathshala
- Marpu Foundation
- OTAKUKART

Core proof:

- blog writing
- SEO article structure
- captions
- eBook/social content where safe
- website copy

### WordPress And Website Page

Use projects:

- Pursueit Dubai
- Greenverze
- Ymedia
- ReachHub
- Balihans
- OTAKUKART
- WordPress/CMS-heavy projects from Experience Brain

Core proof:

- WordPress content publishing
- metadata
- SEO plugin workflow
- Elementor/RankMath references where proven
- content operations

### Social Media Page

Use projects:

- Pursueit Dubai
- Aura Love Yourself USA
- ReachHub
- MAMAI CARE
- Rabin's Photography
- Lazy Quote Lab
- CS MOCK

Core proof:

- content calendars
- Meta Business Suite
- Instagram/Facebook management
- social creatives
- reels/content planning

### Video And Creative Page

Use projects:

- Aura Love Yourself USA
- Madquick
- X1RACE
- Pocket F.M
- Kodeclamp
- Pregamate
- Dinco Automobiles

Core proof:

- motion graphics
- sound/audio/video production
- reels/short-form assets
- creative edits

### AI And No-Code Page

Use projects:

- current dashboard/tooling work only if user approves public display
- Google Project
- no-code/app-building profile facts
- AI workflow claims from Experience Brain

Core proof:

- workflow automation
- vibe coding
- no-code app building
- AI-assisted content/research

## 17. Portfolio Archive Plan

Create a filtered archive page later.

Filters:

- All
- SEO and Content
- Social Media
- WordPress and Website
- Video and Motion
- Creative Design
- Analytics and Reporting
- Paid Media
- AI and No-Code
- Support and Verification
- Evidence ready
- Needs date proof

Card fields:

- Company/project
- Role/work type
- Family
- Skills
- Tools
- Proof status
- Date confidence
- Source links
- Short work summary

## 18. Data Architecture For Future Implementation

Do not hardcode all copy directly into HTML by hand.

Recommended architecture:

```text
career-dashboard/data/experience_graph.json
career-dashboard/data/experience_skill_map.json
career-dashboard/data/experience_project_attachment_rollups.md
career-dashboard/data/experience_audit_report.md
        |
        v
portfolio content builder script
        |
        v
madquick-clone/public/data/portfolio-proof.json
        |
        v
static HTML pages read/use mapped proof content
```

Why:

- Resume brain and portfolio use the same experience truth.
- If Trello/Experience Brain improves later, portfolio can be refreshed.
- No fake claims.
- No random wrong company/category mapping.
- Faster future updates.

## 19. Proposed `portfolio-proof.json` Shape

```json
{
  "person": {
    "name": "Abhijit Pramanik",
    "domain": "abhijit.works",
    "location": "Kolkata, West Bengal",
    "summary": "SEO, content, WordPress, social media, AI workflow portfolio"
  },
  "families": [
    {
      "id": "seo_content",
      "label": "SEO and Content Strategy",
      "project_count": 22,
      "hero_asset": "images/hero_seo_3d.png",
      "projects": ["pursueit_dubai", "ymedia", "reachhub"]
    }
  ],
  "projects": [
    {
      "company_id": "pursueit_dubai",
      "company": "Pursueit Dubai",
      "role": "SEO Content Strategist and Social Media Manager",
      "families": ["seo_content", "social_media", "wordpress"],
      "proof_status": "ready",
      "date_status": "verified_or_safe",
      "summary": "Keyword research, SEO content, WordPress publishing, and social media support.",
      "tools": ["SEMrush", "Meta Business Suite", "WordPress", "Google Sheets"],
      "source_links": []
    }
  ]
}
```

## 20. Implementation Phases

### Phase 1: Freeze And Audit

Goal: prevent accidental loss.

Tasks:

- Keep `_backup_before_convert` untouched.
- Create a fresh timestamped backup before editing.
- Generate a page inventory of every `.html` file.
- Generate a text inventory of all remaining Madquick/agency/fake-testimonial wording.
- Confirm which pages are actually linked from navigation.

Acceptance:

- We know every page that will be edited.
- We know every remaining wrong brand phrase.

### Phase 2: Build Portfolio Content Manifest

Goal: create one clean content source.

Tasks:

- Read Experience Brain graph.
- Create `public/data/portfolio-proof.json`.
- Map each project to families, tools, proof status, and safe summaries.
- Mark missing-date projects clearly.
- Keep Personal Client hidden unless manually approved.

Acceptance:

- Portfolio content is generated from proof data, not guessed text.

### Phase 3: Rewrite Brand Copy

Goal: remove all company/agency language.

Tasks:

- Fix all `At Abhijit Pramanik` wording.
- Remove `PVT LTD`.
- Rewrite homepage hero.
- Rewrite About page.
- Rewrite footer and CTAs.
- Replace fake testimonial section with Proof-Based Impact Cards.

Acceptance:

- No page says Abhijit is a company.
- No fake testimonial remains.
- No fake metric remains.

### Phase 4: Rebuild Page Sections

Goal: convert every block into portfolio meaning.

Tasks:

- Header/navigation cleanup.
- Hero visual and copy.
- Proof strip.
- Skill family cards.
- Selected work cards.
- Proof cards.
- Timeline.
- Tool stack.
- Contact CTA.
- Footer.

Acceptance:

- Homepage works as a personal portfolio without needing explanation.

### Phase 5: Visual Asset Pass

Goal: make the site impressive but not fake.

Tasks:

- Audit existing 3D hero images.
- Regenerate weak hero images.
- Create one style direction for all visuals.
- Avoid unreadable text inside images.
- Use 3D for emotion, 2D cards for proof.

Acceptance:

- First viewport looks modern.
- Proof sections stay readable.

### Phase 6: Motion And UX Pass

Goal: keep motion but remove clutter.

Tasks:

- Keep one strong hero motion.
- Keep carousels only if they improve browsing.
- Remove excessive auto-moving sections where reading becomes hard.
- Add reduced-motion support.
- Check mobile layout.
- Ensure no section overlaps.

Acceptance:

- Motion feels premium.
- Text remains readable on desktop and mobile.

### Phase 7: SEO And Domain Setup

Goal: make `abhijit.works` production-ready.

Tasks:

- Set canonical URLs.
- Add proper meta descriptions.
- Add Open Graph image.
- Add Person schema.
- Add Portfolio/CreativeWork schema where useful.
- Clean old WordPress/WooCommerce metadata if it is not needed.

Acceptance:

- Pages are ready for `abhijit.works`.
- Search snippets describe Abhijit correctly.

### Phase 8: QA And Launch

Goal: verify quality before deployment.

Tasks:

- Run local server.
- Check all pages.
- Check all nav links.
- Check contact links.
- Check image loading.
- Check mobile view.
- Check performance.
- Search for banned/wrong phrases.
- Test on `abhijit.works` after deploy.

Acceptance:

- No wrong company wording.
- No fake testimonials.
- No broken page.
- Portfolio looks clean by eye.

## 21. Exact Text Search Checks Before Launch

Search for these and remove/fix:

```text
At Abhijit Pramanik
Abhijit Pramanik PVT LTD
Web Development Company
Sweet Reviews From Our Clients
Why Choose Us
Our company
Our agency
Madquick
madquick.in
Lorem ipsum
Slide 1 Heading
Client
```

Important: `Madquick` is allowed only when it means the client project Madquick.

## 22. No-Coder Review Checklist

When the implementation is done later, user should check:

1. Open homepage.
2. First screen should clearly say this is Abhijit Pramanik's portfolio.
3. It should not look like a fake company website.
4. It should not say `PVT LTD`.
5. It should not say `At Abhijit Pramanik`.
6. It should show real work families.
7. It should show proof cards instead of fake testimonials.
8. Madquick should appear only as a client/project.
9. Contact buttons should work.
10. Mobile view should not overlap or hide text.
11. Motion should feel smooth, not distracting.
12. Project cards should show what was done and what proof exists.

## 23. Risk Areas

| Risk | Why it matters | Fix |
|---|---|---|
| Direct string replacement | Can leave broken wording or HTML | Use structured content manifest and careful DOM-aware edits |
| Fake agency copy | Hurts trust | Rewrite everything as personal proof-backed portfolio |
| Fake testimonials | High trust risk | Use proof cards only |
| Heavy Elementor export | Performance and maintainability risk | Keep static for now, later consider clean rebuild |
| Missing safe dates | Some project timelines may be unsafe | Show proof status instead of dates |
| Too much 3D | Looks flashy but hard to read | Use hybrid 3D + 2D |
| Duplicate pages | Edits may miss uppercase/lowercase copies | Inventory and edit all linked pages |

## 24. Final Recommendation

Use the Madquick extract as a visual/motion base only.

Do not trust its text as portfolio truth.

The final portfolio should be built from:

- Experience Brain for facts,
- proof cards for trust,
- skill families for navigation,
- modern 3D only for first impression,
- clean 2D layouts for proof and readability,
- strict wording rules so Abhijit is always presented as a person/professional, not a company.

This is the best path for a professional `abhijit.works` portfolio that can support job hunting, freelance trust, and future resume generation without fake or confusing claims.
