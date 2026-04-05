'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar({ dict, locale }: { dict: any, locale: string }) {
  const pathname = usePathname()
  const locales = ['it', 'de', 'en', 'fr']
  const currentLocale = locales.includes(locale) ? locale : 'it'

  const getTranslatedPath = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/')
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex justify-between items-center">
        
        {/* CONTENITORE LOGO CON POSIZIONAMENTO A SBALZO */}
        <div className="relative w-[180px] h-[100px] flex-shrink-0"> 
          <Link 
            href={`/${locale}`} 
            className="absolute -top-3 left-0 w-[220px] h-[140px] z-[40] transition-transform hover:scale-105"
          >
            <img
              src="/logo.jpeg"
              alt="Imperial Line"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </Link>
        </div>

        {/* MENU CENTRALE */}
        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          <Link href={`/${locale}`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.home || 'Home'}
          </Link>
          
          <div className="relative group">
            <Link href={`/${locale}/i-nostri-gatti/moon`} className="hover:text-gold-200 transition-colors inline-flex items-center gap-2">
              {dict?.nav?.cats || 'Gatti'}
              <span className="text-[9px]">▾</span>
            </Link>

            <div className="pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 transition-all absolute left-0 top-full pt-3 min-w-[200px] z-30">
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

          <Link href={`/${locale}/gattini-disponibili`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.availableKittens || 'Gattini disponibili'}
          </Link>
          <Link href={`/${locale}/consigli`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.advice || 'Consigli'}
          </Link>
          <Link href={`/${locale}/condizioni-adozione`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.adoptionConditions || "Condizioni per l'adozione"}
          </Link>
          <Link href={`/${locale}/contatti`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.contact || 'Contatti'}
          </Link>
        </div>

        {/* LINGUA E TASTO PRENOTA */}
        <div className="flex items-center gap-6">
          <div className="border-r border-slate-200 pr-6">
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

          <Link href={`/${locale}/contatti`} className="hidden sm:block text-[10px] bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-gold-200 transition-all font-bold tracking-widest uppercase">
            {dict?.nav?.book || 'Prenota'}
          </Link>
        </div>
      </nav>
    </header>
  )
}