/** @jsxImportSource solid-js */
import { createSignal, onMount, Show } from 'solid-js'
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
  const [state, setState] = createSignal<FormState>({ status: 'idle' })
  const [captchaToken, setCaptchaToken] = createSignal('')
  let widgetId: string | undefined

  onMount(() => {
    const siteKey =
      (document.getElementById('env-data') as HTMLElement | null)?.dataset
        .turnstileKey ?? '1x00000000000000000000AA'

    const el = document.getElementById('turnstile-widget')

    const mountWidget = () => {
      const win = window as TurnstileWindow
      if (win.turnstile && el) {
        widgetId = win.turnstile.render(el, {
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
  })

  function resetTurnstile() {
    if (widgetId) {
      ;(window as TurnstileWindow).turnstile?.reset(widgetId)
    }
    setCaptchaToken('')
  }

  async function handleSubmit(
    e: SubmitEvent & { currentTarget: HTMLFormElement }
  ) {
    e.preventDefault()
    const form = e.currentTarget

    if (!captchaToken()) {
      setState({
        status: 'invalid',
        errors: { captchaToken: 'Please complete the CAPTCHA' },
      })
      return
    }

    const formData = new FormData(form)
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
          captchaToken: captchaToken(),
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
        resetTurnstile()
      }
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' })
      resetTurnstile()
    }
  }

  const errors = () => {
    const s = state()
    return s.status === 'invalid' ? s.errors : {}
  }

  const isSubmitting = () => state().status === 'submitting'

  return (
    <Show
      when={state().status === 'success'}
      fallback={
        <form onSubmit={handleSubmit} class="space-y-6" noValidate>
          {(() => {
            const s = state()
            return s.status === 'error' ? (
              <div
                role="alert"
                class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {s.message}
              </div>
            ) : null
          })()}

          <div class="space-y-2">
            <label class="flex flex-col gap-2">
              <span class="text-sm font-medium">Name</span>
              <input
                id="name"
                name="name"
                placeholder="Your name"
                required
                aria-invalid={errors().name ? true : undefined}
                aria-describedby={errors().name ? 'name-error' : undefined}
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <Show when={errors().name}>
              {(msg) => (
                <p id="name-error" class="text-sm text-red-500" role="alert">
                  {msg()}
                </p>
              )}
            </Show>
          </div>

          <div class="space-y-2">
            <label class="flex flex-col gap-2">
              <span class="text-sm font-medium">Email</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                required
                aria-invalid={errors().email ? true : undefined}
                aria-describedby={errors().email ? 'email-error' : undefined}
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </label>
            <Show when={errors().email}>
              {(msg) => (
                <p id="email-error" class="text-sm text-red-500" role="alert">
                  {msg()}
                </p>
              )}
            </Show>
          </div>

          <div class="space-y-2">
            <label class="flex flex-col gap-2">
              <span class="text-sm font-medium">Message</span>
              <textarea
                id="message"
                name="message"
                placeholder="How can I help you?"
                rows={6}
                required
                aria-invalid={errors().message ? true : undefined}
                aria-describedby={
                  errors().message ? 'message-error' : undefined
                }
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
              />
            </label>
            <Show when={errors().message}>
              {(msg) => (
                <p id="message-error" class="text-sm text-red-500" role="alert">
                  {msg()}
                </p>
              )}
            </Show>
          </div>

          <div class="hidden" aria-hidden="true">
            <input name="honeypot" tabIndex={-1} autocomplete="off" />
          </div>

          <div id="turnstile-widget" />
          <Show when={errors().captchaToken}>
            {(msg) => (
              <p class="text-sm text-red-500" role="alert">
                {msg()}
              </p>
            )}
          </Show>

          <button
            type="submit"
            disabled={isSubmitting() || !captchaToken()}
            class="px-6 py-2 rounded-md bg-accent text-accent-foreground font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
          >
            {isSubmitting() ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      }
    >
      <div class="p-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
        <p class="font-medium">Message sent!</p>
        <p class="text-sm mt-1">I'll get back to you as soon as possible.</p>
      </div>
    </Show>
  )
}
