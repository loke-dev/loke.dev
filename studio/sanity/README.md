# loke.dev Sanity Studio

The Studio manages the editorial catalog for loke.dev.

Posts require a named author, one or two topics, a useful search description,
sources, and review metadata. Add a `redirect` document only when an old URL
has a genuinely relevant replacement; intentionally retired low-value articles
should remain gone.

Run locally with `pnpm --dir studio dev`, deploy schemas with
`pnpm --dir studio exec sanity schema deploy`, and publish the hosted Studio
with `pnpm --dir studio deploy`.
