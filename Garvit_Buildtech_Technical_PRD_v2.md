# Garvit Buildtech — Technical PRD & Build Plan

**Product:** Corporate Real Estate Developer Website
**Brand:** Garvit Buildtech
**Primary Market:** Haridwar, Uttarakhand
**Positioning:** Premium real estate developer
**Primary Objective:** Premium branding
**Version:** 2.1 — Technical Architecture & Implementation Specification
**Status:** APPROVED — cleared for Phase 1
**Supersedes:** Nothing. This document *extends* `Garvit_Buildtech_Premium_Website_PRD.md` (v1.0).
**Last revised:** Client corrections applied — see §0.4 Revision History.

---

## 0. Document Control

### Relationship to v1.0

`Garvit_Buildtech_Premium_Website_PRD.md` (v1.0) remains the authoritative statement of **business intent, scope, brand direction and quality bar**. It is not replaced.

This document (v2.0) is the **engineering answer** to it: the architecture, data contracts, design tokens, motion rules, security posture and deployment topology that will deliver v1.0.

Where this document deviates from v1.0, the deviation is explicitly called out in §2 with reasoning. **No deviation silently overrides the v1.0 PRD.**

| Reference style | Meaning |
|---|---|
| §n | Section within *this* document (v2.0) |
| PRD §n | Section within `Garvit_Buildtech_Premium_Website_PRD.md` (v1.0) |

### Locked decisions carried from v1.0

Brand Garvit Buildtech · Market Haridwar · Categories Villas / Plots / Farm Land · Future category Commercial · Status Ongoing / Upcoming · Objective Premium Branding · No login · No customer portal · No admin panel · No CMS · No database in v1 · Content in structured JSON · Hostinger VPS.

Stack: Next.js · TypeScript · Tailwind CSS · GSAP · ScrollTrigger · Structured JSON · Google Maps · GA4 · GTM · Meta Pixel · Node.js · PM2 · Nginx · Let's Encrypt · Cloudflare.

### Decisions resolved during technical review

| Decision | Choice | Rationale |
|---|---|---|
| Typography | **Fraunces** (headlines) + **Inter Tight** (UI/body) | Warm, optically-sized editorial serif; distinctive and rarely used, so it avoids the overused-luxury-serif template signal |
| Lead delivery | **Email only (SMTP)**, behind a pluggable `LeadSink` interface | Client decision; interface preserves the CRM migration path |
| Maps | **Static map image → Google Maps Embed iframe on click** | Zero JS and zero billing exposure until the user opts in |
| Brochure gating | **Soft gate** (form first, then reveal public PDF link) | Client decision; bypassability explicitly accepted — see §11 |

### 0.4 Revision History

#### v2.1 — Client corrections

| # | Correction | Sections changed |
|---|---|---|
| 1 | **Node.js 24 LTS** replaces Node 22 as the pinned runtime, applied uniformly across local, `.nvmrc`, CI, staging and production | §2.8, §4, §14, §16 |
| 2 | **Nonce-based per-request CSP withdrawn.** It is architecturally incompatible with static rendering. Replaced with a static, allowlist-based CSP delivered at the edge | §2.7, §15.1 |
| 3 | **Fonts self-hosted from local files** via `next/font/local`; no build-time dependency on Google's font CDN | §7, §13 |
| 4 | **ScrollSmoother demoted** from planned dependency to optional Phase-2 experiment; native scrolling + ScrollTrigger is the default | §8, §16 |

All other approved architecture, design-system, JSON content-layer, security, performance and VPS decisions are preserved unchanged.

#### Correction 2 — why the original design was wrong

v2.0 specified both "every content page is statically prerendered" (§3) and "nonce-based CSP generated in `middleware.ts`" (§2.7). **These are mutually exclusive.**

A CSP nonce must be unique per response. Generating one in middleware and consuming it in the page forces Next.js to opt every affected route out of static generation into dynamic rendering. The consequences would have been: no prerendered HTML, no CDN cacheability at Cloudflare, Node in the path of every page view, and the loss of the low-CPU VPS profile that the entire deployment architecture in §14 is predicated on.

The nonce approach is withdrawn. §15.1 specifies a static CSP instead.

---

## 1. Understanding of the Project

Garvit Buildtech needs a **digital flagship**, not a property portal. The commercial goal is *premium branding*; lead generation is a secondary, deliberately understated layer. Success is judged on **visual and experiential quality first**, correctness second — v1.0 explicitly makes visual quality a release blocker (PRD §26).

Constraints that shape every decision:

- **1–5 projects.** This is a small-content, high-craft site. Nothing about the architecture should be built for scale; everything should be built for polish and for *content swap-ability* later.
- **No CMS, no DB, no login, no admin.** Content is JSON in Git. This means the entire site can be **100% statically rendered at build time** — the server does almost no work.
- **Hostinger VPS, not Vercel.** Every "it just works on Vercel" assumption (image optimizer scaling, edge caching, ISR infrastructure) must be replaced with an explicit, resource-aware decision.
- **Content is not yet available.** Real names, prices, RERA numbers, distances and testimonials do not exist yet. The build must be structured so placeholder content is *obviously* placeholder and *trivially* replaceable.

The single most important structural requirement (PRD §25) is that **UI components never touch JSON directly**. A content service layer sits between them so JSON can be swapped for Sanity / Strapi / Postgres / CRM without touching a single component.

---

## 2. Critical Review of v1.0 — Deviations & Gaps

v1.0 is unusually good: clear scope, locked stack, honest about content gaps. These are the points where this document recommends deviating, or where v1.0 is silent on something that will cause production problems.

### 2.1 `next/image` runtime optimization is the biggest production risk (v1.0 is silent)

PRD §17 and §20 demand AVIF/WebP, responsive sizing and heavy cinematic photography, on a VPS. v1.0 does not acknowledge that Next's optimizer does this work **at request time, inside your Node process**.

Decoding a single 4000×3000 JPEG allocates roughly `4000 × 3000 × 4 bytes ≈ 46 MB` of raw bitmap before resizing even begins. A gallery page requesting a dozen images at several breakpoints concurrently can OOM-kill a small VPS. AVIF encoding is the worst offender for CPU.

**Mitigation — three layers, all required:**

1. **Cap source dimensions at ingest.** `scripts/prepare-media.ts` (sharp) downscales every master asset to ≤2560px on the long edge *before* it is committed to `/public`. The optimizer never sees a 6000px file.
2. **Serve WebP only, not AVIF.** `images.formats: ['image/webp']`. AVIF's marginal size win is not worth the encode cost on a shared VPS. `deviceSizes` trimmed to the six widths actually used.
3. **Cache aggressively.** `minimumCacheTTL` of one year, plus a Cloudflare cache rule on `/_next/image*` so the optimizer is hit once per variant, ever.

