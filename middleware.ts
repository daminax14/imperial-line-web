import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_COOKIE,
  LOCALE_COOKIE,
} from '@/lib/cookie-settings'

const locales = ['it', 'en', 'de', 'fr'] as const
const DEFAULT_LOCALE = 'en'
function isSupportedLocale(value?: string): value is (typeof locales)[number] {
  return Boolean(value && locales.includes(value as (typeof locales)[number]))
}

function getLocaleFromPath(pathname: string) {
  return locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
}

function getPreferredLocale(request: NextRequest) {
  const hasConsent = request.cookies.get(COOKIE_CONSENT_COOKIE)?.value === COOKIE_CONSENT_ACCEPTED
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (hasConsent && isSupportedLocale(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(',')
      .map((part) => part.split(';')[0]?.trim().toLowerCase())
      .filter(Boolean)

    for (const candidate of candidates) {
      const baseLocale = candidate.split('-')[0]
      if (isSupportedLocale(baseLocale)) {
        return baseLocale
      }
    }
  }

  return DEFAULT_LOCALE
}

function withLocaleCookie(response: NextResponse, locale: string, request: NextRequest) {
  const consentValue = request.cookies.get(COOKIE_CONSENT_COOKIE)?.value
  if (consentValue !== COOKIE_CONSENT_ACCEPTED) {
    return response
  }

  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const maintenanceMode = process.env.MAINTENANCE_MODE?.trim().toLowerCase() === 'true'

  const localeInPath = getLocaleFromPath(pathname)
  const preferredLocale = getPreferredLocale(request)
  const targetLocale = localeInPath || preferredLocale
  const maintenancePath = `/${targetLocale}/maintenance`

  if (maintenanceMode) {
    if (pathname === maintenancePath || pathname === `${maintenancePath}/`) {
      return localeInPath
        ? withLocaleCookie(NextResponse.next(), localeInPath, request)
        : NextResponse.next()
    }

    request.nextUrl.pathname = maintenancePath
    return withLocaleCookie(NextResponse.redirect(request.nextUrl), targetLocale, request)
  }

  // If maintenance mode has been disabled, avoid keeping users on the maintenance page.
  if (pathname === maintenancePath || pathname === `${maintenancePath}/`) {
    request.nextUrl.pathname = `/${targetLocale}`
    return withLocaleCookie(NextResponse.redirect(request.nextUrl), targetLocale, request)
  }

  const legacyGroupMatch = pathname.match(/^\/(it|en|de|fr)\/i-nostri-gatti\/(king|queen)\/?$/)
  if (legacyGroupMatch) {
    const [, locale, group] = legacyGroupMatch
    const nextGroup = group === 'king' ? 'kings' : 'queens'
    request.nextUrl.pathname = `/${locale}/i-nostri-gatti/${nextGroup}`
    return withLocaleCookie(NextResponse.redirect(request.nextUrl), locale, request)
  }
  
  // Verifica se l'URL ha già la lingua
  const pathnameHasLocale = Boolean(localeInPath)

  if (pathnameHasLocale && localeInPath) {
    return withLocaleCookie(NextResponse.next(), localeInPath, request)
  }

  // Se non ce l'ha, reindirizza alla lingua preferita, con fallback inglese.
  request.nextUrl.pathname = `/${preferredLocale}${pathname}`
  return withLocaleCookie(NextResponse.redirect(request.nextUrl), preferredLocale, request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
}