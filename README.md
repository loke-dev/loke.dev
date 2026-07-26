# loke.dev

## Development

Run the dev server:

```shellscript
pnpm run dev
```

## Deployment

First, build your app for production:

```sh
pnpm run build
```

Then run the app in production mode:

```sh
pnpm start
```

## Hosting

This website is configured to use Cloudflare workers. You are free to adapt it to any hosting solution.

## Monitoring

`/health` is monitored by Better Stack, while Sentry collects application errors, logs,
performance traces, cron check-ins, and custom scheduler metrics. Cloudflare Web
Analytics is enabled in the Cloudflare dashboard.

For future read-only monitoring automation, create local API credentials in
`.env.monitoring` (start from `.env.monitoring.example`) and run:

```bash
pnpm monitoring:status
```

The command reports only aggregate Sentry issue counts and Better Stack monitor and
incident status; it does not print credentials or event payloads.

- **Cloudflare Web Analytics** is enabled for `loke.dev` with automatic setup in the Cloudflare dashboard.
- **Better Stack** checks `https://loke.dev/health` every three minutes and alerts on any response other than HTTP 200. The endpoint returns `{ "ok": true }` and is never cached.
- **Sentry** receives a JavaScript/Cloudflare project DSN as a Worker secret:

  ```sh
  pnpm wrangler secret put SENTRY_DSN
  ```

  Server exceptions, logs, and request traces (10% sample) are enabled automatically once the secret is set.

## Contact form

The public Turnstile site key lives in `src/config/turnstile.ts` so prerendered
contact pages receive the production key during the build. Local development
uses Cloudflare's test key explicitly; production never falls back to it. Keep
the matching production secret server-side in Cloudflare:

```sh
pnpm wrangler secret put TURNSTILE_SECRET_KEY
```
