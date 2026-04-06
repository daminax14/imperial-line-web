'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar({ dict, locale }: { dict: any, locale: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const locales = ['it', 'de', 'en', 'fr']
  const currentLocale = locales.includes(locale) ? locale : 'it'
  const desktopNavItemClass =
    'flex min-h-[40px] items-center justify-center text-center leading-[1.15] hover:text-gold-200 transition-colors'

  const getTranslatedPath = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* CONTENITORE LOGO CON POSIZIONAMENTO A SBALZO */}
        <div className="relative w-[150px] md:w-[170px] h-[88px] md:h-[96px] flex-shrink-0"> 
          <Link 
            href={`/${locale}`} 
            className="absolute -top-2 md:-top-3 left-0 w-[190px] md:w-[210px] h-[120px] md:h-[132px] z-[40] transition-transform hover:scale-105"
          >
            <img
              src="/logo.jpeg"
              alt="Imperial Line"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </Link>
        </div>


        {/* MENU  CENTRALE */}
        <div className="hidden md:grid flex-1 max-w-3xl grid-cols-[0.85fr_1.1fr_1fr_0.85fr_1.35fr_0.85fr] items-center gap-x-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          <Link href={`/${locale}`} className={desktopNavItemClass}>
            {dict?.nav?.home || 'Home'}
          </Link>
          
          <div className="relative group flex justify-center">
            <Link href={`/${locale}/i-nostri-gatti/king`} className={`${desktopNavItemClass} inline-flex gap-2 px-2`}>
              <span>{dict?.nav?.cats || 'Gatti'}</span>
              <span className="text-[9px]">▾</span>
            </Link>

            <div className="pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 transition-all absolute left-1/2 top-full -translate-x-1/2 pt-3 min-w-[200px] z-30">
              <div className="rounded-xl border border-slate-200 bg-white shadow-xl p-2 text-[10px] tracking-[0.18em] uppercase">
                <Link href={`/${locale}/i-nostri-gatti/king`} className="block px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-gold-200 transition-colors">
                  King
                </Link>
                <Link href={`/${locale}/i-nostri-gatti/queen`} className="block px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-gold-200 transition-colors">
                  Queen
                </Link>
              </div>
            </div>
          </div>

          <Link href={`/${locale}/gattini-disponibili`} className={`${desktopNavItemClass} px-1`}>
            {dict?.nav?.availableKittens || 'Gattini disponibili'}
          </Link>
          <Link href={`/${locale}/consigli`} className={desktopNavItemClass}>
            {dict?.nav?.advice || 'Consigli'}
          </Link>
          <Link href={`/${locale}/condizioni-adozione`} className={`${desktopNavItemClass} px-1`}>
            {dict?.nav?.adoptionConditions || "Condizioni per l'adozione"}
          </Link>
          <Link href={`/${locale}/contatti`} className={desktopNavItemClass}>
            {dict?.nav?.contact || 'Contatti'}
          </Link>
        </div>

        {/* HAMBURGER MENU (mobile) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <div className={`h-0.5 w-6 bg-slate-800 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`h-0.5 w-6 bg-slate-800 transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`h-0.5 w-6 bg-slate-800 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>

        {/* LINGUA E TASTO PRENOTA */}
        <div className="flex items-center justify-end gap-4 md:gap-5 flex-shrink-0 min-w-fit">
          <div className="border-r border-slate-200 pr-4 md:pr-5">
            <details className="relative group">
              <summary className="list-none cursor-pointer flex items-center gap-2.5 select-none">
                <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                  <img
                    src={`https://flagcdn.com/${currentLocale === 'en' ? 'gb' : currentLocale}.svg`}
                    className="w-full h-full object-cover"
                    alt={currentLocale}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-900 uppercase">{currentLocale}</span>
                <span className="text-[9px] text-slate-500 transition-transform group-open:rotate-180">▾</span>
              </summary>

              <div className="absolute right-0 top-full mt-2 w-24 rounded-lg border border-slate-200 bg-white shadow-lg p-1.5 z-40">
                {locales
                  .filter((l) => l !== currentLocale)
                  .map((l) => (
                    <Link
                      key={l}
                      href={getTranslatedPath(l)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                        <img src={`https://flagcdn.com/${l === 'en' ? 'gb' : l}.svg`} className="w-full h-full object-cover" alt={l} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-900 uppercase">{l}</span>
                    </Link>
                  ))}
              </div>
            </details>
          </div>

          <Link href={`/${locale}/contatti`} className="hidden sm:block text-[10px] bg-slate-900 text-white px-5 md:px-6 py-2.5 rounded-full hover:bg-gold-200 transition-all font-bold tracking-widest uppercase whitespace-nowrap">
            {dict?.nav?.book || 'Prenota'}
          </Link>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 space-y-3">
          <Link
            href={`/${locale}`}
            className="block text-sm font-semibold text-slate-700 hover:text-gold-200 py-2"
            onClick={closeMobileMenu}
          >
            {dict?.nav?.home || 'Home'}
          </Link>
          <Link
            href={`/${locale}/i-nostri-gatti/king`}
            className="block text-sm text-slate-600 hover:text-gold-200 py-1 pl-4 border-l-2 border-slate-200"
            onClick={closeMobileMenu}
          >
            King
          </Link>
          <Link
            href={`/${locale}/i-nostri-gatti/queen`}
            className="block text-sm text-slate-600 hover:text-gold-200 py-1 pl-4 border-l-2 border-slate-200"
            onClick={closeMobileMenu}
          >
            Queen
          </Link>
          <Link
            href={`/${locale}/gattini-disponibili`}
            className="block text-sm font-semibold text-slate-700 hover:text-gold-200 py-2"
            onClick={closeMobileMenu}
          >
            {dict?.nav?.availableKittens || 'Gattini disponibili'}
          </Link>
          <Link
            href={`/${locale}/consigli`}
            className="block text-sm font-semibold text-slate-700 hover:text-gold-200 py-2"
            onClick={closeMobileMenu}
          >
            {dict?.nav?.advice || 'Consigli'}
          </Link>
          <Link
            href={`/${locale}/condizioni-adozione`}
            className="block text-sm font-semibold text-slate-700 hover:text-gold-200 py-2"
            onClick={closeMobileMenu}
          >
            {dict?.nav?.adoptionConditions || "Condizioni per l'adozione"}
          </Link>
          <Link
            href={`/${locale}/contatti`}
            className="block text-sm font-semibold text-slate-700 hover:text-gold-200 py-2"
            onClick={closeMobileMenu}
          >
            {dict?.nav?.contact || 'Contatti'}
          </Link>
          <Link
            href={`/${locale}/contatti`}
            className="block w-full text-center text-xs bg-slate-900 text-white px-4 py-2.5 rounded-full hover:bg-gold-200 transition-all font-bold tracking-widest uppercase mt-4"
            onClick={closeMobileMenu}
          >
            {dict?.nav?.book || 'Prenota'}
          </Link>
        </div>
      )}
    </header>
  )
}