import { getDictionary } from '@/lib/get-dictionary'

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const contact = dict?.contactPage || {}
  const fields = contact?.fields || {}
  const options = contact?.options || {}

  return (
    <main className="pt-[120px] pb-24 bg-[#b7bfcc] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-10 space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[#2f6f99] font-semibold">Imperial Line</p>
          <h1 className="text-4xl md:text-6xl font-serif italic text-[#2f6f99]">{contact?.title || 'Prenotazione'}</h1>
          <p className="text-[#2f5f86] max-w-3xl mx-auto leading-relaxed">
            {contact?.intro || 'Compila il modulo per aiutarci a conoscere meglio le tue esigenze.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-9 items-start">
          <div className="bg-[#dce1e8] border border-white/40 rounded-2xl p-5 md:p-6">
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-800">{fields?.name || 'Nome e Cognome*'}</label>
                <input type="text" placeholder={fields?.namePlaceholder || 'Il tuo nome e cognome'} className="w-full bg-[#c8c3ca] text-slate-800 placeholder:text-slate-500 rounded-md px-3 py-2.5 outline-none border border-transparent focus:border-[#2f6f99]/40" />
              </div>

              <fieldset className="space-y-1.5">
                <legend className="text-[12px] font-semibold text-slate-800">{fields?.allergic || 'Sei allergico ai gatti?*'}</legend>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="allergic" className="mr-1.5" />{options?.yes || 'Si'}</label>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="allergic" className="mr-1.5" />{options?.no || 'No'}</label>
              </fieldset>

              <fieldset className="space-y-1.5">
                <legend className="text-[12px] font-semibold text-slate-800">{fields?.genderPreference || 'Vuoi una femminuccia o un maschietto?*'}</legend>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="gender" className="mr-1.5" />{options?.female || 'Femmina'}</label>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="gender" className="mr-1.5" />{options?.male || 'Maschio'}</label>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="gender" className="mr-1.5" />{options?.noPreference || 'Non e importante/Non lo so ancora'}</label>
              </fieldset>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-800">{fields?.specificKitten || 'Sei interessato ad un gattino in particolare? *facoltativo'}</label>
                <textarea rows={2} placeholder={fields?.specificKittenPlaceholder || 'Inserisci il tuo messaggio'} className="w-full bg-[#c8c3ca] text-slate-800 placeholder:text-slate-500 rounded-md px-3 py-2.5 outline-none resize-none border border-transparent focus:border-[#2f6f99]/40"></textarea>
              </div>

              <fieldset className="space-y-1.5">
                <legend className="text-[12px] font-semibold text-slate-800">{fields?.futureLitter || 'Vuoi prenotare un gattino da una prossima cucciolata? *facoltativo'}</legend>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="futureLitter" className="mr-1.5" />{options?.yes || 'Si'}</label>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="futureLitter" className="mr-1.5" />{options?.no || 'No'}</label>
              </fieldset>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-800">{fields?.colorPreference || 'Se si, hai qualche preferenza di colore? *facoltativo'}</label>
                <input type="text" placeholder={fields?.colorPlaceholder || 'Risposta breve'} className="w-full bg-[#c8c3ca] text-slate-800 placeholder:text-slate-500 rounded-md px-3 py-2.5 outline-none border border-transparent focus:border-[#2f6f99]/40" />
              </div>

              <fieldset className="space-y-1.5">
                <legend className="text-[12px] font-semibold text-slate-800">{fields?.otherPets || 'Hai altri animali domestici?*'}</legend>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="otherPets" className="mr-1.5" />{options?.otherCats || 'Si, ho altri gatti'}</label>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="otherPets" className="mr-1.5" />{options?.noOtherCats || 'Si, ma non ho altri gatti'}</label>
                <label className="block text-[12px] text-slate-800"><input type="radio" name="otherPets" className="mr-1.5" />{options?.wantCat || 'No, ma vorrei avere un gatto'}</label>
              </fieldset>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-800">{fields?.aboutYou || 'Raccontaci di te*'}</label>
                <textarea rows={2} placeholder={fields?.aboutYouPlaceholder || 'Inserisci il tuo messaggio'} className="w-full bg-[#c8c3ca] text-slate-800 placeholder:text-slate-500 rounded-md px-3 py-2.5 outline-none resize-none border border-transparent focus:border-[#2f6f99]/40"></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-800">{fields?.email || 'Email*'}</label>
                <input type="email" placeholder={fields?.emailPlaceholder || 'Il tuo indirizzo email'} className="w-full bg-[#c8c3ca] text-slate-800 placeholder:text-slate-500 rounded-md px-3 py-2.5 outline-none border border-transparent focus:border-[#2f6f99]/40" />
              </div>

              <button type="button" className="mx-auto block mt-1 bg-[#2f6f99] hover:bg-[#245878] text-white font-semibold px-8 py-2.5 rounded-full text-sm transition-colors">
                {contact?.submit || 'Invia'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1200&auto=format&fit=crop"
              alt="Gattino occhi azzurri"
              className="w-full rounded-2xl object-cover aspect-[3/4]"
            />
            <img
              src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1200&auto=format&fit=crop"
              alt="Gattino silver"
              className="w-full rounded-2xl object-cover aspect-[3/4]"
            />
          </div>
        </div>

        <p className="text-center text-sm text-[#1f2f43] mt-7 leading-relaxed max-w-5xl mx-auto">
          {contact?.thanks || "Grazie per l'interesse verso Imperial Line. Ti ricontatteremo a breve via email o tramite il recapito indicato."}
        </p>
      </div>
    </main>
  )
}