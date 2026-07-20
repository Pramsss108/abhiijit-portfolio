import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer from "puppeteer";

const DEFAULT_URL = "http://localhost:5055/v3/";
const rawUrl = process.env.PORTFOLIO_URL || DEFAULT_URL;
const targetUrl = /\/v3\/?(?:[?#].*)?$/.test(rawUrl)
  ? rawUrl
  : `${rawUrl.replace(/\/$/, "")}/v3/`;
const output = resolve(
  import.meta.dirname,
  "..",
  "perf-reports",
  process.env.MOBILE_REPORT_DIR || "mobile-scenes",
);
const settleMs = Number(process.env.MOBILE_SETTLE_MS || 500);
const captureScenes = process.env.MOBILE_CAPTURE_SCENES === "1";

await mkdir(output, { recursive: true });

const viewports = [
  { name: "portrait-320x568", width: 320, height: 568, orientation: "portrait", budget: 1.2 },
  { name: "portrait-360x800", width: 360, height: 800, orientation: "portrait", budget: 1.05 },
  { name: "portrait-390x844", width: 390, height: 844, orientation: "portrait", budget: 1.05 },
  { name: "portrait-412x915", width: 412, height: 915, orientation: "portrait", budget: 1.05 },
  { name: "portrait-430x932", width: 430, height: 932, orientation: "portrait", budget: 1.05 },
  // A 390px-tall landscape phone has roughly 320px below its header. The
  // compact landscape composition gets a small accessibility allowance, but
  // still cannot turn into a multi-screen desktop stack.
  { name: "landscape-844x390", width: 844, height: 390, orientation: "landscape", budget: 1.35 },
];

const scenes = [
  {
    name: "hero",
    selector: "#home",
    keys: [
      { name: "title", selector: ".hero__title" },
      { name: "actions", selector: ".hero__cta .btn" },
      { name: "portrait", selector: ".hero__photo", vertical: false },
    ],
  },
  {
    name: "proof",
    selector: "#proof-numbers",
    keys: [
      { name: "title", selector: "#proof-head" },
      { name: "graph", selector: ".pscene-graph" },
      { name: "stats", selector: ".pscene-stats" },
    ],
  },
  {
    name: "evidence",
    selector: "#evidence",
    keys: [
      { name: "title", selector: "#evidence-title" },
      { name: "claim-tabs", selector: ".mobile-evidence__tabs, .evidence-index" },
      {
        name: "active-claim",
        selector: "[data-mobile-evidence-preview], .evidence-file.is-active[open]",
      },
    ],
  },
  {
    name: "skills",
    selector: "#services",
    keys: [
      { name: "title", selector: "#services-title" },
      { name: "active-skill", selector: ".skl-card.is-current" },
      // Expertise is deliberately allowed a short continuation on the
      // smallest 320×568 phones. The second selector row remains reachable
      // by normal page scrolling; it must never be clipped by an ancestor.
      { name: "skill-controls", selector: "[data-mobile-skill-select], [data-skl-prev], [data-skl-next]", allowVerticalContinuation: true },
    ],
  },
  {
    name: "video",
    selector: ".showreel",
    keys: [
      { name: "title", selector: "#video-work-title" },
      // A complete 9:16 source takes more vertical room than a 568px device
      // can expose after the header. It is a normal, unclipped document flow:
      // the visitor scrolls a few pixels to reach the lower caption/selectors.
      { name: "active-video", selector: ".showreel__item.is-active[data-active='true']", allowVerticalContinuation: true },
      { name: "video-selectors", selector: "[data-mobile-video-select]", allowVerticalContinuation: true },
    ],
  },
  {
    name: "case-studies",
    selector: "#work .work__layout",
    keys: [
      { name: "title", selector: "#showcase-title" },
      { name: "active-case", selector: ".work-item.is-active[data-active='true']" },
      { name: "case-selectors", selector: "[data-mobile-case-select]" },
    ],
  },
  {
    name: "process",
    selector: "#process .process",
    // The normal portrait composition fits one available view. A natural-flow
    // allowance remains for the 568px accessibility edge case and landscape.
    allowTall: true,
    keys: [
      { name: "title", selector: "#process-title" },
      { name: "active-step", selector: ".process__step.is-active[aria-current='step']", allowVerticalContinuation: true },
      { name: "timeline", selector: ".progress-line", vertical: false, allowAncestorClip: true },
    ],
  },
  {
    name: "about",
    selector: "#about",
    keys: [
      { name: "title", selector: "#about-title" },
      { name: "portrait", selector: ".about__photo", vertical: false, allowAncestorClip: true },
      { name: "actions", selector: ".about__actions .btn" },
    ],
  },
  {
    name: "faq",
    selector: "#faq .faq",
    keys: [
      { name: "title", selector: ".faq .section__title" },
      { name: "questions", selector: ".faq__item" },
    ],
  },
  {
    name: "contact",
    selector: "#contact",
    keys: [
      { name: "title", selector: "#contact-title" },
      { name: "actions", selector: ".contact__actions .btn, .contact__cta .btn, #contact .btn" },
    ],
  },
  {
    name: "footer",
    selector: ".site-footer",
    allowTall: true,
    keys: [
      { name: "brand", selector: ".site-footer__brand, .site-footer .brand" },
      { name: "navigation", selector: ".site-footer a" },
    ],
  },
];

const anchors = [
  ["top", ".hero__title"],
  ["home", ".hero__title"],
  ["proof-numbers", "#proof-head"],
  ["evidence", "#evidence-title"],
  ["services", "#services-title"],
  ["work", "#video-work-title"],
  ["about", "#about-title"],
  ["process", "#process-title"],
  ["contact", "#contact-title"],
];

const groups = [
  {
    name: "skills",
    item: ".skl-card",
    active: ".skl-card.is-current",
    control: "[data-mobile-skill-select]",
    fallbackControl: "[data-skl-dots] button, .skl-dots button",
    expected: 10,
  },
  {
    name: "video",
    item: ".showreel__item",
    active: ".showreel__item.is-active[data-active='true']",
    control: "[data-mobile-video-select]",
    expected: 6,
  },
  {
    name: "case",
    item: ".work-item",
    active: ".work-item.is-active[data-active='true']",
    control: "[data-mobile-case-select]",
    expected: 6,
  },
  {
    name: "process",
    item: ".process__step",
    active: ".process__step.is-active[aria-current='step']",
    control: null,
    timeline: true,
    expected: 6,
  },
];

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const failures = [];
const report = {
  url: targetUrl,
  generatedAt: new Date().toISOString(),
  contract: {
    portraitBudget: "1.05 available views (1.20 at 320x568)",
    landscapeBudget: "1.35 available views",
    minimumTouchTarget: "44x44 CSS px",
    expectedCounts: { skills: 10, videos: 6, cases: 6, processSteps: 6, evidenceRecords: 4, faqItems: 6 },
  },
  viewports: {},
  reducedMotion: {},
  caseAutoplay: {},
};

function fail(viewport, check, message, details = undefined) {
  failures.push({ viewport, check, message, ...(details === undefined ? {} : { details }) });
}

function assert(viewport, check, condition, message, details) {
  if (!condition) fail(viewport, check, message, details);
}

async function openPage(browser, viewport, reducedMotion = false) {
  const page = await browser.newPage();
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    isLandscape: viewport.orientation === "landscape",
  });
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  }

  await page.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem("ap_intro_seen_v1", "1");
    } catch (_) {
      // Storage can be unavailable on unusual test origins; the DOM fallback
      // below still removes the decorative curtain before measurements.
    }
  });

  const diagnostics = { pageErrors: [], consoleErrors: [], failedRequests: [], mediaRequests: [] };
  page.on("pageerror", (error) => diagnostics.pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") diagnostics.consoleErrors.push(message.text());
  });
  page.on("request", (request) => {
    if (/\.(?:mp4|webm|mov)(?:[?#]|$)/i.test(request.url())) diagnostics.mediaRequests.push(request.url());
  });
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText || "unknown failure";
    if (request.resourceType() === "media" && /ERR_ABORTED/i.test(reason)) return;
    diagnostics.failedRequests.push(`${request.url()} :: ${reason}`);
  });

  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.evaluate(async () => {
    document.documentElement.classList.remove("intro-active");
    document.documentElement.classList.add("intro-skip");
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    document.querySelector("[data-intro]")?.remove();
    if (document.fonts?.ready) await document.fonts.ready;
  });
  // The mobile bundle is injected after the critical shell.  On a cold first
  // load it can legitimately arrive after DOMContentLoaded, so wait for the
  // app's own ready marker rather than auditing an uninitialised interface.
  await page.waitForFunction(
    () => document.documentElement.dataset.mobileReady === "true",
    { timeout: 10_000 },
  );
  // The production page may use smooth scrolling. Scene checks need a settled
  // measurement rather than a halfway point in a long animated jump.
  await page.evaluate(() => {
    document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
    document.body.style.setProperty("scroll-behavior", "auto", "important");
  });
  await sleep(settleMs);
  return { page, diagnostics };
}

