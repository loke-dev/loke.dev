# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm run dev              # Start dev server on port 3000
pnpm run build            # Build for production
pnpm start                # Run production server

# Code Quality
pnpm run lint             # Run ESLint
pnpm run typecheck        # Run TypeScript type checking
pnpm run format           # Format code with Prettier
pnpm run format:check     # Check formatting without changes

# Sanity CMS
pnpm run sanity:dev       # Start Sanity Studio on port 3333

# Content Generation
pnpm exec seshat write    # Generate blog post using Seshat Scribe
```

## Package Manager

Always use `pnpm` as the package manager. Never use npm or yarn.

## Architecture Overview

### Tech Stack

- **Framework**: Remix (Vite-based) with React 19
- **CMS**: Sanity.io for content management
- **Styling**: Tailwind CSS v4 (no JS config file)
- **UI Components**: shadcn/ui and Radix UI
- **PWA**: Progressive Web App with @remix-pwa (service worker, offline support)
- **Code Highlighting**: Shiki
- **Email**: Resend API
- **CAPTCHA**: Cloudflare Turnstile
- **Analytics**: Vercel Analytics
- **Automated Content**: Seshat Scribe (GitHub Actions daily at 9 AM)

### Project Structure

```
app/
├── components/        # React components
│   ├── layout/       # Layout components
│   └── ui/           # shadcn/ui components
├── lib/              # Third-party library integrations
│   └── sanity/       # Sanity client, queries, types, helpers
├── routes/           # Remix routes (file-based routing)
├── utils/            # Utilities (email, captcha, meta tags, theme, etc.)
├── styles/           # Global styles
├── entry.client.tsx  # Client entry point
├── entry.server.tsx  # Server entry point
└── entry.worker.ts   # Service worker (PWA)

sanity/
├── schemas/          # Sanity schema definitions
├── actions/          # Custom Sanity actions (e.g., unpublish)
├── components/       # Sanity Studio components
└── deskStructure.ts  # Sanity Studio desk configuration
```

### Path Aliases

Use `@/` for all internal imports:

```typescript
import { Button } from '@/components/ui/button'
import { sanityClient } from '@/lib/sanity/client'
```

`sanity.config` alias points to `./sanity.config.ts`

### Sanity CMS Integration

**Content Types**:

- Singleton pages: `homePage`, `aboutPage`, `blogPage`, `contactPage`, `projectsPage`
- Collections: `post` (blog posts), `project` (portfolio projects)
- Block types: `code`, `callout` (for rich text)

**Key Files**:

- `app/lib/sanity/client.ts` - Sanity client configuration
- `app/lib/sanity/queries.ts` - GROQ queries for fetching content
- `app/lib/sanity/types.ts` - TypeScript types for Sanity documents
- `app/utils/sanity.queries.ts` - Additional queries used in routes
- `sanity.config.ts` - Sanity Studio configuration (available at `/studio`)

**Sanity Studio**: Accessible at `/studio` route. Uses custom desk structure with singleton document handling and unpublish actions for posts/projects.

### Progressive Web App (PWA)

- Service worker: `app/entry.worker.ts`
- Three caching strategies:
  - **Document cache**: StaleWhileRevalidate for HTML pages (7 days)
  - **Asset cache**: CacheFirst for static assets (90 days)
  - **Data cache**: StaleWhileRevalidate for API data (7 days)
- Offline fallback page: `app/routes/_offline.tsx`
- PWA plugin only runs in production builds

### Automated Blog Generation (Seshat Scribe)

The project uses [Seshat Scribe](https://github.com/seshat-scribe) for automated blog post generation:

- Configuration: `seshat.config.json`
- GitHub Action: `.github/workflows/seshat.yml` (runs daily at 9 AM)
- Topics: AI, SEO, React, Node.js, TypeScript, web development
- Tone: Casual, friendly, engaging, slightly humorous but professional
- Output: Directly creates posts in Sanity CMS

### Remix Configuration

Key Remix features enabled in `vite.config.ts`:

- `v3_singleFetch`: Single fetch optimization
- `v3_fetcherPersist`: Persistent fetchers
- `v3_lazyRouteDiscovery`: Lazy route discovery
- Client hints for theme/color scheme detection

### Environment Variables

Required environment variables (see `env.example`):

- `SESSION_SECRET` - Session secret for cookies
- `RESEND_API_KEY` - For email sending via Resend
- `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile CAPTCHA
- `GEMINI_API_KEY` - For Seshat content generation
- `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET` - Sanity CMS (browser-accessible)
- `SANITY_WRITE_TOKEN` - Sanity write access for Seshat

## Code Conventions

### General Rules

1. **No comments in code** - Code should be self-documenting
2. **Avoid `useEffect` whenever possible** - Prefer loaders, actions, and React 19 features
3. **Use path aliases** - Always use `@/` prefix for internal imports
4. **No markdown documentation files** - Documentation goes in code or CLAUDE.md

### Styling

- Tailwind CSS v4 only (no JS config file exists)
- Use shadcn/ui components when available
- Use Radix UI for component primitives
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
- Applies to JS/TS/TSX files and JSON/MD/MDX files

## Development Workflow

1. Check if dev server is already running on port 3000 before starting a new one
2. The Sanity Studio runs separately on port 3333
3. For local development, test Turnstile keys work automatically
4. PWA features (service worker) only work in production builds

## Key Patterns

### Meta Tags

Use `createMetaTags` utility from `@/utils/meta` for consistent meta tag generation. Pass the request URL from loaders for proper canonical URLs.

### Image Optimization

- `OptimizedImage` component for responsive images
- Sanity images use `@sanity/image-url` for transformations
- Route at `/resources/image` handles on-demand image optimization

### Code Highlighting

Shiki is configured in `app/lib/shiki.server.ts` for syntax highlighting in blog posts.

### Portable Text

Custom `PortableText` component (`@/components/PortableText`) renders Sanity's rich text with custom serializers for code blocks and callouts.

## Node Version

Requires Node.js >= 20.0.0
