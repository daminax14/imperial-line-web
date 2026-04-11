import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import { getDictionary, isSupportedLocale } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import GoldBorderCard from '@/components/ui/GoldBorderCard'

type GroupView = 'kings' | 'queens'

type CatGridItem = {
  _id: string
  name: string
  slug?: string
  image?: unknown
  category?: string
  color?: string
}

function normalizeGroup(value: string): GroupView | null {
  const normalized = value.toLowerCase()
  if (normalized === 'kings' || normalized === 'king' || normalized === 'male' || normalized === 'maschi') return 'kings'
  if (normalized === 'queens' || normalized === 'queen' || normalized === 'female' || normalized === 'femmine') return 'queens'
  return null
}

function isKing(cat: CatGridItem): boolean {
  const category = (cat.category || '').trim().toLowerCase()
  return category === 'king' || category === 'kings'
}

function isQueen(cat: CatGridItem): boolean {
  const category = (cat.category || '').trim().toLowerCase()
  return category === 'queen' || category === 'queens'
}

async function getCats(locale: string): Promise<CatGridItem[]> {
  const query = `*[_type == "cat"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    category,
    "color": coalesce(color[${locale}], color.it, color)
  }`

  const data = await client.fetch(query)
  return Array.isArray(data) ? data : []
}

export default async function CatsGroupListPage({
  params,
}: {
  params: Promise<{ locale: string; group: string }>
}) {
  const { locale, group } = await params

  if (!isSupportedLocale(locale)) notFound()

  const normalizedGroup = normalizeGroup(group)
  if (!normalizedGroup) notFound()

  const dict = await getDictionary(locale)
  const groupText = dict?.catsGroupPage || {}

  const cats = await getCats(locale)
  const filteredCats = cats.filter((cat) => (normalizedGroup === 'kings' ? isKing(cat) : isQueen(cat)))

  const sectionTitle = normalizedGroup === 'kings'
    ? (groupText?.kingsLabel || 'Kings')
    : (groupText?.queensLabel || 'Queens')

  return (
    <main className="relative min-h-screen pt-32 pb-24 text-zinc-900 font-sans overflow-hidden bg-[#edf3fb]">
      <CatsEtherealBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 pb-6 border-b border-zinc-200/60">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500 font-semibold mb-3"></p>
              <h1 className="text-4xl md:text-6xl font-serif text-zinc-900">{sectionTitle}</h1>
            </div>

            <div className="inline-flex rounded-full bg-white/60 backdrop-blur-md p-1.5 border border-white/50 shadow-sm">
              <Link
                href={`/${locale}/i-nostri-gatti/kings/elenco`}
                className={`px-7 py-2.5 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all ${
                  normalizedGroup === 'kings' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {groupText?.kingsLabel || 'Kings'}
              </Link>
              <Link
                href={`/${locale}/i-nostri-gatti/queens/elenco`}
                className={`px-7 py-2.5 text-[10px] uppercase tracking-widest font-semibold rounded-full transition-all ${
                  normalizedGroup === 'queens' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {groupText?.queensLabel || 'Queens'}
              </Link>
            </div>
          </div>

          {filteredCats.length === 0 ? (
            <section className="rounded-3xl border border-white/60 bg-white/40 backdrop-blur-sm p-14 text-center">
              <h2 className="text-3xl font-serif text-zinc-600">{groupText?.emptyTitle || 'Nessun soggetto disponibile'}</h2>
              <p className="text-zinc-500 mt-3">{groupText?.emptyDescription || 'I contenuti per questa sezione saranno pubblicati a breve.'}</p>
            </section>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredCats.map((cat) => (
                <GoldBorderCard
                  key={cat._id}
                  className="group"
                  contentClassName="hover:shadow-xl"
                >
                  <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
                    {cat.image ? (
                      <img
                        src={urlFor(cat.image).width(900).height(1100).fit('crop').url()}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs uppercase tracking-widest">
                        {groupText?.imageUnavailable || 'Immagine non disponibile'}
                      </div>
                    )}
                    {cat.slug && (
                      <Link
                        href={`/${locale}/cat/${cat.slug}`}
                        aria-label={`${dict?.availableKittensPage?.details || 'Dettagli'}: ${cat.name}`}
                        className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-[#1f3c57] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full shadow">
                          {dict?.availableKittensPage?.details || 'Dettagli'} →
                        </span>
                      </Link>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-2xl font-serif text-zinc-900 leading-tight">{cat.name}</h2>
                    <p className="text-sm text-zinc-500 mt-1">{cat.color || groupText?.defaultColor || 'Siberian Neva Masquerade'}</p>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {cat.slug && (
                        <Link
                          href={`/${locale}/cat/${cat.slug}`}
                          className="inline-flex items-center rounded-full border border-[#2f6f99]/30 bg-white text-[#2f6f99] text-[11px] uppercase tracking-[0.18em] font-semibold px-4 py-2 hover:border-[#2f6f99] hover:bg-[#2f6f99] hover:text-white transition-colors"
                        >
                          {dict?.availableKittensPage?.details || 'Dettagli'}
                        </Link>
                      )}
                    </div>
                  </div>
                </GoldBorderCard>
              ))}
            </section>
          )}
        </div>
    </main>
  )
}
