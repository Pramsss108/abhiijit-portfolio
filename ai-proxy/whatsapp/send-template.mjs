/*
 * Sends an APPROVED template as a test (proves the number can send).
 *   node send-template.mjs <to> <templateName> <param1> [param2] ...
 * Positional-param templates only. Example:
 *   node send-template.mjs 918777849865 bong_status_update_v1 "TEST — Kriti pipe works"
 */
import { loadToken, PHONE_NUMBER_ID } from "./_token.mjs";

const GRAPH = "https://graph.facebook.com/v23.0";
const TOKEN = loadToken();
const [, , toRaw, name, ...params] = process.argv;
const TO = (toRaw || "").replace(/[^\d]/g, "");

if (!TO || !name) {
  console.error("Usage: node send-template.mjs <to> <templateName> <param1> ...");
  process.exit(1);
}

const template = { name, language: { code: "en_US" } };
if (params.length) {
  template.components = [
    { type: "body", parameters: params.map((t) => ({ type: "text", text: t })) },
  ];
}

const res = await fetch(`${GRAPH}/${PHONE_NUMBER_ID}/messages`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ messaging_product: "whatsapp", to: TO, type: "template", template }),
});
const data = await res.json();
if (!res.ok) {
  console.error(`❌ Send failed:`, JSON.stringify(data.error || data, null, 2));
  process.exit(1);
}
console.log(`✅ Sent "${name}" to ${TO}! id: ${data.messages?.[0]?.id}`);
console.log("   Check WhatsApp on that phone now.");
