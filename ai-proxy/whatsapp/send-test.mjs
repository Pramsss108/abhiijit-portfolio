/*
 * Sends a test WhatsApp message to confirm the number can send.
 * Uses the built-in "hello_world" template (exists on every WABA, needs no
 * approval and no open 24h window — the cleanest way to prove sending works).
 *   node send-test.mjs 918777849865
 */
import { loadToken, PHONE_NUMBER_ID } from "./_token.mjs";

const GRAPH = "https://graph.facebook.com/v23.0";
const TOKEN = loadToken();
const TO = (process.argv[2] || "918777849865").replace(/[^\d]/g, "");

async function main() {
  const res = await fetch(`${GRAPH}/${PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: TO,
      type: "template",
      template: { name: "hello_world", language: { code: "en_US" } },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`❌ Send failed to ${TO}:`);
    console.error(JSON.stringify(data.error || data, null, 2));
    process.exit(1);
  }
  console.log(`✅ Sent to ${TO}! Message id: ${data.messages?.[0]?.id}`);
  console.log("   Check WhatsApp on that phone — the 'hello_world' test should arrive.");
}
main();
