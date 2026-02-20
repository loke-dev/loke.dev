import { useCallback, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { type DocumentActionComponent } from 'sanity'

export const SyncSchedulesAction: DocumentActionComponent = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSync = useCallback(async () => {
    setIsSyncing(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/seshat/schedule-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      setSuccess(result.message || 'Schedules synced successfully')

      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Sync failed:', err)

      setTimeout(() => setError(null), 5000)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  return {
    label: isSyncing ? 'Syncing...' : success ? 'Synced!' : 'Sync Schedules',
    icon: RefreshCw,
    tone: error ? 'critical' : success ? 'positive' : 'primary',
    disabled: isSyncing,
    title:
      error || success || 'Sync all active content topic schedules to QStash',
    onHandle: handleSync,
  }
}
