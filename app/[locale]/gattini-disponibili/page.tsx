import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import { getLitterDisplayTitle } from '@/lib/utils'

/* ─── Types ─────────────────────────────────────────────────────────── */

type AvailableKitten = {
  _id: string
  name: string
  slug?: string
  image?: any
  sex?: string
  color?: string
  birthDate?: string
  status?: string
}

type LitterItem = {
  _id: string
  slug?: string
  letter?: string
  title?: string
  status?: string
  notes?: string
  plannedDate?: string
  birthDate?: string
  fatherName?: string
  fatherSlug?: string
  motherName?: string
  motherSlug?: string
  fatherImage?: any
  motherImage?: any
  coverImage?: any
}

/* ─── Data fetching ─────────────────────────────────────────────────── */

async function getAvailableKittens(locale: string): Promise<AvailableKitten[]> {
  const query = `*[_type == "cat" && (
    category in ["Cuccioli", "Kitten", "Cucciolo", "Gattino"] &&
    (
      !defined(status) ||
      status in ["Disponibile", "Available", "Disponible", "Libero", "Free", "In Valutazione"]
    )
  )] | order(birthDate desc) {
    _id,
    name,
    "slug": slug.current,
    image,
    sex,
    "color": coalesce(color[$locale], color.it, color),
    birthDate,
    status
  }`
  const data = await client.fetch(query, { locale })
  return Array.isArray(data) ? data : []
}

async function getLitters(locale: string): Promise<LitterItem[]> {
  const query = `*[_type == "litter"] | order(coalesce(plannedDate, birthDate, _createdAt) desc) {
    _id,
    "slug": slug.current,
    letter,
    "title": coalesce(title[$locale], title.it, title),
    status,
    "notes": coalesce(notes[$locale], notes.it, notes),
    plannedDate,
    birthDate,
    "fatherName": father->name,
    "fatherSlug": father->slug.current,
    "motherName": mother->name,
    "motherSlug": mother->slug.current,
    "fatherImage": father->image,
    "motherImage": mother->image,
    coverImage
  }`
  const data = await client.fetch(query, { locale })
  return Array.isArray(data) ? data : []
}

/* ─── Utils ─────────────────────────────────────────────────────────── */

function isPlannedLitter(item: LitterItem): boolean {
  const s = (item.status || '').toLowerCase()
  return (
    s.includes('programm') ||
    s.includes('attesa') ||
    (!item.birthDate && Boolean(item.plannedDate))
  )
}

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

function normalizeSexKey(value?: string): 'male' | 'female' | 'unknown' {
  const v = (value || '').trim().toLowerCase()
  if (!v) return 'unknown'
  if (v.includes('masch') || v.includes('male') || v === 'm') return 'male'
  if (v.includes('femmin') || v.includes('female') || v === 'f') return 'female'
  return 'unknown'
}

/* ─── Shared primitives ─────────────────────────────────────────────── */

function SectionHead({ sup, title }: { sup: string; title: string }) {
  return (
    <div className="mb-9">
      <p className="text-xs uppercase tracking-[0.38em] text-[#2f6f99]/70 font-semibold mb-1.5">
        {sup}
      </p>
      <h2 className="text-3xl md:text-4xl font-serif italic text-[#1f3c57]">{title}</h2>
      <div className="mt-3 w-10 h-[2px] rounded-full bg-[#2f6f99]/35" />
    </div>
  )
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/50 px-6 py-10 text-center text-sm text-[#3a5570]">
      {text}
    </div>
  )
}

