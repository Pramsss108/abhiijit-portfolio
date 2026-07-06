const scrape = require('website-scraper').default;
const PuppeteerPlugin = require('website-scraper-puppeteer').default;
const path = require('path');
const fs = require('fs');

const publicDir = path.resolve(__dirname, 'public');

// Remove directory if it exists to avoid website-scraper error
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}

console.log('Starting the rip...');

scrape({
  urls: ['https://madquick.in/'],
  directory: publicDir,
  recursive: true,
  maxRecursiveDepth: 5, // How many clicks deep to go
  urlFilter: function(url) {
    // Only scrape pages belonging to the madquick.in domain, avoid external links
    return url.indexOf('https://madquick.in') === 0;
  },
  plugins: [
    new PuppeteerPlugin({
      launchOptions: { headless: "new" }, 
      scrollToBottom: { timeout: 15000, viewportN: 20 }, // Ensure all lazy-loaded animations trigger
      blockNavigation: true,
    })
  ]
}).then(() => {
  console.log('✅ Site successfully ripped to ./public folder!');
  console.log('You can now run "npx serve public" to host it locally.');
}).catch((err) => {
  console.error('❌ Error ripping site:', err);
});
