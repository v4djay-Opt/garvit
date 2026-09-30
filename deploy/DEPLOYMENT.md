# Garvit Buildtech deployment

The code supports a preview build now. A public release is intentionally blocked until approved content, actual media, domain and SMTP configuration are supplied.

## Local preview

Use Node 24. `npm run verify` checks content, types, lint and backend tests. `npm run build` creates the standalone production bundle. `node scripts/start-preview.mjs` serves that bundle at http://127.0.0.1:3100. `npm run test:browser` starts the same bundle and runs Chromium/responsive/axe tests. Chromium must be installed with `playwright install chromium` first if unavailable.

Build uses Webpack because the local Turbopack compilation stalled during review. All content routes remain prerendered; only the lead POST handler is dynamic.

## Release layout

```
/var/www/garvit/
  shared/.env.production       # 0600; never uploaded to public storage
  shared/lead-outbox/          # 0700 directory; request files are 0600
  releases/<UTC timestamp>/   # standalone server.js, data, public, .next/static
  current -> releases/<UTC timestamp>
```

Provision Ubuntu with Node 24, Nginx, PM2, TLS and a non-root deployment user. Restrict SSH and enable firewall/security updates. PM2 runs one fork instance; the in-memory limiter is not shared across workers. Point Nginx at `current` and Node at loopback. Restore real visitor IPs using Cloudflare's current published IP ranges; Nginx must overwrite `X-Real-IP`. Never expose Node's port publicly.

1. Copy `.env.example` to the private `shared/.env.production`. Supply real SMTP, destination inbox, canonical origin and persistent outbox path. Set `SITE_RELEASE=true`, `TRUST_PROXY=true`. Do not source this file as shell code.
2. Replace all draft content and media, and mark reviewed legal pages approved in `data/legal.json`.
3. From a clean checkout, use Node 24 and run `npm ci`, `npm run verify`. With the production env loaded, run `npm run validate:release`. This deliberately fails for the current draft content.
4. Edit domain/certificate paths in `deploy/nginx/garvit.conf`, copy the security snippet, and run `nginx -t` before reloading.
5. Run `bash deploy/deploy.sh` from the checkout. It loads env via Node, validates and builds before changing the current symlink. Failed HTTP smoke checks restore the previous symlink. It does not pull or merge Git automatically.
6. Configure `pm2 startup`, log rotation, and `pm2 save`. Single-fork reload may cause a brief restart; do not promise zero downtime.

The deployment script targets GNU/Linux (`mv -T`). It has been syntax-checked locally; server rollout/rollback must be rehearsed on staging before production.

## Lead recovery

SMTP failure saves a private, fsynced JSON record outside the release. Only delivery or successful storage receives a success response. If both fail, the API returns 503. Monitor the outbox and the application error log; a saved request is not proof of inbox delivery.

`node --env-file=/var/www/garvit/shared/.env.production --import tsx scripts/recover-leads.ts` reports pending records without sending. An operator may explicitly add `--send` to retry email delivery. Delivered records become `.json.delivered`; implement the business-approved retention period for these and backups. Run recovery from the checkout with dependencies, not from the standalone artifact. Do not run concurrent recovery processes. An interruption after SMTP acceptance but before renaming can cause a duplicate; receipt IDs in subjects allow reconciliation.

An older `lead-failures.log` may exist in the checkout; it is ignored now. Review/migrate it privately before removing it. It must never be served or committed.

## Analytics

Set `NEXT_PUBLIC_GTM_ID` before building. The banner and tags remain inactive without a real ID. Tags load only after analytics/marketing consent. Withdrawal updates Consent Mode and reloads to stop loaded scripts. GA4 and Meta tags belong inside GTM; do not add duplicate direct snippets.

Configure GTM consent requirements for every vendor, especially Meta/custom HTML. Use these custom events: `page_view`, `project_view`, `form_start`, `lead_submit`, `brochure_download`, `whatsapp_click`, `phone_click`, `map_open`. Only form type, project slug and path are sent; do not map personal form fields to tags. Disable automatic duplicate page-view events and test SPA navigation in Tag Assistant. Follow Google's [Consent Mode setup](https://developers.google.com/tag-platform/security/guides/consent).

Original campaign attribution is kept for the tab's session and attached to enquiries. Analytics consent is separate from consent to be contacted.

## Security and release checks

CSP remains Report-Only until a clean staging report window includes gallery, Maps and actual GTM tags. Then set `CSP_ENFORCE=true` and promote the Nginx snippet header too. Keep the two policies synchronized. Set Cloudflare Full (Strict), avoid caching `/api/*`, and keep HTML caching short/purge on deploy. Use versioned media filenames when replacing images.

Before public launch verify: real email reception for all four intents; no draft text; SSL; security headers; visible routes and sitemap; Google schema validation; Lighthouse on actual imagery; Safari/Firefox/iOS/Android; backup restore; rollback; IP rate limiting through Cloudflare.

Nightly encrypted backups should include `shared`, content/media and Nginx configuration, with an off-server copy and a documented retention schedule. Rehearse restoration to an isolated staging location. No production credentials or server access were available during local implementation, so these operational checks are not claimed as completed.