function StatusPill({ status, labels }: { status?: string; labels?: Record<string, string> }) {
  if (!status) return null
  const s = status.toLowerCase()
  const getStatusKey = (raw: string): string => {
    const value = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (value.includes('disponib') || value.includes('available') || value.includes('disponible') || value.includes('free') || value.includes('libero')) return 'available'
    if (value.includes('verfugbar')) return 'available'
    if (value.includes('valutaz') || value.includes('evaluation')) return 'evaluation'
    if (value.includes('riserv') || value.includes('reserved')) return 'reserved'
    if (value.includes('tenut') || value.includes('held')) return 'held'
    if (value.includes('non in vendita') || value.includes('not for sale')) return 'notForSale'
    if (value.includes('cedut') || value.includes('sold') || value.includes('cede') || value.includes('vendu') || value.includes('vergeben')) return 'sold'
    if (value.includes('rimane in allevamento') || value.includes('stays in cattery')) return 'staysInCattery'
    return 'unknown'
  }

  const statusKey = getStatusKey(s)
  const translated = labels?.[statusKey] || status

  const cls =
    s.includes('disponib') || s.includes('availab')
      ? 'bg-emerald-500 text-white'
      : s.includes('riservat') || s.includes('reserv')
        ? 'bg-gold-200 text-slate-900'
        : s.includes('valutaz')
          ? 'bg-sky-500 text-white'
          : 'bg-slate-500 text-white'
  return (
    <span className={`${cls} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm`}>
      {translated}
    </span>
  )
}

