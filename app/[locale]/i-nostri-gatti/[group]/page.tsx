import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { getDictionary, isSupportedLocale } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'

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

type GroupView = 'kings' | 'queens'

function normalizeGroup(value: string): GroupView | null {
  const normalized = value.toLowerCase()
  if (normalized === 'kings' || normalized === 'king' || normalized === 'male' || normalized === 'maschi') return 'kings'
  if (normalized === 'queens' || normalized === 'queen' || normalized === 'female' || normalized === 'femmine') return 'queens'
  return null
}

function isKing(cat: CatItem): boolean {
  const category = (cat.category || '').trim().toLowerCase()
  return category === 'king' || category === 'kings'
}

function isQueen(cat: CatItem): boolean {
  const category = (cat.category || '').trim().toLowerCase()
  return category === 'queen' || category === 'queens'
}

async function getCats(locale: string): Promise<CatItem[]> {
  const query = `*[_type == "cat"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    category,
    "description": coalesce(description[${locale}], description.it, description),
    "color": coalesce(color[${locale}], color.it, color),
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
      "color": coalesce(color[${locale}], color.it, color)
    },
    mother->{
      name,
      image,
      "color": coalesce(color[${locale}], color.it, color)
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
  const groupText = dict?.catsGroupPage || {}

  const filteredCats = cats.filter((cat) => (normalizedGroup === 'kings' ? isKing(cat) : isQueen(cat)))
  const sectionTitle = normalizedGroup === 'kings'
    ? (groupText?.kingsLabel || 'Kings')
    : (groupText?.queensLabel || 'Queens')
  const sectionSubtitle = ""

  return (
    <main className="relative min-h-screen pt-32 pb-32 text-zinc-900 font-sans selection:bg-zinc-300 overflow-hidden bg-[#edf3fb]">
      <CatsEtherealBackground />

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
              href={`/${locale}/i-nostri-gatti/kings`}
              className={`px-8 py-3 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all duration-300 ${
                normalizedGroup === 'kings' 
                  ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.08)]' 
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              {groupText?.kingsLabel || 'Kings'}
            </Link>
            <Link
              href={`/${locale}/i-nostri-gatti/queens`}
              className={`px-8 py-3 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all duration-300 ${
                normalizedGroup === 'queens' 
                  ? 'bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.08)]' 
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              {groupText?.queensLabel || 'Queens'}
            </Link>
          </div>
        </div>

        {/* LISTA GATTI */}
        {filteredCats.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-32 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm">
            <h2 className="text-3xl font-serif font-light text-zinc-500">{groupText?.emptyTitle || 'Nessun soggetto disponibile'}</h2>
            <p className="text-zinc-500 mt-4 text-sm tracking-wide">{groupText?.emptyDescription || 'I contenuti per questa sezione saranno pubblicati a breve.'}</p>
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
                            {groupText?.imageUnavailable || 'Immagine non disponibile'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COLONNA CONTENUTO */}
                    <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center`}>
                      <h2 className="text-5xl md:text-6xl font-serif font-light text-black mb-4 drop-shadow-sm">{cat.name}</h2>
                      <p className="text-sm md:text-base font-medium tracking-widest uppercase text-zinc-600 mb-10">
                        {cat.color || groupText?.defaultColor || 'Siberian Neva Masquerade'}
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
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{groupText?.fivLabel || 'FIV'}</p>
                          <p className="text-sm font-medium text-zinc-900">{groupText?.dataPlaceholder || '(data)'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{groupText?.felvLabel || 'FELV'}</p>
                          <p className="text-sm font-medium text-zinc-900">{groupText?.dataPlaceholder || '(data)'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{groupText?.hcmLabel || 'HCM'}</p>
                          <p className="text-sm font-medium text-zinc-900">{groupText?.dataPlaceholder || '(data)'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{groupText?.pkdLabel || 'PKD'}</p>
                          <p className="text-sm font-medium text-zinc-900">{groupText?.dataPlaceholder || '(data)'}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{groupText?.bloodGroupLabel || 'Gruppo Sanguigno'}</p>
                          <p className="text-sm font-medium text-zinc-900">{groupText?.dataPlaceholder || '(data)'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{groupText?.showResultsLabel || 'Risultati Show'}</p>
                          <p className="text-sm font-medium text-zinc-900">{groupText?.dataPlaceholder || '(data)'}</p>
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
                            {groupText?.pedigreeButton || 'Pedigree'} ↗
                          </a>
                        )}
                        
                      </div>

                      {/* ALBERO GENEALOGICO (GENITORI INGRANDITI) */}
                      {(cat.father || cat.mother) && (
                        <div className="mt-16 pt-10 border-t border-zinc-200/60">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-semibold mb-8 text-center md:text-left drop-shadow-sm">
                            {groupText?.parentsTitle || 'Parents'}
                          </p>
                          
                          <div className="flex items-center justify-center md:justify-start gap-10 md:gap-20">
                            
                            {/* MADRE */}
                            {cat.mother && (
                              <div className="flex flex-col items-center gap-5 group/parent">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-white border-[3px] border-white shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover/parent:scale-105 group-hover/parent:shadow-[0_12px_35px_rgba(0,0,0,0.15)]">
                                  {cat.mother.image ? (
                                    <img src={urlFor(cat.mother.image).width(640).url()} className="w-full h-full object-cover" alt={cat.mother.name} />
                                  ) : (
                                    <span className="flex items-center justify-center w-full h-full text-[9px] uppercase tracking-widest text-zinc-400 bg-zinc-50">Img</span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-1.5">{groupText?.motherLabel || 'Madre'}</p>
                                  <p className="font-serif text-lg md:text-xl text-zinc-900 leading-tight">{cat.mother.name || groupText?.unknownMother || 'Sconosciuta'}</p>
                                </div>
                              </div>
                            )}

                            {/* LINEA DI CONGIUNZIONE */}
                            {cat.mother && cat.father && (
                              <div className="w-10 md:w-20 h-[2px] bg-zinc-300 rounded-full mt-[-55px] md:mt-[-68px]"></div>
                            )}

                            {/* PADRE */}
                            {cat.father && (
                              <div className="flex flex-col items-center gap-5 group/parent">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-white border-[3px] border-white shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover/parent:scale-105 group-hover/parent:shadow-[0_12px_35px_rgba(0,0,0,0.15)]">
                                  {cat.father.image ? (
                                    <img src={urlFor(cat.father.image).width(640).url()} className="w-full h-full object-cover" alt={cat.father.name} />
                                  ) : (
                                    <span className="flex items-center justify-center w-full h-full text-[9px] uppercase tracking-widest text-zinc-400 bg-zinc-50">Img</span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-1.5">{groupText?.fatherLabel || 'Padre'}</p>
                                  <p className="font-serif text-lg md:text-xl text-zinc-900 leading-tight">{cat.father.name || groupText?.unknownFather || 'Sconosciuto'}</p>
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