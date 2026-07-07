/*
 * Validates the token and prints the WhatsApp numbers on the account with their
 * Phone Number IDs — the value we need to send messages. Never prints the token.
 *   node info.mjs
 */
import { loadToken, WABA_ID } from "./_token.mjs";

const GRAPH = "https://graph.facebook.com/v23.0";
const TOKEN = loadToken();

async function main() {
  const url = `${GRAPH}/${WABA_ID}/phone_numbers?fields=id,display_phone_number,verified_name,quality_rating,code_verification_status,platform_type`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const data = await res.json();
  if (!res.ok) {
    console.error("❌ Token/API error:", JSON.stringify(data.error || data, null, 2));
    process.exit(1);
  }
  console.log(`✅ Token works. WABA ${WABA_ID} has these numbers:\n`);
  for (const p of data.data || []) {
    console.log(`  • ${p.display_phone_number}  (${p.verified_name || "?"})`);
    console.log(`    PHONE_NUMBER_ID = ${p.id}`);
    console.log(`    status: ${p.code_verification_status || "?"} · quality: ${p.quality_rating || "?"}\n`);
  }
  if (!data.data || !data.data.length) console.log("  (no numbers found on this WABA)");
}
main();