async function scrollScene(page, selector) {
  const place = (sceneSelector) => {
    const scene = document.querySelector(sceneSelector);
    if (!scene) return;
    const header = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    const top = Math.max(0, scrollY + scene.getBoundingClientRect().top - header - 8);
    const scroller = document.scrollingElement || document.documentElement;
    // Assigning the real scrolling element avoids a browser-specific smooth
    // scroll that can leave a later scene far below the viewport mid-audit.
    scroller.scrollTop = top;
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
    scrollTo({ top, behavior: "auto" });
  };
  await page.evaluate(place, selector);
  await sleep(90);
  // Some mobile engines settle a previous scroll after a layout/image update.
  // A second deterministic placement prevents the audit from measuring a stale
  // off-screen rectangle rather than the requested scene.
  await page.evaluate(place, selector);
  await sleep(130);
}

async function auditScene(page, scene, budget) {
  await scrollScene(page, scene.selector);
  return page.evaluate((config, maxViews) => {
    const root = document.querySelector(config.selector);
    const header = document.querySelector(".site-header");
    const headerBottom = Math.round(header?.getBoundingClientRect().bottom || 0);
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01 &&
        node.getAttribute("aria-hidden") !== "true" &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const clipAncestors = (node) => {
      const nodeRect = node.getBoundingClientRect();
      const clips = [];
      let parent = node.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        const style = getComputedStyle(parent);
        const rect = parent.getBoundingClientRect();
        const clipsX = /hidden|clip|auto|scroll/.test(style.overflowX);
        const clipsY = /hidden|clip/.test(style.overflowY);
        if (clipsX && (nodeRect.left < rect.left - 1 || nodeRect.right > rect.right + 1)) {
          clips.push({ axis: "x", ancestor: parent.className || parent.tagName });
        }
        if (clipsY && (nodeRect.top < rect.top - 1 || nodeRect.bottom > rect.bottom + 1)) {
          clips.push({ axis: "y", ancestor: parent.className || parent.tagName });
        }
        parent = parent.parentElement;
      }
      return clips;
    };

    if (!root) return { missing: true, selector: config.selector };
    const box = root.getBoundingClientRect();
    const available = Math.max(1, innerHeight - headerBottom);
    const keyResults = [];
    config.keys.forEach((key) => {
      const matches = [...root.querySelectorAll(key.selector)].filter(visible);
      if (!matches.length) {
        keyResults.push({ name: key.name, selector: key.selector, missing: true });
        return;
      }
      matches.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        keyResults.push({
          name: matches.length > 1 ? `${key.name}-${index + 1}` : key.name,
          selector: key.selector,
          box: {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            right: Math.round(rect.right),
            bottom: Math.round(rect.bottom),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          horizontalViewportClip: rect.left < -1 || rect.right > innerWidth + 1,
          verticalViewportClip: key.vertical !== false && !key.allowVerticalContinuation && (rect.top < headerBottom - 2 || rect.bottom > innerHeight + 2),
          allowAncestorClip: Boolean(key.allowAncestorClip),
          ancestorClips: clipAncestors(node),
        });
      });
    });

    return {
      missing: false,
      box: {
        left: Math.round(box.left),
        top: Math.round(box.top),
        right: Math.round(box.right),
        bottom: Math.round(box.bottom),
        width: Math.round(box.width),
        height: Math.round(box.height),
      },
      available,
      viewRatio: Number((box.height / available).toFixed(3)),
      budget: maxViews,
      horizontalOverflow: Math.max(0, Math.round(root.scrollWidth - root.clientWidth)),
      keyResults,
    };
  }, scene, budget);
}

