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

                      {cat.slug && (
                        <Link
                          href={`/${locale}/cat/${cat.slug}`}
                          className="inline-block mt-5 bg-[#2f6f99] text-white py-2 px-8 rounded-full font-bold transition-all uppercase tracking-widest text-[10px] hover:bg-[#255b7d]"
                        >
                          Pedigree
                        </Link>
                      )}

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
                      <h3 className="text-5xl font-serif italic text-[#2f6f99] text-center">Genitori:</h3>

                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                        <div className="flex items-start gap-4">
                          {cat.mother?.image ? (
                            <img
                              src={urlFor(cat.mother.image).width(500).url()}
                              className="w-44 h-52 object-cover rounded-sm shadow-sm"
                              alt={cat.mother?.name || 'Madre'}
                            />
                          ) : (
                            <div className="w-44 h-52 rounded-sm bg-white/50 border border-white/60 flex items-center justify-center text-xs text-[#2f5f86]/70">
                              Immagine madre
                            </div>
                          )}
                          <div className="pt-2">
                            <p className="font-serif italic text-4xl leading-[1.1] text-[#2f6f99]">{cat.mother?.name || 'Madre'}</p>
                            <p className="mt-4 text-sm text-[#2f5f86]">{cat.mother?.color || '(dati colore)'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 md:flex-row-reverse md:text-right">
                          {cat.father?.image ? (
                            <img
                              src={urlFor(cat.father.image).width(500).url()}
                              className="w-44 h-52 object-cover rounded-sm shadow-sm"
                              alt={cat.father?.name || 'Padre'}
                            />
                          ) : (
                            <div className="w-44 h-52 rounded-sm bg-white/50 border border-white/60 flex items-center justify-center text-xs text-[#2f5f86]/70">
                              Immagine padre
                            </div>
                          )}
                          <div className="pt-2">
                            <p className="font-serif italic text-4xl leading-[1.1] text-[#2f6f99]">{cat.father?.name || 'Padre'}</p>
                            <p className="mt-4 text-sm text-[#2f5f86]">{cat.father?.color || '(dati colore)'}</p>
                          </div>
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
