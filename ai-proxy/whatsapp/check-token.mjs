/*
 * Reports whether the token is permanent (never expires) or temporary.
 *   node check-token.mjs
 */
import { loadToken } from "./_token.mjs";
const TOKEN = loadToken();

const res = await fetch(
  `https://graph.facebook.com/v23.0/debug_token?input_token=${encodeURIComponent(TOKEN)}&access_token=${encodeURIComponent(TOKEN)}`
);
const { data, error } = await res.json();
if (error) { console.error("❌", JSON.stringify(error, null, 2)); process.exit(1); }

const exp = data?.expires_at;
const scopes = data?.scopes || data?.granular_scopes?.map((g) => g.scope) || [];
console.log("Type:", data?.type);
console.log("App ID:", data?.app_id);
console.log("Valid:", data?.is_valid);
if (exp === 0 || exp == null) {
  console.log("Expires: ✅ NEVER (permanent) — perfect for the always-on system.");
} else {
  const when = new Date(exp * 1000).toISOString();
  console.log(`Expires: ⚠️ ${when} — TEMPORARY. We need a permanent System User token for production.`);
}
console.log("Scopes:", scopes.join(", "));
