export async function verifyTurnstileToken(token: string): Promise<boolean> {
  // In development, always return true for test tokens
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Skipping CAPTCHA verification')
    return true
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn(
      'TURNSTILE_SECRET_KEY not configured, skipping CAPTCHA verification'
    )
    return true
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
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    )

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('CAPTCHA verification failed:', error)
    return false
  }
}
