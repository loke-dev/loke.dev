import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true, service: 'loke.dev' }), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
