import type { APIRoute } from 'astro'
import { runSeshatScheduler } from '@/lib/content-generation/scheduler'

function authorizeCron(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

async function runWorker(request: Request) {
  if (!authorizeCron(request)) {
    return new Response(null, { status: 401 })
  }

  if (!process.env.GEMINI_API_KEY || !process.env.SANITY_WRITE_TOKEN) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  return Response.json(await runSeshatScheduler())
}

export const GET: APIRoute = ({ request }) => runWorker(request)

export const POST: APIRoute = ({ request }) => runWorker(request)
