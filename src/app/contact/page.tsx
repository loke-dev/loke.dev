import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

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
      telephone: '+1 (555) 123-4567',
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
              <h2 className="text-3xl font-bold">Get in touch</h2>
              <p className="mt-3 text-lg opacity-70">
                Have a question or want to work together? Feel free to reach out
                using the contact form or through any of the channels below.
              </p>
              <div className="mt-9">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 opacity-60"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 text-base opacity-70">
                    <p>hello@loke.dev</p>
                  </div>
                </div>
                <div className="mt-6 flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 opacity-60"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 text-base opacity-70">
                    <p>+1 (555) 123-4567</p>
                    <p className="mt-1">Mon-Fri 9am to 5pm PST</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 md:mt-0">
              <h2 className="text-3xl font-bold">Send us a message</h2>
              <div className="mt-9">
                <form
                  action="#"
                  method="POST"
                  className="grid grid-cols-1 gap-y-6"
                >
                  <div>
                    <label htmlFor="name" className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      className="input input-bordered w-full"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="input input-bordered w-full"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="label">
                      <span className="label-text">Phone</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="input input-bordered w-full"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="label">
                      <span className="label-text">Message</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="textarea textarea-bordered w-full"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary w-full">
                      Send Message
                    </button>
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
