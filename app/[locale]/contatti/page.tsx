import Link from 'next/link'
import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import ContactRequestForm from '@/components/ContactRequestForm'

function SocialIcon({ kind }: { kind: 'instagram' | 'tiktok' | 'email' | 'phone' }) {
  const cls = 'w-5 h-5 text-[#2f6f99] flex-shrink-0'
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
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.6a2 2 0 0 1-.4 2L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2-.4c.9.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  )
}

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const contact = dict?.contactPage || {}
  const fields = contact?.fields || {}
  const options = contact?.options || {}
  const breeder = dict?.breederContacts || {}

  return (
    <main className="relative min-h-screen pt-[156px] pb-24 overflow-hidden bg-[#edf3fb]">
      <CatsEtherealBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <section className="text-center mb-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#2f6f99] font-semibold">Imperial Line</p>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#2f6f99]">{contact?.title || 'Reservation'}</h1>
        </section>

        <section className="max-w-4xl mx-auto rounded-[1.6rem] border border-white/55 bg-white/45 backdrop-blur-md shadow-[0_20px_45px_-30px_rgba(32,72,112,0.45)] p-6 md:p-8 mb-10 space-y-4">
          <p className="text-[#2f5f86] leading-relaxed text-sm md:text-base">
            {contact?.introLead || 'Fill in your details so we can help match the right kitten to your family.'}
          </p>
          <p className="text-[#2f5f86] leading-relaxed text-sm md:text-base">
            {contact?.introConditions || 'Please read our adoption conditions before submitting the form.'}
          </p>
          <Link
            href={`/${locale}/condizioni-adozione`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors"
          >
            <span>{contact?.conditionsCta || 'Go to adoption conditions'}</span>
            <span>→</span>
          </Link>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.08fr,0.92fr] gap-8 items-start">
          <div className="rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-md shadow-[0_24px_60px_-35px_rgba(32,72,112,0.5)] p-5 md:p-7">
            <ContactRequestForm fields={fields} options={options} contact={contact} locale={locale} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/50 bg-white/35 backdrop-blur-md shadow-[0_18px_36px_-28px_rgba(32,72,112,0.45)] p-5">
              <p className="text-[#2f5f86] text-sm leading-relaxed">
                {contact?.afterFormNote || 'Thank you for your interest. We will contact you as soon as possible after your request is submitted.'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/50 bg-white/35 backdrop-blur-md shadow-[0_18px_36px_-28px_rgba(32,72,112,0.45)] p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#2f6f99]/80 font-semibold mb-4">
                    {contact?.socialTitle || 'Follow us on social media'}
                  </p>
                  <div className="space-y-3.5 text-[#2f5f86]">
                    <a
                      href={breeder?.tiktokUrl || 'https://tiktok.com/@Imperial_line_siberians'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 hover:text-[#1a4f72] transition-colors"
                    >
                      <SocialIcon kind="tiktok" />
                      <span className="text-sm">{breeder?.tiktokHandle || '@Imperial_line_siberians'}</span>
                    </a>
                    <a
                      href={breeder?.instagramUrl || 'https://instagram.com/imperial_line_siberians'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 hover:text-[#1a4f72] transition-colors"
                    >
                      <SocialIcon kind="instagram" />
                      <span className="text-sm">{breeder?.instagramHandle || 'imperial_line_siberians'}</span>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#2f6f99]/80 font-semibold mb-4">
                    {dict?.footer?.contacts || 'Contacts'}
                  </p>
                  <div className="space-y-3.5 text-[#2f5f86]">
                    <a
                      href={`mailto:${breeder?.email || 'Imperial-line-siberians@hotmail.com'}`}
                      className="flex items-center gap-2.5 hover:text-[#1a4f72] transition-colors break-all"
                    >
                      <SocialIcon kind="email" />
                      <span className="text-sm">{breeder?.email || 'Imperial-line-siberians@hotmail.com'}</span>
                    </a>
                    <a
                      href={`tel:${(breeder?.phone || '+49 17660923988').replace(/\s+/g, '')}`}
                      className="flex items-center gap-2.5 hover:text-[#1a4f72] transition-colors"
                    >
                      <SocialIcon kind="phone" />
                      <span className="text-sm">{breeder?.phone || '+49 17660923988'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