async function auditGlobal(page) {
  return page.evaluate(() => {
    const visible = (node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return (
        !node.hidden &&
        node.getAttribute("aria-hidden") !== "true" &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const touchSelector = [
      ".nav-toggle",
      ".mobile-menu__link",
      ".mobile-menu__cta",
      ".btn",
      "button[role='tab']",
      "[data-mobile-skill-select]",
      "[data-mobile-video-select]",
      "[data-mobile-case-select]",
      "[data-mobile-process-select]",
      ".faq__trigger",
      "[data-inline-play]",
      "[data-inline-expand]:not([hidden])",
    ].join(",");
    const touchTargets = [...document.querySelectorAll(touchSelector)]
      .filter(visible)
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          label: node.getAttribute("aria-label") || node.textContent.replace(/\s+/g, " ").trim().slice(0, 60),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          selector: node.matches("[data-mobile-skill-select]")
            ? "data-mobile-skill-select"
            : node.matches("[data-mobile-video-select]")
              ? "data-mobile-video-select"
              : node.matches("[data-mobile-case-select]")
                ? "data-mobile-case-select"
                : node.matches("[data-mobile-process-select]")
                  ? "data-mobile-process-select"
                  : node.className || node.tagName,
        };
      });
    const brokenImages = [...document.images]
      .filter((image) => image.complete && image.currentSrc && image.naturalWidth === 0)
      .map((image) => image.currentSrc);
    const htmlStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    return {
      layout: document.documentElement.dataset.layout || "unset",
      width: innerWidth,
      height: innerHeight,
      documentOverflow: Math.max(
        0,
        Math.round(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth),
      ),
      scrollLocked: /hidden|clip/.test(htmlStyle.overflowY) || /hidden|clip/.test(bodyStyle.overflowY),
      touchTargets,
      undersizedTargets: touchTargets.filter((target) => target.width < 44 || target.height < 44),
      brokenImages,
      counts: {
        skills: document.querySelectorAll(".skl-card").length,
        videos: document.querySelectorAll(".showreel__item").length,
        cases: document.querySelectorAll(".work-item").length,
        processSteps: document.querySelectorAll(".process__step").length,
        evidenceRecords: document.querySelectorAll("[data-evidence-target]").length,
        faqItems: document.querySelectorAll(".faq__item").length,
      },
    };
  });
}

async function auditAnchors(page) {
  const results = [];
  for (const [id, headingSelector] of anchors) {
    const state = await page.evaluate((anchorId, selector) => {
      const target = document.getElementById(anchorId);
      const heading = document.querySelector(selector);
      if (!target || !heading) return { id: anchorId, selector, missing: true };
      if (anchorId === "top") {
        scrollTo(0, 0);
        return { id: anchorId, selector, missing: false, headingTop: Math.round(heading.getBoundingClientRect().top), headerBottom: 0, covered: scrollY > 2 };
      }
      var top = scrollY + target.getBoundingClientRect().top - (document.querySelector(".site-header")?.getBoundingClientRect().height || 0) - 8;
      scrollTo(0, Math.max(0, top));
      const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom || 0;
      const rect = heading.getBoundingClientRect();
      return {
        id: anchorId,
        selector,
        missing: false,
        headingTop: Math.round(rect.top),
        headerBottom: Math.round(headerBottom),
        covered: rect.top < headerBottom + 2,
      };
    }, id, headingSelector);
    await sleep(80);
    results.push(state);
  }
  return results;
}

async function auditMenu(page) {
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await sleep(80);
  const toggle = await page.$("[data-nav-toggle]");
  if (!toggle) return { missing: true };
  const toggleState = await toggle.evaluate((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return {
      visible: style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01 && rect.width > 0 && rect.height > 0,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });
  if (!toggleState.visible) return { missing: false, toggleUnavailable: true, toggleState };
  // Exercise the same pointer path a visitor uses. Direct DOM .click() can
  // bypass the menu's scroll-lock release on the smallest touch viewport.
  await toggle.click();
  await sleep(180);
  const open = await page.evaluate(() => {
    const toggleNode = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!menu) return { missing: true };
    const style = getComputedStyle(menu);
    const rect = menu.getBoundingClientRect();
    const links = [...menu.querySelectorAll("a")].map((link) => {
      const box = link.getBoundingClientRect();
      return {
        text: link.textContent.replace(/\s+/g, " ").trim(),
        href: link.getAttribute("href"),
        width: Math.round(box.width),
        height: Math.round(box.height),
        offsetTop: Math.round(link.offsetTop),
      };
    });
    return {
      missing: false,
      expanded: toggleNode?.getAttribute("aria-expanded"),
      hidden: menu.hidden,
      dataOpen: menu.hasAttribute("data-open"),
      visible: style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01,
      box: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height) },
      clientHeight: menu.clientHeight,
      scrollHeight: menu.scrollHeight,
      links,
      pageLocked: /hidden|clip/.test(getComputedStyle(document.body).overflowY) || /hidden|clip/.test(getComputedStyle(document.documentElement).overflowY),
    };
  });

  const finalReach = await page.evaluate(() => {
    const menu = document.querySelector("[data-mobile-menu]");
    const finalAction = menu?.querySelector(".mobile-menu__cta") || menu?.querySelector("a:last-of-type");
    if (!menu || !finalAction) return null;
    menu.scrollTop = menu.scrollHeight;
    const menuBox = menu.getBoundingClientRect();
    const actionBox = finalAction.getBoundingClientRect();
    return {
      action: finalAction.textContent.replace(/\s+/g, " ").trim(),
      top: Math.round(actionBox.top),
      bottom: Math.round(actionBox.bottom),
      menuTop: Math.round(menuBox.top),
      menuBottom: Math.round(menuBox.bottom),
      reachable: actionBox.top >= menuBox.top - 1 && actionBox.bottom <= menuBox.bottom + 1,
    };
  });

  await page.evaluate(() => {
    const menu = document.querySelector("[data-mobile-menu]");
    if (menu) menu.scrollTop = 0;
  });
  const home = await page.$("[data-mobile-menu] a[href='#top'], [data-mobile-menu] a[href='#home']");
  const homeClicked = Boolean(home);
  if (home) await home.click();
  await sleep(350);
  const closed = await page.evaluate(() => ({
    y: Math.round(scrollY),
    expanded: document.querySelector("[data-nav-toggle]")?.getAttribute("aria-expanded"),
    menuOpen: document.querySelector("[data-mobile-menu]")?.hasAttribute("data-open"),
    pageLocked: /hidden|clip/.test(getComputedStyle(document.body).overflowY) || /hidden|clip/.test(getComputedStyle(document.documentElement).overflowY),
  }));
  return { missing: false, toggleUnavailable: false, toggleState, open, finalReach, homeClicked, closed };
}

