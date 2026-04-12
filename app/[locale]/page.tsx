import { getDictionary } from '@/lib/get-dictionary'
import { client } from '@/lib/sanity'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import HomeKnowledgeTopics from '@/components/HomeKnowledgeTopics'

type TopicItem = {
  id: string
  title: string
  content: unknown
}

function normalizeDictionaryTopics(raw: unknown): TopicItem[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item, index) => ({
      id: typeof item?.id === 'string' && item.id.trim().length > 0 ? item.id : `topic-${index + 1}`,
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      content: item?.content,
    }))
    .filter((topic) => {
      if (topic.title.length === 0) return false
      if (typeof topic.content === 'string') return topic.content.trim().length > 0
      if (Array.isArray(topic.content)) return topic.content.length > 0
      return false
    })
}

async function getHomeKnowledgeTopics(locale: string): Promise<TopicItem[]> {
  const query = `*[_type == "homeKnowledgeTopic" && coalesce(isVisible, true) == true] | order(order asc) {
    id,
    "title": coalesce(title[$locale], title.it, ""),
    "content": coalesce(content[$locale], content.it, [])
  }`

  const topics = await client.fetch(query, { locale })
  if (!Array.isArray(topics)) return []

  return topics
    .map((topic, index) => ({
      id: typeof topic?.id === 'string' && topic.id.trim().length > 0 ? topic.id : `topic-${index + 1}`,
      title: typeof topic?.title === 'string' ? topic.title.trim() : '',
      content: topic?.content,
    }))
    .filter((topic): topic is TopicItem => (
      topic.title.length > 0 &&
      (
        (typeof topic.content === 'string' && topic.content.trim().length > 0) ||
        (Array.isArray(topic.content) && topic.content.length > 0)
      )
    ))
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const homePage = dict?.homePage || {}
  const cmsTopics = await getHomeKnowledgeTopics(locale)
  const dictionaryTopics = normalizeDictionaryTopics(homePage?.topics)
  const siberianTopics = cmsTopics.length > 0 ? cmsTopics : dictionaryTopics

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
          <div className="inline-block px-3 py-1 mb-4 border border-[#b8891c]/70 backdrop-blur-md rounded-full">
           <p className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Est. 2024 — Excellence</p>
        </div>
        <h1 className="text-1xl md:text-5xl font-serif italic text-white leading-tight mb-6 drop-shadow-2xl break-words">
          {dict.hero.title}
        </h1>
        <p className="text-xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
          {dict.hero.description}
        </p>
        <p className="mt-4 inline-block rounded-full border border-[#b8891c]/70 px-4 py-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-slate-700 font-bold italic shadow-[0_4px_14px_rgba(0,0,0,0.28)] backdrop-blur-sm">
          {dict.hero.subtitle}
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