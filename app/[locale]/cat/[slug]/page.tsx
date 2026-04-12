import { client } from '@/lib/sanity'
import Link from 'next/link'
import { getDictionary } from '@/lib/get-dictionary'
import CatPhotoGallery from '@/components/CatPhotoGallery'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import CatLineageSection from '@/components/CatLineageSection'
import GoBackButton from '@/components/ui/GoBackButton'
import { getLitterDisplayTitle } from '@/lib/utils'

type ParentRef = {
  name?: string
  imageUrl?: string
  titles?: string
  slug?: string
  emsCode?: string
}

type LitterRef = {
  slug?: string
  title?: string
  letter?: string
  father?: ParentRef
  mother?: ParentRef
}

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
    healthTests,
    breed,
    sex,
    emsCode,
    bloodGroup,
    status,
    destinationCountry,
    pedigreeUrl,
    "litter": *[_type == "litter" && references(^._id)][0] {
      "slug": slug.current,
      letter,
      "title": coalesce(title[$locale], title.it, title),
      "father": father->{
        name,
        "imageUrl": image.asset->url,
        titles,
        "slug": slug.current,
        emsCode
      },
      "mother": mother->{
        name,
        "imageUrl": image.asset->url,
        titles,
        "slug": slug.current,
        emsCode
      }
    },
    father->{
      name,
      "imageUrl": image.asset->url,
      titles,
      "slug": slug.current,
      emsCode
    },
    mother->{
      name,
      "imageUrl": image.asset->url,
      titles,
      "slug": slug.current,
      emsCode
    }
  }`
  const data = await client.fetch(query, { slug, locale })
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

function normalizeCategoryKey(category?: string): 'kittens' | 'kings' | 'queens' | 'other' {
  const value = (category || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (['cuccioli', 'cucciolo', 'kitten', 'kittens', 'chaton', 'chatons', 'katzchen', 'jungtier'].includes(value)) return 'kittens'
  if (value === 'king' || value === 'kings' || value === 'maschio' || value === 'male') return 'kings'
  if (value === 'queen' || value === 'queens' || value === 'femmina' || value === 'female') return 'queens'
  return 'other'
}

function getLocalizedCategory(category: string | undefined, locale: string, categoryLabels: Record<string, string>): string {
  const key = normalizeCategoryKey(category)
  if (categoryLabels[key]) return categoryLabels[key]

  const defaultsByLocale: Record<string, Record<string, string>> = {
    it: { kittens: 'Cuccioli', kings: 'Kings', queens: 'Queens' },
    en: { kittens: 'Kittens', kings: 'Kings', queens: 'Queens' },
    de: { kittens: 'Kitten', kings: 'Kings', queens: 'Queens' },
    fr: { kittens: 'Chatons', kings: 'Kings', queens: 'Queens' },
  }

  const localeMap = defaultsByLocale[locale] || defaultsByLocale.en
  return localeMap[key] || category || 'Cat'
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

function normalizeStatusKey(status?: string): string {
  const s = (status || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (!s) return 'unknown'
  if (s.includes('disponib') || s.includes('available') || s.includes('disponible') || s.includes('free') || s.includes('libero') || s.includes('verfugbar')) return 'available'
  if (s.includes('valutaz') || s.includes('evaluation') || s.includes('evaluate')) return 'evaluation'
  if (s.includes('riserv') || s.includes('reserved') || s.includes('reserve') || s.includes('reserv')) return 'reserved'
  if (s.includes('tenut') || s.includes('held')) return 'held'
  if (s.includes('non in vendita') || s.includes('not for sale')) return 'notForSale'
  if (s.includes('cedut') || s.includes('sold') || s.includes('vendu') || s.includes('cede') || s.includes('vergeben')) return 'sold'
  if (s.includes('rimane in allevamento') || s.includes('stays in cattery')) return 'staysInCattery'
  return 'unknown'
}

function normalizeCountryKey(country?: string): string {
  const value = (country || '').trim().toLowerCase()
  const map: Record<string, string> = {
    francia: 'france',
    france: 'france',
    germania: 'germany',
    deutschland: 'germany',
    germany: 'germany',
    spagna: 'spain',
    espana: 'spain',
    spain: 'spain',
    italia: 'italy',
    italy: 'italy',
    svizzera: 'switzerland',
    suisse: 'switzerland',
    schweiz: 'switzerland',
    switzerland: 'switzerland',
    belgio: 'belgium',
    belgique: 'belgium',
    belgien: 'belgium',
    belgium: 'belgium',
    austria: 'austria',
    'paesi bassi': 'netherlands',
    niederlande: 'netherlands',
    pays_bas: 'netherlands',
    netherlands: 'netherlands',
  }
  return map[value] || 'other'
}

function normalizeHealthResultKey(value?: string): string {
  const v = (value || '').trim().toLowerCase()
  if (!v) return 'notTested'
  if (v.includes('positiv') || v.includes('positive')) return 'positive'
  if (v.includes('negativ') || v.includes('negative')) return 'negative'
  if (v.includes('non test') || v.includes('not test') || v.includes('not available')) return 'notTested'
  return 'notTested'
}

function normalizeSexKey(value?: string): string {
  const v = (value || '').trim().toLowerCase()
  if (!v) return 'unknown'
  if (v.includes('masch') || v.includes('male') || v === 'm') return 'male'
  if (v.includes('femmin') || v.includes('female') || v === 'f') return 'female'
  return 'unknown'
}

export default async function CatPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const cat = await getCat(slug, locale);
  const dict = await getDictionary(locale as 'it' | 'en' | 'de' | 'fr');
  const catText = dict?.catPage || {}

  if (!cat) return <div className="p-20 text-center text-xl font-serif">{catText?.notFound || 'Cat not found.'}</div>

  // Badge Status dinamico
  const statusColors: Record<string, string> = {
    available: 'bg-emerald-100 text-emerald-800',
    evaluation: 'bg-blue-100 text-blue-800',
    reserved: 'bg-gold-200/25 text-slate-800',
    staysInCattery: 'bg-[#1f3c57]/90 text-gold-200 border border-gold-200/40',
    sold: 'bg-slate-200 text-slate-800',
    held: 'bg-slate-100 text-slate-800',
    notForSale: 'bg-slate-100 text-slate-800',
    unknown: 'bg-slate-100 text-slate-800',
  }
  const statusKey = normalizeStatusKey(cat.status)
  const statusLabels = (catText?.statusLabels || {}) as Record<string, string>
  const categoryLabels = ((catText as { categoryLabels?: Record<string, string> })?.categoryLabels || {}) as Record<string, string>
  const countryLabels = (catText?.countryLabels || {}) as Record<string, string>
  const localizedCategory = getLocalizedCategory(cat.category, locale, categoryLabels)
  const localizedStatus = statusLabels[statusKey] || cat.status
  const statusStyle = cat.status ? statusColors[statusKey] || statusColors.unknown : 'hidden';
  const soldStatus = statusKey === 'sold'
  const reservedStatus = statusKey === 'reserved'
  const staysInCattery = statusKey === 'staysInCattery'
  const categoryKey = normalizeCategoryKey(cat.category)
  const listGroup = normalizeGroupFromCategory(cat.category)
  const litterRef = (cat as { litter?: LitterRef })?.litter
  const litterTitle = getLitterDisplayTitle(litterRef?.title, litterRef?.letter, catText?.litterFallbackTitle || 'Litter')
  const kittenLitterHref = litterRef?.slug ? `/${locale}/cucciolate/${litterRef.slug}` : null
  const destinationCode = getCountryCode(cat.destinationCountry)
  const destinationKey = normalizeCountryKey(cat.destinationCountry)
  const localizedDestination = countryLabels[destinationKey] || cat.destinationCountry
  const reservedLabelsByLocale: Record<string, string> = {
    it: 'Vivra in',
    en: 'Will live in',
    de: 'Wird leben in',
    fr: 'Vivra en',
  }
  const willLiveInLabel = (catText as { willLiveIn?: string })?.willLiveIn || reservedLabelsByLocale[locale] || reservedLabelsByLocale.en
  const sexLabels = (catText?.sexLabels || {}) as Record<string, string>
  const sexKey = normalizeSexKey(cat.sex)
  const localizedSex = sexLabels[sexKey] || cat.sex || '---'
  const testLabels = (catText?.testLabels || {}) as Record<string, string>
  const testResultLabels = (catText?.testResultLabels || {}) as Record<string, string>
  const tests = [
    { key: 'fiv', label: testLabels.fiv || 'FIV', raw: cat?.healthTests?.fiv },
    { key: 'felv', label: testLabels.felv || 'FeLV', raw: cat?.healthTests?.felv },
    { key: 'hcm', label: testLabels.hcm || 'HCM', raw: cat?.healthTests?.hcm },
    { key: 'pkd', label: testLabels.pkd || 'PKD', raw: cat?.healthTests?.pkd },
  ].map((item) => {
    const resultKey = normalizeHealthResultKey(item.raw)
    const value = testResultLabels[resultKey] || item.raw || testResultLabels.notTested || 'Not tested'
    return { ...item, resultKey, value }
  })
  const hasStructuredTests = tests.some((t) => typeof t.raw === 'string' && t.raw.trim().length > 0)
  const hasPlainHealth = typeof cat.health === 'string' && cat.health.trim().length > 0
  const hasHealthSection = hasStructuredTests || hasPlainHealth
  const hasBloodGroup = typeof cat.bloodGroup === 'string' && cat.bloodGroup.trim().length > 0
  const bloodGroupLabelFromCatPage = (catText as { bloodGroupLabel?: string } | undefined)?.bloodGroupLabel
  const bloodGroupLabel =
    bloodGroupLabelFromCatPage ||
    (dict?.catsGroupPage as { bloodGroupLabel?: string } | undefined)?.bloodGroupLabel ||
    'Blood group'
  const resolvedFather = cat.father || litterRef?.father
  const resolvedMother = cat.mother || litterRef?.mother
  const inquiryHref = categoryKey === 'kittens' ? `/${locale}/richiedi-informazioni/${slug}` : `/${locale}/contatti`
  const kittenInquiryLabelsByLocale: Record<string, string> = {
    it: 'Richiedi informazioni / Riserva',
    en: 'Inquire / Reserve',
    de: 'Anfragen / Reservieren',
    fr: 'Demander / Reserver',
  }
  const inquiryLabel = categoryKey === 'kittens'
    ? (kittenInquiryLabelsByLocale[locale] || kittenInquiryLabelsByLocale.en)
    : dict.catPage.inquire

  return (
    <main className="relative bg-[#edf3fb] min-h-screen pt-[168px] pb-24 overflow-hidden">
      <CatsEtherealBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {categoryKey === 'kittens' && (
          <div className="mt-3 mb-8 flex flex-wrap items-center gap-3">
            {kittenLitterHref && (
              <Link
                href={kittenLitterHref}
                className="gold-hover-button inline-flex items-center gap-2 rounded-full border border-[#2f6f99]/35 bg-white/90 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#2f6f99] shadow-sm hover:-translate-y-0.5"
              >
                <span className="text-sm">←</span>
                <span>{catText?.backToLitter || 'Back to litter'}</span>
                <span className="rounded-full border border-current/30 px-2 py-0.5 text-[10px] tracking-[0.14em]">
                  {litterRef?.letter ? litterRef.letter.toUpperCase() : litterTitle}
                </span>
              </Link>
            )}
            <GoBackButton
              label={catText?.backToPrevious || 'Back to previous page'}
              fallbackHref={kittenLitterHref || `/${locale}/gattini-disponibili`}
              className="gold-hover-button inline-flex items-center gap-2 rounded-full border border-[#2f6f99]/18 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-[#2f6f99]"
            />
          </div>
        )}
        {categoryKey !== 'kittens' && listGroup && (
          <div className="mt-3 mb-8">
            <Link
              href={`/${locale}/i-nostri-gatti/${listGroup}/elenco`}
              className="gold-hover-button inline-flex items-center gap-2 rounded-full border border-[#2f6f99]/30 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#2f6f99]"
            >
              ← {listGroup === 'kings' ? (catText?.backToKingsList || 'Back to Kings list') : (catText?.backToQueensList || 'Back to Queens list')}
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
                <CatPhotoGallery
                  mainImage={cat.imageUrl}
                  extraImages={cat.galleryUrls}
                  name={cat.name}
                  emptyText={catText?.photoUnavailable}
                  galleryTexts={{
                    previousLabel: catText?.galleryPrevious,
                    nextLabel: catText?.galleryNext,
                    dotLabel: catText?.galleryGoTo,
                  }}
                />
              </div>
            </div>
            {cat.status && (
              <div className={`absolute top-6 right-6 z-20 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-md backdrop-blur-md ${statusStyle}`}>
                {localizedStatus}
              </div>
            )}
            {(soldStatus || reservedStatus) && cat.destinationCountry && (
              <div className="absolute top-6 left-6 z-20 rotate-[-6deg] rounded-2xl border-2 border-[#2f6f99] bg-white/95 px-4 py-2.5 shadow-[0_12px_26px_-18px_rgba(22,52,82,0.7)]">
                <div className="absolute inset-1 rounded-xl border border-dashed border-[#2f6f99]/35 pointer-events-none" />
                <p className="relative text-[9px] uppercase tracking-[0.22em] text-[#2f6f99] font-bold">{reservedStatus ? willLiveInLabel : (catText?.livesIn || 'Now lives in')}</p>
                <p className="relative text-sm md:text-base font-serif font-semibold text-[#1f3c57] leading-tight inline-flex items-center gap-1.5">
                  {destinationCode ? (
                    <img
                      src={`https://flagcdn.com/24x18/${destinationCode}.png`}
                      alt={localizedDestination || 'Destination'}
                      className="w-5 h-4 rounded-[2px] border border-[#2f6f99]/20 object-cover"
                    />
                  ) : (
                    <span>📍</span>
                  )}
                  <span>{localizedDestination}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start pt-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3.5 py-1.5 font-bold uppercase tracking-widest text-[11px] text-[#1f3c57] shadow-sm">
              <span>{localizedCategory}</span>
              <span className="text-gold-200">•</span>
              <span>{cat.breed || catText?.defaultBreed || 'Siberian Neva Masquerade'}</span>
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mt-4 mb-8 leading-tight">
              {cat.name}
            </h1>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
              <p>{cat.description}</p>

              <div className="relative mt-8 p-7 rounded-[2rem] border border-[#2f6f99]/35 bg-white/25 backdrop-blur-md shadow-[0_20px_45px_-35px_rgba(32,72,112,0.45)] space-y-5 overflow-hidden">
                <div className="absolute -inset-[2px] -z-10 rounded-[2rem]" style={{ backgroundColor: 'rgba(47, 111, 153, 0.14)' }} />
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#2f6f99]/10 text-[#2f6f99] flex items-center justify-center text-base">✦</span>
                  <h2 className="text-2xl font-serif text-slate-900">{dict.catPage.techDetails}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🎂</span>{dict.catPage.birth}</p>
                    <p className="font-semibold text-slate-900">{formatBirthDate(cat.birthDate)}</p>
                  </div>
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>⚥</span>{dict.catPage.sex}</p>
                    <p className="font-semibold text-slate-900">{localizedSex}</p>
                  </div>
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🎨</span>{dict.catPage.color}</p>
                    <p className="font-semibold text-slate-900">{cat.color || '---'}</p>
                  </div>
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🧬</span>{dict.catPage.ems}</p>
                    <p className="font-semibold text-slate-900">{cat.emsCode || '---'}</p>
                  </div>
                  {hasBloodGroup && (
                    <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🩸</span>{bloodGroupLabel}</p>
                      <p className="font-semibold text-slate-900">{cat.bloodGroup}</p>
                    </div>
                  )}
                  {hasHealthSection && (
                    <div className="sm:col-span-2 rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🩺</span>{dict.catPage.health}</p>
                      {hasStructuredTests ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                          {tests.map((test) => (
                            <div key={test.key} className="rounded-lg border border-[#2f6f99]/18 bg-white/70 px-2.5 py-2 flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-slate-700 uppercase tracking-[0.12em]">{test.label}</span>
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  test.resultKey === 'negative'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : test.resultKey === 'positive'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {test.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-semibold text-slate-900">{cat.health}</p>
                      )}
                    </div>
                  )}
                </div>

                {cat.pedigreeUrl && (
                  <a
                    href={cat.pedigreeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-hover-button inline-flex items-center justify-center bg-[#2f6f99] text-white py-3.5 px-7 rounded-full font-bold shadow-md uppercase tracking-widest text-[11px]"
                  >
                    {dict.catPage.pedigree} ↗
                  </a>
                )}
              </div>

              <CatLineageSection
                father={resolvedFather}
                mother={resolvedMother}
                compact
                className="mt-4"
                texts={{
                  title: '',
                  subtitle: dict.catPage.lineage_sub,
                  sire: dict.catPage.sire,
                  dam: dict.catPage.dam,
                  details: dict?.litterPage?.details || 'Full profile',
                  zoom: dict.catPage.zoom,
                  close: dict.catPage.close,
                  unknownParent: dict.catPage.unknownParent,
                  zoomAriaPrefix: dict.catPage.zoomAriaPrefix,
                  locale,
                }}
              />
            </div>

            {statusKey === 'available' && (
              <Link href={inquiryHref} className="gold-hover-button inline-block text-center mt-10 bg-slate-900 text-white py-5 px-10 rounded-full font-bold shadow-lg uppercase tracking-widest text-sm">
                {inquiryLabel}
              </Link>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}