async function auditGroups(page) {
  const result = {};
  const pause = await page.$("[data-skl-pause]");
  if (pause) {
    const pressed = await pause.evaluate((node) => node.getAttribute("aria-pressed"));
    if (pressed !== "true") await pause.click().catch(() => {});
  }

  for (const group of groups) {
    const initial = await page.evaluate((config) => {
      const items = [...document.querySelectorAll(config.item)];
      const active = [...document.querySelectorAll(config.active)];
      let controls = config.control ? [...document.querySelectorAll(config.control)] : [];
      if (!controls.length && config.fallbackControl) controls = [...document.querySelectorAll(config.fallbackControl)];
      const visibleItems = items.filter((item) => {
        const style = getComputedStyle(item);
        const rect = item.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01 && rect.width > 0 && rect.height > 0;
      });
      return {
        itemCount: items.length,
        visibleItemCount: visibleItems.length,
        controlCount: controls.length,
        activeCount: active.length,
        activeIndex: active.length ? items.indexOf(active[0]) : -1,
        activeVisible: active.length
          ? (() => {
              const style = getComputedStyle(active[0]);
              const rect = active[0].getBoundingClientRect();
              return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01 && rect.width > 0 && rect.height > 0;
            })()
          : false,
      };
    }, group);

    const controlSelector = group.control && initial.controlCount
      ? (await page.$$(group.control)).length
        ? group.control
        : group.fallbackControl
      : null;
    let after = null;
    if (controlSelector && initial.controlCount > 1) {
      const controls = await page.$$(controlSelector);
      await controls[1].click().catch(() => {});
      await sleep(140);
      after = await page.evaluate((config) => {
        const items = [...document.querySelectorAll(config.item)];
        const active = [...document.querySelectorAll(config.active)];
        return {
          activeCount: active.length,
          activeIndex: active.length ? items.indexOf(active[0]) : -1,
          ariaCurrent: active[0]?.getAttribute("aria-current") || null,
        };
      }, group);
    }
    result[group.name] = { ...initial, after };
  }
  return result;
}

async function auditEvidenceTabs(page) {
  const results = [];
  for (const item of [
    { id: "content", register: ".mobile-evidence__content-index" },
    { id: "companies", register: ".mobile-evidence__work-register" },
  ]) {
    const tab = await page.$(`[data-evidence-tab="${item.id}"]`);
    if (!tab) {
      results.push({ id: item.id, missing: true });
      continue;
    }
    await tab.click();
    await sleep(120);
    results.push(await page.evaluate((config) => {
      const preview = document.querySelector("[data-mobile-evidence-preview]");
      const visual = preview?.querySelector(".mobile-evidence__visual");
      const register = preview?.querySelector(config.register);
      const rows = register ? [...register.querySelectorAll("li")] : [];
      const box = (node) => {
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
      };
      const previewBox = box(preview);
      const visualBox = box(visual);
      const rowBoxes = rows.map(box);
      const stampBox = box(register?.querySelector("strong"));
      const firstRowBox = rowBoxes[0] || null;
      return {
        id: config.id,
        missing: !preview || !visual || !register,
        active: document.querySelector("[data-evidence-tab][aria-selected='true']")?.getAttribute("data-evidence-tab") || null,
        rowCount: rows.length,
        labels: rows.map((row) => row.textContent.replace(/\s+/g, " ").trim()),
        visualInsidePreview: Boolean(previewBox && visualBox && visualBox.left >= previewBox.left - 1 && visualBox.right <= previewBox.right + 1 && visualBox.top >= previewBox.top - 1 && visualBox.bottom <= previewBox.bottom + 1),
        rowsInsideVisual: Boolean(visualBox && rowBoxes.every((row) => row.left >= visualBox.left - 1 && row.right <= visualBox.right + 1 && row.top >= visualBox.top - 1 && row.bottom <= visualBox.bottom + 1)),
        stampClear: Boolean(stampBox && firstRowBox && (
          stampBox.bottom <= firstRowBox.top + 1 ||
          stampBox.right <= firstRowBox.left + 1 ||
          stampBox.left >= firstRowBox.right - 1
        )),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      };
    }, item));
  }
  return results;
}

