import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import KittenInquiryForm from '@/components/KittenInquiryForm'

type KittenInfo = {
  name: string
  slug: string
  imageUrl?: string
  category?: string
}

async function getKitten(slug: string): Promise<KittenInfo | null> {
  const query = `*[_type == "cat" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    category
  }`

  const data = await client.fetch(query, { slug })
  if (!data) return null
  return data
}

function isKittenCategory(category?: string): boolean {
  const value = (category || '').trim().toLowerCase()
  return ['cuccioli', 'cucciolo', 'kitten', 'kittens', 'chaton', 'chatons'].includes(value)
}

export default async function KittenInquiryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const [dict, kitten] = await Promise.all([getDictionary(locale), getKitten(slug)])

  if (!kitten) notFound()

  // Keep this page dedicated to kitten inquiries only.
  if (!isKittenCategory(kitten.category)) notFound()

  const contact = dict?.contactPage || {}

  return (
    <main className="relative min-h-screen pt-[156px] pb-24 overflow-hidden bg-[#edf3fb]">
      <CatsEtherealBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <section className="text-center mb-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#2f6f99] font-semibold">Imperial Line</p>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#2f6f99]">{contact?.title || 'Reservation'}</h1>
          <p className="text-[#2f5f86] leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
            Richiesta personalizzata per <span className="font-semibold">{kitten.name}</span>. Compila il form con i dettagli utili e ti risponderemo il prima possibile.
          </p>
        </section>

        <section className="max-w-4xl mx-auto rounded-[1.6rem] border border-white/55 bg-white/45 backdrop-blur-md shadow-[0_20px_45px_-30px_rgba(32,72,112,0.45)] p-6 md:p-8 mb-10 space-y-4">
          <p className="text-[#2f5f86] leading-relaxed text-sm md:text-base">
            {contact?.introConditions || 'Please read our adoption conditions before submitting the form.'}
          </p>
          <Link
            href={`/${locale}/condizioni-adozione`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f6f99] hover:text-[#1a4f72] transition-colors"
          >
            <span>{contact?.conditionsCta || 'Go to adoption conditions'}</span>
            <span>→</span>
          </Link>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.08fr,0.92fr] gap-8 items-start">
          <div className="rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-md shadow-[0_24px_60px_-35px_rgba(32,72,112,0.5)] p-5 md:p-7">
            <KittenInquiryForm
              locale={locale}
              kitten={{
                slug: kitten.slug,
                name: kitten.name,
                imageUrl: kitten.imageUrl,
              }}
            />
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/50 bg-white/35 backdrop-blur-md shadow-[0_18px_36px_-28px_rgba(32,72,112,0.45)] p-5">
              <p className="text-[#2f5f86] text-sm leading-relaxed">
                Ti contatteremo con priorita riguardo a {kitten.name}, tenendo conto di disponibilita, tempi e compatibilita con la tua famiglia.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/50 bg-white/35 backdrop-blur-md shadow-[0_18px_36px_-28px_rgba(32,72,112,0.45)] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#2f6f99]/80 font-semibold mb-4">Contatto rapido</p>
              <p className="text-[#2f5f86] text-sm leading-relaxed">
                Se preferisci, puoi anche scriverci direttamente via email dopo aver inviato la richiesta, indicando sempre il nome del gattino.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
