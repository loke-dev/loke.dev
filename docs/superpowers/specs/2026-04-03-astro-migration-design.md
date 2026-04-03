# Astro Migration Design: loke.dev

**Date**: 2026-04-03
**Status**: Approved

---

## Context

loke.dev is a Remix + React 19 personal portfolio/blog. The goal of this migration is to move to Astro to produce a simpler, more performant, and SEO-optimized site by:

- Eliminating unnecessary client-side JavaScript (Astro ships zero JS by default)
- Removing ~15 heavy/redundant packages
- Moving the Sanity Studio to a separate subdomain
- Replacing React-heavy UI components with native HTML, inline SVGs, and Astro components
- Preserving all existing functionality: contact form, Seshat blog generation, RSS/sitemap, SEO meta, schema.org markup

---

## Architecture

### Runtime

- **Framework**: Astro with `@astrojs/vercel` adapter (SSR mode)
- **Deployment**: Vercel (same as today)
- **Content**: Sanity headless CMS — unchanged; `@sanity/client` + `@sanity/image-url` kept
- **Sanity Studio**: Moved to `studio.loke.dev` as a standalone Sanity Studio deploy — completely separate from the main site

### JavaScript Strategy

Astro ships zero JS by default. Client-side JS is opt-in via `client:*` directives.

**React islands** (only 3):

1. `MobileMenu.tsx` — hamburger nav drawer using native `<dialog>` (`client:load`)
2. `ContactForm.tsx` — form with Turnstile + Zod validation + inline success/error state (`client:load`)
3. `RelatedPosts.tsx` — lazy-loaded sidebar on blog post page (`client:visible`)

Everything else (page layouts, blog cards, project cards, header nav links, footer, portable text, pagination) renders as static HTML — no hydration.

### Images

- Local images (`/loke_clay.png`, etc.): Astro's built-in `<Image>` component from `astro:assets`
- Sanity CMS images: Sanity CDN transform API (`?auto=format&w=800&q=80`) — no Sharp endpoint needed
- The `/resources/image` Sharp route is **removed**

### Portable Text

- Replace `@portabletext/react` with `@portabletext/to-html` (server-side only, no React)
- Shiki code highlighting still runs server-side; output HTML injected into portable text render
- Custom block handlers for: code blocks, callouts, responsive images

### Middleware

`src/middleware.ts` — sets security headers on all responses (porting `getSecurityHeaders()` from `app/utils/headers.server.ts`)

### Sitemap

`@astrojs/sitemap` auto-generates `/sitemap-index.xml` — the manual sitemap route is dropped.

---

## Package Changes

### Removed (~15 packages)

| Package                                                   | Reason                                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `@remix-run/node`, `@remix-run/react`, `@remix-run/serve` | Replaced by Astro                                                                                   |
| `sanity`, `@sanity/vision`, `styled-components`           | Studio moves to subdomain                                                                           |
| `sharp`                                                   | Dropping image optimization endpoint                                                                |
| `@conform-to/zod`                                         | Replaced by plain Zod validation                                                                    |
| `sonner`                                                  | Replaced by inline form feedback state                                                              |
| `cookie`                                                  | Astro handles cookies natively                                                                      |
| `isbot`                                                   | Not needed with Astro/Vercel                                                                        |
| `lucide-react`                                            | Replaced by inline SVGs in each component (5 icons: ArrowRight, Menu, X, ChevronLeft, ChevronRight) |
| `@portabletext/react`                                     | Replaced by `@portabletext/to-html`                                                                 |
| `@marsidev/react-turnstile`                               | Replaced by vanilla Turnstile CDN widget                                                            |
| `@radix-ui/react-dialog`                                  | Replaced by native `<dialog>` element                                                               |
| `@radix-ui/react-label`                                   | Replaced by plain `<label>` HTML                                                                    |
| `@radix-ui/react-slot`                                    | Removed — Button simplified                                                                         |
| `class-variance-authority`                                | Replaced by simple variant string lookup                                                            |

### Added (5 packages)

| Package                 | Purpose                             |
| ----------------------- | ----------------------------------- |
| `astro`                 | Core framework                      |
| `@astrojs/react`        | React islands support               |
| `@astrojs/vercel`       | Vercel SSR adapter                  |
| `@astrojs/sitemap`      | Auto-generated sitemap              |
| `@portabletext/to-html` | Server-side portable text rendering |

### Kept (lean core)

`@sanity/client`, `@sanity/image-url`, `tailwindcss` v4, `@tailwindcss/typography`, `@tailwindcss/vite`, `react`, `react-dom`, `clsx`, `tailwind-merge`, `zod`, `resend`, `@vercel/analytics`, `shiki`, `@google/genai`

### DevDeps: Removed

`@remix-run/dev`, `vite-tsconfig-paths` (Astro handles path aliases natively), `eslint-plugin-react-refresh`

---

