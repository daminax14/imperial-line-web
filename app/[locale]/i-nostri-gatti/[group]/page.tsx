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

type GroupView = 'king' | 'queen'

function normalizeGroup(value: string): GroupView | null {
  const normalized = value.toLowerCase()
  if (normalized === 'king' || normalized === 'male' || normalized === 'maschi') return 'king'
  if (normalized === 'queen' || normalized === 'female' || normalized === 'femmine') return 'queen'
  return null
}

function isKing(cat: CatItem): boolean {
  const source = `${cat.category || ''} ${cat.sex || ''}`.toLowerCase()
  return ['king', 'male', 'maschio', 'maschi'].some((token) => source.includes(token))
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

  const filteredCats = cats.filter((cat) => (normalizedGroup === 'king' ? isKing(cat) : isQueen(cat)))
  const sectionTitle = normalizedGroup === 'king' ? 'King' : 'Queen'
  const sectionSubtitle = normalizedGroup === 'king' ? 'Maschi' : 'Femmine'

  return (
    <main className="bg-[#FAFAFA] min-h-screen pt-32 pb-32 text-zinc-900 font-sans selection:bg-zinc-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* HEADER SEZIONE */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-24 pb-8 border-b border-zinc-200">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium mb-4">{sectionSubtitle}</p>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-zinc-900">{sectionTitle}</h1>
          </div>

          {/* TOGGLE MODERNO */}
          <div className="inline-flex rounded-full bg-zinc-100 p-1.5 shadow-inner">
            <Link
              href={`/${locale}/i-nostri-gatti/king`}
              className={`px-8 py-3 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all duration-300 ${
                normalizedGroup === 'king' 
                  ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.05)]' 
                  : 'text-zinc-400 hover:text-black'
              }`}
            >
              King
            </Link>
            <Link
              href={`/${locale}/i-nostri-gatti/queen`}
              className={`px-8 py-3 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all duration-300 ${
                normalizedGroup === 'queen' 
                  ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.05)]' 
                  : 'text-zinc-400 hover:text-black'
              }`}
            >
              Queen
            </Link>
          </div>
        </div>

        {/* LISTA GATTI */}
        {filteredCats.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-32 text-center">
            <h2 className="text-3xl font-serif font-light text-zinc-400">Nessun soggetto disponibile</h2>
            <p className="text-zinc-400 mt-4 text-sm tracking-wide">I contenuti per questa sezione saranno pubblicati a breve.</p>
          </section>
        ) : (
          <div className="space-y-32 md:space-y-48">
            {filteredCats.map((cat, index) => {
              // Alterna l'ordine dell'immagine su desktop per un look editoriale dinamico
              const isEven = index % 2 === 0

              return (
                <article key={cat._id} className="group">
                  <div className={`grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-24 items-center`}>
                    
                    {/* COLONNA IMMAGINE */}
                    <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative overflow-hidden rounded-2xl bg-zinc-100 aspect-[3/4]">
                        {cat.image ? (
                          <img
                            src={urlFor(cat.image).width(1200).url()}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={cat.name}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-400">
                            Immagine non disponibile
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COLONNA CONTENUTO */}
                    <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center`}>
                      <h2 className="text-5xl md:text-6xl font-serif font-light text-black mb-4">{cat.name}</h2>
                      <p className="text-sm md:text-base font-medium tracking-widest uppercase text-zinc-500 mb-10">
                        {cat.color || 'Siberian Neva Masquerade'}
                      </p>

                      {cat.description && (
                        <p className="text-zinc-600 leading-relaxed font-light mb-10 text-justify">
                          {cat.description}
                        </p>
                      )}

                      {/* GRIGLIA SPECIFICHE (Stile Minimal/Tech) */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 border-y border-zinc-200 py-8 mb-10">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">{dict.catPage.birth || 'Nascita'}</p>
                          <p className="text-sm font-medium text-zinc-800">{cat.birthDate || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">{dict.catPage.health || 'Salute'}</p>
                          <p className="text-sm font-medium text-zinc-800">{cat.health || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">FIV</p>
                          <p className="text-sm font-medium text-zinc-800">(data)</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">FELV</p>
                          <p className="text-sm font-medium text-zinc-800">(data)</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">HCM</p>
                          <p className="text-sm font-medium text-zinc-800">(data)</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">PKD</p>
                          <p className="text-sm font-medium text-zinc-800">(data)</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Gruppo Sanguigno</p>
                          <p className="text-sm font-medium text-zinc-800">(data)</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Risultati Show</p>
                          <p className="text-sm font-medium text-zinc-800">(data)</p>
                        </div>
                      </div>

                      {/* BOTTONI AZIONE */}
                      <div className="flex flex-wrap gap-4">
                        {cat.pedigreeUrl && (
                          <a
                            href={cat.pedigreeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium px-8 py-3.5 rounded-full hover:bg-zinc-800 transition-all"
                          >
                            Pedigree ↗
                          </a>
                        )}
                        {cat.slug && (
                          <Link
                            href={`/${locale}/cat/${cat.slug}`}
                            className="border border-zinc-300 text-black text-[10px] uppercase tracking-[0.2em] font-medium px-8 py-3.5 rounded-full hover:border-black transition-all"
                          >
                            Scheda completa
                          </Link>
                        )}
                      </div>

                      {/* ALBERO GENEALOGICO MINIMAL */}
                      {(cat.father || cat.mother) && (
                        <div className="mt-16 pt-10 border-t border-zinc-100">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-medium mb-8 text-center md:text-left">
                            Lineage
                          </p>
                          <div className="flex items-center justify-center md:justify-start gap-12">
                            {cat.mother && (
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                                  {cat.mother.image ? (
                                    <img src={urlFor(cat.mother.image).width(150).url()} className="w-full h-full object-cover" alt={cat.mother.name} />
                                  ) : (
                                    <span className="flex items-center justify-center w-full h-full text-[8px] uppercase tracking-widest text-zinc-400">Img</span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Madre</p>
                                  <p className="font-serif text-zinc-900">{cat.mother.name || 'Sconosciuta'}</p>
                                </div>
                              </div>
                            )}

                            {cat.mother && cat.father && (
                              <div className="w-px h-10 bg-zinc-200 mt-[-20px]"></div>
                            )}

                            {cat.father && (
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                                  {cat.father.image ? (
                                    <img src={urlFor(cat.father.image).width(150).url()} className="w-full h-full object-cover" alt={cat.father.name} />
                                  ) : (
                                    <span className="flex items-center justify-center w-full h-full text-[8px] uppercase tracking-widest text-zinc-400">Img</span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Padre</p>
                                  <p className="font-serif text-zinc-900">{cat.father.name || 'Sconosciuto'}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}