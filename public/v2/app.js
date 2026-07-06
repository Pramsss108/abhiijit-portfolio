(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------- */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---------------------------------------------------------------------
   * Mobile navigation (hamburger)
   * ------------------------------------------------------------------- */
  function initNav() {
    var header = $("[data-header]");
    var toggle = $("[data-nav-toggle]");
    var nav = $("[data-nav]");
    if (!toggle || !nav || !header) return;

    function isOpen() {
      return nav.getAttribute("data-open") === "true";
    }

    function openNav() {
      nav.setAttribute("data-open", "true"); // CSS opens via .nav__list[data-open="true"]
      header.classList.add("is-nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    function closeNav() {
      nav.setAttribute("data-open", "false");
      header.classList.remove("is-nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    toggle.addEventListener("click", function () {
      if (isOpen()) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close when a nav link is clicked
    $all("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        if (isOpen()) closeNav();
      });
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && isOpen()) {
        closeNav();
        toggle.focus();
      }
    });

    // Close if resized up to desktop
    var mq = window.matchMedia("(min-width: 768px)");
    var onChange = function () {
      if (mq.matches && isOpen()) closeNav();
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
    } else if (mq.addListener) {
      mq.addListener(onChange);
    }
  }

  /* ---------------------------------------------------------------------
   * Sticky header — "scrolled" state
   * ------------------------------------------------------------------- */
  function initStickyHeader() {
    var header = $("[data-header]");
    if (!header) return;

    var threshold = 12;
    var ticking = false;

    function update() {
      // CSS styles the scrolled state via .site-header[data-scrolled="true"]
      header.setAttribute("data-scrolled", window.pageYOffset > threshold ? "true" : "false");
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------------
   * Hero rotating word
   * ------------------------------------------------------------------- */
  function initRotator() {
    var el = document.getElementById("rotator");
    if (!el) return;

    var words = [
      "SEO",
      "Content Writing",
      "Content Marketing",
      "Social Media",
      "WordPress",
      "AI Workflows",
      "Video Editing",
      "Analytics",
      "Branding"
    ];

    // Reduced motion: just show a static (first) word, no cycling.
    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    var index = 0;
    var intervalMs = 2200;
    var timer = null;

    // Ensure CSS transitions have something to animate.
    el.style.display = "inline-block";
    el.style.willChange = "transform, opacity";
    el.style.transition = "transform 350ms ease, opacity 350ms ease";

    function showNext() {
      // animate out
      el.style.opacity = "0";
      el.style.transform = "translateY(-0.4em)";

      window.setTimeout(function () {
        index = (index + 1) % words.length;
        el.textContent = words[index];

        // jump to "below" position, then animate in
        el.style.transition = "none";
        el.style.transform = "translateY(0.4em)";
        // force reflow so the next transition applies
        void el.offsetHeight;
        el.style.transition = "transform 350ms ease, opacity 350ms ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 350);
    }

    function start() {
      if (timer === null) {
        timer = window.setInterval(showNext, intervalMs);
      }
    }

    function stop() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    // Pause when the tab is hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });

    start();
  }

  /* ---------------------------------------------------------------------
   * Reveal on scroll (IntersectionObserver)
   * ------------------------------------------------------------------- */
  function initReveal() {
    var items = $all(".reveal");
    if (!items.length) return;

    // Reduced motion or no IO support: reveal everything instantly.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    // Apply a small stagger via inline transition-delay based on the
    // reveal--delay-N modifier class (falls back to 0).
    items.forEach(function (el) {
      var delay = 0;
      var match = el.className.match(/reveal--delay-(\d)/);
      if (match) {
        delay = parseInt(match[1], 10) * 90;
      }
      if (delay > 0) {
        el.style.transitionDelay = delay + "ms";
      }
    });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
      }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
   * FAQ accordion (single-open)
   * ------------------------------------------------------------------- */
  function initFaq() {
    var triggers = $all(".faq__trigger");
    if (!triggers.length) return;

    function close(trigger) {
      var panelId = trigger.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      trigger.setAttribute("aria-expanded", "false");
      if (panel) {
        panel.removeAttribute("data-open"); // CSS collapses grid-rows 1fr->0fr
        window.setTimeout(function () {
          if (trigger.getAttribute("aria-expanded") === "false") panel.hidden = true;
        }, 320);
      }
      var item = trigger.closest(".faq__item");
      if (item) item.classList.remove("is-open");
    }

    function open(trigger) {
      var panelId = trigger.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      trigger.setAttribute("aria-expanded", "true");
      if (panel) {
        panel.hidden = false;
        // next frame(s) so the grid-template-rows transition actually plays
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
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
          // single-open: close the others
          triggers.forEach(function (other) {
            if (other !== trigger) close(other);
          });
          open(trigger);
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Smooth in-page anchor scrolling
   * ------------------------------------------------------------------- */
  function initSmoothScroll() {
    var behavior = prefersReducedMotion ? "auto" : "smooth";

    $all('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;

        var target = document.getElementById(href.slice(1));
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({ behavior: behavior, block: "start" });

        // Move focus for accessibility without an extra visible jump.
        var hadTabindex = target.hasAttribute("tabindex");
        if (!hadTabindex) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (!hadTabindex) {
          target.addEventListener(
            "blur",
            function handler() {
              target.removeAttribute("tabindex");
              target.removeEventListener("blur", handler);
            }
          );
        }

        // Update the URL hash without an additional jump.
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", href);
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------- */
  /* ---------------------------------------------------------------------
   * Animated stat counters (count up when the stats bar enters view)
   * ------------------------------------------------------------------- */
  function initCounters() {
    var nums = $all(".stat__num");
    if (!nums.length) return;

    function paint(el) {
      el.textContent = (el.getAttribute("data-count") || "0") + (el.getAttribute("data-suffix") || "");
    }
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      nums.forEach(paint);
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
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
          var p = Math.min((ts - startTs) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.45 });
    nums.forEach(function (el) { io.observe(el); });
  }

  function init() {
    initNav();
    initStickyHeader();
    initRotator();
    initReveal();
    initCounters();
    initFaq();
    initSmoothScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();