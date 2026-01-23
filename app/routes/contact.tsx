import { useState } from 'react'
import { parseWithZod } from '@conform-to/zod'
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import { verifyTurnstileToken } from '@/utils/captcha.server'
import { sendContactEmail } from '@/utils/email.server'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { checkRateLimit, getRateLimitHeaders } from '@/utils/rate-limit.server'
import { getContactPage } from '@/utils/sanity.queries'
import { getFlashMessage, setFlashMessage } from '@/utils/session.server'
import { Captcha } from '@/components/captcha'
import { Page, PageHeader, Section } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const ContactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  honeypot: z.string().optional(),
  captchaToken: z.string().min(1, 'Please complete the CAPTCHA verification'),
})

export function headers() {
  return {
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
  }
}

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Contact',
    description:
      'Get in touch to discuss web development projects, collaborations, or consulting opportunities. Reach out for React, Remix, TypeScript, and full-stack development services.',
    url: `${SITE_DOMAIN}/contact`,
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const [{ toast, headers }, page] = await Promise.all([
    getFlashMessage(request),
    getContactPage(),
  ])
  return data({ toast, page }, { headers })
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: ContactSchema })

  if (submission.status !== 'success') {
    return data({ result: submission.reply() }, { status: 400 })
  }

  const rateLimit = await checkRateLimit(request)
  if (!rateLimit.allowed) {
    return data(
      {
        result: submission.reply({
          formErrors: [
            rateLimit.error || 'Too many attempts. Please try again later.',
          ],
        }),
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimit),
      }
    )
  }

  const captchaValid = await verifyTurnstileToken(submission.value.captchaToken)
  if (!captchaValid) {
    return data(
      {
        result: submission.reply({
          formErrors: ['CAPTCHA verification failed. Please try again.'],
        }),
      },
      { status: 400 }
    )
  }

  try {
    await sendContactEmail(submission.value)
    return setFlashMessage(
      request,
      "Thank you for your message! I'll get back to you as soon as possible.",
      'success',
      '/contact'
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return data(
      {
        result: submission.reply({
          formErrors: [
            error instanceof Error
              ? error.message
              : 'Failed to send message. Please try again.',
          ],
        }),
      },
      { status: 500 }
    )
  }
}

export default function Contact() {
  const actionData = useActionData<typeof action>()
  const { toast, page } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const [captchaToken, setCaptchaToken] = useState<string>('')

  return (
    <Page>
      <PageHeader title={page.title} description={page.description} />

      {toast && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      <form method="post" className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            aria-invalid={actionData?.result?.error?.name ? 'true' : 'false'}
            aria-describedby={
              actionData?.result?.error?.name ? 'name-error' : undefined
            }
          />
          {actionData?.result?.error?.name && (
            <p id="name-error" className="text-sm text-red-600">
              {actionData.result.error.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            required
            aria-invalid={actionData?.result?.error?.email ? 'true' : 'false'}
            aria-describedby={
              actionData?.result?.error?.email ? 'email-error' : undefined
            }
          />
          {actionData?.result?.error?.email && (
            <p id="email-error" className="text-sm text-red-600">
              {actionData.result.error.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="How can I help you?"
            rows={6}
            required
            aria-invalid={actionData?.result?.error?.message ? 'true' : 'false'}
            aria-describedby={
              actionData?.result?.error?.message ? 'message-error' : undefined
            }
          />
          {actionData?.result?.error?.message && (
            <p id="message-error" className="text-sm text-red-600">
              {actionData.result.error.message[0]}
            </p>
          )}
        </div>

        <div style={{ display: 'none' }} aria-hidden="true">
          <Label htmlFor="honeypot">Leave this field empty</Label>
          <Input
            id="honeypot"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <input type="hidden" name="captchaToken" value={captchaToken} />

        <div className="space-y-2">
          <Captcha
            onVerify={setCaptchaToken}
            onError={() => setCaptchaToken('')}
            onExpire={() => setCaptchaToken('')}
          />
          {actionData?.result?.error?.captchaToken && (
            <p className="text-sm text-red-600">
              {actionData.result.error.captchaToken[0]}
            </p>
          )}
        </div>

        {actionData?.result?.error &&
          Array.isArray(actionData.result.error) && (
            <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
              {actionData.result.error.map((error: string, index: number) => (
                <p key={index} className="text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting || !captchaToken}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>

      {page.alternativeContactTitle && (
        <Section
          title={page.alternativeContactTitle}
          className="mt-12 border-t pt-8"
        >
          <p>{page.alternativeContactDescription}</p>
        </Section>
      )}
    </Page>
  )
}
