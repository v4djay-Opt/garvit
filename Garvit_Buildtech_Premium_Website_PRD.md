# Garvit Buildtech --- Premium Real Estate Developer Website PRD

**Product:** Corporate Real Estate Developer Website\
**Brand:** Garvit Buildtech\
**Primary Market:** Haridwar, Uttarakhand\
**Positioning:** Premium real estate developer\
**Target Quality:** \$2,000+ agency-grade website experience\
**Primary Objective:** Premium branding\
**Version:** 1.0 --- Final Architecture

------------------------------------------------------------------------

## 1. Product Vision

Garvit Buildtech's website must feel like a premium real estate brand
experience, not a generic property portal or template-based builder
website.

The website should communicate trust, architectural quality, land value,
lifestyle, long-term vision and brand credibility through cinematic
visuals, sophisticated typography, restrained animation and strong
storytelling.

The first impression must feel premium even before the visitor reads the
content.

### Core Principles

-   Cinematic, editorial and architectural visual language.
-   Minimal interface with generous whitespace.
-   Premium typography and strong art direction.
-   Real project photography/video should dominate the experience.
-   Animation should enhance storytelling, never feel gimmicky.
-   Mobile experience must feel equally premium.
-   Fast loading despite high-quality media.
-   No fake statistics, awards, testimonials or project claims.
-   Lead generation should remain available without making the site look
    sales-heavy.

------------------------------------------------------------------------

## 2. Current Business Scope

### Current Property Types

-   Villas
-   Residential Plots
-   Farm Land

### Future Ready

The architecture must support additional property categories without
redesigning the frontend, including:

-   Commercial
-   Retail
-   Mixed-use
-   Other future developments

### Project Status

-   Ongoing
-   Upcoming

Delivered projects can be added later without restructuring the
application.

### Initial Project Volume

Approximately **1--5 projects**.

------------------------------------------------------------------------

## 3. Target Audience

Primary audiences include:

-   Home buyers
-   Plot buyers
-   Farm land buyers
-   Investors
-   NRIs
-   Buyers considering Haridwar and surrounding growth corridors
-   Families looking for long-term residential or land investments

------------------------------------------------------------------------

## 4. Brand & Visual Direction

### Design Direction

Use a hybrid luxury design system:

-   Cinematic dark sections
-   Clean ivory/light sections
-   Charcoal/near-black
-   Warm white/ivory
-   Muted champagne-gold accents

Gold must be used sparingly. It should function as an accent rather than
dominate the interface.

### Visual Character

The website should feel:

-   Premium
-   Sophisticated
-   Architectural
-   Trustworthy
-   Established
-   Calm
-   Modern
-   Aspirational

### Avoid

-   Generic real estate templates
-   Excessive gradients
-   Bright gold everywhere
-   Cheap glassmorphism
-   Oversized floating WhatsApp widgets
-   Excessive card layouts
-   Stock-photo-heavy sections
-   Constant animation
-   Flashy counters without meaningful data
-   Crowded hero sections
-   Too many CTAs above the fold

------------------------------------------------------------------------

## 5. Typography

Use a premium serif + modern sans-serif pairing.

### Serif

For:

-   Hero headlines
-   Brand statements
-   Project titles
-   Editorial headings

### Sans Serif

For:

-   Navigation
-   Body copy
-   Forms
-   Labels
-   Metadata
-   Buttons

Typography must use large scale, controlled line lengths, generous
line-height and deliberate whitespace.

------------------------------------------------------------------------

## 6. Technology Stack

### Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS

### Animation

Primary:

-   GSAP
-   ScrollTrigger

Use CSS transitions for simple hover/focus states.

Avoid adding multiple animation frameworks unless technically necessary.

### Content

No CMS.

No admin panel.

No website login system.

Content will be stored in structured JSON files and version controlled
with the codebase.

### Hosting

Existing **Hostinger VPS**.

Recommended production architecture:

`Cloudflare → Nginx → Next.js → PM2`

### Server

-   Ubuntu
-   Node.js LTS
-   Nginx
-   PM2
-   Let's Encrypt SSL
-   UFW firewall
-   Git-based deployment

------------------------------------------------------------------------

## 7. JSON Content Architecture

Recommended structure:

``` text
/data
  site.json
  home.json
  projects.json
  testimonials.json
  locations.json
```

