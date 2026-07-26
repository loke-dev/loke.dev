import { Resend } from 'resend'

export interface ContactFormData {
  name: string
  email: string
  message: string
  honeypot?: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

export function renderContactEmail(
  data: Pick<ContactFormData, 'name' | 'email' | 'message'>
): string {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const message = escapeHtml(data.message)

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #555; margin-top: 0;">Contact Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="color: #555; margin-top: 0;">Message</h3>
        <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; font-size: 14px; color: #666;">
        <p><strong>Note:</strong> This message was sent from the contact form on loke.dev</p>
        <p>You can reply directly to this email to respond to ${name}.</p>
      </div>
    </div>
  `
}

export async function sendContactEmail(data: ContactFormData) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  if (data.honeypot) {
    throw new Error('Spam detected')
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: 'Contact Form <noreply@loke.dev>',
      to: ['hello@loke.dev'],
      subject: `New contact form submission from ${singleLine(data.name)}`,
      html: renderContactEmail(data),
      replyTo: data.email,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Failed to send contact email:', error)
    throw new Error('Failed to send email. Please try again later.')
  }
}
