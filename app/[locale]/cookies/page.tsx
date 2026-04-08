import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'

type PolicySection = {
  title: string
  paragraphs: string[]
}

function normalizeSections(raw: unknown): PolicySection[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : ''
      const paragraphs = Array.isArray(item?.paragraphs)
        ? item.paragraphs.filter((p: unknown) => typeof p === 'string' && p.trim().length > 0)
        : []
      return { title, paragraphs }
    })
    .filter((section) => section.title.length > 0)
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const legal = (dict as any)?.legalTemplates || {}
  const pageData = legal?.cookies || {}

  const title = typeof pageData?.title === 'string' ? pageData.title : 'Cookie Policy'
  const lastUpdated = typeof pageData?.lastUpdated === 'string' ? pageData.lastUpdated : ''
  const intro = typeof pageData?.intro === 'string' ? pageData.intro : ''
  const sections = normalizeSections(pageData?.sections)
  const emptyState = typeof pageData?.emptyState === 'string' ? pageData.emptyState : 'Content is being updated.'

  return (
    <main className="relative bg-[#edf3fb] min-h-screen pt-40 pb-24 overflow-hidden">
      <CatsEtherealBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="rounded-[2rem] border border-[#c7d9eb] bg-[#f6fbff] p-6 md:p-10 shadow-[0_20px_45px_-30px_rgba(35,81,120,0.45)]">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#2f6f99]">{title}</h1>
            {lastUpdated && (
              <p className="text-sm text-[#2f5f86] mt-2">{lastUpdated}</p>
            )}
            {intro && <p className="text-[#2f5f86] mt-4 leading-relaxed">{intro}</p>}
          </header>

          {sections.length === 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-sm text-slate-700">
              {emptyState}
            </section>
          ) : (
            <section className="space-y-8">
              {sections.map((section) => (
                <article key={section.title} className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 md:p-6">
                  <h2 className="font-bold text-xl md:text-2xl text-[#203a59]">{section.title}</h2>
                  <div className="mt-3 space-y-3 text-[#1f2f43]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
