const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Fix the logo color (it was white on a white navbar, making it invisible)
html = html.replace(
  /color:#fff;letter-spacing:2px;">AP<span style="color:#6c63ff;"> \| <\/span>Abhijit Pramanik<\/span>/g,
  'color:#000;letter-spacing:2px;">AP<span style="color:#6c63ff;"> | </span>Abhijit Pramanik</span>'
);

// 2. Fix the "At Abhijit Pramanik..." text (this failed to save last time)
html = html.replace(
  /<h2 class="elementor-heading-title elementor-size-default">At Abhijit Pramanik, we believe that creativity <\/h2>/g,
  '<h2 class="elementor-heading-title elementor-size-default">I believe that true digital creativity </h2>'
);
html = html.replace(
  /<h2 class="elementor-heading-title elementor-size-default">At Abhijit Pramanik, we believe that creativity is<\/h2>/g,
  '<h2 class="elementor-heading-title elementor-size-default">I believe that true digital creativity is</h2>'
);

// 3. Fix the "Bveryone" typo
html = html.replace(
  /<span class="dynamic-text-letter show-letter">B<\/span><span class="dynamic-text-letter show-letter">v<\/span><span class="dynamic-text-letter show-letter">e<\/span><span class="dynamic-text-letter show-letter">r<\/span><span class="dynamic-text-letter show-letter">y<\/span><span class="dynamic-text-letter show-letter">o<\/span><span class="dynamic-text-letter show-letter">n<\/span><span class="dynamic-text-letter show-letter">e<\/span>/g,
  '<span class="dynamic-text-letter show-letter">B</span><span class="dynamic-text-letter show-letter">r</span><span class="dynamic-text-letter show-letter">a</span><span class="dynamic-text-letter show-letter">n</span><span class="dynamic-text-letter show-letter">d</span><span class="dynamic-text-letter show-letter">s</span>'
);

html = html.replace(
  /<span class="dynamic-text-letter">B<\/span><span class="dynamic-text-letter">v<\/span><span class="dynamic-text-letter">e<\/span><span class="dynamic-text-letter">r<\/span><span class="dynamic-text-letter">y<\/span><span class="dynamic-text-letter">o<\/span><span class="dynamic-text-letter">n<\/span><span class="dynamic-text-letter">e<\/span>/g,
  '<span class="dynamic-text-letter">S</span><span class="dynamic-text-letter">t</span><span class="dynamic-text-letter">a</span><span class="dynamic-text-letter">r</span><span class="dynamic-text-letter">t</span><span class="dynamic-text-letter">u</span><span class="dynamic-text-letter">p</span><span class="dynamic-text-letter">s</span>'
);

html = html.replace(
  /<span class="dynamic-text"><span class="dynamic-text-letter">S<\/span><span class="dynamic-text-letter">t<\/span><span class="dynamic-text-letter">a<\/span><span class="dynamic-text-letter">r<\/span><span class="dynamic-text-letter">t<\/span><span class="dynamic-text-letter">u<\/span><span class="dynamic-text-letter">p<\/span><span class="dynamic-text-letter">s<\/span><\/span><\/span><span class="normal-text style-color"><\/span>/g,
  '<span class="dynamic-text"><span class="dynamic-text-letter">C</span><span class="dynamic-text-letter">r</span><span class="dynamic-text-letter">e</span><span class="dynamic-text-letter">a</span><span class="dynamic-text-letter">t</span><span class="dynamic-text-letter">o</span><span class="dynamic-text-letter">r</span><span class="dynamic-text-letter">s</span></span></span><span class="normal-text style-color"></span>'
);

// Save the changes this time!
fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully saved text fixes and logo color to index.html!');
