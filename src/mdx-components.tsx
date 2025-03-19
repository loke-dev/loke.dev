import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-3xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-6 mb-3 text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-2 text-xl font-bold">{children}</h3>
    ),
    p: ({ children }) => <p className="mb-4">{children}</p>,
    a: ({ href, children }) => (
      <Link href={href || '#'} className="text-blue-600 hover:underline">
        {children}
      </Link>
    ),
    ul: ({ children }) => <ul className="mb-4 list-disc pl-5">{children}</ul>,
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal pl-5">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
    img: ({ src, alt }) => (
      <div className="mb-4">
        <Image
          src={src || ''}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-md"
        />
      </div>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-4 border-gray-200 py-2 pl-4 italic">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 overflow-x-auto rounded bg-gray-100 p-4 font-mono text-sm dark:bg-gray-800">
        {children}
      </pre>
    ),
    ...components,
  }
}
