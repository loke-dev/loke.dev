// TODO: Implement Astro-compatible session storage (Task 12)
// For now, this is a stub. The rate-limit.server.ts will be refactored
// to use a different strategy when implementing the contact API endpoint.

export async function getSession(request: Request) {
  void request
  throw new Error('Session management not yet implemented for Astro')
}

export type ToastMessage = {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}
