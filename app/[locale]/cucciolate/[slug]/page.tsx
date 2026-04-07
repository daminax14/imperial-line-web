import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { getDictionary } from '@/lib/get-dictionary'

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

function fmtDate(value?: string): string {
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
    <div className="group/parent flex flex-col items-center text-center gap-3">
      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover/parent:scale-105">
        {parent.image ? (
          <img
            src={urlFor(parent.image).width(288).height(288).fit('crop').url()}
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
        <p className="text-xl font-serif italic text-[#1f3c57] mt-0.5">{parent.name}</p>
        {parent.titles && (
          <p className="text-xs text-[#6a85a0] mt-0.5">{parent.titles}</p>
        )}
        {parent.emsCode && (
          <p className="text-xs font-mono text-[#6a85a0]">{parent.emsCode}</p>
        )}
        {parent.slug && (
          <span className="inline-block mt-2 text-xs font-semibold text-[#2f6f99]">
            {pageText?.details || 'Scheda completa'} →
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
    <article className="group rounded-2xl overflow-hidden bg-white/90 border border-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {kitten.image ? (
          <img
            src={urlFor(kitten.image).width(600).height(800).fit('crop').url()}
            alt={kitten.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-sm bg-slate-50">
            {pageText?.photoUnavailable || 'Foto non disponibile'}
          </div>
        )}
        {kitten.status && (
          <div className="absolute top-3 right-3">
            <StatusPill status={kitten.status} />
          </div>
        )}
      </div>

      <div className="px-5 pt-4 pb-5 flex flex-col gap-1">
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
          <p className="text-xs text-[#6a85a0]">{pageText?.bornLabel || 'Nato/a'}: {fmtDate(kitten.birthDate)}</p>
        )}

        {kitten.slug ? (
          <Link
            href={`/${locale}/cat/${kitten.slug}`}
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors group/link"
          >
            <span>{pageText?.details || 'Scheda completa'}</span>
            <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </Link>
        ) : (
          <p className="mt-3 text-xs text-slate-400 italic">{pageText?.sheetNotAvailable || 'Scheda non ancora disponibile'}</p>
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
    <main className="pt-[120px] pb-32 bg-[#b7bfcc] min-h-screen text-[#1f2f43]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className="mb-10 flex items-center gap-2 text-xs text-[#4a6580]">
          <Link href={`/${locale}/gattini-disponibili`} className="hover:text-[#2f6f99] transition-colors">
            {listText?.title || 'Gattini disponibili'}
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[#1f3c57] font-medium">{litter.title || pageText?.litterTitle || 'Cucciolata'}</span>
        </nav>

        {/* ── Hero: cover + title ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
          {/* Photo */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-100">
            {coverImg ? (
              <img
                src={urlFor(coverImg).width(1200).height(900).fit('crop').url()}
                alt={litter.title || pageText?.litterTitle || 'Cucciolata'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <span className="text-slate-300 text-4xl font-serif italic tracking-widest">◦ ◦ ◦</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-[#2f6f99]/70 font-semibold mb-2">
              Imperial Line
            </p>
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#1f3c57] leading-tight">
              {litter.title || pageText?.litterTitle || 'Cucciolata'}
            </h1>
            <div className="mt-3 w-10 h-[2px] rounded-full bg-[#2f6f99]/35" />

            <div className="mt-5 space-y-2 text-sm text-[#4a6580]">
              {litter.status && (
                <p>
                  <span className="font-semibold text-[#1f3c57]">{pageText?.statusLabel || 'Stato'}:</span>{' '}
                  {litter.status}
                </p>
              )}
              {isPlanned && litter.plannedDate && (
                <p>
                  <span className="font-semibold text-[#1f3c57]">{pageText?.expectedDateLabel || 'Data prevista'}:</span>{' '}
                  {fmtDate(litter.plannedDate)}
                </p>
              )}
              {!isPlanned && litter.birthDate && (
                <p>
                  <span className="font-semibold text-[#1f3c57]">{pageText?.birthDateLabel || 'Data di nascita'}:</span>{' '}
                  {fmtDate(litter.birthDate)}
                </p>
              )}
              {kittens.length > 0 && (
                <p>
                  <span className="font-semibold text-[#1f3c57]">{pageText?.kittensCountLabel || 'Numero cuccioli'}:</span>{' '}
                  {kittens.length}
                </p>
              )}
            </div>

            {litter.notes && (
              <p className="mt-5 text-[#3a5570] leading-relaxed text-sm md:text-base">
                {litter.notes}
              </p>
            )}
          </div>
        </div>

        {/* ── Parents ──────────────────────────────────────────────── */}
        {(litter.father || litter.mother) && (
          <section className="mb-16">
            <div className="mb-7">
              <p className="text-xs uppercase tracking-[0.38em] text-[#2f6f99]/70 font-semibold mb-1.5">
                {pageText?.parentsSup || 'Genitori'}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif italic text-[#1f3c57]">
                {pageText?.parentsTitle || 'King & Queen'}
              </h2>
              <div className="mt-3 w-10 h-[2px] rounded-full bg-[#2f6f99]/35" />
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-12 md:gap-20 bg-white/70 rounded-3xl px-8 py-10 border border-white/60 shadow-sm">
              {litter.father && (
                <ParentCard parent={litter.father} role={pageText?.sireLabel || 'Padre (Sire)'} locale={locale} pageText={pageText} />
              )}
              {litter.father && litter.mother && (
                <div className="hidden md:flex items-center">
                  <span className="text-[#2f6f99] text-4xl font-light">×</span>
                </div>
              )}
              {litter.mother && (
                <ParentCard parent={litter.mother} role={pageText?.damLabel || 'Madre (Dam)'} locale={locale} pageText={pageText} />
              )}
            </div>
          </section>
        )}

        {/* ── Kittens ───────────────────────────────────────────────── */}
        <section>
          <div className="mb-7">
            <p className="text-xs uppercase tracking-[0.38em] text-[#2f6f99]/70 font-semibold mb-1.5">
              {isPlanned ? (pageText?.expectedKittensSup || 'Cuccioli attesi') : (pageText?.kittensSup || 'I cuccioli')}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif italic text-[#1f3c57]">
              {isPlanned ? (pageText?.comingSoonTitle || 'In arrivo...') : (pageText?.individualSheetsTitle || 'Schede individuali')}
            </h2>
            <div className="mt-3 w-10 h-[2px] rounded-full bg-[#2f6f99]/35" />
          </div>

          {kittens.length === 0 ? (
            <div className="rounded-2xl border border-white/50 bg-white/50 px-6 py-10 text-center text-sm text-[#3a5570]">
              {isPlanned
                ? (pageText?.expectedEmpty || 'I cuccioli saranno aggiunti non appena nati.')
                : (pageText?.kittensEmpty || 'Nessun cucciolo collegato a questa cucciolata.')}
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
            <span>{pageText?.backToAvailable || 'Torna a Gattini disponibili'}</span>
          </Link>
        </div>

      </div>
    </main>
  )
}
