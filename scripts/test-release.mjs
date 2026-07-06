import puppeteer from "puppeteer";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const base = process.env.RELEASE_URL || "http://localhost:5056";
const root = resolve(import.meta.dirname, "..", "release");
const manifest = JSON.parse(await readFile(resolve(root, "release-manifest.json"), "utf8"));
const failures = [];
const browser = await puppeteer.launch({ headless: true });

if (manifest.assets.some(({ file }) => /(^|\/)(_proof|madquick-ref|_archive|private|backup)(\/|$)/i.test(file))) {
  failures.push("Release contains a banned private/reference path.");
}

for (const path of ["/", "/privacy.html", "/404.html"]) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => errors.push(`${request.url()} — ${request.failure()?.errorText}`));
  const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle0", timeout: 30000 });
  const state = await page.evaluate(() => ({
    title: document.title,
    overflow: Math.max(0, Math.round(document.documentElement.scrollWidth - innerWidth)),
    failedImages: [...document.images].filter((image) => image.complete && !image.naturalWidth).map((image) => image.src),
    canonical: document.querySelector('link[rel="canonical"]')?.href || "",
  }));
  if (!response?.ok()) failures.push(`${path}: HTTP ${response?.status()}.`);
  if (errors.length) failures.push(`${path}: ${errors.join(" | ")}`);
  if (state.overflow > 1) failures.push(`${path}: ${state.overflow}px horizontal overflow.`);
  if (state.failedImages.length) failures.push(`${path}: failed images ${state.failedImages.join(", ")}.`);
  if (path === "/" && state.canonical !== "https://abhiijit.works/") failures.push("Homepage canonical is incorrect.");
  if (path === "/privacy.html" && state.canonical !== "https://abhiijit.works/privacy.html") failures.push("Privacy canonical is incorrect.");
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, files: manifest.files, bytes: manifest.bytes, base }, null, 2));
}
