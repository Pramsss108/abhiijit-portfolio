/**
 * Portfolio Conversion Script — Phase 1: Global Branding
 * Applies branding changes to all HTML files in the public/ folder.
 */
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

// Get all HTML files
const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files to process.`);

htmlFiles.forEach(file => {
  const filePath = path.join(PUBLIC, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const originalSize = html.length;

  // ═══════════════════════════════════════════════
  // 1. TITLE TAG — Update all pages
  // ═══════════════════════════════════════════════
  // Replace the generic title
  html = html.replace(
    /<title>[^<]*<\/title>/g,
    '<title>Abhijit Pramanik — Digital Marketing Specialist | SEO, Content, Social Media</title>'
  );

  // ═══════════════════════════════════════════════
  // 2. LOGO — Replace madquick logo img with text monogram
  // ═══════════════════════════════════════════════
  // The logo is an <img> inside an <a> tag linking to index.html
  // Replace with a styled text element that preserves the link
  html = html.replace(
    /<img[^>]*WhatsApp-Image-2024-03-08[^>]*>/g,
    '<span style="font-family:Poppins,sans-serif;font-size:28px;font-weight:700;color:#fff;letter-spacing:2px;">AP<span style="color:#6c63ff;"> | </span>Abhijit Pramanik</span>'
  );

  // Also replace any madquick logos
  html = html.replace(
    /<img[^>]*cropped-madquick[^>]*>/g,
    '<span style="font-family:Poppins,sans-serif;font-size:14px;font-weight:600;color:#fff;">AP</span>'
  );

  // ═══════════════════════════════════════════════
  // 3. FAVICON — Already uses abhijit images (cropped-abhijit-32x32.jpg)
  //    Just make sure no madquick favicon references remain
  // ═══════════════════════════════════════════════
  // (Already correct in the scraped files)

  // ═══════════════════════════════════════════════
  // 4. FOOTER — Update company references
  // ═══════════════════════════════════════════════
  // Replace "Madquick" company references in footer text
  html = html.replace(/Madquick(?!\s*\(Sound)/gi, 'Abhijit Pramanik');
  
  // Update copyright text patterns
  html = html.replace(
    /©\s*\d{4}\s*[^<]*All\s*Rights?\s*Reserved/gi,
    '© 2026 Abhijit Pramanik. All Rights Reserved'
  );

  // ═══════════════════════════════════════════════
  // 5. META — Clean up WordPress/WooCommerce generator tags
  // ═══════════════════════════════════════════════
  html = html.replace(/<meta\s+name="generator"\s+content="WordPress[^"]*"\s*>/gi, '');
  html = html.replace(/<meta\s+name="generator"\s+content="WooCommerce[^"]*"\s*>/gi, '');
  html = html.replace(/<meta\s+name="generator"\s+content="Elementor[^"]*"\s*>/gi, '');
  
  // Remove RSS feed links (not needed for static portfolio)
  html = html.replace(/<link\s+rel="alternate"\s+type="application\/rss\+xml"[^>]*>/gi, '');
  
  // Remove oEmbed links
  html = html.replace(/<link\s+rel="alternate"\s+title="oEmbed[^>]*>/gi, '');
  
  // Remove JSON API links
  html = html.replace(/<link\s+rel="https:\/\/api\.w\.org\/"[^>]*>/gi, '');
  html = html.replace(/<link\s+rel="alternate"\s+title="JSON"[^>]*>/gi, '');
  html = html.replace(/<link\s+rel="EditURI"[^>]*>/gi, '');

  // ═══════════════════════════════════════════════
  // 6. CANONICAL — Update to generic (will be replaced with real domain later)
  // ═══════════════════════════════════════════════
  html = html.replace(
    /https?:\/\/abhijitpramanik\.com/g,
    '.'
  );
  html = html.replace(
    /https?:\/\/madquick\.in/g,
    '.'
  );

  // ═══════════════════════════════════════════════
  // 7. REMOVE TRACKING — Clarity and Google Ads (personal site, add own later)
  // ═══════════════════════════════════════════════
  // Remove Clarity
  html = html.replace(/<script[^>]*clarity\.ms[^>]*><\/script>/gi, '');
  html = html.replace(/<script[^>]*clarity[^>]*>[\s\S]*?<\/script>/gi, function(match) {
    if (match.includes('lcx0gmfups')) return '';
    return match;
  });
  
  // Remove Google Ads conversion tag
  html = html.replace(/<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>/g, '');
  html = html.replace(/<script[^>]*googletagmanager[^>]*><\/script>/gi, '');
  html = html.replace(/<script[^>]*googleads[^>]*><\/script>/gi, '');

  // Write back
  fs.writeFileSync(filePath, html, 'utf8');
  const newSize = html.length;
  const diff = originalSize - newSize;
  console.log(`✅ ${file} — ${diff > 0 ? '-' : '+'}${Math.abs(diff)} bytes`);
});

console.log('\n🎯 Phase 1 Complete: Global branding applied to all pages.');