> **Deviation from PRD §17:** AVIF is dropped. WebP only.

### 2.2 "No database" + "email only" creates a silent lead-loss path

Accepted per client decision. But an SMTP timeout currently means the lead is gone with no trace.

**Mitigation:** a **failure-path-only** append to `var/leads-failed.jsonl` inside the `catch` block. This is error handling, not a datastore — nothing reads it, and it stays empty in the happy path. It does not violate the "no database in v1" constraint.

### 2.3 Rate limiting has a hidden PM2 interaction (v1.0 is silent)

In-memory rate limiting is per-process. If PM2 runs cluster mode with 4 instances, the effective limit is 4× what was configured, and all limits reset on every deploy.

**Recommendation:** run PM2 in **fork mode, single instance**. The site is fully static — one Node process is more than sufficient, and it makes in-memory rate limiting correct. Defence in depth via Nginx `limit_req` and a Cloudflare rate-limiting rule on `/api/lead`.

### 2.4 Testimonials are in the navigation but no real testimonials exist

PRD §14 places Testimonials in the primary navigation; PRD §7 and §21 forbid fabricating them. Shipping an empty page linked from the main nav actively damages the premium impression.

**Recommendation:** make the testimonials route and nav entry **data-driven** — if `testimonials.json` is empty, the nav item and the homepage section do not render, `/testimonials` returns 404, and it is excluded from the sitemap. The same conditional rule applies to every project sub-section.

### 2.5 Analytics: three tags will wreck INP if loaded naively

PRD §19 requires GA4 + GTM + Meta Pixel. Loaded independently, that is three script chains competing with hydration.

**Recommendation:** **GTM is the only script on the page.** GA4 and Meta Pixel are configured *inside* the GTM container. Loaded via `next/script` with `strategy="lazyOnload"`. One network chain, and marketing can add tags without a redeploy.

### 2.6 Consent is under-specified for the Indian market

PRD §19 says "respect applicable consent/privacy requirements" but specifies no mechanism. India's **DPDP Act 2023** requires clear notice and consent for personal-data processing, and the enquiry forms collect name / phone / email.

**Recommendation:** a minimal, design-integrated consent banner (not a cookie-wall) wired to **Google Consent Mode v2**, with analytics defaulting to denied until accepted. This is also a CSP prerequisite.

### 2.7 CSP must not break static rendering (revised in v2.1)

PRD §22 requires security headers. Two constraints collide here:

1. GTM requires either `'unsafe-inline'` or a per-request nonce in `script-src`.
2. **A nonce cannot be used without destroying static rendering.** Nonces must be unique per response; generating one in middleware forces every consuming route into dynamic rendering, eliminating prerendered HTML and CDN cacheability.

Static rendering and CDN cacheability are non-negotiable — they are the foundation of §13 and §14.

**Resolution: a static, allowlist-based CSP delivered at the edge.** No middleware, no nonce, no dynamic rendering. Full directive set and threat analysis in **§15.1**.

`/api/lead` remains dynamic, but it returns JSON and renders no HTML, so it needs no script policy.

**Rollout:** `Content-Security-Policy-Report-Only` first, promoted to enforcing only after a clean reporting period (Phase 7).

**Honest tradeoff:** this policy permits `'unsafe-inline'` in `script-src`, which a nonce-based policy would not. §15.1 explains why the residual risk is low for this specific site and what compensating controls apply.

### 2.8 Stack version notes

- **Next.js 16.3.x** is current stable; Next 15 reaches EOL October 2026. Build on **16**.
- **Node.js 24 LTS is the pinned runtime** (revised in v2.1). The local machine currently runs Node v25 — an odd-numbered, non-LTS line. Node 24 is pinned via `.nvmrc` and used identically in local development, CI, staging and production. Version drift between laptop and VPS is the classic cause of "works locally, breaks in production", so the major version is held identical across all four environments.
- **GSAP is now 100% free including all former Club plugins** (Webflow, April 2025). The relevant win is **SplitText**, rewritten with built-in screen-reader accessibility and native masking — exactly what the text-reveal system needs. ScrollSmoother is also now free but is explicitly *not* adopted as a dependency; see §8.
- **Tailwind CSS v4** with CSS-first `@theme` configuration — design tokens live in CSS, which suits a token-driven luxury system better than a JS config object.

### 2.9 Gaps v1.0 does not mention

404 / 500 / loading states (PRD §26 demands "polished loading states" but never specifies the pages), an OG image strategy, a staging environment, and a content-freeze/QA gate before launch. All are folded into this document.

---

## 3. Final Technical Architecture

```
Visitor
  ↓
Cloudflare  (DNS, CDN, WAF, rate limiting, Brotli, cache rules)
  ↓
Nginx       (TLS termination, static asset serving, limit_req,
             security headers, gzip/brotli)
  ↓
Next.js 16  (App Router · fully static · single dynamic route: /api/lead)
  ↓
PM2         (fork mode, 1 instance, auto-restart, log rotation)
  ↓
JSON content (validated at build) + static media in /public
```

**Rendering strategy: static-first.** Because all content is build-time JSON, every page is prerendered. `export const dynamic = 'force-static'` across content routes. The only runtime code path is the `POST /api/lead` route handler.

Consequences: minimal CPU/RAM on the VPS, trivially cacheable at Cloudflare, excellent TTFB, and a very small attack surface.

### Layered design

```
┌─────────────────────────────────────────────┐
│ UI Layer      app/ + components/            │  never imports JSON
├─────────────────────────────────────────────┤
│ Service Layer lib/content/repository.ts     │  stable public API
├─────────────────────────────────────────────┤
│ Source Layer  ContentSource interface       │  swap point
│               └ json-source.ts  (v1)        │
│               └ cms-source.ts   (future)    │
├─────────────────────────────────────────────┤
│ Schema Layer  Zod schemas → inferred types  │  single source of truth
├─────────────────────────────────────────────┤
│ Data          /data/*.json                  │
└─────────────────────────────────────────────┘
```

The `ContentSource` interface is the migration seam required by PRD §25. Moving to Sanity later means writing one new file and changing one import.

**Types are inferred from Zod (`z.infer`), never hand-written.** This makes it structurally impossible for the TypeScript types and the runtime validation to drift apart.

---

## 4. Folder Structure

