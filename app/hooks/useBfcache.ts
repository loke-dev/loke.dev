import { useEffect } from 'react'

/**
 * Hook to handle back/forward cache (bfcache) restoration
 *
 * This hook ensures the page properly supports bfcache by:
 * 1. Listening for the pageshow event to detect bfcache restoration
 * 2. Running the provided callback function when the page is restored from bfcache
 * 3. Avoiding unload event listeners which prevent bfcache
 *
 * @param callback Optional function to run when page is restored from bfcache
 */
export function useBfcache(callback?: () => void) {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // event.persisted is true when the page is restored from bfcache
      if (event.persisted) {
        // Run callback if provided
        callback?.()
      }
    }

    // Add pageshow event listener
    window.addEventListener('pageshow', handlePageShow)

    // Clean up
    return () => {
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [callback])
}
