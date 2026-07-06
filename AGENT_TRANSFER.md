# Agent Transfer / Handover Document

**File Location:** `D:\A scret project\abhiijit-portfolio\AGENT_TRANSFER.md`
**Project Path:** `D:\A scret project\abhiijit-portfolio`
**Last Updated:** July 6, 2026 (evening) — site restored, AI chatbot live in production

## Current Status: ALL RESOLVED ✅

- **`abhiijit.works` is back online (HTTP 200).** The custom domain was re-linked via the GitHub Pages API (`gh api -X PUT repos/Pramsss108/abhiijit-portfolio/pages -f cname=abhiijit.works`) — no manual UI clicking was needed. GitHub committed a `CNAME` file back to `gh-pages`.
- **AI chatbot deployed to production.** A fresh `npm run build:release` (including `CNAME` + `v3/chat.js`) was deployed to `gh-pages` via a temp worktree commit on top of the remote branch (no force push).
- **The AI "brain" was broken and is now fixed.** Hugging Face retired `api-inference.huggingface.co` (DNS no longer resolves → worker returned "AI Engine is currently unavailable"). The worker (`ai-proxy/src/index.js`) now calls the OpenAI-compatible router: `https://router.huggingface.co/v1/chat/completions`. Redeployed with `npx wrangler deploy`. Same payload/response shape, so `chat.js` needed no changes.
- **Local verification passed end-to-end:** widget toggles open, message sends, real Llama-3 answer renders in an `ai-ab-msg--ai` bubble (verified via headless preview + screenshot).

## Credentials & Tokens (Note to Claude / Next Agent)
Everything is ALREADY set up and deployed! You do NOT need to ask the user to sign up for new APIs unless you are explicitly changing the architecture.

*   **Hugging Face API Key:** The user's Hugging Face API token is ALREADY stored securely in the Cloudflare Worker environment secrets under the name `HUGGINGFACE_API_KEY`. It works with the new router endpoint.
*   **How to update it (if needed):** If the token expires or you need to change it, use this exact command in the `ai-proxy/` directory:
    ```bash
    npx wrangler secret put HUGGINGFACE_API_KEY
    ```
    *(The terminal will prompt the user to securely paste their token).*
*   **Wrangler Login:** The user is already logged into Cloudflare Wrangler (`wrangler login` is active). You can deploy updates to the worker immediately using `npx wrangler deploy`.
*   **GitHub CLI:** `gh` is authenticated as `Pramsss108` with `repo` scope — Pages settings can be managed via `gh api`.

## Root Causes Found (July 6 evening session)

1. **Site 404:** the CNAME fix commit existed only on the *local* `gh-pages` branch — it was never pushed. A later deploy to origin wiped the domain link. Fixed via the Pages API; `CNAME` is now part of every release build (`scripts/build-release.mjs` copy list) so future deploys keep it.
2. **Chatbot dead:** old HF inference endpoint is gone. Switched to the HF Inference Providers router (auto-routes the model to a provider, e.g. a `-Lite` variant).

## Key Facts for Future Agents

- **Deploy flow:** `npm run build:release` → copy `release/` contents onto a worktree of `origin/gh-pages` → commit → push. `release/` must always contain `CNAME` (`abhiijit.works`) or GitHub drops the domain again.
- **Local dev gotcha:** the user often has their *own* browser-sync on port 5055 serving the old madquick-clone copy — it does NOT have the chat widget. Serve `abhiijit-portfolio/public` on another port (e.g. 5057) to test the real thing.
- **Widget classes are `ai-ab-*`** (adblocker bypass) — do not rename back to `chat-*`.
- **Brain data:** `ai-proxy/src/portfolio_data.json`, injected as the system prompt.

## Late-session update (2026-07-06 evening #2)

A 21-agent audit ran end-to-end (96 findings). See `SITE_AUDIT_AND_ROADMAP.md` (phased plan, statuses current) and `AUDIT_FINDINGS_FULL.md` (all evidence). Shipped and deployed the same night:

- **Scroll perf:** aurora canvas skips painting while scrolling; header blur 16→10px; ALL backdrop-filters disabled on touch devices; hero LCP un-gated from JS; hero glow 104KB→19KB; process stepper ignores mobile URL-bar resizes (+100svh stage).
- **Mobile:** hero rebuilt at ≤820px via `display:contents` ordering — portrait now sits right under the H1, in the first viewport; chat input 16px (no iOS zoom) + safe-area insets + 44px targets; mobile menu scrolls; caption legibility floor.
- **AI brain:** `ai-proxy/src/portfolio_data.json` rebuilt from `D:\A scret project\Word hacker 404\career-dashboard\data\experience_claims.json` (259 safe claims, 32 companies, **13 video-editing clients** — never present MadQuick as the only one). Worker hardened: CORS locked to abhiijit.works (+localhost dev ports), 16KB body / 12 msgs / 600 chars caps, injection guards on input AND output, max_tokens 380, natural voice.
- **SEO/GEO:** sitemap/robots/privacy canonical fixed to the real double-i domain; llms.txt live; FAQPage JSON-LD; VideoObject uploadDate; title 52 chars; copy corrections (3.78M unified, MadQuick/ZestMoney casing, +115% math, placeholder removed).
- **Repo hygiene:** .gitignore added, node_modules untracked (a wrangler account-id file briefly hit the public repo — history force-pushed clean the same minute).

## Remaining for user / next agent

1. **USER:** rotate the HF key (pasted in chat) → `npx wrangler secret put HUGGINGFACE_API_KEY` in `ai-proxy/`.
2. **USER:** add DNS CNAME `www` → `pramsss108.github.io` so https://www.abhiijit.works stops 404ing.
3. Open ⬜ roadmap items: reel-04 re-encode, Chart.js self-host, PNG fallback purge, marquee pause control, video captions, Service schema, analytics (see roadmap Phases 2/5/7/8).
