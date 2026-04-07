import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import HomeKnowledgeTopics from '@/components/HomeKnowledgeTopics'

type TopicItem = {
  id: string
  title: string
  content: string
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const homePage = dict?.homePage || {}
  const siberianTopics = (homePage?.topics || []) as TopicItem[]

 return (
  <main className="relative min-h-screen text-[#1A1A1A] font-sans overflow-hidden">
    <CatsEtherealBackground />

    {/* 1. HERO SECTION */}
    <section className="relative z-10 h-[85vh] w-full mt-[80px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 scale-110">
        <img 
          src="/main_menu.JPG" 
          className="w-full h-full object-cover object-[34%_38%] md:object-center opacity-90 animate-slow-zoom" 
          alt="Imperial Line – Siberian Neva Masquerade" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-[#e5e7eb]"></div>
      </div>
      
      <div className="relative z-10 text-center px-6">
        <div className="inline-block px-3 py-1 mb-4 border border-white/30 backdrop-blur-md rounded-full">
           <p className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Est. 2024 — Excellence</p>
        </div>
        <h1 className="text-1xl md:text-5xl font-serif italic text-white leading-tight mb-6 drop-shadow-2xl break-words">
          {dict.hero.title} <br/> 
          <span className="text-[#D4AF37]  md:text-2xl drop-shadow-sm">{dict.hero.subtitle}</span>
        </h1>
        <p className="text-xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
          {dict.hero.description}
        </p>
      </div>
    </section>

    <HomeKnowledgeTopics
      topics={siberianTopics}
      eyebrow={homePage?.knowledgeEyebrow || 'Knowledge Base'}
      title={homePage?.knowledgeTitle || 'Insights'}
      emptyText={homePage?.knowledgeEmpty || 'Content is being updated.'}
    />

  </main>
)
}