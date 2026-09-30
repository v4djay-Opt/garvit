# Garvit Buildtech

Premium real-estate website built with Next.js 16, React 19, TypeScript and Tailwind v4. The site is ready for approved project content to be added; public launch still requires business data, media and service credentials.

Use Node 24 LTS. On this Mac:

```sh
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run verify
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run build
/opt/homebrew/opt/node@24/bin/node scripts/start-preview.mjs
```

The standalone preview runs at http://127.0.0.1:3100. `/kitchen-sink` includes clearly labelled component demonstrations and is unavailable in release mode.

## Implemented

- Content schemas/repository and conditional static project pages.
- Homepage, about, contact, legal pages, conditional testimonials page.
- Project type/status filters; architecture, master plan, floor plans, amenities, gallery/lightbox, map, specifications and related projects.
- Enquiry, site-visit, callback and form-first brochure download. Server validation, origin/timing/honeypot checks, sliding rate limits, escaped email, durable private recovery storage.
- Native dialogs with explicit keyboard cycling, focus restoration and responsive action placement.
- Deferred desktop video, optimized images, reduced-motion support, smaller local font subsets.
- Canonical metadata, sharing image, truthful structured data in release mode, sitemap/robots, consent-gated GTM and conversion events.
- Draft/noindex protection, release validation, deployment layout and rollback script.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run verify` | Content validation, typecheck, lint, backend/SEO/attribution tests |
| `npm run build` | Validated standalone build using Webpack |
| `npm run test:browser` | Chromium, Firefox and WebKit flows, responsive and axe checks |
| `npm run validate:release` | Requires final data, assets, approved legal copy and production env |
| `node scripts/measure-bundle.mjs` | Gzip initial-JS sizes with framework/application breakdown; `--enforce` fails above 120 KiB (currently unmet; see status) |
| `node scripts/lighthouse.mjs` | Local mobile Lighthouse reports in `artifacts/` |
| `node scripts/prepare-image.mjs source.jpg new.webp` | Make a resized WebP without overwriting originals |

Browser tests need the Playwright browser packages (`playwright install chromium firefox webkit`). Performance reports need a local Chrome installation. Reports and screenshots are ignored by Git.

## Content and launch

Read [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for the data handoff and [deploy/DEPLOYMENT.md](deploy/DEPLOYMENT.md) for credentials, lead recovery and deployment. Current JSON is draft content; do not publish it.

`SITE_RELEASE=true` is a deliberate public-release switch. Preview builds stay noindex even though they use a production Next.js build. The release validator rejects the current placeholders. Do not bypass it to obtain a better SEO test score.

Actual email receipt, GTM vendor configuration, final media performance, real-device testing, server hardening, CSP promotion after a clean report window and production rollout require the remaining client inputs. See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for measured results and open gates.

The homepage and About page use AI-generated concept imagery with visible captions. Originals and exact generation prompts are retained in [assets/generated-originals/README.md](assets/generated-originals/README.md); optimized assets live in `public/images/concepts/`. These must not be represented as photographs of actual Garvit properties.
