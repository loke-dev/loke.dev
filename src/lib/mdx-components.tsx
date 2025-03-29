'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CodeBlock } from '@/components/mdx/code-block'
import { Separator } from '@/components/ui/separator'

export const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-6 mb-3 text-2xl font-bold tracking-tight" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-4 mb-2 text-xl font-bold tracking-tight" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 list-disc pl-6" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 list-decimal pl-6" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mt-2" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-primary my-6 border-l-4 pl-4 italic"
      {...props}
    />
  ),
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href && (href.startsWith('/') || href.startsWith('#'))

    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-primary hover:text-primary/80 underline underline-offset-4"
          {...props}
        />
      )
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 underline underline-offset-4"
        {...props}
      />
    )
  },
  hr: () => <Separator className="my-6" />,
  code: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => {
    return <CodeBlock code={String(children)} className={className} />
  },
  pre: ({ children }: { children: React.ReactNode }) => {
    return <div className="not-prose mb-6">{children}</div>
  },
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src) return null

    return (
      <div className="my-6">
        <Image
          className="rounded-md"
          src={src}
          alt={alt || ''}
          width={700}
          height={350}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    )
  },
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-muted/50" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border px-4 py-2 text-left font-bold" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-4 py-2" {...props} />
  ),
}
