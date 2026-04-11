'use client'

import { useRouter } from 'next/navigation'

type GoBackButtonProps = {
  label: string
  fallbackHref: string
  className?: string
}

export default function GoBackButton({ label, fallbackHref, className }: GoBackButtonProps) {
  const router = useRouter()

  function handleGoBack() {
    if (typeof window !== 'undefined' && document.referrer) {
      try {
        const referrerOrigin = new URL(document.referrer).origin
        if (referrerOrigin === window.location.origin) {
          router.back()
          return
        }
      } catch {
        // Ignore malformed referrer and use fallback route.
      }
    }

    router.push(fallbackHref)
  }

  return (
    <button type="button" onClick={handleGoBack} className={className}>
      {label}
    </button>
  )
}
