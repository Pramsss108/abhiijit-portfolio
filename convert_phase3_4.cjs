/**
 * Portfolio Conversion Script — Phase 3 & 4: About + Contact Pages
 */
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════
const aboutFiles = ['about-us.html', 'About Us.html'];
aboutFiles.forEach(file => {
  const filePath = path.join(__dirname, 'public', file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Page title
  html = html.replace(/About\s*Us/g, 'About Me');

  // Replace company story paragraphs with personal journey
  const personalStory = `From 12th pass to working with 36+ companies across 3 continents by age 22. My career started at ReachHub in 2019 as a Digital Marketing Strategist, then grew through roles at Balihans Bengaluru, Revenue Rushy Inc., Pursueit Dubai, and Aura Love Yourself USA. I specialize in SEO, content strategy, social media management, WordPress development, video editing, and AI-powered no-code solutions. Certified by Meta and Google in Social Media Marketing and Digital Marketing & E-commerce.`;

  // Replace common "about company" patterns
  html = html.replace(
    /(?:We are a|Our company is|We have been)[^<]*(?:agency|company|firm|team)[^<]*/gi,
    personalStory
  );

  // Replace "our team" references
  html = html.replace(/our\s+team/gi, 'my expertise');
  html = html.replace(/our\s+company/gi, 'my career');
  html = html.replace(/our\s+clients/gi, 'my clients');
  html = html.replace(/we\s+(?:are|have|provide|offer|deliver|create|build)/gi, 'I $1');
  html = html.replace(/I\s+are/gi, 'I am');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ ${file} — About page updated`);
});

// ═══════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════
const contactFiles = ['contact-us.html', 'Contact Us.html'];
contactFiles.forEach(file => {
  const filePath = path.join(__dirname, 'public', file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Update headings
  html = html.replace(/Contact\s*Us/g, "Let's Work Together");
  html = html.replace(/Get\s*[Ii]n\s*[Tt]ouch/g, 'Hire Me');

  // Update contact details if present in text
  html = html.replace(/info@madquick\.in/gi, 'growabhiii@gmail.com');
  html = html.replace(/\+91\s*\d{10}/g, '+91 8777849865');
  
  // Replace "our office" type references
  html = html.replace(/our\s+office/gi, 'my location');
  html = html.replace(/our\s+team/gi, 'me');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ ${file} — Contact page updated`);
});

// ═══════════════════════════════════════════════
// ALL SERVICE PAGES — Update "Services" → "Skills" in nav
// ═══════════════════════════════════════════════
const PUBLIC = path.join(__dirname, 'public');
const allHtml = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));
allHtml.forEach(file => {
  const filePath = path.join(PUBLIC, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Update nav menu on all pages
  html = html.replace(/>Services</g, '>Skills<');
  
  // Update "About Us" → "About Me" in nav
  html = html.replace(/>About Us</g, '>About Me<');
  
  // Update "Contact Us" → "Contact" in nav
  html = html.replace(/>Contact Us</g, '>Contact<');

  // Replace company-centric language in headers/body
  html = html.replace(/our\s+services/gi, 'my skills');
  html = html.replace(/Our\s+Services/g, 'My Skills');
  
  fs.writeFileSync(filePath, html, 'utf8');
});

console.log(`✅ Nav menus updated across all ${allHtml.length} pages`);
console.log('\n🎯 Phase 3 & 4 Complete!');
