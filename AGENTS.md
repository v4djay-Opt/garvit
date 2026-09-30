<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Garvit Buildtech — Project Notes for AI Agents

## Node.js runtime

node@24 LTS is keg-only on Homebrew — the default `node`/`npm` on this machine
resolves to node@25 from `/opt/homebrew/bin`.

**Always use the full node@24 path when running project scripts:**

```bash
# Dev server
/opt/homebrew/opt/node@24/bin/node node_modules/.bin/next dev

# Build
/opt/homebrew/opt/node@24/bin/node node_modules/.bin/next build

# Validate content
/opt/homebrew/opt/node@24/bin/node node_modules/.bin/tsx scripts/validate-content.ts

# Typecheck
/opt/homebrew/opt/node@24/bin/node node_modules/.bin/tsc --noEmit

# Lint
/opt/homebrew/opt/node@24/bin/node node_modules/.bin/eslint .

# Full verify
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run verify
```

Or prefix every `npm run …` command with:
```bash
PATH=/opt/homebrew/opt/node@24/bin:/usr/bin:/bin npm run …
```

## Key conventions

- Content types are inferred from `lib/content/schema.ts`; UI reads through `lib/content/repository.ts`.
- Content pages are statically prerendered. Only `/api/lead` is dynamic.
- Run scripts with Node 24. `npm run build` uses Webpack because the earlier local Turbopack build stalled.
- `SITE_RELEASE=true` enables public indexing and disables the kitchen-sink page. `validate:release` must pass before deployment.
- CSP stays Report-Only until an actual clean staging report window. `CSP_ENFORCE=true` enables the app policy; also promote the Nginx snippet.
- Fonts are self-hosted Latin/Latin-1 subsets. Original font files and licences are retained.
- Tokens live in `styles/globals.css`; keep gold text contrast accessible.
- Legal content is in `data/legal.json`; approval and a real updated date are required for release.
- Lead fallback files contain personal data: private `LEAD_FAILURE_DIR`, outside releases, never public or committed.
- Test previews are examples only, not approved project data.

## Current status

The user authorized completing the missing functionality on 2026-09-21 before supplying real project data. Design system, homepage, project sections, lead flows, supporting pages and SEO/analytics infrastructure are implemented. Read `IMPLEMENTATION_STATUS.md` for verification results and remaining launch gates. The former “only Phase 1 complete” note was stale and must not be used to assess progress.

Client visual approval, actual media/content, service credentials and production QA are still separate from code implementation. Do not claim public launch readiness from a successful preview build.