```
garvit/
├── .nvmrc                          # 24
├── next.config.ts                  # incl. static security headers (dev parity)
├── tsconfig.json
├── postcss.config.mjs
├── ecosystem.config.js             # PM2
├── .env.example                    # committed; .env.local never is
│                                   # NOTE: no middleware.ts — a per-request
│                                   # nonce would force dynamic rendering (§2.7)
│
├── app/
│   ├── layout.tsx                  # fonts, providers, GTM, skip-link
│   ├── page.tsx                    # Home
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── opengraph-image.tsx         # default OG
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── about/page.tsx
│   ├── projects/
│   │   ├── page.tsx                # curated portfolio + filters
│   │   └── [slug]/
│   │       ├── page.tsx            # microsite
│   │       └── opengraph-image.tsx # per-project OG
│   ├── testimonials/page.tsx       # conditional on data
│   ├── contact/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms-and-conditions/page.tsx
│   └── api/lead/route.ts           # the only dynamic route
│
├── components/
│   ├── ui/                         # Button, Field, Input, Select, Textarea,
│   │                               # Checkbox, Modal, Lightbox, Reveal, Eyebrow,
│   │                               # Rule, Badge, Spinner, Skeleton
│   ├── layout/                     # Header, Nav, OverlayMenu, Footer, Section,
│   │                               # Container, Grid, PageTransition
│   ├── sections/                   # Homepage sections (Hero, Manifesto,
│   │                               # FeaturedProjects, Categories, LocationStory,
│   │                               # Philosophy, Testimonials, ClosingCTA)
│   ├── project/                    # Microsite blocks (ProjectHero, Story,
│   │                               # Highlights, MasterPlan, FloorPlans, Amenities,
│   │                               # Gallery, LocationMap, Specifications, CTABar)
│   ├── forms/                      # EnquiryForm, BrochureForm, SiteVisitForm,
│   │                               # CallbackForm, LeadModal, ConsentField
│   ├── media/                      # SmartImage, HeroVideo, MapFacade
│   └── analytics/                  # GtmScript, ConsentBanner, trackEvent
│
├── lib/
│   ├── content/
│   │   ├── schema.ts               # Zod schemas (source of truth)
│   │   ├── types.ts                # z.infer re-exports
│   │   ├── source/
│   │   │   ├── content-source.ts   # interface
│   │   │   └── json-source.ts      # v1 implementation
│   │   └── repository.ts           # public API used by UI
│   ├── motion/
│   │   ├── gsap.ts                 # plugin registration (client-only)
│   │   ├── tokens.ts               # durations, eases, distances
│   │   ├── use-reveal.ts
│   │   ├── use-split-reveal.ts
│   │   ├── use-parallax.ts
│   │   └── motion-provider.tsx     # reduced-motion + touch context
│   ├── seo/
│   │   ├── metadata.ts             # buildMetadata()
│   │   └── jsonld.ts               # Organization, Breadcrumb, Place
│   ├── leads/
│   │   ├── schema.ts               # Zod lead schemas per intent
│   │   ├── sink.ts                 # LeadSink interface
│   │   ├── email-sink.ts           # SMTP (nodemailer)
│   │   ├── rate-limit.ts
│   │   └── attribution.ts          # UTM / referrer / landing capture
│   ├── analytics/events.ts         # typed event catalogue
│   ├── fonts.ts                    # next/font/local declarations
│   └── utils/                      # cn, format, slug
│
├── data/
│   ├── site.json
│   ├── home.json
│   ├── projects.json
│   ├── testimonials.json
│   └── locations.json
│
├── scripts/
│   ├── validate-content.ts         # runs on prebuild + CI
│   └── prepare-media.ts            # sharp downscale/convert pipeline
│
├── styles/globals.css              # Tailwind v4 @theme tokens
│
├── public/
│   ├── fonts/                      # self-hosted woff2 + OFL licences (§7)
│   ├── images/  videos/  projects/  brochures/  floor-plans/
│
└── deploy/
    ├── nginx.conf
    ├── deploy.sh
    └── README.md
```

**Rationale for `components/` over route colocation:** with only ~8 routes but heavy cross-route component reuse (a project figure appears on home, projects listing, and related-projects), a shared component tree is the cleaner fit here.

---

## 5. Routes & Rendering

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static | Hero video/poster is the LCP battleground |
| `/about` | Static | |
| `/projects` | Static | Filtering is client-side over a prerendered list |
| `/projects/[slug]` | Static (`generateStaticParams`) | ~1–5 pages |
| `/testimonials` | Static, **conditional** | 404 + excluded from sitemap if no data |
| `/contact` | Static | Map facade, lazy |
| `/privacy-policy`, `/terms-and-conditions` | Static | |
| `/sitemap.xml`, `/robots.txt` | Generated at build | |
| `/api/lead` | **Dynamic** (`force-dynamic`, nodejs runtime) | Only server-executing code |
| `not-found`, `error`, `loading` | Static | Designed, not default |

Filters on `/projects` use `useState` + URL search params for shareability — **no** server round-trip, no layout shift, instant. Commercial is filtered out of the UI by a `visible` flag in data, while remaining fully supported by the schema (PRD §9.4).

---

## 6. Content & Data Model

Zod schemas are authoritative; TS types are inferred. Every optional section is genuinely optional so **empty sections never render**.

```ts
// Discriminated, future-proof enums — Commercial/Delivered already valid
PropertyType = 'villa' | 'plot' | 'farm-land' | 'commercial' | 'retail' | 'mixed-use'
ProjectStatus = 'ongoing' | 'upcoming' | 'delivered'
```

```ts
Project = {
  slug, name, type, status, visible,          // visible: hides Commercial pre-launch
  location: { label, area?, city, state },
  shortDescription, positioningStatement?,
  featured: boolean, order: number,

  media: {
    heroImage: ImageAsset,                    // { src, alt, width, height, blurDataURL? }
    heroVideo?: { webm?, mp4?, poster },
    gallery?: ImageAsset[],
  },

  story?:        { eyebrow?, heading, body[], image? },
  highlights?:   { label, value?, description? }[],
  architecture?: { heading, body[], images[] },
  masterPlan?:   ImageAsset,
  floorPlans?:   { label, area?, unitType?, image, pdf? }[],
  amenities?:    { title, description?, image? }[],
  specifications?: { group, items: { label, value }[] }[],
  brochure?:     { file, label? },

  locationDetail?: {
    coordinates?: { lat, lng },
    address?, mapEmbedQuery?,
    landmarks?: { name, distance?, travelTime?, verified: boolean }[],
    connectivity?: string[],
  },

  cta?: { enquire, brochure, siteVisit, callback, whatsapp },  // all boolean
  seo?: { title?, description?, ogImage? },
}
```

