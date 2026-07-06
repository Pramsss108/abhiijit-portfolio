# Abhijit Works Homepage-Only Conversion Plan

Status: planning only. No homepage implementation is done in this document.

Target homepage: `madquick-clone/public/index.html`

Original reference: `madquick-clone/_backup_before_convert/index.html`

Target domain: `https://abhijit.works`

## 1. How To Start The Portfolio Locally

Use this when you want to see the current portfolio in the browser.

### Easiest Method With Python

Open PowerShell and run:

```powershell
cd "D:\A scret project\Word hacker 404\madquick-clone"
python -m http.server 5055 -d public
```

Then open:

```text
http://localhost:5055
```

To stop the server:

```text
Press Ctrl + C in the PowerShell window
```

This should work because Python is installed on this machine.

### Alternative Method With Node

If Python ever fails, use:

```powershell
cd "D:\A scret project\Word hacker 404\madquick-clone"
npx serve public -l 5055
```

Then open:

```text
http://localhost:5055
```

## 2. Homepage Goal

Convert only the homepage into Abhijit Pramanik's modern proof-backed portfolio while keeping the same Madquick-style motion and section energy.

The homepage should feel like:

- a premium personal portfolio,
- a proof-backed career/work profile,
- a conversion page for hiring, freelance work, and collaboration,
- not a fake agency,
- not a company named Abhijit Pramanik,
- not a static boring resume page.

Main message:

```text
Abhijit Pramanik turns SEO, content, WordPress, social media, and AI workflows into proof-backed digital growth work.
```

## 3. Hard Rule: Do Not Remove Madquick Motion

The user wants the same movement/energy as the extracted Madquick site.

So the homepage conversion must preserve:

- Elementor entrance animations
- `fadeIn`
- `slideInRight`
- `slideInLeft`
- `bounceIn`
- `bounceInLeft`
- `bounceInRight`
- `bounceInUp`
- Swiper carousels
- horizontal auto-moving service/skill carousels
- image carousels
- marquee bands
- hover movement
- scroll-to-top behavior
- reading progress behavior
- existing responsive movement unless broken

We should replace content, images, colors, card labels, and proof data, but not remove the original movement system.

## 4. Current Homepage Reference

The original Madquick homepage had this rough flow:

1. Header/nav
2. Hero intro
3. moving service carousel
4. animated skill/tool image carousels
5. creative manifesto section
6. `Why Choose Us`
7. `Our Previous Works`
8. big CTA: `Join us and flourish with Madquick`
9. tools/outcomes section
10. process section
11. testimonials carousel
12. FAQ
13. final contact CTA
14. footer

The current converted homepage still has almost the same structure, but the words are partially wrong.

Examples that must be fixed later:

- `Welcome to Abhijit Pramanik`
- `Join us and flourish with Abhijit Pramanik`
- `Sweet Reviews From Our Clients`
- fake testimonial names and quotes
- `Copyright 2024 Abhijit Pramanik PVT LTD`
- agency wording like `our company`, `our team`, `full-service web design company`

## 5. Re-Extraction / Difference Check Plan

If we want to compare against the live Madquick site again, do not run the current `scrape.js` directly because it deletes `public`.

Safe method for future implementation:

1. Copy `scrape.js` to a new script, for example `scrape_reference.js`.
2. Change its output folder from:

```js
const publicDir = path.resolve(__dirname, 'public');
```

to:

```js
const publicDir = path.resolve(__dirname, 'madquick_reference_public');
```

3. Run the reference scrape into that separate folder.
4. Compare:
   - section count
   - Swiper count
   - animation class count
   - image paths
   - scripts/styles included
   - mobile header behavior
   - hero carousel behavior

The final implementation should preserve the current animation behavior unless a movement is broken.

## 6. Homepage Brand Direction

Recommended aesthetic:

```text
Proof-backed cyber editorial portfolio
```

Meaning:

- modern and impressive,
- dark or deep neutral base,
- crisp readable proof cards,
- electric accent colors,
- 3D visuals only where they create strong first impression,
- clean cards for actual work proof,
- fast scanning for recruiters/clients.

### Color System

Avoid looking like generic purple AI design.

Recommended palette:

