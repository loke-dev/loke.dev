'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  className?: string
}

// Named export with forwardRef for direct usage in MDX
export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { code, language = 'typescript', filename, showLineNumbers = true, className },
  ref
) {
  // Extract language from className if provided (as MDX does)
  const extractedLanguage = className?.replace('language-', '') || language

  const [copied, setCopied] = React.useState(false)

  const copyCode = React.useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div ref={ref} className="bg-muted/50 relative my-6 overflow-hidden rounded-lg border">
      {filename && <div className="bg-muted border-b px-4 py-2 text-sm font-medium">{filename}</div>}
      <div className="group relative">
        <pre className={`overflow-x-auto p-4 text-sm ${showLineNumbers ? 'pl-12' : 'pl-4'}`}>
          {showLineNumbers && (
            <div className="bg-muted/50 text-muted-foreground absolute top-0 left-0 h-full w-8 border-r px-2 py-4 text-right font-mono text-xs">
              {code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code className={`language-${extractedLanguage}`}>{code}</code>
        </pre>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={copyCode}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy code</span>
        </Button>
        {copied && (
          <div className="bg-foreground text-background absolute top-2 right-2 rounded-md px-2 py-1 text-xs">
            Copied!
          </div>
        )}
      </div>
    </div>
  )
})
