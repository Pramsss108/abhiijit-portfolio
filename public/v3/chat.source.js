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

  const history = [];
  let pending = false;

  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) input.focus();
  });
  closeBtn.addEventListener("click", () => {
    panel.hidden = true;
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

  async function submit() {
    const text = input.value.trim();
    if (!text || pending) return;
    pending = true;
    send.disabled = true;
    addMessage(text, "user");
    input.value = "";
    history.push({ role: "user", content: text });
    const loadingId = "ai-ab-loading-" + Date.now();
    addMessage("", "loading", loadingId);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error("AI Engine unavailable");
      const data = await res.json();
      let reply = "I'm sorry, I couldn't process that.";
      if (data.choices && data.choices[0] && data.choices[0].message) {
        reply = data.choices[0].message.content;
      } else if (data.generated_text) {
        reply = data.generated_text;
      }
      document.getElementById(loadingId)?.remove();
      addMessage(reply, "ai");
      history.push({ role: "assistant", content: reply });
    } catch (err) {
      console.error(err);
      document.getElementById(loadingId)?.remove();
      addMessage("Can't reach the AI right now — please try again in a moment.", "error");
      history.pop();
    } finally {
      pending = false;
      send.disabled = false;
      input.focus();
    }
  }

  send.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit();
  });
});