**`verified: boolean` on every landmark distance** is a deliberate content-safety device: unverified claims are structurally prevented from rendering, directly enforcing PRD §9.5 ("all factual claims must be verified before publishing").

`site.json` holds brand, nav, contact, social, WhatsApp number, default SEO and feature flags. `home.json` holds all homepage copy — **zero hardcoded copy in components.**

**Validation:** `npm run validate:content` parses every JSON file through Zod, additionally asserting slug uniqueness, referential integrity (testimonial → project slug), media file existence on disk, and that no `verified: false` claim has copy attached. Wired into `prebuild` so **an invalid content commit cannot produce a build**.

This directly implements the PRD §24 content update workflow: edit JSON → validate → commit → deploy.

---

## 7. Design System

Direction: **restraint as luxury.** High contrast, oversized editorial type, generous negative space, gold used at roughly 2% of surface area. The reference is an architecture monograph, not a brochure.

### Colour tokens

| Token | Hex | Use |
|---|---|---|
| `ivory` | `#FBF9F5` | Primary light background |
| `ivory-deep` | `#F4F0E8` | Alternating light section |
| `sand` | `#E3DCD0` | Hairline borders, dividers |
| `charcoal` | `#14110F` | Primary dark background (warm black) |
| `charcoal-soft` | `#1F1B18` | Secondary dark section |
| `ink` | `#14110F` | Text on light |
| `ink-muted` | `#4A423C` | Body text on light — 8.1:1 on ivory |
| `bone` | `#EFEAE1` | Text on dark |
| `bone-muted` | `#A79E93` | Secondary text on dark |
| `gold` | `#C8A96A` | Decorative accent, rules, on dark only |
| `gold-ink` | `#9A7C46` | Gold *text* on light — 4.6:1, AA compliant |

Two gold tokens exist because decorative gold fails contrast as text. This satisfies both PRD §4 (gold as sparing accent) and PRD §21 (adequate contrast) simultaneously.

**Background hierarchy:** `ivory → charcoal → ivory-deep → charcoal → ivory`. Alternating light/dark creates the cinematic rhythm PRD §4 asks for, and gives each section a distinct "room".

### Typography — Fraunces + Inter Tight

Both variable fonts, **committed to the repository as local `woff2` files in `public/fonts/` and loaded via `next/font/local`** (revised in v2.1).

Rationale for local files over `next/font/google`:

- **Builds are hermetic.** `next/font/google` downloads font binaries from Google's CDN *at build time*. That makes every production build — including an emergency hotfix deploy on the VPS — dependent on an external network call succeeding. Committed files remove that failure mode entirely.
- **Reproducible output.** The exact font binary is pinned in Git; Google cannot silently reissue a revised file between builds.
- **No CSP exception needed.** `font-src 'self'` with no third-party origin (§15.1).
- **No build-time egress**, which matters on a firewalled VPS.

Both families are **SIL Open Font License 1.1**; the `OFL.txt` for each is committed alongside the binaries in `public/fonts/`, satisfying the licence's attribution requirement.

Loading remains fully optimized and zero-layout-shift: variable `woff2`, latin subset, `display: 'swap'`, `preload: true` on both families, and an explicit `adjustFontFallback` metric-matched local fallback so the swap causes no reflow. Fraunces retains its `SOFT` and `WONK` axes for optical warmth at display sizes.

| Role | Font | Size (clamp) | Tracking | Leading |
|---|---|---|---|---|
| Display / Hero | Fraunces 300 | `clamp(3rem, 8vw, 7.5rem)` | `-0.03em` | `0.95` |
| H1 | Fraunces 300 | `clamp(2.5rem, 5.5vw, 5rem)` | `-0.025em` | `1.02` |
| H2 | Fraunces 400 | `clamp(2rem, 4vw, 3.5rem)` | `-0.02em` | `1.1` |
| H3 | Fraunces 400 | `clamp(1.5rem, 2.5vw, 2.25rem)` | `-0.01em` | `1.2` |
| Lead | Inter Tight 300 | `clamp(1.125rem, 1.6vw, 1.5rem)` | `0` | `1.6` |
| Body | Inter Tight 400 | `1.0625rem` (17px) | `0` | `1.7` |
| Eyebrow | Inter Tight 500 | `0.75rem` | `0.18em` uppercase | `1` |

Light serif weights at very large sizes are the core premium signal. Measure capped at **68ch** for editorial body.

### Spacing, grid, components

- 4px base scale; **section rhythm is the differentiator**: `py-28` mobile → `py-44` desktop. Cramped vertical space is the #1 template tell.
- 12-column grid, `max-w-[1440px]`, gutters `20px → 64px`. Editorial blocks deliberately break the grid asymmetrically (7/5, 5/7) rather than centring everything.
- **Borders:** 1px `sand` hairlines only. No rounded corners above 2px, no shadows anywhere. Depth comes from imagery and space.
- **Buttons:** Primary = solid charcoal, no radius, generous 20×40px padding, letterspaced uppercase label. Secondary = hairline outline. Tertiary = text with an underline that wipes in from the left. **No gradients, no shadows, no scale-on-hover** (scale causes layout shift). Hover = colour/inversion over 200ms.
- **Project "cards" are not cards.** They are full-bleed editorial figures: large image, caption block beneath in a typographic hierarchy, hairline rule. No boxes, no badges-on-image, no price chips. This is the single biggest lever against looking like a marketplace, per PRD §9.3 and §10.
- **Forms:** underline-only inputs (bottom hairline), floating label that shrinks to eyebrow style, no filled boxes. 44px minimum touch target. Errors in a restrained red with `aria-live`. Forms must read as part of the editorial page, not a bolted-on widget.
- **Navigation:** transparent over hero with `bone` text → on scroll past 80vh, slides down as a compact ivory bar with `ink` text. Desktop = inline links. Mobile = fullscreen `charcoal` overlay with staggered Fraunces link reveals, focus-trapped.
- **Footer:** a designed closing statement — large Fraunces brand mark, hairline-separated columns, contact block, muted legal row. Never a link dump.
- **Lightbox:** full-viewport charcoal, image centred with generous margin, hairline counter, keyboard + swipe, focus trap, ESC to close.
- **Image treatment:** consistent aspect ratios (`3:2` editorial, `4:5` portrait, `16:9` cinematic), no filters, no overlays except a subtle bottom gradient where text overlays media.
- **Loading states:** ivory-toned skeletons matching final layout geometry — never spinners, never layout shift.

---

## 8. Motion System

Everything routes through `lib/motion`. **No `gsap` import is permitted inside a component file** — this prevents scattered animation code and keeps the bundle controlled.

