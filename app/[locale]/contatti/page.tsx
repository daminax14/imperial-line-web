import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import ContactRequestForm from '@/components/ContactRequestForm'

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const contact = dict?.contactPage || {}
  const fields = contact?.fields || {}
  const options = contact?.options || {}

  return (
    <main className="relative min-h-screen pt-[120px] pb-24 overflow-hidden bg-[#edf3fb]">
      <CatsEtherealBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <section className="text-center mb-12 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#2f6f99] font-semibold">Imperial Line</p>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#2f6f99]">{contact?.title || 'Prenotazione'}</h1>
          <p className="text-[#2f5f86] max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
            {contact?.intro || 'Compila il modulo per aiutarci a conoscere meglio le tue esigenze.'}
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.08fr,0.92fr] gap-8 items-start">
          <div className="rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-md shadow-[0_24px_60px_-35px_rgba(32,72,112,0.5)] p-5 md:p-7">
            <ContactRequestForm fields={fields} options={options} contact={contact} />
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] overflow-hidden border border-white/50 bg-white/30 backdrop-blur-md shadow-[0_24px_60px_-35px_rgba(32,72,112,0.45)] p-3">
              <img
                src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1200&auto=format&fit=crop"
                alt="Gattino occhi azzurri"
                className="w-full rounded-[1.4rem] object-cover aspect-[4/5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] overflow-hidden border border-white/50 bg-white/30 backdrop-blur-md shadow-[0_18px_36px_-28px_rgba(32,72,112,0.45)] p-2.5">
                <img
                  src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop"
                  alt="Gattino silver"
                  className="w-full rounded-[1rem] object-cover aspect-[3/4]"
                />
              </div>
              <div className="rounded-[1.5rem] border border-white/50 bg-white/35 backdrop-blur-md shadow-[0_18px_36px_-28px_rgba(32,72,112,0.45)] p-5 flex items-center">
                <p className="text-[#2f5f86] text-sm leading-relaxed">
                  {contact?.thanks || "Grazie per l'interesse verso Imperial Line. Ti ricontatteremo a breve via email o tramite il recapito indicato."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}