/*
 * Sends a test lead email via Resend to confirm the key + delivery work.
 * Reads the key from ../resend.key (git-ignored). Never prints the key.
 *   node send-test-email.mjs "you@gmail.com"
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const KEY = readFileSync(join(here, "..", "resend.key"), "utf8").trim();
const TO = process.argv[2] || "guitarguitarabhijit@gmail.com";

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from: "Kriti · abhiijit.works <onboarding@resend.dev>",
    to: TO,
    subject: "🔔 New lead from abhiijit.works (TEST)",
    text:
      "This is a test of your portfolio lead alerts.\n\n" +
      "Email: priya.sharma@example.com\n" +
      "Phone: +91 90000 00000\n\n" +
      "What they said:\n• I run a small cafe and want more people to see my posts\n\n" +
      "— If you got this, lead alerts are working. (Sent by Kriti on abhiijit.works)",
  }),
});
const data = await res.json();
if (!res.ok) {
  console.error("❌ Resend error:", JSON.stringify(data, null, 2));
  process.exit(1);
}
console.log(`✅ Test email sent to ${TO} (id: ${data.id}). Check that Gmail inbox.`);
