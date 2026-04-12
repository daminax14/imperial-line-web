import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'

export const metadata: Metadata = {
  title: 'Maintenance',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const maintenance = (dict as any)?.maintenancePage || {}
  const contactEmail = dict?.breederContacts?.email || 'Imperial-line-siberians@hotmail.com'

  return (
    <main className="relative min-h-screen pt-[176px] pb-24 overflow-hidden bg-[#edf3fb]">
      <CatsEtherealBackground />

      <section className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#2f6f99] font-semibold mb-4">Imperial Line</p>
        <h1 className="text-4xl md:text-6xl font-serif italic text-[#1f3c57]">{maintenance?.title || 'Site in manutenzione'}</h1>

        <p className="mt-6 text-[#3a5570] leading-relaxed text-base md:text-lg">
          {maintenance?.message || 'Stiamo effettuando un aggiornamento tecnico. Torneremo online il prima possibile.'}
        </p>

        <div className="mt-10 rounded-[1.8rem] border border-white/60 bg-white/75 backdrop-blur-sm shadow-[0_22px_48px_-30px_rgba(32,72,112,0.45)] p-6 md:p-8 text-left">
          <p className="text-sm uppercase tracking-[0.22em] text-[#2f6f99]/80 font-semibold mb-3">{maintenance?.contactLabel || 'Contatto rapido'}</p>
          <a
            href={`mailto:${contactEmail}`}
            className="text-[#1f3c57] font-semibold break-all hover:text-[#2f6f99] transition-colors"
          >
            {contactEmail}
          </a>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}`}
              className="gold-hover-button inline-flex items-center rounded-full border border-[#2f6f99]/25 bg-white px-5 py-2.5 text-sm font-semibold text-[#2f6f99]"
            >
              {maintenance?.retryButton || 'Riprova homepage'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
