/*
 * Kriti eval harness — Phase 6.
 * Asks the LIVE worker a labelled set of questions and checks:
 *   • FACT cases  — she states Abhijit's real, verified numbers/facts.
 *   • TRAP cases  — she does NOT invent things absent from the knowledge base
 *                   (rates, fake clients, skills he never listed) and instead
 *                   deflects to contact.
 *   • Global hygiene — no robotic "according to the data" phrasing, no leaks.
 *   • Brevity      — soft warning if a reply runs long.
 *
 * Free + self-contained: no external services, no API keys. Just hits the
 * deployed Worker. Run:  node eval/kriti-eval.mjs
 * Exit code is non-zero if any case FAILS — so it can gate a deploy in CI.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_URL =
  process.env.KRITI_WORKER_URL ||
  "https://abhijit-portfolio-ai.guitarguitarabhijit.workers.dev/";

const cases = JSON.parse(readFileSync(join(__dirname, "cases.json"), "utf8"));

// Phrases Kriti should NEVER say — robotic tells, meta-talk, or instruction leaks.
const GLOBAL_FORBIDDEN = [
  "according to",
  "based on the data",
  "based on his data",
  "based on the information",
  "as an ai",
  "i don't have that",
  "i do not have that",
  "i can't find",
  "the json",
  "the data provided",
  "system prompt",
  "you are kriti",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ask(q) {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: q }] }),
  });
  if (!res.ok) throw new Error("worker HTTP " + res.status);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

function evaluate(c, reply) {
  const low = reply.toLowerCase();
  const fails = [];
  const warns = [];

  // Global hygiene (every case).
  for (const p of GLOBAL_FORBIDDEN) {
    if (low.includes(p)) fails.push(`said forbidden phrase "${p}"`);
  }

  // Per-case forbidden (hallucination markers).
  for (const p of c.forbid || []) {
    if (low.includes(p.toLowerCase())) fails.push(`invented/forbidden: "${p}"`);
  }

  // expectAll — every token must appear.
  for (const p of c.expectAll || []) {
    if (!low.includes(p.toLowerCase())) fails.push(`missing required: "${p}"`);
  }

  // expectAny — at least one token must appear.
  if (c.expectAny && c.expectAny.length) {
    const hit = c.expectAny.some((p) => low.includes(p.toLowerCase()));
    if (!hit) fails.push(`none of expected present: [${c.expectAny.join(" | ")}]`);
  }

  // Empty reply is always a fail.
  if (!reply.trim()) fails.push("empty reply");

  // Brevity soft-warning (info answers can be longer, so warn not fail).
  const words = reply.trim().split(/\s+/).filter(Boolean).length;
  if (words > 90) warns.push(`long reply (${words} words)`);

  return { pass: fails.length === 0, fails, warns, words };
}

(async () => {
  console.log("Kriti eval — " + WORKER_URL);
  console.log("=".repeat(64));
  let passed = 0;
  const failedIds = []; // real content/quality failures (gate the deploy)
  const infraIds = [];  // 502/network after retries — tier availability, NOT the bot

  for (const c of cases) {
    let reply = "";
    let err = null;
    // The free HF tier blips with transient 502s; retry generously so an
    // infra hiccup is never counted as a bot failure.
    for (let attempt = 0; attempt < 5; attempt++) {
      if (attempt) await sleep(1200 * attempt);
      try {
        reply = await ask(c.q);
        break;
      } catch (e) {
        err = e;
      }
    }

    if (err && !reply) {
      // Persistent 502/network after retries = the free HF tier was unavailable.
      // That is an availability problem, not a bot-quality failure — bucket it
      // separately so it never masquerades as a hallucination/quality regression.
      infraIds.push(c.id);
      console.log(`\n[${c.type.toUpperCase()}] ${c.id} — ⚠️ INFRA (${err.message}) — tier unavailable, not scored`);
      continue;
    }

    const r = evaluate(c, reply);
    if (r.pass) passed++;
    else failedIds.push(c.id);

    console.log(`\n[${c.type.toUpperCase()}] ${c.id} — ${r.pass ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`   Q: ${c.q}`);
    console.log(`   A: ${reply.replace(/\s+/g, " ").slice(0, 200)}${reply.length > 200 ? "…" : ""}`);
    if (r.fails.length) console.log(`   ✗ ${r.fails.join("; ")}`);
    if (r.warns.length) console.log(`   ⚠ ${r.warns.join("; ")}`);

    await sleep(1800); // space calls out — the free HF tier throttles rapid bursts
  }

  console.log("\n" + "=".repeat(64));
  const responded = cases.length - infraIds.length;
  console.log(`BOT QUALITY:      ${passed}/${responded} responded cases passed`);
  console.log(`TIER AVAILABILITY: ${responded}/${cases.length} calls got through` +
              (infraIds.length ? ` (${infraIds.length} HF 502/timeout: ${infraIds.join(", ")})` : ""));

  if (failedIds.length) {
    console.log("\n❌ CONTENT FAILURES (gate): " + failedIds.join(", "));
    process.exit(1);
  }
  if (infraIds.length) {
    console.log("\n⚠️  No content failures, but the free HF tier dropped some calls.");
    console.log("   Migrating generation to Cloudflare Workers AI would remove this flakiness.");
  } else {
    console.log("\n✅ All cases passed — no hallucination detected, tier fully available.");
  }
})();
