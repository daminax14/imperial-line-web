import Link from 'next/link'

export default function Footer({ dict, locale }: { dict: any, locale: string }) {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* LOGO & TAGLINE */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h3 className="text-xl font-serif text-slate-900">
              Imperial <span className="text-gold-200 italic">Line</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">
              {dict.tagline}
            </p>
          </div>

          {/* ESPLORA - Link tradotti */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">
              {dict.explore}
            </h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li>
                <Link href={`/${locale}/i-nostri-gatti`} className="hover:text-gold-200 transition-colors">
                  {dict.nav.cats}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/consigli`} className="hover:text-gold-200 transition-colors">
                  {dict.nav.advice}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contatti`} className="hover:text-gold-200 transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTATTI */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">
              {dict.contacts}
            </h4>
            <ul className="text-sm text-slate-500 space-y-2 font-light">
              <li>📍 {dict.location}</li>
              <li>📧 Imperial-line-siberians@hotmail.com</li>
              <li>📞 +49 17660923988</li>
            </ul>
          </div>

          {/* AFFILIAZIONI */}
          <div className="space-y-4 text-right">
             <div className="text-[10px] text-slate-300 uppercase tracking-tighter leading-loose">
                P.IVA: 1234567890 <br/>
                ANFI / FIFE MEMBER <br/>
                EST. 2026
             </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} Imperial Line - {dict.rights}</p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-slate-900 transition-colors">{dict.privacy}</Link>
            <Link href={`/${locale}/cookies`} className="hover:text-slate-900 transition-colors">{dict.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}