- GSAP + ScrollTrigger + SplitText, dynamically imported client-side only, registered once.
- `MotionProvider` resolves capability once: `prefers-reduced-motion`, coarse pointer, `navigator.hardwareConcurrency`. Hooks read from context and degrade automatically.
- **Tokens:** durations `0.6 / 0.9 / 1.2s`; eases `power3.out` (entrances), `expo.out` (hero), `power2.inOut` (transitions). Consistent pacing is what makes motion feel authored rather than random.

| Where | Technique |
|---|---|
| Hero | Poster fades → SplitText line-mask reveal of headline, 0.08s stagger → subline + CTA fade-up → scroll cue |
| Section headings | SplitText line masks, `start: 'top 80%'`, once only |
| Images | `clip-path` inset wipe (GPU-friendly) |
| Editorial blocks | Subtle 24px fade-up, staggered |
| Parallax | `yPercent` on hero/story media only, ±8% maximum, desktop only |
| Nav | Scroll-state transition; mobile overlay staggered link reveal |
| Gallery | Crossfade + slight scale in lightbox |
| Page transitions | Short ivory/charcoal wipe, ≤400ms, skipped under reduced-motion |

**Hard rules (PRD §15):** content is never hidden behind an unplayed animation — reveals start at `opacity: 0` *only* once JS has confirmed it will run, otherwise content renders plainly. No scroll-jacking. Mobile uses fade-only (no parallax, no splits). Reduced-motion disables everything and sets final states immediately. `transform` / `opacity` / `clip-path` only — never animate layout properties.

### Scrolling model (revised in v2.1)

**Native browser scrolling is the default and the baseline.** ScrollTrigger observes native scroll; it does not replace it.

**ScrollSmoother is NOT an architectural dependency.** It is an *optional Phase-2 experiment*, evaluated behind a single feature flag and adopted only if visual testing proves it improves the experience. It is rejected by default if it causes any of:

- degraded perceived responsiveness or input latency on desktop
- any regression on mobile or touch devices
- interference with keyboard navigation, focus scrolling, or `scroll-into-view`
- conflict with `prefers-reduced-motion`
- a meaningful bundle-size or INP cost

Nothing else in the motion system may depend on ScrollSmoother being present. Every animation must work correctly under native scrolling, so removing the flag is a zero-risk, one-line change at any point.

---

## 9. Homepage Plan

| Section | Purpose | Desktop | Mobile | Motion | Data | CTA |
|---|---|---|---|---|---|---|
| **Hero** | Cinematic first impression | Full-viewport video, minimal overlay nav, headline bottom-left | **Poster image only** (no video), 100svh, Ken Burns | Split-mask headline reveal | `home.hero` | Explore Projects / Discover Garvit |
| **Manifesto** | Brand philosophy, not inventory | Asymmetric 5/7, huge Fraunces statement on ivory | Stacked, generous space | Line reveal + fade | `home.manifesto` | none |
| **Featured Projects** | Portfolio, not listings | Alternating full-bleed editorial figures, caption below | Single column, full-bleed image + caption | Clip-path image wipe + parallax | `getFeaturedProjects()` | Explore → `/projects/[slug]` |
| **Categories** | Villas / Plots / Farm Land | 3 columns, hairline-separated, tall 4:5 imagery, no boxes | Horizontal scroll-snap | Staggered fade | `home.categories` | Filtered `/projects` |
| **Haridwar Story** | Place and meaning | Dark charcoal, large imagery + editorial column | Stacked, dark | Parallax + text reveal | `locations.json` | none |
| **Philosophy** | Trust and approach | Ivory-deep, numbered editorial list, no icon boxes | Stacked, hairline-separated | Staggered fade | `home.philosophy` | none |
| **Testimonials** | Social proof | Single large Fraunces pull-quote, manual advance | One per view, swipeable | Crossfade | `testimonials.json` | — |
| **Closing CTA** | Single decisive action | Full-bleed charcoal, one large statement, two links | Stacked | Fade-up | `home.closingCta` | Schedule Visit / Talk to Us |
| **Footer** | Designed close | Brand mark, hairline columns, contact | Stacked | none | `site.json` | — |

**No lead form on the homepage.** Brand experience first, per PRD §9.8. The testimonials section renders only if data exists (§2.4).

---

## 10. Project Microsite System

A single `app/projects/[slug]/page.tsx` composes an ordered array of section components, each rendering **only if its data slice is present**:

```
Hero → Story → Highlights → Architecture → MasterPlan → FloorPlans
     → Amenities → Gallery → Location & Connectivity → Specifications
     → Brochure → Enquiry → Related Projects
```

Section presence is resolved once into a manifest, which also drives an optional sticky in-page nav. A project with only hero + gallery produces a clean, complete-feeling page with no gaps.

- **Master plan / floor plans:** high-res image → lightbox with pinch-zoom on touch, wheel-zoom on desktop, optional PDF download. No interactive hotspots or unit selector (PRD §11.5, §11.6, §28).
- **Gallery:** mixed portrait/landscape masonry, lazy-loaded below the fold, fullscreen lightbox with keyboard arrows, swipe, focus trap, hairline counter.
- **Location:** styled static map thumbnail; clicking swaps in the Maps Embed iframe. Landmarks render only where `verified: true`.
- **CTA bar:** a restrained sticky bar on mobile only (Enquire · WhatsApp), appearing after 60% scroll. **No floating WhatsApp bubble** — explicitly forbidden by PRD §4.

---

## 11. Lead System

One endpoint, `POST /api/lead`, with a **discriminated union** on `intent` (`enquiry | brochure | site-visit | callback`). One validation path, one rate limiter, one sink — no duplicated form plumbing.

**Pipeline:** honeypot check → min-time-on-form check (bot submissions are instant) → Zod parse → rate limit → normalise + attach attribution → `LeadSink.send()` → typed response.

**Captured (PRD §12):** name, phone (E.164 India validation), email, project slug, requirement, preferred date/time, consent boolean + timestamp, `utm_source` / `utm_medium` / `utm_campaign`, landing URL, referrer, submission timestamp, user-agent.

Attribution is captured on first page load into `sessionStorage` — so the *original* UTM survives internal navigation — and injected at submit.

**Security:** honeypot + timing trap (no CAPTCHA — it would damage the premium feel; reconsider only if spam materialises) · in-memory sliding-window rate limit (3 per 10 min per IP, 10 per hour) · strict server-side validation with length caps · all output HTML-escaped in the email template · generic client-facing error messages · **zero secrets client-side** — SMTP credentials live only in `.env` on the VPS.

