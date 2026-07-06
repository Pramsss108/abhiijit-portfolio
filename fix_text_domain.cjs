const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Fix "At Abhijit Pramanik, we believe that creativity is"
html = html.replace(
  /<h2 class="elementor-heading-title elementor-size-default">At Abhijit Pramanik, we believe that creativity <\/h2>/g,
  '<h2 class="elementor-heading-title elementor-size-default">I believe that true digital creativity </h2>'
);
html = html.replace(
  /<h2 class="elementor-heading-title elementor-size-default">At Abhijit Pramanik, we believe that creativity is<\/h2>/g,
  '<h2 class="elementor-heading-title elementor-size-default">I believe that true digital creativity is</h2>'
);

// Fix "Bveryone" back to a proper animated text setup
// The animated text is currently "Bveryone" because I accidentally replaced 'E' with 'B'.
// Let's replace "Bveryone" with "Brands" and fix the other span letters.
html = html.replace(
  /<span class="dynamic-text-letter show-letter">B<\/span><span class="dynamic-text-letter show-letter">v<\/span><span class="dynamic-text-letter show-letter">e<\/span><span class="dynamic-text-letter show-letter">r<\/span><span class="dynamic-text-letter show-letter">y<\/span><span class="dynamic-text-letter show-letter">o<\/span><span class="dynamic-text-letter show-letter">n<\/span><span class="dynamic-text-letter show-letter">e<\/span>/g,
  '<span class="dynamic-text-letter show-letter">B</span><span class="dynamic-text-letter show-letter">r</span><span class="dynamic-text-letter show-letter">a</span><span class="dynamic-text-letter show-letter">n</span><span class="dynamic-text-letter show-letter">d</span><span class="dynamic-text-letter show-letter">s</span>'
);

html = html.replace(
  /<span class="dynamic-text-letter">B<\/span><span class="dynamic-text-letter">v<\/span><span class="dynamic-text-letter">e<\/span><span class="dynamic-text-letter">r<\/span><span class="dynamic-text-letter">y<\/span><span class="dynamic-text-letter">o<\/span><span class="dynamic-text-letter">n<\/span><span class="dynamic-text-letter">e<\/span>/g,
  '<span class="dynamic-text-letter">S</span><span class="dynamic-text-letter">t</span><span class="dynamic-text-letter">a</span><span class="dynamic-text-letter">r</span><span class="dynamic-text-letter">t</span><span class="dynamic-text-letter">u</span><span class="dynamic-text-letter">p</span><span class="dynamic-text-letter">s</span>'
);

// We have a third one to replace with "Creators"
html = html.replace(
  /<span class="dynamic-text"><span class="dynamic-text-letter">S<\/span><span class="dynamic-text-letter">t<\/span><span class="dynamic-text-letter">a<\/span><span class="dynamic-text-letter">r<\/span><span class="dynamic-text-letter">t<\/span><span class="dynamic-text-letter">u<\/span><span class="dynamic-text-letter">p<\/span><span class="dynamic-text-letter">s<\/span><\/span><\/span><span class="normal-text style-color"><\/span>/g,
  '<span class="dynamic-text"><span class="dynamic-text-letter">C</span><span class="dynamic-text-letter">r</span><span class="dynamic-text-letter">e</span><span class="dynamic-text-letter">a</span><span class="dynamic-text-letter">t</span><span class="dynamic-text-letter">o</span><span class="dynamic-text-letter">r</span><span class="dynamic-text-letter">s</span></span></span><span class="normal-text style-color"></span>'
);


// Update all canonical URLs and meta tags to abhijit.works across all HTML files
const PUBLIC = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const fp = path.join(PUBLIC, file);
  let fHtml = fs.readFileSync(fp, 'utf8');
  
  // Revert the generic '.' canonical URL from Phase 1 back to the real domain
  fHtml = fHtml.replace(/<link rel="canonical" href="\.">/g, `<link rel="canonical" href="https://abhijit.works/${file === 'index.html' ? '' : file}">`);
  fHtml = fHtml.replace(/<link rel="shortlink" href="\.">/g, `<link rel="shortlink" href="https://abhijit.works/${file === 'index.html' ? '' : file}">`);
  
  // Replace any remaining abhijitpramanik.com references with abhijit.works
  fHtml = fHtml.replace(/abhijitpramanik\.com/g, 'abhijit.works');

  fs.writeFileSync(fp, fHtml, 'utf8');
});

console.log('Fixed text and domains!');
