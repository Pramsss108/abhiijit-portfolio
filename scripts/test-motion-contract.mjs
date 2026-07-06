import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const base = process.env.PORTFOLIO_URL || "http://localhost:5055";
const output = resolve(import.meta.dirname, "..", "perf-reports", "final-polish-motion");
await mkdir(output, { recursive: true });

const targets = [
  ["video-head", ".showreel__head"],
  ["skills-title", "#services .skl-welcome .section__title"],
  ["video-card", ".showreel__item"],
  ["case-card", "#work .work-item"],
  ["process-step", "#process .process__step"],
  ["about-copy", "#about .about__copy"],
  ["faq-head", "#faq .section__head"],
  ["faq-item", "#faq .faq__item"],
  ["contact-panel", "#contact .contact__panel"],
  ["footer-brand", ".site-footer__brand"],
].filter(([name]) => !process.env.MOTION_TARGET || name === process.env.MOTION_TARGET);
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const browser = await puppeteer.launch({ headless: true });
for (const page of await browser.pages()) await page.close();
const failures = [];
const report = {};

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function open(viewport, reduced = false) {
  const page = await browser.newPage();
  await page.bringToFront();
  await page.setViewport(viewport);
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("ap_intro_seen_v1", "1"));
  await page.goto(`${base}/v3/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise((done) => setTimeout(done, 350));
  return page;
}

async function sampleTarget(viewport, name, selector) {
  const page = await open(viewport);
  const exists = await page.$(selector);
  if (!exists) {
    failures.push(`${viewport.name}/${name}: selector missing.`);
    await page.close();
    return null;
  }
  await page.$eval(selector, (node) => {
    const anchor = node.closest("#services") || node;
    const y = scrollY + anchor.getBoundingClientRect().top;
    window.scrollTo({ top: Math.max(0, y - innerHeight - 80), behavior: "instant" });
  });
  await new Promise((done) => setTimeout(done, 80));
  const initial = await page.$eval(selector, (node) => {
    const style = getComputedStyle(node);
    return { opacity: Number(style.opacity), transform: style.transform, className: node.className };
  });
  await page.$eval(selector, (node) => {
    const header = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    const anchor = node.closest("#services") || node;
    const y = scrollY + anchor.getBoundingClientRect().top;
    window.scrollTo({ top: Math.max(0, y - header - innerHeight * .24), behavior: "instant" });
  });
  await new Promise((done) => setTimeout(done, 120));
  await page.$eval(selector, (node) => {
    const rect = node.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) node.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await new Promise((done) => setTimeout(done, 90));
  const entering = await page.$eval(selector, (node) => {
    const style = getComputedStyle(node);
    return { opacity: Number(style.opacity), transform: style.transform, className: node.className };
  });
  await new Promise((done) => setTimeout(done, 1600));
  const settled = await page.$eval(selector, (node) => {
    const style = getComputedStyle(node);
    return {
      opacity: Number(style.opacity),
      transform: style.transform,
      className: node.className,
      inlineStyle: node.getAttribute("style") || "",
      animationName: style.animationName,
      animationTimeline: style.animationTimeline || "",
      transitionProperty: style.transitionProperty,
      animations: node.getAnimations().map((animation) => ({
        playState: animation.playState,
        currentTime: String(animation.currentTime),
        timeline: animation.timeline?.constructor?.name || "",
      })),
      top: Math.round(node.getBoundingClientRect().top),
      bottom: Math.round(node.getBoundingClientRect().bottom),
      overflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
    };
  });
  await page.close();
  assert(settled.opacity >= .98, `${viewport.name}/${name}: final opacity is ${settled.opacity}.`);
  const matrixValues = settled.transform.startsWith("matrix(")
    ? settled.transform.slice(7, -1).split(",").map(Number)
    : [];
  const transformSettled = settled.transform === "none" || (
    matrixValues.length === 6 &&
    Math.abs(matrixValues[0] - 1) < .002 && Math.abs(matrixValues[3] - 1) < .002 &&
    Math.abs(matrixValues[4]) < 1 && Math.abs(matrixValues[5]) < 1
  );
  assert(transformSettled, `${viewport.name}/${name}: final transform did not settle (${settled.transform}).`);
  assert(settled.overflow <= 1, `${viewport.name}/${name}: ${settled.overflow}px horizontal overflow.`);
  const hasMotionClass = /reveal|scene-enter/.test(initial.className);
  assert(!hasMotionClass || initial.opacity < .98 || initial.transform !== "none", `${viewport.name}/${name}: expected entrance state was never armed.`);
  return { initial, entering, settled };
}

// Warm one page so headless Chromium's first background document does not
// suppress compositor timelines and create a false failure for target 01.
const warmup = await open(viewports[0]);
await warmup.close();

for (const viewport of viewports) {
  report[viewport.name] = {};
  for (const [name, selector] of targets) {
    report[viewport.name][name] = await sampleTarget(viewport, name, selector);
  }
  const reduced = await open(viewport, true);
  const reducedState = await reduced.evaluate(() => ({
    hidden: [...document.querySelectorAll(".reveal,.scene-enter,[data-split]")].filter((node) => Number(getComputedStyle(node).opacity) < .98).length,
    overflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
  }));
  await reduced.close();
  report[viewport.name].reduced = reducedState;
  assert(reducedState.hidden === 0, `${viewport.name}: reduced-motion leaves ${reducedState.hidden} elements hidden.`);
  assert(reducedState.overflow <= 1, `${viewport.name}: reduced-motion causes overflow.`);
}

await writeFile(resolve(output, "report.json"), JSON.stringify({ report, failures }, null, 2));
await browser.close();

if (failures.length) {
  console.error(JSON.stringify(report, null, 2));
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(report, null, 2));
}
