import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const base = process.env.PORTFOLIO_URL || "http://localhost:5055";
const output = resolve(import.meta.dirname, "..", "perf-reports", "final-polish-responsive");
await mkdir(output, { recursive: true });

const viewports = [
  ["mobile-320", 320, 568], ["mobile-360", 360, 800], ["mobile-375", 375, 812],
  ["mobile-390", 390, 844], ["mobile-412", 412, 915], ["mobile-430", 430, 932],
  ["landscape-844", 844, 390], ["landscape-932", 932, 430],
  ["tablet-768", 768, 1024], ["tablet-landscape", 1024, 768],
  ["desktop-1280", 1280, 720], ["desktop-1440", 1440, 900], ["desktop-1920", 1920, 1080],
];
const sections = ["#home", "#proof-numbers", ".proof-evidence", "#services", ".showreel", "#work", "#process", "#about", "#faq", "#contact", ".site-footer"];
const containmentSelectors = [
  ".site-header .brand", ".site-header .nav", ".site-header .header__cta", ".nav-toggle",
  ".hero__copy", ".hero__visual", ".proof-scene__inner", ".evidence-desk", ".skl-carousel",
  ".showreel__head", ".showreel__grid", "#work .work__layout", "#process .process",
  "#about .about__frame", "#about .about__badge", "#about .about__actions",
  "#faq .section__head", "#faq .faq__item", "#contact .contact__panel", ".site-footer__inner", ".site-footer__bar",
];

const browser = await puppeteer.launch({ headless: true });
const failures = [];
const report = {};
const assert = (condition, message) => { if (!condition) failures.push(message); };

for (const [name, width, height] of viewports) {
  const page = await browser.newPage();
  await page.bringToFront();
  await page.setViewport({ width, height });
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("ap_intro_seen_v1", "1"));
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`${base}/v3/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise((done) => setTimeout(done, 500));

  const state = await page.evaluate((sectionSelectors, checks) => {
    const visible = (node) => {
      const style = getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .01;
    };
    const clipped = [];
    checks.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node, index) => {
        if (!visible(node)) return;
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1)) {
          clipped.push({ selector, index, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) });
        }
      });
    });
    const sectionBoxes = {};
    sectionSelectors.forEach((selector) => {
      const node = document.querySelector(selector);
      if (!node) return;
      const rect = node.getBoundingClientRect();
      sectionBoxes[selector] = { width: Math.round(rect.width), height: Math.round(rect.height), scrollOverflow: Math.max(0, Math.round(node.scrollWidth - node.clientWidth)) };
    });
    const smallTargets = [...document.querySelectorAll("#faq .faq__trigger, .nav-toggle, [data-inline-play], [data-inline-expand]")]
      .filter(visible)
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return { label: node.getAttribute("aria-label") || node.textContent.trim().slice(0, 40), width: Math.round(rect.width), height: Math.round(rect.height) };
      })
      .filter((target) => target.width < 44 || target.height < 44);
    const imagesFailed = [...document.images].filter((img) => img.complete && !img.naturalWidth).map((img) => img.currentSrc || img.src);
    return {
      viewport: [innerWidth, innerHeight],
      documentOverflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
      clipped,
      smallTargets,
      imagesFailed,
      sectionBoxes,
      faqHeight: Math.round(document.querySelector("#faq")?.getBoundingClientRect().height || 0),
      faqItems: document.querySelectorAll("#faq .faq__item").length,
      aboutFit: getComputedStyle(document.querySelector("#about .about__photo")).objectFit,
      workCases: document.querySelectorAll("#work .work-item").length,
      skillCards: document.querySelectorAll("#services .skl-card").length,
      videos: document.querySelectorAll(".showreel__item").length,
    };
  }, sections, containmentSelectors);

  report[name] = { ...state, pageErrors };
  assert(state.documentOverflow <= 1, `${name}: document overflow ${state.documentOverflow}px.`);
  assert(state.clipped.length === 0, `${name}: clipped elements ${JSON.stringify(state.clipped.slice(0, 5))}.`);
  assert(state.smallTargets.length === 0, `${name}: undersized targets ${JSON.stringify(state.smallTargets.slice(0, 5))}.`);
  assert(state.imagesFailed.length === 0, `${name}: failed images ${state.imagesFailed.join(", ")}.`);
  assert(state.aboutFit === "contain", `${name}: About portrait is not contained.`);
  assert(state.faqItems === 6 && state.workCases === 6 && state.skillCards === 10 && state.videos === 6, `${name}: content count regression.`);
  assert(pageErrors.length === 0, `${name}: page errors ${pageErrors.join(" | ")}.`);

  if (["mobile-320", "mobile-390", "landscape-844", "desktop-1440"].includes(name)) {
    for (const [shotName, selector] of [["faq", "#faq"], ["about", "#about"], ["video", ".showreel"]]) {
      await page.$eval(selector, (node) => node.scrollIntoView({ block: "start", behavior: "instant" }));
      await new Promise((done) => setTimeout(done, 900));
      await page.screenshot({ path: resolve(output, `${name}-${shotName}.png`) });
    }
  }
  await page.close();
}

await writeFile(resolve(output, "report.json"), JSON.stringify({ report, failures }, null, 2));
await browser.close();
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(report, null, 2));
}
