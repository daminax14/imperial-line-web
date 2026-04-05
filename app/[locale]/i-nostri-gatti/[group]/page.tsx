import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { getDictionary, isSupportedLocale } from '@/lib/get-dictionary'

type CatItem = {
  _id: string
  name: string
  slug?: string
  image?: any
  category?: string
  description?: string
  color?: string
  birthDate?: string
  health?: string
  breed?: string
  sex?: string
  emsCode?: string
  status?: string
  pedigreeUrl?: string
  father?: {
    name?: string
    image?: any
    color?: string
  }
  mother?: {
    name?: string
    image?: any
    color?: string
  }
}

type GroupView = 'moon' | 'queen'

function normalizeGroup(value: string): GroupView | null {
  const normalized = value.toLowerCase()
  if (normalized === 'moon' || normalized === 'king' || normalized === 'male' || normalized === 'maschi') return 'moon'
  if (normalized === 'queen' || normalized === 'female' || normalized === 'femmine') return 'queen'
  return null
}

function isMoon(cat: CatItem): boolean {
  const source = `${cat.category || ''} ${cat.sex || ''}`.toLowerCase()
  return ['moon', 'king', 'male', 'maschio', 'maschi'].some((token) => source.includes(token))
}

function isQueen(cat: CatItem): boolean {
  const source = `${cat.category || ''} ${cat.sex || ''}`.toLowerCase()
  return ['queen', 'female', 'femmina', 'femmine'].some((token) => source.includes(token))
}

async function getCats(locale: string): Promise<CatItem[]> {
  const query = `*[_type == "cat"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    category,
    "description": coalesce(description[${locale}], description.it),
    "color": coalesce(color[${locale}], color.it),
    birthDate,
    health,
    breed,
    sex,
    emsCode,
    status,
    pedigreeUrl,
    father->{
      name,
      image,
      "color": coalesce(color[${locale}], color.it)
    },
    mother->{
      name,
      image,
      "color": coalesce(color[${locale}], color.it)
    }
  }`

  const data = await client.fetch(query)
  return Array.isArray(data) ? data : []
}

