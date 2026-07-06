const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Tone changes: "we" to "I", "company" to "portfolio"
html = html.replace(/As a full-service web design company, we provide tailored solutions/gi, 'As a dedicated digital marketing specialist, I provide tailored solutions');
html = html.replace(/Turning Ideas into Digital Experiences for 36\+ Companies/gi, 'Turning Ideas into Digital Experiences for 36+ Brands & Clients');
html = html.replace(/We work with various platforms/gi, 'I work with various platforms');
html = html.replace(/We focus on designing intuitive navigation/gi, 'I focus on designing intuitive navigation');
html = html.replace(/we develop wireframes/gi, 'I develop wireframes');
html = html.replace(/Our team of developers works/gi, 'I work');
html = html.replace(/We prioritize usability/gi, 'I prioritize usability');
html = html.replace(/we are happy to provide/gi, 'I am happy to provide');
html = html.replace(/let us know how we can help/gi, 'let me know how I can help');

// 2. Fix animations by removing 'elementor-invisible' which causes elements to be stuck invisible if JS is broken
html = html.replace(/elementor-invisible/g, '');

// 3. Update the Portfolio Tabs
// The user provided screenshots showing tabs like "AI & No-Code", "Custom Website", "Themes & Plugins", "No-Code Builds", "SEO Strategy"
const tabs = [
  { old: 'AI &amp; No-Code', new: 'Search Engine Optimization' },
  { old: 'AI & No-Code', new: 'Search Engine Optimization' },
  { old: 'Custom Website', new: 'Custom Websites' },
  { old: 'Themes &amp; Plugins', new: 'Content Writing (SEO)' },
  { old: 'Themes & Plugins', new: 'Content Writing (SEO)' },
  { old: 'No-Code Builds', new: 'Video Marketing + Editing' },
  { old: 'SEO Strategy', new: 'Social Media Marketing' }
];

tabs.forEach(tab => {
  html = html.split(tab.old).join(tab.new);
});

// We need to inject a script or CSS to fix the marquee sliding issue
// If there's an image that isn't sliding, we can inject a CSS animation class for elementor image carousels
const cssFix = `
<style>
/* Fix hero spacing between BUILD PROOF and DIGITAL MARKETING */
.eael-fancy-text-container { margin-top: -20px !important; }

/* Force marquee sliding if it's an image (Elementor marquee fix) */
@keyframes continuousScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.wd-marquee, .elementor-image-carousel {
  animation: continuousScroll 20s linear infinite !important;
  display: flex;
}
.swiper-wrapper {
  animation: none !important; /* Let swiper do its thing, or override if broken */
}
/* Ensure elements are visible */
.elementor-widget-wrap { opacity: 1 !important; }
</style>
`;
html = html.replace('</head>', cssFix + '</head>');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated index.html with tone changes, animation fixes, and tab updates.');
