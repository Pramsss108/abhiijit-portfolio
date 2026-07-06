import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PurgeCSS } from "purgecss";
import { minify as minifyCss } from "csso";
import { minify as minifyJs } from "terser";

const root = resolve(import.meta.dirname, "..");
const pageDir = resolve(root, "public", "v3");
const cssSource = resolve(pageDir, "styles.css");
const jsSource = resolve(pageDir, "app.js");
const htmlSource = resolve(pageDir, "index.html");
const canonicalHtml = resolve(root, "public", "index.html");

const [css, js, html] = await Promise.all([
  readFile(cssSource, "utf8"),
  readFile(jsSource, "utf8"),
  readFile(htmlSource, "utf8"),
]);

const purgeResult = await new PurgeCSS().purge({
  content: [
    { raw: html, extension: "html" },
    { raw: js, extension: "js" },
  ],
  css: [{ raw: css }],
  safelist: {
    standard: [
      "js",
      "no-js",
      "is-visible",
      "is-active",
      "is-open",
      "is-ready",
      "is-paused",
      "is-dragging",
      "is-motion-visible",
      "intro-active",
      "intro-skip",
      "ap-cursor-hover",
      "ap-cursor-down",
      "ap-cursor-idle",
      "ap-cursor-hidden",
      "nav-open",
      "mega-open",
      "rv-marquee",
      "rv-stagger",
    ],
    greedy: [/^is-/, /^has-/, /^intro-/, /^ap-cursor-/, /^rv-/, /^editor-/],
  },
  fontFace: false,
  keyframes: true,
  variables: false,
});

if (!purgeResult[0]?.css) {
  throw new Error("PurgeCSS did not return a stylesheet");
}

const optimizedCss = minifyCss(purgeResult[0].css, {
  comments: false,
  restructure: true,
}).css;

const optimizedJs = await minifyJs(js, {
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false },
});

if (!optimizedJs.code) {
  throw new Error("Terser did not return JavaScript");
}

await Promise.all([
  writeFile(resolve(pageDir, "styles.min.css"), optimizedCss),
  writeFile(resolve(pageDir, "app.min.js"), optimizedJs.code),
  // The v3 file remains the editable source; production root serves the same
  // canonical document. All v3 assets use root-absolute URLs, so the markup is
  // valid at both / and the local /v3/ preview path.
  writeFile(canonicalHtml, html),
]);

const cssSaving = 1 - Buffer.byteLength(optimizedCss) / Buffer.byteLength(css);
process.stdout.write(
  JSON.stringify(
    {
      cssSourceBytes: Buffer.byteLength(css),
      cssProductionBytes: Buffer.byteLength(optimizedCss),
      cssSavingPercent: Number((cssSaving * 100).toFixed(1)),
      jsSourceBytes: Buffer.byteLength(js),
      jsProductionBytes: Buffer.byteLength(optimizedJs.code),
    },
    null,
    2,
  ) + "\n",
);
