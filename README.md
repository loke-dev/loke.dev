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

- **Cloudflare Web Analytics** is enabled for `loke.dev` with automatic setup in the Cloudflare dashboard.
- **Better Stack:** create a free HTTP monitor for `https://loke.dev/health`, check every five minutes, and alert on any response other than HTTP 200. The endpoint returns `{ "ok": true }` and is never cached.
- **Sentry:** create a JavaScript/Cloudflare project, then set its DSN as a Worker secret:

  ```sh
  pnpm wrangler secret put SENTRY_DSN
  ```

  Server exceptions, request traces (10% sample), and the `seshat-content-scheduler` cron monitor are enabled automatically once the secret is set.
