import React from 'react'
import { getDictionary } from '@/lib/get-dictionary'
import CatsEtherealBackground from '@/components/CatsEtherealBackground'
import { client } from '@/lib/sanity'
import RichTextContent from '@/components/RichTextContent'

type AdviceTip = {
  title: string
  description: string
  icon: string
  points: string[]
}

type AdviceSectionTip = {
  emoji?: string
  title?: string
  text?: unknown
}

type AdviceSection = {
  id: string
  title: string
  subtitle: unknown
  tips: AdviceSectionTip[]
}

function hasRenderableContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return false
}

function safeLocale(locale: string): 'it' | 'en' | 'de' | 'fr' {
  if (locale === 'en' || locale === 'de' || locale === 'fr') return locale
  return 'it'
}

async function getAdviceSections(locale: string): Promise<AdviceSection[]> {
  const currentLocale = safeLocale(locale)
  const query = `*[_type == "adviceSection" && isVisible != false] | order(order asc) {
    _id,
    "title": coalesce(title.${currentLocale}, title.it, ""),
    "subtitle": coalesce(subtitle.${currentLocale}, subtitle.it, []),
    "tips": tips[]{
      "emoji": coalesce(emoji, "✨"),
      "title": coalesce(title.${currentLocale}, title.it, ""),
      "text": coalesce(text.${currentLocale}, text.it, [])
    }
  }`

  const rows = await client.fetch(query)
  if (!Array.isArray(rows)) return []

  return rows
    .map((row: any, index: number) => ({
      id: typeof row?._id === 'string' && row._id.trim().length > 0 ? row._id : `advice-${index + 1}`,
      title: typeof row?.title === 'string' ? row.title.trim() : '',
      subtitle: row?.subtitle,
      tips: Array.isArray(row?.tips)
        ? row.tips
            .map((tip: any) => ({
              emoji: typeof tip?.emoji === 'string' ? tip.emoji : '✨',
              title: typeof tip?.title === 'string' ? tip.title.trim() : '',
              text: tip?.text,
            }))
            .filter((tip: AdviceSectionTip) => tip.title)
        : [],
    }))
    .filter((section: AdviceSection) => section.title.length > 0 && section.tips.length > 0)
}

export default async function ConsigliPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [dict, cmsSections] = await Promise.all([getDictionary(locale), getAdviceSections(locale)])
  const advice = dict?.advicePage || {}
  const contactEmail = 'Imperial-line-siberians@hotmail.com'
  const tips = (advice?.tips || []) as AdviceTip[]

  const hasCmsSections = cmsSections.length > 0

  return (
    <main className="relative pt-[186px] pb-24 bg-[#edf3fb] min-h-screen overflow-hidden">
      <CatsEtherealBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header Sezione */}
        <div className="max-w-3xl mb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-200 font-semibold mb-4">{advice?.eyebrow || "Guida all'Eccellenza"}</p>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">
            {advice?.titleLine1 || 'Vivere con un'} <br/><span className="italic">{advice?.titleAccent || 'Siberiano'}</span>
          </h1>
          <p className="text-xl text-slate-500 mt-6 leading-relaxed">
            {advice?.intro || 'Non e solo un gatto, e un membro della famiglia regale. Ecco come garantirgli una vita sana, felice e degna della sua maestosita.'}
          </p>
        </div>

        {/* Griglia Consigli */}
        {hasCmsSections ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {cmsSections.map((section) => (
              <div key={section.id} className="group p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-50 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-gold-200/10 transition-colors"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">{section.title}</h3>
                  {hasRenderableContent(section.subtitle) && (
                    <RichTextContent value={section.subtitle} className="text-slate-500 mb-8 leading-relaxed" />
                  )}

                  <ul className="space-y-5">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="space-y-1.5">
                        <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <span className="text-lg leading-none">{tip.emoji || '✨'}</span>
                          <span>{tip.title}</span>
                        </p>
                        {hasRenderableContent(tip.text) && (
                          <RichTextContent value={tip.text} className="text-sm text-slate-600 leading-relaxed pl-7" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}

        {/* CTA Finale */}
        <div className="mt-24 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          {/* Un tocco di design per non renderlo un banale rettangolo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">{advice?.ctaTitle || 'Hai altre domande?'}</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
            {advice?.ctaDescription || 'Siamo a tua disposizione per consulenze pre e post-adozione. La salute dei nostri cuccioli e la nostra priorita assoluta.'}
          </p>
          <a href={`mailto:${contactEmail}`} className="inline-block bg-gold-200 text-white font-bold py-5 px-14 rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-lg break-all">
            {contactEmail}
          </a>
        </div>

      </div>
    </main>
  )
}