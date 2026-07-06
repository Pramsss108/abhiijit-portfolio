import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const base = process.env.PORTFOLIO_URL || "http://localhost:5055";
const output = resolve(import.meta.dirname, "..", "perf-reports", "phase-012");
await mkdir(output, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function preparedPage(viewport, reducedMotion = false) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("ap_intro_seen_v1", "1"));
  page.on("pageerror", (error) => failures.push(`Page error: ${error.message}`));
  page.on("requestfailed", (request) => {
    const error = request.failure()?.errorText || "";
    const closedMediaRequest = request.resourceType() === "media" && error.includes("ERR_ABORTED");
    if (new URL(request.url()).hostname === "localhost" && !closedMediaRequest) failures.push(`Local request failed: ${request.url()}`);
  });
  return page;
}

const desktop = await preparedPage({ width: 1440, height: 1000 });
await desktop.goto(`${base}/v3/`, { waitUntil: "networkidle2" });
await desktop.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  const target = document.querySelector("#evidence");
  if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 84);
});
await desktop.waitForFunction(() => document.querySelector("#evidence .reveal")?.classList.contains("is-visible"), { timeout: 5000 });
await desktop.$eval(".evidence-artifact img", async (image) => {
  image.loading = "eager";
  image.scrollIntoView({ block: "center" });
  try { await image.decode(); } catch {}
});
await new Promise((resolveDelay) => setTimeout(resolveDelay, 180));

const desktopState = await desktop.evaluate(() => {
  const desk = document.querySelector("[data-evidence-desk]");
  const panel = document.querySelector(".content-panel");
  const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((script) => {
    try { return JSON.parse(script.textContent); } catch { return null; }
  }).filter(Boolean);
  const videoList = jsonLd.find((entry) => entry["@type"] === "ItemList" && entry.name?.includes("video editing"));
  return {
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    metaDescription: document.querySelector('meta[name="description"]')?.content,
    structuredVideos: videoList?.itemListElement?.filter((entry) => entry.item?.["@type"] === "VideoObject").length || 0,
    buttons: desk?.querySelectorAll("[data-evidence-target]").length,
    files: desk?.querySelectorAll("[data-evidence-panel]").length,
    active: desk?.querySelector("[data-evidence-panel].is-active")?.dataset.evidencePanel,
    enhanced: desk?.classList.contains("is-enhanced"),
    desktop: desk?.classList.contains("is-desktop"),
    oldLedger: !!document.querySelector(".proof-ledger"),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    contentBackground: getComputedStyle(panel).backgroundImage,
    artifactLoaded: document.querySelector(".evidence-artifact img")?.complete,
    evidenceHeight: document.querySelector("#evidence")?.getBoundingClientRect().height,
    mediaItems: document.querySelectorAll("[data-media-item]").length,
    reelItems: document.querySelectorAll(".media-tile--reel").length,
    wideItems: document.querySelectorAll(".media-tile--wide").length,
    mediaHeight: document.querySelector(".media-wall")?.getBoundingClientRect().height,
    portraitSource: document.querySelector(".media-wall__portrait")?.getAttribute("src"),
    legacyVideoUi: !!document.querySelector(".video-feature,.video-choice,.video-proof__portrait"),
    aboutSource: document.querySelector(".about__photo")?.getAttribute("src"),
    videoClaim: document.querySelector("#video-work-title")?.textContent.trim(),
    processBackground: getComputedStyle(document.querySelector("#process")).backgroundImage,
    aboutBackground: getComputedStyle(document.querySelector("#about")).backgroundImage,
    oldCopy: /claim index|evidence desk|proof-driven process/i.test(document.body.innerText),
    processTitle: document.querySelector("#process-title")?.textContent.trim(),
    processTitleVisible: getComputedStyle(document.querySelector("#process-title")).opacity === "1",
  };
});
assert(desktopState.canonical === "https://abhijit.works/", "Canonical URL is not wired to abhijit.works.");
assert(desktopState.metaDescription?.length >= 120 && desktopState.structuredVideos === 6, "SEO/GEO description or six-video structured data is incomplete.");
assert(desktopState.buttons === 4 && desktopState.files === 4, "Evidence Desk does not expose four claims.");
assert(desktopState.enhanced && desktopState.desktop, "Desktop Evidence Desk enhancement did not initialise.");
assert(desktopState.active === "social", "Public Bongbari artifact is not the default dossier.");
assert(!desktopState.oldLedger, "Legacy evidence ledger still exists.");
assert(desktopState.overflow <= 1, `Desktop horizontal overflow: ${desktopState.overflow}px.`);
assert(desktopState.contentBackground.includes("radial-gradient"), "Content-panel atmosphere is missing.");
assert(desktopState.artifactLoaded, "Public evidence artifact did not load.");
assert(desktopState.evidenceHeight <= 930, `Desktop Evidence section exceeds one view: ${desktopState.evidenceHeight}px.`);
assert(desktopState.mediaItems === 6 && desktopState.videoClaim.includes("300+"), "Editorial media wall or 300+ claim is missing.");
assert(desktopState.reelItems === 4 && desktopState.wideItems === 2 && !desktopState.legacyVideoUi, "Final 4-reel and 2-wide media wall is incomplete or legacy UI remains.");
assert(desktopState.mediaHeight <= 620, `Desktop media wall exceeds one view: ${desktopState.mediaHeight}px.`);
assert(desktopState.portraitSource?.includes("abhijit-video-portrait.webp") && desktopState.aboutSource?.includes("abhijit-about-v2-720.webp"), "Supplied portraits are not connected.");
assert(desktopState.processBackground.includes("radial-gradient") && desktopState.aboutBackground.includes("radial-gradient"), "Lower-section atmosphere is missing.");
assert(!desktopState.oldCopy, "Old technical Verification or Process wording remains visible.");
assert(desktopState.processTitle === "Six clear steps" && desktopState.processTitleVisible, "Plain Process heading is missing or hidden.");
await desktop.screenshot({ path: resolve(output, "evidence-desktop.png"), fullPage: false });

