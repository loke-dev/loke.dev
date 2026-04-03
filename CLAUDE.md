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

# Content Generation
pnpm exec seshat write    # Generate blog post using Seshat Scribe
```

## Package Manager

Always use `pnpm` as the package manager. Never use npm or yarn.

## Architecture Overview

### Tech Stack

- **Framework**: Astro 6 with `@astrojs/vercel` SSR adapter
- **CMS**: Sanity.io for content management (headless only)
- **Styling**: Tailwind CSS v4 (no JS config file)
- **React islands**: MobileMenu, ContactForm, RelatedPosts — everything else is static Astro
- **Code Highlighting**: Shiki (server-side, zero client JS)
- **Email**: Resend API
- **CAPTCHA**: Cloudflare Turnstile (vanilla CDN widget)
- **Analytics**: Vercel Analytics (via `@astrojs/vercel` adapter option)
- **Automated Content**: Seshat Scribe (Gemini AI + Sanity write)

### Project Structure

```
src/
├── components/
│   ├── BlogPostCard.astro
│   ├── ContactForm.tsx      # React island (client:load)
│   ├── Footer.astro
│   ├── Header.astro
│   ├── MobileMenu.tsx       # React island (client:media)
│   ├── Pagination.astro
│   ├── PortableText.astro   # Server-side rich text via @portabletext/to-html
│   ├── ProjectCard.astro
│   ├── RelatedPosts.tsx     # React island (client:visible)
│   └── Seo.astro
├── layouts/
│   └── BaseLayout.astro     # HTML shell with schema.org, Turnstile CDN
├── lib/
│   ├── content-generation/  # Gemini AI content generation
│   └── sanity/              # Sanity client, queries, types, helpers
├── middleware.ts             # Security headers on all responses
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── blog/
│   │   ├── index.astro      # Paginated blog list
│   │   └── [slug].astro     # Blog post with Shiki + RelatedPosts
│   ├── contact.astro
│   ├── projects.astro
│   ├── rss.xml.ts
│   ├── sitemap.xml.ts
│   └── api/
│       ├── contact.ts
│       ├── related-posts.ts
│       └── seshat/
│           ├── write.ts
│           ├── trigger.ts
│           ├── schedule-sync.ts
│           └── worker.ts
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

**React islands (only 3):**

- `MobileMenu.tsx` — `client:media="(max-width: 767px)"`
- `ContactForm.tsx` — `client:load`
- `RelatedPosts.tsx` — `client:visible`

Everything else renders as static HTML.

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

### Automated Blog Generation (Seshat Scribe)

- Content generation code: `src/lib/content-generation/`
- API endpoints: `src/pages/api/seshat/`
- Output: Directly creates posts in Sanity CMS via write token

### Environment Variables

Required (see `env.example`):

- `RESEND_API_KEY` — email sending via Resend
- `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile CAPTCHA
- `GEMINI_API_KEY` — Seshat content generation
- `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET` — Sanity CMS (public, client-accessible)
- `SANITY_WRITE_TOKEN` — Sanity write access for Seshat

### Caching Strategy

Cache headers set per page in frontmatter via `Astro.response.headers.set('Cache-Control', ...)`:

- Home: `s-maxage=120, stale-while-revalidate=600`
- Blog list: `s-maxage=60, stale-while-revalidate=300`
- Blog post: `s-maxage=3600, stale-while-revalidate=86400`
- Projects / About: `s-maxage=600, stale-while-revalidate=3600`

## Code Conventions

### General Rules

1. **No comments in code** — code should be self-documenting
2. **Minimize `useEffect`** — only use in React islands where client-side side effects are genuinely needed
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
