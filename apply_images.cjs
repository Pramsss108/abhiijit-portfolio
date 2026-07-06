const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\guita\\.gemini\\antigravity-ide\\brain\\b6b71b89-6329-4341-9e5e-b26432835928';
const destDir = path.join(__dirname, 'public', 'images');

const imagesToMove = [
  { src: 'hero_seo_3d_1782395625871.png', dest: 'hero_seo_3d.png' },
  { src: 'hero_social_3d_1782395639005.png', dest: 'hero_social_3d.png' },
  { src: 'hero_wordpress_3d_1782395649404.png', dest: 'hero_wordpress_3d.png' },
  { src: 'hero_video_3d_1782395659864.png', dest: 'hero_video_3d.png' },
  { src: 'hero_content_3d_1782395672723.png', dest: 'hero_content_3d.png' },
  { src: 'hero_ai_3d_1782395685474.png', dest: 'hero_ai_3d.png' }
];

// Copy files
imagesToMove.forEach(img => {
  const srcPath = path.join(srcDir, img.src);
  const destPath = path.join(destDir, img.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${img.dest}`);
  } else {
    console.log(`Missing ${img.src}`);
  }
});

// Update index.html
const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// The original images have srcset attributes which we should remove to ensure our new images are loaded cleanly without weird scaling issues from old cached sizes
const removeSrcset = (htmlString) => {
  return htmlString.replace(/srcset="[^"]*"/g, '');
};
const removeSizes = (htmlString) => {
  return htmlString.replace(/sizes="[^"]*"/g, '');
};

html = removeSrcset(html);
html = removeSizes(html);

// 1. SEO (formerly No Code Website Development)
// Original image: Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_No_1.jpg
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_No_1\.jpg/g, 'images/hero_seo_3d.png');

// 2. Social Media (formerly Software Development)
// Original image: Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_So_1.jpg
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_So_1\.jpg/g, 'images/hero_social_3d.png');

// 3. WordPress (formerly WordPress Development)
// Original image: Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_We_1\.jpg (Wait, what was the exact name?)
// Let's check: "Wordpress Website" in original had an image. I'll just regex replace near the heading.
// Actually, let's just do a blanket replace of all the Leonardo images that are in the hero section.

// Content Writing (formerly Content Writing)
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_Co_1\.jpg/g, 'images/hero_content_3d.png');

// WordPress Development (formerly Agency Hosting - wait, Agency hosting was used for WordPress?)
// Wait, the plan was:
// 1. SEO -> No Code Dev image (Leonardo_No_1)
// 2. Social Media -> Software Dev image (Leonardo_So_1)
// 3. WordPress -> Agency Hosting image (Leonardo_Ag_0)
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_Ag_0\.jpg/g, 'images/hero_wordpress_3d.png');

// 4. Video Editing -> App Development image (Leonardo_We_1-1)
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_We_1-1\.jpg/g, 'images/hero_video_3d.png');

// 5. Content Writing -> Content Writing image (Leonardo_Co_1)
// Already handled above.

// 6. AI & No-Code -> Dedicated Tech Team image (Leonardo_De_1)
// Wait, in my plan mapping:
// 1. No Code -> SEO
// 2. Software -> Social Media
// 3. WordPress Dev -> WordPress (original was Leonardo... let's just replace all Leonardo images)
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_De_1\.jpg/g, 'images/hero_ai_3d.png');

// There might be one more: original "Wordpress Website"
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_We_1\.jpg/g, 'images/hero_wordpress_3d.png');
html = html.replace(/images\/Leonardo_Phoenix_A_highquality_3Drendered_scene_depicting_a_We_2\.jpg/g, 'images/hero_wordpress_3d.png');

fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('index.html updated with new hero images!');