await desktop.click('[data-media-item][data-media-index="0"]');
const modalState = await desktop.evaluate(() => ({
  open: document.querySelector("[data-media-player]")?.open,
  title: document.querySelector("[data-player-title]")?.textContent,
  count: document.querySelector("[data-player-count]")?.textContent,
  playerSource: document.querySelector("[data-player-video]")?.getAttribute("src"),
  pageLocked: document.documentElement.classList.contains("media-player-open"),
}));
assert(modalState.open && modalState.title === "Before & After Edit" && modalState.count === "01 / 06" && modalState.playerSource?.includes("reel-01.mp4") && modalState.pageLocked, "Connected media player failed.");
await desktop.screenshot({ path: resolve(output, "media-player-desktop.png"), fullPage: false });
await desktop.click("[data-player-next]");
await desktop.waitForFunction(() => document.querySelector("[data-player-title]")?.textContent === "Creator Reel Breakdown", { timeout: 3000 });
const navigationState = await desktop.evaluate(() => ({
  title: document.querySelector("[data-player-title]")?.textContent,
  count: document.querySelector("[data-player-count]")?.textContent,
  source: document.querySelector("[data-player-video]")?.getAttribute("src"),
}));
assert(navigationState.title === "Creator Reel Breakdown" && navigationState.count === "02 / 06" && navigationState.source?.includes("reel-02.mp4"), "Player next navigation failed.");
await desktop.click("[data-player-close]");
const closeState = await desktop.evaluate(() => ({
  open: document.querySelector("[data-media-player]")?.open,
  pageLocked: document.documentElement.classList.contains("media-player-open"),
  focusReturned: document.activeElement?.getAttribute("data-media-index") === "0",
}));
assert(!closeState.open && !closeState.pageLocked && closeState.focusReturned, "Player close state or focus return failed.");
await desktop.evaluate(() => document.querySelector(".media-wall")?.scrollIntoView({ block: "center" }));
await desktop.$$eval(".media-wall img", (images) => Promise.all(images.map((image) => image.decode().catch(() => {}))));
await new Promise((resolveDelay) => setTimeout(resolveDelay, 180));
await desktop.screenshot({ path: resolve(output, "video-showcase-desktop.png"), fullPage: false });

