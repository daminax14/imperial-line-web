'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar({ dict, locale }: { dict: any, locale: string }) {
  const pathname = usePathname()

  const getTranslatedPath = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/')
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <Image
            src="/logo-placeholder.png"
            alt="Imperial Line"
            width={110}
            height={28}
            priority
            className="object-contain"
          />
        </Link>

        {/* MENU CENTRALE - NOTA: usiamo dict.nav.xxx */}
        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          <Link href={`/${locale}`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.home || 'Home'}
          </Link>
          <Link href={`/${locale}/i-nostri-gatti`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.cats || 'Gatti'}
          </Link>
          <Link href={`/${locale}/consigli`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.advice || 'Consigli'}
          </Link>
          <Link href={`/${locale}/contatti`} className="hover:text-gold-200 transition-colors">
            {dict?.nav?.contact || 'Contatti'}
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
            {['it', 'de', 'en'].map((l) => (
              <Link 
                key={l}
                href={getTranslatedPath(l)}
                className={`flex items-center gap-1.5 group ${locale === l ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                  <img src={`https://flagcdn.com/${l === 'en' ? 'gb' : l}.svg`} className="w-full h-full object-cover" alt={l} />
                </div>
                <span className="text-[10px] font-bold text-slate-900 uppercase">{l}</span>
              </Link>
            ))}
          </div>

          <Link href={`/${locale}/contatti`} className="hidden sm:block text-[10px] bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-gold-200 transition-all font-bold tracking-widest uppercase">
            {dict?.nav?.book || 'Book Now'}
          </Link>
        </div>
      </nav>
    </header>
  )
}