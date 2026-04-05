import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import { getDictionary } from '@/lib/get-dictionary'

// Funzione per prendere i dati del gatto filtrando per lingua
async function getCat(slug: string, locale: string) {
  const query = `*[_type == "cat" && slug.current == $slug][0] {
    name,
    "imageUrl": image.asset->url,
    category,
    // Recupero localizzato con fallback su IT
    "description": coalesce(description[${locale}], description.it),
    "color": coalesce(color[${locale}], color.it),
    birthDate,
    health,
    breed,
    sex,
    emsCode,
    status,
    father->{
      name,
      "imageUrl": image.asset->url,
      titles
    },
    mother->{
      name,
      "imageUrl": image.asset->url,
      titles
    }
  }`
  const data = await client.fetch(query, { slug })
  return data
}

export default async function CatPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const cat = await getCat(slug, locale);
  const dict = await getDictionary(locale as 'it' | 'en' | 'de');

  if (!cat) return <div className="p-20 text-center text-xl font-serif">Miao? Not found.</div>

  // Badge Status dinamico
  const statusColors: Record<string, string> = {
    'Disponibile': 'bg-emerald-100 text-emerald-800',
    'Riservato': 'bg-amber-100 text-amber-800',
    'In Valutazione': 'bg-blue-100 text-blue-800',
    'Rimane in Allevamento': 'bg-gold-200/20 text-slate-800'
  }
  const statusStyle = cat.status ? statusColors[cat.status] || 'bg-slate-100 text-slate-800' : 'hidden';

  return (
    <main className="bg-[#c2c8d4] min-h-screen pt-[120px] pb-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* PARTE 1: PRESENTAZIONE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gold-200/5 rounded-[3rem] transform -rotate-2 transition-transform group-hover:rotate-0"></div>
            <img 
              src={urlFor(cat.imageUrl).width(1200).url()} 
              className="relative rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/5] z-10" 
              alt={cat.name} 
            />
            {cat.status && (
              <div className={`absolute top-6 right-6 z-20 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-md backdrop-blur-md ${statusStyle}`}>
                {cat.status}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center pt-8">
            <span className="text-gold-200 font-bold uppercase tracking-widest text-xs">
              {cat.category} • {cat.breed || 'Siberian Neva Masquerade'}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mt-4 mb-8 leading-tight">
              {cat.name}
            </h1>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
              <p>{cat.description}</p>
              
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 mt-8">
                <p className="flex items-center gap-3">
                  <span className="text-gold-200">🎂</span> 
                  <strong>{dict.catPage.birth}:</strong> {cat.birthDate || '---'}
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-gold-200">🩺</span> 
                  <strong>{dict.catPage.health}:</strong> {cat.health || 'Tested'}
                </p>
              </div>
            </div>

            <Link href={`/${locale}/contatti`} className="inline-block text-center mt-10 bg-slate-900 text-white py-5 px-10 rounded-full font-bold hover:bg-gold-200 transition-all shadow-lg hover:shadow-gold-200/40 uppercase tracking-widest text-sm">
              {dict.catPage.inquire}
            </Link>
          </div>
        </div>

        {/* PARTE 2: SCHEDA TECNICA */}
        <section className="mt-32">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-serif text-slate-900">{dict.catPage.techDetails}</h2>
            <div className="h-px bg-slate-200 flex-grow"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: dict.catPage.sex, value: cat.sex },
              { label: dict.catPage.color, value: cat.color },
              { label: dict.catPage.ems, value: cat.emsCode },
              { label: dict.catPage.pedigree, value: "ANFI / FIFE" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">{item.label}</p>
                <p className="font-bold text-slate-800 text-lg">{item.value || '---'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PARTE 3: LINEAGE */}
        {(cat.father || cat.mother) && (
          <section className="py-20 bg-white rounded-[3rem] mt-24 shadow-sm border border-slate-50 relative overflow-hidden">
            <div className="text-center mb-16 relative z-10">
              <p className="text-xs uppercase tracking-[0.3em] text-gold-200 font-bold">{dict.catPage.lineage_sub}</p>
              <h3 className="text-4xl font-serif mt-2 italic text-slate-900">{dict.catPage.lineage}</h3>
            </div>

            <div className="flex flex-col items-center gap-8 relative z-10">
              <div className="flex flex-wrap justify-center gap-16 md:gap-40 relative">
                <div className="hidden md:block absolute top-[40%] left-1/2 -translate-x-1/2 w-64 h-px bg-slate-200 -z-10"></div>
                
                {cat.father && (
                  <div className="text-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                      <img src={urlFor(cat.father.imageUrl).width(400).url()} className="w-full h-full object-cover" alt="Sire" />
                    </div>
                    <p className="mt-6 text-[10px] uppercase tracking-widest text-gold-200 font-bold">{dict.catPage.sire}</p>
                    <p className="font-serif italic text-xl mt-1 text-slate-800">{cat.father.name}</p>
                  </div>
                )}

                {cat.mother && (
                  <div className="text-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                      <img src={urlFor(cat.mother.imageUrl).width(400).url()} className="w-full h-full object-cover" alt="Dam" />
                    </div>
                    <p className="mt-6 text-[10px] uppercase tracking-widest text-gold-200 font-bold">{dict.catPage.dam}</p>
                    <p className="font-serif italic text-xl mt-1 text-slate-800">{cat.mother.name}</p>
                  </div>
                )}
              </div>

              <div className="w-px h-16 bg-gradient-to-b from-slate-200 to-gold-200 mt-4"></div>

              <div className="text-center">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden border-8 border-[#c2c8d4] shadow-2xl">
                  <img src={urlFor(cat.imageUrl).width(500).url()} className="w-full h-full object-cover" alt="Current" />
                </div>
                <p className="text-gold-200 tracking-[0.2em] text-[10px] uppercase font-bold mt-4">{dict.catPage.current}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}