Media:

``` text
/public
  /images
  /videos
  /projects
  /brochures
  /floor-plans
```

### Project Data Example

``` json
{
  "slug": "project-name",
  "name": "Project Name",
  "type": "Villa",
  "status": "Ongoing",
  "location": "Haridwar",
  "shortDescription": "",
  "heroImage": "/projects/project-name/hero.webp",
  "heroVideo": "/projects/project-name/hero.webm",
  "brochure": "/brochures/project-name.pdf",
  "floorPlans": [],
  "gallery": [],
  "coordinates": {
    "lat": null,
    "lng": null
  }
}
```

The frontend must not be tightly coupled to the JSON implementation. A
data-access layer should be used so JSON can later be replaced by a
CMS/API/database without redesigning UI components.

------------------------------------------------------------------------

## 8. Sitemap

### Primary Pages

1.  Home
2.  About Garvit Buildtech
3.  Projects
4.  Individual Project Detail
5.  Testimonials
6.  Contact
7.  Privacy Policy
8.  Terms & Conditions

### Future-ready Pages

-   Commercial
-   Media / Press
-   Careers
-   Construction Updates
-   Blog / Insights

These should not necessarily be exposed in navigation at launch.

------------------------------------------------------------------------

# 9. Homepage Specification

## 9.1 Cinematic Hero

Full viewport hero section.

### Desktop

Use premium project/brand video.

### Mobile

Use optimized mobile video or carefully selected fallback image where
required for performance.

### Hero Content

Keep copy minimal:

-   Brand statement
-   Short supporting line
-   Primary CTA: **Explore Projects**
-   Secondary CTA: **Discover Garvit**

### Requirements

-   Full viewport experience
-   Minimal navigation overlay
-   Controlled text entrance animation
-   Subtle scroll cue
-   Video poster image
-   Video muted/autoplay/loop where browser policy allows
-   No audio autoplay
-   Strong contrast and readability

------------------------------------------------------------------------

## 9.2 Brand Manifesto

Editorial introduction to Garvit Buildtech.

Use large typography, short copy and generous whitespace.

This section should communicate the philosophy behind creating
developments rather than immediately selling inventory.

------------------------------------------------------------------------

## 9.3 Featured Projects

Show selected projects using large immersive visuals.

Avoid small marketplace-style property cards.

Each project should display only essential information:

-   Project name
-   Property type
-   Location
-   Status
-   Short positioning statement
-   Explore CTA

Hover/scroll interactions can reveal additional information.

------------------------------------------------------------------------

## 9.4 Property Categories

Show current categories:

-   Villas
-   Plots
-   Farm Land

Commercial should remain supported in the data model but hidden until
required.

------------------------------------------------------------------------

## 9.5 Haridwar / Location Story

A visually rich section communicating the significance of the project's
geography.

Do not make unsupported investment-growth claims.

Possible content:

-   Connectivity
-   Lifestyle
-   Natural setting
-   Nearby landmarks
-   Infrastructure
-   Accessibility

All factual claims must be verified before publishing.

------------------------------------------------------------------------

## 9.6 Developer Philosophy

Present the brand's approach around:

-   Planning
-   Quality
-   Design
-   Transparency
-   Customer experience

Only publish claims supplied or approved by Garvit Buildtech.

------------------------------------------------------------------------

## 9.7 Testimonials

Premium editorial treatment.

Each testimonial may contain:

-   Customer name
-   Project
-   Testimonial
-   Photo if approved

No fabricated testimonials.

------------------------------------------------------------------------

## 9.8 Closing Brand CTA

End the homepage with a visually strong, minimal CTA.

Possible actions:

-   Explore Projects
-   Schedule a Site Visit
-   Talk to Us

Avoid turning the footer area into an aggressive lead form.

------------------------------------------------------------------------

# 10. Projects Listing Page

The Projects page must feel like a curated portfolio.

### Filters

Status:

-   All
-   Ongoing
-   Upcoming

Type:

-   Villa
-   Plot
-   Farm Land
-   Commercial --- hidden until launched

### Project Presentation

Use large imagery and editorial layouts.

Do not imitate property marketplace grids.

------------------------------------------------------------------------

# 11. Individual Project Microsite

Every project page must feel like a dedicated premium microsite.

