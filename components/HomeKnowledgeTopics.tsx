'use client'

import { useMemo, useState } from 'react'
import RichTextContent from '@/components/RichTextContent'

type TopicItem = {
  id: string
  title: string
  content: unknown
}

export default function HomeKnowledgeTopics({
  topics,
  eyebrow,
  title,
  emptyText,
}: {
  topics: TopicItem[]
  eyebrow: string
  title: string
  emptyText?: string
}) {
  const safeTopics = useMemo(() => (Array.isArray(topics) ? topics : []), [topics])
  const [activeId, setActiveId] = useState(safeTopics[0]?.id || '')

  const activeTopic = safeTopics.find((item) => item.id === activeId) || safeTopics[0]

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-widest text-gold-200 font-bold mb-2">{eyebrow}</p>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">{title}</h2>

            <div className="space-y-3">
              {safeTopics.map((topic) => {
                const selected = topic.id === activeId
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setActiveId(topic.id)}
                    className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                      selected
                        ? 'border-gold-200 bg-white/90 shadow-sm'
                        : 'border-slate-200/70 bg-white/50 hover:border-[#2f6f99]/40 hover:bg-white/70'
                    }`}
                  >
                    <span className={`font-serif text-lg ${selected ? 'text-slate-900' : 'text-slate-700'}`}>{topic.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 md:p-10 shadow-[0_20px_45px_-30px_rgba(35,81,120,0.35)] min-h-[360px]">
              {activeTopic ? (
                <>
                  <h3 className="text-2xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">{activeTopic.title}</h3>
                  <RichTextContent value={activeTopic.content} className="text-slate-700 leading-relaxed text-base md:text-lg max-h-[56vh] overflow-y-auto pr-1" />
                </>
              ) : (
                <p className="text-slate-600">{emptyText || 'Content is being updated.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
