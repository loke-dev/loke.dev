import { env as workerEnv } from 'cloudflare:workers'

interface TurnstileVerifyResponse {
  success?: boolean
}

interface TurnstileRuntimeEnv {
  TURNSTILE_SECRET_KEY?: string
}

function getTurnstileSecret(): string | undefined {
  const workerSecret = (
    workerEnv as unknown as TurnstileRuntimeEnv
  ).TURNSTILE_SECRET_KEY?.trim()
  if (workerSecret) return workerSecret

  const processSecret = process.env.TURNSTILE_SECRET_KEY
  return processSecret?.trim() || undefined
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  // In development, always return true for test tokens
  if (import.meta.env.DEV) {
    console.log('Development mode: Skipping CAPTCHA verification')
    return true
  }

  const secret = getTurnstileSecret()
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return false
  }

  if (!token) {
    return false
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
      }
    )

    const result = (await response.json()) as TurnstileVerifyResponse
    return result.success === true
  } catch (error) {
    console.error('CAPTCHA verification failed:', error)
    return false
  }
}
