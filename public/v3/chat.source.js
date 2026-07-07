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

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
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
