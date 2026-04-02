import React from 'react'

export default function ContattiPage() {
  return (
    <main className="pt-[150px] pb-24 bg-[#FCFAF8] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Intestazione Pagina */}
        <div className="text-center mb-20 space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-200 font-semibold italic">Inizia un Legame</p>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900">Entra in Contatto</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto pt-4 leading-relaxed">
            Siamo qui per rispondere a ogni tua curiosità sui nostri esemplari e guidarti nella scelta del tuo futuro compagno regale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* LATO SINISTRO: Info e Social */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-slate-800 italic">Dati di Contatto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gold-200">📍</div>
                  <div>
                    <h4 className="font-bold text-slate-900">-TODO-Sede</h4>
                    <p className="text-slate-500">-TODO-Germania--</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gold-200">📧</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email </h4>
                    <p className="text-slate-500">-TODO- email per contatti</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gold-200">📞</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Telefono / WhatsApp</h4>
                    <p className="text-slate-500">-TODO- numero di telefono</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box Orari/Disponibilità */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm italic text-slate-600">
              -TODO- Info aggiuntive, tipo orari o disponibilità -
            </div>
          </div>

          {/* LATO DESTRO: Il Form "Morbido" */}
          <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl shadow-slate-200/50">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Nome</label>
                  <input type="text" placeholder="Il tuo nome" className="w-full bg-[#FCFAF8] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-200/20 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Email</label>
                  <input type="email" placeholder="E-mail" className="w-full bg-[#FCFAF8] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-200/20 transition-all outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Interessato a...</label>
                <select className="w-full bg-[#FCFAF8] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-200/20 transition-all outline-none appearance-none">
                  <option>Informazioni Generali</option>
                  <option>Cuccioli Disponibili</option>
                  <option>Prenotazione Visita</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">Messaggio</label>
                <textarea rows={5} placeholder="Raccontaci brevemente di te e della tua esperienza con i gatti..." className="w-full bg-[#FCFAF8] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-200/20 transition-all outline-none resize-none"></textarea>
              </div>

              <button className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-gold-200 transition-all shadow-lg hover:shadow-gold-200/40">
                Invia Messaggio
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  )
}