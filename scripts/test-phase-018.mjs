import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const base = process.env.PORTFOLIO_URL || "http://localhost:5055";
const output = resolve(import.meta.dirname, "..", "perf-reports", "phase-018");
await mkdir(output, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const failures = [];
const report = {};
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function open(viewport) {
  const page = await browser.newPage();
  const requestFailures = [];
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("ap_intro_seen_v1", "1"));
  page.on("requestfailed", (request) => requestFailures.push({ url: request.url(), error: request.failure()?.errorText }));
  await page.goto(`${base}/v3/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise((done) => setTimeout(done, 500));
  return { page, requestFailures };
}

async function show(page, selector, file) {
  await page.$eval(selector, (node) => {
    const header = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    window.scrollTo({ top: window.scrollY + node.getBoundingClientRect().top - header - 8, behavior: "instant" });
  });
  if (selector === "#about") {
    await page.$eval(".about__photo", async (image) => {
      image.loading = "eager";
      if (typeof image.decode === "function") {
        await Promise.race([
          image.decode().catch(() => {}),
          new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);
      }
    });
  }
  await new Promise((done) => setTimeout(done, 1100));
  await page.screenshot({ path: resolve(output, file) });
}

const desktopSession = await open({ width: 1440, height: 900 });
const desktop = desktopSession.page;
await show(desktop, ".work__layout", "desktop-work.png");
await new Promise((done) => setTimeout(done, 1800));
await desktop.screenshot({ path: resolve(output, "desktop-work-late.png") });
const workState = await desktop.evaluate(() => {
  const lede = document.querySelector(".work__lede");
  const card = document.querySelector(".work-item__card");
  const stream = document.querySelector(".work__stream");
  return {
    ledeBackground: getComputedStyle(lede).backgroundImage,
    ledeHeight: Math.round(lede.getBoundingClientRect().height),
    cardBackground: getComputedStyle(card).backgroundImage,
    cardBorder: getComputedStyle(card).borderColor,
    streamRail: getComputedStyle(stream).borderLeftWidth,
    layoutRule: getComputedStyle(document.querySelector(".work__layout")).borderTopWidth,
    narrativeRule: getComputedStyle(document.querySelector(".work__narr")).borderLeftWidth,
    additionalRule: getComputedStyle(document.querySelector(".work__additional")).borderTopWidth,
    cardHeaderRule: getComputedStyle(document.querySelector(".work-item__head")).borderBottomWidth,
    cardDecoration: getComputedStyle(card, "::after").display,
    ledeClass: lede.className,
    titleClass: lede.querySelector(".work__title")?.className,
    titleOpacity: getComputedStyle(lede.querySelector(".work__title")).opacity,
    titleColor: getComputedStyle(lede.querySelector(".work__title")).color,
    titleFilter: getComputedStyle(lede.querySelector(".work__title")).filter,
    itemClass: document.querySelector(".work-item")?.className,
    itemOpacity: getComputedStyle(document.querySelector(".work-item")).opacity,
    itemFilter: getComputedStyle(document.querySelector(".work-item")).filter,
    sectionOpacity: getComputedStyle(document.querySelector("#work")).opacity,
    sectionFilter: getComputedStyle(document.querySelector("#work")).filter,
    panelOpacity: getComputedStyle(document.querySelector(".content-panel")).opacity,
    panelFilter: getComputedStyle(document.querySelector(".content-panel")).filter,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

await show(desktop, "#about", "desktop-about.png");
const aboutState = await desktop.evaluate(() => {
  const section = document.querySelector("#about");
  const image = document.querySelector(".about__photo");
  const frame = document.querySelector(".about__frame");
  const header = document.querySelector(".site-header");
  return {
    height: Math.round(section.getBoundingClientRect().height),
    available: innerHeight - Math.round(header.getBoundingClientRect().height),
    frame: [Math.round(frame.getBoundingClientRect().width), Math.round(frame.getBoundingClientRect().height)],
    image: {
      src: image.getAttribute("src"),
      currentSrc: image.currentSrc,
      complete: image.complete,
      natural: [image.naturalWidth, image.naturalHeight],
      display: getComputedStyle(image).display,
      objectFit: getComputedStyle(image).objectFit,
      objectPosition: getComputedStyle(image).objectPosition,
      transform: getComputedStyle(image).transform,
    },
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

await show(desktop, "#faq", "desktop-faq.png");
const faqState = await desktop.evaluate(() => {
  const section = document.querySelector("#faq");
  const title = document.querySelector("#faq-title");
  const list = document.querySelector("#faq .faq__list");
  const header = document.querySelector(".site-header");
  const panel = document.querySelector("#faq .faq__panel");
  const order = ["proof-numbers", "services", "work", "process", "about", "faq", "contact"]
    .map((id) => document.getElementById(id)?.getBoundingClientRect().top + scrollY);
  return {
    height: Math.round(section.getBoundingClientRect().height),
    available: innerHeight - Math.round(header.getBoundingClientRect().height),
    title: {
      text: title?.textContent.trim(),
      display: getComputedStyle(title).display,
      opacity: getComputedStyle(title).opacity,
      height: Math.round(title?.getBoundingClientRect().height || 0),
    },
    columns: getComputedStyle(list).gridTemplateColumns,
    panelOpen: panel?.hasAttribute("data-open"),
    order,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

await desktop.click("#faq .faq__trigger");
await new Promise((done) => setTimeout(done, 500));
const faqOpenState = await desktop.evaluate(() => ({
  sectionHeight: Math.round(document.querySelector("#faq").getBoundingClientRect().height),
  openPanels: document.querySelectorAll("#faq .faq__panel[data-open]").length,
  expanded: document.querySelector("#faq .faq__trigger")?.getAttribute("aria-expanded"),
  answerHeight: Math.round(document.querySelector("#faq .faq__answer")?.getBoundingClientRect().height || 0),
}));
await desktop.screenshot({ path: resolve(output, "desktop-faq-open.png") });

report.desktop = { workState, aboutState, faqState, faqOpenState, requestFailures: desktopSession.requestFailures };
assert(workState.ledeBackground === "none" && workState.ledeHeight <= 475 && workState.cardBackground !== "none", "Case Studies hierarchy or compact index is incorrect.");
assert(workState.streamRail === "0px" && workState.layoutRule === "0px" && workState.narrativeRule === "0px" && workState.additionalRule === "0px" && workState.cardHeaderRule === "0px" && workState.cardDecoration === "none", "Redundant Case Studies divider lines remain.");
assert(workState.overflow <= 1, "Case Studies introduces horizontal overflow.");
assert(aboutState.height <= aboutState.available + 8, `About is ${aboutState.height}px tall but only ${aboutState.available}px is available.`);
assert(aboutState.image.natural[0] > 0 && aboutState.image.objectFit === "contain" && aboutState.image.transform === "none", "About portrait did not load fully or is still cropped/transformed.");
assert(aboutState.overflow <= 1, "About introduces horizontal overflow.");
assert(faqState.height <= faqState.available + 8, `FAQ is ${faqState.height}px tall but only ${faqState.available}px is available.`);
assert(faqState.title.opacity === "1" && faqState.title.display !== "none" && faqState.title.height > 0, "FAQ title is not visibly rendered.");
assert(faqState.columns.split(" ").length === 2, "FAQ is not using its two-column desktop index.");
assert(faqState.order.every((value, index, values) => index === 0 || value > values[index - 1]), "Runtime narrative order is incorrect.");
assert(faqOpenState.openPanels === 1 && faqOpenState.expanded === "true" && faqOpenState.sectionHeight <= faqState.available + 8, "FAQ accordion failed or no longer fits after opening an answer.");

const mobileSession = await open({ width: 390, height: 844 });
const mobile = mobileSession.page;
await show(mobile, ".work__layout", "mobile-work.png");
const mobileWorkState = await mobile.evaluate(() => ({
  ledeHeight: Math.round(document.querySelector(".work__lede").getBoundingClientRect().height),
  visibleNarratives: [...document.querySelectorAll(".work__narr-panel")].filter((panel) => getComputedStyle(panel).display !== "none").length,
}));
await show(mobile, "#about", "mobile-about.png");
await show(mobile, "#faq", "mobile-faq.png");
const mobileState = await mobile.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  aboutObjectFit: getComputedStyle(document.querySelector(".about__photo")).objectFit,
  faqHeight: Math.round(document.querySelector("#faq").getBoundingClientRect().height),
  faqTitleHeight: Math.round(document.querySelector("#faq-title").getBoundingClientRect().height),
  faqItems: document.querySelectorAll("#faq .faq__item").length,
}));
report.mobile = { work: mobileWorkState, ...mobileState, requestFailures: mobileSession.requestFailures };
assert(mobileWorkState.ledeHeight <= 500 && mobileWorkState.visibleNarratives === 1, "Mobile Case Studies intro is oversized or shows multiple summaries.");
assert(mobileState.overflow <= 1, "Mobile sections introduce horizontal overflow.");
assert(mobileState.aboutObjectFit === "contain", "Mobile About portrait is cropped.");
assert(mobileState.faqTitleHeight > 0 && mobileState.faqItems === 6, "Mobile FAQ title or questions are missing.");

await Promise.all([desktop.close(), mobile.close()]);
await browser.close();
await writeFile(resolve(output, "results.json"), JSON.stringify({ report, failures }, null, 2));

if (failures.length) {
  console.error(JSON.stringify(report, null, 2));
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(report, null, 2));
}
