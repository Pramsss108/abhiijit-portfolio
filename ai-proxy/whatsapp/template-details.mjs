/*
 * Prints the components (body text + parameters) of the account's templates so
 * we know how to fill them when sending.  node template-details.mjs
 */
import { loadToken, WABA_ID } from "./_token.mjs";

const GRAPH = "https://graph.facebook.com/v23.0";
const TOKEN = loadToken();

const res = await fetch(
  `${GRAPH}/${WABA_ID}/message_templates?fields=name,status,category,language,parameter_format,components&limit=50`,
  { headers: { Authorization: `Bearer ${TOKEN}` } }
);
const data = await res.json();
if (!res.ok) { console.error(JSON.stringify(data.error || data, null, 2)); process.exit(1); }

for (const t of data.data || []) {
  console.log(`\n=== ${t.name} (${t.status}, ${t.parameter_format || "positional"}) ===`);
  for (const c of t.components || []) {
    if (c.type === "BODY") {
      console.log("  BODY:", JSON.stringify(c.text));
      if (c.example) console.log("  example:", JSON.stringify(c.example));
    } else {
      console.log(`  ${c.type}:`, JSON.stringify(c.text || c.format || c.buttons || ""));
    }
  }
}