| Role | Color | Use |
|---|---|---|
| Deep base | `#080D10` | page background |
| Soft black panel | `#11181B` | cards/sections |
| Ink border | `#243136` | thin borders |
| Proof green | `#62F28F` | verified proof, ready status |
| Signal cyan | `#4ED7F1` | links, interactive accents |
| Warm amber | `#F6C85F` | metrics, highlights |
| Clean white | `#F6F8F5` | headings |
| Muted text | `#AAB5AF` | body text |

Why this palette:

- It feels technical and premium.
- It does not look like a resume template.
- It supports proof/status UI.
- It gives portfolio confidence without fake corporate polish.

### Typography Direction

Use a strong display style for hero and headings, but keep proof text readable.

Plan:

- Hero/name: bold editorial display.
- Section headings: compact and sharp.
- Body/proof text: highly readable.
- Data labels: mono-style small text for proof/skill tags.

Do not make everything huge. The homepage should feel premium, not noisy.

## 7. Homepage Conversion Metrics

The homepage should use only safe metrics from Experience Brain.

Recommended homepage metrics:

| Metric | Safe source | Homepage wording |
|---|---|---|
| 36 companies | `experience_graph.md` / audit | `36 companies mapped` |
| 40 projects | `experience_graph.md` | `40 proof-mapped projects` |
| 11 skill routes | skill graph | `11 skill routes` |
| 303 claim facts | audit report | `303 claim facts indexed` |
| 36 usable ready projects | audit report | `36 ready proof projects` |
| 6 verified entries | audit report | `6 verified profile entries` |

Avoid fake metrics like:

- `500% growth`
- `100+ clients`
- `award-winning`
- `guaranteed ranking`
- `best agency`
- `team of experts`

## 8. Homepage Section-By-Section Plan

### Section 1: Header And Navigation

Current behavior:

- desktop and mobile header exist,
- service menu items are currently service-page links,
- AP text logo exists,
- mobile menu has close button.

Keep:

- sticky/header behavior,
- mobile menu behavior,
- AP placeholder logo until user gives real logo,
- button hover animation.

Change:

- nav labels from agency service menu to portfolio sections.

Recommended nav:

```text
Home
Proof
Skill Families
Selected Work
Process
FAQ
Contact
```

Primary CTA:

```text
View proof
```

Secondary CTA:

```text
Contact
```

Logo:

```text
AP | Abhijit Pramanik
```

Do not claim `PVT LTD`.

### Section 2: Hero

Current behavior:

- animated text appears with `fadeIn`, `slideInRight`, `slideInLeft`,
- there is a fancy text rotator currently using words like Software, Website, App, Seo,
- right side uses animated carousel/cards/3D visuals.

Keep:

- hero split layout,
- text entrance animation,
- fancy rotating word behavior,
- CTA wobble/hover animation,
- right-side visual carousel/motion.

Change hero text to personal portfolio positioning.

Recommended hero copy:

```text
Abhijit Pramanik
SEO, content, WordPress, social media, and AI workflow proof portfolio.
```

Supporting copy:

```text
I build and document digital growth work across SEO research, content systems, WordPress publishing, social media operations, creative production, and AI-assisted workflows.
```

Rotating words:

```text
SEO
Content
WordPress
Social
AI Workflows
```

Primary CTA:

```text
See proof-backed work
```

Secondary CTA:

```text
Contact Abhijit
```

Hero metrics chips:

```text
36 companies mapped
40 proof projects
11 skill routes
Kolkata + Remote
```

Hero visual:

- Use the existing moving hero card carousel.
- Replace card content/images with skill visuals:
  - SEO brain
  - content workflow
  - WordPress publishing
  - social media calendar
  - AI workflow dashboard
  - video/creative production
- Keep the carousel movement as-is.

### Section 3: Moving Skill Family Cards

Current behavior:

- the homepage has a 12-card Swiper carousel near the hero,
- cards move automatically,
- cards have gradient backgrounds and fade animation.

Keep:

- 12-card Swiper behavior,
- autoplay,
- hover pause,
- slide spacing,
- fade-in card animation.

Replace cards with skill-family proof cards:

1. SEO Strategy
2. Semantic Content
3. WordPress Publishing
4. Social Media Ops
5. AI and No-Code
6. Video Editing
7. Canva Design
8. Analytics
9. Paid Media
10. Customer Verification
11. Content Calendars
12. Portfolio Systems

