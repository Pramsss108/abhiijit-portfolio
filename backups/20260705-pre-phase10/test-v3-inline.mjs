import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const base = process.env.PORTFOLIO_URL || "http://localhost:5055";
const output = resolve(import.meta.dirname, "..", "perf-reports", "phase-017");
await mkdir(output, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const failures = [];
const reports = {};
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function openPage(viewport, reducedMotion = false) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.evaluateOnNewDocument(() => sessionStorage.setItem("ap_intro_seen_v1", "1"));
  page.on("pageerror", (error) => failures.push(`Page error at ${viewport.width}px: ${error.message}`));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText || "";
    const harmlessMediaAbort = request.resourceType() === "media" && failure.includes("ERR_ABORTED");
    if (new URL(request.url()).hostname === "localhost" && !harmlessMediaAbort) failures.push(`Local request failed: ${request.url()}`);
  });
  await page.goto(`${base}/v3/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.querySelector(".showreel")?.scrollIntoView({ block: "start" });
  });
  await new Promise((done) => setTimeout(done, 1000));
  return page;
}

async function inspect(viewport, name) {
  const page = await openPage(viewport);
  const state = await page.evaluate(() => {
    const wall = document.querySelector(".showreel");
    const reels = [...document.querySelectorAll(".showreel__item--portrait")];
    const wides = [...document.querySelectorAll(".showreel__item--wide")];
    const videos = [...document.querySelectorAll("[data-inline-video]")];
    const css = getComputedStyle(document.documentElement);
    return {
      wallHeight: Math.round(wall?.getBoundingClientRect().height || 0),
      reels: reels.length,
      wides: wides.length,
      videos: videos.length,
      unloaded: videos.filter((video) => !video.getAttribute("src")).length,
      loadedPosters: videos.filter((video) => video.getAttribute("poster")).length,
      firstRowTops: reels.map((item) => Math.round(item.getBoundingClientRect().top)),
      wideTops: wides.map((item) => Math.round(item.getBoundingClientRect().top)),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      modal: !!document.querySelector("[data-media-player],.media-player"),
      sectionPhoto: document.querySelector(".showreel__portrait img")?.getAttribute("src"),
      scrollLocked: css.overflow === "hidden" || document.body.style.overflow === "hidden",
      title: document.querySelector("#video-work-title")?.textContent.trim(),
      intro: document.querySelector(".showreel__intro")?.textContent.trim(),
      cue: document.querySelector(".showreel__cue")?.textContent.replace(/\s+/g, " ").trim(),
      workCredit: document.querySelector(".showreel__credit")?.textContent.replace(/\s+/g, " ").trim(),
      wallBackground: getComputedStyle(wall).backgroundImage,
      headBackground: getComputedStyle(document.querySelector(".showreel__head")).backgroundImage,
      portraitBacklight: getComputedStyle(document.querySelector(".showreel__portrait"), "::before").backgroundImage,
      revealed: [...document.querySelectorAll(".showreel__item.is-ready")].length,
      wideContentVisibility: wides.map((item) => getComputedStyle(item).contentVisibility),
    };
  });
  const wall = await page.$(".showreel");
  if (wall) await wall.screenshot({ path: resolve(output, `${name}.png`) });
  reports[name] = state;
  assert(state.reels === 4 && state.wides === 2 && state.videos === 6, `${name}: expected four reels and two wide videos.`);
  assert(state.unloaded === 6, `${name}: videos should remain unloaded until tapped.`);
  assert(state.loadedPosters === state.revealed, `${name}: posters should load only for cards near the viewport.`);
  assert(state.overflow <= 1, `${name}: horizontal overflow is ${state.overflow}px.`);
  assert(!state.modal && state.sectionPhoto?.includes("abhijit-video-portrait.webp") && !state.scrollLocked, `${name}: identity portrait is missing, or obsolete modal/scroll lock remains.`);
  assert(state.title?.includes("300+") && state.intro?.includes("trend-led audio") && state.cue?.includes("6 selected edits"), `${name}: title, video-marketing description, or viewing cue is missing.`);
  assert(state.workCredit?.includes("MadQuick") && state.wallBackground === "none" && state.headBackground === "none", `${name}: work credit is missing or a section background was introduced.`);
  assert(state.portraitBacklight?.includes("radial-gradient"), `${name}: portrait-only backlight is missing.`);
  const hasNearViewportCard = state.firstRowTops.some((top) => top > -100 && top < viewport.height * .95);
  assert((!hasNearViewportCard || state.revealed >= 1) && state.wideContentVisibility.every((value) => value === "auto"), `${name}: progressive reveal or off-screen rendering optimization is missing.`);
  if (viewport.width > 820) {
    assert(new Set(state.firstRowTops).size === 1, `${name}: four portrait videos are not in one row.`);
  } else {
    assert(new Set(state.firstRowTops).size === 2, `${name}: mobile portrait videos should form a readable 2x2 grid.`);
  }
  assert(state.wideTops[1] > state.wideTops[0], `${name}: wide videos are not stacked.`);
  return page;
}

const desktop = await inspect({ width: 1440, height: 1000 }, "video-desktop");
await desktop.hover('[data-inline-media]:nth-child(3) [data-inline-play]');
const hoverState = await desktop.evaluate(() => {
  const item = document.querySelector('[data-inline-media]:nth-child(3)');
  return {
    overlay: getComputedStyle(item.querySelector('[data-inline-play]')).backgroundColor,
    overlayTransform: getComputedStyle(item.querySelector('[data-inline-play]')).transform,
    frameTransform: getComputedStyle(item.querySelector('.showreel__frame')).transform,
  };
});
assert(hoverState.overlay === "rgba(0, 0, 0, 0)" && hoverState.overlayTransform === "none" && hoverState.frameTransform === "none", "Desktop: hover regression introduced an overlay fill or transform.");
reports.hoverState = hoverState;
await desktop.mouse.move(2, 2);
await desktop.evaluate(() => {
  const video = document.querySelector("[data-inline-video]");
  video.requestFullscreen = () => { video.dataset.fullscreenTest = "passed"; return Promise.resolve(); };
});
await desktop.click('[data-inline-media]:nth-child(1) [data-inline-play]');
await desktop.waitForFunction(() => document.querySelector('[data-inline-media]:nth-child(1)')?.dataset.state === "playing", { timeout: 5000 });
const firstPlayback = await desktop.evaluate(() => {
  const first = document.querySelector('[data-inline-media]:nth-child(1)');
  const play = first.querySelector("[data-inline-play]");
  return {
    src: first.querySelector("video")?.getAttribute("src"),
    controls: first.querySelector("video")?.controls,
    expandVisible: !first.querySelector("[data-inline-expand]")?.hidden,
    active: document.querySelectorAll('[data-inline-media][data-state="playing"]').length,
    state: first.dataset.state,
    playLabel: play?.getAttribute("aria-label"),
    playTarget: Math.round(play?.getBoundingClientRect().width || 0),
    locked: document.documentElement.classList.contains("media-player-open"),
  };
});
assert(firstPlayback.src?.includes("reel-01.mp4") && firstPlayback.controls && firstPlayback.expandVisible && firstPlayback.playLabel?.startsWith("Pause") && firstPlayback.playTarget >= 44, "Desktop: first inline video or its persistent pause control did not activate correctly.");
assert(firstPlayback.active === 1 && !firstPlayback.locked, "Desktop: inline playback activated more than one video or locked page scrolling.");
const showreelDesktop = await desktop.$(".showreel");
if (showreelDesktop) await showreelDesktop.screenshot({ path: resolve(output, "player-playing-desktop.png") });

await desktop.click('[data-inline-media]:nth-child(1) [data-inline-play]');
await desktop.waitForFunction(() => document.querySelector('[data-inline-media]:nth-child(1)')?.dataset.state === "paused", { timeout: 3000 });
const pausedByControl = await desktop.evaluate(() => {
  const first = document.querySelector('[data-inline-media]:nth-child(1)');
  return {
    paused: first.querySelector("video")?.paused,
    state: first.dataset.state,
    label: first.querySelector("[data-inline-play]")?.getAttribute("aria-label"),
  };
});
assert(pausedByControl.paused && pausedByControl.state === "paused" && pausedByControl.label?.startsWith("Resume"), "Desktop: persistent control did not pause or expose Resume.");
if (showreelDesktop) await showreelDesktop.screenshot({ path: resolve(output, "player-paused-desktop.png") });

await desktop.click('[data-inline-media]:nth-child(1) [data-inline-play]');
await desktop.waitForFunction(() => document.querySelector('[data-inline-media]:nth-child(1)')?.dataset.state === "playing", { timeout: 5000 });
const resumedAt = await desktop.$eval('[data-inline-media]:nth-child(1) video', (video) => video.currentTime);
assert(resumedAt >= 0, "Desktop: paused video did not resume.");
await desktop.click('[data-inline-media]:nth-child(1) [data-inline-expand]');
assert(await desktop.$eval('[data-inline-media]:nth-child(1) video', (video) => video.dataset.fullscreenTest === "passed"), "Desktop: maximize control is not connected.");
await desktop.click('[data-inline-media]:nth-child(2) [data-inline-play]');
await desktop.waitForFunction(() => document.querySelector('[data-inline-media]:nth-child(2)')?.dataset.state === "playing", { timeout: 5000 });
const exclusivePlayback = await desktop.evaluate(() => ({
  active: [...document.querySelectorAll('[data-inline-media][data-state="playing"]')].map((item) => item.getAttribute("data-media-title")),
  firstPaused: document.querySelector('[data-inline-media]:nth-child(1) video')?.paused,
  firstState: document.querySelector('[data-inline-media]:nth-child(1)')?.dataset.state,
  secondSrc: document.querySelector('[data-inline-media]:nth-child(2) video')?.getAttribute("src"),
  scrollLocked: getComputedStyle(document.documentElement).overflow === "hidden",
}));
assert(exclusivePlayback.active.length === 1 && exclusivePlayback.active[0] === "Social Reel Transformation", "Desktop: playback is not exclusive.");
assert(exclusivePlayback.firstPaused && exclusivePlayback.firstState === "idle" && exclusivePlayback.secondSrc?.includes("reel-02.mp4") && !exclusivePlayback.scrollLocked, "Desktop: switching videos failed or locked scrolling.");
await desktop.$eval('[data-inline-media]:nth-child(2) video', (video) => video.pause());
await new Promise((done) => setTimeout(done, 300));
const pausedState = await desktop.evaluate(() => ({
  paused: document.querySelector('[data-inline-media]:nth-child(2) video')?.paused,
  state: document.querySelector('[data-inline-media]:nth-child(2)')?.dataset.state,
  label: document.querySelector('[data-inline-media]:nth-child(2) [data-inline-play]')?.getAttribute("aria-label"),
}));
assert(pausedState.paused && pausedState.state === "paused" && pausedState.label?.startsWith("Resume"), "Desktop: manual pause state is not communicated.");
reports.inlinePlayback = { firstPlayback, pausedByControl, exclusivePlayback, pausedState };

const tablet = await inspect({ width: 768, height: 1024 }, "video-tablet");
const mobile = await inspect({ width: 390, height: 844 }, "video-mobile");
const small = await inspect({ width: 320, height: 568 }, "video-small-mobile");
await mobile.$eval('[data-inline-media]:nth-child(5) [data-inline-play]', (button) => button.click());
await mobile.waitForFunction(() => document.querySelector('[data-inline-media]:nth-child(5)')?.dataset.state === "playing", { timeout: 5000 });
const mobilePlayback = await mobile.evaluate(() => ({
  src: document.querySelector('[data-inline-media]:nth-child(5) video')?.getAttribute("src"),
  active: document.querySelectorAll('[data-inline-media][data-state="playing"]').length,
  state: document.querySelector('[data-inline-media]:nth-child(5)')?.dataset.state,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  expandTarget: Math.round(document.querySelector('[data-inline-media]:nth-child(5) [data-inline-expand]')?.getBoundingClientRect().width || 0),
  pauseTarget: Math.round(document.querySelector('[data-inline-media]:nth-child(5) [data-inline-play]')?.getBoundingClientRect().width || 0),
}));
assert(mobilePlayback.src?.includes("landscape-01.mp4") && mobilePlayback.active === 1, "Mobile: tapped wide video did not play inline.");
assert(mobilePlayback.overflow <= 1 && mobilePlayback.expandTarget >= 44 && mobilePlayback.pauseTarget >= 44, "Mobile: overflow or player touch-target failure.");
reports.mobilePlayback = mobilePlayback;

const reduced = await openPage({ width: 1440, height: 1000 }, true);
const reducedState = await reduced.evaluate(() => ({
  itemOpacity: getComputedStyle(document.querySelector(".showreel__item")).opacity,
  itemTransform: getComputedStyle(document.querySelector(".showreel__item")).transform,
  spinnerAnimation: getComputedStyle(document.querySelector(".showreel__play")).animationName,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
assert(reducedState.itemOpacity === "1" && reducedState.itemTransform === "none" && reducedState.spinnerAnimation === "none" && reducedState.overflow <= 1, "Reduced-motion media behavior failed.");
reports.reducedMotion = reducedState;

const schema = await desktop.evaluate(() => {
  const data = [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => {
    try { return JSON.parse(node.textContent); } catch { return null; }
  }).filter(Boolean);
  const list = data.find((entry) => entry["@type"] === "ItemList" && /video editing/i.test(entry.name || ""));
  return {
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    count: list?.itemListElement?.length || 0,
    names: list?.itemListElement?.map((entry) => entry.item?.name) || [],
  };
});
assert(schema.canonical === "https://abhijit.works/" && schema.count === 6, "Canonical URL or six VideoObject records are missing.");
assert(schema.names[0] === "Creator Before & After" && schema.names[3] === "Podcast Reel Breakdown", "Video structured data does not match the visible fresh clips.");
reports.schema = schema;

await Promise.all([desktop.close(), tablet.close(), mobile.close(), small.close(), reduced.close()]);
await browser.close();

if (failures.length) {
  console.error(JSON.stringify(reports, null, 2));
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(reports, null, 2));
}