await desktop.focus('[data-evidence-target="social"]');
await desktop.keyboard.press("ArrowDown");
const keyboardState = await desktop.evaluate(() => ({
  active: document.querySelector("[data-evidence-panel].is-active")?.dataset.evidencePanel,
  hash: location.hash,
  selected: document.querySelector('[data-evidence-target="search"]')?.getAttribute("aria-selected"),
}));
assert(keyboardState.active === "search" && keyboardState.hash === "#evidence-search" && keyboardState.selected === "true", "Keyboard claim selection failed.");

const mobile = await preparedPage({ width: 390, height: 844 });
await mobile.goto(`${base}/v3/`, { waitUntil: "networkidle2" });
await mobile.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  const target = document.querySelector("#evidence");
  if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 72);
});
await mobile.waitForFunction(() => document.querySelector("#evidence .reveal")?.classList.contains("is-visible"), { timeout: 5000 });
await mobile.$eval(".evidence-artifact img", async (image) => {
  image.loading = "eager";
  image.scrollIntoView({ block: "center" });
  try { await image.decode(); } catch {}
});
await new Promise((resolveDelay) => setTimeout(resolveDelay, 180));
const mobileInitial = await mobile.evaluate(() => ({
  indexDisplay: getComputedStyle(document.querySelector(".evidence-index")).display,
  open: document.querySelectorAll(".evidence-file[open]").length,
  details: document.querySelectorAll(".evidence-file").length,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
assert(mobileInitial.indexDisplay === "none", "Desktop claim rail remains visible on mobile.");
assert(mobileInitial.open === 1 && mobileInitial.details === 4, "Mobile dossiers do not initialise as one open native disclosure.");
assert(mobileInitial.overflow <= 1, `Mobile horizontal overflow: ${mobileInitial.overflow}px.`);
await mobile.screenshot({ path: resolve(output, "evidence-mobile.png"), fullPage: false });
await mobile.click('#evidence-content > summary');
await mobile.waitForFunction(() => {
  const open = Array.from(document.querySelectorAll(".evidence-file[open]"));
  return open.length === 1 && open[0].dataset.evidencePanel === "content";
}, { timeout: 3000 }).catch(() => {});
const mobileAfter = await mobile.evaluate(() => ({
  open: Array.from(document.querySelectorAll(".evidence-file[open]")).map((item) => item.dataset.evidencePanel),
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
assert(mobileAfter.open.length === 1 && mobileAfter.open[0] === "content", "Mobile native dossier selection failed.");
assert(mobileAfter.overflow <= 1, `Mobile overflow after opening dossier: ${mobileAfter.overflow}px.`);
await mobile.evaluate(() => document.querySelector(".media-wall")?.scrollIntoView({ block: "start" }));
await mobile.$$eval(".media-wall img", (images) => Promise.all(images.map((image) => image.decode().catch(() => {}))));
await new Promise((resolveDelay) => setTimeout(resolveDelay, 180));
const mobileVideoState = await mobile.evaluate(() => ({
  height: document.querySelector(".media-wall")?.getBoundingClientRect().height,
  items: document.querySelectorAll("[data-media-item]").length,
  minCardWidth: Math.min(...Array.from(document.querySelectorAll("[data-media-item]")).map((item) => item.getBoundingClientRect().width)),
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
assert(mobileVideoState.height <= 540, `Mobile media wall exceeds one view: ${mobileVideoState.height}px.`);
assert(mobileVideoState.items === 6 && mobileVideoState.minCardWidth >= 70 && mobileVideoState.overflow <= 1, "Mobile media wall is incomplete, too narrow, or overflows.");
await mobile.screenshot({ path: resolve(output, "video-showcase-mobile.png"), fullPage: false });
await mobile.click('[data-media-item][data-media-index="4"]');
const mobilePlayerState = await mobile.evaluate(() => {
  const dialog = document.querySelector("[data-media-player]");
  const rect = dialog.getBoundingClientRect();
  return { open: dialog.open, width: rect.width, height: rect.height, source: document.querySelector("[data-player-video]")?.getAttribute("src"), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
});
assert(mobilePlayerState.open && mobilePlayerState.width === 390 && mobilePlayerState.height === 844 && mobilePlayerState.source?.includes("landscape-01.mp4") && mobilePlayerState.overflow <= 1, "Mobile full-screen player failed.");
await mobile.screenshot({ path: resolve(output, "media-player-mobile.png"), fullPage: false });
await mobile.click("[data-player-close]");

async function inspectMediaViewport(viewport, screenshotName) {
  const page = await preparedPage(viewport);
  await page.goto(`${base}/v3/`, { waitUntil: "networkidle2" });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.querySelector(".media-wall")?.scrollIntoView({ block: "start" });
  });
  await page.$$eval(".media-wall img", (images) => Promise.all(images.map((image) => image.decode().catch(() => {}))));
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 220));
  const state = await page.evaluate(() => {
    const wall = document.querySelector(".media-wall");
    const cards = Array.from(document.querySelectorAll("[data-media-item]"));
    return {
      height: wall?.getBoundingClientRect().height,
      items: cards.length,
      visible: cards.filter((card) => {
        const rect = card.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length,
      smallestTarget: Math.min(...cards.map((card) => Math.min(card.getBoundingClientRect().width, card.getBoundingClientRect().height))),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  await page.screenshot({ path: resolve(output, screenshotName), fullPage: false });
  await page.close();
  return state;
}

const tabletMediaState = await inspectMediaViewport({ width: 768, height: 1024 }, "video-showcase-tablet.png");
assert(tabletMediaState.items === 6 && tabletMediaState.visible === 6 && tabletMediaState.height <= 600 && tabletMediaState.overflow <= 1, "Tablet media wall failed visibility, height, or overflow checks.");
const smallMediaState = await inspectMediaViewport({ width: 320, height: 568 }, "video-showcase-small-mobile.png");
assert(smallMediaState.items === 6 && smallMediaState.visible === 6 && smallMediaState.height <= 500 && smallMediaState.smallestTarget >= 64 && smallMediaState.overflow <= 1, "Small-mobile media wall failed visibility, target size, height, or overflow checks.");

const noJs = await browser.newPage();
await noJs.setJavaScriptEnabled(false);
await noJs.setViewport({ width: 390, height: 844 });
await noJs.goto(`${base}/v3/`, { waitUntil: "networkidle0" });
const noJsState = await noJs.evaluate(() => ({
  open: document.querySelectorAll(".evidence-file[open]").length,
  claims: document.querySelectorAll("[data-evidence-panel]").length,
  headings: Array.from(document.querySelectorAll(".evidence-record__claim strong")).filter((node) => getComputedStyle(node).display !== "none").length,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
assert(noJsState.open === 4 && noJsState.claims === 4 && noJsState.headings === 4, "No-JS evidence content is not fully readable.");
assert(noJsState.overflow <= 1, `No-JS mobile horizontal overflow: ${noJsState.overflow}px.`);

const reduced = await preparedPage({ width: 1440, height: 1000 }, true);
await reduced.goto(`${base}/v3/`, { waitUntil: "networkidle2" });
const reducedState = await reduced.evaluate(() => ({
  intro: !!document.querySelector("[data-intro]"),
  scanAnimation: getComputedStyle(document.querySelector(".evidence-artifact__scan")).animationName,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
assert(!reducedState.intro, "Opening curtain remains in reduced-motion mode.");
assert(reducedState.scanAnimation === "none", "Evidence scanner animates in reduced-motion mode.");
assert(reducedState.overflow <= 1, `Reduced-motion horizontal overflow: ${reducedState.overflow}px.`);

const rootPage = await preparedPage({ width: 1280, height: 800 });
await rootPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const rootState = await rootPage.evaluate(() => ({
  title: document.title,
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  desk: !!document.querySelector("[data-evidence-desk]"),
  css: document.querySelector('link[rel="stylesheet"]')?.href,
}));
assert(rootState.canonical === "https://abhijit.works/" && rootState.desk, "Production root is not serving the canonical v3 document.");
assert(rootState.css.includes("/v3/styles.min.css"), "Production root does not load the v3 stylesheet.");

await browser.close();

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ desktopState, modalState, navigationState, closeState, keyboardState, mobileInitial, mobileAfter, mobileVideoState, mobilePlayerState, tabletMediaState, smallMediaState, noJsState, reducedState, rootState }, null, 2));
}
