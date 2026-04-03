import type { APIRoute } from 'astro'
import { z } from 'zod'
import { verifyTurnstileToken } from '@/utils/captcha.server'
import { sendContactEmail } from '@/utils/email.server'

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  honeypot: z.string().optional(),
  captchaToken: z.string().min(1),
})

interface RateLimitEntry {
  count: number
  resetTime: number
}

// TODO: replace with persistent store (Redis/KV) once available
const rateLimitMap = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const MAX_ATTEMPTS = 3

function checkRateLimit(ip: string): {
  allowed: boolean
  remaining: number
  resetTime: number
  error?: string
} {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      error: `Too many attempts. Please try again in ${Math.ceil((entry.resetTime - now) / 60000)} minutes.`,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count,
    resetTime: entry.resetTime,
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, email, message, honeypot, captchaToken } = parsed.data

  if (honeypot) {
    return Response.json({ ok: true })
  }

  const ip = clientAddress ?? 'unknown'
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    return Response.json(
      { ok: false, error: rateLimit.error },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': MAX_ATTEMPTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
        },
      }
    )
  }

  const captchaValid = await verifyTurnstileToken(captchaToken)
  if (!captchaValid) {
    return Response.json(
      { ok: false, error: 'CAPTCHA verification failed. Please try again.' },
      { status: 400 }
    )
  }

  try {
    await sendContactEmail({ name, email, message, honeypot })
    return Response.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to send message. Please try again.',
      },
      { status: 500 }
    )
  }
}
