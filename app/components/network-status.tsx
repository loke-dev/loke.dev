import { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowStatus(true)
      const timeout = setTimeout(() => setShowStatus(false), 3000)
      return () => clearTimeout(timeout)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowStatus(true)
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ONLINE') {
        setIsOnline(true)
        setShowStatus(true)
        setTimeout(() => setShowStatus(false), 3000)
      } else if (event.data?.type === 'OFFLINE') {
        setIsOnline(false)
        setShowStatus(true)
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    navigator.serviceWorker?.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      navigator.serviceWorker?.removeEventListener('message', handleMessage)
    }
  }, [])

  if (!showStatus) return null

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 rounded-full px-3 py-2 shadow-lg transition-colors ${
        isOnline
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}
