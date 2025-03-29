'use client'

import React, { useState } from 'react'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  code: string
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={copyToClipboard}
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy code</span>
      </Button>

      {copied && (
        <div className="bg-foreground text-background absolute top-2 right-2 rounded-md px-2 py-1 text-xs">
          Copied!
        </div>
      )}
    </>
  )
}
