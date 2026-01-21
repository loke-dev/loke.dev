import {
  PortableText as BasePortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from '@portabletext/react'
import { urlFor } from '@/lib/sanity/image'
import { Callout } from './callout'

const createComponents = (): PortableTextComponents => {
  const baseComponents: PortableTextComponents = {
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) {
          return null
        }
        return (
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Image'}
            className="my-6 rounded-lg"
          />
        )
      },
      code: ({ value }) => {
        const hasFilename = Boolean(value.filename)

        // If we have pre-highlighted HTML from the server, use it
        if (value.highlightedHtml) {
          return (
            <div className="my-4">
              {hasFilename && (
                <div className="rounded-t-lg bg-[--shiki-light-bg] dark:bg-[--shiki-dark-bg] border border-b-0 border-border px-4 py-2 text-sm text-muted-foreground">
                  {value.filename}
                </div>
              )}
              <div
                className={
                  hasFilename ? '[&>pre]:!rounded-t-none [&>pre]:!mt-0' : ''
                }
                dangerouslySetInnerHTML={{ __html: value.highlightedHtml }}
              />
            </div>
          )
        }

        // Fallback for non-highlighted code
        return (
          <div className="my-4">
            {hasFilename && (
              <div className="rounded-t-lg bg-gray-800 px-4 py-2 text-sm text-gray-300">
                {value.filename}
              </div>
            )}
            <pre
              className={`overflow-x-auto bg-gray-900 p-4 ${hasFilename ? 'rounded-b-lg' : 'rounded-lg'}`}
            >
              <code className="text-sm text-gray-100">{value.code}</code>
            </pre>
          </div>
        )
      },
      callout: ({ value }) => {
        const calloutComponents: PortableTextComponents = {
          ...baseComponents,
          types: {
            ...baseComponents.types,
            callout: undefined,
          },
        }
        return (
          <Callout type={value.type || 'info'} title={value.title}>
            <BasePortableText
              value={value.content || []}
              components={calloutComponents}
            />
          </Callout>
        )
      },
    },
    block: {
      h1: ({ children }) => (
        <h1 className="mb-4 mt-8 text-4xl font-bold">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-3 mt-6 text-3xl font-bold">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-2 mt-4 text-2xl font-bold">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="mb-2 mt-4 text-xl font-bold">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => <p className="my-4 leading-7">{children}</p>,
    },
    marks: {
      link: ({ children, value }) => {
        const isExternal = !value.href.startsWith('/')
        return (
          <a
            href={value.href}
            rel={isExternal ? 'noreferrer noopener' : undefined}
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        )
      },
      code: ({ children }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
          {children}
        </code>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
      ),
    },
  }

  return baseComponents
}

const components = createComponents()

export function PortableText({ value }: PortableTextProps) {
  return <BasePortableText value={value} components={components} />
}