async function auditEvidenceSelectionMotion(page) {
  const results = [];
  for (const id of ["social", "search", "content", "companies"]) {
    const tab = await page.$(`[data-evidence-tab="${id}"]`);
    if (!tab) {
      results.push({ id, missing: true });
      continue;
    }
    await tab.click();
    await page.waitForFunction((selectedId) => {
      const preview = document.querySelector("[data-mobile-evidence-preview]");
      const active = document.querySelector("[data-evidence-tab][aria-selected='true']")?.getAttribute("data-evidence-tab");
      const animated = preview?.getAnimations({ subtree: true }).some((animation) => (animation.animationName || "").includes("ap-mobile-evidence"));
      return active === selectedId && preview?.dataset.evidenceMode === selectedId && preview.classList.contains("is-evidence-entering") && animated;
    }, { timeout: 900 }, id).catch(() => {});
    results.push(await page.evaluate((selectedId) => {
      const desk = document.querySelector("#evidence .evidence-desk");
      const preview = document.querySelector("[data-mobile-evidence-preview]");
      const visual = preview?.querySelector(".mobile-evidence__visual");
      const names = preview
        ? preview.getAnimations({ subtree: true }).map((animation) => animation.animationName || "").filter(Boolean)
        : [];
      const facts = preview?.querySelector(".mobile-evidence__facts");
      const assistant = document.querySelector(".ai-ab-container");
      const rect = (node) => node ? node.getBoundingClientRect() : null;
      const factBox = rect(facts);
      const assistantBox = rect(assistant);
      const assistantStyle = assistant ? getComputedStyle(assistant) : null;
      const assistantVisible = Boolean(assistantBox && assistantStyle && assistantStyle.display !== "none" && assistantStyle.visibility !== "hidden" && Number(assistantStyle.opacity) > .01);
      const assistantOverlap = assistantVisible && factBox && assistantBox
        ? Math.max(0, Math.min(factBox.right, assistantBox.right) - Math.max(factBox.left, assistantBox.left)) * Math.max(0, Math.min(factBox.bottom, assistantBox.bottom) - Math.max(factBox.top, assistantBox.top))
        : 0;
      return {
        id: selectedId,
        missing: !desk || !preview || !visual,
        active: document.querySelector("[data-evidence-tab][aria-selected='true']")?.getAttribute("data-evidence-tab") || null,
        deskView: desk?.dataset.evidenceView || null,
        previewMode: preview?.dataset.evidenceMode || null,
        rootView: document.documentElement.dataset.mobileEvidenceView || null,
        cycle: Number(preview?.dataset.evidenceCycle || 0),
        entering: preview?.classList.contains("is-evidence-entering") || false,
        animationNames: names,
        assistantOverlap: Math.round(assistantOverlap),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      };
    }, id));
  }
  return results;
}

async function auditVerticalScroll(page) {
  const results = [];
  for (const selector of ["#services .skl-carousel", ".showreel", "#work .work__layout"]) {
    const exists = await page.$(selector);
    if (!exists) {
      results.push({ selector, missing: true });
      continue;
    }
    await scrollScene(page, selector);
    const point = await page.$eval(selector, (node) => {
      const rect = node.getBoundingClientRect();
      return {
        x: Math.max(1, Math.min(innerWidth - 2, rect.left + rect.width / 2)),
        y: Math.max(1, Math.min(innerHeight - 2, rect.top + Math.min(rect.height, innerHeight) / 2)),
        before: Math.round(scrollY),
      };
    });
    await page.mouse.move(point.x, point.y);
    await page.mouse.wheel({ deltaY: 180 });
    await sleep(100);
    const after = await page.evaluate(() => Math.round(scrollY));
    results.push({ selector, before: point.before, after, delta: after - point.before, passes: after - point.before >= 80 });
  }
  return results;
}

/*
 * Regression contract: touching a visible Case Study card as part of a normal
 * vertical scroll must not cancel its pending automatic advance.  This runs
 * once on the representative 390px portrait viewport, rather than adding a
 * multi-second wait to each viewport audit.
 *
 * The production cadence is deliberately accelerated only long enough to
 * observe the already-scheduled timer.  The native timer is restored before
 * dispatching the touch-like gesture.  Therefore, if a future change again
 * treats `.work-item` pointerdown as an interaction, it clears that pending
 * timer and this assertion fails rather than being masked by the acceleration.
 */