This is one of the most important parts of the website.

## Recommended Sequence

### 11.1 Project Hero

-   Fullscreen image/video
-   Project name
-   Location
-   Property type
-   Minimal CTA

### 11.2 Project Story

Short editorial narrative explaining the concept and positioning.

### 11.3 Key Highlights

Use a restrained layout.

Avoid excessive icon boxes.

### 11.4 Architecture / Development Story

Large imagery with supporting copy.

### 11.5 Master Plan

Normal high-resolution image as selected.

Features:

-   Zoom/lightbox
-   Mobile-friendly viewing

No interactive hotspots required in v1.

### 11.6 Floor Plans

Image/PDF-based system.

Support:

-   Floor plan image
-   Unit/type label
-   Area/details
-   View fullscreen
-   Download PDF where available

No complex interactive unit selector required.

### 11.7 Amenities / Features

Use photography and editorial layouts where possible rather than generic
icon grids.

### 11.8 Gallery

Premium fullscreen gallery.

Support:

-   Landscape images
-   Portrait images
-   Swipe on mobile
-   Keyboard navigation on desktop
-   Lazy loading

### 11.9 Location & Connectivity

Google Maps integration.

Show:

-   Project marker
-   Important nearby landmarks
-   Connectivity information
-   Travel times where verified

### 11.10 Specifications

Structured, easy-to-read project specifications.

### 11.11 Brochure

Brochure download should open lead capture first.

### 11.12 Project Enquiry

Available actions:

-   Enquire Now
-   Download Brochure
-   Schedule Site Visit
-   Request Callback
-   WhatsApp

------------------------------------------------------------------------

# 12. Lead Capture System

Required lead actions:

1.  General Enquiry
2.  Download Brochure
3.  Schedule Site Visit
4.  Request Callback
5.  WhatsApp

### Recommended Form Fields

-   Name
-   Phone
-   Email
-   Project
-   Requirement
-   Preferred visit date/time where relevant
-   Consent checkbox

### Tracking

Capture where available:

-   UTM source
-   UTM medium
-   UTM campaign
-   Landing page
-   Referrer
-   Timestamp

### Current CRM

No CRM integration in v1.

Forms should be architected so CRM/API integration can be added later.

------------------------------------------------------------------------

# 13. Contact Page

Include:

-   Corporate contact details
-   Office address
-   Google Map
-   Enquiry form
-   WhatsApp
-   Working hours if provided
-   Project-specific contact routing if needed later

Do not publish placeholder contact information.

------------------------------------------------------------------------

# 14. Navigation

Desktop navigation should be minimal.

Suggested:

-   Home
-   About
-   Projects
-   Testimonials
-   Contact

Use a premium fullscreen or carefully designed overlay menu if it
improves the visual experience.

### Header Behaviour

-   Transparent over hero
-   Transition to solid/light/dark state after scroll
-   Smooth but fast animation
-   Clear active states
-   Strong mobile navigation

------------------------------------------------------------------------

# 15. Animation System

Animation is critical to the premium experience but must remain
controlled.

### Use GSAP / ScrollTrigger For

-   Hero text reveals
-   Image masking/reveals
-   Section transitions
-   Project storytelling
-   Parallax where appropriate
-   Editorial typography movement
-   Gallery transitions
-   Navigation transitions

### Animation Rules

-   Never animate everything.
-   Avoid excessive scroll-jacking.
-   Do not make users wait for animations.
-   Respect `prefers-reduced-motion`.
-   Maintain usability on low-powered mobile devices.
-   Use subtle easing and premium pacing.
-   Avoid gimmicky cursor effects on touch devices.

------------------------------------------------------------------------

# 16. Responsive Experience

Mobile must not be treated as a compressed desktop layout.

Create dedicated responsive behaviour for:

-   Hero media
-   Typography
-   Navigation
-   Galleries
-   Project cards
-   Forms
-   Floor plans
-   Maps
-   CTAs

Test at common mobile, tablet, laptop and large desktop widths.

------------------------------------------------------------------------

# 17. Media Strategy

High-quality visual assets are essential to achieving the desired
premium result.

Preferred priority:

1.  Real project photography
2.  Professional project renders
3.  Drone footage
4.  Architectural/detail footage
5.  Approved lifestyle photography

