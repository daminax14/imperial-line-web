'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_COOKIE,
  COOKIE_CONSENT_REJECTED,
  LOCALE_COOKIE,
} from '@/lib/cookie-settings'

const ONE_YEAR = 60 * 60 * 24 * 365

type Locale = 'it' | 'en' | 'de' | 'fr'

const messages: Record<Locale, { title: string; body: string; accept: string; reject: string; policy: string }> = {
  it: {
    title: 'Preferenza lingua',
    body: 'Possiamo salvare un cookie tecnico per ricordare la lingua del sito alle prossime visite?',
    accept: 'Salva preferenza',
    reject: 'Non salvare',
    policy: 'Cookie policy',
  },
  en: {
    title: 'Language preference',
    body: 'May we save a technical cookie to remember your site language on future visits?',
    accept: 'Save preference',
    reject: 'Do not save',
    policy: 'Cookie policy',
  },
  de: {
    title: 'Spracheinstellung',
    body: 'Dürfen wir ein technisches Cookie speichern, um Ihre Sprache für zukünftige Besuche zu merken?',
    accept: 'Präferenz speichern',
    reject: 'Nicht speichern',
    policy: 'Cookie-Richtlinie',
  },
  fr: {
    title: 'Préférence de langue',
    body: 'Pouvons-nous enregistrer un cookie technique pour mémoriser la langue du site lors de vos prochaines visites ?',
    accept: 'Enregistrer',
    reject: 'Ne pas enregistrer',
    policy: 'Politique de cookies',
  },
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
}

export default function CookieConsentToast({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false)
  const safeLocale = (['it', 'en', 'de', 'fr'].includes(locale) ? locale : 'en') as Locale
  const copy = useMemo(() => messages[safeLocale], [safeLocale])

  useEffect(() => {
    const consent = getCookie(COOKIE_CONSENT_COOKIE)
    setVisible(!consent)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-[140] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 rounded-[1.6rem] border border-white/60 bg-white/88 p-4 shadow-[0_24px_60px_-30px_rgba(32,72,112,0.55)] backdrop-blur-xl md:bottom-6 md:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2f6f99]/75">Imperial Line</p>
      <h3 className="mt-1 text-xl font-serif italic text-[#1f3c57]">{copy.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#36556f]">{copy.body}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/${safeLocale}/cookies`} className="text-xs font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors">
          {copy.policy}
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[#2f6f99]/18 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f6f99] transition-colors hover:bg-white"
            onClick={() => {
              setCookie(COOKIE_CONSENT_COOKIE, COOKIE_CONSENT_REJECTED, ONE_YEAR)
              deleteCookie(LOCALE_COOKIE)
              setVisible(false)
            }}
          >
            {copy.reject}
          </button>
          <button
            type="button"
            className="gold-hover-button inline-flex items-center justify-center rounded-full bg-[#2f6f99] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-md"
            onClick={() => {
              setCookie(COOKIE_CONSENT_COOKIE, COOKIE_CONSENT_ACCEPTED, ONE_YEAR)
              setCookie(LOCALE_COOKIE, safeLocale, ONE_YEAR)
              setVisible(false)
            }}
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
