import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000),
})

type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string }
  | { status: 'invalid'; errors: Record<string, string> }

type TurnstileWindow = Window & {
  turnstile?: {
    render: (el: HTMLElement, opts: Record<string, unknown>) => string
    reset: (widgetId: string) => void
  }
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>({ status: 'idle' })
  const [captchaToken, setCaptchaToken] = useState('')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const siteKey =
      (document.getElementById('env-data') as HTMLElement | null)?.dataset
        .turnstileKey ?? '1x00000000000000000000AA'

    const mountWidget = () => {
      const win = window as TurnstileWindow
      if (win.turnstile && turnstileRef.current) {
        widgetIdRef.current = win.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: (token: string) => setCaptchaToken(token),
          'expired-callback': () => setCaptchaToken(''),
          'error-callback': () => setCaptchaToken(''),
          theme: 'dark',
        })
      }
    }

    const win = window as TurnstileWindow
    if (win.turnstile) {
      mountWidget()
    } else {
      window.addEventListener('load', mountWidget, { once: true })
    }

    return () => {
      window.removeEventListener('load', mountWidget)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!captchaToken) {
      setState({
        status: 'invalid',
        errors: { captchaToken: 'Please complete the CAPTCHA' },
      })
      return
    }

    const formData = new FormData(e.currentTarget)
    const raw = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    }

    const parsed = ContactSchema.safeParse(raw)
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      for (const [field, issues] of Object.entries(
        parsed.error.flatten().fieldErrors
      )) {
        errors[field] = (issues as string[])[0]
      }
      setState({ status: 'invalid', errors })
      return
    }

    setState({ status: 'submitting' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          captchaToken,
          honeypot: formData.get('honeypot'),
        }),
      })

      if (res.ok) {
        setState({ status: 'success' })
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setState({
          status: 'error',
          message: body.error ?? 'Failed to send. Please try again.',
        })
        if (widgetIdRef.current) {
          ;(window as TurnstileWindow).turnstile?.reset(widgetIdRef.current)
        }
        setCaptchaToken('')
      }
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' })
      if (widgetIdRef.current) {
        ;(window as TurnstileWindow).turnstile?.reset(widgetIdRef.current)
      }
      setCaptchaToken('')
    }
  }

  const errors = state.status === 'invalid' ? state.errors : {}
  const isSubmitting = state.status === 'submitting'

  if (state.status === 'success') {
    return (
      <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
        <p className="font-medium">Message sent!</p>
        <p className="text-sm mt-1">
          I&apos;ll get back to you as soon as possible.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {state.status === 'error' && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="Your name"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-500" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="How can I help you?"
          rows={6}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-red-500" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <div style={{ display: 'none' }} aria-hidden="true">
        <input name="honeypot" tabIndex={-1} autoComplete="off" />
      </div>

      <div ref={turnstileRef} />
      {errors.captchaToken && (
        <p className="text-sm text-red-500" role="alert">
          {errors.captchaToken}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !captchaToken}
        className="px-6 py-2 rounded-md bg-accent text-accent-foreground font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
