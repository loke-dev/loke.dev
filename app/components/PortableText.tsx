import {
  PortableText as BasePortableText,
  PortableTextComponents,
} from '@portabletext/react'
import { urlFor } from '@/utils/sanity.client'

const components: PortableTextComponents = {
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
      return (
        <div className="my-4">
          {value.filename && (
            <div className="rounded-t-lg bg-gray-800 px-4 py-2 text-sm text-gray-300">
              {value.filename}
            </div>
          )}
          <pre
            className={`overflow-x-auto bg-gray-900 p-4 ${value.filename ? 'rounded-b-lg' : 'rounded-lg'}`}
          >
            <code className="text-sm text-gray-100">{value.code}</code>
          </pre>
        </div>
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
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      )
    },
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1 py-0.5 text-sm">
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

export function PortableText({ value }: { value: unknown }) {
  return <BasePortableText value={value as never} components={components} />
}
