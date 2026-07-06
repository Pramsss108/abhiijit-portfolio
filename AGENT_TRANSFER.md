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

## Optional Next Steps

1. Refine `portfolio_data.json` if the model hallucinates (then `npx wrangler deploy`).
2. Consider locking `Access-Control-Allow-Origin` to `https://abhiijit.works` in the worker.
3. Add a tiny rate limit / abuse guard on the worker if traffic grows.
