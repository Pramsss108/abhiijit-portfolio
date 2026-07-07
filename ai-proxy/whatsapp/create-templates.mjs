/*
 * Create Kriti's WhatsApp lead-notification templates via the Meta Graph API.
 *
 * WHY: creating templates by hand in Meta's UI is where things kept getting
 * rejected (wrong category). This creates clean UTILITY templates via the API,
 * which approve fast and correctly. A lead notification is a "utility" message
 * (it follows a user action — someone submitting interest on the website), NOT
 * an authentication/OTP message, which is why the OTP category kept failing.
 *
 * SECURITY: your token is read from an environment variable — it is NEVER
 * written to a file or pasted into a chat. Nothing here stores the token.
 *
 * ── HOW TO RUN (PowerShell) ────────────────────────────────────────────────
 *   cd "D:\A scret project\abhiijit-portfolio\ai-proxy\whatsapp"
 *   $env:WA_TOKEN   = "<paste your PERMANENT system-user token here>"
 *   $env:WA_WABA_ID = "2124935384968157"   # your WhatsApp Business Account ID
 *   node create-templates.mjs              # creates the templates
 *   node create-templates.mjs --list       # check approval status any time
 *
 * The token lives only in that terminal session and vanishes when you close it.
 * ───────────────────────────────────────────────────────────────────────────
 */

const GRAPH = "https://graph.facebook.com/v23.0";
const TOKEN = process.env.WA_TOKEN;
const WABA_ID = process.env.WA_WABA_ID || "2124935384968157";

if (!TOKEN) {
  console.error("❌ WA_TOKEN is not set. In PowerShell run:\n   $env:WA_TOKEN = \"<your token>\"\n   then re-run this script.");
  process.exit(1);
}

// The templates to create. Both are UTILITY (easy, correct category for lead
// alerts). Two variants so at least one sails through review.
const TEMPLATES = [
  {
    name: "new_lead_alert",
    language: "en_US",
    category: "UTILITY",
    parameter_format: "named",
    components: [
      {
        type: "BODY",
        text: "New website lead 🔔\n\nName: {{name}}\nContact: {{contact}}\nInterested in: {{interest}}\n\nReply here to follow up.",
        example: {
          body_text_named_params: [
            { param_name: "name", example: "Priya Sharma" },
            { param_name: "contact", example: "+91 90000 00000" },
            { param_name: "interest", example: "SEO for her online store" },
          ],
        },
      },
    ],
  },
  {
    name: "new_lead_basic",
    language: "en_US",
    category: "UTILITY",
    parameter_format: "named",
    components: [
      {
        type: "BODY",
        text: "You have a new website lead 🔔\n\n{{details}}\n\nReply here to follow up.",
        example: {
          body_text_named_params: [
            { param_name: "details", example: "Priya Sharma — +91 90000 00000 — wants SEO for her store" },
          ],
        },
      },
    ],
  },
];

async function listTemplates() {
  const url = `${GRAPH}/${WABA_ID}/message_templates?fields=name,status,category,language&limit=50`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const data = await res.json();
  if (!res.ok) {
    console.error("❌ Could not list templates:", JSON.stringify(data.error || data, null, 2));
    process.exit(1);
  }
  console.log(`\nTemplates on WABA ${WABA_ID}:`);
  if (!data.data || !data.data.length) {
    console.log("  (none yet)");
    return;
  }
  for (const t of data.data) {
    const mark = t.status === "APPROVED" ? "✅" : t.status === "REJECTED" ? "❌" : "⏳";
    console.log(`  ${mark} ${t.name} — ${t.status} (${t.category}, ${t.language})`);
  }
  console.log("\nTip: APPROVED = ready to use. PENDING = still under review (usually minutes).");
}

async function createTemplate(tpl) {
  const res = await fetch(`${GRAPH}/${WABA_ID}/message_templates`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(tpl),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`❌ ${tpl.name} — failed:`, JSON.stringify(data.error || data, null, 2));
    return false;
  }
  console.log(`✅ ${tpl.name} — created (id ${data.id}, status ${data.status || "PENDING"})`);
  return true;
}

(async () => {
  if (process.argv.includes("--list")) {
    await listTemplates();
    return;
  }
  console.log(`Creating ${TEMPLATES.length} UTILITY templates on WABA ${WABA_ID}…\n`);
  for (const tpl of TEMPLATES) {
    await createTemplate(tpl);
  }
  console.log("\nDone. Check approval any time with:  node create-templates.mjs --list");
})();
