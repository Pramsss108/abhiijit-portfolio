/* ============================================================================
 * Abhijit Pramanik — v3 portfolio motion engine
 * One self-contained vanilla-JS IIFE. No libraries, no build step.
 * Implements the full v3 interaction contract:
 *   - animated mesh-gradient / aurora background (#bg-canvas)
 *   - sticky header [data-scrolled] + scroll progress bar
 *   - mobile hamburger ([data-nav-list]/[data-mobile-menu] + aria)
 *   - IntersectionObserver .reveal -> .is-visible (staggered)
 *   - data-parallax translateY (rAF, transform only)
 *   - data-split words/lines kinetic reveal
 *   - data-pin sections -> --progress 0..1 (drives process timeline)
 *   - .stat__num count-up
 *   - hero rotating word ([data-rotator])
 *   - data-tilt cards + data-magnetic buttons (pointer:fine only)
 *   - custom cursor [data-cursor] (pointer:fine only)
 *   - FAQ accordion (aria + panel[data-open])
 *   - scroll-spy nav (.nav__link.is-active)
 *   - smooth in-page anchor scroll
 *   - honors prefers-reduced-motion everywhere
 * Animate transform/opacity only; everything degrades gracefully on
 * mobile / touch / reduced-motion / no-JS.
 * ========================================================================== */
