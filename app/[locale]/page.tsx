import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { getDictionary } from '@/lib/get-dictionary'

async function getCats(locale: string) {
  const query = `*[_type == "cat"] {
    _id,
    "name": name, 
    "slug": slug.current,
    image,
    category,
    "description": coalesce(description[${locale}], description.it)
  }`
  const data = await client.fetch(query)
  return data
}

type TopicItem = {
  id: string
  title: string
  content: string
}

function getSiberianTopics(): TopicItem[] {
  return [
    {
      id: 'topic-1',
      title: 'Storia e origini del gatto siberiano',
      content:
        'Il gatto siberiano nasce nelle regioni fredde della Russia e si e adattato nei secoli a climi rigidi con un mantello fitto e idrorepellente. E una razza naturale, selezionata piu dall ambiente che dall intervento umano, con carattere equilibrato e grande resistenza.',
    },
    {
      id: 'topic-2',
      title: 'La variante Neva Masquerade e le sue caratteristiche',
      content:
        'Il Neva Masquerade e la variante colorpoint del siberiano, riconoscibile per il contrasto tra corpo chiaro e estremita piu scure, spesso con occhi azzurri intensi. Mantiene struttura, temperamento e robustezza del siberiano classico, con un aspetto particolarmente elegante.',
    },
    {
      id: 'topic-3',
      title: 'Perche scegliere un gatto siberiano?',
      content:
        'E una scelta ideale per chi desidera un gatto affettuoso ma non invadente, intelligente e adatto alla vita familiare. Si lega molto alle persone, convive bene con bambini e altri animali e mostra una notevole capacita di adattamento agli spazi domestici.',
    },
    {
      id: 'topic-4',
      title: 'Il gatto siberiano e ipoallergenico?',
      content:
        'Non esiste un gatto completamente anallergico, ma molti soggetti siberiani producono livelli piu bassi della proteina Fel d1 rispetto ad altre razze. Per chi soffre di allergie leggere o moderate puo risultare meglio tollerato, ma la valutazione resta sempre individuale.',
    },
    {
      id: 'topic-5',
      title: 'Sapevi che il gatto Siberiano e utilizzato anche nella pet therapy ?',
      content:
        'Grazie al temperamento socievole e alla sensibilita verso l umore umano, in alcuni contesti il siberiano viene coinvolto in percorsi assistiti. La sua presenza puo favorire rilassamento, motivazione e interazione, soprattutto in attivita educative o di supporto emotivo.',
    },
  ]
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const cats = await getCats(locale)
  const siberianTopics = getSiberianTopics()

 return (
  <main className="relative min-h-screen text-[#1A1A1A] font-sans overflow-hidden">
    
    {/* SFONDO COMPLESSO: Texture + Gradienti */}
    <div className="fixed inset-0 -z-10 bg-[#e5e7eb]">
      {/* Texture a grana (Noise) - Opzionale via CSS o immagine */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* Elementi Geometrici "Vivi" */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-gold-100/30 rounded-full blur-[100px]"></div>
      
      {/* Linee sottili decorative */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-400 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-slate-400 to-transparent"></div>
      </div>
    </div>

    {/* 1. HERO SECTION */}
    <section className="relative h-[85vh] w-full mt-[80px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 scale-110">
        <img 
          src="/main_menu.JPG" 
          className="w-full h-full object-cover opacity-90 animate-slow-zoom" 
          alt="Imperial Line – Siberian Neva Masquerade" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-[#e5e7eb]"></div>
      </div>
      
      <div className="relative z-10 text-center px-6">
        <div className="inline-block px-3 py-1 mb-4 border border-white/30 backdrop-blur-md rounded-full">
           <p className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Est. 2026 — Excellence</p>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif italic text-white leading-tight mb-6 drop-shadow-2xl">
          {dict.hero.title} <br/> 
          <span className="text-yellow-100/90 drop-shadow-sm">{dict.hero.subtitle}</span>
        </h1>
        <p className="text-xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
          {dict.hero.description}
        </p>
      </div>
    </section>

    {/* 1b. GALLERY SECTION – home images */}
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-2 text-center">Imperial Line</p>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-10 text-center leading-tight">
          Il nostro allevamento
        </h2>
        {/* Asymmetric editorial grid */}
        <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[600px] md:h-[680px]">
          {/* Large left image */}
          <div className="col-span-12 md:col-span-5 row-span-2 overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/home_1.JPG"
              alt="Imperial Line – foto 1"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Top-right large */}
          <div className="col-span-6 md:col-span-4 row-span-1 overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/home_2.JPG"
              alt="Imperial Line – foto 2"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Top-far-right */}
          <div className="col-span-6 md:col-span-3 row-span-1 overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/home_3.JPG"
              alt="Imperial Line – foto 3"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Bottom-right */}
          <div className="col-span-6 md:col-span-4 row-span-1 overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/home_4.JPG"
              alt="Imperial Line – foto 4"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Bottom-far-right */}
          <div className="col-span-6 md:col-span-3 row-span-1 overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/home_5.JPG"
              alt="Imperial Line – foto 5"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>

    {/* 2. THE STARS GALLERY */}
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Colonna Sinistra: Topics (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <p className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-2">Knowledge Base</p>
            <h2 className="text-5xl font-serif text-slate-900 mb-8 leading-none">Approfondimenti</h2>
            
            <div className="space-y-4">
              {siberianTopics.map((topic) => (
                <details key={topic.id} name="siberian-topics" className="group border-b border-slate-300/50 pb-4">
                  <summary className="cursor-pointer list-none flex justify-between items-center py-2 group-open:text-amber-700 transition-colors">
                    <span className="font-serif text-xl">{topic.title}</span>
                    <span className="text-2xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="pt-2">
                    <p className="text-sm text-slate-600 leading-relaxed italic">{topic.content}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Colonna Destra: Cards Gatti */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {cats.map((cat: any) => (
                <Link href={`/${locale}/cat/${cat.slug}`} key={cat._id} className="group relative">
                  {/* Card con ombra morbida ed effetto hover solido */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-2xl">
                    <img 
                      src={urlFor(cat.image).width(1000).url()} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                      alt={cat.name} 
                    />
                    {/* Badge sovrapposto */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <p className="text-[9px] uppercase tracking-widest text-white">{cat.category}</p>
                    </div>
                  </div>
                  
                  <div className="text-left translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-3xl font-serif text-slate-800">{cat.name}</h3>
                    <div className="w-0 group-hover:w-full h-px bg-amber-600 transition-all duration-500 mt-2"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>

  </main>
)
}