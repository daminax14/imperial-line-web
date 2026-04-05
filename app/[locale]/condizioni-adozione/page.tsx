import { getDictionary } from '@/lib/get-dictionary'

type AdoptionSection = {
  title: string
  paragraphs: string[]
  points: string[]
}

function normalizeSections(raw: unknown): AdoptionSection[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : ''
      const paragraphs = Array.isArray(item?.paragraphs)
        ? item.paragraphs.filter((p: unknown) => typeof p === 'string' && p.trim().length > 0)
        : []
      const points = Array.isArray(item?.points)
        ? item.points.filter((p: unknown) => typeof p === 'string' && p.trim().length > 0)
        : []

      return { title, paragraphs, points }
    })
    .filter((section) => section.title.length > 0)
}

export default async function AdoptionConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  const pageData = dict?.adoptionPage || {}
  const title = typeof pageData.title === 'string' ? pageData.title : "Condizioni per l'adozione"
  const intro = typeof pageData.intro === 'string' ? pageData.intro : ''
  const sections = normalizeSections(pageData.sections)

  return (
    <main className="bg-[#c2c8d4] min-h-screen pt-[120px] pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif italic text-[#2f6f99]">{title}</h1>
          {intro && <p className="text-[#2f5f86] mt-3 leading-relaxed">{intro}</p>}
        </header>

        {sections.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-sm text-slate-700">
            Contenuti in aggiornamento.
          </section>
        ) : (
          <section className="rounded-2xl p-2 md:p-4">
            <ul className="list-disc pl-6 space-y-6 marker:text-[#2f6f99]">
              {sections.map((section) => (
                <li key={section.title} className="text-[#1f2f43]">
                  <h2 className="font-bold text-xl md:text-2xl text-[#203a59]">{section.title}</h2>

                  {section.paragraphs.length > 0 && (
                    <ul className="list-disc pl-6 mt-2 space-y-1 marker:text-[#2f6f99]/80">
                      {section.paragraphs.map((paragraph) => (
                        <li key={paragraph} className="leading-relaxed">{paragraph}</li>
                      ))}
                    </ul>
                  )}

                  {section.points.length > 0 && (
                    <ul className="list-disc pl-6 mt-2 space-y-1 marker:text-[#2f6f99]/80">
                      {section.points.map((point) => (
                        <li key={point} className="leading-relaxed">{point}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