**`LeadSink` interface** with `EmailSink` as the v1 implementation. Adding a CRM later is one new file plus one line in a factory (PRD §12). Per §2.2, a `catch`-block-only append to `var/leads-failed.jsonl` prevents silent lead loss on SMTP failure.

**Brochure (soft gate):** form submit → success state reveals the download link and triggers it.

> **Accepted risk:** the PDF lives in `/public` and is therefore directly reachable by URL. The gate is a conversion prompt, not an access control. Do not place commercially sensitive material behind it.

---

## 12. SEO

- `buildMetadata()` drives every page: title template, description, canonical, OG, Twitter card. Project pages derive from `project.seo` with sensible fallbacks.
- **`opengraph-image.tsx`** per project — composed at build from the hero image + project name in Fraunces. Far better share appearance than a generic logo.
- **JSON-LD, only what the content truthfully supports:** `Organization` + `LocalBusiness` sitewide; `BreadcrumbList` on nested pages; `Place` / `Residence` on projects. **No `AggregateRating`, no `Review`, no fabricated awards** — per PRD §18 these are also a Google manual-action risk, not merely an honesty issue.
- `sitemap.ts` generated from the repository, so hidden projects and an empty testimonials page are automatically excluded; `robots.ts` allows all, disallows `/api/`.
- Semantic heading hierarchy enforced in QA — exactly one `h1` per page.
- **Alt text is a required field in the `ImageAsset` schema**, so a missing alt fails the content validation build step. Decorative images use an explicit `alt: ""`.

---

## 13. Performance

Targets: **LCP < 2.5s · CLS < 0.1 · INP < 200ms** on a mid-tier Android over 4G.

| Area | Approach |
|---|---|
| **Hero video** | **The poster image is the LCP element** (`next/image priority`, `fetchPriority=high`). Video attaches only after `load` + idle, desktop and non-save-data only. ≤6s, ≤2.5MB, WebM VP9 + MP4 fallback. **Mobile gets no video at all.** |
| **Images** | Build-time downscale ≤2560px; WebP only; trimmed `deviceSizes`; explicit dimensions everywhere (zero CLS); blur placeholders; `priority` on hero only; everything else lazy. |
| **Fonts** | `next/font/local` from committed `woff2` files, variable, latin subset, `display: swap`, preloaded, metric-matched fallback. Two families total, same-origin, no build-time network dependency. |
| **GSAP** | Dynamic import, client-only, tree-shaken to core + ScrollTrigger + SplitText. Never in the initial bundle. |
| **Maps** | Zero JS until click. |
| **Scripts** | GTM only, `lazyOnload`, gated by consent. |
| **Code splitting** | Lightbox, gallery, forms and map all `next/dynamic` with `ssr: false`. |
| **Caching** | Immutable 1yr for `/_next/static` and `/images`; Cloudflare cache rules for `/_next/image*`; Brotli at both Nginx and Cloudflare. |

Bundle budget: **< 120KB gzipped initial JS**, enforced with `@next/bundle-analyzer` at each phase gate.

---

## 14. VPS Production Architecture

**Server:** Ubuntu 22.04/24.04 LTS · **Node 24 LTS** (nvm, matching `.nvmrc`) · Nginx · PM2 · Certbot · UFW.

> **Runtime parity is a hard requirement.** Node 24 LTS is used identically in local development, CI, staging and production. A deploy must fail rather than proceed on a mismatched major version; `deploy.sh` asserts this before building.

- **Next config:** `output: 'standalone'` for a minimal, self-contained deploy artifact.
- **PM2:** fork mode, 1 instance (§2.3), `max_memory_restart: '500M'`, `pm2 startup` + `pm2 save` for boot persistence, `pm2 reload` for zero-downtime deploys, `pm2-logrotate`.
- **Nginx:** reverse proxy to `127.0.0.1:3000`; serves `/_next/static` and `/public` directly from disk, bypassing Node entirely; `proxy_buffering off` + `X-Accel-Buffering: no` for streaming; `limit_req` on `/api/lead`; `client_max_body_size 1m`; gzip + brotli; security headers; `server_tokens off`.
- **TLS:** Let's Encrypt via Certbot with auto-renew timer; Cloudflare SSL mode **Full (Strict)**.
- **Cloudflare:** DNS proxied, WAF managed rules, rate limiting on `/api/lead`, cache rules, Brotli, Always-Use-HTTPS. **Restore real visitor IPs** via `ngx_http_realip_module` with Cloudflare's published ranges — otherwise every request appears to originate from Cloudflare and **application rate limiting silently fails**.
- **Deploy:** `deploy.sh` — `git pull` → `npm ci` → `validate:content` → `build` → `pm2 reload` → smoke check. Fails fast and leaves the running app untouched if the build fails.
- **Env:** `.env.local` on server, `chmod 600`, never committed; `.env.example` documents required keys.
- **Backups:** nightly cron tarball of `/data`, `/public`, `.env` and Nginx config, retained 14 days, plus an off-server copy. Git is the source of truth for code.
- **Staging:** `staging.<domain>` on the same VPS, separate PM2 process and port, `noindex` via `X-Robots-Tag`.

---

## 15. Security Checklist

No claims of invulnerability — this is defence in depth against realistic threats.

**Application:** server-side Zod validation on all input with length caps · React's default escaping for XSS, no `dangerouslySetInnerHTML` anywhere · no SQL/DB, so no injection surface · honeypot + timing bot trap · IP rate limiting · same-origin check on the lead endpoint · generic error responses that never leak stack traces · no secrets in client bundles (audited — only `NEXT_PUBLIC_*` reaches the browser) · path-traversal-safe static file handling · `npm audit` + Dependabot · pinned dependency versions, no floating ranges.

**Headers:** static CSP (§15.1) · HSTS with preload · `X-Content-Type-Options: nosniff` · `X-Frame-Options: SAMEORIGIN` · `Referrer-Policy: strict-origin-when-cross-origin` · restrictive `Permissions-Policy` · `X-Robots-Tag` on staging only.

### 15.1 Content Security Policy — static, CDN-compatible (v2.1)

**Design constraint:** the policy must be identical for every visitor so that prerendered HTML stays cacheable at Cloudflare. That rules out nonces (§2.7). The policy is therefore a **static allowlist**, emitted as a constant header.

**Delivery:** set in **Nginx** at the server level via a shared `snippets/security-headers.conf` included in every `location` block — so it covers both Node-proxied responses and assets Nginx serves directly from disk. The same header set is mirrored in `next.config.ts` `headers()` for dev/prod parity.

> **Nginx gotcha:** `add_header` does not inherit into a `location` block that declares its own `add_header`. The snippet must be included in *every* location, and every directive uses `always` so headers are emitted on error responses too. This is a common silent misconfiguration.