## File Structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # HTML shell, head, meta, schema.org, security headers
├── pages/
│   ├── index.astro               # Home (SSR: fetch Sanity home data + recent posts)
│   ├── about.astro               # About
│   ├── blog/
│   │   ├── index.astro           # Blog list + pagination
│   │   └── [slug].astro          # Blog post with Shiki highlighting
│   ├── projects.astro            # Projects
│   ├── contact.astro             # Contact page (form island)
│   ├── rss.xml.ts                # RSS feed
│   └── api/
│       ├── contact.ts            # POST — contact form handler
│       └── seshat/
│           ├── write.ts
│           ├── trigger.ts
│           ├── schedule-sync.ts
│           └── worker.ts
├── components/
│   ├── BaseHead.astro            # <head> contents: meta, fonts, preconnects
│   ├── Header.astro              # Nav with static links + MobileMenu island
│   ├── Footer.astro
│   ├── Seo.astro                 # Meta tags (replaces createMetaTags util)
│   ├── BlogPostCard.astro
│   ├── ProjectCard.astro
│   ├── PortableText.astro        # Server-rendered via @portabletext/to-html
│   ├── Pagination.astro
│   ├── MobileMenu.tsx            # React island — native <dialog> menu
│   ├── ContactForm.tsx           # React island — Zod + vanilla Turnstile + inline state
│   └── RelatedPosts.tsx          # React island — lazy sidebar
├── lib/
│   └── sanity/                   # Ported from app/lib/sanity/ (unchanged logic)
│       ├── client.ts
│       ├── queries.ts
│       ├── types.ts
│       └── helpers.ts
├── utils/
│   ├── meta.ts                   # Ported from app/utils/meta.ts
│   └── cn.ts                     # clsx + tailwind-merge helper
├── middleware.ts                  # Security headers on all responses
└── styles/
    └── global.css                # Tailwind v4 + CSS custom properties

astro.config.ts
tsconfig.json
```

---

## Component Design

### MobileMenu.tsx (React island)

- Uses native `<dialog>` element (`.showModal()` / `.close()`)
- CSS transitions for slide-in animation (`@starting-style` + `transition`)
- Handles `Escape` key and backdrop click to close
- No Radix dependency

### ContactForm.tsx (React island)

- Client-side Zod validation (same schema as current)
- Turnstile: `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer>` loaded in BaseLayout; widget rendered via `<div class="cf-turnstile">` with `data-sitekey`; token captured via `data-callback`
- On submit: POST to `/api/contact`, show inline success/error message — no toast library
- Honeypot field for spam

### Seo.astro

Replaces the `createMetaTags` util from `app/utils/meta.ts`. Accepts same props, outputs `<meta>` tags directly in `<head>`. Supports: title, description, OG tags, Twitter Card, canonical URL, article metadata, keywords.

### PortableText.astro

- Uses `toHTML()` from `@portabletext/to-html` with custom serializers
- Code blocks: Shiki highlights on server, injects pre-rendered HTML
- Images: renders `<picture>` element with Sanity CDN srcset
- Callouts: renders custom callout HTML block

### Button component

- Simplified from current shadcn/ui Button
- Variant lookup: `const variants = { default: '...', primary: '...', outline: '...' }` — no CVA
- No `asChild` / Slot — direct `<button>` or `<a>` element

---

## Data Layer

Sanity queries are ported from `app/lib/sanity/queries.ts` and `app/utils/sanity.queries.ts` with no logic changes. In Astro, data fetching moves to page frontmatter:

```astro
---
import { sanityClient } from '@/lib/sanity/client'
import { getHomePage, getRecentPosts } from '@/lib/sanity/queries'

const [homePage, posts] = await Promise.all([
  getHomePage(),
  getRecentPosts(3)
])
---
```

Caching: Set `Cache-Control` response headers in page frontmatter (same durations as current):

- Home: `s-maxage=120, stale-while-revalidate=600`
- Blog list: `s-maxage=60, stale-while-revalidate=300`
- Blog post: `s-maxage=3600, stale-while-revalidate=86400`
- Projects: `s-maxage=600, stale-while-revalidate=3600`

---

## API Routes

All Remix `api.*` routes port 1:1 to Astro API endpoints:

| Current                                  | New                                     |
| ---------------------------------------- | --------------------------------------- |
| `app/routes/api.seshat.write.ts`         | `src/pages/api/seshat/write.ts`         |
| `app/routes/api.seshat.trigger.ts`       | `src/pages/api/seshat/trigger.ts`       |
| `app/routes/api.seshat.schedule-sync.ts` | `src/pages/api/seshat/schedule-sync.ts` |
| `app/routes/api.seshat.worker.ts`        | `src/pages/api/seshat/worker.ts`        |
| `app/routes/contact.tsx` (action)        | `src/pages/api/contact.ts`              |

Astro API routes export `GET`, `POST`, etc. functions that receive `APIContext` and return `Response`.

---

## SEO

- Schema.org Person + WebSite markup in `BaseLayout.astro` (same as current `root.tsx`)
- `@astrojs/sitemap` auto-generates sitemap from all static and SSR routes
- RSS feed: `src/pages/rss.xml.ts` (ported logic, same output)
- Canonical URLs via `Astro.url` passed to `Seo.astro`
- All meta tags, OG images, Twitter Cards preserved

---

## Sanity Studio Migration

The Studio (`sanity/` directory + `sanity.config.ts`) is deployed as a standalone Sanity Studio project to `studio.loke.dev`.

Steps:

1. Create a new repo or sub-package for the Studio
2. Copy `sanity/` and `sanity.config.ts`
3. Deploy to Vercel with a separate project pointing at `studio.loke.dev`

The main `loke.dev` site no longer imports anything from `sanity/` or the `sanity` package.

---

## Verification Plan

1. `pnpm run dev` — all pages load, no console errors
2. Home page: Sanity data loads, recent posts displayed
3. Blog list: pagination works
4. Blog post: Shiki-highlighted code blocks render, related posts lazy-load
5. Projects: featured + other sections display correctly
6. Contact: form validates client-side, Turnstile renders, POST to `/api/contact` sends email
7. RSS at `/rss.xml` — valid XML with all posts
8. Sitemap at `/sitemap-index.xml` — lists all pages
9. View source: verify minimal JS in `<head>` / `<body>` for non-interactive pages
10. Lighthouse: run on home, blog post, projects — target 100 performance score
11. Verify security headers via `curl -I https://loke.dev`
12. `pnpm run typecheck` — no TypeScript errors
13. `pnpm run build` — clean production build with no warnings
