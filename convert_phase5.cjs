/**
 * Portfolio Conversion Script — Phase 5: Skill Page Content Updates
 * Updates the service pages with Abhijit's actual skill data from career dashboard.
 */
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

// Skill page mappings with career data
const skillPages = [
  {
    files: ['SEO.html'],
    heading: 'SEO & Semantic Content Strategy',
    subtitle: '22 projects across 36+ companies',
    description: 'Specialized in on-page and off-page SEO, keyword clustering, SERP analysis, user intent mapping, and conversion rate optimization. Proficient with SEMrush, RankMath, Ubersuggest, and Google Analytics. Delivered advanced techniques including LSI keywords, PAA optimization, backlink strategy, and content gap analysis for companies like Pursueit Dubai, Balihans, Bilex, and Betterzila.',
    companies: 'Pursueit Dubai, Balihans Bengaluru, ReachHub, Bilex, Betterzila B2B SaaS, Ymedia, Greenverze, IDEOHOLICS, OTAKUKART, Lazy Quote Lab, CS MOCK, Contract with Siddharth Dalmia, MAMAI CARE, Panalal Stores',
    tools: 'SEMrush, Google Analytics, RankMath, Ubersuggest, SurferSEO, Google Search Console, Ahrefs'
  },
  {
    files: ['content-writing.html', 'Content Writing.html'],
    heading: 'Content Writing & Copywriting',
    subtitle: '27 projects — 400+ articles published',
    description: 'Expert in SEO-optimized blog writing, copywriting, social media captions, eBooks, and content strategy. Skilled at maintaining primary keyword density, strategic placement of secondary keywords, and crafting compelling CTAs. Created content across niches including legal (PMLA law), fitness, B2B SaaS, grocery, education, and photography.',
    companies: 'Pursueit Dubai, Balihans, ReachHub, Bilex, Greenverze, Betterzila, Ymedia, Lazy Quote Lab, Marpu Foundation, OTAKUKART, Pathshala, CS MOCK, Contract with Siddharth Dalmia, Aura Love Yourself USA',
    tools: 'WordPress, RankMath, SEMrush, Grammarly, Google Docs, AI Writing Assistants'
  },
  {
    files: ['no-code-development.html', 'No Code Development.html'],
    heading: 'AI & No-Code App Building',
    subtitle: '24 projects — Automation & AI workflows',
    description: 'Pioneer in AI-augmented marketing workflows and no-code app development. Built automated content pipelines, AI-driven analytics dashboards, and prompt-engineered workflows. Experience with vibe coding methodology, integrating AI tools into existing marketing stacks, and building custom automation solutions for businesses.',
    companies: 'Google Project (Powwow), Pursueit Dubai, Balihans, ReachHub, Indica AI, Bilex, Lazy Quote Lab, Greenverze, MAMAI CARE, Panalal Stores, Betterzila, Ymedia, IDEOHOLICS, Dinco Automobiles',
    tools: 'ChatGPT, Claude, Cursor, Puter.js, Cloudflare Workers, Node.js, React, Vite'
  },
  {
    files: ['Wordpress-Development.html', 'Wordpress Development.html'],
    heading: 'WordPress & CMS Development',
    subtitle: '26 projects — Sites built, managed & optimized',
    description: 'Full-stack WordPress expertise including theme customization, plugin configuration, Elementor Pro page building, RankMath SEO setup, WooCommerce integration, and blog management. Managed complete website lifecycles from domain setup to content publishing, metadata optimization, and performance tuning.',
    companies: 'Pursueit Dubai, Balihans, ReachHub, Bilex, Greenverze, Betterzila, Ymedia, Lazy Quote Lab, Marpu Foundation, IDEOHOLICS, OTAKUKART, Contract with Siddharth Dalmia, Madquick, Pregamate, Kaboodle, X1RACE',
    tools: 'WordPress, Elementor Pro, RankMath, WooCommerce, Yoast, cPanel, Cloudflare'
  },
  {
    files: ['app-development.html', 'App Development.html'],
    heading: 'Video Editing & Motion Graphics',
    subtitle: '13 projects — Reels, ads, post-production',
    description: 'Professional video editing and motion graphics production including social media reels, ad creatives, post-production work, sound design, and audio mixing. Experienced with short-form social content creation, brand video production, and multimedia storytelling for platforms including Instagram, YouTube, and Facebook.',
    companies: 'Pursueit Dubai, Bilex, Greenverze, Betterzila, Madquick, Pregamate PVT LTD, Kodeclamp, RuDe Labs, Pocket F.M, X1RACE, Kaboodle, Dinco Automobiles, Aura Love Yourself USA',
    tools: 'CapCut, Adobe Premiere Pro, Canva Video, DaVinci Resolve, Audacity'
  },
  {
    files: ['software-development.html', 'Software Development.html'],
    heading: 'Social Media Management',
    subtitle: '21 projects — Strategy, content & growth',
    description: 'Comprehensive social media management across Instagram, Facebook, LinkedIn, and YouTube. Expertise in content calendar management, audience segmentation, trend analysis, predictive analytics for content performance, and AI-driven insights for engagement. Grew accounts from scratch to 25k+ followers through strategic campaigns.',
    companies: 'Pursueit Dubai, Balihans, ReachHub, Bilex, Lazy Quote Lab, CS MOCK, MAMAI CARE, Marpu Foundation, Contract with Siddharth Dalmia, Pathshala, Robins Photography, Aura Love Yourself USA, Revenue Rushy Inc.',
    tools: 'Meta Business Suite, Hootsuite, Canva, Buffer, Google Analytics, Instagram Insights'
  }
];

