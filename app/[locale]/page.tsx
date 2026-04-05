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

async function getBreedSections(locale: string) {
  const query = `*[_type == "breedSection"] | order(order asc) {
    _id,
    "title": coalesce(title.${locale}, title.it),
    "slug": slug.current,
    "excerpt": coalesce(excerpt.${locale}, excerpt.it)
  }`
  const data = await client.fetch(query)
  return data
}

type BreedSection = {
  _id: string
  title: string
  slug: string
  excerpt?: string
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale as 'it' | 'en' | 'de')
  const [cats, breedSections] = await Promise.all([
    getCats(locale),
    getBreedSections(locale),
  ])

  return (
    <main className="bg-[#c2c8d4] min-h-screen text-[#1A1A1A] font-sans">
      
      {/* 1. HERO SECTION */}
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

      {/* 2. BREED SECTIONS SUBMENU - Testi da Sanity */}
      {Array.isArray(breedSections) && breedSections.length > 0 && (
        <section className="py-12 bg-white/60 backdrop-blur-sm border-b border-white/40">
          <div className="max-w-4xl mx-auto px-6">
            <ul className="divide-y divide-slate-200/70">
              {breedSections.map((section: BreedSection, index: number) => (
                <li key={section._id}>
                  <Link
                    href={`/${locale}/razza/${section.slug}`}
                    className="flex items-start gap-5 py-5 group transition-colors hover:bg-white/40 rounded-xl px-4 -mx-4"
                  >
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-gold-200 flex items-center justify-center text-gold-200 font-bold text-xs group-hover:bg-gold-200 group-hover:text-white transition-all">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-serif text-slate-900 group-hover:text-gold-200 transition-colors leading-snug">
                        {section.title}
                      </h3>
                      {section.excerpt && (
                        <p className="mt-1 text-sm text-slate-500 font-light leading-relaxed line-clamp-2">
                          {section.excerpt}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 mt-1 text-slate-300 group-hover:text-gold-200 transition-colors text-lg">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 3. THE STARS GALLERY - Contenuti da Sanity */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
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