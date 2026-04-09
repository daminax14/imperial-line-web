import Link from 'next/link'

function SocialIcon({ kind }: { kind: 'instagram' | 'tiktok' | 'email' | 'phone' | 'pin' }) {
  const cls = 'w-4 h-4 text-slate-500 flex-shrink-0'
  if (kind === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (kind === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden="true">
        <path d="M14 4v9.2a3.8 3.8 0 1 1-2.7-3.64" />
        <path d="M14 4c1 2 2.5 3.2 4.5 3.5" />
      </svg>
    )
  }
  if (kind === 'email') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    )
  }
  if (kind === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.6a2 2 0 0 1-.4 2L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2-.4c.9.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden="true">
      <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export default function Footer({ dict, locale }: { dict: any, locale: string }) {
  const footer = dict?.footer || {}
  const nav = dict?.nav || {}
  const breeder = dict?.breederContacts || {}

  return (
    <footer className="relative z-40 bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* LOGO & TAGLINE */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h3 className="text-xl font-serif text-slate-900">
              Imperial <span className="text-gold-200 italic">Line</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">
              {footer.tagline}
            </p>
          </div>

          {/* ESPLORA - Link tradotti */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">
              {footer.explore}
            </h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li>
                <Link href={`/${locale}/i-nostri-gatti`} className="hover:text-gold-200 transition-colors">
                  {nav.cats}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/consigli`} className="hover:text-gold-200 transition-colors">
                  {nav.advice}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contatti`} className="hover:text-gold-200 transition-colors">
                  {nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTATTI */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">
              {footer.contacts}
            </h4>
            <ul className="text-sm text-slate-500 space-y-2 font-light">
              <li className="flex items-center gap-2"><SocialIcon kind="pin" /><span>{footer.location}</span></li>
              <li>
                <a className="inline-flex items-center gap-2 hover:text-slate-900" href={`mailto:${breeder?.email || 'Imperial-line-siberians@hotmail.com'}`}>
                  <SocialIcon kind="email" />
                  <span>{breeder?.email || 'Imperial-line-siberians@hotmail.com'}</span>
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 hover:text-slate-900" href={`tel:${(breeder?.phone || '+49 17660923988').replace(/\s+/g, '')}`}>
                  <SocialIcon kind="phone" />
                  <span>{breeder?.phone || '+49 17660923988'}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">
              {footer.socialTitle || 'Social'}
            </h4>
            <ul className="text-sm text-slate-500 space-y-2 font-light">
              <li>
                <a href={breeder?.instagramUrl || 'https://instagram.com/imperial_line_siberians'} className="inline-flex items-center gap-2 hover:text-slate-900 transition-colors" target="_blank" rel="noreferrer">
                  <SocialIcon kind="instagram" />
                  <span>{breeder?.instagramHandle || 'imperial_line_siberians'}</span>
                </a>
              </li>
              <li>
                <a href={breeder?.tiktokUrl || 'https://tiktok.com/@Imperial_line_siberians'} className="inline-flex items-center gap-2 hover:text-slate-900 transition-colors" target="_blank" rel="noreferrer">
                  <SocialIcon kind="tiktok" />
                  <span>{breeder?.tiktokHandle || '@Imperial_line_siberians'}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} Imperial Line - {footer.rights}</p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-slate-900 transition-colors">{footer.privacy}</Link>
            <Link href={`/${locale}/cookies`} className="hover:text-slate-900 transition-colors">{footer.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}