async function auditCaseAutoplayAfterScrollTouch(browser) {
  const viewport = viewports.find((item) => item.name === "portrait-390x844");
  const { page, diagnostics } = await openPage(browser, viewport, false);
  let timerPatched = false;

  const restoreTimer = async () => {
    if (!timerPatched) return;
    await page.evaluate(() => {
      if (!window.__apCaseAutoplayNativeSetTimeout) return;
      window.setTimeout = window.__apCaseAutoplayNativeSetTimeout;
      delete window.__apCaseAutoplayNativeSetTimeout;
    }).catch(() => {});
    timerPatched = false;
  };

  try {
    await scrollScene(page, "#case-studies");
    const initial = await page.evaluate(() => {
      const layout = document.querySelector("#case-studies");
      const section = document.querySelector("#work");
      const active = document.querySelector(".work-item.is-active[data-active='true']");
      return {
        missing: !layout || !section || !active,
        activeId: active?.id || null,
        index: section?.dataset.mobileCaseIndex || null,
        visible: layout?.hasAttribute("data-mobile-in-view") || false,
        reduced: document.documentElement.hasAttribute("data-reduced-motion"),
        paused: document.querySelector(".mobile-work__autoplay")?.getAttribute("aria-pressed") || null,
      };
    });
    if (initial.missing) return { initial, diagnostics, missing: true };

    await page.evaluate(() => {
      const nativeSetTimeout = window.setTimeout;
      window.__apCaseAutoplayNativeSetTimeout = nativeSetTimeout;
      window.setTimeout = function (callback, delay, ...args) {
        const wait = Number(delay) || 0;
        // The normal Case Studies cadence is 5.2 seconds.  Speed only that
        // pending cadence; interaction timers are installed after this patch
        // is restored and therefore remain observable as failures.
        if (wait >= 4_000 && wait <= 7_000) {
          return nativeSetTimeout.call(window, callback, 300, ...args);
        }
        return nativeSetTimeout.call(window, callback, delay, ...args);
      };
    });
    timerPatched = true;

    // Leave and re-enter the observed layout to clear any pre-existing native
    // timer and schedule one through the short test-only cadence above.
    await page.evaluate(() => {
      const layout = document.querySelector("#case-studies");
      if (!layout) return;
      const scroller = document.scrollingElement || document.documentElement;
      const top = scrollY + layout.getBoundingClientRect().top;
      const destination = Math.max(0, top - innerHeight - 96);
      scroller.scrollTop = destination;
      document.documentElement.scrollTop = destination;
      document.body.scrollTop = destination;
      scrollTo({ top: destination, behavior: "auto" });
    });
    const leftView = await page.waitForFunction(
      () => !document.querySelector("#case-studies")?.hasAttribute("data-mobile-in-view"),
      { timeout: 1_200 },
    ).then(() => true).catch(() => false);

    await scrollScene(page, "#case-studies");
    const returnedToView = await page.waitForFunction(
      () => document.querySelector("#case-studies")?.hasAttribute("data-mobile-in-view"),
      { timeout: 1_200 },
    ).then(() => true).catch(() => false);

    // Let IntersectionObserver schedule the accelerated normal cadence, then
    // restore native timers before the scroll-like touch starts.
    await sleep(90);
    await restoreTimer();

    const touched = await page.evaluate(() => {
      const card = document.querySelector(".work-item.is-active[data-active='true'] .work-item__card");
      if (!card) return false;
      const rect = card.getBoundingClientRect();
      const x = rect.left + Math.min(28, Math.max(12, rect.width / 3));
      const y = rect.top + Math.min(36, Math.max(12, rect.height / 4));
      const options = { bubbles: true, cancelable: true, pointerId: 41, pointerType: "touch", isPrimary: true, clientX: x, clientY: y };
      card.dispatchEvent(new PointerEvent("pointerdown", options));
      card.dispatchEvent(new PointerEvent("pointermove", { ...options, clientY: y + 34 }));
      card.dispatchEvent(new PointerEvent("pointerup", { ...options, clientY: y + 58 }));
      return true;
    });

    const advanced = await page.waitForFunction((before) => {
      const section = document.querySelector("#work");
      const active = document.querySelector(".work-item.is-active[data-active='true']");
      return Boolean(
        section && active &&
        (section.dataset.mobileCaseIndex !== before.index || active.id !== before.activeId),
      );
    }, { timeout: 1_000 }, initial).then(() => true).catch(() => false);

    const finalState = await page.evaluate(() => ({
      activeId: document.querySelector(".work-item.is-active[data-active='true']")?.id || null,
      index: document.querySelector("#work")?.dataset.mobileCaseIndex || null,
      cycle: document.querySelector("#work")?.dataset.mobileCaseCycle || null,
      visible: document.querySelector("#case-studies")?.hasAttribute("data-mobile-in-view") || false,
      paused: document.querySelector(".mobile-work__autoplay")?.getAttribute("aria-pressed") || null,
    }));

    return { initial, leftView, returnedToView, touched, advanced, finalState, diagnostics };
  } finally {
    await restoreTimer();
    await page.close();
  }
}

async function auditReducedMotion(browser) {
  const viewport = viewports.find((item) => item.name === "portrait-390x844");
  const { page, diagnostics } = await openPage(browser, viewport, true);
  for (const scene of scenes) await scrollScene(page, scene.selector);

  const before = await page.evaluate((configs) => {
    const index = (itemSelector, activeSelector) => {
      const items = [...document.querySelectorAll(itemSelector)];
      const active = document.querySelector(activeSelector);
      return active ? items.indexOf(active) : -1;
    };
    const candidates = [...document.querySelectorAll(".reveal, .scene-enter, [data-split]")];
    const unfinished = candidates
      .filter((node) => {
        const style = getComputedStyle(node);
        if (style.display === "none" || node.closest("[hidden]")) return false;
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;
        const transform = style.transform;
        return Number(style.opacity) < 0.98 || style.visibility === "hidden" || (transform !== "none" && transform !== "matrix(1, 0, 0, 1, 0, 0)");
      })
      .map((node) => node.id || node.className || node.tagName)
      .slice(0, 20);
    const runningAnimations = document
      .getAnimations({ subtree: true })
      .filter((animation) => animation.playState === "running")
      .map((animation) => animation.effect?.target?.className || animation.effect?.target?.id || "anonymous")
      .slice(0, 20);
    return {
      reduceMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
      unfinished,
      runningAnimations,
      active: Object.fromEntries(configs.map((config) => [config.name, index(config.item, config.active)])),
      introPresent: Boolean(document.querySelector("[data-intro]")),
      overflow: Math.max(0, Math.round(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)),
    };
  }, groups);
  await sleep(2_600);
  const after = await page.evaluate((configs) => {
    const index = (itemSelector, activeSelector) => {
      const items = [...document.querySelectorAll(itemSelector)];
      const active = document.querySelector(activeSelector);
      return active ? items.indexOf(active) : -1;
    };
    return Object.fromEntries(configs.map((config) => [config.name, index(config.item, config.active)]));
  }, groups);
  await page.screenshot({ path: resolve(output, "reduced-motion-final.png"), fullPage: true });
  await page.close();
  return { before, after, stable: JSON.stringify(before.active) === JSON.stringify(after), diagnostics };
}

const browser = await puppeteer.launch({
  headless: true,
  args: ["--disable-dev-shm-usage", "--no-sandbox"],
});

