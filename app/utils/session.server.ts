import { createCookieSessionStorage, redirect } from '@remix-run/node'

// Session storage for flash messages
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'loke_flash',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export type ToastMessage = {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

// Get the session from the request
export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

// Set a flash message in the session
export async function setFlashMessage(
  request: Request,
  message: string,
  type: ToastMessage['type'] = 'info',
  redirectTo: string
) {
  const session = await getSession(request)

  // Store the message and type in the session
  session.flash('toast', { message, type } as ToastMessage)

  // Create the redirect with the session cookie
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  })
}

// Get a flash message from the session
export async function getFlashMessage(request: Request) {
  const session = await getSession(request)

  // Get the flash message
  const toast = session.get('toast') as ToastMessage | undefined

  // Commit the session so the flash message is cleared
  const headers = {
    'Set-Cookie': await sessionStorage.commitSession(session),
  }

  return { toast, headers }
}