Avoid generic stock imagery wherever possible.

### Image Formats

Prefer:

-   AVIF
-   WebP

Use responsive image sizing and lazy loading.

### Video

Use optimized:

-   WebM
-   MP4 fallback

Hero videos should be compressed carefully and should never block first
meaningful content.

------------------------------------------------------------------------

# 18. SEO

### Technical SEO

-   Semantic HTML
-   Clean URLs
-   Metadata
-   Canonical URLs
-   XML sitemap
-   robots.txt
-   Open Graph metadata
-   Twitter/social metadata
-   Breadcrumbs where useful
-   Structured data/schema
-   Image alt text

### Project URL Example

``` text
/projects/project-name
```

### Schema

Use relevant schema types only when the actual content supports them.

Avoid fabricated ratings/reviews.

------------------------------------------------------------------------

# 19. Analytics & Marketing Tracking

Prepare integration for:

-   Google Analytics 4
-   Google Tag Manager
-   Meta Pixel

Track meaningful events such as:

-   Enquiry submitted
-   Brochure requested
-   Site visit requested
-   Callback requested
-   WhatsApp clicked
-   Phone clicked
-   Project viewed
-   Floor plan viewed

Tracking must respect applicable consent/privacy requirements.

------------------------------------------------------------------------

# 20. Performance Requirements

Premium visuals must not become an excuse for a slow website.

### Targets

Aim for strong Core Web Vitals on realistic production devices and
networks.

Priority areas:

-   LCP
-   CLS
-   INP

### Performance Measures

-   Responsive images
-   Lazy loading
-   Video poster frames
-   Video compression
-   Font subsetting
-   Minimal third-party scripts
-   Code splitting
-   Server caching
-   Browser caching
-   Brotli/Gzip
-   Cloudflare CDN
-   Avoid unnecessary JS animation bundles

------------------------------------------------------------------------

# 21. Accessibility

Minimum requirements:

-   Semantic heading hierarchy
-   Keyboard accessible navigation
-   Visible focus states
-   Form labels
-   Meaningful alt text
-   Adequate contrast
-   Reduced-motion support
-   Accessible modals/lightboxes
-   Error messages readable by assistive technology

Premium design must not reduce usability.

------------------------------------------------------------------------

# 22. Security

Even without login/CMS, public forms and server infrastructure require
hardening.

### Application

-   Server-side input validation
-   Output encoding
-   Rate limiting
-   Bot/spam protection
-   CSRF consideration based on implementation
-   Safe file handling
-   No secrets exposed client-side
-   Secure environment variables
-   Security headers

### VPS

-   SSH keys
-   Disable unnecessary password login where practical
-   UFW firewall
-   Only required ports open
-   Nginx hardening
-   HTTPS only
-   Let's Encrypt renewal
-   Regular security updates
-   PM2 process management
-   Backups

### Cloudflare

Recommended for:

-   DNS
-   CDN
-   DDoS mitigation
-   Basic WAF/security
-   Caching

------------------------------------------------------------------------

# 23. Deployment Architecture

``` text
Visitor
   ↓
Cloudflare
   ↓
Nginx
   ↓
Next.js Application
   ↓
PM2 / Node.js
   ↓
JSON Content + Static Media
```

### Deployment Flow

``` text
Git Repository
   ↓
Hostinger VPS
   ↓
Install dependencies
   ↓
Build Next.js
   ↓
PM2 restart/reload
```

Production and development environment variables must remain separate.

------------------------------------------------------------------------

# 24. Content Update Workflow

Since there is no CMS/admin:

1.  Update JSON/content file.
2.  Add/update media assets.
3.  Validate JSON/schema.
4.  Commit to Git.
5.  Deploy to VPS.
6.  Verify affected pages.

The content structure should be simple enough that project information
can be updated without touching page components.

------------------------------------------------------------------------

# 25. Future Migration Strategy

The JSON architecture must be treated as a content source, not embedded
directly throughout components.

Recommended abstraction:

``` text
UI Components
      ↓
Content/Data Service
      ↓
JSON Files
```

Future:

``` text
UI Components
      ↓
Content/Data Service
      ↓
CMS / API / Database
```

This allows future Sanity, Strapi, PostgreSQL or custom CRM integration
without rebuilding the visual frontend.

------------------------------------------------------------------------

