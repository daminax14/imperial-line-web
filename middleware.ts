import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['it', 'en', 'de', 'fr']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const legacyGroupMatch = pathname.match(/^\/(it|en|de|fr)\/i-nostri-gatti\/(king|queen)\/?$/)
  if (legacyGroupMatch) {
    const [, locale, group] = legacyGroupMatch
    const nextGroup = group === 'king' ? 'kings' : 'queens'
    request.nextUrl.pathname = `/${locale}/i-nostri-gatti/${nextGroup}`
    return NextResponse.redirect(request.nextUrl)
  }
  
  // Verifica se l'URL ha già la lingua
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Se non ce l'ha, reindirizza alla lingua di default (it)
  request.nextUrl.pathname = `/it${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
}