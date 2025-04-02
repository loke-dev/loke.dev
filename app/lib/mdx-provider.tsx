/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
import { HTMLAttributes, type ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Callout } from '@/components/callout'

type ComponentProps = HTMLAttributes<HTMLElement> & { children?: ReactNode }

const components = {
  h1: (props: ComponentProps) => (
    <h1 className="mb-6 mt-8 text-4xl font-bold tracking-tight" {...props} />
  ),
  h2: (props: ComponentProps) => (
    <h2 className="mb-4 mt-6 text-3xl font-bold tracking-tight" {...props} />
  ),
  h3: (props: ComponentProps) => (
    <h3 className="mb-4 mt-6 text-2xl font-bold" {...props} />
  ),
  h4: (props: ComponentProps) => (
    <h4 className="mb-4 mt-6 text-xl font-bold" {...props} />
  ),
  p: (props: ComponentProps) => (
    <p className="mb-4 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentProps) => (
    <ul className="mb-4 list-disc pl-6" {...props} />
  ),
  ol: (props: ComponentProps) => (
    <ol className="mb-4 list-decimal pl-6" {...props} />
  ),
  li: (props: ComponentProps) => <li className="mb-2" {...props} />,
  a: (props: ComponentProps & { href?: string }) => (
    <a
      className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      {...props}
    />
  ),
  blockquote: (props: ComponentProps) => (
    <blockquote
      className="border-l-4 border-gray-200 pl-4 italic dark:border-gray-700"
      {...props}
    />
  ),
  pre: (props: ComponentProps) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-900"
      {...props}
    />
  ),
  code: (props: ComponentProps) => (
    <code className="font-mono text-sm" {...props} />
  ),
  img: (props: HTMLAttributes<HTMLImageElement> & { alt?: string }) => (
    <img className="mx-auto my-4 max-w-full rounded-lg" alt="" {...props} />
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-800" />,
  table: (props: ComponentProps) => (
    <div className="mb-4 overflow-x-auto">
      <table
        className="w-full border-collapse border border-gray-300 dark:border-gray-700"
        {...props}
      />
    </div>
  ),
  th: (props: ComponentProps) => (
    <th
      className="border border-gray-300 bg-gray-100 p-2 text-left dark:border-gray-700 dark:bg-gray-800"
      {...props}
    />
  ),
  td: (props: ComponentProps) => (
    <td
      className="border border-gray-300 p-2 dark:border-gray-700"
      {...props}
    />
  ),
  Callout,
}

export function MDXComponentsProvider({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
