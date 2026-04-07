import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import LitterPhotoGallery from '@/components/LitterPhotoGallery'

/* ─── Types ─────────────────────────────────────────────────────────── */

type Kitten = {
  _id: string
  name: string
  slug?: string
  image?: any
  sex?: string
  color?: string
  birthDate?: string
  status?: string
  emsCode?: string
}

type Parent = {
  name: string
  slug?: string
  image?: any
  titles?: string
  emsCode?: string
}

type Litter = {
  _id: string
  title?: string
  status?: string
  notes?: string
  plannedDate?: string
  birthDate?: string
  coverImage?: any
  galleryUrls?: string[]
  father?: Parent | null
  mother?: Parent | null
  kittens: Kitten[]
}

/* ─── Data fetching ─────────────────────────────────────────────────── */

async function getLitter(slug: string, locale: string): Promise<Litter | null> {
  const query = `*[_type == "litter" && slug.current == $slug][0] {
    _id,
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
      emsCode
    }
  }`
  const data = await client.fetch(query, { slug, locale })
  return data ?? null
}

/* ─── Utils ─────────────────────────────────────────────────────────── */

function fmtDate(value?: string, locale: string = 'en'): string {
  if (!value) return '—'
  try {
    return new Date(value + 'T12:00:00').toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

/* ─── Status pill ────────────────────────────────────────────────────── */

function StatusPill({ status }: { status?: string }) {
  if (!status) return null
  const s = status.toLowerCase()
  const cls =
    s.includes('disponib') || s.includes('availab')
      ? 'bg-emerald-500 text-white'
      : s.includes('riservat') || s.includes('reserv')
        ? 'bg-gold-200 text-slate-900'
        : s.includes('valutaz')
          ? 'bg-sky-500 text-white'
          : 'bg-slate-500 text-white'
  return (
    <span
      className={`${cls} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm`}
    >
      {status}
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
  pageText: any
}) {
  const inner = (
    <div className="group/parent flex flex-col items-center text-center gap-2 min-w-0">
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
}: {
  kitten: Kitten
  locale: string
  pageText: any
}) {
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
            <StatusPill status={kitten.status} />
          </div>
        )}
      </div>

      <div className="mx-2 mb-2 px-4 pt-3 pb-4 flex flex-col gap-1 rounded-xl bg-white/45 backdrop-blur-sm border border-white/35">
        <h3 className="text-[1.45rem] font-serif italic text-[#1f3c57] leading-tight">
          {kitten.name}
        </h3>
        {(kitten.sex || kitten.color) && (
          <p className="text-sm text-[#4a6580]">
            {kitten.sex || '—'}&nbsp;&middot;&nbsp;{kitten.color || '—'}
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

  return (
    <main className="relative pt-[120px] pb-32 bg-[#edf3fb] min-h-screen text-[#1f2f43] overflow-hidden">
      <CatsEtherealBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className="mb-10 flex items-center gap-2 text-xs text-[#4a6580]">
          <Link href={`/${locale}/gattini-disponibili`} className="hover:text-[#2f6f99] transition-colors">
            {listText?.title || 'Available kittens'}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[#1f3c57] font-medium">{litter.title || pageText?.litterTitle || 'Litter'}</span>
        </nav>

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
                  title={litter.title || pageText?.litterTitle || 'Litter'}
                  texts={{
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
              {litter.title || pageText?.litterTitle || 'Litter'}
            </h1>
            <div className="mt-3 w-10 h-[2px] rounded-full bg-[#2f6f99]/35" />

            <div className="mt-5 bg-gradient-to-br from-white/95 to-white/80 p-5 rounded-[1.6rem] border border-white/80 shadow-[0_20px_45px_-35px_rgba(32,72,112,0.45)] space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#2f6f99]/10 text-[#2f6f99] flex items-center justify-center text-sm">✦</span>
                <h2 className="text-xl font-serif text-slate-900">{pageText?.litterTitle || 'Litter details'}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {litter.status && (
                  <div className="rounded-xl border border-slate-100 bg-white/85 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>📌</span>{pageText?.statusLabel || 'Stato'}</p>
                    <p className="font-semibold text-slate-900">{litter.status}</p>
                  </div>
                )}
                {isPlanned && litter.plannedDate && (
                  <div className="rounded-xl border border-slate-100 bg-white/85 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🗓️</span>{pageText?.expectedDateLabel || 'Expected date'}</p>
                    <p className="font-semibold text-slate-900">{fmtDate(litter.plannedDate, locale)}</p>
                  </div>
                )}
                {!isPlanned && litter.birthDate && (
                  <div className="rounded-xl border border-slate-100 bg-white/85 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🎂</span>{pageText?.birthDateLabel || 'Birth date'}</p>
                    <p className="font-semibold text-slate-900">{fmtDate(litter.birthDate, locale)}</p>
                  </div>
                )}
                <div className="rounded-xl border border-slate-100 bg-white/85 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5"><span>🐾</span>{pageText?.kittensCountLabel || 'Kittens count'}</p>
                  <p className="font-semibold text-slate-900">{kittens.length}</p>
                </div>
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
              <div className="mt-6 rounded-[2rem] border border-white/75 bg-white/85 p-5 shadow-[0_18px_40px_-32px_rgba(32,72,112,0.45)]">
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
                <KittenCard key={kitten._id} kitten={kitten} locale={locale} pageText={pageText} />
              ))}
            </div>
          )}
        </section>

        {/* ── Back link ────────────────────────────────────────────── */}
        <div className="mt-16">
          <Link
            href={`/${locale}/gattini-disponibili`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors group/back"
          >
            <span className="transition-transform duration-200 group-hover/back:-translate-x-1">←</span>
            <span>{pageText?.backToAvailable || 'Back to available kittens'}</span>
          </Link>
        </div>

      </div>
    </main>
  )
}
