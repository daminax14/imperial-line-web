import React from 'react'

const tips = [
  {
    title: "L'Arrivo a Casa",
    description: "I primi giorni sono cruciali. Crea una 'stanza sicura' con tutto il necessario prima di esplorare il resto della casa. Il Siberiano è curioso ma ha bisogno dei suoi tempi.",
    icon: "🏠",
    points: ["Prepara una lettiera pulita", "Evita rumori forti i primi giorni", "Usa diffusori di feromoni per il relax"]
  },
  {
    title: "Nutrizione Regale",
    description: "Un gatto imponente come il Siberiano ha bisogno di proteine di altissima qualità. Evita cereali e punta su diete bilanciate, secche e umide.",
    icon: "🥩",
    points: ["Proteine animali al primo posto", "Acqua sempre fresca (meglio se a fontanella)", "Integrazione di Taurina"]
  },
  {
    title: "Vita Sociale",
    description: "Il Siberiano è spesso chiamato 'il gatto-cane'. Ama la compagnia e soffre la solitudine prolungata. Impara a giocare con lui quotidianamente.",
    icon: "🐈",
    points: ["Sessioni di gioco di 15 min", "Stimolazione mentale con puzzle", "Socializzazione graduale con altri pet"]
  }
]

export default function ConsigliPage() {
  return (
    <main className="pt-[150px] pb-24 bg-[#FCFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Sezione */}
        <div className="max-w-3xl mb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-200 font-semibold mb-4">Guida all'Eccellenza</p>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">
            Vivere con un <br/><span className="italic">Siberiano</span>
          </h1>
          <p className="text-xl text-slate-500 mt-6 leading-relaxed">
            Non è solo un gatto, è un membro della famiglia regale. Ecco come garantirgli una vita sana, felice e degna della sua maestosità.
          </p>
        </div>

        {/* Griglia Consigli */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {tips.map((tip, index) => (
            <div key={index} className="group p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-50 relative overflow-hidden">
              {/* Decorazione asimmetrica */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-gold-200/10 transition-colors"></div>
              
              <div className="relative z-10">
                <span className="text-4xl mb-6 block">{tip.icon}</span>
                <h3 className="text-2xl font-serif text-slate-900 mb-4">{tip.title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  {tip.description}
                </p>
                
                <ul className="space-y-3">
                  {tip.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <span className="w-1.5 h-1.5 bg-gold-200 rounded-full"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Finale */}
        <div className="mt-24 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          {/* Un tocco di design per non renderlo un banale rettangolo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">Hai altre domande?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
            Siamo a tua disposizione per consulenze pre e post-adozione. La salute dei nostri cuccioli è la nostra priorità assoluta.
          </p>
          <a href="/contatti" className="inline-block bg-gold-200 text-white font-bold py-5 px-14 rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-lg">
            Scrivici su WhatsApp
          </a>
        </div>

      </div>
    </main>
  )
}