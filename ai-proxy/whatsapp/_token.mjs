/*
 * Loads the WhatsApp token WITHOUT ever printing it.
 * Priority: env var WA_TOKEN, else the git-ignored file whatsapp/secret.token.
 * The token value is returned to the caller but never logged anywhere.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

export function loadToken() {
  if (process.env.WA_TOKEN && process.env.WA_TOKEN.trim()) {
    return process.env.WA_TOKEN.trim();
  }
  const file = join(here, "secret.token");
  if (existsSync(file)) {
    // First non-empty, non-comment line is the token.
    const line = readFileSync(file, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#"));
    if (line) return line;
  }
  console.error(
    "❌ No token found.\n" +
      "   Paste your PERMANENT WhatsApp token into this file (in your editor):\n" +
      "   " + file + "\n" +
      "   (It is git-ignored and never leaves your machine.)"
  );
  process.exit(1);
}

export const WABA_ID = (process.env.WA_WABA_ID || "2124935384968157").trim();
// The sending number's Phone Number ID (from Meta API Setup). Override via env
// or edit the fallback once you know it.
export const PHONE_NUMBER_ID = (process.env.WA_PHONE_NUMBER_ID || "").trim();
