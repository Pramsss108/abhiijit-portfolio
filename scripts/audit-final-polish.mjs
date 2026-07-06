import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const base = process.env.PORTFOLIO_URL || "http://localhost:5055";
const mode = process.env.AUDIT_MODE || "baseline";
const output = resolve(import.meta.dirname, "..", "perf-reports", `final-polish-${mode}`);
await mkdir(output, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const selectors = [
  ["hero", ".hero"],
  ["proof", "#proof-numbers"],
  ["evidence", ".proof-evidence"],
  ["skills", "#services"],
  ["video", ".showreel"],
  ["work", "#work"],
  ["process", "#process"],
  ["about", "#about"],
  ["faq", "#faq"],
  ["contact", "#contact"],
  ["footer", ".site-footer"],
];

const browser = await puppeteer.launch({ headless: true });
const report = { mode, base, viewports: {}, reducedMotion: {}, noJavaScript: {} };

async function open(viewport, reducedMotion = false, javaScript = true) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.setJavaScriptEnabled(javaScript);
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  }
  if (javaScript) {
    await page.evaluateOnNewDocument(() => sessionStorage.setItem("ap_intro_seen_v1", "1"));
  }
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText || "";
    if (request.resourceType() !== "media" || !failure.includes("ERR_ABORTED")) {
      errors.push(`${request.url()} — ${failure}`);
    }
  });
  await page.goto(`${base}/v3/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  if (javaScript) await new Promise((done) => setTimeout(done, 500));
  return { page, errors };
}

async function auditViewport(viewport) {
  const { page, errors } = await open(viewport);
  const result = { errors, sections: {} };
  for (const [name, selector] of selectors) {
    const exists = await page.$(selector);
    if (!exists) continue;
    await page.$eval(selector, (node) => {
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
      window.scrollTo({ top: scrollY + node.getBoundingClientRect().top - header - 4, behavior: "instant" });
    });
    await new Promise((done) => setTimeout(done, 1100));
    result.sections[name] = await page.$eval(selector, (node) => {
      const rect = node.getBoundingClientRect();
      const reveals = [...node.querySelectorAll(".reveal,[data-split]")];
      const hidden = reveals.filter((item) => {
        const style = getComputedStyle(item);
        return Number(style.opacity) < 0.98 || style.visibility === "hidden";
      });
      return {
        box: {
          x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height),
        },
        revealCount: reveals.length,
        hiddenAfterSettle: hidden.map((item) => item.id || item.className || item.tagName).slice(0, 12),
        scrollOverflow: Math.max(0, Math.round(node.scrollWidth - node.clientWidth)),
        pageOverflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
      };
    });
    await page.screenshot({ path: resolve(output, `${viewport.name}-${name}.png`) });
  }

  result.faq = await page.evaluate(() => {
    const faq = document.querySelector("#faq");
    const list = faq?.querySelector(".faq__list");
    const head = faq?.querySelector(".section__head");
    return {
      sectionHeight: Math.round(faq?.getBoundingClientRect().height || 0),
      columns: list ? getComputedStyle(list).gridTemplateColumns : "",
      gap: list ? getComputedStyle(list).gap : "",
      headWidth: Math.round(head?.getBoundingClientRect().width || 0),
      itemCount: faq?.querySelectorAll(".faq__item").length || 0,
      openCount: faq?.querySelectorAll('.faq__trigger[aria-expanded="true"]').length || 0,
    };
  });
  if (await page.$("#faq .faq__trigger")) {
    await page.click("#faq .faq__trigger");
    await new Promise((done) => setTimeout(done, 500));
    result.faqAfterOpen = await page.evaluate(() => ({
      openCount: document.querySelectorAll('#faq .faq__trigger[aria-expanded="true"]').length,
      openPanelHeight: Math.round(document.querySelector("#faq .faq__panel[data-open]")?.getBoundingClientRect().height || 0),
      pageOverflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
    }));
    await page.screenshot({ path: resolve(output, `${viewport.name}-faq-open.png`) });
  }

  result.availability = await page.evaluate(() => {
    const dot = document.querySelector("#about .about__badge-dot");
    const badge = dot?.closest(".about__badge");
    if (!dot || !badge) return null;
    const style = getComputedStyle(dot);
    return {
      text: badge.textContent.replace(/\s+/g, " ").trim(),
      color: style.backgroundColor,
      shadow: style.boxShadow,
      animation: style.animationName,
    };
  });
  await page.close();
  return result;
}

for (const viewport of viewports) report.viewports[viewport.name] = await auditViewport(viewport);

for (const viewport of viewports) {
  const reduced = await open(viewport, true, true);
  report.reducedMotion[viewport.name] = await reduced.page.evaluate(() => ({
    hidden: [...document.querySelectorAll(".reveal,[data-split]")].filter((item) => {
      const style = getComputedStyle(item);
      return Number(style.opacity) < 0.98 || style.visibility === "hidden";
    }).length,
    overflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
  }));
  await reduced.page.close();

  const noJs = await open(viewport, false, false);
  report.noJavaScript[viewport.name] = await noJs.page.evaluate(() => ({
    hidden: [...document.querySelectorAll(".reveal,[data-split]")].filter((item) => {
      const style = getComputedStyle(item);
      return Number(style.opacity) < 0.98 || style.visibility === "hidden";
    }).length,
    overflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
  }));
  await noJs.page.close();
}

await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