(function () {
  "use strict";

  /* -------------------------------------------------------------------------
   * Environment flags
   * ----------------------------------------------------------------------- */
  var win = window;
  var doc = document;
  var docEl = doc.documentElement;

  var mqReduce = win.matchMedia ? win.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var prefersReduced = !!(mqReduce && mqReduce.matches);

  var mqFine = win.matchMedia ? win.matchMedia("(pointer: fine)") : null;
  var hasFinePointer = !!(mqFine && mqFine.matches);

  var mqDesktop = win.matchMedia ? win.matchMedia("(min-width: 1024px)") : null;
  var isDesktop = !!(mqDesktop && mqDesktop.matches);

  var supportsIO = "IntersectionObserver" in win;

  // Mark <html> as JS-capable so the CSS reveal hide-rules (scoped to html.js)
  // engage only when we can actually un-hide content.
  docEl.classList.add("js");

  /* -------------------------------------------------------------------------
   * Tiny helpers
   * ----------------------------------------------------------------------- */
  function $(sel, ctx) {
    return (ctx || doc).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }
  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function noop() {}

  // requestAnimationFrame shim (very old browsers)
  var raf =
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    function (cb) {
      return win.setTimeout(function () {
        cb(Date.now());
      }, 16);
    };

  // Cross-browser matchMedia change listener
  function onMQ(mq, fn) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener("change", fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* -------------------------------------------------------------------------
   * Shared scroll dispatcher — one passive scroll listener, rAF-throttled.
   * Subscribers receive (scrollY) once per frame after a scroll/resize.
   * ----------------------------------------------------------------------- */
  var scrollSubs = [];
  var resizeSubs = [];
  var scrollTicking = false;
  var lastScrollY = win.pageYOffset || 0;

  function runScrollSubs() {
    scrollTicking = false;
    lastScrollY = win.pageYOffset || docEl.scrollTop || 0;
    for (var i = 0; i < scrollSubs.length; i++) {
      try {
        scrollSubs[i](lastScrollY);
      } catch (e) {
        /* keep the loop alive */
      }
    }
  }
  function onScroll() {
    if (!scrollTicking) {
      scrollTicking = true;
      raf(runScrollSubs);
    }
  }
  function subscribeScroll(fn) {
    scrollSubs.push(fn);
    fn(win.pageYOffset || 0); // prime once
  }
  function runResizeSubs() {
    for (var i = 0; i < resizeSubs.length; i++) {
      try {
        resizeSubs[i]();
      } catch (e) {}
    }
  }
  var resizeTimer = null;
  function onResize() {
    if (resizeTimer) win.clearTimeout(resizeTimer);
    resizeTimer = win.setTimeout(runResizeSubs, 150);
  }
  function subscribeResize(fn) {
    resizeSubs.push(fn);
  }

  win.addEventListener("scroll", onScroll, { passive: true });
  win.addEventListener("resize", onResize, { passive: true });
  win.addEventListener("orientationchange", onResize, { passive: true });

  /* =========================================================================
   * 1) ANIMATED BACKGROUND — drifting violet + lime aurora on #bg-canvas.
   *    Desktop + motion allowed: a soft, low-cost canvas animation of a few
   *    radial blobs that slowly drift, painted with low alpha + blur.
   *    Mobile / touch / reduced-motion: paint ONE static frame (no rAF loop)
   *    — the CSS .bg gradient remains the guaranteed-beautiful fallback.
   *    Always pauses when the tab is hidden.
   * ======================================================================= */
  function initBackground() {
    var canvas = doc.getElementById("bg-canvas");
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Palette (kept here so the canvas never fights the token text contrast;
    // these are background-bloom colors only, deliberately muted).
    var blobs = [
      { hue: [102, 55, 238], r: 0.55, x: 0.22, y: 0.18, ax: 0.07, ay: 0.05, sx: 0.00021, sy: 0.00017, a: 0.42 },
      { hue: [138, 99, 255], r: 0.48, x: 0.80, y: 0.30, ax: 0.09, ay: 0.06, sx: 0.00016, sy: 0.00024, a: 0.34 },
      { hue: [200, 255, 0], r: 0.30, x: 0.72, y: 0.78, ax: 0.06, ay: 0.05, sx: 0.00027, sy: 0.00013, a: 0.13 },
      { hue: [36, 17, 89], r: 0.62, x: 0.40, y: 0.85, ax: 0.05, ay: 0.04, sx: 0.00011, sy: 0.00019, a: 0.40 }
    ];

    var dpr = 1;
    var w = 0;
    var h = 0;
    var minDim = 0;

    function resize() {
      // Cap DPR — the aurora is soft, so 1.5x is plenty and far cheaper than 3x.
      dpr = Math.min(win.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth || win.innerWidth;
      h = canvas.clientHeight || win.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      minDim = Math.max(w, h);
    }

    function paint(t) {
      ctx.clearRect(0, 0, w, h);

      // Deep-indigo base wash so the canvas reads even before blobs land.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(13, 10, 31, 1)";
      ctx.fillRect(0, 0, w, h);

      // Additive light blooms.
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var cx = (b.x + Math.sin(t * b.sx + i) * b.ax) * w;
        var cy = (b.y + Math.cos(t * b.sy + i * 1.3) * b.ay) * h;
        var rad = b.r * minDim;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        var c = b.hue;
        g.addColorStop(0, "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + b.a + ")");
        g.addColorStop(1, "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function ready() {
      // Fade the canvas in once the first frame is painted.
      canvas.classList.add("is-ready");
    }

    resize();
    subscribeResize(resize);

    // --- Static path: mobile / touch / reduced-motion -> one frame, no loop.
    var animateAllowed = !prefersReduced && hasFinePointer && isDesktop;

    if (!animateAllowed) {
      paint(0);
      ready();
      // Re-paint static frame on resize so it stays crisp; cheap & one-shot.
      subscribeResize(function () {
        paint(0);
      });
      // If the environment later flips to motion-OK (rare), we could upgrade,
      // but the CSS gradient fallback already guarantees beauty — keep it lean.
      return;
    }

    // --- Animated path -----------------------------------------------------
    var running = false;
    var startTs = 0;
    var rafId = 0;

    function loop(ts) {
      if (!running) return;
      if (!startTs) startTs = ts;
      paint(ts - startTs);
      rafId = raf(loop);
    }
    function start() {
      if (running) return;
      running = true;
      startTs = 0;
      rafId = raf(loop);
    }
    function stop() {
      running = false;
      if (rafId && win.cancelAnimationFrame) win.cancelAnimationFrame(rafId);
    }

    // Pause when the tab is hidden (saves battery / CPU).
    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) stop();
      else start();
    });

    // If the user switches on reduced-motion mid-session, freeze on a frame.
    onMQ(mqReduce, function (e) {
      if (e.matches) {
        stop();
        paint(0);
      } else if (!doc.hidden) {
        start();
      }
    });

    paint(0);
    ready();
    start();
  }

  /* =========================================================================
   * 2) STICKY HEADER + SCROLL PROGRESS BAR
   * ======================================================================= */
  function initHeaderAndProgress() {
    var header = $("[data-header]");
    var progress = $("[data-scroll-progress]");
    var threshold = 8;

    subscribeScroll(function (y) {
      if (header) {
        if (y > threshold) header.setAttribute("data-scrolled", "true");
        else header.removeAttribute("data-scrolled");
      }
      if (progress) {
        var max = (doc.documentElement.scrollHeight - win.innerHeight) || 1;
        progress.style.setProperty("--scroll", clamp(y / max, 0, 1).toFixed(4));
      }
    });
  }

  /* =========================================================================
   * 3) MOBILE NAV (hamburger) — [data-nav-toggle] toggles aria + [data-open]
   *    on both the desktop list and the mobile menu panel; locks scroll.
   * ======================================================================= */
  function initNav() {
    var toggle = $("[data-nav-toggle]");
    var menu = $("[data-mobile-menu]");
    var list = $("[data-nav-list]");
    var header = $("[data-header]");
    if (!toggle || (!menu && !list)) return;

    var open = false;
    var panel = menu || list;

    function setOpen(state) {
      open = state;
      toggle.setAttribute("aria-expanded", state ? "true" : "false");
      toggle.setAttribute("aria-label", state ? "Close menu" : "Open menu");

      if (menu) {
        if (state) {
          menu.hidden = false;
          // next frame so any transition plays from the hidden state
          raf(function () {
            menu.setAttribute("data-open", "true");
          });
        } else {
          menu.removeAttribute("data-open");
          win.setTimeout(function () {
            if (!open) menu.hidden = true;
          }, 360);
        }
      }
      if (list) {
        if (state) list.setAttribute("data-open", "true");
        else list.removeAttribute("data-open");
      }
      if (header) {
        if (state) header.classList.add("is-nav-open");
        else header.classList.remove("is-nav-open");
      }
      // Lock background scroll while the menu is open.
      docEl.style.overflow = state ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(!open);
    });

    // Close when any link inside the panel is clicked.
    if (panel) {
      $all("a", panel).forEach(function (a) {
        a.addEventListener("click", function () {
          if (open) setOpen(false);
        });
      });
    }

    // Close on Escape, return focus to the toggle.
    doc.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && open) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Auto-close when resizing up to desktop.
    onMQ(mqDesktop, function (e) {
      if (e.matches && open) setOpen(false);
    });
  }

  /* =========================================================================
   * 4) KINETIC SPLIT TEXT — wrap each word/line in a span with --i stagger.
   *    Must run BEFORE the reveal observer so the new spans are styled.
   * ======================================================================= */
  function initSplit() {
    var heads = $all("[data-split]");
    if (!heads.length) return;

    heads.forEach(function (el) {
      if (el.getAttribute("data-split-done") === "true") return;

      var mode = el.getAttribute("data-split") === "lines" ? "lines" : "words";

      // Preserve any inline accent spans (e.g. .text-grad) by splitting on a
      // shallow walk: we rebuild the heading from its child nodes, wrapping
      // text words while keeping element children intact.
      var idx = 0;
      var frag = doc.createDocumentFragment();

      function wrapWord(word) {
        var span = doc.createElement("span");
        span.className = "split__word";
        span.style.setProperty("--i", idx++);
        span.textContent = word;
        return span;
      }

      function processText(text, accentClass) {
        var parts = text.split(/(\s+)/); // keep whitespace tokens
        for (var i = 0; i < parts.length; i++) {
          var token = parts[i];
          if (token === "") continue;
          if (/^\s+$/.test(token)) {
            frag.appendChild(doc.createTextNode(token));
          } else {
            var ws = wrapWord(token);
            if (accentClass) ws.className += " " + accentClass;
            frag.appendChild(ws);
          }
        }
      }

      var children = Array.prototype.slice.call(el.childNodes);
      children.forEach(function (node) {
        if (node.nodeType === 3) {
          // text node
          processText(node.textContent, null);
        } else if (node.nodeType === 1) {
          // element (accent span etc.) — wrap its words, carry its classes
          processText(node.textContent || "", node.className || "");
        }
      });

      // For "lines" mode we still split per word but tag the element so CSS can
      // choose to reveal by visual line if it wants; per-word is the safe,
      // dependency-free default and looks great either way.
      if (mode === "lines") el.classList.add("split--lines");

      el.innerHTML = "";
      el.appendChild(frag);
      el.setAttribute("data-split-done", "true");

      // Reduced motion / no IO: just show it now.
      if (prefersReduced || !supportsIO) {
        el.classList.add("is-visible");
      }
    });
  }

  /* =========================================================================
   * 5) REVEAL ON SCROLL — .reveal -> .is-visible (staggered). Also flips
   *    split headings to is-visible so their words cascade in.
   * ======================================================================= */
  function initReveal() {
    var items = $all(".reveal");
    var splits = $all("[data-split]");
    // De-dupe (a heading can be both .reveal and [data-split])
    var seen = [];
    function add(el) {
      if (seen.indexOf(el) === -1) seen.push(el);
    }
    items.forEach(add);
    splits.forEach(add);
    if (!seen.length) return;

    if (prefersReduced || !supportsIO) {
      seen.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    // Apply transition-delay from reveal--delay-N modifier.
    seen.forEach(function (el) {
      var m = el.className.match(/reveal--delay-(\d)/);
      if (m) el.style.transitionDelay = parseInt(m[1], 10) * 90 + "ms";
    });

    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    seen.forEach(function (el) {
      io.observe(el);
    });
  }

  /* =========================================================================
   * 6) PARALLAX — data-parallax="speed" translateY by scroll progress.
   *    Disabled on reduced-motion / coarse pointer. Transform only.
   * ======================================================================= */
  function initParallax() {
    var els = $all("[data-parallax]");
    if (!els.length) return;

    if (prefersReduced || !hasFinePointer) {
      els.forEach(function (el) {
        el.style.transform = "";
      });
      return;
    }

    var items = els.map(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
      return { el: el, speed: clamp(speed, 0, 0.4), y: 0 };
    });

    var vh = win.innerHeight || 800;
    subscribeResize(function () {
      vh = win.innerHeight || 800;
    });

    subscribeScroll(function () {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var rect = it.el.getBoundingClientRect();
        // Progress of the element's center relative to viewport center: -1..1
        var center = rect.top + rect.height / 2;
        var rel = (center - vh / 2) / vh; // ~ -1 (below) .. 1 (above)
        // Move opposite to scroll for a gentle float; cap travel.
        var ty = -rel * it.speed * 100;
        it.el.style.transform = "translate3d(0," + ty.toFixed(2) + "px,0)";
      }
    });
  }

  /* =========================================================================
   * 7) PINNED SCENE — data-pin: write --progress 0..1 as the section scrolls
   *    through the viewport. Drives the process timeline fill + step states.
   * ======================================================================= */
  function initPin() {
    var pins = $all("[data-pin]");
    if (!pins.length) return;

    // Even under reduced motion we set --progress (CSS may use it for a
    // non-animated highlight); it's just a value, not a motion effect.
    var vh = win.innerHeight || 800;
    subscribeResize(function () {
      vh = win.innerHeight || 800;
    });

    subscribeScroll(function () {
      for (var i = 0; i < pins.length; i++) {
        var el = pins[i];
        var rect = el.getBoundingClientRect();
        // Start filling when the section top reaches ~70% down the viewport,
        // finish when its bottom passes ~30% up. Smooth 0..1 across the scroll.
        var start = vh * 0.7;
        var end = -rect.height + vh * 0.3;
        var p = (start - rect.top) / (start - end);
        el.style.setProperty("--progress", clamp(p, 0, 1).toFixed(4));
      }
    });
  }

  /* =========================================================================
   * 8) STAT COUNTERS — .stat__num[data-count][data-suffix] count up on enter.
   * ======================================================================= */
  function initCounters() {
    var nums = $all(".stat__num");
    if (!nums.length) return;

    function paintFinal(el) {
      el.textContent =
        (el.getAttribute("data-count") || "0") + (el.getAttribute("data-suffix") || "");
    }

    if (prefersReduced || !supportsIO) {
      nums.forEach(paintFinal);
      return;
    }

    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          obs.unobserve(el);

          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var dur = 1500;
          var startTs = null;

          function step(ts) {
            if (startTs === null) startTs = ts;
            var p = clamp((ts - startTs) / dur, 0, 1);
            var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) raf(step);
            else el.textContent = target + suffix;
          }
          raf(step);
        });
      },
      { threshold: 0.45 }
    );

    nums.forEach(function (el) {
      io.observe(el);
    });
  }

  /* =========================================================================
   * 9) HERO ROTATING WORD — [data-rotator] is a vertical stack of items;
   *    we translate the list up one item at a time. Reduced motion shows the
   *    first word statically. Pauses when tab hidden.
   * ======================================================================= */
  function initRotator() {
    var list = $("[data-rotator]");
    if (!list) return;
    var items = $all(".hero__rotator-item", list);
    if (items.length < 2) return;

    // Reduced motion: collapse to the first item, no cycling.
    if (prefersReduced) {
      list.style.transform = "none";
      for (var i = 1; i < items.length; i++) items[i].style.display = "none";
      return;
    }

    var index = 0;
    var timer = null;
    var intervalMs = 2200;

    list.style.willChange = "transform";
    list.style.transition = "transform 520ms cubic-bezier(.16,1,.3,1)";

    function show(n) {
      // Each item occupies one line height; translate by n line heights.
      var first = items[0];
      var lineH = first.offsetHeight || first.getBoundingClientRect().height || 0;
      list.style.transform = "translateY(" + -(n * lineH) + "px)";
      // Mark active item (CSS may fade siblings).
      for (var i = 0; i < items.length; i++) {
        if (i === n) items[i].classList.add("is-active");
        else items[i].classList.remove("is-active");
      }
    }

    function next() {
      index = (index + 1) % items.length;
      // When wrapping back to 0, snap without transition to keep it seamless
      // only if we duplicated the first; here list is finite, so a smooth
      // scroll back to top reads fine and is cheap.
      show(index);
    }

    function start() {
      if (timer === null) timer = win.setInterval(next, intervalMs);
    }
    function stop() {
      if (timer !== null) {
        win.clearInterval(timer);
        timer = null;
      }
    }

    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) stop();
      else start();
    });
    subscribeResize(function () {
      show(index); // recompute line height on resize
    });

    show(0);
    start();
  }

  /* =========================================================================
   * 10) TILT — data-tilt cards rotate toward the pointer. Desktop / fine
   *     pointer only; auto-disabled on touch / reduced-motion.
   * ======================================================================= */
  function initTilt() {
    if (prefersReduced || !hasFinePointer) return;
    var cards = $all("[data-tilt]");
    if (!cards.length) return;

    var MAX = 7; // degrees

    cards.forEach(function (card) {
      var frame = 0;
      var tx = 0,
        ty = 0;

      function apply() {
        frame = 0;
        card.style.transform =
          "perspective(900px) rotateX(" +
          ty.toFixed(2) +
          "deg) rotateY(" +
          tx.toFixed(2) +
          "deg)";
      }

      card.addEventListener("pointermove", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width; // 0..1
        var py = (e.clientY - r.top) / r.height; // 0..1
        tx = (px - 0.5) * 2 * MAX;
        ty = -(py - 0.5) * 2 * MAX;
        card.style.setProperty("--tilt-mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--tilt-my", (py * 100).toFixed(1) + "%");
        if (!frame) frame = raf(apply);
      });

      card.addEventListener("pointerleave", function () {
        if (frame) {
          win.cancelAnimationFrame && win.cancelAnimationFrame(frame);
          frame = 0;
        }
        card.style.transform = "";
      });
    });
  }

  /* =========================================================================
   * 11) MAGNETIC BUTTONS — data-magnetic pulls toward the cursor. Desktop /
   *     fine pointer only.
   * ======================================================================= */
  function initMagnetic() {
    if (prefersReduced || !hasFinePointer) return;
    var els = $all("[data-magnetic]");
    if (!els.length) return;

    var STRENGTH = 0.32;
    var RADIUS = 1.4; // multiplier of element size for the active field

    els.forEach(function (el) {
      var frame = 0;
      var x = 0,
        y = 0;

      function apply() {
        frame = 0;
        el.style.transform = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px)";
      }

      el.addEventListener("pointermove", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        var r = el.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = (Math.max(r.width, r.height) / 2) * RADIUS;
        if (dist < maxDist) {
          x = dx * STRENGTH;
          y = dy * STRENGTH;
        } else {
          x = 0;
          y = 0;
        }
        if (!frame) frame = raf(apply);
      });

      el.addEventListener("pointerleave", function () {
        x = 0;
        y = 0;
        if (frame) {
          win.cancelAnimationFrame && win.cancelAnimationFrame(frame);
          frame = 0;
        }
        el.style.transform = "";
      });
    });
  }

  /* =========================================================================
   * 12) CUSTOM CURSOR — [data-cursor] follows the pointer with an eased ring;
   *     grows .is-hover over interactive targets. Fine pointer only.
   * ======================================================================= */
  function initCursor() {
    var cursor = $("[data-cursor]");
    if (!cursor) return;

    if (prefersReduced || !hasFinePointer) {
      cursor.style.display = "none";
      return;
    }

    var dot = $(".cursor__dot", cursor);
    var ring = $(".cursor__ring", cursor);

    var mx = win.innerWidth / 2,
      my = win.innerHeight / 2;
    var rx = mx,
      ry = my; // eased ring position
    var visible = false;

    win.addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        mx = e.clientX;
        my = e.clientY;
        if (!visible) {
          visible = true;
          cursor.classList.add("is-visible");
        }
      },
      { passive: true }
    );

    win.addEventListener("pointerout", function (e) {
      if (!e.relatedTarget && !e.toElement) {
        visible = false;
        cursor.classList.remove("is-visible");
      }
    });

    // Hover state over interactive / [data-cursor-skip] aware targets.
    var hoverSel = 'a, button, [role="button"], input, textarea, select, [data-tilt], [data-magnetic], .faq__trigger';
    doc.addEventListener(
      "pointerover",
      function (e) {
        var t = e.target;
        if (t && t.closest) {
          if (t.closest("[data-cursor-skip]")) {
            cursor.classList.remove("is-hover");
          } else if (t.closest(hoverSel)) {
            cursor.classList.add("is-hover");
          }
        }
      },
      true
    );
    doc.addEventListener(
      "pointerout",
      function (e) {
        var t = e.target;
        if (t && t.closest && t.closest(hoverSel)) {
          cursor.classList.remove("is-hover");
        }
      },
      true
    );

    function loop() {
      // Dot snaps; ring eases for a premium trailing feel.
      rx = lerp(rx, mx, 0.18);
      ry = lerp(ry, my, 0.18);
      if (dot) dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
      if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) translate(-50%,-50%)";
      raf(loop);
    }
    raf(loop);
  }

  /* =========================================================================
   * 13) FAQ ACCORDION — single-open, accessible. Toggles aria-expanded and
   *     [data-open] on the panel (CSS grid-rows 0fr/1fr transition).
   * ======================================================================= */
  function initFaq() {
    var triggers = $all(".faq__trigger");
    if (!triggers.length) return;

    function close(trigger) {
      var id = trigger.getAttribute("aria-controls");
      var panel = id ? doc.getElementById(id) : null;
      trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.removeAttribute("data-open");
      var item = trigger.closest(".faq__item");
      if (item) item.classList.remove("is-open");
    }

    function open(trigger) {
      var id = trigger.getAttribute("aria-controls");
      var panel = id ? doc.getElementById(id) : null;
      trigger.setAttribute("aria-expanded", "true");
      if (panel) {
        // Two rAFs so the 0fr -> 1fr transition reliably plays.
        raf(function () {
          raf(function () {
            panel.setAttribute("data-open", "true");
          });
        });
      }
      var item = trigger.closest(".faq__item");
      if (item) item.classList.add("is-open");
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        if (expanded) {
          close(trigger);
        } else {
          triggers.forEach(function (other) {
            if (other !== trigger) close(other);
          });
          open(trigger);
        }
      });
    });
  }

  /* =========================================================================
   * 14) SMOOTH IN-PAGE ANCHOR SCROLL — respects reduced-motion (auto), moves
   *     focus for a11y, updates the hash without a second jump.
   * ======================================================================= */
  function initSmoothScroll() {
    var behavior = prefersReduced ? "auto" : "smooth";

    $all('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;
        var target = doc.getElementById(href.slice(1));
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: behavior, block: "start" });

        var hadTab = target.hasAttribute("tabindex");
        if (!hadTab) target.setAttribute("tabindex", "-1");
        try {
          target.focus({ preventScroll: true });
        } catch (err) {
          target.focus();
        }
        if (!hadTab) {
          target.addEventListener("blur", function handler() {
            target.removeAttribute("tabindex");
            target.removeEventListener("blur", handler);
          });
        }
        if (win.history && win.history.replaceState) {
          win.history.replaceState(null, "", href);
        }
      });
    });
  }

  /* =========================================================================
   * 15) SCROLL-SPY NAV — set .nav__link.is-active for the section in view.
   * ======================================================================= */
  function initScrollSpy() {
    var links = $all(".nav__link[href^='#'], .mobile-menu__link[href^='#']");
    if (!links.length) return;

    // Map of section id -> array of links that point to it.
    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var sec = id && doc.getElementById(id);
      if (!sec) return;
      if (!map[id]) {
        map[id] = [];
        sections.push(sec);
      }
      map[id].push(link);
    });
    if (!sections.length) return;

    function activate(id) {
      links.forEach(function (l) {
        var match = l.getAttribute("href") === "#" + id;
        l.classList.toggle("is-active", match);
        if (match) l.setAttribute("aria-current", "true");
        else l.removeAttribute("aria-current");
      });
    }

    if (supportsIO) {
      var visible = {};
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            visible[entry.target.id] = entry.isIntersecting
              ? entry.intersectionRatio
              : 0;
          });
          // Pick the most-visible tracked section.
          var bestId = null;
          var bestRatio = 0;
          for (var k in visible) {
            if (visible[k] > bestRatio) {
              bestRatio = visible[k];
              bestId = k;
            }
          }
          if (bestId) activate(bestId);
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      sections.forEach(function (s) {
        io.observe(s);
      });
    } else {
      // Fallback: nearest-section on scroll.
      subscribeScroll(function (y) {
        var best = null;
        var bestDist = Infinity;
        sections.forEach(function (s) {
          var d = Math.abs(s.getBoundingClientRect().top - 120);
          if (d < bestDist) {
            bestDist = d;
            best = s;
          }
        });
        if (best) activate(best.id);
      });
    }
  }

  /* =========================================================================
   * BOOT
   * ======================================================================= */
  function init() {
    // Order matters: split must run before reveal so the new word spans get
    // their is-visible cascade; background is independent.
    initBackground();
    initHeaderAndProgress();
    initNav();
    initSplit();
    initReveal();
    initParallax();
    initPin();
    initCounters();
    initRotator();
    initTilt();
    initMagnetic();
    /* initCursor disabled (laggy cursor) */
    initFaq();
    initSmoothScroll();
    initScrollSpy();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
