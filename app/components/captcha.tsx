import { useRef, useState } from 'react'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'

interface CaptchaProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  onLoad?: () => void
}

export function Captcha({ onVerify, onError, onExpire, onLoad }: CaptchaProps) {
  const turnstileRef = useRef<TurnstileInstance | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Use test keys for development to avoid real Cloudflare API calls
  const isDevelopment =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')

  const siteKey = isDevelopment
    ? '1x00000000000000000000AA' // Always use test key in development
    : typeof window !== 'undefined'
      ? (window as unknown as { ENV: { TURNSTILE_SITE_KEY: string } }).ENV
          ?.TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
      : '1x00000000000000000000AA'

  const handleLoad = () => {
    setIsVisible(true)
    onLoad?.()
  }

  return (
    <div className={isVisible ? 'flex' : 'hidden'}>
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onVerify}
        onError={onError}
        onExpire={onExpire}
        onLoad={handleLoad}
        options={{
          theme: 'auto',
          size: 'normal',
        }}
      />
      {isVisible && (
        <div className="ml-3 text-sm text-muted-foreground">
          <p>
            Prove you&apos;re not a robot (unless you&apos;re a really cool
            one)!
          </p>
        </div>
      )}
    </div>
  )
}
