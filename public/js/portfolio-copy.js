(function () {
  "use strict";

  var profile = {
    name: "Abhijit Pramanik",
    email: "growabhijit@gmail.com",
    domain: "abhijit.works",
    phoneDigits: "918777849865"
  };

  var heroWords = [
    "SEO",
    "Content Writing",
    "Content Marketing",
    "Websites",
    "Social Media",
    "AI Marketing",
    "Video Editing",
    "Viral Growth",
    "Digital Marketing",
    "Portfolio Sites",
    "Analytics",
    "Branding"
  ];

  var exactText = new Map([
    ["Madquick - Web Development Company", "Abhijit Pramanik | Proof-Backed SEO, Content, WordPress and AI Workflow Portfolio"],
    ["Welcome to Madquick", "I'm Abhijit Pramanik"],
    ["Welcome to Abhijit Pramanik", "I'm Abhijit Pramanik"],
    ["We Are Connecting You", "I Build Proof"],
    ["With The", "Across"],
    ["Chat Now", "WhatsApp"],
    ["Contact Us", "Contact"],
    ["About Us", "About Me"],
    ["Services", "Skills"],
    ["Strategizing, Creating & Growing Brands!", "Proof-backed SEO, content, WordPress and AI workflow portfolio"],
    ["Turning Ideas into Digital Experiences for 36+ Companies", "36 companies mapped. 40 proof projects. 11 skill routes."],
    ["Why Choose Us", "Why Work With Abhijit"],
    ["Our Previous Works", "Selected Proof-Backed Work"],
    ["From WordPress to MERN, we build fast, responsive websites tailored to your goals.", "From SEO briefs to WordPress publishing, content calendars, visuals, reports, and AI workflow systems."],
    ["Focus on Ideas-We'll Handle the Development!", "Bring the role, project, or brief. I will map the right proof and workflow."],
    ["Focus on Ideas-We Handle the Development!", "Bring the role, project, or brief. I will map the right proof and workflow."],
    ["Join us and flourish with MadQuick", "Need SEO, content, WordPress, social media, or AI workflow support?"],
    ["The best tools for the best outcomes", "Tools Behind The Proof"],
    ["See our process", "See proof process"],
    ["Key Outputs", "Proof Outputs"],
    ["Key Outputs ", "Proof Outputs"],
    ["Sweet Reviews From Our Clients", "Proof Cards, Not Fake Testimonials"],
    ["Frequently asked questions", "Questions Recruiters And Clients Ask"],
    ["Didn't find the answer here?", "Have a role, project, or collaboration?"],
    ["Contact our team", "Contact Abhijit"],
    ["Copyright © 2024 Madquick PVT LTD", "Copyright 2026 Abhijit Pramanik. Proof-backed personal portfolio."],
    // FAQ — reframed from agency/company questions to recruiter/client
    // questions for a personal proof-backed portfolio.
    ["How long has your company been established?", "How long have you been doing this work?"],
    ["How many staff work there?", "Do you work solo or with a team?"],
    ["What platforms do you work with?", "What tools and platforms do you use?"],
    ["Can I consult about ymy skills first?", "Can we discuss my project or role first?"],
    ["Can I consult about my skills first?", "Can we discuss my project or role first?"],
    ["Will my website be mobile-friendly?", "Will my website be mobile-friendly and SEO-ready?"],
    ["Can you create a logo for my brand?", "Can you handle SEO, content, and social together?"]
  ]);

  var serviceText = new Map([
    ["Agency Hosting", "Analytics"],
    ["Website Security", "Video Marketing"],
    ["Wix Development", "Portfolio Sites"],
    ["Wix Website", "Portfolio Sites"],
    ["Themes And Plugins Development", "Theme & Plugin Dev"],
    ["Custom Website Development", "Website Development"],
    ["Custom Web Development", "Website Development"],
    ["App Development", "AI Marketing"],
    ["Software Development", "No-Code Builds"],
    ["SEO", "SEO Strategy"],
    ["SEO ", "SEO Strategy"],
    ["Content Writing", "Content Writing (SEO)"],
    ["WordPress Website", "WordPress Publishing"],
    ["No Code  Development", "AI & No-Code"],
    ["No Code Development", "AI & No-Code"],
    ["No Code Website Development", "AI & No-Code"],
    ["No Code Website", "AI & No-Code"],
    ["Wordpress Development", "WordPress Publishing"],
    ["WordPress Development", "WordPress Publishing"],
    ["WordPress Publishing", "WordPress Publishing"],
    ["Theme/Plugins Development", "Theme & Plugin Dev"],
    ["Dedicated Support", "Workflow Support"],
    ["Dedicated Tech Team", "Workflow Support"],
    ["Development Support", "Workflow Support"]
  ]);

  var processText = new Map([
    ["Ideation & Evaluation", "Understand The Target"],
    ["Discovery & Research", "Research Keywords And Proof"],
    ["UX Design", "Build The Content System"],
    ["UI Design", "Publish And Organize"],
    ["Development", "Measure And Improve"],
    ["Support", "Document The Proof"]
  ]);

  // Regex-based heading/copy replacements. Unlike the exact-match maps above,
  // these survive em-dash vs hyphen differences and reworded leftover template
  // copy. Matched on a distinctive substring so trailing text does not matter.
  var regexText = [
    { test: /^I believe that true digital creativity/i, value: "Proof-backed digital growth for" },
    { test: /As a dedicated digital marketing specialist/i, value: "Every service here is proof-backed work I have actually delivered — SEO, content, WordPress, social media, and AI workflows for 36+ companies across India, Dubai, and the USA." },
    { test: /From WordPress to MERN/i, value: "From WordPress publishing to no-code and AI-assisted builds — real websites, content systems, and workflows shipped for 36+ companies." },
    { test: /Focus on Ideas.{0,4}We.?ll Handle the Development/i, value: "Bring the role, project, or brief — I will map the right proof and workflow." },
    { test: /Design with creative freedom/i, value: "Real work. Real proof. Let's build yours." },
    { test: /Join us and flourish with/i, value: "Need SEO, content, WordPress, social media, or AI workflow support?" },
    { test: /^Best UI design$/i, value: "SEO Briefs & Articles" },
    { test: /^Custom Features$/i, value: "WordPress & Content Systems" }
  ];

  var paragraphRules = [
    {
      test: /^You should never feel awkward/i,
      value: "I turn SEO, content, WordPress, social media, and AI workflows into real, verifiable digital growth, backed by hands-on proof across 30+ companies in India, Dubai, and the USA."
    },
    {
      test: /As a full-service web design company/i,
      value: "This is a proof-backed personal portfolio. It shows work Abhijit can actually support: SEO, content strategy, WordPress publishing, social media operations, creative assets, no-code builds, and AI-assisted workflows."
    },
    {
      test: /Our mission is to nurture that creativity/i,
      value: "At 25, I have partnered with 36+ companies globally, from Dubai-based fitness platforms to Kolkata startups, across SEO, content strategy, social media, WordPress, and AI-powered workflows."
    },
    {
      test: /In the Research phase, we dive deep/i,
      value: "Research starts with the role, market, keyword set, client context, and proof source. The goal is to select only the strongest matching projects and avoid generic claims."
    },
    {
      test: /User Experience Design focuses on creating/i,
      value: "The work is converted into readable outputs: SEO briefs, WordPress pages, social calendars, visual assets, dashboards, resume bullets, portfolio cards, and client-friendly documentation."
    },
    {
      test: /Our company has 25 dedicated staff members/i,
      value: "This is a solo proof-backed portfolio supported by documented projects, tools, and client work samples."
    },
    {
      test: /Absolutely! We.re here to discuss how our services/i,
      value: "Yes. You can discuss SEO, content, WordPress, social media, AI workflows, portfolio pages, or project support first."
    },
    {
      test: /Absolutely! Madquick is a comprehensive agency/i,
      value: "Yes. I can support brand positioning, content structure, portfolio presentation, SEO planning, and practical digital workflow setup."
    },
    {
      test: /various platforms, including WordPress/i,
      value: "I work mainly with WordPress, plus Wix and no-code/AI tools — choosing the right platform for your goal rather than forcing one stack."
    },
    {
      test: /here to discuss how my skills/i,
      value: "Yes — happy to discuss how my SEO, content, WordPress, social media, and AI workflow skills can support your goals. Just tell me what you need."
    },
    {
      test: /we ensure that your website is mobile-friendly/i,
      value: "Yes — every site I build is responsive and mobile-first, tested across phones and tablets, and structured for SEO so it performs well in search."
    },
    {
      test: /comprehensive agency with a specialized branding/i,
      value: "I'm a solo, proof-backed specialist — not an agency. I personally handle SEO, content, WordPress, social media, and AI workflows, and I'll point you to trusted help for anything outside that."
    }
  ];

  var projects = [
    { name: "Pursueit Dubai", proof: "SEO content strategy, SEMrush, LSI, PAA, SERP research, Meta Business Suite" },
    { name: "ReachHub", proof: "Influencer marketing support, WordPress integration, UTM builder, social media banners" },
    { name: "Balihans Bengaluru", proof: "SEO, copywriting, WordPress updates, LinkedIn lead generation, CRM support" },
    { name: "Ymedia", proof: "SEO content production, keyword workflows, publishing support, visual coordination" },
    { name: "Aura Love Yourself USA", proof: "SEO-friendly content, ebooks, social posts, CapCut creative edits, Facebook ad assets" },
    { name: "Madquick Client Project", proof: "Website adaptation, portfolio conversion planning, service-page copy and local QA" },
    { name: "MAMAI CARE", proof: "Content, visual media, social proof organization and campaign support" },
    { name: "Rabin's Photography", proof: "Creative assets, visual presentation, local business content and portfolio support" }
  ];

  var proofCards = [
    {
      content: "Documented SEO and content work across India, Dubai, and USA clients, including keyword strategy, WordPress publishing, social media execution, and proof-backed assets.",
      name: "SEO and Content Proof",
      job: "Pursueit, ReachHub, Balihans, Ymedia"
    },
    {
      content: "Hands-on workflow experience across Canva, CapCut, SEMrush, Google Analytics, Meta Business Suite, WordPress, no-code systems, and AI-assisted research.",
      name: "Tools and Workflow Proof",
      job: "Creative, analytics, publishing, operations"
    },
    {
      content: "The portfolio uses proof cards instead of fake client testimonials. Each card explains what the work shows and which skill family it supports.",
      name: "Proof-Based Impact",
      job: "Safer for recruiters and clients"
    }
  ];

  function clean(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function isLeaf(el) {
    return el && (el.children.length === 0 || /^(A|BUTTON|SPAN|P|H1|H2|H3|H4|H5|H6)$/i.test(el.tagName));
  }

  function nodes() {
    return Array.from(document.body.querySelectorAll("a, button, span, p, h1, h2, h3, h4, h5, h6, .elementor-heading-title, .elementor-icon-list-text, .elementor-image-box-title"));
  }

  function replaceText() {
    nodes().forEach(function (el) {
      if (!isLeaf(el)) return;
      if (el.closest(".eael-fancy-text-container")) return;
      var original = clean(el.textContent);
      var mapped = exactText.get(original) || serviceText.get(original) || processText.get(original);
      if (!mapped) return;
      el.textContent = mapped;
    });
  }

  var _heroIndex = 0;
  var _heroCycleTimer = null;

  function enforceHeroWords() {
    var fancy = document.querySelector('[data-fancy-text-id="67c4459"]');
    if (!fancy) return;
    var container = fancy.closest('.eael-fancy-text-container');
    if (!container) return;
    
    // Stop EAEL Morphext from taking over
    container.removeAttribute('data-fancy-text');
    container.removeAttribute('data-fancy-text-loop');
    container.removeAttribute('data-fancy-text-action');

    // Make sure we only initialize once
    if (container.dataset.apHeroReady) return;
    container.dataset.apHeroReady = "1";

    // Nuke the old EAEL/Morphext-infected span
    Array.from(container.querySelectorAll('.eael-fancy-text-strings, .ap-hero-skill-word')).forEach(function (oldSpan) {
      try { if(window.jQuery) jQuery(oldSpan).removeData(); } catch(e) {}
      oldSpan.remove();
    });

    var newSpan = document.createElement('span');
    newSpan.id = 'eael-fancy-text-67c4459';
    newSpan.className = 'eael-fancy-text-strings solid-color';
    newSpan.style.display = 'inline-block';
    newSpan.style.whiteSpace = 'nowrap';
    newSpan.style.textAlign = 'center';
    newSpan.style.width = '100%';
    container.appendChild(newSpan);

    if (_heroCycleTimer) { clearInterval(_heroCycleTimer); _heroCycleTimer = null; }
    _heroIndex = 0;
    
    function tick() {
      var word = heroWords[_heroIndex];
      newSpan.classList.toggle('ap-long-word', word.length > 10);
      newSpan.setAttribute('title', word);
      // Ensure the text has the correct color and typography by keeping Elementor's structure
      newSpan.innerHTML = '<span class="animated bounceIn">' + word + '</span>';
      _heroIndex = (_heroIndex + 1) % heroWords.length;
    }
    
    tick();
    _heroCycleTimer = setInterval(tick, 2200);
    container.style.minWidth = 'clamp(280px, 38vw, 560px)';
    container.style.textAlign = 'center';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
  }

  function updateInternalLinks() {
    var internal = new Map([
      ["", "/index.html"],
      ["#", "#"],
      ["/", "/index.html"],
      ["index.html", "/index.html"],
      ["./index.html", "/index.html"],
      ["about-us.html", "/about-us.html"],
      ["./about-us.html", "/about-us.html"],
      ["contact-us.html", "/contact-us.html"],
      ["./contact-us.html", "/contact-us.html"]
    ]);

    Array.from(document.querySelectorAll("a[href]")).forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href === "#" || href.startsWith("#")) return;
      var cleanHref = href.split("?")[0].split("#")[0];
      if (internal.has(cleanHref)) {
        link.setAttribute("href", internal.get(cleanHref));
      }
    });
  }

  function normalizeMenuLabels() {
    Array.from(document.querySelectorAll("#menu-main-menu > li > a")).forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.includes("about-us.html")) {
        link.textContent = "About Me";
      } else if (href.includes("contact-us.html")) {
        link.textContent = "Contact";
      } else if (href === "#" || href.startsWith("#")) {
        link.textContent = "Skills";
      } else if (href.includes("index.html") || href === "/") {
        link.textContent = "Home";
      }
    });
  }

  function updateLogo() {
    var logoLinks = Array.from(document.querySelectorAll(".elementor-element-53134697 a, .elementskit-nav-logo"));
    logoLinks.forEach(function (link) {
      // Rebuild only if our SVG mark isn't already in place (header builder can
      // re-render the logo; we re-assert but never stack duplicates).
      if (link.querySelector(".ap-logo")) return;
      link.dataset.apLogoReady = "1";
      link.setAttribute("href", "/index.html");
      link.textContent = "";
      var compact = window.innerWidth < 768;
      var mark = document.createElement("span");
      mark.className = "ap-logo";
      mark.setAttribute("aria-label", profile.name);
      var img = '<img src="/images/brand/ap-logo-primary.svg" class="ap-logo__mark" alt="AP" width="48" height="48">';
      mark.innerHTML = compact ? img : img + '<span class="ap-logo__name">' + profile.name + "</span>";
      link.appendChild(mark);
    });
  }

  function replaceParagraphs() {
    Array.from(document.body.querySelectorAll("p, .elementor-testimonial-content, .elementor-widget-text-editor")).forEach(function (el) {
      if (!isLeaf(el)) return;
      var original = clean(el.textContent);
      var match = paragraphRules.find(function (rule) { return rule.test.test(original); });
      if (!match) return;
      el.textContent = match.value;
    });
  }

  function replaceProjects() {
    var oldNames = new Set(["Lebely", "Simplehyped", "Picckie", "Disposablemails", "10Minutes.Email"]);
    var index = 0;
    nodes().forEach(function (el) {
      if (!isLeaf(el) || !oldNames.has(clean(el.textContent))) return;
      el.textContent = projects[index % projects.length].name;
      index += 1;
    });

    Array.from(document.body.querySelectorAll(".elementor-widget-text-editor p")).forEach(function (p, index) {
      var text = clean(p.textContent);
      if (!/No more losses|Professionally designed|Disposable|Email/.test(text)) return;
      p.textContent = projects[index % projects.length].proof;
    });
  }

  function replaceTestimonials() {
    Array.from(document.body.querySelectorAll(".elementor-testimonial-wrapper")).forEach(function (wrapper, index) {
      var item = proofCards[index % proofCards.length];
      var content = wrapper.querySelector(".elementor-testimonial-content");
      var name = wrapper.querySelector(".elementor-testimonial-name");
      var job = wrapper.querySelector(".elementor-testimonial-job");
      if (content) content.textContent = item.content;
      if (name) name.textContent = item.name;
      if (job) job.textContent = item.job;
    });
  }

  function updateLinks() {
    document.title = "Abhijit Pramanik | Proof-Backed SEO, Content, WordPress and AI Workflow Portfolio";
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://" + profile.domain + "/");

    Array.from(document.querySelectorAll("a[href]")).forEach(function (link) {
      var label = clean(link.textContent).toLowerCase();
      var isMenuLink = !!link.closest("#menu-main-menu, .elementskit-navbar-nav, .elementskit-nav-identity-panel");
      if (isMenuLink) return;
      if (label.includes("whatsapp") || label.includes("let's talk")) {
        link.setAttribute("href", "https://wa.me/" + profile.phoneDigits);
      } else if (label.includes("contact") || label.includes("get started")) {
        link.setAttribute("href", "mailto:" + profile.email + "?subject=Portfolio%20conversation%20for%20Abhijit");
      }
    });
  }

  // Apply regex copy rules to headings / titles the exact-match maps miss
  // (em-dash variants, reworded leftover Madquick agency copy).
  function replaceRegexText() {
    var els = document.querySelectorAll(
      "h1, h2, h3, h4, h5, .elementor-heading-title, .elementor-icon-box-title, .heading-title, .elementor-icon-list-text, p"
    );
    Array.prototype.forEach.call(els, function (el) {
      if (el.dataset.apRegexDone) return;
      if (el.querySelector && el.querySelector(".jkit-animated-text, .dynamic-wrapper")) return;
      var original = clean(el.textContent);
      if (!original) return;
      for (var i = 0; i < regexText.length; i++) {
        if (regexText[i].test.test(original)) {
          el.textContent = regexText[i].value;
          el.dataset.apRegexDone = "1";
          break;
        }
      }
    });
  }

  // The "I believe that true digital creativity is within [Brands/Startups/
  // Creators]" block: keep the rotating animation, drop the leftover "is" and
  // "within " glue so it reads "Proof-backed digital growth for <rotating>".
  function fixRotatingHeadline() {
    var normal = document.querySelector(".jkit-animated-text .normal-text");
    if (normal && /within/i.test(normal.textContent)) {
      normal.textContent = "";
    }
    Array.prototype.forEach.call(document.querySelectorAll("h1, h2, h3, h4"), function (h) {
      if (!h.dataset.apHidIs && clean(h.textContent).toLowerCase() === "is") {
        h.style.display = "none";
        h.dataset.apHidIs = "1";
      }
    });
  }

  // ── Ribbon revamp ──────────────────────────────────────────────────────
  // The two scrolling ribbons used mismatched PNG "logo" images (different
  // letter sizes, generic dev frameworks like ReactJS/Laravel/Shopify). We
  // throw those away and rebuild each ribbon from real data as uniform CSS
  // text (styled in portfolio-stabilizer.css → .ap-ribbon-text), so every
  // item shares the same size/weight/spacing. Ribbon 1 = skills, ribbon 2 =
  // tools. Edit these arrays to change ribbon content.
  var ribbonSkills = [
    "SEO STRATEGY", "CONTENT WRITING", "WORDPRESS", "SOCIAL MEDIA",
    "AI WORKFLOWS", "VIDEO EDITING", "ANALYTICS", "NO-CODE BUILDS",
    "CANVA DESIGN", "COPYWRITING", "SEMANTIC SEO"
  ];
  var ribbonTools = [
    "SEMRUSH", "RANKMATH", "GOOGLE ANALYTICS", "META BUSINESS SUITE",
    "CANVA", "CAPCUT", "WORDPRESS", "UBERSUGGEST", "WIX", "NEURONWRITER"
  ];

  function buildRibbon(wrapper, items, dark) {
    if (!wrapper || wrapper.dataset.apRibbonBuilt) return;
    wrapper.innerHTML = "";
    items.forEach(function (label) {
      var slide = document.createElement("div");
      slide.className = "swiper-slide ap-ribbon-slide";
      var span = document.createElement("span");
      // dark variant for the lime-green ribbon (white text would vanish on it)
      span.className = dark ? "ap-ribbon-text ap-ribbon-text--dark" : "ap-ribbon-text";
      span.textContent = label;
      slide.appendChild(span);
      wrapper.appendChild(slide);
    });
    wrapper.dataset.apRibbonBuilt = "1";
  }

  function revampRibbons() {
    var wraps = document.querySelectorAll(".elementor-image-carousel-wrapper");
    Array.prototype.forEach.call(wraps, function (carousel, i) {
      var wrapper = carousel.querySelector(".swiper-wrapper");
      if (!wrapper) return;
      // Choose text theme from the ribbon's own background so contrast is
      // always correct even if the violet/lime order changes.
      var bg = getComputedStyle(carousel).backgroundColor || "";
      var lime = /206,\s*255|255,\s*255|255,\s*254/.test(bg) || isLightBg(carousel);
      buildRibbon(wrapper, i === 0 ? ribbonSkills : ribbonTools, lime);
    });
  }

  // True when the nearest painted background behind the element is light
  // (so ribbon text should be dark for contrast).
  function isLightBg(el) {
    for (var p = el; p; p = p.parentElement) {
      var c = getComputedStyle(p).backgroundColor;
      if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
        var m = c.match(/\d+/g);
        if (!m) return false;
        var lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]);
        return lum > 150;
      }
    }
    return false;
  }

  // Frame the showcase mockups as premium "screens" (rounded + shadow via
  // .ap-proof-screen) so dark AI images sit cleanly on the white showcase band.
  function tagProofScreens() {
    var h = Array.prototype.find.call(
      document.querySelectorAll("h2, h3"),
      function (e) { return /Proof-backed digital growth/i.test(e.textContent); }
    );
    if (!h) return;
    var sec = h.closest("section, .e-con.e-parent, .elementor-top-section");
    if (!sec) return;
    Array.prototype.forEach.call(sec.querySelectorAll("img"), function (img) {
      if (img.getBoundingClientRect().width > 300) img.classList.add("ap-proof-screen");
    });
  }

  function applyCopy() {
    enforceHeroWords();
    revampRibbons();
    tagProofScreens();
    replaceText();
    replaceRegexText();
    fixRotatingHeadline();
    replaceParagraphs();
    replaceProjects();
    replaceTestimonials();
    updateInternalLinks();
    normalizeMenuLabels();
    updateLogo();
    updateLinks();
    initCarouselAutoplay();
    initMarquees();
    initLogoCarouselsAutoplay();
    enforceHeroWords();
  }

  // ── Carousel auto-scroll (smooth continuous loop) ──
  // Animates ONLY the two card carousels we want moving: the first service-card
  // carousel and the proof-card / testimonial carousel. Other nested carousels
  // on the page are left alone (animating all of them over-clones tiny ones).
  function animateCarousel(carousel) {
    if (!carousel || carousel.dataset.apCarouselReady) return;
    var wrapper = carousel.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    var slides = wrapper.querySelectorAll('.swiper-slide:not(.ap-cloned)');
    if (slides.length < 2) return;

    // Width of ONE original set of slides (incl. horizontal margins).
    var setWidth = 0;
    Array.prototype.forEach.call(slides, function (slide) {
      var cs = window.getComputedStyle(slide);
      var w = slide.offsetWidth + (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0);
      setWidth += (w > 0 ? w : 320);
    });
    if (setWidth < 300) return; // not a real card carousel — skip
    carousel.dataset.apCarouselReady = '1';

    // Hand scrolling to a GPU-composited CSS marquee (keyframe ap-card-scroll in
    // portfolio-stabilizer.css) — far smoother than per-frame requestAnimationFrame,
    // especially under load. Neutralize Swiper's own transform first.
    carousel.classList.add('ap-cards');
    wrapper.style.setProperty('transition', 'none', 'important');
    wrapper.style.transform = 'none';
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'nowrap';
    wrapper.style.width = 'max-content';
    wrapper.style.willChange = 'transform';

    // Clone whole sets so the strip always overfills the viewport during the
    // one-set scroll, then loops seamlessly (every set is identical).
    if (!wrapper.querySelector('.ap-cloned')) {
      var sets = Math.min(6, Math.max(1, Math.ceil(window.innerWidth / setWidth)));
      for (var i = 0; i < sets; i++) {
        Array.prototype.forEach.call(slides, function (slide) {
          var clone = slide.cloneNode(true);
          clone.classList.add('ap-cloned');
          clone.removeAttribute('style');
          wrapper.appendChild(clone);
        });
      }
    }

    // Translate exactly one set width, linear, forever → seamless loop.
    var pxPerSec = 55; // calm, premium pace
    wrapper.style.setProperty('--ap-scroll', (-Math.round(setWidth)) + 'px');
    wrapper.style.animation = 'ap-card-scroll ' + Math.max(20, Math.round(setWidth / pxPerSec)) + 's linear infinite';
  }

  function initCarouselAutoplay() {
    // 1) service-card carousel (first one on the page)
    animateCarousel(document.querySelector('.e-n-carousel.swiper-initialized'));
    // 2) proof-card / testimonial carousel(s) — identified by testimonial cards
    Array.prototype.forEach.call(
      document.querySelectorAll('.e-n-carousel.swiper-initialized'),
      function (c) {
        if (c.querySelector('.elementor-testimonial-wrapper, .elementor-testimonial')) {
          animateCarousel(c);
        }
      }
    );
  }

  // ── Tech Skills marquee initializer ──
  // The NEXTJS/SHOPIFY strip uses wd-marquee CSS class which needs JS to clone rows
  function initMarquees() {
    var marquees = Array.from(document.querySelectorAll('.wd-marquee'));
    marquees.forEach(function(marquee) {
      var contents = marquee.querySelectorAll('.wd-marquee-content');
      if (contents.length === 0) return;
      // Ensure at least 2 copies for seamless loop
      if (contents.length < 2) {
        var clone = contents[0].cloneNode(true);
        marquee.appendChild(clone);
      }
      // Force animation restart
      contents.forEach(function(c) {
        c.style.animationPlayState = 'running';
      });
    });
  }
  // ── Logo/Tech Carousels auto-scroll (the NEXTJS/SHOPIFY strips) ──
  function initLogoCarouselsAutoplay() {
    var logoCarousels = Array.from(document.querySelectorAll('.elementor-image-carousel-wrapper'));
    logoCarousels.forEach(function(carousel) {
      if (carousel.dataset.apAutoplayReady) return;
      var wrapper = carousel.querySelector('.swiper-wrapper');
      if (!wrapper) return;
      var slides = Array.from(carousel.querySelectorAll('.swiper-slide:not(.ap-custom-cloned)'));
      if (slides.length < 2) return;

      // Override Swiper's native transition to stop glitch
      wrapper.style.setProperty('transition', 'none', 'important');
      wrapper.style.setProperty('transition-duration', '0s', 'important');
      wrapper.style.display = 'flex';
      wrapper.style.willChange = 'transform';
      
      // Calculate exact total width of original slides
      var totalWidth = 0;
      slides.forEach(function(slide) {
        var cs = window.getComputedStyle(slide);
        var w = slide.offsetWidth + (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0);
        if (w <= 0) w = 200; // Fallback so we don't freeze if hidden
        totalWidth += w;
      });

      // Absolute safety fallback
      if (totalWidth <= 0) totalWidth = 1000;

      // We need enough copies to fill the screen * 2
      var copiesNeeded = Math.max(2, Math.ceil((window.innerWidth * 2) / totalWidth));

      if (!wrapper.querySelector('.ap-custom-cloned')) {
        for (var i = 1; i < copiesNeeded; i++) {
          slides.forEach(function(slide) {
            var clone = slide.cloneNode(true);
            clone.classList.add('ap-custom-cloned');
            wrapper.appendChild(clone);
          });
        }
      }

      var isRTL = carousel.querySelector('.swiper-rtl') !== null ||
                  carousel.classList.contains('swiper-rtl');
      var currentX = 0;
      var speed = 1.0; // Silky smooth speed

      function step() {
        if (!document.hidden && !carousel.matches(':hover')) {
          if (isRTL) {
            currentX += speed;
            if (currentX >= 0) currentX = -totalWidth;
          } else {
            currentX -= speed;
            if (Math.abs(currentX) >= totalWidth) currentX = 0;
          }
          wrapper.style.transform = 'translate3d(' + currentX + 'px, 0px, 0px)';
        }
        requestAnimationFrame(step);
      }
      carousel.dataset.apAutoplayReady = '1';
      requestAnimationFrame(step);
    });
  }


  function scheduleApply(delay) {
    window.clearTimeout(scheduleApply.timer);
    scheduleApply.timer = window.setTimeout(applyCopy, delay || 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyCopy);
  } else {
    applyCopy();
  }

  window.addEventListener("load", function () {
    window.setTimeout(applyCopy, 50);
    window.setInterval(enforceHeroWords, 1000);
  });

  window.addEventListener("pageshow", function () {
    scheduleApply(50);
  });

  window.addEventListener("focus", function () {
    scheduleApply(50);
  });

  document.addEventListener("mouseover", function (event) {
    if (event.target.closest("#menu-main-menu, .elementskit-megamenu-panel")) {
      scheduleApply(80);
      window.setTimeout(applyCopy, 250);
    }
  }, true);

  document.addEventListener("click", function (event) {
    if (event.target.closest("#menu-main-menu, .elementskit-megamenu-panel")) {
      scheduleApply(80);
      window.setTimeout(applyCopy, 250);
    }
  }, true);

  window.addEventListener("resize", function () {
    window.setTimeout(updateLogo, 50);
  });
})();
