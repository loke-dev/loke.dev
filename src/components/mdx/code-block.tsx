import React from 'react'
import { codeToHtml } from '@/lib/shiki'
import { CopyButton } from './copy-button'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
  html?: string
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  async function CodeBlock(
    { code, language = 'typescript', filename, className },
    ref
  ) {
    const extractedLanguage = className?.replace('language-', '') || language
    const html = await codeToHtml({
      code,
      language: extractedLanguage,
    })

    console.log({ language, extractedLanguage, html })

    return (
      <div
        ref={ref}
        className="bg-muted/50 relative my-6 overflow-hidden rounded-lg border"
      >
        {filename && (
          <div className="bg-muted border-b px-4 py-2 text-sm font-medium">
            {filename}
          </div>
        )}
        <div className="group relative">
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <CopyButton code={code} />
        </div>
      </div>
    )
  }
)
