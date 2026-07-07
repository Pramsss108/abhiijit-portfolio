/*
 * AI chat widget — EDITABLE SOURCE.
 * scripts/build-v3.mjs minifies this file into chat.js (which is what the page loads).
 * Never edit chat.js directly; it is overwritten on every build.
 */
const WORKER_URL = "https://abhijit-portfolio-ai.guitarguitarabhijit.workers.dev/";

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("ai-ab-toggle");
  const panel = document.getElementById("ai-ab-panel");
  const closeBtn = document.getElementById("ai-ab-close");
  const input = document.getElementById("ai-ab-input");
  const send = document.getElementById("ai-ab-send");
  const messages = document.getElementById("ai-ab-messages");
  if (!toggle || !panel || !closeBtn || !input || !send || !messages) return;

  const suggest = document.getElementById("ai-ab-suggest");
  const history = [];
  let pending = false;

  // Autofocus pops the keyboard (and zooms) on phones — desktop only.
  const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  input.maxLength = 500;
  messages.setAttribute("aria-live", "polite");
  toggle.setAttribute("aria-expanded", "false");

  // Suggested-question chips: fill the input and send, then retire them.
  if (suggest) {
    suggest.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-q]");
      if (!chip) return;
      input.value = chip.getAttribute("data-q");
      suggest.hidden = true;
      submit();
    });
  }

  // Proactive welcome bubble: introduces Kriti so visitors know it's a live AI.
  const nudge = document.getElementById("ai-ab-nudge");
  const nudgeClose = document.getElementById("ai-ab-nudge-close");
  let nudgeShown = false;
  function hideNudge(remember) {
    if (nudge) nudge.hidden = true;
    if (remember) {
      try { sessionStorage.setItem("ai-ab-nudge-seen", "1"); } catch (e) {}
    }
  }
  function maybeShowNudge() {
    if (!nudge || nudgeShown || !panel.hidden) return;
    let seen = false;
    try { seen = sessionStorage.getItem("ai-ab-nudge-seen") === "1"; } catch (e) {}
    if (seen) return;
    nudgeShown = true;
    nudge.hidden = false;
  }
  if (nudge) {
    // Show it a few seconds after load, once per session.
    window.setTimeout(maybeShowNudge, 3500);
    nudge.addEventListener("click", (e) => {
      if (e.target === nudgeClose) return; // handled below
      hideNudge(true);
      setOpen(true);
    });
    if (nudgeClose) {
      const dismiss = (e) => { e.stopPropagation(); e.preventDefault(); hideNudge(true); };
      nudgeClose.addEventListener("click", dismiss);
      nudgeClose.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") dismiss(e); });
    }
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) hideNudge(true);
    if (open && finePointer) input.focus();
    if (!open) toggle.focus();
  }
  toggle.addEventListener("click", () => setOpen(panel.hidden));
  closeBtn.addEventListener("click", () => setOpen(false));
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Escape via textContent first, then allow only **bold** and line breaks.
  function renderText(el, text) {
    el.textContent = text;
    el.innerHTML = el.innerHTML
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function addMessage(text, kind, id = null) {
    const el = document.createElement("div");
    el.className = "ai-ab-msg ai-ab-msg--" + kind;
    if (id) el.id = id;
    if (kind === "loading") {
      el.innerHTML = '<span class="ai-ab-typing"><span></span><span></span><span></span></span>';
    } else {
      renderText(el, text);
    }
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  // Conversation memory that survives a page reload (within the session): the
  // last turns are cached, so Kriti keeps the thread even if the visitor
  // navigates away and comes back.
  const HISTORY_KEY = "ai-ab-history";
  function saveHistory() {
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-12))); } catch (e) {}
  }
  function restoreHistory() {
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "null"); } catch (e) {}
    if (!Array.isArray(saved) || !saved.length) return;
    saved.forEach((m) => {
      if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return;
      history.push({ role: m.role, content: m.content });
      addMessage(m.content, m.role === "user" ? "user" : "ai");
    });
    if (history.length && suggest) suggest.hidden = true; // returning visitor: no starter chips
  }
  restoreHistory();

  // One fetch attempt; throws on any non-OK status so the caller can retry.
  async function askWorker() {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    if (!res.ok) {
      const err = new Error("AI Engine unavailable");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  async function submit() {
    const text = input.value.trim();
    if (!text || pending) return;
    if (suggest) suggest.hidden = true;
    pending = true;
    send.disabled = true;
    addMessage(text, "user");
    input.value = "";
    history.push({ role: "user", content: text });
    // Cap what we resend: old turns cost tokens and can outgrow the model context.
    if (history.length > 12) history.splice(0, history.length - 12);
    saveHistory();
    const loadingId = "ai-ab-loading-" + Date.now();
    addMessage("", "loading", loadingId);

    // Auto-retry transient failures (the free AI tier blips occasionally) so a
    // single hiccup never shows the visitor an error. Rate-limit (429) is not
    // retried — that message is intentional.
    let data = null, lastErr = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 900 * attempt));
      try {
        data = await askWorker();
        break;
      } catch (err) {
        lastErr = err;
        if (err.status === 429) break; // "too many requests" — surface it as-is
      }
    }

    document.getElementById(loadingId)?.remove();
    if (data) {
      let reply = "I'm sorry, I couldn't process that.";
      if (data.choices && data.choices[0] && data.choices[0].message) {
        reply = data.choices[0].message.content;
      } else if (data.generated_text) {
        reply = data.generated_text;
      }
      addMessage(reply, "ai");
      history.push({ role: "assistant", content: reply });
      saveHistory();
    } else {
      console.error(lastErr);
      const msg = lastErr && lastErr.status === 429
        ? "You're sending messages quickly — please wait a moment and try again."
        : "Can't reach the AI right now — please try again in a moment.";
      addMessage(msg, "error");
      history.pop();
      input.value = text; // let the user retry without retyping
    }
    pending = false;
    send.disabled = false;
    if (finePointer) input.focus();
  }

  send.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.isComposing) submit();
  });
});
