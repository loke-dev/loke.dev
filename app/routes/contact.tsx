import type { MetaFunction } from '@remix-run/node'
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
    <div className="container mx-auto px-4 py-16 md:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Contact Me</h1>

        <p className="mb-8 text-lg">
          Have a question or want to work together? Feel free to reach out using
          the form below.
        </p>

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

        <div className="mt-12 border-t pt-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Other ways to reach me
          </h2>
          <p>You can also connect with me on social media or via email.</p>
        </div>
      </div>
    </div>
  )
}
