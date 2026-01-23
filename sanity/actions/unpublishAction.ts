import { useCallback, useState } from 'react'
import { EyeOffIcon } from 'lucide-react'
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from 'sanity'

export const useUnpublishAction: DocumentActionComponent = (
  props: DocumentActionProps
) => {
  const { id, type, draft, published, onComplete } = props
  const client = useClient({ apiVersion: '2024-01-01' })
  const { unpublish } = useDocumentOperation(id, type)
  const [isUnpublishing, setIsUnpublishing] = useState(false)

  const handleUnpublish = useCallback(async () => {
    setIsUnpublishing(true)

    try {
      // If there's no draft, create one from the published version first
      if (!draft && published) {
        await client.createIfNotExists({
          ...published,
          _id: `drafts.${id}`,
        })
      }

      // Execute the unpublish operation
      unpublish.execute()
      onComplete()
    } catch (error) {
      console.error('Failed to unpublish:', error)
    } finally {
      setIsUnpublishing(false)
    }
  }, [client, draft, id, onComplete, published, unpublish])

  // Only show if the document is published
  if (!published) {
    return null
  }

  return {
    label: isUnpublishing ? 'Unpublishing…' : 'Unpublish',
    icon: EyeOffIcon,
    tone: 'caution',
    disabled: isUnpublishing || Boolean(unpublish.disabled),
    onHandle: handleUnpublish,
  }
}
