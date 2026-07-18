# loke.dev Sanity Studio

The Studio manages the editorial catalog for loke.dev.

Posts require a named author, one or two topics, a useful search description,
sources, and review metadata. Add a `redirect` document only when an old URL
has a genuinely relevant replacement; intentionally retired low-value articles
should remain gone.

Run locally with `pnpm --dir studio dev`, deploy schemas with
`pnpm --dir studio exec sanity schema deploy`, and publish the hosted Studio
with `pnpm --dir studio deploy`.

## Draft preview

The Presentation tool opens `https://loke.dev` in the Studio and shows draft
posts at their real URLs. Set `SANITY_API_READ_TOKEN` on the Cloudflare Worker
to a Sanity API token with the Viewer role before using it. The token stays on
the server and is used to validate the Studio's short-lived preview secret and
read draft content. For local Studio work, set `SANITY_STUDIO_PREVIEW_URL` to
your local app URL, normally `http://localhost:3000`.