skillPages.forEach(skill => {
  skill.files.forEach(file => {
    const filePath = path.join(PUBLIC, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ ${file} not found, skipping`);
      return;
    }
    let html = fs.readFileSync(filePath, 'utf8');

    // Replace the first major heading on the page (the service name)
    // These are typically in h1 or h2 with class elementor-heading-title
    const firstHeadingRegex = /(<h[12]\s+class="elementor-heading-title[^"]*">)([^<]+)(<\/h[12]>)/;
    html = html.replace(firstHeadingRegex, `$1${skill.heading}$3`);

    // Replace any long paragraph descriptions with our skill description
    // Target paragraphs that are likely service descriptions (50+ chars)
    let descReplaced = false;
    html = html.replace(/<p>([^<]{100,})<\/p>/g, function(match, content) {
      if (!descReplaced && !content.includes('©') && !content.includes('cookie')) {
        descReplaced = true;
        return `<p>${skill.description}</p>`;
      }
      return match;
    });

    // Update page-specific title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${skill.heading} — Abhijit Pramanik</title>`
    );

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ ${file} → "${skill.heading}"`);
  });
});

// ═══════════════════════════════════════════════
// Remaining service pages — Update with relevant content
// ═══════════════════════════════════════════════
const otherPages = [
  { file: 'agency-hosting.html', title: 'Analytics & Reporting', heading: 'Analytics & Data-Driven Marketing' },
  { file: 'Agency Hosting.html', title: 'Analytics & Reporting', heading: 'Analytics & Data-Driven Marketing' },
  { file: 'website-security.html', title: 'Paid Media & Advertising', heading: 'Paid Media & Performance Marketing' },
  { file: 'Website Security.html', title: 'Paid Media & Advertising', heading: 'Paid Media & Performance Marketing' },
  { file: 'wix-development.html', title: 'Customer Support', heading: 'Customer Support & Verification' },
  { file: 'custom-web-development.html', title: 'Canva & Creative Design', heading: 'Creative Design & Visual Content' },
  { file: 'Custom Web Development.html', title: 'Canva & Creative Design', heading: 'Creative Design & Visual Content' },
  { file: 'themes-and-plugins-development.html', title: 'Digital Marketing Strategy', heading: 'Full-Stack Digital Marketing' },
];

otherPages.forEach(page => {
  const filePath = path.join(PUBLIC, page.file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${page.title} — Abhijit Pramanik</title>`
  );

  const headingRegex = /(<h[12]\s+class="elementor-heading-title[^"]*">)([^<]+)(<\/h[12]>)/;
  html = html.replace(headingRegex, `$1${page.heading}$3`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ ${page.file} → "${page.heading}"`);
});

console.log('\n🎯 Phase 5 Complete: All skill pages updated!');
