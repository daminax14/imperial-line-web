import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import Footer from '@/components/Footer'

type AboutSection = {
  id: string
  title: string
  content: string
  image?: string
}

function normalizeSections(raw: unknown): AboutSection[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item, index) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : ''
      const content = typeof item?.content === 'string' ? item.content.trim() : ''
      const image = typeof item?.image === 'string' ? item.image.trim() : ''
      const id = typeof item?.id === 'string' ? item.id.trim() : `about-${index + 1}`
      return {
        id,
        title,
        content,
        image: image || undefined,
      }
    })
    .filter((section) => section.title.length > 0 && section.content.length > 0)
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const about = (dict as any)?.aboutPage || {}
  const sections = normalizeSections(about?.sections)

  return (
    <>
      <main className="relative min-h-screen bg-[#edf3fb] pt-[120px] pb-24 overflow-hidden">
        <CatsEtherealBackground />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <header className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.34em] text-[#2f6f99]/75 font-semibold mb-2">
              Imperial Line
            </p>
            <h1 className="text-4xl md:text-6xl font-serif italic text-[#1f3c57]">
              {about?.title || 'Su di noi'}
            </h1>
            <p className="max-w-3xl mx-auto mt-5 text-[#3a5570] leading-relaxed">
              {about?.intro || 'Scopri la nostra visione, il nostro lavoro quotidiano e i valori che guidano ogni scelta del nostro allevamento.'}
            </p>
          </header>

          <section className="space-y-4">
            {sections.map((section) => (
              <details key={section.id} className="group rounded-3xl border border-white/75 bg-white/75 backdrop-blur-sm shadow-[0_16px_40px_-30px_rgba(32,72,112,0.45)] overflow-hidden" open={section.id === sections[0]?.id}>
                <summary className="list-none cursor-pointer px-6 md:px-8 py-5 flex items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-[#1f3c57] leading-tight">{section.title}</h2>
                  <span className="w-8 h-8 rounded-full border border-[#2f6f99]/25 text-[#2f6f99] flex items-center justify-center text-lg transition-transform group-open:rotate-45">+</span>
                </summary>

                <div className="px-6 md:px-8 pb-7 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start border-t border-white/70">
                  <p className="text-[#3a5570] leading-relaxed whitespace-pre-line pt-6">{section.content}</p>

                  {section.image ? (
                    <div className="pt-6">
                      <div className="rounded-2xl border border-[#2f6f99]/25 bg-white/20 backdrop-blur-md p-2.5 shadow-[0_18px_35px_-28px_rgba(32,72,112,0.45)]">
                        <img src={section.image} alt={section.title} className="w-full rounded-xl object-cover aspect-[4/3]" />
                      </div>
                    </div>
                  ) : null}
                </div>
              </details>
            ))}

            {sections.length === 0 && (
              <div className="rounded-2xl border border-white/70 bg-white/75 p-8 text-[#3a5570] text-center">
                Contenuti in aggiornamento.
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer dict={dict} locale={locale} />
    </>
  )
}
