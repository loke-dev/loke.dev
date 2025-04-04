import type { MetaFunction } from '@remix-run/node'
import { Page, PageHeader, Section } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const meta: MetaFunction = () => {
  return [
    { title: 'Contact - loke.dev' },
    { name: 'description', content: 'Get in touch with me' },
  ]
}

export default function Contact() {
  return (
    <Page>
      <PageHeader
        title="Contact Me"
        description="Have a question or want to work together? Feel free to reach out using the form below."
      />

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="How can I help you?"
            rows={6}
            required
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Send Message
        </Button>
      </form>

      <Section title="Other ways to reach me" className="mt-12 border-t pt-8">
        <p>You can also connect with me on social media or via email.</p>
      </Section>
    </Page>
  )
}