# 26. Premium Quality Acceptance Criteria

The website is **not approved** merely because all pages work.

It must also meet the visual quality bar.

### Mandatory Premium Checks

-   No section should visibly resemble a generic real estate template.
-   Homepage hero must feel cinematic.
-   Typography must have a deliberate hierarchy.
-   Whitespace must be generous and consistent.
-   Images must be crisp and correctly cropped.
-   Project pages must feel immersive.
-   Animations must be smooth and purposeful.
-   Mobile experience must feel designed, not adapted.
-   Navigation must feel refined.
-   Forms must match the luxury design language.
-   Footer must be intentionally designed.
-   Loading states must be polished.
-   Hover/focus states must be consistent.
-   No placeholder/fake content in production.
-   No visual layout shifts.
-   No broken media.
-   No oversized unoptimized videos.

**Visual quality is a release requirement, not an optional
enhancement.**

------------------------------------------------------------------------

# 27. Development Phases

## Phase 1 --- Foundation

-   Next.js + TypeScript setup
-   Tailwind configuration
-   Project architecture
-   JSON schemas/data layer
-   Global typography
-   Color tokens
-   Spacing system
-   Responsive grid
-   Base SEO
-   Nginx/PM2 deployment preparation

## Phase 2 --- Premium Design System

Build reusable:

-   Header
-   Navigation
-   Buttons
-   Typography
-   Section wrappers
-   Project presentations
-   Forms
-   Modal/lightbox
-   Gallery
-   Footer
-   Loading states
-   Animation utilities

Do not start mass page production before the visual system is approved.

## Phase 3 --- Homepage

Build and polish:

-   Cinematic hero
-   Brand manifesto
-   Featured projects
-   Property categories
-   Haridwar story
-   Developer philosophy
-   Testimonials
-   Closing CTA

Desktop and mobile must both be reviewed visually.

## Phase 4 --- Projects

Build:

-   Projects listing
-   Filters
-   Dynamic project routes
-   Project hero
-   Project storytelling
-   Highlights
-   Master plan
-   Floor plans
-   Gallery
-   Google Maps
-   Specifications
-   Brochure
-   Lead CTAs

## Phase 5 --- Supporting Pages & Leads

Build:

-   About
-   Testimonials
-   Contact
-   Privacy
-   Terms
-   Enquiry
-   Brochure lead capture
-   Site visit
-   Callback
-   WhatsApp
-   Analytics events

## Phase 6 --- Production Hardening

-   Responsive QA
-   Cross-browser QA
-   Accessibility review
-   SEO review
-   Performance optimization
-   Security headers
-   Form abuse protection
-   VPS hardening
-   Cloudflare setup
-   SSL
-   PM2
-   Nginx
-   Backup strategy
-   Production deployment
-   Final visual QA

------------------------------------------------------------------------

# 28. Out of Scope --- Version 1

Not required in initial release:

-   User login
-   Customer portal
-   Admin login
-   CMS
-   Custom CRM
-   Online property booking
-   Payment gateway
-   AI project recommendation
-   Project comparison
-   Interactive master-plan hotspots
-   Interactive floor-plan unit selector
-   Multi-language website

These can be added later if business requirements change.

------------------------------------------------------------------------

# 29. Final Stack --- Locked

``` text
Frontend:
Next.js + TypeScript

Styling:
Tailwind CSS

Premium Motion:
GSAP + ScrollTrigger

Content:
Structured JSON

Media:
Optimized local/project assets + Cloudflare delivery

Maps:
Google Maps

Analytics:
GA4 + GTM + Meta Pixel

Server:
Hostinger VPS

Runtime:
Node.js + PM2

Reverse Proxy:
Nginx

SSL:
Let's Encrypt

Edge / CDN / Security:
Cloudflare

CMS:
None

Admin Panel:
None

Website Login:
None

Database:
Not required for v1
```

------------------------------------------------------------------------

# 30. Final Product Standard

Garvit Buildtech should not look like a website assembled from common
real-estate components.

The final product should feel like a **digital flagship for a premium
developer**.

The design must prioritize:

**Brand → Architecture → Storytelling → Projects → Trust → Conversion**

rather than:

**Offers → Popups → Forms → Property Cards → Repeated CTAs**

Every design and engineering decision should protect that hierarchy.
