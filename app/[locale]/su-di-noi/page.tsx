import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import { client, urlFor } from '@/lib/sanity'
import RichTextContent from '@/components/RichTextContent'

type AboutSection = {
  id: string
  title: string
  content: unknown
  image?: string
  imageBottom?: string
}

async function getAboutSections(locale: string): Promise<AboutSection[]> {
  const safeLocale = ['it', 'en', 'de', 'fr'].includes(locale) ? locale : 'it'

  const query = `*[_type == "aboutSection" && isVisible != false] | order(order asc) {
    _id,
    "title": coalesce(title.${safeLocale}, title.it, ""),
    "content": coalesce(content.${safeLocale}, content.it, []),
    image,
    imageBottom
  }`

  const rows = await client.fetch(query)
  if (!Array.isArray(rows)) return []

  return rows.map((row, index) => ({
    id: typeof row?._id === 'string' && row._id.trim().length > 0 ? row._id : `about-${index + 1}`,
    title: typeof row?.title === 'string' ? row.title : '',
    content: row?.content,
    image: row?.image ? urlFor(row.image).width(1200).height(900).fit('crop').url() : undefined,
    imageBottom: row?.imageBottom ? urlFor(row.imageBottom).width(1200).height(900).fit('crop').url() : undefined,
  }))
}

function normalizeSections(raw: unknown): AboutSection[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item, index) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : ''
      const content = item?.content
      const image = typeof item?.image === 'string' ? item.image.trim() : ''
      const imageBottom = typeof item?.imageBottom === 'string' ? item.imageBottom.trim() : ''
      const id = typeof item?.id === 'string' ? item.id.trim() : `about-${index + 1}`
      return {
        id,
        title,
        content,
        image: image || undefined,
        imageBottom: imageBottom || undefined,
      }
    })
    .filter((section) => {
      if (section.title.length === 0) return false
      if (typeof section.content === 'string') return section.content.trim().length > 0
      if (Array.isArray(section.content)) return section.content.length > 0
      return false
    })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const about = (dict as any)?.aboutPage || {}
  const cmsSections = await getAboutSections(locale)
  const sections = cmsSections.length > 0 ? normalizeSections(cmsSections) : normalizeSections(about?.sections)

  return (
    <main className="relative min-h-screen bg-[#edf3fb] pt-[156px] pb-24 overflow-hidden">
      <CatsEtherealBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <header className="mb-12 text-center">
          
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#1f3c57]">
            {about?.title || 'About us'}
          </h1>
          <p className="max-w-3xl mx-auto mt-5 text-[#3a5570] leading-relaxed">
            {about?.intro || 'Discover our vision, our daily work, and the values that guide every choice in our cattery.'}
          </p>
        </header>

        <section className="space-y-4">
          {sections.map((section) => (
            <details key={section.id} className="group rounded-3xl border border-white/75 bg-white/75 backdrop-blur-sm shadow-[0_16px_40px_-30px_rgba(32,72,112,0.45)] overflow-hidden">
              <summary className="list-none cursor-pointer px-6 md:px-8 py-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-serif text-[#1f3c57] leading-tight">{section.title}</h2>
                <span className="w-8 h-8 rounded-full border border-[#2f6f99]/25 text-[#2f6f99] flex items-center justify-center text-lg transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="px-6 md:px-8 pb-7 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start lg:items-stretch border-t border-white/70">
                <RichTextContent value={section.content} className="text-[#3a5570] leading-relaxed pt-6" />

                {(section.image || section.imageBottom) ? (
                  <div className={`pt-6 lg:pt-4 w-full lg:w-[92%] lg:justify-self-end ${section.image && section.imageBottom ? 'lg:self-stretch' : 'lg:self-center'}`}>
                    {section.image && section.imageBottom ? (
                      <div className="flex h-full min-h-[560px] flex-col justify-between gap-4 py-4">
                        <div className="rounded-2xl border border-[#2f6f99]/25 bg-white/20 backdrop-blur-md p-2.5 shadow-[0_18px_35px_-28px_rgba(32,72,112,0.45)] lg:translate-y-60">
                          <img src={section.image} alt={section.title} className="w-full rounded-xl object-cover aspect-[4/3]" />
                        </div>
                        <div className="rounded-2xl border border-[#2f6f99]/25 bg-white/20 backdrop-blur-md p-2.5 shadow-[0_18px_35px_-28px_rgba(32,72,112,0.45)] lg:-translate-y-60">
                          <img src={section.imageBottom} alt={`${section.title} second image`} className="w-full rounded-xl object-cover aspect-[4/3]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col justify-center">
                        {section.image ? (
                          <div className="rounded-2xl border border-[#2f6f99]/25 bg-white/20 backdrop-blur-md p-2.5 shadow-[0_18px_35px_-28px_rgba(32,72,112,0.45)]">
                            <img src={section.image} alt={section.title} className="w-full rounded-xl object-cover aspect-[4/3]" />
                          </div>
                        ) : null}
                        {section.imageBottom ? (
                          <div className="rounded-2xl border border-[#2f6f99]/25 bg-white/20 backdrop-blur-md p-2.5 shadow-[0_18px_35px_-28px_rgba(32,72,112,0.45)]">
                            <img src={section.imageBottom} alt={`${section.title} second image`} className="w-full rounded-xl object-cover aspect-[4/3]" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </details>
          ))}

          {sections.length === 0 && (
            <div className="rounded-2xl border border-white/70 bg-white/75 p-8 text-[#3a5570] text-center">
              {about?.emptyState || 'Content is being updated.'}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