function CirclePhoto({
  image,
  name,
  alt,
  href,
}: {
  image?: any
  name?: string
  alt: string
  href?: string
}) {
  const inner = (
    <>
      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow flex-shrink-0 transition-transform duration-200 group-hover/circle:scale-105">
        {image ? (
          <img
            src={urlFor(image).width(128).height(128).fit('crop').url()}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">◦</div>
        )}
      </div>
      {name && (
        <span className="text-xs font-medium italic text-[#1f3c57] text-center max-w-[90px] truncate">
          {name}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className="group/circle flex flex-col items-center gap-1.5 hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    )
  }
  return <div className="flex flex-col items-center gap-1.5">{inner}</div>
}

/* ─── Kitten card (available now) ───────────────────────────────────── */

function KittenCard({
  kitten,
  locale,
  dict,
  catLabels,
  sexLabels,
}: {
  kitten: AvailableKitten
  locale: string
  dict: any
  catLabels?: Record<string, string>
  sexLabels?: Record<string, string>
}) {
  const detailsText = dict?.viewDetails || dict?.details || 'View details'
  const sexKey = normalizeSexKey(kitten.sex)
  const localizedSex = sexLabels?.[sexKey] || kitten.sex || '—'

  return (
    <article className="group rounded-2xl overflow-hidden bg-white/90 border border-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        {kitten.image ? (
          <img
            src={urlFor(kitten.image).width(700).height(933).fit('crop').url()}
            alt={kitten.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm italic text-slate-400 bg-slate-50">
            {dict?.photoUnavailable || 'Photo not available'}
          </div>
        )}
        {kitten.status && (
          <div className="absolute top-3 right-3">
            <StatusPill status={kitten.status} labels={catLabels} />
          </div>
        )}
        {kitten.slug && (
          <Link
            href={`/${locale}/cat/${kitten.slug}`}
            aria-label={`${detailsText}: ${kitten.name}`}
            className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#1f3c57] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full shadow">
              {detailsText} →
            </span>
          </Link>
        )}
      </div>
      <div className="px-5 pt-4 pb-5">
        <h3 className="text-[1.55rem] font-serif italic text-[#1f3c57] leading-tight">
          {kitten.name}
        </h3>
        <p className="text-sm text-[#4a6580] mt-1.5">
          {localizedSex}&nbsp;&middot;&nbsp;{kitten.color || '—'}
        </p>
        {kitten.birthDate && (
          <p className="text-xs text-[#6a85a0] mt-1">
            {dict?.bornLabel || 'Born'}: {fmtDate(kitten.birthDate, locale)}
          </p>
        )}
        {kitten.slug && (
          <Link
            href={`/${locale}/cat/${kitten.slug}`}
            className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors group/link"
          >
            <span>{dict?.details || 'Full profile'}</span>
            <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}

/* ─── Planned litter card ───────────────────────────────────────────── */

function PlannedLitterCard({
  litter,
  dict,
  locale,
}: {
  litter: LitterItem
  dict: any
  locale: string
}) {
  const coverImg = litter.coverImage ?? null
  const detailsText = dict?.viewDetails || dict?.litterDetails || 'View details'
  const litterDisplayTitle = getLitterDisplayTitle(litter.title, litter.letter, dict?.newLitterTitle || 'New litter')

  return (
    <article className="group rounded-2xl overflow-hidden bg-white/90 border border-white/60 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row">
        {coverImg && (
          <div className="relative md:w-72 flex-shrink-0 overflow-hidden">
            <div className="aspect-[4/3] md:h-full md:aspect-auto">
              <img
                src={urlFor(coverImg).width(600).height(480).fit('crop').url()}
                alt={litterDisplayTitle}
                className="w-full h-full object-cover"
              />
            </div>
            {litter.slug && (
              <Link
                href={`/${locale}/cucciolate/${litter.slug}`}
                aria-label={`${detailsText}: ${litterDisplayTitle}`}
                className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#1f3c57] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full shadow">
                  {detailsText} →
                </span>
              </Link>
            )}
          </div>
        )}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#2f6f99]/70 font-semibold mb-1">
              {dict?.plannedLabel || 'Planned litter'}
            </p>
            {litter.slug ? (
              <Link
                href={`/${locale}/cucciolate/${litter.slug}`}
                className="group/title inline-block"
              >
                <h3 className="text-2xl md:text-3xl font-serif italic text-[#1f3c57] leading-snug group-hover/title:text-[#2f6f99] transition-colors">
                  {litterDisplayTitle}
                </h3>
              </Link>
            ) : (
              <h3 className="text-2xl md:text-3xl font-serif italic text-[#1f3c57] leading-snug">
                {litterDisplayTitle}
              </h3>
            )}
            {litter.plannedDate && (
              <p className="text-sm text-[#4a6580] mt-1.5">
                {dict?.expectedLabel || 'Prevista'}:{' '}
                <span className="font-semibold">{fmtDate(litter.plannedDate, locale)}</span>
              </p>
            )}
          </div>
          {(litter.fatherName || litter.motherName) && (
            <div className="flex items-center gap-5">
              <CirclePhoto
                image={litter.fatherImage}
                name={litter.fatherName}
                alt={litter.fatherName || dict?.fatherLabel || 'Padre'}
                href={litter.fatherSlug ? `/${locale}/cat/${litter.fatherSlug}` : undefined}
              />
              <span className="text-[#2f6f99] text-xl font-light leading-none">×</span>
              <CirclePhoto
                image={litter.motherImage}
                name={litter.motherName}
                alt={litter.motherName || dict?.motherLabel || 'Madre'}
                href={litter.motherSlug ? `/${locale}/cat/${litter.motherSlug}` : undefined}
              />
            </div>
          )}
          {litter.notes && (
            <p className="text-sm text-[#4a6580] leading-relaxed line-clamp-3 max-w-prose">
              {litter.notes}
            </p>
          )}
          {litter.slug && (
            <Link
              href={`/${locale}/cucciolate/${litter.slug}`}
              className="inline-flex items-center gap-1 mt-1 text-sm font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors group/link"
            >
              <span>{dict?.litterDetails || 'View litter'}</span>
              <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

/* ─── History litter card ───────────────────────────────────────────── */

function HistoryLitterCard({
  litter,
  locale,
  dict,
}: {
  litter: LitterItem
  locale: string
  dict: any
}) {
  const coverImg = litter.coverImage ?? litter.motherImage ?? litter.fatherImage ?? null
  const href = litter.slug ? `/${locale}/cucciolate/${litter.slug}` : undefined
  const litterDisplayTitle = getLitterDisplayTitle(litter.title, litter.letter, dict?.litterTitle || 'Litter')

  const cardContent = (
    <>
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {coverImg ? (
          <img
            src={urlFor(coverImg).width(700).height(525).fit('crop').url()}
            alt={litterDisplayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="text-slate-300 text-3xl font-serif italic tracking-widest">◦ ◦ ◦</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white font-serif italic text-lg leading-tight drop-shadow">
            {litterDisplayTitle}
          </p>
          {litter.birthDate && (
            <p className="text-white/75 text-xs mt-0.5">{fmtDate(litter.birthDate, locale)}</p>
          )}
        </div>
        {href && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#1f3c57] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full shadow">
              {dict?.viewDetails || 'View details'} →
            </span>
          </div>
        )}
      </div>

      <div className="px-5 py-4">
        {(litter.fatherName || litter.motherName) && (
          <div className="flex items-center gap-3 mb-3">
            <CirclePhoto
              image={litter.fatherImage}
              name={litter.fatherName}
              alt={litter.fatherName || dict?.fatherLabel || 'Padre'}
            />
            <span className="text-[#2f6f99] font-light text-lg">×</span>
            <CirclePhoto
              image={litter.motherImage}
              name={litter.motherName}
              alt={litter.motherName || dict?.motherLabel || 'Madre'}
            />
          </div>
        )}
        {litter.notes && (
          <p className="text-xs text-[#6a85a0] leading-relaxed line-clamp-2">
            {litter.notes}
          </p>
        )}
        {href && (
          <p className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[#2f6f99]">
            {dict?.kittenDetails || 'Kitten details'} <span>→</span>
          </p>
        )}
      </div>
    </>
  )

  return (
    <article className="group rounded-2xl overflow-hidden bg-white/90 border border-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer">
      {href ? (
        <Link href={href} className="block">{cardContent}</Link>
      ) : (
        cardContent
      )}
    </article>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function AvailableKittensPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const pageText = dict?.availableKittensPage || {}
  const catLabels = dict?.catPage?.statusLabels || {}
  const catSexLabels = dict?.catPage?.sexLabels || {}

  const [availableKittens, litters] = await Promise.all([
    getAvailableKittens(locale),
    getLitters(locale),
  ])

  const plannedLitters = litters.filter(isPlannedLitter)
  const historyLitters = litters.filter((item) => !isPlannedLitter(item))

  return (
    <main className="relative pt-[156px] pb-32 bg-[#edf3fb] min-h-screen text-[#1f2f43] overflow-hidden">
      <CatsEtherealBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.42em] text-[#2f6f99] font-semibold mb-3">
            Imperial Line
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic text-[#2f6f99]">
            {pageText?.title || 'Available kittens'}
          </h1>
          <div className="mt-5 mx-auto w-16 h-px bg-[#2f6f99]/40" />
          <p className="max-w-2xl mx-auto mt-5 text-[#3a5570] leading-relaxed">
            {pageText?.intro ||
              'Browse available kittens, planned litters, and our history.'}
          </p>
        </header>

        <section className="mb-20">
          <SectionHead
            sup={pageText?.availableSup || 'Ready for adoption'}
            title={pageText?.availableTitle || 'Available now'}
          />
          {availableKittens.length === 0 ? (
            <EmptyBox
              text={pageText?.emptyAvailable || 'There are currently no available kittens.'}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {availableKittens.map((kitten) => (
                <KittenCard
                  key={kitten._id}
                  kitten={kitten}
                  locale={locale}
                  dict={pageText}
                  catLabels={catLabels}
                  sexLabels={catSexLabels}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mb-20">
          <SectionHead
            sup={pageText?.plannedSup || 'Coming soon'}
            title={pageText?.plannedTitle || 'Planned litters'}
          />
          {plannedLitters.length === 0 ? (
            <EmptyBox
              text={pageText?.emptyPlanned || 'No planned litters at the moment.'}
            />
          ) : (
            <div className="space-y-6">
              {plannedLitters.map((litter) => (
                <PlannedLitterCard key={litter._id} litter={litter} dict={pageText} locale={locale} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHead
            sup={pageText?.historySup || 'History'}
            title={pageText?.historyTitle || 'Litter history'}
          />
          {historyLitters.length === 0 ? (
            <EmptyBox
              text={pageText?.emptyHistory || 'No historical litters available yet.'}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {historyLitters.map((litter) => (
                <HistoryLitterCard key={litter._id} litter={litter} locale={locale} dict={pageText} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
