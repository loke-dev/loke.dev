# loke.dev repository instructions

This repository contains the Astro website and Cloudflare Worker at the root,
plus a Sanity Studio in `studio/`.

- Use Node.js 22.12+ and the pnpm version declared in `package.json`; do not
  introduce another package manager.
- Keep the site compatible with Astro's Cloudflare adapter and Workers runtime.
- Prefer server-rendered Astro and small vanilla scripts. Add a client island
  only when the interaction genuinely requires browser state.
- Use the `@/` alias for imports within `src/`.
- Preserve the security headers, Turnstile validation, rate limiting, and
  server-only handling of credentials on public form or API changes.
- Keep Sanity schema and Studio work inside `studio/`; do not mix Studio
  dependencies into the root package.
- Run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, and `pnpm build` for
  relevant website changes. Run `pnpm --dir studio build` for Studio changes.
- Treat publishing content and manual deployments as explicit actions. Never
  commit `.env*` credentials, API tokens, write tokens, or production data.
