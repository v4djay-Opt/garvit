import type { NextConfig } from "next";

// ─── Static CSP (PRD §15.1) ──────────────────────────────────────────────────
// Delivered as a static header — NOT generated per-request via middleware —
// so that all content routes remain statically prerendered and CDN-cacheable.
// Starts as Report-Only; promote to enforcing in Phase 7 after clean reports.
//
// For Nginx (production): copy the same header set into
//   deploy/nginx/snippets/security-headers.conf
// and include it in every location block so it covers disk-served assets too.

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  // 'unsafe-inline' required for: Next.js RSC flight payload inline scripts +
  // GTM. Compensating controls: no dangerouslySetInnerHTML (ESLint rule),
  // no user-generated content, all content build-time validated. See PRD §15.1.
  `script-src 'self' 'unsafe-inline'` +
    ` https://www.googletagmanager.com` +
    ` https://www.google-analytics.com` +
    ` https://connect.facebook.net`,
  `style-src 'self' 'unsafe-inline'`,
  // font-src 'self' only — fonts are self-hosted (PRD §7, no Google Fonts CDN)
  "font-src 'self'",
  [
    "img-src 'self' data: blob:",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://maps.googleapis.com",
    "https://maps.gstatic.com",
    "https://*.gstatic.com",
    "https://www.facebook.com",
  ].join(" "),
  [
    "connect-src 'self'",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
    "https://stats.g.doubleclick.net",
    "https://connect.facebook.net",
    "https://www.facebook.com",
  ].join(" "),
  // frame-src covers Maps Embed iframe (PRD §10)
  "frame-src https://www.google.com https://td.doubleclick.net",
  "media-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(process.env.CSP_ENFORCE === "true" ? ["upgrade-insecure-requests"] : []),
].join("; ");

// Populate via env var once a reporting endpoint is ready (Phase 7).
const CSP_REPORT_URI = process.env.CSP_REPORT_URI || "";
const CSP_HEADER_VALUE =
  CSP_DIRECTIVES + (CSP_REPORT_URI ? `; report-uri ${CSP_REPORT_URI}` : "");

// Phase 7: change this to "Content-Security-Policy" after a clean report window.
const CSP_HEADER_NAME = process.env.CSP_ENFORCE === "true" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";

// ─── Security headers ─────────────────────────────────────────────────────────
const SECURITY_HEADERS = [
  { key: CSP_HEADER_NAME, value: CSP_HEADER_VALUE },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "browsing-topics=()",
    ].join(", "),
  },
];

// ─── Next.js config ───────────────────────────────────────────────────────────
const nextConfig: NextConfig = {
  // The local preview proxy uses 127.0.0.1 rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
  // Minimal standalone output for VPS deployment (PM2 + Nginx, PRD §14).
  output: "standalone",
  outputFileTracingIncludes: { "/*": ["./data/**/*.json"] },

  // WebP only — AVIF dropped to protect VPS from OOM under concurrent encodes
  // (PRD §2.1 / Technical PRD §2.1). Six widths that match our Tailwind breakpoints.
  images: {
    formats: ["image/webp"],
    deviceSizes: [375, 640, 828, 1080, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 31536000, // 1 year
    // All images are local; no external remotePatterns needed in v1.
    remotePatterns: [],
  },

  // Static security headers — same set goes into Nginx snippets for production.
  async headers() {
    return [
      {
        // Apply to every route.
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  // Collapse legacy duplicate-URL variants onto the canonical homepage.
  // (www→apex and http→https happen at the Nginx layer — see deploy/nginx.)
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php",  destination: "/", permanent: true },
      { source: "/home",       destination: "/", permanent: true },
      { source: "/index",      destination: "/", permanent: true },
    ];
  },

  // Strict mode catches hydration issues early.
  reactStrictMode: true,

  // Silence noisy x-powered-by header.
  poweredByHeader: false,

  // Standalone previews also need compression; Nginx preserves encoded responses.
  compress: true,

  // Note: `eslint` and `typescript` top-level config keys were removed in
  // Next.js 16. ESLint and TypeScript are run via separate npm scripts.
  // `next build` still fails on type errors; lint failures come from `npm run lint`.
};

export default nextConfig;
