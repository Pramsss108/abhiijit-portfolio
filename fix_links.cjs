const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const fp = path.join(PUBLIC, file);
  let fHtml = fs.readFileSync(fp, 'utf8');
  
  // Fix weird relative root links that were created by replacing https://madquick.in with .
  // We want them to be / instead of . or ./ so it works cleanly on localhost
  fHtml = fHtml.replace(/href="\."/g, 'href="/"');
  fHtml = fHtml.replace(/href="\.\/"/g, 'href="/"');
  
  // Also, since the server is running on localhost:3000, 
  // ensure Contact Us and About Us links map to the right files
  fHtml = fHtml.replace(/href="About%20Us\.html"/gi, 'href="about-us.html"');
  fHtml = fHtml.replace(/href="Contact%20Us\.html"/gi, 'href="contact-us.html"');

  fs.writeFileSync(fp, fHtml, 'utf8');
});

console.log('Fixed relative links!');
