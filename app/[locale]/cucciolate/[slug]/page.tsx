import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import LitterPhotoGallery from '@/components/LitterPhotoGallery'
import { getLitterDisplayTitle } from '@/lib/utils'

/* ─── Types ─────────────────────────────────────────────────────────── */

type Kitten = {
  _id: string
  name: string
  slug?: string
  image?: unknown
  sex?: string
  color?: string
  birthDate?: string
  status?: string
  emsCode?: string
  destinationCountry?: string
}

type Parent = {
  name: string
  slug?: string
  image?: unknown
  titles?: string
  emsCode?: string
}

type Litter = {
  _id: string
  letter?: string
  title?: string
  status?: string
  notes?: string
  plannedDate?: string
  birthDate?: string
  coverImage?: unknown
  galleryUrls?: string[]
  father?: Parent | null
  mother?: Parent | null
  kittens: Kitten[]
}

/* ─── Data fetching ─────────────────────────────────────────────────── */

async function getLitter(slug: string, locale: string): Promise<Litter | null> {
  const query = `*[_type == "litter" && slug.current == $slug][0] {
    _id,
    letter,
    "title": coalesce(title[$locale], title.it, title),
    status,
    "notes": coalesce(notes[$locale], notes.it, notes),
    plannedDate,
    birthDate,
    coverImage,
    "galleryUrls": galleryImages[].asset->url,
    "father": father->{
      name,
      "slug": slug.current,
      image,
      titles,
      emsCode
    },
    "mother": mother->{
      name,
      "slug": slug.current,
      image,
      titles,
      emsCode
    },
    "kittens": kittens[]->{
      _id,
      name,
      "slug": slug.current,
      image,
      sex,
      "color": coalesce(color[$locale], color.it, color),
      birthDate,
      status,
      emsCode,
      destinationCountry
    }
  }`
  const data = await client.fetch(query, { slug, locale })
  return data ?? null
}

/* ─── Utils ─────────────────────────────────────────────────────────── */

