import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const manifestPath = resolve(root, "content", "evidence-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const errors = [];

if (manifest.productionCanonical?.status !== "user-confirmed") {
  errors.push("Production canonical is not confirmed.");
}

for (const [name, profile] of Object.entries(manifest.publicProfiles || {})) {
  if (!profile.value && !profile.url) errors.push(`Public profile ${name} has no URL.`);
  if (profile.status !== "user-confirmed") errors.push(`Public profile ${name} is not confirmed.`);
}

for (const claim of manifest.claims || []) {
  for (const field of ["id", "claim", "source", "window", "role", "permission", "publicStatus", "dateStatus"]) {
    if (!claim[field]) errors.push(`${claim.id || "Unknown claim"} is missing ${field}.`);
  }
  if (claim.artifact) {
    const publicPath = resolve(root, "public", claim.artifact.replace(/^\//, ""));
    try { await access(publicPath); }
    catch { errors.push(`${claim.id} references a missing public artifact: ${claim.artifact}`); }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Evidence manifest valid: ${manifest.claims.length} claims, canonical and profiles confirmed.`);
}