Each card should show:

- icon/3D visual,
- one sentence,
- proof count or sample projects,
- link to section on homepage.

Example:

```text
SEO Strategy
22 mapped SEO projects
Pursueit, ReachHub, Ymedia
```

### Section 4: Moving Tool/Asset Strips

Current behavior:

- there are image carousels with icons/images moving sideways.

Keep:

- both moving strips,
- opposite-direction movement if currently present,
- bounce-in entry animation.

Replace with real tool badges:

First strip: marketing/search tools

```text
SEMrush
Ubersuggest
Google Analytics
Google Sheets
RankMath
WordPress
Meta Business Suite
Instagram
LinkedIn
Canva
CapCut
UTM Builder
```

Second strip: work families/projects

```text
Pursueit Dubai
ReachHub
Balihans
Ymedia
Aura Love Yourself USA
Madquick
MAMAI CARE
Greenverze
Rabin's Photography
Panalal Bengali Grocery
Lazy Quote Lab
Revenue Rushy
```

Do not use fake platform logos unless legally safe. Text chips may be safer than copied logos.

### Section 5: Signature Statement / Manifesto

Current behavior:

- creative statement section with big text and animated line split:
  - `I believe that true digital creativity...`

Keep:

- large animated statement,
- motion split,
- visual energy.

Change to:

```text
I believe digital work should be visible, searchable, useful, and backed by proof.
```

Supporting line:

```text
Every project on this portfolio should connect to a skill, source, tool, or work sample.
```

This section should set the trust standard of the portfolio.

### Section 6: Why Choose / Why Work With Me

Current behavior:

- `Why Choose Us` with a 6-card benefits grid.

Keep:

- card grid,
- icons,
- hover motion,
- spacing rhythm.

Change heading:

```text
Why work with Abhijit
```

Replace six cards:

1. Proof-backed work
   - `Projects are mapped from Trello, profile sources, and attachment summaries.`
2. SEO + content depth
   - `Keyword research, PAA/LSI, content planning, and WordPress publishing.`
3. Multi-skill execution
   - `SEO, social, content, creative, WordPress, analytics, and AI workflows.`
4. Practical remote workflow
   - `Comfortable with async work, documentation, and fast iteration.`
5. Visual + technical balance
   - `Can work on copy, creative assets, CMS pages, and proof systems.`
6. Recruiter/client friendly proof
   - `Work is organized into skills, companies, dates, and safe claims.`

### Section 7: Selected Proof-Backed Work

Current behavior:

- `Our Previous Works`
- project carousel/cards exist with images and hover behavior.

Keep:

- existing card layout,
- hover reveal,
- carousel or grid behavior,
- visual thumbnails.

Change heading:

```text
Selected proof-backed work
```

Change intro:

```text
A focused selection from 36 mapped companies and 40 proof-indexed projects.
```

Recommended homepage cards:

1. Pursueit Dubai
   - Family: SEO, Content, Social, WordPress
   - Proof: Trello + LinkedIn
   - Highlight: LSI/PAA, SEMrush, content strategy
2. ReachHub
   - Family: SEO, Social, UTM, WordPress
   - Proof: Trello
   - Highlight: Ubersuggest, content calendar, UTM workflows
3. Balihans Bengaluru
   - Family: Marketing, SEO, Analytics, Client Communication
   - Proof: LinkedIn + Trello
   - Highlight: SEO, copywriting, WordPress, lead generation
4. Ymedia
   - Family: SEO, Content, WordPress
   - Proof: Trello
   - Highlight: keyword research, search volume, crypto/news content
5. Aura Love Yourself USA
   - Family: SEO, Social, Motion, Paid Media
   - Proof: verified profile source
   - Highlight: social creative, CapCut, Facebook ad funnels
6. Madquick
   - Family: Content, WordPress, Audio/Creative
   - Proof: Trello
   - Highlight: client project, not family company
7. MAMAI CARE
   - Family: Social, Canva, Product Creative
   - Proof: attachment rollups
   - Highlight: product creatives and social assets
8. Rabin's Photography
   - Family: Social Media, Local Service Marketing
   - Proof: Trello
   - Highlight: Instagram profile management

Each card should contain:

