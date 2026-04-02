import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { getDictionary } from '@/lib/get-dictionary' // Importiamo il caricatore di JSON

// Funzione aggiornata per Sanity: ora accetta la lingua
async function getCats(locale: string) {
  const query = `*[_type == "cat"] {
    _id,
    "name": name, 
    "slug": slug.current,
    image,
    category,
    // Prende la descrizione nella lingua corretta, altrimenti fallback sull'italiano
    "description": coalesce(description[${locale}], description.it)
  }`
  const data = await client.fetch(query)
  return data
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // 1. Recuperiamo la lingua dall'URL
  const { locale } = await params
  
  // 2. Carichiamo il dizionario JSON per i testi fissi (Hero, Bottoni, ecc.)
  const dict = await getDictionary(locale as 'it' | 'en' | 'de')
  
  // 3. Carichiamo i gatti da Sanity passando la lingua
  const cats = await getCats(locale)

  return (
    <main className="bg-[#FCFAF8] min-h-screen text-[#1A1A1A] font-sans">
      
      {/* 1. HERO SECTION - Testi presi dal JSON */}
      <section className="relative h-[60vh] w-full mt-[80px] flex items-center justify-center overflow-hidden bg-slate-100">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=2500" 
            className="w-full h-full object-cover opacity-80 animate-slow-zoom" 
            alt="Siberian Cat Hero" 
          />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white font-semibold drop-shadow-md">Est. 2026</p>
          <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-tight mt-3 mb-6 drop-shadow-lg">
            {dict.hero.title} <br/> <span className="text-gold-200">{dict.hero.subtitle}</span>
          </h1>
          <p className="text-lg text-white/90 font-light leading-relaxed max-w-lg mx-auto drop-shadow-md">
            {dict.hero.description}
          </p>
        </div>
      </section>

      {/* 2. THE STARS GALLERY - Contenuti da Sanity */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-200">Bloodlines</p>
              <h2 className="text-5xl font-serif text-slate-900 mt-1">{dict.nav.cats}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {cats.map((cat: any) => (
              <Link href={`/${locale}/cat/${cat.slug}`} key={cat._id} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-5 bg-slate-100 shadow-sm transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img 
                    src={urlFor(cat.image).width(1000).url()} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    alt={cat.name} 
                  />
                </div>
                <div className="text-center px-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-200 font-semibold">{cat.category}</p>
                  <h3 className="text-2xl font-serif text-slate-800 mt-1">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}