# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm run dev              # Start dev server on port 3000
pnpm run build            # Build for production
pnpm start                # Preview production build locally

# Code Quality
pnpm run lint             # Run ESLint
pnpm run typecheck        # Run TypeScript type checking (astro check + tsc)
pnpm run format           # Format code with Prettier
pnpm run format:check     # Check formatting without changes

```

## Package Manager

Always use `pnpm` as the package manager. Never use npm or yarn.

## Architecture Overview

### Tech Stack

- **Framework**: Astro 6 with `@astrojs/cloudflare` SSR adapter on Cloudflare Workers
- **CMS**: Sanity.io for content management (headless only)
- **Styling**: Tailwind CSS v4 (no JS config file)
- **Client JS**: `Header.astro` ships a small vanilla TS script for the mobile `<dialog>` menu; `ContactForm` is a **SolidJS** island (`client:load`); related posts are server-rendered — everything else is static Astro
- **Code Highlighting**: Shiki (server-side, zero client JS)
- **Email**: Resend API
- **CAPTCHA**: Cloudflare Turnstile (vanilla CDN widget)
- **Analytics**: Cloudflare dashboard observability via Workers
- **Editorial workflow**: Sanity documents record authors, topics, sources, version scope, and review status. Use the loke-content-strategy Codex skill to research and prepare posts; publishing remains an editorial decision.

### Project Structure

```
src/
├── components/
│   ├── BlogPostCard.astro
│   ├── ContactForm.tsx      # Solid island (client:load)
│   ├── Footer.astro
│   ├── Header.astro         # Mobile nav: vanilla TS + native dialog
│   ├── Pagination.astro
│   ├── PortableText.astro   # Server-side rich text via @portabletext/to-html
│   ├── ProjectCard.astro
│   ├── RelatedPosts.astro   # Server-rendered related posts
│   └── Seo.astro
├── layouts/
│   └── BaseLayout.astro     # HTML shell with schema.org, Turnstile CDN
├── lib/
│   ├── content-generation/  # Gemini AI content generation
│   └── sanity/              # Sanity client, queries, types, helpers
├── middleware.ts             # Security headers on all responses
├── scripts/
│   └── mobile-menu.ts       # Vanilla TS for mobile nav dialog
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── blog/
│   │   ├── index.astro      # Paginated blog list
│   │   └── [slug].astro     # Blog post with Shiki + RelatedPosts.astro
│   ├── contact.astro
│   ├── projects.astro
│   ├── topics/[slug].astro
│   ├── authors/[slug].astro
│   ├── rss.xml.ts
│   ├── sitemap.xml.ts
│   └── api/
│       └── contact.ts
├── styles/
│   └── global.css           # Tailwind v4 + CSS custom properties
└── utils/
    ├── captcha.server.ts
    ├── cn.ts
    ├── email.server.ts
    ├── headers.server.ts
    ├── meta.ts
    ├── rate-limit.server.ts
    ├── sanity.queries.ts
    └── session.server.ts

sanity/                      # Sanity Studio — to be moved to studio.loke.dev
```

### Path Aliases

Use `@/` for all internal imports (maps to `src/`):

```typescript
import BlogPostCard from '@/components/BlogPostCard.astro'
import { client } from '@/lib/sanity/client'
```

### JavaScript Strategy

Astro ships zero JS by default. Client-side JS is opt-in via `client:*` directives.

**Client bundles:**

- `Header.astro` — bundled `<script>` imports `@/scripts/mobile-menu` (runs when `matchMedia('(max-width: 767px)')` matches)
- `ContactForm.tsx` — Solid island, `client:load`

Everything else renders as static HTML unless it imports a client script.

### Sanity CMS Integration

**Content Types**:

- Singleton pages: `homePage`, `aboutPage`, `blogPage`, `contactPage`, `projectsPage`
- Collections: `post` (blog posts), `project` (portfolio projects)
- Block types: `code`, `callout` (for rich text)

**Key Files**:

- `src/lib/sanity/client.ts` — Sanity client configuration
- `src/lib/sanity/queries.ts` — GROQ queries
- `src/lib/sanity/types.ts` — TypeScript types for Sanity documents
- `src/utils/sanity.queries.ts` — Page-level query wrappers

**Sanity Studio**: Lives in `sanity/` — being migrated to `studio.loke.dev` (separate deployment).

### Portable Text

`src/components/PortableText.astro` renders Sanity rich text server-side via `@portabletext/to-html`. Custom serializers for: code blocks (Shiki), images (Sanity CDN srcset), callouts, links.

### Editorial content

- Posts require an author, one or two topics, sources, and editorial review metadata.
- Retired URLs return `410 Gone` unless an explicit `redirect` document defines a replacement.
- Topic and author pages are generated from the same Sanity references used by each post.

### Environment Variables

Required (see `env.example`):

- `RESEND_API_KEY` — email sending via Resend
- `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile CAPTCHA
- `GEMINI_API_KEY` — Seshat content generation
- `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET` — Sanity CMS (public, client-accessible)
- `SANITY_WRITE_TOKEN` — Sanity write access for Seshat
- `CLOUDFLARE_ZONE_ID` / `CLOUDFLARE_API_TOKEN` — cache purge for Sanity revalidation

### Caching Strategy

Cache headers set per page in frontmatter via `Astro.response.headers.set('Cache-Control', ...)`:

- Home: `s-maxage=120, stale-while-revalidate=600`
- Blog list: `s-maxage=60, stale-while-revalidate=300`
- Blog post: `s-maxage=3600, stale-while-revalidate=86400`
- Projects / About: `s-maxage=600, stale-while-revalidate=3600`

Sanity publish webhooks call `/api/revalidate`, which purges the affected Cloudflare cache URLs via the Cloudflare API.

## Code Conventions

### General Rules

1. **No comments in code** — code should be self-documenting
2. **Minimize ad-hoc effects** — prefer server data and small vanilla scripts; in Solid islands use `onMount` only when the browser API genuinely requires it
3. **Use path aliases** — always use `@/` prefix for internal imports
4. **No markdown documentation files** — documentation goes in code or CLAUDE.md

### Styling

- Tailwind CSS v4 only (no JS config file)
- No shadcn/ui, no Radix UI — replaced with native HTML elements and inline SVGs
- Utility-first approach with Tailwind classes

### Content Writing

When writing blog posts or content:

- Casual and friendly tone
- Fun and lighthearted but professional
- Don't sound like a robot

### Git Workflow

Pre-commit hooks (via Husky and lint-staged):

- Auto-format code with Prettier
- Run ESLint with auto-fix
- Applies to JS/TS/TSX/Astro files and JSON/MD/MDX files

## Node Version

Requires Node.js >= 20.0.0