**Policy:**

```
default-src   'self';
base-uri      'self';
object-src    'none';
frame-ancestors 'self';
form-action   'self';
script-src    'self' 'unsafe-inline'
              https://www.googletagmanager.com
              https://www.google-analytics.com
              https://connect.facebook.net;
style-src     'self' 'unsafe-inline';
img-src       'self' data: blob:
              https://www.googletagmanager.com
              https://*.google-analytics.com
              https://maps.googleapis.com
              https://maps.gstatic.com
              https://*.gstatic.com
              https://www.facebook.com;
font-src      'self';
connect-src   'self'
              https://*.google-analytics.com
              https://*.analytics.google.com
              https://*.googletagmanager.com
              https://stats.g.doubleclick.net
              https://connect.facebook.net
              https://www.facebook.com;
frame-src     https://www.google.com
              https://td.doubleclick.net;
media-src     'self';
worker-src    'self' blob:;
manifest-src  'self';
upgrade-insecure-requests;
```

`frame-src https://www.google.com` covers the Maps Embed iframe (§10). `font-src 'self'` needs no third-party origin precisely because fonts are self-hosted (§7) — correction 3 and correction 2 reinforce each other.

**Why `'unsafe-inline'` is required in `script-src`:** the Next.js App Router inlines the RSC flight payload as `self.__next_f.push(...)` inline scripts whose content differs per page and per build. Hash-based allowlisting is therefore impractical, and the nonce alternative forces dynamic rendering. GTM independently requires it.

**Why the residual risk is low here — compensating controls:**

| Control | Effect |
|---|---|
| **No user-generated content anywhere** | No comments, no search, no reflected URL parameters rendered into the page. The standard XSS entry points do not exist. |
| **All content authored at build time** and schema-validated (§6) | Injection would require commit access to the repository |
| **Zero `dangerouslySetInnerHTML`** — enforced by the `react/no-danger` ESLint rule as a build error | Removes the main React XSS vector |
| React default escaping | Interpolated values are escaped |
| `object-src 'none'` + `base-uri 'self'` | Blocks the plugin and `<base>` -tag bypass gadgets |
| `form-action 'self'` | Blocks credential/data exfiltration via injected forms |
| `frame-ancestors 'self'` | Clickjacking protection |
| Cloudflare WAF | Edge filtering ahead of the origin |

`'unsafe-inline'` weakens the policy against an attacker who can already inject markup. On a statically generated brochure site with no user input surface, that precondition is not reachable through the application. The other directives remain strict, so the policy still provides real defence in depth.

**Note on GSAP:** `style-src` does not govern CSSOM mutation. GSAP animates via `element.style.*` assignments, which CSP does not restrict, so the motion system needs no CSP exception.

**Rollout:** ship as `Content-Security-Policy-Report-Only` with a reporting endpoint, verify a clean report window across all routes and both analytics and Maps interactions, then promote to enforcing `Content-Security-Policy` in Phase 7.

**VPS:** SSH key-only, `PasswordAuthentication no`, root login disabled, non-root deploy user · UFW default-deny, only 22/80/443 open · `fail2ban` on SSH · `unattended-upgrades` for security patches · Nginx hardening · HTTPS only.

**Privacy:** consent banner + Consent Mode v2 · published privacy policy · no personal data written to disk in the happy path.

---

## 16. Development Phases

Each phase has an explicit gate. **Phase N+1 does not start until Phase N's gate passes.**

### Phase 1 — Foundation
**Goal:** a structurally sound, type-safe, content-validated skeleton.
**Deliverables:** Next 16 + TS strict + Tailwind v4 · `.nvmrc` pinned to **Node 24 LTS** · Zod schemas · `ContentSource` + `json-source` + repository · placeholder JSON (clearly marked) · `validate-content` wired to prebuild · **self-hosted `woff2` fonts + `next/font/local`** · design tokens in CSS · base metadata · **static security headers incl. CSP Report-Only** · PM2/Nginx configs drafted.
**Dependencies:** none.
**Gate:** `build` + `typecheck` + `lint` + `validate:content` all green; repository returns typed data; deliberately invalid JSON **fails** the build; **every content route confirmed statically prerendered** in the build output.

### Phase 2 — Design System
**Goal:** approved visual language before any page production.
**Deliverables:** `components/ui` + `layout` · Header/Nav/OverlayMenu · Footer · Section/Container/Grid · Buttons/Forms/Modal/Lightbox/Gallery · loading + 404 + error pages · motion utilities + MotionProvider · **optional ScrollSmoother experiment behind a feature flag (§8) — adopt or discard based on testing**.
**Dependencies:** Phase 1.
**Gate:** a kitchen-sink route renders every component at 375/768/1024/1440; keyboard nav and focus states verified; reduced-motion verified. **Requires explicit client visual sign-off** — this enforces PRD §27's "do not start mass page production before the visual system is approved".

### Phase 3 — Homepage
**Deliverables:** all nine sections, desktop + mobile, with motion.
**Dependencies:** Phase 2 sign-off; hero media.
**Gate:** visual review at four widths; LCP < 2.5s on throttled 4G; CLS < 0.1; reduced-motion clean; no section resembles a template.

### Phase 4 — Projects System
**Deliverables:** listing + filters + dynamic routes + all microsite blocks + map facade + lightbox.
**Dependencies:** Phase 2; project data and imagery.
**Gate:** a project with *minimal* data renders with no empty sections and no visual gaps; filters are instant; lightbox is keyboard- and touch-accessible.

### Phase 5 — Leads & Supporting Pages
**Deliverables:** `/api/lead` + all four forms + WhatsApp + About/Testimonials/Contact/Privacy/Terms + analytics events + consent banner.
**Dependencies:** Phase 2; SMTP credentials; official contact details.
**Gate:** all four intents validated server-side and delivered by email; rate limit and honeypot proven; forms fully keyboard- and screen-reader-accessible; events fire in GTM preview.

### Phase 6 — SEO / Performance / Analytics
**Deliverables:** metadata, OG images, sitemap, robots, JSON-LD, bundle analysis, image pipeline, caching.
**Dependencies:** Phases 3–5.
**Gate:** Lighthouse ≥ 95 Performance / ≥ 95 SEO / ≥ 95 Accessibility on home and a project page; structured data passes Google's Rich Results Test; initial JS < 120KB gz.

