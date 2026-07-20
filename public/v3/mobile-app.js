/* ========================================================================== *
 * Abhijit Pramanik portfolio — compact interaction layer
 *
 * This file intentionally does not import or start the desktop motion engine.
 * It upgrades the shared semantic HTML only when the compact layout is active.
 * Normal vertical scrolling always wins; no pinned scenes or wheel capture.
 * ========================================================================== */
(function () {
  "use strict";

  var win = window;
  var doc = document;
  var root = doc.documentElement;
  var compactQuery = "(max-width: 820px), (max-width: 1024px) and (hover: none) and (pointer: coarse)";
  var compactMedia = win.matchMedia ? win.matchMedia(compactQuery) : null;

  if (root.dataset.layout !== "mobile" && !(compactMedia && compactMedia.matches)) return;

  var reduceMedia = win.matchMedia ? win.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reducedMotion = !!(reduceMedia && reduceMedia.matches);
  var supportsInert = "inert" in doc.createElement("div");
  var overlayLocks = Object.create(null);
  var savedBodyStyle = null;
  var savedScrollY = 0;
  var menuController = null;
  var sheetController = null;
  var skillsController = null;
  var videoController = null;
  var caseController = null;
  var scrollSceneController = null;

  root.classList.add("mobile-js");
  root.toggleAttribute("data-reduced-motion", reducedMotion);

  function one(selector, context) {
    return (context || doc).querySelector(selector);
  }

  function all(selector, context) {
    return Array.prototype.slice.call((context || doc).querySelectorAll(selector));
  }

  function padNumber(value) {
    return String(value + 1).padStart(2, "0");
  }

  function nextFrame(callback) {
    win.requestAnimationFrame(function () {
      win.requestAnimationFrame(callback);
    });
  }

  function setInert(element, value) {
    if (!element || !supportsInert) return;
    element.inert = !!value;
  }

  function makeStatus(owner, className) {
    var status = doc.createElement("p");
    status.className = "sr-only " + className;
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    owner.appendChild(status);
    return status;
  }

  function focusableInside(container) {
    if (!container) return [];
    return all(
      "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), " +
      "textarea:not([disabled]), details > summary, [tabindex]:not([tabindex='-1'])",
      container
    ).filter(function (element) {
      return !element.hidden && element.getAttribute("aria-hidden") !== "true";
    });
  }

  function trapFocus(event, container, close) {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== "Tab") return;

    var focusable = focusableInside(container);
    if (!focusable.length) {
      event.preventDefault();
      container.focus();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function syncPageLock() {
    var locked = Object.keys(overlayLocks).some(function (key) { return overlayLocks[key]; });
    if (locked && !savedBodyStyle) {
      savedScrollY = win.scrollY || win.pageYOffset || 0;
      savedBodyStyle = {
        position: doc.body.style.position,
        inset: doc.body.style.inset,
        top: doc.body.style.top,
        width: doc.body.style.width,
        overflow: doc.body.style.overflow
      };
      doc.body.style.position = "fixed";
      doc.body.style.inset = "0";
      doc.body.style.top = -savedScrollY + "px";
      doc.body.style.width = "100%";
      doc.body.style.overflow = "hidden";
      root.classList.add("mobile-overlay-open");
      return;
    }

    if (!locked && savedBodyStyle) {
      doc.body.style.position = savedBodyStyle.position;
      doc.body.style.inset = savedBodyStyle.inset;
      doc.body.style.top = savedBodyStyle.top;
      doc.body.style.width = savedBodyStyle.width;
      doc.body.style.overflow = savedBodyStyle.overflow;
      savedBodyStyle = null;
      root.classList.remove("mobile-overlay-open");
      win.scrollTo(0, savedScrollY);
    }
  }

  function lockPage(owner, value) {
    overlayLocks[owner] = !!value;
    syncPageLock();
    if (skillsController) skillsController.syncAutoplay();
    if (caseController) caseController.syncAutoplay();
  }

  function anyOverlayOpen() {
    return Object.keys(overlayLocks).some(function (key) { return overlayLocks[key]; });
  }

  function normalizeNarrativeOrder() {
    var panel = one(".content-panel");

    var companyTrack = one("[data-company-ribbon-track]");
    var companySet = companyTrack ? one(".company-ribbon__set", companyTrack) : null;
    if (companyTrack && companySet && companyTrack.children.length === 1) {
      var duplicateSet = companySet.cloneNode(true);
      duplicateSet.setAttribute("aria-hidden", "true");
      companyTrack.appendChild(duplicateSet);
      companyTrack.classList.add("is-ready");
    }

    var process = one("#process");
    var about = one("#about");
    var contact = one("#contact");
    if (panel && process && about) panel.insertBefore(process, about);

    /* The desktop divider belongs visually above Skills. On a phone the
       proof artboard is deliberately clipped to one view, so leaving this
       marquee inside it hides the divider behind the logo rail. Move only
       the existing divider into the normal mobile narrative flow:
       Proof -> Evidence -> divider -> Skills. Desktop never enters this
       branch and keeps its approved source order and styling. */
    var services = one("#services");
    var skillsDivider = one("#proof-numbers > .marquees");
    if (root.hasAttribute("data-mobile-portrait") && panel && services && skillsDivider) {
      skillsDivider.classList.add("mobile-skills-divider");
      // The divider belongs to the Expertise anchor on phones. Keeping it as
      // a sibling means an Expertise link scrolls past it, which is why the
      // first gold lane appeared to be missing in the compact preview.
      services.insertBefore(skillsDivider, services.firstChild);
    }

    var faq = process ? one(".faq", process) : null;
    if (panel && faq && contact && !one("#faq")) {
      var faqHeading = one("h2", faq);
      if (faqHeading) faqHeading.id = "faq-title";
      var faqSection = doc.createElement("section");
      var faqContainer = doc.createElement("div");
      faqSection.id = "faq";
      faqSection.className = "section section--tint faq-section";
      faqSection.setAttribute("aria-labelledby", "faq-title");
      faqContainer.className = "container";
      faqContainer.appendChild(faq);
      faqSection.appendChild(faqContainer);
      panel.insertBefore(faqSection, contact);
    }
  }

  /* ----------------------------------------------------------------------
     One-screen Proof artboard
     ----------------------------------------------------------------------
     Desktop owns its own animated chart. Compact layouts get a small canvas
     renderer that paints only when this proof scene is on screen, keeping the
     page light while still showing the real story behind the numbers.
  */
  function initProofScene() {
    var section = one("#proof-numbers");
    if (!section) return;

    var chart = one("#chart-search", section);
    var chartWrap = one(".pscene-graph-wrap", section);
    var ribbon = one(".company-ribbon", section);
    var hasDrawn = false;
    var resizeTimer = 0;

    function drawChart(progress) {
      if (!chart || !chartWrap) return;
      var bounds = chartWrap.getBoundingClientRect();
      var width = Math.max(1, Math.round(bounds.width));
      var height = Math.max(1, Math.round(bounds.height));
      var pixelRatio = Math.min(win.devicePixelRatio || 1, 2);
      var context = chart.getContext("2d");
      if (!context || width < 2 || height < 2) return;

      var targetWidth = Math.round(width * pixelRatio);
      var targetHeight = Math.round(height * pixelRatio);
      if (chart.width !== targetWidth || chart.height !== targetHeight) {
        chart.width = targetWidth;
        chart.height = targetHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      var compact = height < 70;
      var left = compact ? 4 : 29;
      var right = compact ? 3 : 29;
      var top = compact ? 4 : 8;
      var bottom = compact ? 9 : 17;
      var plotWidth = Math.max(1, width - left - right);
      var plotHeight = Math.max(1, height - top - bottom);
      var clicks = [8.48, 9.36, 8.66, 11.34, 10.18, 15.52, 18.40];
      var impressions = [192, 210, 188, 263, 243, 342, 412];
      var steps = clicks.length - 1;
      var amount = Math.max(0, Math.min(1, progress));

      function xAt(index) { return left + (plotWidth * index / steps); }
      function yAt(value, maximum) { return top + plotHeight * (1 - value / maximum); }
      function pathTo(series, maximum) {
        var journey = amount * steps;
        var fullSteps = Math.floor(journey);
        context.beginPath();
        context.moveTo(xAt(0), yAt(series[0], maximum));
        for (var index = 1; index <= Math.min(fullSteps, steps); index += 1) {
          context.lineTo(xAt(index), yAt(series[index], maximum));
        }
        if (fullSteps < steps) {
          var rest = journey - fullSteps;
          var current = series[fullSteps];
          var following = series[fullSteps + 1];
          context.lineTo(
            xAt(fullSteps) + (xAt(fullSteps + 1) - xAt(fullSteps)) * rest,
            yAt(current + (following - current) * rest, maximum)
          );
        }
      }

      context.lineWidth = 1;
      context.strokeStyle = "rgba(241, 231, 204, .12)";
      for (var row = 0; row < 4; row += 1) {
        var y = top + (plotHeight * row / 3);
        context.beginPath();
        context.moveTo(left, y + .5);
        context.lineTo(width - right, y + .5);
        context.stroke();
      }

      if (!compact) {
        context.font = "600 9px ui-sans-serif, system-ui, sans-serif";
        context.textBaseline = "middle";
        context.fillStyle = "#43de92";
        ["20K", "10K", "5K", "0K"].forEach(function (label, index) {
          context.fillText(label, 0, top + (plotHeight * index / 3));
        });
        context.fillStyle = "#f1c75b";
        context.textAlign = "right";
        ["600K", "400K", "200K", "0K"].forEach(function (label, index) {
          context.fillText(label, width, top + (plotHeight * index / 3));
        });
        context.textAlign = "start";
      }

      var greenFill = context.createLinearGradient(0, top, 0, top + plotHeight);
      greenFill.addColorStop(0, "rgba(73, 221, 145, .24)");
      greenFill.addColorStop(1, "rgba(73, 221, 145, 0)");
      pathTo(clicks, 20);
      context.lineTo(left + plotWidth * amount, top + plotHeight);
      context.lineTo(left, top + plotHeight);
      context.closePath();
      context.fillStyle = greenFill;
      context.fill();

      pathTo(impressions, 600);
      context.strokeStyle = "#f2c75b";
      context.lineWidth = compact ? 1.6 : 2.1;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.stroke();

      pathTo(clicks, 20);
      context.strokeStyle = "#43de92";
      context.lineWidth = compact ? 1.8 : 2.4;
      context.stroke();

      var completed = Math.floor(amount * steps + .0001);
      for (var dot = 0; dot <= completed; dot += 1) {
        var clickX = xAt(dot);
        var clickY = yAt(clicks[dot], 20);
        var viewY = yAt(impressions[dot], 600);
        context.fillStyle = "#06080c";
        context.beginPath();
        context.arc(clickX, clickY, compact ? 2 : 2.8, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#43de92";
        context.lineWidth = 1.35;
        context.stroke();
        context.fillStyle = "#06080c";
        context.beginPath();
        context.arc(clickX, viewY, compact ? 1.8 : 2.4, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#f2c75b";
        context.lineWidth = 1.1;
        context.stroke();
      }

      if (amount > .96 && !compact) {
        context.fillStyle = "#43de92";
        context.beginPath();
        context.arc(xAt(steps), yAt(clicks[steps], 20), 4.6, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#f2c75b";
        context.beginPath();
        context.arc(xAt(steps), yAt(impressions[steps], 600), 4.3, 0, Math.PI * 2);
        context.fill();
      }
    }

    function animateChart() {
      if (!chart || hasDrawn) return;
      hasDrawn = true;
      if (reducedMotion) {
        drawChart(1);
        return;
      }
      var start = 0;
      var duration = 920;
      function step(now) {
        if (!start) start = now;
        var raw = Math.min(1, (now - start) / duration);
        drawChart(1 - Math.pow(1 - raw, 3));
        if (raw < 1) win.requestAnimationFrame(step);
      }
      win.requestAnimationFrame(step);
    }

    function redraw() {
      win.clearTimeout(resizeTimer);
      resizeTimer = win.setTimeout(function () { drawChart(hasDrawn ? 1 : 0); }, 80);
    }

    function setProofActive(active) {
      if (ribbon) ribbon.classList.toggle("is-motion-visible", active && !reducedMotion);
      root.toggleAttribute("data-mobile-proof-active", active);
      if (active) animateChart();
    }

    /* IntersectionObserver is the low-cost path. The scroll check is a small
       reliability fallback for the scaled desktop phone-preview iframe, whose
       transform can delay intersection delivery in some Chromium builds. */
    function syncProofState() {
      var rect = section.getBoundingClientRect();
      var headerHeight = one(".site-header")?.getBoundingClientRect().height || 0;
      /* Leave the proof state a deliberate breathing room beneath the fixed
         header.  The prior 8px threshold let Proof remain "active" while the
         Evidence Desk was already visible, which also kept the assistant
         dock hidden one section too long in the phone preview. */
      var active = rect.bottom > headerHeight + 16 && rect.top < win.innerHeight - 8;
      setProofActive(active);
    }

    if ("IntersectionObserver" in win) {
      var observer = new IntersectionObserver(function () {
        /* Use the exact same geometry as the scroll fallback. This keeps the
           scene, chart and Kriti in sync in the scaled local-phone preview. */
        syncProofState();
      }, { threshold: [0, .01, .12, .45] });
      observer.observe(section);
    } else {
      syncProofState();
    }

    win.addEventListener("scroll", syncProofState, { passive: true });
    win.addEventListener("resize", syncProofState, { passive: true });
    nextFrame(syncProofState);
    win.setTimeout(syncProofState, 220);

    if ("ResizeObserver" in win && chartWrap) {
      var resizeObserver = new ResizeObserver(redraw);
      resizeObserver.observe(chartWrap);
    } else {
      win.addEventListener("resize", redraw, { passive: true });
    }
  }

  function initMenu() {
    var toggle = one("[data-nav-toggle]");
    var menu = one("[data-mobile-menu]");
    if (!toggle || !menu) return null;

    var closeTimer = 0;
    var lastFocus = null;
    var main = one("#main");
    var footer = one(".site-footer");

    menu.setAttribute("aria-hidden", "true");

    function setOpen(open, returnFocus) {
      win.clearTimeout(closeTimer);
      if (open) {
        if (sheetController && sheetController.isOpen()) sheetController.close(false);
        lastFocus = doc.activeElement;
        menu.hidden = false;
        menu.setAttribute("aria-hidden", "false");
        /* Keep the menu state synchronous with aria-expanded. The visual
           entrance can still settle on the next frame, but a quick tap or a
           slow device must never expose a visible menu without its open
           state being present. */
        menu.setAttribute("data-open", "true");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
        root.classList.add("mobile-menu-open");
        doc.body.classList.add("mobile-menu-open");
        setInert(main, true);
        setInert(footer, true);
        lockPage("menu", true);
        nextFrame(function () {
          var first = focusableInside(menu)[0];
          if (first) first.focus({ preventScroll: true });
        });
      } else {
        menu.removeAttribute("data-open");
        menu.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        root.classList.remove("mobile-menu-open");
        doc.body.classList.remove("mobile-menu-open");
        setInert(main, false);
        setInert(footer, false);
        lockPage("menu", false);
        closeTimer = win.setTimeout(function () { menu.hidden = true; }, reducedMotion ? 0 : 240);
        if (returnFocus !== false && lastFocus && typeof lastFocus.focus === "function") {
          lastFocus.focus({ preventScroll: true });
        }
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true", true);
    });
    doc.addEventListener("keydown", function (event) {
      if (toggle.getAttribute("aria-expanded") === "true") {
        trapFocus(event, menu, function (returnFocus) { setOpen(false, returnFocus); });
      }
    }, true);
    all("a[href]", menu).forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false, false); });
    });

    return {
      close: function (returnFocus) { setOpen(false, returnFocus); },
      isOpen: function () { return toggle.getAttribute("aria-expanded") === "true"; }
    };
  }

  function initSheet() {
    var shell = doc.createElement("div");
    shell.className = "mobile-sheet";
    shell.hidden = true;
    shell.setAttribute("data-mobile-sheet", "");
    shell.innerHTML =
      '<div class="mobile-sheet__backdrop" data-mobile-sheet-close aria-hidden="true"></div>' +
      '<section class="mobile-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="mobile-sheet-title" tabindex="-1">' +
        '<header class="mobile-sheet__head"><div><span class="mobile-sheet__eyebrow">Selected detail</span>' +
        '<h2 id="mobile-sheet-title"></h2></div>' +
        '<button class="mobile-sheet__close" type="button" data-mobile-sheet-close aria-label="Close details">' +
        '<span aria-hidden="true">×</span></button></header>' +
        '<div class="mobile-sheet__body" data-mobile-sheet-body></div>' +
      '</section>';
    doc.body.appendChild(shell);

    var title = one("#mobile-sheet-title", shell);
    var body = one("[data-mobile-sheet-body]", shell);
    var panel = one(".mobile-sheet__panel", shell);
    var closeButton = one(".mobile-sheet__close", shell);
    var lastFocus = null;
    var closeTimer = 0;

    function cleanClone(node) {
      if (!node || !node.querySelectorAll) return node;
      all("[id]", node).forEach(function (item) { item.removeAttribute("id"); });
      all("[data-mobile-case-open], [data-mobile-evidence-open]", node).forEach(function (item) { item.remove(); });
      all("[data-tilt], [data-parallax]", node).forEach(function (item) {
        item.removeAttribute("data-tilt");
        item.removeAttribute("data-parallax");
      });
      return node;
    }

    function openSheet(label, content, modifier) {
      win.clearTimeout(closeTimer);
      if (menuController && menuController.isOpen()) menuController.close(false);
      if (videoController) videoController.pauseAll();
      lastFocus = doc.activeElement;
      title.textContent = label || "Details";
      body.replaceChildren(cleanClone(content));
      shell.className = "mobile-sheet" + (modifier ? " " + modifier : "");
      shell.hidden = false;
      root.classList.add("mobile-sheet-open");
      doc.body.classList.add("mobile-sheet-open");
      setInert(one("#main"), true);
      setInert(one(".site-footer"), true);
      lockPage("sheet", true);
      nextFrame(function () {
        shell.setAttribute("data-open", "true");
        closeButton.focus({ preventScroll: true });
      });
    }

    function closeSheet(returnFocus) {
      if (shell.hidden) return;
      shell.removeAttribute("data-open");
      root.classList.remove("mobile-sheet-open");
      doc.body.classList.remove("mobile-sheet-open");
      setInert(one("#main"), false);
      setInert(one(".site-footer"), false);
      lockPage("sheet", false);
      closeTimer = win.setTimeout(function () {
        shell.hidden = true;
        body.replaceChildren();
      }, reducedMotion ? 0 : 260);
      if (returnFocus !== false && lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus({ preventScroll: true });
      }
    }

    all("[data-mobile-sheet-close]", shell).forEach(function (button) {
      button.addEventListener("click", function () { closeSheet(true); });
    });
    shell.addEventListener("keydown", function (event) { trapFocus(event, panel, closeSheet); });

    return {
      open: openSheet,
      close: closeSheet,
      isOpen: function () { return !shell.hidden; }
    };
  }

  function initAnchors() {
    var header = one("[data-header]");

    function scrollToHash(hash, updateHistory) {
      if (!hash || hash === "#" || hash === "#top" || hash === "#home") {
        // Home is a destination, not a decorative scroll animation. This also
        // makes it reliable from a long mobile menu after a visitor has moved
        // through the full portfolio.
        win.scrollTo({ top: 0, behavior: "auto" });
        if (updateHistory && win.history && win.history.pushState) win.history.pushState(null, "", "#top");
        return;
      }

      var target = null;
      try { target = doc.querySelector(hash); } catch (error) { return; }
      if (!target) return;
      var headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 64;
      var top = target.getBoundingClientRect().top + (win.scrollY || 0) - headerHeight - 12;
      win.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
      if (updateHistory && win.history && win.history.pushState) win.history.pushState(null, "", hash);
    }

    doc.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a[href^='#']") : null;
      if (!link || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      event.preventDefault();
      if (menuController && menuController.isOpen()) menuController.close(false);
      win.setTimeout(function () { scrollToHash(hash, true); }, 0);
    });

    win.addEventListener("popstate", function () { scrollToHash(win.location.hash || "#top", false); });
    if (win.location.hash) win.setTimeout(function () { scrollToHash(win.location.hash, false); }, 80);
  }

  function initEvidence() {
    /* Landscape has its own compact desktop-like treatment. Do not hide its
       native selector unless the portrait Evidence Desk is actually active. */
    if (!root.hasAttribute("data-mobile-portrait")) return;
    var desk = one("[data-evidence-desk]");
    if (!desk) return;
    var buttons = all("[data-evidence-target]", desk);
    var panels = all("[data-evidence-panel]", desk);
    var files = one(".evidence-files", desk);
    var index = one(".evidence-index", desk);
    var section = desk.closest ? desk.closest("#evidence") : one("#evidence");
    if (!buttons.length || !panels.length || !files || !index) return;

    var active = "social";
    /* One direct selector per proof record. The previous filter-plus-record
       pattern made a visitor choose twice before anything changed. */
    var tabs = [
      { id: "social", label: "Meta" },
      { id: "search", label: "Search" },
      { id: "content", label: "Content" },
      { id: "companies", label: "Work" }
    ];
    var shortMedia = win.matchMedia ? win.matchMedia("(max-height: 699px)") : null;
    var preview = doc.createElement("article");
    var status = makeStatus(desk, "mobile-evidence__status");
    var tabBar = doc.createElement("div");
    var tabButtons = [];

    desk.classList.add("is-mobile-ready", "is-mobile-evidence");
    /* The original rows remain in the DOM as the source of each proof panel,
       but are not a second visual navigation system on a phone. */
    index.hidden = true;
    index.setAttribute("aria-hidden", "true");

    tabBar.className = "mobile-evidence__tabs";
    tabBar.setAttribute("role", "tablist");
    tabBar.setAttribute("aria-label", "Choose a proof dashboard");
    tabs.forEach(function (item) {
      var tab = doc.createElement("button");
      tab.type = "button";
      tab.className = "mobile-evidence__tab";
      tab.setAttribute("role", "tab");
      tab.id = "mobile-evidence-tab-" + item.id;
      tab.setAttribute("data-evidence-tab", item.id);
      tab.setAttribute("aria-controls", "mobile-evidence-dashboard");
      tab.setAttribute("aria-selected", item.id === active ? "true" : "false");
      tab.textContent = item.label;
      tabBar.appendChild(tab);
      tabButtons.push(tab);
    });
    desk.insertBefore(tabBar, index);

    buttons.forEach(function (button) {
      button.removeAttribute("role");
      button.removeAttribute("aria-controls");
      button.removeAttribute("aria-selected");
      button.removeAttribute("tabindex");
      button.setAttribute("data-mobile-evidence-card", "");
      button.setAttribute("aria-pressed", "false");
    });

    preview.className = "mobile-evidence__preview";
    preview.id = "mobile-evidence-dashboard";
    preview.setAttribute("data-mobile-evidence-preview", "");
    preview.setAttribute("aria-live", "polite");
    preview.setAttribute("role", "tabpanel");
    preview.setAttribute("tabindex", "0");
    preview.setAttribute("aria-haspopup", "dialog");
    files.appendChild(preview);

    function compactText(node) {
      return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
    }

    function addText(parent, tag, className, value) {
      var element = doc.createElement(tag);
      if (className) element.className = className;
      element.textContent = value;
      parent.appendChild(element);
      return element;
    }

    function buildSearchVisual(panel, visual) {
      var periods = all(".evidence-source-sheet > div", panel).slice(0, 2);
      var delta = one(".evidence-source-sheet > strong", panel);
      visual.classList.add("mobile-evidence__visual--search");
      visual.setAttribute("data-evidence-visual", "search");
      addText(visual, "p", "mobile-evidence__visual-label", compactText(one(".evidence-source-sheet > p", panel)) || "Search clicks compared");

      var comparison = doc.createElement("div");
      comparison.className = "mobile-evidence__comparison";
      periods.forEach(function (period, index) {
        var periodCard = doc.createElement("div");
        periodCard.className = "mobile-evidence__comparison-card" + (index === 1 ? " is-current" : "");
        periodCard.setAttribute("data-order", String(index + 1));
        addText(periodCard, "span", "mobile-evidence__comparison-label", compactText(one("span", period)) || (index ? "Latest period" : "Previous period"));
        var comparisonValue = addText(periodCard, "strong", "mobile-evidence__comparison-value", compactText(one("b", period)) || "—");
        comparisonValue.setAttribute("data-evidence-count", "");
        addText(periodCard, "small", "mobile-evidence__comparison-unit", compactText(one("small", period)) || "organic clicks");
        comparison.appendChild(periodCard);
      });
      visual.appendChild(comparison);

      var result = doc.createElement("div");
      result.className = "mobile-evidence__comparison-result";
      addText(result, "span", "mobile-evidence__comparison-result-label", "Six-month change");
      var resultValue = addText(result, "strong", "mobile-evidence__comparison-result-value", compactText(delta) || "+117%");
      resultValue.setAttribute("data-evidence-count", "");
      visual.appendChild(result);
      return visual;
    }

    function buildContentVisual(panel, visual) {
      var listItems = all(".evidence-source-sheet--editorial li", panel);
      var trailTitles = ["WordPress post lists", "Writing + delivery", "Saved records"];
      var trailNotes = ["Published posts", "Planning + delivery", "Private files retained"];
      var recordKinds = ["POSTS", "TRACKERS", "ARCHIVE"];
      var disclosure = compactText(one(".evidence-source-sheet--editorial > small", panel)) || "Private drafts and account details are not shown.";
      visual.classList.add("mobile-evidence__visual--content");
      visual.setAttribute("data-evidence-visual", "content");
      addText(visual, "p", "mobile-evidence__visual-label", "Publishing records");
      var index = doc.createElement("section");
      index.className = "mobile-evidence__content-index mobile-evidence__record-map mobile-evidence__record-map--content";
      index.setAttribute("aria-label", "How the article total was counted");

      var mapHead = doc.createElement("header");
      mapHead.className = "mobile-evidence__record-map-head";
      addText(mapHead, "span", "mobile-evidence__record-map-kicker", "3 source systems");
      addText(mapHead, "small", "mobile-evidence__record-map-period", "Work since 2019");
      index.appendChild(mapHead);

      var mapBody = doc.createElement("div");
      mapBody.className = "mobile-evidence__record-map-body";
      var trails = doc.createElement("ol");
      trails.className = "mobile-evidence__content-trails mobile-evidence__record-lanes";
      listItems.forEach(function (item, index) {
        var trail = doc.createElement("li");
        trail.setAttribute("data-order", String(index + 1));
        addText(trail, "span", "mobile-evidence__trail-number mobile-evidence__record-id", compactText(one("span", item)) || String(index + 1).padStart(2, "0"));
        var copy = doc.createElement("span");
        copy.className = "mobile-evidence__trail-copy";
        addText(copy, "b", "", trailTitles[index] || compactText(item).replace(/^\d+\s*/, "") || "Source record");
        addText(copy, "small", "", trailNotes[index] || "Source record");
        trail.appendChild(copy);
        addText(trail, "span", "mobile-evidence__record-kind", recordKinds[index] || "RECORD");
        trails.appendChild(trail);
      });

      var total = doc.createElement("aside");
      total.className = "mobile-evidence__content-total mobile-evidence__record-outcome";
      addText(total, "span", "", "Counted total");
      var contentTotal = addText(total, "strong", "", "400+");
      contentTotal.setAttribute("data-evidence-count", "");
      addText(total, "b", "", "articles");
      addText(total, "small", "", "Saved records");

      mapBody.appendChild(trails);
      mapBody.appendChild(total);
      index.appendChild(mapBody);
      addText(index, "p", "mobile-evidence__record-map-note", disclosure);
      visual.appendChild(index);
      return visual;
    }

    function buildWorkVisual(panel, visual) {
      var entries = all(".evidence-source-sheet--archive > div", panel);
      var pathNotes = ["Employment and contracts", "Agency / delivery team", "Named public work"];
      var disclosure = compactText(one(".evidence-source-sheet--archive > small", panel)) || "A logo means I contributed to the work. It does not always mean direct employment.";
      visual.classList.add("mobile-evidence__visual--work");
      visual.setAttribute("data-evidence-visual", "work");
      addText(visual, "p", "mobile-evidence__visual-label", "Work history on file");
      var register = doc.createElement("section");
      register.className = "mobile-evidence__work-register mobile-evidence__record-map mobile-evidence__record-map--work";
      register.setAttribute("aria-label", "How the company total is classified");

      var mapHead = doc.createElement("header");
      mapHead.className = "mobile-evidence__record-map-head";
      addText(mapHead, "span", "mobile-evidence__record-map-kicker", "3 contribution paths");
      addText(mapHead, "small", "mobile-evidence__record-map-period", "Work since 2019");
      register.appendChild(mapHead);

      var mapBody = doc.createElement("div");
      mapBody.className = "mobile-evidence__record-map-body";
      var roles = doc.createElement("ol");
      roles.className = "mobile-evidence__work-paths mobile-evidence__record-lanes";
      entries.forEach(function (entry, index) {
        var role = doc.createElement("li");
        role.setAttribute("data-order", String(index + 1));
        var title = compactText(one("b", entry)) || "Work";
        addText(role, "span", "mobile-evidence__work-letter mobile-evidence__record-id", String(index + 1).padStart(2, "0"));
        var copy = doc.createElement("span");
        copy.className = "mobile-evidence__work-path-copy";
        addText(copy, "b", "", title);
        addText(copy, "small", "", pathNotes[index] || compactText(one("span", entry)) || "Contribution on record");
        role.appendChild(copy);
        roles.appendChild(role);
      });

      var count = doc.createElement("aside");
      count.className = "mobile-evidence__work-count mobile-evidence__record-outcome";
      addText(count, "span", "", "Work history");
      var workTotal = addText(count, "strong", "", "36+");
      workTotal.setAttribute("data-evidence-count", "");
      addText(count, "b", "", "companies");
      addText(count, "small", "", "On record");

      mapBody.appendChild(roles);
      mapBody.appendChild(count);
      register.appendChild(mapBody);
      addText(register, "p", "mobile-evidence__record-map-note", disclosure);
      visual.appendChild(register);
      return visual;
    }

    function buildProofVisual(panel) {
      var id = panel.getAttribute("data-evidence-panel");
      var visual = doc.createElement("div");
      visual.className = "mobile-evidence__visual";
      var artifact = one(".evidence-artifact img", panel);

      if (artifact) {
        visual.classList.add("mobile-evidence__visual--image");
        var image = artifact.cloneNode(true);
        image.loading = "eager";
        image.decoding = "async";
        visual.appendChild(image);
        return visual;
      }
      if (id === "search") return buildSearchVisual(panel, visual);
      if (id === "content") return buildContentVisual(panel, visual);
      if (id === "companies") return buildWorkVisual(panel, visual);

      visual.classList.add("mobile-evidence__visual--empty");
      visual.textContent = "Source record on file";
      return visual;
    }

    function buildPreview(panel) {
      var summaryTitle = one("summary b", panel);
      var top = one(".evidence-file__top", panel);
      var sourceTitle = top ? one("span", top) : null;
      var claim = one(".evidence-record__claim", panel);
      var source = top ? one("code", top) : null;
      var recordRows = all(".evidence-record dl > div", panel);
      var card = doc.createDocumentFragment();
      var heading = doc.createElement("div");
      heading.className = "mobile-evidence__preview-head";
      heading.innerHTML = "<span>Source record</span><h3></h3><p></p>";
      one("h3", heading).textContent = sourceTitle ? sourceTitle.textContent.replace(/\s+/g, " ").trim() : "Proof record";
      one("p", heading).textContent = source ? source.textContent.replace(/\s+/g, " ").trim() : (summaryTitle ? summaryTitle.textContent.replace(/\s+/g, " ").trim() : "");
      card.appendChild(heading);
      if (claim) {
        var claimClone = claim.cloneNode(true);
        claimClone.classList.add("mobile-evidence__claim");
        card.appendChild(claimClone);
      }
      /* Each proof type uses a purpose-built, data-led canvas. Raw desktop
         source sheets made Search, Content and Work look like stretched empty
         documents on a phone, so they are deliberately not cloned here. */
      card.appendChild(buildProofVisual(panel));

      if (recordRows.length) {
        /* Two context facts are enough at this level. The complete record is
           available by opening the dashboard, so the quick view stays clear. */
        var list = doc.createElement("dl");
        list.className = "mobile-evidence__facts";
        [1, 2].forEach(function (rowIndex) {
          var row = recordRows[rowIndex];
          if (row) list.appendChild(row.cloneNode(true));
        });
        card.appendChild(list);
      }
      preview.replaceChildren(card);
    }

    function updateTabs() {
      tabButtons.forEach(function (tab) {
        var selected = tab.getAttribute("data-evidence-tab") === active;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.setAttribute("tabindex", selected ? "0" : "-1");
      });
    }

    var previewMotionVersion = 0;
    var previewMotionTimer = 0;

    function animateEvidenceCount(node) {
      if (!node || reducedMotion) return;
      var original = node.getAttribute("data-evidence-count-value") || compactText(node);
      var match = original.match(/([+\-]?)([\d,]+(?:\.\d+)?)(.*)/);
      if (!match) return;

      node.setAttribute("data-evidence-count-value", original);
      var target = Number(match[2].replace(/,/g, ""));
      if (!isFinite(target) || target <= 0) return;
      var prefix = match[1] || "";
      var suffix = match[3] || "";
      var started = 0;
      var duration = target >= 1000 ? 560 : 430;
      var decimals = match[2].indexOf(".") !== -1 ? Math.min(1, (match[2].split(".")[1] || "").length) : 0;

      function render(time) {
        if (!started) started = time;
        var progress = Math.min(1, (time - started) / duration);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        var formatted = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");
        node.textContent = prefix + formatted + suffix;
        if (progress < 1) win.requestAnimationFrame(render);
        else node.textContent = original;
      }
      win.requestAnimationFrame(render);
    }

    function playPreviewEntrance(id) {
      preview.dataset.evidenceMode = id;
      desk.dataset.evidenceView = id;
      root.dataset.mobileEvidenceView = id;
      if (reducedMotion) return;
      var motionVersion = ++previewMotionVersion;
      preview.dataset.evidenceCycle = String(motionVersion);
      win.clearTimeout(previewMotionTimer);
      preview.classList.remove("is-evidence-entering");
      nextFrame(function () {
        if (motionVersion !== previewMotionVersion) return;
        preview.classList.add("is-evidence-entering");
        all("[data-evidence-count]", preview).forEach(animateEvidenceCount);
        previewMotionTimer = win.setTimeout(function () {
          if (motionVersion === previewMotionVersion) preview.classList.remove("is-evidence-entering");
        }, 720);
      });
    }

    function select(id, focusButton, announce) {
      var match = panels.find(function (panel) { return panel.getAttribute("data-evidence-panel") === id; });
      if (!match) return;
      active = id;
      buttons.forEach(function (button) {
        var selected = button.getAttribute("data-evidence-target") === id;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", selected ? "true" : "false");
        if (selected && focusButton) button.focus({ preventScroll: true });
      });
      panels.forEach(function (panel) {
        var selected = panel === match;
        panel.classList.toggle("is-active", selected);
        panel.hidden = !selected;
        panel.open = false;
      });
      buildPreview(match);
      var title = one("summary b", match);
      var selectedTab = tabButtons.find(function (tab) { return tab.getAttribute("data-evidence-tab") === id; });
      preview.setAttribute("aria-labelledby", selectedTab ? selectedTab.id : "");
      preview.setAttribute("aria-label", "Open complete proof for " + (title ? title.textContent.trim() : "selected result"));
      updateTabs();
      if (announce) playPreviewEntrance(id);
      else {
        preview.dataset.evidenceMode = id;
        desk.dataset.evidenceView = id;
        root.dataset.mobileEvidenceView = id;
      }
      if (announce) status.textContent = "Showing " + (title ? title.textContent.trim() : "selected proof") + ".";
    }

    function openActiveDetail() {
      var panel = panels.find(function (item) { return item.getAttribute("data-evidence-panel") === active; });
      if (!panel || !sheetController) return;
      var content = one(".evidence-file__body", panel);
      var label = one("summary b", panel);
      if (content) sheetController.open(label ? label.textContent.trim() : "Proof details", content.cloneNode(true), "mobile-sheet--evidence");
    }

    function syncCompactMode() {
      var shortLayout = !!(shortMedia && shortMedia.matches);
      desk.classList.toggle("is-short-evidence", shortLayout);
    }

    function syncEvidenceActive() {
      if (!section) return;
      var rect = section.getBoundingClientRect();
      var headerHeight = one(".site-header")?.getBoundingClientRect().height || 0;
      root.toggleAttribute("data-mobile-evidence-active", rect.bottom > headerHeight + 16 && rect.top < win.innerHeight - 8);
    }

    tabButtons.forEach(function (tab) {
      tab.addEventListener("click", function () {
        select(tab.getAttribute("data-evidence-tab"), false, true);
      });
      tab.addEventListener("keydown", function (event) {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        var index = tabButtons.indexOf(tab);
        if (index === -1 || !tabButtons.length) return;
        var next = index;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabButtons.length - 1;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabButtons.length) % tabButtons.length;
        else next = (index + 1) % tabButtons.length;
        select(tabButtons[next].getAttribute("data-evidence-tab"), false, true);
        tabButtons[next].focus({ preventScroll: true });
      });
    });

    preview.addEventListener("click", openActiveDetail);
    preview.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openActiveDetail();
    });

    panels.forEach(function (panel) {
      var summary = one("summary", panel);
      if (!summary) return;
      summary.addEventListener("click", function (event) {
        event.preventDefault();
        if (panel.getAttribute("data-evidence-panel") !== active) return;
        openActiveDetail();
      });
    });

    if (shortMedia) {
      if (shortMedia.addEventListener) shortMedia.addEventListener("change", syncCompactMode);
      else if (shortMedia.addListener) shortMedia.addListener(syncCompactMode);
    }

    if (section && "IntersectionObserver" in win) {
      var evidenceObserver = new IntersectionObserver(function () { syncEvidenceActive(); }, { threshold: [0, .01, .12, .45] });
      evidenceObserver.observe(section);
    }
    win.addEventListener("scroll", syncEvidenceActive, { passive: true });
    win.addEventListener("resize", syncEvidenceActive, { passive: true });

    var hash = win.location.hash.match(/^#evidence-(social|search|content|companies)$/);
    if (hash) active = hash[1];
    select(active, false, false);
    syncCompactMode();
    nextFrame(syncEvidenceActive);
  }

  function initSkills() {
    var carousel = one("[data-skl]");
    if (!carousel) return null;
    var viewport = one("[data-skl-viewport]", carousel);
    var cards = all(".skl-card", carousel);
    var previous = one("[data-skl-prev]", carousel);
    var next = one("[data-skl-next]", carousel);
    var foot = one("[data-skl-foot]");
    var pause = one("[data-skl-pause]", foot || carousel);
    var dots = one("[data-skl-dots]", foot || carousel);
    if (!viewport || !cards.length || !previous || !next || !foot || !pause || !dots) return null;

    var current = 0;
    var timer = 0;
    var visible = false;
    var focusInside = false;
    var userPaused = false;
    var idleUntil = 0;
    var pointer = null;
    var status = makeStatus(carousel, "mobile-skills__status");

    /* Mobile owns its gesture model, but it still needs the same small
       diagram film used by the desktop card. Keep this intentionally lean:
       only the active card is armed, every timer is cancelled on a change,
       and the browser only animates transform/opacity/stroke-dashoffset. */
    function clearSkillTimers(card) {
      (card.__mobileSkillTimers || []).forEach(function (id) { win.clearTimeout(id); });
      card.__mobileSkillTimers = [];
    }

    function primeSkillLengths(card) {
      if (card.__mobileSkillPrimed) return;
      all("[data-skl-line],[data-skl-glin],[data-skl-arc],[data-skl-ring],[data-skl-check],[data-skl-edge]", card)
        .forEach(function (path) {
          var length = 600;
          try { length = Math.ceil(path.getTotalLength()) + 2; } catch (error) {}
          path.style.setProperty("--len", String(length || 600));
        });
      card.__mobileSkillPrimed = true;
    }

    function restoreSkillNumber(number) {
      number.__mobileSkillRun = (number.__mobileSkillRun || 0) + 1;
      var raw = (number.getAttribute("data-skl-count") || "").trim();
      if (raw) number.textContent = raw;
    }

    function runSkillNumber(number) {
      if (reducedMotion) return;
      var raw = (number.getAttribute("data-skl-count") || number.textContent || "").trim();
      var match = raw.match(/-?\d[\d,]*(?:\.\d+)?/);
      if (!match) return;
      var numeric = match[0];
      var from = raw.slice(0, match.index);
      var to = raw.slice((match.index || 0) + numeric.length);
      var value = Number(numeric.replace(/,/g, ""));
      if (!Number.isFinite(value)) return;
      var decimal = numeric.indexOf(".") === -1 ? 0 : numeric.length - numeric.indexOf(".") - 1;
      var duration = Number(number.getAttribute("data-skl-duration")) || 1150;
      var run = (number.__mobileSkillRun || 0) + 1;
      var started = 0;
      number.__mobileSkillRun = run;
      function frame(timestamp) {
        if (number.__mobileSkillRun !== run) return;
        if (!started) started = timestamp;
        var progress = Math.min(1, (timestamp - started) / duration);
        var eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = from + (value * eased).toFixed(decimal) + to;
        if (progress < 1) win.requestAnimationFrame(frame);
        else number.textContent = raw;
      }
      win.requestAnimationFrame(frame);
    }

    function resetSkillVisual(card) {
      clearSkillTimers(card);
      card.classList.remove("skl-armed", "skl-play");
      all(".skl-loop__node", card).forEach(function (node) { node.classList.add("is-lit"); });
      all(".skl-card__num", card).forEach(restoreSkillNumber);
    }

    function playSkillVisual(card) {
      if (!card) return;
      primeSkillLengths(card);
      resetSkillVisual(card);
      if (reducedMotion) return;
      all(".skl-loop__node", card).forEach(function (node) { node.classList.remove("is-lit"); });
      card.classList.add("skl-armed");
      void card.offsetWidth;
      nextFrame(function () {
        if (card.getAttribute("data-active") !== "true") return;
        card.classList.remove("skl-armed");
        card.classList.add("skl-play");
        all(".skl-card__num", card).forEach(runSkillNumber);
        all("[data-skl-motion]", card).forEach(function (motion) {
          var motionTimer = win.setTimeout(function () {
            try { motion.beginElement(); } catch (error) {}
          }, 110);
          card.__mobileSkillTimers.push(motionTimer);
        });
        all(".skl-loop__node", card).forEach(function (node, nodeIndex) {
          var nodeTimer = win.setTimeout(function () { node.classList.add("is-lit"); }, 150 + nodeIndex * 220);
          card.__mobileSkillTimers.push(nodeTimer);
        });
      });
    }

    cards.forEach(function (card) {
      card.__mobileSkillTimers = [];
      primeSkillLengths(card);
      resetSkillVisual(card);
    });

    previous.hidden = false;
    next.hidden = false;
    foot.hidden = false;
    dots.replaceChildren();

    cards.forEach(function (card, index) {
      var dot = doc.createElement("button");
      var name = one(".skl-card__name", card);
      card.id = "mobile-skill-" + (index + 1);
      dot.type = "button";
      dot.className = "skl-dot";
      dot.setAttribute("data-mobile-skill-select", String(index));
      dot.setAttribute("aria-controls", card.id);
      dot.setAttribute("aria-label", "Show skill " + padNumber(index) + (name ? ": " + name.textContent.trim() : ""));
      dot.addEventListener("click", function () {
        markInteraction(5000);
        show(index, true);
      });
      dots.appendChild(dot);
    });

    function canAutoplay() {
      return visible && !reducedMotion && !userPaused && !focusInside && !doc.hidden && !anyOverlayOpen() &&
        Date.now() >= idleUntil && !(videoController && videoController.isPlaying());
    }

    function syncAutoplay() {
      win.clearTimeout(timer);
      timer = 0;
      if (!canAutoplay()) return;
      timer = win.setTimeout(function () {
        show(current + 1, false);
      }, 3900);
    }

    function markInteraction(delay) {
      idleUntil = Date.now() + (delay || 4200);
      syncAutoplay();
      win.setTimeout(syncAutoplay, (delay || 4200) + 40);
    }

    function show(index, announce) {
      current = (index + cards.length) % cards.length;
      cards.forEach(function (card, cardIndex) {
        var selected = cardIndex === current;
        card.classList.toggle("is-current", selected);
        if (selected) card.setAttribute("data-active", "true");
        else {
          card.removeAttribute("data-active");
          resetSkillVisual(card);
        }
        card.setAttribute("aria-hidden", selected ? "false" : "true");
        setInert(card, !selected);
      });
      all("[data-mobile-skill-select]", dots).forEach(function (dot, dotIndex) {
        var selected = dotIndex === current;
        dot.classList.toggle("is-active", selected);
        dot.setAttribute("aria-current", selected ? "true" : "false");
      });
      carousel.style.setProperty("--mobile-skill-index", String(current));
      carousel.style.setProperty("--mobile-skill-offset", (current * -10) + "%");
      var selectedName = one(".skl-card__name", cards[current]);
      if (announce) status.textContent = "Skill " + padNumber(current) + " of " + cards.length + ": " + (selectedName ? selectedName.textContent.trim() : "selected") + ".";
      if (carousel.classList.contains("is-mobile-ready")) {
        if (carousel.classList.contains("is-mobile-single-card")) {
          /* The portrait layout is a controlled one-card stage. The track
             moves with a transform, so a browser scroll position cannot
             expose neighbouring-card slivers or fight the transition. */
          viewport.scrollLeft = 0;
        } else {
          var selectedCard = cards[current];
          var centeredLeft = selectedCard.offsetLeft - (viewport.clientWidth - selectedCard.offsetWidth) / 2;
          viewport.scrollTo({
            left: Math.max(0, centeredLeft),
            behavior: announce && !reducedMotion ? "smooth" : "auto"
          });
        }
      }
      if (visible) playSkillVisual(cards[current]);
      syncAutoplay();
    }

    previous.addEventListener("click", function () { markInteraction(5000); show(current - 1, true); });
    next.addEventListener("click", function () { markInteraction(5000); show(current + 1, true); });
    pause.addEventListener("click", function () {
      userPaused = !userPaused;
      pause.setAttribute("aria-pressed", userPaused ? "true" : "false");
      pause.setAttribute("aria-label", userPaused ? "Resume auto-advance" : "Pause auto-advance");
      carousel.classList.toggle("is-paused", userPaused);
      status.textContent = userPaused ? "Skill auto-advance paused." : "Skill auto-advance resumed.";
      syncAutoplay();
    });

    carousel.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.target.closest("button") && !event.target.matches("[data-skl-prev], [data-skl-next], [data-mobile-skill-select]")) return;
      event.preventDefault();
      markInteraction(5000);
      show(current + (event.key === "ArrowRight" ? 1 : -1), true);
    });
    carousel.addEventListener("focusin", function () { focusInside = true; syncAutoplay(); });
    carousel.addEventListener("focusout", function (event) {
      if (event.relatedTarget && carousel.contains(event.relatedTarget)) return;
      focusInside = false;
      markInteraction(3000);
    });

    viewport.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" || event.button > 0 || event.target.closest("button, a, video")) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, intent: "pending" };
      markInteraction(5000);
    }, { passive: true });
    viewport.addEventListener("pointermove", function (event) {
      if (!pointer || event.pointerId !== pointer.id) return;
      pointer.dx = event.clientX - pointer.x;
      pointer.dy = event.clientY - pointer.y;
      var ax = Math.abs(pointer.dx);
      var ay = Math.abs(pointer.dy);
      if (pointer.intent === "pending" && (ax > 12 || ay > 12)) {
        if (ay >= ax * 0.9) {
          pointer.intent = "vertical";
          return;
        }
        if (ax > ay * 1.25) {
          pointer.intent = "horizontal";
          try { viewport.setPointerCapture(event.pointerId); } catch (error) {}
        }
      }
      if (pointer.intent === "horizontal" && event.cancelable) event.preventDefault();
    }, { passive: false });
    function finishSwipe(event) {
      if (!pointer || event.pointerId !== pointer.id) return;
      if (pointer.intent === "horizontal" && Math.abs(pointer.dx) >= 44) show(current + (pointer.dx < 0 ? 1 : -1), true);
      pointer = null;
    }
    viewport.addEventListener("pointerup", finishSwipe, { passive: true });
    viewport.addEventListener("pointercancel", finishSwipe, { passive: true });

    if ("IntersectionObserver" in win) {
      var observer = new IntersectionObserver(function (entries) {
        var wasVisible = visible;
        visible = !!(entries[0] && entries[0].isIntersecting && entries[0].intersectionRatio >= 0.35);
        carousel.toggleAttribute("data-mobile-in-view", visible);
        if (visible && !wasVisible) playSkillVisual(cards[current]);
        syncAutoplay();
      }, { threshold: [0, 0.35, 0.7] });
      observer.observe(carousel);
    } else {
      visible = true;
    }

    carousel.classList.add("is-mobile-ready");
    if (root.hasAttribute("data-mobile-portrait")) carousel.classList.add("is-mobile-single-card");
    carousel.setAttribute("data-skl-on", "true");
    show(0, false);
    return { syncAutoplay: syncAutoplay };
  }

  function initVideos() {
    var showreel = one("[data-showreel]");
    if (!showreel) return null;
    showreel.id = "video-work";
    showreel.setAttribute("role", "region");
    showreel.setAttribute("aria-labelledby", "video-work-title");
    var grid = one(".showreel__grid", showreel);
    var items = all("[data-inline-media]", showreel);
    var existingStatus = one("[data-media-status]", showreel);
    if (!grid || !items.length) return null;

    var current = 0;
    var playing = null;
    var selectors = doc.createElement("div");
    var status = existingStatus || makeStatus(showreel, "mobile-showreel__status");
    selectors.className = "mobile-showreel__selectors mobile-pager";
    selectors.setAttribute("role", "tablist");
    selectors.setAttribute("aria-label", "Select a video");

    items.forEach(function (item, index) {
      var button = doc.createElement("button");
      var title = item.getAttribute("data-media-title") || "Video " + padNumber(index);
      item.id = "mobile-video-" + (index + 1);
      button.type = "button";
      button.className = "mobile-showreel__selector mobile-pager__button";
      button.setAttribute("role", "tab");
      button.setAttribute("data-mobile-video-select", String(index));
      button.setAttribute("data-mobile-page", String(index));
      button.setAttribute("aria-controls", item.id);
      button.setAttribute("aria-label", "Show " + title);
      button.innerHTML = "<span>" + padNumber(index) + "</span><small>" + title + "</small>";
      button.addEventListener("click", function () { select(index, true); });
      selectors.appendChild(button);
    });
    grid.insertAdjacentElement("afterend", selectors);

    function getParts(item) {
      return {
        video: one("[data-inline-video]", item),
        play: one("[data-inline-play]", item),
        expand: one("[data-inline-expand]", item)
      };
    }

    function mountPoster(video) {
      if (!video || video.getAttribute("poster")) return;
      var poster = video.getAttribute("data-poster");
      if (poster) video.poster = poster;
    }

    function mountSource(video) {
      if (!video) return false;
      mountPoster(video);
      if (!video.getAttribute("src")) {
        var source = video.getAttribute("data-src");
        if (!source) return false;
        video.src = source;
        video.load();
      }
      return true;
    }

    function setPlaybackState(item, stateName) {
      item.classList.toggle("is-playing", stateName === "playing");
      item.classList.toggle("is-paused", stateName === "paused");
      item.setAttribute("data-player-state", stateName);
      /* Keep the player state aligned with the desktop player contract so
         the compact player can reuse the same clear pause/play affordance. */
      item.setAttribute("data-state", stateName);
      var parts = getParts(item);
      if (parts.play) {
        var title = item.getAttribute("data-media-title") || "selected video";
        parts.play.setAttribute("aria-label", (stateName === "playing" ? "Pause " : "Play ") + title);
        parts.play.setAttribute("aria-pressed", stateName === "playing" ? "true" : "false");
      }
      if (parts.expand) parts.expand.hidden = false;
    }

    function pauseAll(except) {
      items.forEach(function (item) {
        var parts = getParts(item);
        if (!parts.video || parts.video === except) return;
        if (!parts.video.paused) parts.video.pause();
        if (item.classList.contains("is-playing")) setPlaybackState(item, "paused");
      });
      if (!except) playing = null;
      if (skillsController) skillsController.syncAutoplay();
    }

    function play(item) {
      var parts = getParts(item);
      if (!parts.video || !mountSource(parts.video)) {
        status.textContent = "This video source is unavailable.";
        return;
      }
      pauseAll(parts.video);
      parts.video.controls = true;
      var attempt = parts.video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          setPlaybackState(item, parts.video.currentTime > 0 ? "paused" : "idle");
          status.textContent = "Playback needs another tap.";
        });
      }
    }

    function toggle(item) {
      var parts = getParts(item);
      if (!parts.video) return;
      if (!parts.video.paused && !parts.video.ended) parts.video.pause();
      else play(item);
    }

    function select(index, announce) {
      current = (index + items.length) % items.length;
      pauseAll();
      items.forEach(function (item, itemIndex) {
        var selected = itemIndex === current;
        item.classList.toggle("is-active", selected);
        if (selected) item.setAttribute("data-active", "true");
        else item.removeAttribute("data-active");
        item.toggleAttribute("data-mobile-active", selected);
        item.hidden = !selected;
        item.setAttribute("aria-hidden", selected ? "false" : "true");
        setInert(item, !selected);
        if (selected) mountPoster(getParts(item).video);
      });
      all("[data-mobile-video-select]", selectors).forEach(function (button, buttonIndex) {
        var selected = buttonIndex === current;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", selected ? "true" : "false");
        button.setAttribute("aria-current", selected ? "true" : "false");
        button.tabIndex = selected ? 0 : -1;
      });
      if (announce) status.textContent = "Selected " + (items[current].getAttribute("data-media-title") || "video") + ", " + padNumber(current) + " of " + items.length + ".";
    }

    items.forEach(function (item) {
      var parts = getParts(item);
      if (!parts.video || !parts.play) return;
      parts.play.addEventListener("click", function (event) {
        event.stopPropagation();
        toggle(item);
      });
      one(".showreel__frame", item).addEventListener("click", function (event) {
        if (event.target.closest("button") || event.target === parts.video) return;
        toggle(item);
      });
      parts.video.addEventListener("click", function (event) {
        event.preventDefault();
        toggle(item);
      });
      parts.video.addEventListener("play", function () {
        pauseAll(parts.video);
        playing = parts.video;
        setPlaybackState(item, "playing");
        status.textContent = "Playing " + (item.getAttribute("data-media-title") || "selected video") + ".";
        if (skillsController) skillsController.syncAutoplay();
      });
      parts.video.addEventListener("pause", function () {
        if (parts.video.ended) return;
        if (playing === parts.video) playing = null;
        setPlaybackState(item, parts.video.currentTime > 0 ? "paused" : "idle");
        if (skillsController) skillsController.syncAutoplay();
      });
      parts.video.addEventListener("ended", function () {
        if (playing === parts.video) playing = null;
        setPlaybackState(item, "idle");
        status.textContent = "Video finished.";
        if (skillsController) skillsController.syncAutoplay();
      });
      parts.video.addEventListener("error", function () {
        if (playing === parts.video) playing = null;
        setPlaybackState(item, "error");
        status.textContent = "This video could not be loaded.";
      });
      if (parts.expand) {
        parts.expand.hidden = false;
        parts.expand.addEventListener("click", function (event) {
          event.stopPropagation();
          if (!mountSource(parts.video)) return;
          var request = parts.video.requestFullscreen || parts.video.webkitRequestFullscreen || parts.video.webkitEnterFullscreen;
          if (!request) {
            status.textContent = "Full screen is not available in this browser.";
            return;
          }
          try {
            var result = request.call(parts.video);
            if (result && typeof result.catch === "function") result.catch(function () {});
          } catch (error) {}
        });
      }
    });

    selectors.addEventListener("keydown", function (event) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      var index = current;
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = items.length - 1;
      else index = (current + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
      select(index, true);
      all("[data-mobile-video-select]", selectors)[index].focus({ preventScroll: true });
    });

    if ("IntersectionObserver" in win) {
      var observer = new IntersectionObserver(function (entries) {
        var visible = entries[0] && entries[0].isIntersecting && entries[0].intersectionRatio > 0.12;
        showreel.toggleAttribute("data-mobile-in-view", !!visible);
        if (!visible) pauseAll();
      }, { threshold: [0, 0.12, 0.5] });
      observer.observe(showreel);
    }

    showreel.classList.add("is-mobile-ready", "is-mobile-paged");
    select(0, false);
    return {
      pauseAll: function () { pauseAll(); },
      isPlaying: function () { return !!(playing && !playing.paused); }
    };
  }

  function initCaseStudies() {
    var section = one("[data-work]");
    if (!section) return null;
    var lede = one("[data-work-lede]", section);
    var stream = one("[data-work-stream]", section);
    var layout = one(".work__layout", section);
    var items = all("[data-work-item]", section);
    var narratives = all("[data-narr]", section);
    if (!lede || !stream || !items.length) return null;

    if (layout) {
      layout.id = "case-studies";
      layout.setAttribute("role", "region");
      layout.setAttribute("aria-labelledby", "showcase-title");
    }
    all('a[href="#work"]').forEach(function (link) {
      link.setAttribute("href", "#case-studies");
    });

    var current = 0;
    var timer = 0;
    var visible = false;
    var focusInside = false;
    var userPaused = false;
    var idleUntil = 0;
    var selectors = doc.createElement("div");
    var controls = doc.createElement("div");
    var pause = doc.createElement("button");
    var status = makeStatus(lede, "mobile-work__status");
    var title = one(".work__title", lede);
    selectors.className = "mobile-work__selectors mobile-pager";
    selectors.setAttribute("role", "tablist");
    selectors.setAttribute("aria-label", "Select a case study");
    controls.className = "mobile-work__controls";
    pause.type = "button";
    pause.className = "mobile-work__autoplay";
    pause.setAttribute("aria-pressed", "false");
    pause.setAttribute("aria-label", "Pause case study auto-advance");
    pause.innerHTML = "<span aria-hidden=\"true\">&#10074;&#10074;</span><span>Auto</span>";

    items.forEach(function (item, index) {
      var caseTitle = one(".work-item__title", item);
      var button = doc.createElement("button");
      item.id = item.id || "mobile-case-" + (index + 1);
      button.type = "button";
      button.className = "mobile-work__selector mobile-pager__button";
      button.setAttribute("role", "tab");
      button.setAttribute("data-mobile-case-select", String(index));
      button.setAttribute("data-mobile-page", String(index));
      button.setAttribute("aria-controls", item.id);
      button.setAttribute("aria-label", "Show case " + padNumber(index) + (caseTitle ? ": " + caseTitle.textContent.trim() : ""));
      button.textContent = padNumber(index);
      button.addEventListener("click", function () {
        markInteraction(5200);
        select(index, true);
      });
      selectors.appendChild(button);

      var card = one(".work-item__card", item);
      if (card && !one("[data-mobile-case-open]", card)) {
        var detailButton = doc.createElement("button");
        detailButton.type = "button";
        detailButton.className = "btn btn--gold-ghost mobile-work__open";
        detailButton.setAttribute("data-mobile-case-open", String(index));
        detailButton.textContent = "Read full case";
        detailButton.addEventListener("click", function () {
          if (!sheetController) return;
          var clone = card.cloneNode(true);
          sheetController.open(caseTitle ? caseTitle.textContent.trim() : "Case study", clone, "mobile-sheet--case");
        });
        card.appendChild(detailButton);
      }
    });

    controls.appendChild(selectors);
    controls.appendChild(pause);
    if (title) title.insertAdjacentElement("afterend", controls);
    else lede.insertBefore(controls, lede.firstChild);

    function canAutoplay() {
      return visible && !reducedMotion && !userPaused && !focusInside && !doc.hidden && !anyOverlayOpen() && Date.now() >= idleUntil;
    }

    function syncAutoplay() {
      win.clearTimeout(timer);
      timer = 0;
      var remainingHold = Math.max(0, idleUntil - Date.now());
      if (remainingHold > 0 && visible && !reducedMotion && !userPaused && !focusInside && !doc.hidden && !anyOverlayOpen()) {
        timer = win.setTimeout(function () {
          if (canAutoplay()) select(current + 1, false);
          else syncAutoplay();
        }, remainingHold + 24);
        return;
      }
      if (!canAutoplay()) return;
      timer = win.setTimeout(function () {
        select(current + 1, false);
      }, 5200);
    }

    function markInteraction(delay) {
      var wait = delay || 5200;
      idleUntil = Date.now() + wait;
      syncAutoplay();
    }

    function select(index, announce) {
      current = (index + items.length) % items.length;
      items.forEach(function (item, itemIndex) {
        var selected = itemIndex === current;
        item.classList.toggle("is-active", selected);
        if (selected) item.setAttribute("data-active", "true");
        else item.removeAttribute("data-active");
        item.toggleAttribute("data-mobile-active", selected);
        item.hidden = !selected;
        item.setAttribute("aria-hidden", selected ? "false" : "true");
        setInert(item, !selected);
      });
      narratives.forEach(function (narrative, narrativeIndex) {
        var selected = narrativeIndex === current;
        narrative.classList.toggle("is-active", selected);
        narrative.toggleAttribute("data-mobile-active", selected);
        narrative.hidden = !selected;
      });
      all("[data-mobile-case-select]", selectors).forEach(function (button, buttonIndex) {
        var selected = buttonIndex === current;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", selected ? "true" : "false");
        button.setAttribute("aria-current", selected ? "true" : "false");
        button.tabIndex = selected ? 0 : -1;
      });
      var currentLabel = one("[data-work-current]", section);
      var totalLabel = one("[data-work-total]", section);
      var progress = one("[data-work-progress]", section);
      if (currentLabel) currentLabel.textContent = padNumber(current);
      if (totalLabel) totalLabel.textContent = String(items.length).padStart(2, "0");
      if (progress) progress.style.transform = "scaleX(" + ((current + 1) / items.length).toFixed(3) + ")";
      section.style.setProperty("--mobile-case-index", String(current));
      section.dataset.mobileCaseIndex = String(current + 1);
      var caseTitle = one(".work-item__title", items[current]);
      if (announce) status.textContent = "Case " + padNumber(current) + " of " + items.length + ": " + (caseTitle ? caseTitle.textContent.trim() : "selected") + ".";
      if (!reducedMotion) {
        var cycle = (Number(section.dataset.mobileCaseCycle || "0") || 0) + 1;
        section.dataset.mobileCaseCycle = String(cycle);
        section.classList.remove("is-mobile-case-entering");
        void section.offsetWidth;
        section.classList.add("is-mobile-case-entering");
        win.setTimeout(function () {
          if (section.dataset.mobileCaseCycle === String(cycle)) section.classList.remove("is-mobile-case-entering");
        }, 520);
      }
      syncAutoplay();
    }

    selectors.addEventListener("keydown", function (event) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      var index = current;
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = items.length - 1;
      else index = (current + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
      markInteraction(6500);
      select(index, true);
      all("[data-mobile-case-select]", selectors)[index].focus({ preventScroll: true });
    });

    pause.addEventListener("click", function () {
      userPaused = !userPaused;
      pause.setAttribute("aria-pressed", userPaused ? "true" : "false");
      pause.setAttribute("aria-label", userPaused ? "Resume case study auto-advance" : "Pause case study auto-advance");
      pause.innerHTML = userPaused
        ? "<span aria-hidden=\"true\">&#9654;</span><span>Auto</span>"
        : "<span aria-hidden=\"true\">&#10074;&#10074;</span><span>Auto</span>";
      section.classList.toggle("is-mobile-case-paused", userPaused);
      status.textContent = userPaused ? "Case study auto-advance paused." : "Case study auto-advance resumed.";
      syncAutoplay();
    });

    section.addEventListener("focusin", function (event) {
      /* Touch taps may leave a button focused indefinitely on mobile. Only a
         keyboard-style focus ring should hold autoplay; a normal tap gets the
         same short idle window as the rest of the interface. */
      try { focusInside = event.target.matches(":focus-visible"); }
      catch (error) { focusInside = false; }
      syncAutoplay();
    });
    section.addEventListener("focusout", function (event) {
      if (event.relatedTarget && section.contains(event.relatedTarget)) return;
      focusInside = false;
      markInteraction(3000);
    });
    section.addEventListener("pointerdown", function (event) {
      focusInside = false;
      /* Starting a vertical scroll on the case card is not a request to stop
         the carousel. Only deliberate controls and links yield autoplay. */
      if (event.target.closest("[data-mobile-case-select], .mobile-work__autoplay, [data-mobile-case-open], a")) {
        markInteraction(5200);
      }
    }, { passive: true });

    if ("IntersectionObserver" in win) {
      var observer = new IntersectionObserver(function (entries) {
        var entry = entries[0];
        var enoughPixels = entry && entry.intersectionRect
          ? entry.intersectionRect.height >= Math.min(180, (win.innerHeight || 600) * 0.24)
          : false;
        visible = !!(entry && entry.isIntersecting && enoughPixels);
        (layout || section).toggleAttribute("data-mobile-in-view", visible);
        syncAutoplay();
      }, { threshold: [0, 0.08, 0.2] });
      observer.observe(layout || section);
    } else {
      visible = true;
    }

    section.classList.add("is-mobile-ready");
    if (layout) layout.classList.add("is-mobile-paged");
    select(0, false);
    return { syncAutoplay: syncAutoplay };
  }

  function initProcess() {
    var section = one("#process");
    var process = section ? one(".process", section) : null;
    if (!section || !process) return;
    var steps = all(".process__step", process);
    var grid = one(".process__grid", process);
    if (!steps.length || !grid) return;

    process.removeAttribute("data-pin");
    process.style.removeProperty("--progress");
    process.style.removeProperty("height");
    section.style.removeProperty("height");
    var stage = one(".process__stage", process);
    if (stage) {
      stage.style.removeProperty("position");
      stage.style.removeProperty("top");
      stage.style.removeProperty("height");
    }

    /* Preserve the desktop's real timeline narrative on a phone. The earlier
       compact implementation converted these six semantic steps into a pager
       and hid five cards, which made Process feel like a control panel rather
       than a working method. */
    all(".mobile-process__selectors", process).forEach(function (selector) { selector.remove(); });
    var current = 0;
    function select(index) {
      current = Math.max(0, Math.min(steps.length - 1, index));
      steps.forEach(function (step, stepIndex) {
        var selected = stepIndex === current;
        step.classList.toggle("is-active", selected);
        step.classList.toggle("is-past", stepIndex < current);
        if (selected) step.setAttribute("data-active", "true");
        else step.removeAttribute("data-active");
        step.toggleAttribute("data-mobile-active", selected);
        step.hidden = false;
        step.setAttribute("aria-hidden", "false");
        if (selected) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
        setInert(step, false);
      });
      process.style.setProperty("--mobile-process-progress", String((current + 1) / steps.length));
    }

    steps.forEach(function (step, index) {
      step.id = step.id || "mobile-process-step-" + (index + 1);
      step.hidden = false;
      step.removeAttribute("aria-hidden");
      setInert(step, false);
    });

    if (!reducedMotion && "IntersectionObserver" in win) {
      var observer = new IntersectionObserver(function (entries) {
        var activeEntry = entries
          .filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
        if (activeEntry) select(steps.indexOf(activeEntry.target));
      }, { threshold: [0, 0.18, 0.42, 0.72], rootMargin: "-22% 0px -42% 0px" });
      steps.forEach(function (step) { observer.observe(step); });
    }

    process.classList.add("is-mobile-ready", "is-mobile-timeline");
    process.setAttribute("data-mobile-timeline", "true");
    select(0);
  }

  function initFAQ() {
    var faq = one("#faq .faq") || one(".faq");
    if (!faq) return;
    var triggers = all(".faq__trigger", faq);

    function close(trigger) {
      var panel = doc.getElementById(trigger.getAttribute("aria-controls"));
      var item = trigger.closest(".faq__item");
      trigger.setAttribute("aria-expanded", "false");
      if (item) item.classList.remove("is-open");
      if (panel) {
        panel.removeAttribute("data-open");
        panel.hidden = true;
      }
    }

    function open(trigger) {
      triggers.forEach(function (other) { if (other !== trigger) close(other); });
      var panel = doc.getElementById(trigger.getAttribute("aria-controls"));
      var item = trigger.closest(".faq__item");
      trigger.setAttribute("aria-expanded", "true");
      if (item) item.classList.add("is-open");
      if (panel) {
        panel.hidden = false;
        panel.setAttribute("data-open", "true");
      }
    }

    triggers.forEach(function (trigger) {
      close(trigger);
      trigger.addEventListener("click", function () {
        if (trigger.getAttribute("aria-expanded") === "true") close(trigger);
        else open(trigger);
      });
    });

    if (!one(".mobile-faq__footer", faq)) {
      var footer = doc.createElement("div");
      var footerCopy = doc.createElement("span");
      var footerLink = doc.createElement("a");
      footer.className = "mobile-faq__footer";
      footerCopy.textContent = "Still deciding?";
      footerLink.href = "#contact";
      footerLink.textContent = "Ask me directly";
      footerLink.setAttribute("aria-label", "Ask Abhijit directly about your project");
      footer.appendChild(footerCopy);
      footer.appendChild(footerLink);
      faq.appendChild(footer);
    }
    faq.classList.add("is-mobile-ready");
  }

  function initReveals() {
    var targets = all([
      ".proof-evidence__head",
      ".evidence-desk",
      ".skl-welcome",
      ".skl-carousel",
      ".showreel__head",
      ".showreel__grid",
      ".work__lede",
      ".work__stream",
      "#process .section__head",
      "#process .process__grid",
      "#process .process__step",
      "#about .about__media",
      "#about .about__body",
      "#faq .section__head",
      "#faq .faq__list",
      "#faq .faq__item",
      "#contact .contact__panel",
      ".site-footer__brand",
      ".site-footer__nav",
      ".site-footer__contact"
    ].join(","));

    if (!targets.length) return;
    targets.forEach(function (target, index) {
      target.classList.add("mobile-reveal");
      target.style.setProperty("--mobile-reveal-delay", String((index % 2) * 55) + "ms");
    });

    /* One observer powers the reversible scene entrances. It only responds at
       viewport boundaries (not on every scroll frame), so the page remains
       light while sections can present themselves again from either direction.
       The hero and proof artboards are intentionally excluded: both have
       one-view compositions whose visible state must never be interrupted. */
    var observer = null;

    function show(target) {
      if (target.classList.contains("is-visible")) return;
      target.__mobileMotionEpoch = (target.__mobileMotionEpoch || 0) + 1;
      target.dataset.motionCycle = String((parseInt(target.dataset.motionCycle || "0", 10) || 0) + 1);
      target.classList.add("is-visible");
    }

    function hide(target) {
      if (!target.classList.contains("is-visible")) return;
      target.__mobileMotionEpoch = (target.__mobileMotionEpoch || 0) + 1;
      target.classList.remove("is-visible");
    }

    function syncViewportState() {
      var viewportTop = (win.innerHeight || 0) * 0.08;
      var viewportBottom = (win.innerHeight || 0) * 0.92;
      targets.forEach(function (target) {
        var rect = target.getBoundingClientRect();
        if (rect.bottom > viewportTop && rect.top < viewportBottom) show(target);
        else hide(target);
      });
    }

    function observe() {
      if (observer || reducedMotion || !("IntersectionObserver" in win)) return;
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) show(entry.target);
          else hide(entry.target);
        });
      }, { threshold: 0, rootMargin: "-8% 0px -8% 0px" });
      targets.forEach(function (target) { observer.observe(target); });
    }

    scrollSceneController = {
      setReduced: function (isReduced) {
        if (isReduced || !("IntersectionObserver" in win)) {
          if (observer) observer.disconnect();
          observer = null;
          targets.forEach(show);
          return;
        }
        observe();
        syncViewportState();
      }
    };

    if (reducedMotion || !("IntersectionObserver" in win)) {
      scrollSceneController.setReduced(true);
      return;
    }

    observe();
  }

  /* The mobile hero reserves a deliberate lower-right dock for Kriti's round
     avatar. Keep the assistant usable there without the large greeting card. */
  function initHeroAssistantClearance() {
    var assistant = one(".ai-ab-container");
    if (!assistant) return;
    assistant.classList.remove("ai-ab--hero-hidden");
    assistant.removeAttribute("inert");
    assistant.removeAttribute("aria-hidden");
  }

  /* The assistant is useful through the story, but it must never sit over the
     final contact controls or footer navigation. Fade the idle bubble only in
     those two safe zones; an already-open conversation remains available. */
  function initAssistantSafeZones() {
    var assistant = one(".ai-ab-container");
    var zones = [one("#faq .mobile-faq__footer"), one("#contact"), one(".site-footer")].filter(Boolean);
    if (!assistant || !zones.length || !("IntersectionObserver" in win)) return;
    var visibleZones = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.08) visibleZones.add(entry.target);
        else visibleZones.delete(entry.target);
      });
      assistant.classList.toggle("ai-ab--safe-zone", visibleZones.size > 0);
    }, { threshold: [0, 0.08, 0.22] });
    zones.forEach(function (zone) { observer.observe(zone); });
  }

  function initVisibilitySafety() {
    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden && videoController) videoController.pauseAll();
      if (skillsController) skillsController.syncAutoplay();
      if (caseController) caseController.syncAutoplay();
    });

    if (reduceMedia) {
      var updateReducedMotion = function (event) {
        reducedMotion = event.matches;
        root.toggleAttribute("data-reduced-motion", reducedMotion);
        if (scrollSceneController) scrollSceneController.setReduced(reducedMotion);
        if (reducedMotion && videoController) videoController.pauseAll();
        if (skillsController) skillsController.syncAutoplay();
        if (caseController) caseController.syncAutoplay();
      };
      if (reduceMedia.addEventListener) reduceMedia.addEventListener("change", updateReducedMotion);
      else if (reduceMedia.addListener) reduceMedia.addListener(updateReducedMotion);
    }
  }

  /* The desktop phone-frame preview is visually a portrait phone even though
     the browser viewport is landscape. Keep one explicit state so the same
     hero composition is used in both places, and update it on real rotation. */
  function initPortraitMode() {
    var portrait = win.matchMedia ? win.matchMedia("(orientation: portrait)") : null;
    function sync() {
      var forcePreview = root.dataset.preview === "mobile" || root.dataset.preview === "mobile-frame";
      root.toggleAttribute("data-mobile-portrait", forcePreview || !portrait || portrait.matches);
    }
    sync();
    if (!portrait) return;
    if (portrait.addEventListener) portrait.addEventListener("change", sync);
    else if (portrait.addListener) portrait.addListener(sync);
  }

  function init() {
    initPortraitMode();
    normalizeNarrativeOrder();
    sheetController = initSheet();
    menuController = initMenu();
    initAnchors();
    initProofScene();
    initEvidence();
    skillsController = initSkills();
    videoController = initVideos();
    caseController = initCaseStudies();
    initProcess();
    initFAQ();
    initReveals();
    initHeroAssistantClearance();
    initAssistantSafeZones();
    initVisibilitySafety();
    root.dataset.mobileReady = "true";
    win.dispatchEvent(new CustomEvent("ap:mobile-ready"));
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