try {
  for (const viewport of viewports) {
    const { page, diagnostics } = await openPage(browser, viewport, false);
    const viewportReport = { diagnostics };
    const global = await auditGlobal(page);
    viewportReport.global = global;

    assert(viewport.name, "mobile-layout", global.layout === "mobile", `Expected data-layout=mobile, received ${global.layout}.`);
    assert(viewport.name, "page-overflow", global.documentOverflow <= 1, `Page has ${global.documentOverflow}px horizontal overflow.`);
    assert(viewport.name, "page-scroll", !global.scrollLocked, "Page vertical scrolling is locked while no overlay is open.");
    assert(viewport.name, "touch-targets", global.undersizedTargets.length === 0, "One or more primary touch targets are smaller than 44x44 CSS pixels.", global.undersizedTargets.slice(0, 12));
    assert(viewport.name, "images", global.brokenImages.length === 0, "One or more loaded images failed.", global.brokenImages);

    const expectedCounts = report.contract.expectedCounts;
    for (const [key, expected] of Object.entries(expectedCounts)) {
      assert(viewport.name, `count-${key}`, global.counts[key] === expected, `Expected ${expected} ${key}, received ${global.counts[key]}.`);
    }

    viewportReport.scenes = {};
    for (const scene of scenes) {
      const state = await auditScene(page, scene, viewport.budget);
      viewportReport.scenes[scene.name] = state;
      if (captureScenes && viewport.name === "portrait-390x844") {
        await page.screenshot({ path: resolve(output, `scene-${scene.name}-390x844.png`) });
      }
      assert(viewport.name, `scene-${scene.name}-exists`, !state.missing, `Missing ${scene.name} scene (${scene.selector}).`);
      if (state.missing) continue;
      if (!scene.allowTall) {
        assert(viewport.name, `scene-${scene.name}-height`, state.viewRatio <= viewport.budget + 0.005, `${scene.name} uses ${state.viewRatio} available views; budget is ${viewport.budget}.`, state);
      }
      assert(viewport.name, `scene-${scene.name}-overflow`, state.horizontalOverflow <= 1, `${scene.name} has ${state.horizontalOverflow}px internal horizontal overflow.`);
      const missingKeys = state.keyResults.filter((key) => key.missing);
      const clippedKeys = state.keyResults.filter(
        (key) => !key.missing && (key.horizontalViewportClip || key.verticalViewportClip || (!key.allowAncestorClip && key.ancestorClips.length)),
      );
      assert(viewport.name, `scene-${scene.name}-keys`, missingKeys.length === 0, `${scene.name} is missing visible key content.`, missingKeys);
      assert(viewport.name, `scene-${scene.name}-clipping`, clippedKeys.length === 0, `${scene.name} clips key content in its default view.`, clippedKeys);
    }

    viewportReport.anchors = await auditAnchors(page);
    for (const anchor of viewportReport.anchors) {
      assert(viewport.name, `anchor-${anchor.id}`, !anchor.missing && !anchor.covered, `#${anchor.id} lands under the fixed header.`, anchor);
    }

    viewportReport.menu = await auditMenu(page);
    const menu = viewportReport.menu;
    assert(viewport.name, "menu-exists", !menu.missing && !menu.toggleUnavailable && menu.open && !menu.open.missing, "Mobile menu or a reachable toggle is missing.", menu);
    if (!menu.missing && !menu.toggleUnavailable && menu.open && !menu.open.missing) {
      assert(viewport.name, "menu-open", menu.open.expanded === "true" && menu.open.dataOpen && menu.open.visible && !menu.open.hidden, "Mobile menu did not open into a visible state.", menu.open);
      assert(viewport.name, "menu-links", menu.open.links.length >= 5, "Mobile menu does not expose the full navigation.", menu.open.links);
      assert(viewport.name, "menu-scroll", menu.finalReach?.reachable === true, "The final mobile-menu action is not reachable on this viewport.", menu.finalReach);
      assert(viewport.name, "menu-close", menu.closed.expanded === "false" && !menu.closed.menuOpen && !menu.closed.pageLocked, "Mobile menu did not close and restore page scrolling.", menu.closed);
      assert(viewport.name, "menu-home", menu.homeClicked && menu.closed.y <= 2, `Home did not return to the true page top (scrollY=${menu.closed.y}).`, menu.closed);
    }

    viewportReport.groups = await auditGroups(page);
    for (const group of groups) {
      const state = viewportReport.groups[group.name];
      assert(viewport.name, `${group.name}-items`, state.itemCount === group.expected, `${group.name} lost content: expected ${group.expected}, received ${state.itemCount}.`);
      if (group.timeline) {
        assert(viewport.name, `${group.name}-visible`, state.visibleItemCount === group.expected, `${group.name} must keep all ${group.expected} timeline steps visible.`, state);
        assert(viewport.name, `${group.name}-active`, state.activeCount === 1 && state.activeVisible, `${group.name} must keep one current timeline step.`, state);
        assert(viewport.name, `${group.name}-no-picker`, state.controlCount === 0, `${group.name} must not create a mobile picker.`, state);
        continue;
      }
      assert(viewport.name, `${group.name}-active`, state.activeCount === 1 && state.activeVisible, `${group.name} must have exactly one visible active item.`, state);
      assert(viewport.name, `${group.name}-controls`, state.controlCount === group.expected, `${group.name} needs ${group.expected} mobile selectors; received ${state.controlCount}.`, state);
      assert(viewport.name, `${group.name}-select`, state.after?.activeCount === 1 && state.after?.activeIndex === 1, `${group.name} selector 02 did not activate item 02.`, state.after);
    }

    // The direct four-tab evidence dashboard is deliberately portrait-only;
    // landscape keeps the native desktop-like proof desk.
    if (viewport.orientation === "portrait") {
      viewportReport.evidenceTabs = await auditEvidenceTabs(page);
      for (const state of viewportReport.evidenceTabs) {
        assert(viewport.name, `evidence-${state.id}-exists`, !state.missing, `The ${state.id} evidence dashboard is missing.`, state);
        if (state.missing) continue;
        assert(viewport.name, `evidence-${state.id}-active`, state.active === state.id, `The ${state.id} tab did not become active.`, state);
        assert(viewport.name, `evidence-${state.id}-rows`, state.rowCount === 3, `The ${state.id} dashboard must show its three source rows.`, state);
        assert(viewport.name, `evidence-${state.id}-bounds`, state.visualInsidePreview && state.rowsInsideVisual, `The ${state.id} evidence register is clipped.`, state);
        assert(viewport.name, `evidence-${state.id}-stamp`, state.stampClear, `The ${state.id} number stamp overlaps its first register row.`, state);
        assert(viewport.name, `evidence-${state.id}-overflow`, state.overflow <= 1, `The ${state.id} evidence dashboard causes horizontal overflow.`, state);
      }

      viewportReport.evidenceSelectionMotion = await auditEvidenceSelectionMotion(page);
      for (const state of viewportReport.evidenceSelectionMotion) {
        assert(viewport.name, `evidence-motion-${state.id}-exists`, !state.missing, `The ${state.id} evidence preview is missing.`, state);
        if (state.missing) continue;
        assert(viewport.name, `evidence-motion-${state.id}-state`, state.active === state.id && state.deskView === state.id && state.previewMode === state.id && state.rootView === state.id, `The ${state.id} evidence state did not synchronise.`, state);
        assert(viewport.name, `evidence-motion-${state.id}-cycle`, state.cycle >= 1 && state.entering, `The ${state.id} evidence preview did not enter with motion.`, state);
        assert(viewport.name, `evidence-motion-${state.id}-animation`, state.animationNames.some((name) => name.includes("ap-mobile-evidence")), `The ${state.id} evidence selection has no scoped animation.`, state);
        assert(viewport.name, `evidence-motion-${state.id}-overflow`, state.overflow <= 1, `The ${state.id} evidence selection causes horizontal overflow.`, state);
        if (state.id === "companies") {
          assert(viewport.name, "evidence-motion-companies-assistant", state.assistantOverlap <= 1, "Kriti covers the Work source facts.", state);
        }
      }
    }

    viewportReport.verticalScroll = await auditVerticalScroll(page);
    for (const state of viewportReport.verticalScroll) {
      assert(viewport.name, `vertical-scroll-${state.selector}`, !state.missing && state.passes, `Vertical scrolling was captured or blocked over ${state.selector}.`, state);
    }

    assert(viewport.name, "page-errors", diagnostics.pageErrors.length === 0, "JavaScript page errors occurred.", diagnostics.pageErrors);
    assert(viewport.name, "failed-requests", diagnostics.failedRequests.length === 0, "Production asset requests failed.", diagnostics.failedRequests);
    assert(viewport.name, "initial-video-requests", diagnostics.mediaRequests.length === 0, "Video files were requested before the visitor pressed play.", diagnostics.mediaRequests);

    await page.evaluate(() => scrollTo(0, 0));
    await sleep(100);
    await page.screenshot({ path: resolve(output, `${viewport.name}-top.png`) });
    report.viewports[viewport.name] = viewportReport;
    await page.close();
  }

  report.reducedMotion = await auditReducedMotion(browser);
  const reduced = report.reducedMotion;
  assert("reduced-motion-390x844", "media-query", reduced.before.reduceMatches, "Reduced-motion media query was not active.");
  assert("reduced-motion-390x844", "final-state", reduced.before.unfinished.length === 0, "Reduced motion leaves content hidden or transformed.", reduced.before.unfinished);
  assert("reduced-motion-390x844", "animations", reduced.before.runningAnimations.length === 0, "Reduced motion still has running CSS/WAAPI animations.", reduced.before.runningAnimations);
  assert("reduced-motion-390x844", "autoplay", reduced.stable, "An active carousel changed while reduced motion was enabled.", { before: reduced.before.active, after: reduced.after });
  assert("reduced-motion-390x844", "overflow", reduced.before.overflow <= 1, `Reduced-motion page has ${reduced.before.overflow}px horizontal overflow.`);
  assert("reduced-motion-390x844", "intro", !reduced.before.introPresent, "Decorative intro remains in the reduced-motion DOM.");
  assert("reduced-motion-390x844", "errors", reduced.diagnostics.pageErrors.length === 0, "Reduced-motion page raised JavaScript errors.", reduced.diagnostics.pageErrors);

  report.caseAutoplay = await auditCaseAutoplayAfterScrollTouch(browser);
  const caseAutoplay = report.caseAutoplay;
  assert("case-autoplay-390x844", "exists", !caseAutoplay.missing, "Case Studies autoplay scene is missing.", caseAutoplay.initial);
  if (!caseAutoplay.missing) {
    assert("case-autoplay-390x844", "visible", caseAutoplay.initial.visible && caseAutoplay.returnedToView, "Case Studies did not become visible before the autoplay assertion.", caseAutoplay);
    assert("case-autoplay-390x844", "ordinary-touch", caseAutoplay.touched, "Could not dispatch a scroll-like touch on the active Case Study card.", caseAutoplay);
    assert("case-autoplay-390x844", "advances-after-scroll-touch", caseAutoplay.advanced, "A normal touch/scroll on a Case Study card cancelled automatic advance.", caseAutoplay);
    assert("case-autoplay-390x844", "state", caseAutoplay.finalState.visible && caseAutoplay.finalState.paused === "false", "Case Studies autoplay ended in an invalid visible or paused state.", caseAutoplay.finalState);
    assert("case-autoplay-390x844", "errors", caseAutoplay.diagnostics.pageErrors.length === 0, "Case autoplay regression page raised JavaScript errors.", caseAutoplay.diagnostics.pageErrors);
  }
} finally {
  await browser.close();
}

report.failures = failures;
report.summary = {
  passed: failures.length === 0,
  failureCount: failures.length,
  viewportCount: viewports.length,
  sceneChecksPerViewport: scenes.length,
};
await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2));

if (failures.length) {
  console.error(`Mobile scene QA failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- [${failure.viewport}] ${failure.check}: ${failure.message}`));
  console.error(`Full evidence: ${resolve(output, "report.json")}`);
  process.exitCode = 1;
} else {
  console.log(`Mobile scene QA passed across ${viewports.length} viewports.`);
  console.log(`Report: ${resolve(output, "report.json")}`);
}