function fmtDate(value?: string, locale: string = 'it'): string {
  if (!value) return '—'
  try {
    const targetLocale = locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : locale === 'en' ? 'en-GB' : 'it-IT'
    return new Date(value + 'T12:00:00').toLocaleDateString(targetLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

function normalizeLitterStatusKey(value?: string): 'planned' | 'waiting' | 'active' | 'historical' | 'other' {
  const v = (value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (v.includes('pianificat') || v.includes('planned') || v.includes('planifie') || v.includes('geplant')) return 'planned'
  if (v.includes('in attesa') || v.includes('waiting') || v.includes('attente') || v.includes('wartend')) return 'waiting'
  if (v.includes('attiva') || v.includes('active') || v.includes('aktiv') || v.includes('actif')) return 'active'
  if (v.includes('storica') || v.includes('historic') || v.includes('historique') || v.includes('historisch')) return 'historical'
  return 'other'
}

function normalizeCatStatusKey(status?: string): string {
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

function normalizeSexKey(value?: string): string {
  const v = (value || '').trim().toLowerCase()
  if (!v) return 'unknown'
  if (v.includes('masch') || v.includes('male') || v === 'm') return 'male'
  if (v.includes('femmin') || v.includes('female') || v === 'f') return 'female'
  return 'unknown'
}

/* ─── Status pill ────────────────────────────────────────────────────── */

function StatusPill({ label, statusKey }: { label?: string; statusKey: string }) {
  if (!label) return null
  const cls =
    statusKey === 'available'
      ? 'bg-emerald-500 text-white'
      : statusKey === 'reserved'
        ? 'bg-gold-200 text-slate-900'
        : statusKey === 'evaluation'
          ? 'bg-sky-500 text-white'
          : 'bg-slate-500 text-white'
  return (
    <span
      className={`${cls} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm`}
    >
      {label}
    </span>
  )
}

/* ─── Parent card ────────────────────────────────────────────────────── */

function ParentCard({
  parent,
  role,
  locale,
  pageText,
}: {
  parent: Parent
  role: string
  locale: string
  pageText: Record<string, unknown>
}) {
  const inner = (
    <div className="group/parent flex flex-col items-center text-center gap-2 min-w-0 rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm px-4 py-4">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover/parent:scale-105">
        {parent.image ? (
          <img
            src={urlFor(parent.image).width(320).height(320).fit('crop').url()}
            alt={parent.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-2xl">
            ◦
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#2f6f99]/70">
          {role}
        </p>
        <p className="text-lg md:text-xl font-serif italic text-[#1f3c57] mt-0.5 leading-tight">{parent.name}</p>
        {parent.titles && (
          <p className="text-xs text-[#6a85a0] mt-0.5">{parent.titles}</p>
        )}
        {parent.emsCode && (
          <p className="text-xs font-mono text-[#6a85a0]">{parent.emsCode}</p>
        )}
        {parent.slug && (
          <span className="inline-block mt-2 text-xs font-semibold text-[#2f6f99]">
            {pageText?.details || 'Full profile'} →
          </span>
        )}
      </div>
    </div>
  )

  if (parent.slug) {
    return (
      <Link href={`/${locale}/cat/${parent.slug}`} className="hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    )
  }
  return inner
}

/* ─── Kitten card ────────────────────────────────────────────────────── */

function KittenCard({
  kitten,
  locale,
  pageText,
  viewDetailsLabel,
  countryLabels,
  statusLabels,
  sexLabels,
  livesInLabel,
  willLiveInLabel,
}: {
  kitten: Kitten
  locale: string
  pageText: Record<string, unknown>
  viewDetailsLabel: string
  countryLabels: Record<string, string>
  statusLabels: Record<string, string>
  sexLabels: Record<string, string>
  livesInLabel: string
  willLiveInLabel: string
}) {
  const statusKey = normalizeCatStatusKey(kitten.status)
  const localizedStatus = statusLabels[statusKey] || kitten.status
  const sexKey = normalizeSexKey(kitten.sex)
  const localizedSex = sexLabels[sexKey] || kitten.sex || '—'
  const showDestination = (statusKey === 'sold' || statusKey === 'reserved') && Boolean(kitten.destinationCountry)
  const destinationCode = getCountryCode(kitten.destinationCountry)
  const destinationKey = normalizeCountryKey(kitten.destinationCountry)
  const localizedDestination = countryLabels[destinationKey] || kitten.destinationCountry

  return (
    <article className="group rounded-2xl overflow-hidden bg-[#2f6f99]/12 border border-[#2f6f99]/35 backdrop-blur-md shadow-[0_16px_32px_-24px_rgba(24,60,95,0.65)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_36px_-20px_rgba(24,60,95,0.75)]">
      <div className="relative aspect-[3/4] bg-white/25 backdrop-blur-sm overflow-hidden m-2 rounded-xl border border-white/45">
        {kitten.image ? (
          <img
            src={urlFor(kitten.image).width(600).height(800).fit('crop').url()}
            alt={kitten.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-sm bg-slate-50">
            {pageText?.photoUnavailable || 'Photo not available'}
          </div>
        )}
        {kitten.status && (
          <div className="absolute top-3 right-3">
            <StatusPill label={localizedStatus} statusKey={statusKey} />
          </div>
        )}
        {kitten.slug && (
          <Link
            href={`/${locale}/cat/${kitten.slug}`}
            aria-label={`${viewDetailsLabel}: ${kitten.name}`}
            className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#1f3c57] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full shadow">
              {viewDetailsLabel} →
            </span>
          </Link>
        )}
        {showDestination && (
          <div className="absolute top-3 left-3 z-20 rotate-[-6deg] rounded-2xl border-2 border-[#2f6f99] bg-white/95 px-3 py-2 shadow-[0_12px_26px_-18px_rgba(22,52,82,0.7)]">
            <div className="absolute inset-1 rounded-xl border border-dashed border-[#2f6f99]/35 pointer-events-none" />
            <p className="relative text-[9px] uppercase tracking-[0.22em] text-[#2f6f99] font-bold">
              {statusKey === 'reserved' ? willLiveInLabel : livesInLabel}
            </p>
            <p className="relative text-xs font-serif font-semibold text-[#1f3c57] leading-tight inline-flex items-center gap-1.5">
              {destinationCode ? (
                <img
                  src={`https://flagcdn.com/24x18/${destinationCode}.png`}
                  alt={localizedDestination || 'Destination'}
                  className="w-4 h-3 rounded-[2px] border border-[#2f6f99]/20 object-cover"
                />
              ) : (
                <span>📍</span>
              )}
              <span>{localizedDestination}</span>
            </p>
          </div>
        )}
      </div>

      <div className="mx-2 mb-2 px-4 pt-3 pb-4 flex flex-col gap-1 rounded-xl bg-white/45 backdrop-blur-sm border border-white/35">
        <h3 className="text-[1.45rem] font-serif italic text-[#1f3c57] leading-tight">
          {kitten.name}
        </h3>
        {(kitten.sex || kitten.color) && (
          <p className="text-sm text-[#4a6580]">
            {localizedSex}&nbsp;&middot;&nbsp;{kitten.color || '—'}
          </p>
        )}
        {kitten.emsCode && (
          <p className="text-xs font-mono text-[#6a85a0]">{kitten.emsCode}</p>
        )}
        {kitten.birthDate && (
          <p className="text-xs text-[#6a85a0]">{pageText?.bornLabel || 'Born'}: {fmtDate(kitten.birthDate, locale)}</p>
        )}

        {kitten.slug ? (
          <Link
            href={`/${locale}/cat/${kitten.slug}`}
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors group/link"
          >
            <span>{pageText?.details || 'Full profile'}</span>
            <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </Link>
        ) : (
          <p className="mt-3 text-xs text-slate-400 italic">{pageText?.sheetNotAvailable || 'Profile not available yet'}</p>
        )}
      </div>
    </article>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function LitterPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const [litter, dict] = await Promise.all([
    getLitter(slug, locale),
    getDictionary(locale),
  ])

  if (!litter) notFound()

  const coverImg = litter.coverImage ?? null
  const isPlanned = !litter.birthDate && Boolean(litter.plannedDate)
  const kittens = Array.isArray(litter.kittens) ? litter.kittens : []
  const pageText = dict?.litterPage || {}
  const listText = dict?.availableKittensPage || {}
  const catText = dict?.catPage || {}
  const viewDetailsLabel = listText?.viewDetails || pageText?.details || 'View details'
  const litterStatusLabels = (pageText?.statusLabels || {}) as Record<string, string>
  const catStatusLabels = (catText?.statusLabels || {}) as Record<string, string>
  const sexLabels = (catText?.sexLabels || {}) as Record<string, string>
  const countryLabels = (catText?.countryLabels || {}) as Record<string, string>
  const livesInLabel = catText?.livesIn || 'Now lives in'
  const reservedLabelsByLocale: Record<string, string> = {
    it: 'Vivrà in',
    en: 'Will live in',
    de: 'Wird leben in',
    fr: 'Vivra en',
  }
  const willLiveInLabel = reservedLabelsByLocale[locale] || reservedLabelsByLocale.en
  const litterStatusKey = normalizeLitterStatusKey(litter.status)
  const localizedLitterStatus = litterStatusLabels[litterStatusKey] || litter.status
  const litterDisplayTitle = getLitterDisplayTitle(litter.title, litter.letter, pageText?.litterTitle || 'Litter')

  return (
    <main className="relative pt-[156px] pb-32 bg-[#edf3fb] min-h-screen text-[#1f2f43] overflow-hidden">
      <CatsEtherealBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/gattini-disponibili`}
            className="inline-flex items-center gap-2 rounded-full border border-[#2f6f99]/35 bg-white/90 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#2f6f99] shadow-sm hover:-translate-y-0.5 hover:bg-[#2f6f99] hover:text-white transition-all"
          >
            <span className="text-sm">←</span>
            <span>{pageText?.backToAvailable || 'Back to available kittens'}</span>
          </Link>
          <span className="inline-flex items-center rounded-full border border-white/80 bg-white/75 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#2f6f99]/80">
            {litterDisplayTitle}
          </span>
        </div>

        {/* ── Hero: cover + title ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-16">
          {/* Photo */}
          <div className="relative box-border p-3 md:p-6">
            <div className="flex justify-center">
              <div
                className="relative w-full rounded-2xl p-4 md:p-5 border border-[#2f6f99]/35 bg-white/10 backdrop-blur-md shadow-[0_20px_40px_-32px_rgba(31,75,116,0.45)]"
              >
                <div
                  className="absolute -inset-[2px] -z-10 rounded-[18px]"
                  style={{ backgroundColor: 'rgba(47, 111, 153, 0.14)' }}
                />
                <LitterPhotoGallery
                  mainImage={coverImg ? urlFor(coverImg).width(1400).height(1050).fit('crop').url() : undefined}
                  extraImages={litter.galleryUrls}
                  title={litterDisplayTitle}
                  texts={{
                    previousLabel: catText?.galleryPrevious,
                    nextLabel: catText?.galleryNext,
                    dotLabel: catText?.galleryGoTo,
                    scrollLeft: pageText?.galleryScrollLeft,
                    scrollRight: pageText?.galleryScrollRight,
                    openPhoto: pageText?.galleryOpenPhoto,
                    scrollHint: pageText?.galleryScrollHint,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-[#2f6f99]/70 font-semibold mb-2">
              Imperial Line
            </p>
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#1f3c57] leading-tight">
              {litterDisplayTitle}
            </h1>
            <div className="mt-3 w-10 h-[2px] rounded-full bg-[#2f6f99]/35" />

            <div className="relative mt-5 p-7 rounded-[2rem] border border-[#2f6f99]/35 bg-white/25 backdrop-blur-md shadow-[0_20px_45px_-35px_rgba(32,72,112,0.45)] overflow-hidden">
              <div className="absolute -inset-[2px] -z-10 rounded-[2rem]" style={{ backgroundColor: 'rgba(47, 111, 153, 0.14)' }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {litter.status && (
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    {pageText?.statusLabel && (
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>📌</span>{pageText.statusLabel}</p>
                    )}
                    <p className="font-semibold text-slate-900">{localizedLitterStatus}</p>
                  </div>
                )}
                {isPlanned && litter.plannedDate && (
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    {pageText?.expectedDateLabel && (
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🗓️</span>{pageText.expectedDateLabel}</p>
                    )}
                    <p className="font-semibold text-slate-900">{fmtDate(litter.plannedDate, locale)}</p>
                  </div>
                )}
                {!isPlanned && litter.birthDate && (
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    {pageText?.birthDateLabel && (
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🎂</span>{pageText.birthDateLabel}</p>
                    )}
                    <p className="font-semibold text-slate-900">{fmtDate(litter.birthDate, locale)}</p>
                  </div>
                )}
                {!isPlanned && (
                  <div className="rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm p-3.5">
                    {pageText?.kittensCountLabel && (
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🐾</span>{pageText.kittensCountLabel}</p>
                    )}
                    <p className="font-semibold text-slate-900">{kittens.length}</p>
                  </div>
                )}
              </div>
            </div>

            {litter.notes && (
              <div className="mt-5 rounded-2xl border border-[#2f6f99]/20 bg-white/80 px-5 py-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#2f6f99]/75 font-semibold mb-2 flex items-center gap-1.5">
                  <span>✎</span>
                  <span>{pageText?.notesLabel || 'Notes'}</span>
                </p>
                <p className="text-[#3a5570] leading-relaxed text-sm md:text-base">{litter.notes}</p>
              </div>
            )}

            {(litter.father || litter.mother) && (
              <div className="relative mt-6 p-7 rounded-[2rem] border border-[#2f6f99]/35 bg-white/25 backdrop-blur-md shadow-[0_20px_45px_-35px_rgba(32,72,112,0.45)] overflow-hidden">
                <div className="absolute -inset-[2px] -z-10 rounded-[2rem]" style={{ backgroundColor: 'rgba(47, 111, 153, 0.14)' }} />
                <p className="text-xs uppercase tracking-[0.32em] text-[#2f6f99]/70 font-semibold mb-2">
                  {pageText?.parentsSup || 'Parents'}
                </p>
                <h2 className="text-xl md:text-2xl font-serif italic text-[#1f3c57] mb-4">
                  {pageText?.parentsTitle || 'King & Queen'}
                </h2>

                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 md:gap-5">
                  {litter.father && (
                    <ParentCard parent={litter.father} role={pageText?.sireLabel || 'Sire (Father)'} locale={locale} pageText={pageText} />
                  )}
                  {litter.father && litter.mother && (
                    <div className="flex items-center justify-center pt-10 md:pt-12">
                      <span className="text-[#2f6f99] text-2xl md:text-3xl font-light">×</span>
                    </div>
                  )}
                  {litter.mother && (
                    <ParentCard parent={litter.mother} role={pageText?.damLabel || 'Dam (Mother)'} locale={locale} pageText={pageText} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Kittens ───────────────────────────────────────────────── */}
        <section>
          <div className="mb-7">
            <p className="text-xs uppercase tracking-[0.38em] text-[#2f6f99]/70 font-semibold mb-1.5">
              {isPlanned ? (pageText?.expectedKittensSup || 'Expected kittens') : (pageText?.kittensSup || 'Kittens')}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif italic text-[#1f3c57]">
              {isPlanned ? (pageText?.comingSoonTitle || 'Coming soon...') : (pageText?.individualSheetsTitle || 'Individual profiles')}
            </h2>
            <div className="mt-3 w-10 h-[2px] rounded-full bg-[#2f6f99]/35" />
          </div>

          {kittens.length === 0 ? (
            <div className="rounded-2xl border border-white/50 bg-white/50 px-6 py-10 text-center text-sm text-[#3a5570]">
              {isPlanned
                ? (pageText?.expectedEmpty || 'Kittens will be added as soon as they are born.')
                : (pageText?.kittensEmpty || 'No kittens linked to this litter.')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {kittens.map((kitten) => (
                <KittenCard
                  key={kitten._id}
                  kitten={kitten}
                  locale={locale}
                  pageText={pageText}
                  viewDetailsLabel={viewDetailsLabel}
                  countryLabels={countryLabels}
                  statusLabels={catStatusLabels}
                  sexLabels={sexLabels}
                  livesInLabel={livesInLabel}
                  willLiveInLabel={willLiveInLabel}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Back link ────────────────────────────────────────────── */}
        <div className="mt-16">
          <Link
            href={`/${locale}/gattini-disponibili`}
            className="inline-flex items-center gap-2 rounded-full border border-[#2f6f99]/35 bg-white/90 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#2f6f99] shadow-sm hover:-translate-y-0.5 hover:bg-[#2f6f99] hover:text-white transition-all"
          >
            <span className="text-sm">←</span>
            <span>{pageText?.backToAvailable || 'Back to available kittens'}</span>
          </Link>
        </div>

      </div>
    </main>
  )
}
