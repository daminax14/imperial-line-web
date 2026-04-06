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
    <main className="relative min-h-screen pt-32 pb-32 text-zinc-900 font-sans selection:bg-zinc-300 overflow-hidden bg-[#edf3fb]">
      
      {/* SFONDO DINAMICO: mesh + forme morbide */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[radial-gradient(circle_at_20%_15%,#f9fcff_0%,#edf3fb_45%,#e6eef9_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(66,142,191,0.15)_0%,rgba(255,255,255,0)_35%,rgba(212,175,55,0.14)_100%)]"></div>

        {/* Grain leggero per evitare piattezza */}
        <div
          className="absolute inset-0 opacity-[0.22] mix-blend-overlay z-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        ></div>

        {/* Blob principali */}
        <div className="absolute -top-[16%] -left-[8%] w-[54vw] h-[54vw] rounded-[42%_58%_65%_35%/40%_42%_58%_60%] bg-[#72acd1]/50 blur-[95px] animate-[pulse_18s_ease-in-out_infinite]"></div>
        <div className="absolute top-[8%] right-[-16%] w-[58vw] h-[58vw] rounded-[60%_40%_45%_55%/53%_60%_40%_47%] bg-[#f0d37a]/40 blur-[110px] animate-[pulse_22s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-20%] left-[4%] w-[62vw] h-[62vw] rounded-[38%_62%_52%_48%/52%_44%_56%_48%] bg-[#5f8fbc]/36 blur-[115px] animate-[pulse_20s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-14%] right-[4%] w-[46vw] h-[46vw] rounded-[55%_45%_58%_42%/42%_62%_38%_58%] bg-[#d7b357]/34 blur-[90px] animate-[pulse_16s_ease-in-out_infinite]"></div>

        {/* Accenti morbidi "orb" */}
        <div className="absolute top-[28%] left-[18%] w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/55 blur-xl animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-[52%] right-[22%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#9ec4e3]/55 blur-lg animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[18%] left-[42%] w-20 h-20 rounded-full bg-[#f3df9d]/55 blur-lg animate-[pulse_12s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        
        {/* HEADER SEZIONE */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-24 pb-8 border-b border-zinc-200/60">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium mb-4">{sectionSubtitle}</p>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-zinc-900 drop-shadow-sm">{sectionTitle}</h1>
          </div>

          {/* TOGGLE MODERNO */}
          <div className="inline-flex rounded-full bg-white/60 backdrop-blur-md p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50">
            <Link
              href={`/${locale}/i-nostri-gatti/king`}
              className={`px-8 py-3 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all duration-300 ${
                normalizedGroup === 'king' 
                  ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.08)]' 
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              King
            </Link>
            <Link
              href={`/${locale}/i-nostri-gatti/queen`}
              className={`px-8 py-3 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all duration-300 ${
                normalizedGroup === 'queen' 
                  ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.08)]' 
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              Queen
            </Link>
          </div>
        </div>

        {/* LISTA GATTI */}
        {filteredCats.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-32 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm">
            <h2 className="text-3xl font-serif font-light text-zinc-500">Nessun soggetto disponibile</h2>
            <p className="text-zinc-500 mt-4 text-sm tracking-wide">I contenuti per questa sezione saranno pubblicati a breve.</p>
          </section>
        ) : (
          <div className="space-y-32 md:space-y-48">
            {filteredCats.map((cat, index) => {
              const isEven = index % 2 === 0

              return (
                <article key={cat._id} className="group">
                  <div className={`grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-24 items-center`}>
                    
                    {/* COLONNA IMMAGINE PRINCIPALE */}
                    <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative overflow-hidden rounded-2xl bg-white/50 border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] aspect-[3/4]">
                        {cat.image ? (
                          <img
                            src={urlFor(cat.image).width(1200).url()}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
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
                      <h2 className="text-5xl md:text-6xl font-serif font-light text-black mb-4 drop-shadow-sm">{cat.name}</h2>
                      <p className="text-sm md:text-base font-medium tracking-widest uppercase text-zinc-600 mb-10">
                        {cat.color || 'Siberian Neva Masquerade'}
                      </p>

                      {cat.description && (
                        <p className="text-zinc-700 leading-relaxed font-light mb-10 text-justify bg-white/30 p-6 rounded-2xl backdrop-blur-sm border border-white/40 shadow-sm">
                          {cat.description}
                        </p>
                      )}

                      {/* GRIGLIA SPECIFICHE */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 border-y border-zinc-200/60 py-8 mb-10 bg-white/20 backdrop-blur-sm px-4 rounded-xl">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{dict.catPage.birth || 'Nascita'}</p>
                          <p className="text-sm font-medium text-zinc-900">{cat.birthDate || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{dict.catPage.health || 'Salute'}</p>
                          <p className="text-sm font-medium text-zinc-900">{cat.health || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">FIV</p>
                          <p className="text-sm font-medium text-zinc-900">(data)</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">FELV</p>
                          <p className="text-sm font-medium text-zinc-900">(data)</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">HCM</p>
                          <p className="text-sm font-medium text-zinc-900">(data)</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">PKD</p>
                          <p className="text-sm font-medium text-zinc-900">(data)</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Gruppo Sanguigno</p>
                          <p className="text-sm font-medium text-zinc-900">(data)</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Risultati Show</p>
                          <p className="text-sm font-medium text-zinc-900">(data)</p>
                        </div>
                      </div>

                      {/* BOTTONI AZIONE */}
                      <div className="flex flex-wrap gap-4">
                        {cat.pedigreeUrl && (
                          <a
                            href={cat.pedigreeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-zinc-900 text-white text-[10px] uppercase tracking-[0.2em] font-medium px-8 py-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-zinc-700 hover:-translate-y-0.5 transition-all duration-300"
                          >
                            Pedigree ↗
                          </a>
                        )}
                        {cat.slug && (
                          <Link
                            href={`/${locale}/cat/${cat.slug}`}
                            className="bg-white/80 backdrop-blur-sm border border-zinc-200 text-zinc-900 text-[10px] uppercase tracking-[0.2em] font-medium px-8 py-3.5 rounded-full shadow-sm hover:border-zinc-400 hover:shadow-md transition-all duration-300"
                          >
                            Scheda completa
                          </Link>
                        )}
                      </div>

                      {/* ALBERO GENEALOGICO (GENITORI INGRANDITI) */}
                      {(cat.father || cat.mother) && (
                        <div className="mt-16 pt-10 border-t border-zinc-200/60">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-semibold mb-8 text-center md:text-left drop-shadow-sm">
                            Lineage / Linea di sangue
                          </p>
                          
                          <div className="flex items-center justify-center md:justify-start gap-8 md:gap-14">
                            
                            {/* MADRE */}
                            {cat.mother && (
                              <div className="flex flex-col items-center gap-4 group/parent">
                                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden bg-white border-[3px] border-white shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover/parent:scale-105 group-hover/parent:shadow-[0_12px_35px_rgba(0,0,0,0.15)]">
                                  {cat.mother.image ? (
                                    <img src={urlFor(cat.mother.image).width(400).url()} className="w-full h-full object-cover" alt={cat.mother.name} />
                                  ) : (
                                    <span className="flex items-center justify-center w-full h-full text-[9px] uppercase tracking-widest text-zinc-400 bg-zinc-50">Img</span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-1.5">Madre</p>
                                  <p className="font-serif text-lg md:text-xl text-zinc-900 leading-tight">{cat.mother.name || 'Sconosciuta'}</p>
                                </div>
                              </div>
                            )}

                            {/* LINEA DI CONGIUNZIONE */}
                            {cat.mother && cat.father && (
                              <div className="w-8 md:w-16 h-[2px] bg-zinc-300 rounded-full mt-[-40px] md:mt-[-50px]"></div>
                            )}

                            {/* PADRE */}
                            {cat.father && (
                              <div className="flex flex-col items-center gap-4 group/parent">
                                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden bg-white border-[3px] border-white shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover/parent:scale-105 group-hover/parent:shadow-[0_12px_35px_rgba(0,0,0,0.15)]">
                                  {cat.father.image ? (
                                    <img src={urlFor(cat.father.image).width(400).url()} className="w-full h-full object-cover" alt={cat.father.name} />
                                  ) : (
                                    <span className="flex items-center justify-center w-full h-full text-[9px] uppercase tracking-widest text-zinc-400 bg-zinc-50">Img</span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-1.5">Padre</p>
                                  <p className="font-serif text-lg md:text-xl text-zinc-900 leading-tight">{cat.father.name || 'Sconosciuto'}</p>
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