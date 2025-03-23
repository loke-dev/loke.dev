import type { Metadata } from 'next'
import JsonLd from '@/components/jsonLd'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Loke',
}

export default function Contact() {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Loke',
    description: 'Contact page for Loke',
    mainEntity: {
      '@type': 'Person',
      name: 'Loke',
      email: 'hello@loke.dev',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Stockholm',
        addressCountry: 'Sweden',
      },
    },
  }

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <div className="bg-base-100">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-lg md:grid md:max-w-none md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="text-3xl font-bold">Email me directly</h2>
              <p className="mt-3 text-lg opacity-70">
                For quick inquiries or if you prefer email, you can reach me directly at the address below.
              </p>
              <div className="mt-9">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 opacity-60" />
                  </div>
                  <div className="ml-3 text-base opacity-70">
                    <p>hello@loke.dev</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 md:mt-0">
              <h2 className="text-3xl font-bold">Or use this contact form</h2>
              <p className="mt-3 text-lg opacity-70">
                Fill out the form below with your details and I'll get back to you as soon as possible.
              </p>
              <div className="mt-9">
                <form action="https://formspree.io/f/mleyrgqy" method="POST" className="grid grid-cols-1 gap-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input type="text" name="name" id="name" autoComplete="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" autoComplete="email" placeholder="Your email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" name="message" rows={4} placeholder="Your message" />
                  </div>
                  <div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