```text
Project name
Role/work family
3 tags
proof status
one-line work summary
```

Do not show all 36 on the homepage. Show best 8, then CTA:

```text
Explore all proof
```

### Section 8: Conversion CTA

Current behavior:

- `Join us and flourish with Abhijit Pramanik`
- big CTA band.

Keep:

- same large CTA band,
- same strong visual/animation,
- same button animation.

Change text:

```text
Need SEO, content, WordPress, social media, or AI workflow support?
```

Supporting copy:

```text
Review the proof, then reach out with a role, project, collaboration, or internship opportunity.
```

Buttons:

```text
View proof archive
Contact Abhijit
Download resume
```

### Section 9: Tools For Outcomes

Current behavior:

- `The best tools for the best outcomes`
- likely tool cards/icons.

Keep:

- animated cards/icons,
- tool carousel/grid.

Change title:

```text
Tools behind the proof
```

Tool categories:

- Search and SEO: SEMrush, Ubersuggest, RankMath
- Publishing: WordPress, Elementor, CMS workflows
- Social: Meta Business Suite, Instagram, LinkedIn
- Creative: Canva, CapCut, video editing workflows
- Reporting: Google Analytics, Google Sheets, dashboards
- AI/no-code: prompt workflows, no-code app building, automation thinking

Each tool card should connect to a project.

Example:

```text
SEMrush
Used in SEO/content planning for Pursueit and Aura-style content workflows.
```

### Section 10: Process

Current behavior:

- `What's the process?`
- process tabs/accordion:
  - Ideation & Evaluation
  - Discovery & Research
  - UX Design
  - UI Design
  - Development
  - Key Outputs

Keep:

- process tabs/accordion interaction,
- animation,
- same visual rhythm.

Change process to portfolio work process:

1. Understand the target
   - role, client, audience, goal
2. Research keywords and proof
   - JD, SEO terms, content gaps, competitors, Trello proof
3. Build the content/workflow
   - content, WordPress, social, creative, AI workflow
4. Publish and organize
   - CMS, calendars, dashboards, files, project proof
5. Measure and improve
   - analytics, search results, engagement, feedback
6. Document proof
   - screenshots, links, summaries, safe claims

This process should help recruiters/clients understand how Abhijit works.

### Section 11: Proof-Based Impact Cards Instead Of Testimonials

Current behavior:

- testimonial carousel with generic quotes.

Keep:

- carousel layout,
- card movement,
- testimonial styling if visually good.

Replace content with proof cards.

New heading:

```text
Proof cards, not fake testimonials
```

Subheading:

```text
When a real testimonial is unavailable, this portfolio shows what the work proof supports.
```

Cards:

1. Pursueit Dubai
   - `SEO + content + social + WordPress`
   - `Evidence: Trello and LinkedIn`
   - `Tools: SEMrush, Meta Business Suite, WordPress`
2. ReachHub
   - `Content calendar, UTM tracking, keyword research`
   - `Evidence: Trello attachments`
   - `Tools: Ubersuggest, Google Sheets, UTM builder`
3. Balihans
   - `Marketing, SEO, WordPress, client communication`
   - `Evidence: LinkedIn + Trello`
   - `Tools: Canva, WordPress, CRM-style workflows`
4. Aura Love Yourself USA
   - `Social creative, SEO-friendly content, motion assets`
   - `Evidence: verified profile source`
   - `Tools: SEMrush, CapCut, Facebook ad funnels`
5. MAMAI CARE
   - `Product creatives and social visuals`
   - `Evidence: attachment summaries`
   - `Tools: Canva, Instagram`
6. Ymedia
   - `Keyword research and content planning`
   - `Evidence: Trello`
   - `Tools: SEO keyword research tools`

Do not write client quotes unless real verified quotes are supplied.

### Section 12: FAQ

Current behavior:

- FAQ accordion exists.

Keep:

- FAQ accordion,
- same opening/closing behavior.

Replace questions:

1. `Is this a company or personal portfolio?`
   - `This is Abhijit Pramanik's personal proof-backed portfolio.`
2. `What work can Abhijit support?`
   - `SEO, content, WordPress, social media, creative production, analytics, AI/no-code workflows, and support operations.`
