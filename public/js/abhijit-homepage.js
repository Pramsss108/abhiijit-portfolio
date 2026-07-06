(function () {
  "use strict";

  const profile = {
    name: "Abhijit Pramanik",
    title: "Proof-backed SEO, content, WordPress and AI workflow portfolio",
    email: "growabhijit@gmail.com",
    domain: "abhijit.works"
  };

  const serviceMap = new Map([
    ["Agency Hosting", "Analytics & Reporting"],
    ["Website Security", "Video Marketing"],
    ["Wix Development", "Portfolio Websites"],
    ["Wix Website", "Portfolio Websites"],
    ["Themes And Plugins Development", "WordPress Systems"],
    ["Custom Website Development", "Web Development"],
    ["Custom Web Development", "Web Development"],
    ["App Development", "AI Marketing Systems"],
    ["Software Development", "No-Code Builds"],
    ["SEO", "Search Engine Optimization"],
    ["SEO ", "Search Engine Optimization"],
    ["Content Writing", "Content Writing & Marketing"],
    ["WordPress Website", "WordPress Publishing"],
    ["No Code  Development", "AI and No-Code"],
    ["No Code Development", "AI and No-Code"],
    ["No Code Website Development", "AI and No-Code"],
    ["No Code Website", "AI and No-Code"],
    ["Wordpress Development", "WordPress Publishing"],
    ["WordPress Development", "WordPress Publishing"],
    ["Dedicated Support", "Workflow Support"],
    ["Dedicated Tech Team", "Workflow Support"],
    ["Development Support", "Workflow Support"]
  ]);

  const textMap = new Map([
    ["Welcome to Abhijit Pramanik", "Abhijit Pramanik"],
    ["We Are Connecting You", "I Build Proof"],
    ["With The", "Across"],
    ["Website", "SEO"],
    ["Chat Now", "WhatsApp"],
    ["Strategizing, Creating & Growing Brands!", profile.title],
    ["Turning Ideas into Digital Experiences for 36+ Companies", "36 companies mapped. 40 proof projects. 11 skill routes."],
    ["Why Choose Us", "Why Work With Abhijit"],
    ["Our Previous Works", "Selected Proof-Backed Work"],
    ["From WordPress to MERN, we build fast, responsive websites tailored to your goals.", "From SEO briefs to WordPress publishing, content calendars, visuals, reports, and AI workflow systems."],
    ["Focus on Ideas-We'll Handle the Development!", "Bring the role, project, or JD. I will map the right proof and workflow."],
    ["Focus on Ideas-We Handle the Development!", "Bring the role, project, or JD. I will map the right proof and workflow."],
    ["Join us and flourish with Abhijit Pramanik", "Need SEO, content, WordPress, social media, or AI workflow support?"],
    ["The best tools for the best outcomes", "Tools Behind The Proof"],
    ["process?", "process"],
    ["See our process", "See proof process"],
    ["Key Outputs", "Proof Outputs"],
    ["Key Outputs ", "Proof Outputs"],
    ["Sweet Reviews From Our Clients", "Proof Cards, Not Fake Testimonials"],
    ["Frequently asked questions", "Questions Recruiters And Clients Ask"],
    ["Didn't find the answer here?", "Have a role, project, or collaboration?"],
    ["Contact our team", "Contact Abhijit"],
    ["Copyright 2024 Abhijit Pramanik PVT LTD", "Copyright 2026 Abhijit Pramanik. Proof-backed personal portfolio."]
  ]);

  const processMap = new Map([
    ["Ideation & Evaluation", "Understand The Target"],
    ["Discovery & Research", "Research Keywords And Proof"],
    ["UX Design", "Build The Content System"],
    ["UI Design", "Publish And Organize"],
    ["Development", "Measure And Improve"],
    ["Support", "Document The Proof"]
  ]);

  const regexTextReplacements = [
    {
      test: /^Focus on Ideas[\u2014-]We[\u2019']ll Handle the Development!$/i,
      value: "Bring the role, project, or JD. I will map the right proof and workflow."
    },
    {
      test: /^Copyright\s+\u00a9?\s*2024\s+Abhijit Pramanik PVT LTD$/i,
      value: "Copyright 2026 Abhijit Pramanik. Proof-backed personal portfolio."
    },
    {
      test: /^You should never feel awkward/i,
      value: "A modern personal portfolio for recruiters and clients to scan real proof: SEO strategy, semantic content, WordPress publishing, social media operations, creative assets, and AI/no-code systems."
    }
  ];

  const projectNames = [
    { name: "Pursueit Dubai", proof: "SEO content strategy, SEMrush, LSI, PAA, SERP research, Meta Business Suite" },
    { name: "ReachHub", proof: "Influencer marketing support, WordPress integration, UTM builder, social media banners" },
    { name: "Balihans Bengaluru", proof: "SEO, copywriting, WordPress updates, LinkedIn lead generation, CRM support" },
    { name: "Ymedia", proof: "SEO content production, keyword workflows, publishing support, visual coordination" },
    { name: "Aura Love Yourself USA", proof: "SEO-friendly content, ebooks, social posts, CapCut creative edits, Facebook ad assets" },
    { name: "Madquick Client Project", proof: "Website adaptation, portfolio conversion planning, service-page copy and local QA" },
    { name: "MAMAI CARE", proof: "Content, visual media, social proof organization and campaign support" },
    { name: "Rabin's Photography", proof: "Creative assets, visual presentation, local business content and portfolio support" }
  ];

  const proofCards = [
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

  const skills = [
    "SEO strategy", "Semantic SEO", "LSI and PAA research", "SEMrush", "Google Analytics",
    "WordPress publishing", "Content writing", "Content strategy", "Social media management",
    "Meta Business Suite", "Canva", "CapCut", "Video editing", "No-code app building",
    "AI workflow systems", "Lead generation", "CRM support", "Portfolio systems"
  ];

  const paragraphReplacements = [
    {
      test: /As a full-service web design company/i,
      value: "This homepage is a proof-backed personal portfolio. It is designed to show the work Abhijit can actually support: SEO, content strategy, WordPress publishing, social media operations, creative assets, no-code builds, and AI-assisted workflows."
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
      test: /Yes, we ensure that your website is mobile-friendly/i,
      value: "Yes. I ensure all websites and portfolios are mobile-friendly. As a solo specialist, I personally check layouts, touch targets, and loading speed across devices."
    },
    {
      test: /How long has your company been established/i,
      value: "How long have you been working in digital marketing?"
    },
    {
      test: /How many staff work there/i,
      value: "Are you a freelancer or part of a team?"
    },
    {
      test: /Can I consult about ymy skills first/i,
      value: "Can I consult with you about my project first?"
    },
    {
      test: /Our team is here to assist you with any questions/i,
      value: "I am here to assist you with any questions you may have."
    }
  ];

  function clean(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function isLeaf(el) {
    return el && (el.children.length === 0 || /^(A|BUTTON|SPAN|P|H1|H2|H3|H4|H5|H6)$/i.test(el.tagName));
  }

  function textNodes() {
    return Array.from(document.body.querySelectorAll("a, button, span, p, h1, h2, h3, h4, h5, h6, .elementor-heading-title, .elementor-icon-list-text, .elementor-image-box-title"));
  }

  function replaceExactText() {
    textNodes().forEach((el) => {
      if (!isLeaf(el)) return;
      const original = clean(el.textContent);
      const service = serviceMap.get(original);
      const regexMatch = regexTextReplacements.find((item) => item.test.test(original));
      const mapped = textMap.get(original) || processMap.get(original) || service || (regexMatch && regexMatch.value);
      if (!mapped) return;
      el.textContent = mapped;
      el.classList.add("ap-copy-updated");
    });
  }

  function replaceParagraphs() {
    Array.from(document.body.querySelectorAll("p, .elementor-testimonial-content, .elementor-widget-text-editor")).forEach((el) => {
      if (!isLeaf(el)) return;
      const original = clean(el.textContent);
      const match = paragraphReplacements.find((item) => item.test.test(original));
      if (!match) return;
      el.textContent = match.value;
      el.classList.add("ap-copy-updated");
    });
  }

  function updateProjects() {
    const oldProjectNames = new Set(["Lebely", "Simplehyped", "Picckie", "Disposablemails", "10Minutes.Email"]);
    const candidates = Array.from(document.body.querySelectorAll("h2, h3, h4, a, .elementor-heading-title"));
    let index = 0;

    candidates.forEach((el) => {
      if (!isLeaf(el)) return;
      const text = clean(el.textContent);
      if (!oldProjectNames.has(text)) return;

      const item = projectNames[index % projectNames.length];
      el.textContent = item.name;
      el.classList.add("ap-copy-updated");
      index += 1;
    });
  }

  function updateTestimonials() {
    const wrappers = Array.from(document.body.querySelectorAll(".elementor-testimonial-wrapper"));
    wrappers.forEach((wrapper, index) => {
      const item = proofCards[index % proofCards.length];
      const content = wrapper.querySelector(".elementor-testimonial-content");
      const name = wrapper.querySelector(".elementor-testimonial-name");
      const job = wrapper.querySelector(".elementor-testimonial-job");
      if (content) content.textContent = item.content;
      if (name) name.textContent = item.name;
      if (job) job.textContent = item.job;
      wrapper.classList.add("ap-proof-testimonial");
    });
  }

  var _heroCycleTimer = null;

  function updateHeroMotionText() {
    var fancy = document.querySelector('[data-fancy-text-id="67c4459"]');
    if (!fancy) return;
    var container = fancy.closest('.eael-fancy-text-container');
    if (!container) return;
    container.removeAttribute('data-fancy-text');
    container.removeAttribute('data-fancy-text-loop');
    container.removeAttribute('data-fancy-text-action');

    var skills = [
      "SEO Systems",
      "Content Writing",
      "Content Marketing",
      "Web Dev",
      "Social Media",
      "AI Marketing",
      "Video Editing",
      "Viral Growth",
      "Digital Growth",
      "Portfolio Sites",
      "Analytics",
      "Branding"
    ];

    // Nuke the old EAEL/Morphext-infected span, replace with clean one
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

    // Clean cycle — no Morphext, no conflicts
    if (_heroCycleTimer) { clearInterval(_heroCycleTimer); _heroCycleTimer = null; }
    var i = 0;
    function tick() {
      var word = skills[i];
      newSpan.classList.toggle('ap-long-skill', word.length > 12);
      newSpan.setAttribute('title', word);
      // Ensure the text has the correct color and typography by keeping Elementor's structure
      newSpan.innerHTML = '<span class="animated bounceIn">' + word + '</span>';
      i = (i + 1) % skills.length;
    }
    tick();
    _heroCycleTimer = setInterval(tick, 2200);
    container.style.minWidth = 'clamp(280px, 38vw, 560px)';
    container.style.textAlign = 'center';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
  }

  function updateMetaLinks() {
    document.title = "Abhijit Pramanik | Proof-Backed SEO, Content, WordPress and AI Workflow Portfolio";
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://abhijit.works/");

    Array.from(document.querySelectorAll("a[href]")).forEach((link) => {
      const label = clean(link.textContent).toLowerCase();
      if (label.includes("contact") || label.includes("get started")) {
        link.setAttribute("href", "mailto:" + profile.email + "?subject=Portfolio%20conversation%20for%20Abhijit");
      }
    });
  }

  var _portfolioCopyApplied = false;

  function applyPortfolioCopy() {
    if (_portfolioCopyApplied) return; // Run once — prevent double-init flash
    _portfolioCopyApplied = true;

    document.body.classList.add("abhijit-portfolio-home");
    replaceExactText();
    replaceParagraphs();
    updateProjects();
    updateTestimonials();
    updateHeroMotionText();
    updateMetaLinks();
    // Reveal — all text is now Abhijit's, no more MadQuick flash
    document.body.classList.remove("pre-portfolio");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPortfolioCopy);
  } else {
    applyPortfolioCopy();
  }

  // Safety net: if DOMContentLoaded somehow didn't fire, catch on load
  window.addEventListener("load", function () {
    window.setTimeout(applyPortfolioCopy, 100);
  });
})();
