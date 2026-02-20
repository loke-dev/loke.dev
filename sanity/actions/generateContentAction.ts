import { useCallback, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { type DocumentActionComponent, type DocumentActionProps } from 'sanity'

export const GenerateContentAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { id, type, published } = props
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/seshat/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: id,
        }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        props.onComplete()
      } else {
        throw new Error(result.error || 'Generation failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Generation failed:', err)

      setTimeout(() => setError(null), 5000)
    } finally {
      setIsGenerating(false)
    }
  }, [id, props])

  if (type !== 'contentTopic') {
    return null
  }

  return {
    label: isGenerating
      ? 'Starting...'
      : error
        ? 'Retry'
        : 'Generate in Background',
    icon: Sparkles,
    tone: error ? 'critical' : 'primary',
    disabled: isGenerating || !published?.active,
    title:
      error ||
      (!published?.active
        ? 'Topic must be active to generate'
        : 'Starts background generation via GitHub Actions. Check Actions tab for progress.'),
    onHandle: handleGenerate,
  }
}