export default async function CatsGroupPage({
  params,
}: {
  params: Promise<{ locale: string; group: string }>
}) {
  const { locale, group } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const normalizedGroup = normalizeGroup(group)
  if (!normalizedGroup) {
    notFound()
  }

  const dict = await getDictionary(locale)
  const cats = await getCats(locale)

  const filteredCats = cats.filter((cat) => (normalizedGroup === 'moon' ? isMoon(cat) : isQueen(cat)))
  const sectionTitle = normalizedGroup === 'moon' ? 'Moon' : 'Queen'
  const sectionSubtitle = normalizedGroup === 'moon' ? 'Maschi' : 'Femmine'

  return (
    <main className="bg-[#b7bfcc] min-h-screen pt-[120px] pb-24 text-[#2f5f86]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#2f5f86]/70 font-semibold">{sectionSubtitle}</p>
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#2f5f86] mt-2">{sectionTitle}</h1>
          </div>

          <div className="inline-flex rounded-full bg-white/70 border border-white/50 p-1 shadow-sm">
            <Link
              href={`/${locale}/i-nostri-gatti/moon`}
              className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-bold rounded-full transition-colors ${
                normalizedGroup === 'moon' ? 'bg-[#2f5f86] text-white' : 'text-[#2f5f86]/70 hover:text-[#2f5f86]'
              }`}
            >
              Moon
            </Link>
            <Link
              href={`/${locale}/i-nostri-gatti/queen`}
              className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-bold rounded-full transition-colors ${
                normalizedGroup === 'queen' ? 'bg-[#2f5f86] text-white' : 'text-[#2f5f86]/70 hover:text-[#2f5f86]'
              }`}
            >
              Queen
            </Link>
          </div>
        </div>

        {filteredCats.length === 0 ? (
          <section className="rounded-[2rem] border border-white/60 bg-white/40 p-10 text-center shadow-sm">
            <h2 className="text-2xl font-serif text-[#2f5f86]">Nessun soggetto disponibile</h2>
            <p className="text-[#2f5f86]/80 mt-3">I contenuti per questa sezione saranno pubblicati a breve.</p>
          </section>
        ) : (
          <div className="space-y-20">
            {filteredCats.map((cat) => {
              return (
                <article key={cat._id} className="pt-4 first:pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="order-2 md:order-1">
                      <h2 className="text-5xl md:text-6xl font-serif italic leading-[0.95] text-[#2f6f99]">{cat.name}</h2>
                      <p className="text-3xl md:text-4xl mt-4 font-serif text-[#2f6f99]">{cat.color || 'Siberian Neva Masquerade'}</p>

                      {cat.pedigreeUrl ? (
                        <a
                          href={cat.pedigreeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-5 bg-[#2f6f99] text-white py-2 px-8 rounded-full font-bold transition-all uppercase tracking-widest text-[10px] hover:bg-[#255b7d]"
                        >
                          Pedigree ↗
                        </a>
                      ) : cat.slug ? (
                        <Link
                          href={`/${locale}/cat/${cat.slug}`}
                          className="inline-block mt-5 bg-[#2f6f99] text-white py-2 px-8 rounded-full font-bold transition-all uppercase tracking-widest text-[10px] hover:bg-[#255b7d]"
                        >
                          Scheda completa
                        </Link>
                      ) : null}

                      <div className="mt-7 space-y-3 text-sm text-[#2f5f86]">
                        <p>
                          <span className="font-semibold">{dict.catPage.birth}:</span> {cat.birthDate || '(data)'}
                        </p>
                        <p>
                          <span className="font-semibold">{dict.catPage.health}:</span> {cat.health || '(data)'}
                        </p>
                        <p>
                          <span className="font-semibold">Fiv:</span> (data)
                        </p>
                        <p>
                          <span className="font-semibold">Felv:</span> (data)
                        </p>
                        <p>
                          <span className="font-semibold">Hcm:</span> (data)
                        </p>
                        <p>
                          <span className="font-semibold">Pkd:</span> (data)
                        </p>
                        <p>
                          <span className="font-semibold">Gruppo sanguigno:</span> (data)
                        </p>
                        <p>
                          <span className="font-semibold">Risultati show:</span> (data)
                        </p>
                      </div>

                      {cat.description && (
                        <p className="mt-6 text-sm text-[#2f5f86]/85 leading-relaxed max-w-xl">{cat.description}</p>
                      )}
                    </div>

                    <div className="order-1 md:order-2">
                      {cat.image ? (
                        <img
                          src={urlFor(cat.image).width(1200).url()}
                          className="rounded-2xl w-full object-cover aspect-[4/5] shadow-md"
                          alt={cat.name}
                        />
                      ) : (
                        <div className="rounded-2xl border border-white/60 bg-white/50 w-full aspect-[4/5] flex items-center justify-center text-[#2f5f86]/70">
                          Immagine non disponibile
                        </div>
                      )}
                    </div>
                  </div>

                  {(cat.father || cat.mother) && (
                    <section className="mt-14">
                      <h3 className="text-3xl font-serif italic text-[#2f6f99] text-center mb-10">Albero genealogico</h3>

                      {/* Tree layout: parents on top, current cat at bottom with connecting arrows */}
                      <div className="flex flex-col items-center gap-0">

                        {/* Parents row */}
                        <div className="flex items-end justify-center gap-10 md:gap-28 w-full">
                          {cat.mother && (
                            <div className="flex flex-col items-center gap-3">
                              <p className="text-[10px] uppercase tracking-widest text-[#2f6f99]/60 font-bold">Madre</p>
                              {cat.mother.image ? (
                                <img
                                  src={urlFor(cat.mother.image).width(300).url()}
                                  className="w-28 h-32 md:w-36 md:h-40 object-cover rounded-xl shadow-md"
                                  alt={cat.mother?.name || 'Madre'}
                                />
                              ) : (
                                <div className="w-28 h-32 md:w-36 md:h-40 rounded-xl bg-white/50 border border-white/60 flex items-center justify-center text-xs text-[#2f5f86]/70">
                                  Madre
                                </div>
                              )}
                              <p className="font-serif italic text-xl text-[#2f6f99] text-center">{cat.mother?.name || 'Madre'}</p>
                              {cat.mother.color && (
                                <p className="text-xs text-[#2f5f86]/70 text-center">{cat.mother.color}</p>
                              )}
                            </div>
                          )}

                          {cat.father && (
                            <div className="flex flex-col items-center gap-3">
                              <p className="text-[10px] uppercase tracking-widest text-[#2f6f99]/60 font-bold">Padre</p>
                              {cat.father.image ? (
                                <img
                                  src={urlFor(cat.father.image).width(300).url()}
                                  className="w-28 h-32 md:w-36 md:h-40 object-cover rounded-xl shadow-md"
                                  alt={cat.father?.name || 'Padre'}
                                />
                              ) : (
                                <div className="w-28 h-32 md:w-36 md:h-40 rounded-xl bg-white/50 border border-white/60 flex items-center justify-center text-xs text-[#2f5f86]/70">
                                  Padre
                                </div>
                              )}
                              <p className="font-serif italic text-xl text-[#2f6f99] text-center">{cat.father?.name || 'Padre'}</p>
                              {cat.father.color && (
                                <p className="text-xs text-[#2f5f86]/70 text-center">{cat.father.color}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Connector lines + arrow — uses CSS borders, no magic offsets */}
                        {cat.mother || cat.father ? (
                          <div className="flex justify-center w-full">
                            {cat.mother && cat.father ? (
                              /* Both parents: T-shape using borders */
                              <div className="flex">
                                <div className="w-16 border-b border-r border-[#2f6f99]/40 h-6" />
                                <div className="w-16 border-b border-l border-[#2f6f99]/40 h-6" />
                              </div>
                            ) : (
                              /* Single parent: vertical line */
                              <div className="w-px h-6 bg-[#2f6f99]/40" />
                            )}
                          </div>
                        ) : null}
                        {(cat.mother || cat.father) && (
                          <div className="flex flex-col items-center">
                            <div className="w-px h-6 bg-[#2f6f99]/40" />
                            <div className="text-[#2f6f99]/60 text-lg leading-none">▼</div>
                          </div>
                        )}

                        {/* Current cat */}
                        <div className="flex flex-col items-center gap-3 mt-1">
                          {cat.image ? (
                            <img
                              src={urlFor(cat.image).width(300).url()}
                              className="w-28 h-32 md:w-36 md:h-40 object-cover rounded-xl shadow-lg border-2 border-[#2f6f99]/30"
                              alt={cat.name}
                            />
                          ) : (
                            <div className="w-28 h-32 md:w-36 md:h-40 rounded-xl bg-white/50 border-2 border-[#2f6f99]/30 flex items-center justify-center text-xs text-[#2f5f86]/70">
                              {cat.name}
                            </div>
                          )}
                          <p className="font-serif italic text-2xl text-[#2f6f99] font-semibold text-center">{cat.name}</p>
                        </div>
                      </div>
                    </section>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
