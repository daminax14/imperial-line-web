import { client } from '@/lib/sanity'
import Link from 'next/link'
import { getDictionary } from '@/lib/get-dictionary'
import CatPhotoGallery from '@/components/CatPhotoGallery'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import CatLineageSection from '@/components/CatLineageSection'

// Funzione per prendere i dati del gatto filtrando per lingua
async function getCat(slug: string, locale: string) {
  const query = `*[_type == "cat" && slug.current == $slug][0] {
    name,
    "imageUrl": image.asset->url,
    "galleryUrls": galleryImages[].asset->url,
    category,
    // Recupero localizzato con fallback su IT
    "description": coalesce(description[${locale}], description.it, description),
    "color": coalesce(color[${locale}], color.it, color),
    birthDate,
    health,
    breed,
    sex,
    emsCode,
    status,
    destinationCountry,
    pedigreeUrl,
    father->{
      name,
      "imageUrl": image.asset->url,
      titles
    },
    mother->{
      name,
      "imageUrl": image.asset->url,
      titles
    }
  }`
  const data = await client.fetch(query, { slug })
  return data
}

function formatBirthDate(value?: string): string {
  if (!value) return '---'
  const parsed = new Date(`${value}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const year = parsed.getFullYear()
  return `${day}/${month}/${year}`
}

function normalizeGroupFromCategory(category?: string): 'kings' | 'queens' | null {
  const value = (category || '').trim().toLowerCase()
  if (value === 'king' || value === 'kings') return 'kings'
  if (value === 'queen' || value === 'queens') return 'queens'
  return null
}

function getCountryCode(country?: string): string | null {
  const value = (country || '').trim().toLowerCase()
  const codes: Record<string, string> = {
    francia: 'fr',
    germania: 'de',
    spagna: 'es',
    italia: 'it',
    svizzera: 'ch',
    belgio: 'be',
    austria: 'at',
    'paesi bassi': 'nl',
  }
  return codes[value] || null
}

export default async function CatPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const cat = await getCat(slug, locale);
  const dict = await getDictionary(locale as 'it' | 'en' | 'de');

  if (!cat) return <div className="p-20 text-center text-xl font-serif">Miao? Not found.</div>

  // Badge Status dinamico
  const statusColors: Record<string, string> = {
    'Disponibile': 'bg-emerald-100 text-emerald-800',
    'Riservato': 'bg-gold-200/25 text-slate-800',
    'In Valutazione': 'bg-blue-100 text-blue-800',
    'Rimane in Allevamento': 'bg-[#1f3c57]/90 text-gold-200 border border-gold-200/40'
  }
  const statusStyle = cat.status ? statusColors[cat.status] || 'bg-slate-100 text-slate-800' : 'hidden';
  const soldStatus = typeof cat.status === 'string' && (cat.status.toLowerCase().includes('cedut') || cat.status.toLowerCase().includes('sold'))
  const staysInCattery = typeof cat.status === 'string' && cat.status.toLowerCase().includes('rimane in allevamento')
  const listGroup = normalizeGroupFromCategory(cat.category)
  const destinationCode = getCountryCode(cat.destinationCountry)

  return (
    <main className="relative bg-[#edf3fb] min-h-screen pt-[132px] pb-24 overflow-hidden">
      <CatsEtherealBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {listGroup && (
          <div className="mt-3 mb-8">
            <Link
              href={`/${locale}/i-nostri-gatti/${listGroup}/elenco`}
              className="inline-flex items-center gap-2 rounded-full border border-[#2f6f99]/30 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#2f6f99] hover:bg-[#2f6f99] hover:text-white transition-colors"
            >
              ← Torna all'elenco {listGroup === 'kings' ? 'Kings' : 'Queens'}
            </Link>
          </div>
        )}
        
        {/* PARTE 1: PRESENTAZIONE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          <div className="relative box-border p-4 md:p-8">
            <div className="flex justify-center">
              <div
                className="relative w-full rounded-2xl p-4 md:p-5 border border-[#2f6f99]/35 bg-white/10 backdrop-blur-md shadow-[0_20px_40px_-32px_rgba(31,75,116,0.45)]"
              >
                <div
                  className="absolute -inset-[2px] -z-10 rounded-[18px]"
                  style={{ backgroundColor: 'rgba(47, 111, 153, 0.14)' }}
                />
                <CatPhotoGallery mainImage={cat.imageUrl} extraImages={cat.galleryUrls} name={cat.name} />
              </div>
            </div>
            {cat.status && (
              <div className={`absolute top-6 right-6 z-20 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-md backdrop-blur-md ${statusStyle}`}>
                {cat.status}
              </div>
            )}
            {soldStatus && cat.destinationCountry && (
              <div className="absolute top-6 left-6 z-20 rotate-[-6deg] rounded-2xl border-2 border-[#2f6f99] bg-white/95 px-4 py-2.5 shadow-[0_12px_26px_-18px_rgba(22,52,82,0.7)]">
                <div className="absolute inset-1 rounded-xl border border-dashed border-[#2f6f99]/35 pointer-events-none" />
                <p className="relative text-[9px] uppercase tracking-[0.22em] text-[#2f6f99] font-bold">Ora vive in</p>
                <p className="relative text-sm md:text-base font-serif font-semibold text-[#1f3c57] leading-tight inline-flex items-center gap-1.5">
                  {destinationCode ? (
                    <img
                      src={`https://flagcdn.com/24x18/${destinationCode}.png`}
                      alt={cat.destinationCountry || 'Destinazione'}
                      className="w-5 h-4 rounded-[2px] border border-[#2f6f99]/20 object-cover"
                    />
                  ) : (
                    <span>📍</span>
                  )}
                  <span>{cat.destinationCountry}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start pt-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3.5 py-1.5 font-bold uppercase tracking-widest text-[11px] text-[#1f3c57] shadow-sm">
              <span>{cat.category}</span>
              <span className="text-gold-200">•</span>
              <span>{cat.breed || 'Siberian Neva Masquerade'}</span>
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mt-4 mb-8 leading-tight">
              {cat.name}
            </h1>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
              <p>{cat.description}</p>

              <div className="bg-gradient-to-br from-white/95 to-white/80 p-7 rounded-[2rem] border border-white/80 shadow-[0_20px_45px_-35px_rgba(32,72,112,0.45)] space-y-5 mt-8">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#2f6f99]/10 text-[#2f6f99] flex items-center justify-center text-base">✦</span>
                  <h2 className="text-2xl font-serif text-slate-900">{dict.catPage.techDetails}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                  <div className="rounded-xl border border-slate-100 bg-white/85 p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🎂</span>{dict.catPage.birth}</p>
                    <p className="font-semibold text-slate-900">{formatBirthDate(cat.birthDate)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white/85 p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>⚥</span>{dict.catPage.sex}</p>
                    <p className="font-semibold text-slate-900">{cat.sex || '---'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white/85 p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🎨</span>{dict.catPage.color}</p>
                    <p className="font-semibold text-slate-900">{cat.color || '---'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white/85 p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🧬</span>{dict.catPage.ems}</p>
                    <p className="font-semibold text-slate-900">{cat.emsCode || '---'}</p>
                  </div>
                  <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-white/85 p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🩺</span>{dict.catPage.health}</p>
                    <p className="font-semibold text-slate-900">{cat.health || 'Tested'}</p>
                  </div>
                </div>

                {cat.pedigreeUrl && (
                  <a
                    href={cat.pedigreeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#2f6f99] text-white py-3.5 px-7 rounded-full font-bold hover:bg-gold-200 hover:text-slate-900 transition-all shadow-md uppercase tracking-widest text-[11px]"
                  >
                    {dict.catPage.pedigree} ↗
                  </a>
                )}
              </div>

              <CatLineageSection
                father={cat.father}
                mother={cat.mother}
                compact
                className="mt-4"
                texts={{
                  title: dict.catPage.lineage,
                  subtitle: dict.catPage.lineage_sub,
                  sire: dict.catPage.sire,
                  dam: dict.catPage.dam,
                }}
              />
            </div>

            {!staysInCattery && (
              <Link href={`/${locale}/contatti`} className="inline-block text-center mt-10 bg-slate-900 text-white py-5 px-10 rounded-full font-bold hover:bg-gold-200 transition-all shadow-lg hover:shadow-gold-200/40 uppercase tracking-widest text-sm">
                {dict.catPage.inquire}
              </Link>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}