### Phase 7 — Security & QA
**Deliverables:** CSP promotion from Report-Only to enforcing (§15.1), headers, spam hardening, cross-browser, a11y audit, responsive QA.
**Dependencies:** Phase 6.
**Gate:** securityheaders.com A+; axe-core zero critical/serious; Safari/Chrome/Firefox + iOS/Android verified; **CSP Report-Only window clean across all routes, GTM and Maps before enforcing**; static prerendering still intact after headers are applied.

### Phase 8 — Hostinger VPS Deployment
**Deliverables:** VPS provisioning, hardening, Nginx, SSL, Cloudflare, PM2, backups, staging, production smoke tests.
**Dependencies:** Phase 7; domain, VPS access, content freeze.
**Gate:** production smoke suite passes; SSL A+; real-IP restoration confirmed; backup restore rehearsed; rollback verified.

---

## 17. Testing Strategy

- **Unit (Vitest):** Zod schemas (valid/invalid fixtures), phone/email normalisation, attribution parsing, rate limiter windowing, `buildMetadata`, section-presence resolution.
- **Content:** `validate-content` as a CI gate — slug uniqueness, referential integrity, media existence, alt-text presence, unverified-claim guard.
- **Integration:** `/api/lead` per intent — valid, invalid, honeypot-tripped, rate-limited, SMTP-failure.
- **E2E (Playwright), critical flows:** projects listing + filters · project slug · brochure request · enquiry · site visit · callback · WhatsApp link · map facade click · mobile nav open/close/focus-trap · lightbox keyboard nav.
- **Responsive QA:** 375 / 414 / 768 / 1024 / 1280 / 1440 / 1920.
- **Cross-browser:** Chrome, Safari, Firefox, Edge; iOS Safari, Android Chrome. Safari gets extra attention for `svh` units, video autoplay policy and `clip-path` animation.
- **Accessibility:** axe-core automated + manual keyboard traversal, VoiceOver spot-check, contrast verification, reduced-motion.
- **Performance:** Lighthouse CI + throttled-4G manual runs on a real mid-tier Android.
- **Production smoke:** all routes 200 · sitemap/robots reachable · SSL valid · security headers present · one real lead submitted end-to-end and received · analytics firing · PM2 survives reboot.

---

## 18. Content Safety Policy

Per PRD §15 and STEP 15, the following must **never** be invented: project names, prices, RERA numbers, statistics, awards, years of experience, customer numbers, locations, distances, testimonials, investment returns, construction claims.

Enforcement mechanisms built into the system rather than left to discipline:

1. **All copy lives in `/data/*.json`** — none is hardcoded in components, so it is auditable in one place.
2. **`verified: boolean`** on landmark distances and travel times; unverified entries cannot render.
3. **Placeholder content is prefixed and clearly marked**, and a content-freeze gate before Phase 8 requires it all to be replaced.
4. **No rating/review schema** is implemented at all, so fabricated ratings are not even expressible.
5. **Testimonials render only from real data**; an empty file means the feature disappears entirely.

---

## 19. Risks & Open Items

| Risk | Impact | Mitigation |
|---|---|---|
| **Media quality is the hard dependency** | Critical — no amount of engineering makes stock photography look premium | Confirm real photography/video availability early; gates Phase 3 |
| Content not finalised | Launch delay | Placeholder clearly marked; content-freeze gate before Phase 8 |
| VPS RAM unknown | OOM under image load | Confirm specs; three-layer image mitigation already planned (§2.1) |
| No CMS → client cannot self-edit | Ongoing dev dependency for every copy change | Documented JSON workflow; Sanity migration path already architected |
| Hero video vs LCP | Core Web Vitals failure | Poster-as-LCP; mobile has no video |
| CSP breaking GTM | Silent analytics loss | Report-Only first (§15.1) |
| CSP `'unsafe-inline'` in `script-src` | Weaker XSS defence than a nonce policy | Accepted tradeoff to preserve static rendering; compensating controls in §15.1 |
| A future change reintroducing middleware/nonce | Silent loss of static rendering and CDN caching | Phase gates assert prerendering in build output; no `middleware.ts` in the tree |
| Cloudflare masking IPs | Rate limiting silently fails | `realip` module configured in Phase 8 |
| Over-animation | Fails the premium bar | Central motion tokens; visual review gate each phase |
| Soft brochure gate bypassed | Ungated PDF access | Accepted by client; do not gate sensitive material |
| Email-only lead delivery | Lead lost on SMTP failure | Failure-path log (§2.2) |

### Information still required from the client

Blocking **Phase 8**, not Phase 1:

1. Production domain + staging subdomain
2. VPS specs (RAM/vCPU) and SSH access
3. SMTP credentials + destination sales inbox
4. Real photography / video / renders — the single biggest quality dependency
5. Official contact details, address, WhatsApp number (PRD §13 forbids placeholder contact info in production)
6. GTM container ID, GA4 measurement ID, Meta Pixel ID
7. Confirmed project data, and legal review of Privacy / Terms copy

---

## 20. Ready-to-Develop Checklist

- [x] v1.0 PRD read in full
- [x] Stack versions verified (Next 16.3.x, **Node 24 LTS**, Tailwind v4, GSAP free tier)
- [x] CSP redesigned to preserve static rendering and CDN cacheability (§15.1)
- [x] Fonts self-hosted; no build-time external dependency (§7)
- [x] ScrollSmoother scoped as optional, non-blocking experiment (§8)
- [x] Architecture, layering and migration seam defined
- [x] Folder structure defined
- [x] Routes and rendering strategy defined
- [x] Data model and validation strategy defined
- [x] Design system defined (tokens, type scale, components)
- [x] Motion system defined with accessibility rules
- [x] Lead architecture defined (decisions confirmed)
- [x] SEO / performance / security / deployment plans defined
- [x] Phases with acceptance gates defined
- [x] Testing strategy defined
- [x] Content safety enforcement defined
- [x] Risks identified
- [x] **Client approval of this plan**
- [ ] Phase 2 visual sign-off (checkpoint during build)
- [ ] Real content and media supplied (before launch)
- [ ] VPS / domain / SMTP / analytics credentials supplied (before Phase 8)

---

## 21. Final Product Standard

Reaffirmed from PRD §30. Every design and engineering decision in this document exists to protect this hierarchy:

**Brand → Architecture → Storytelling → Projects → Trust → Conversion**

rather than:

**Offers → Popups → Forms → Property Cards → Repeated CTAs**

The implementation is rejected if it looks like a template, if typography is ordinary, if project presentation resembles a property portal, if spacing is inconsistent, if mobile looks compressed rather than designed, if animation feels excessive, if the hero feels generic, if forms feel disconnected from the design language, or if the footer looks like an afterthought.

**Visual quality is a release requirement, not an optional enhancement.**

---

*End of Technical PRD v2.0.*