3. `Are the projects real?`
   - `Projects are mapped from Experience Brain sources such as Trello, LinkedIn/profile data, resume sources, and attachment summaries.`
4. `Can I see proof before hiring or shortlisting?`
   - `Yes. The homepage highlights selected proof and can link to a proof archive.`
5. `Can Abhijit work remotely?`
   - `Yes, the profile supports Kolkata + remote work.`
6. `Can this portfolio support job applications?`
   - `Yes, it should connect to resume/download/contact flows later.`

### Section 13: Final CTA

Current behavior:

- final contact block and footer widgets.

Keep:

- visual CTA block,
- button hover/motion.

Change copy:

```text
Have a role, project, or collaboration?
```

Supporting:

```text
Send the role, project goal, or JD. I will respond with the most relevant proof and resume version.
```

Buttons:

```text
Email
WhatsApp
View Resume
View Proof
```

### Section 14: Footer

Current behavior:

- footer has explore/services/contact blocks,
- copyright wrongly says PVT LTD.

Keep:

- footer layout,
- footer columns,
- animations if present.

Change:

```text
Copyright 2026 Abhijit Pramanik.
```

Footer columns:

- Work families
- Selected proof
- Contact
- Domain/meta

Do not use:

```text
PVT LTD
agency
our company
our team
```

## 9. Homepage Card Strategy

Cards should not be random decorative cards.

Every card must have one job:

| Card type | Purpose |
|---|---|
| Skill family card | Shows what skill area Abhijit can work in |
| Proof card | Shows a real company/project and source |
| Tool card | Shows what tools support the work |
| Process card | Shows how work is done |
| CTA card | Converts visitor to contact/resume/proof action |

Card content rules:

- one clear heading,
- one proof/source line,
- max 3 tags,
- no long paragraphs,
- no fake company language.

## 10. Homepage Conversion Funnel

The homepage should guide a visitor like this:

```text
Who is this? -> Abhijit Pramanik
What does he do? -> SEO, content, WordPress, social, AI workflows
Is it real? -> 36 companies / 40 proof projects / proof cards
Can I inspect examples? -> selected work
How does he work? -> process
Can I trust it? -> proof cards, no fake testimonials
What next? -> contact / resume / proof archive
```

## 11. Homepage Quality Bar

By eye, the homepage should pass these checks:

- First screen clearly says `Abhijit Pramanik`.
- It never looks like Abhijit is a company.
- It keeps the Madquick-style movement.
- Cards move where the original cards moved.
- Swiper carousels still autoplay.
- The hero still feels premium.
- Proof cards replace fake testimonials.
- 3D visuals support the topic, not random decoration.
- Mobile nav still works.
- No text overlaps on mobile.
- No fake metrics.
- Madquick appears only as a client project.
- CTA buttons are clear.

## 12. Homepage Implementation Guardrails

When implementation is approved later:

1. Make a fresh backup before editing `public/index.html`.
2. Do not remove animation CSS/JS imports.
3. Do not remove Swiper scripts.
4. Do not remove Elementor motion classes unless they are broken.
5. Replace text and images inside existing sections first.
6. Only restructure a section if the existing layout cannot support the portfolio meaning.
7. Compare current homepage against original backup after edits.
8. Test with local server at `http://localhost:5055`.
9. Test desktop and mobile.
10. Search for banned phrases before saying done.

## 13. Banned Homepage Phrases

Remove these from homepage:

```text
At Abhijit Pramanik
Abhijit Pramanik PVT LTD
Web Development Company
Sweet Reviews From Our Clients
Join us and flourish with Abhijit Pramanik
our company
our agency
our team
client reviews
award-winning
guaranteed ranking
```

Allowed:

```text
Abhijit Pramanik
Work with Abhijit
Proof-backed work
Selected client projects
Madquick client project
36 companies mapped
40 proof projects
```

## 14. Homepage Final Direction

The homepage should not become a normal resume page.

It should become a moving, modern, proof-backed portfolio homepage using the Madquick extract as the animation and layout base.

The best version is:

- same moving energy,
- better color system,
- personal brand language,
- proof-based project cards,
- Experience Brain metrics,
- no fake testimonials,
- no company confusion,
- clear conversion actions.

This gives Abhijit a homepage that can work for job hunting, freelance trust, and portfolio presentation from `abhijit.works`.
