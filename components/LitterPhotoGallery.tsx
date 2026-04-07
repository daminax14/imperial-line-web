'use client'

import { useMemo, useRef, useState } from 'react'

type LitterPhotoGalleryProps = {
  mainImage?: string
  extraImages?: string[]
  title: string
}

export default function LitterPhotoGallery({ mainImage, extraImages, title }: LitterPhotoGalleryProps) {
  const images = useMemo(() => {
    const list = [mainImage, ...(extraImages || [])].filter((item): item is string => Boolean(item))
    return Array.from(new Set(list))
  }, [mainImage, extraImages])

  const [activeImage, setActiveImage] = useState(images[0] || '')
  const thumbsRef = useRef<HTMLDivElement | null>(null)

  const scrollThumbs = (direction: 'left' | 'right') => {
    if (!thumbsRef.current) return
    thumbsRef.current.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  if (!activeImage) {
    return (
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-[1.7rem]">
        <span className="text-slate-300 text-4xl font-serif italic tracking-widest">◦ ◦ ◦</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[1.7rem] overflow-hidden aspect-[4/3] bg-slate-100">
        <img src={activeImage} alt={title} className="w-full h-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {images.length > 4 && (
              <button
                type="button"
                onClick={() => scrollThumbs('left')}
                className="flex-shrink-0 w-8 h-8 rounded-full border border-white/70 bg-white/85 text-slate-700 hover:bg-[#2f6f99] hover:text-white transition-colors"
                aria-label="Scorri foto a sinistra"
              >
                ‹
              </button>
            )}

            <div
              ref={thumbsRef}
              className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-thin scrollbar-thumb-[#2f6f99]/40 scrollbar-track-transparent"
            >
              {images.map((imgSrc, index) => {
                const selected = imgSrc === activeImage
                return (
                  <button
                    key={`${imgSrc}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(imgSrc)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 w-[78px] ${
                      selected ? 'border-gold-200 shadow-md' : 'border-white/70 hover:border-[#2f6f99]'
                    }`}
                    aria-label={`Apri foto ${index + 1}`}
                  >
                    <img src={imgSrc} alt={`${title} ${index + 1}`} className="w-full aspect-square object-cover" />
                  </button>
                )
              })}
            </div>

            {images.length > 4 && (
              <button
                type="button"
                onClick={() => scrollThumbs('right')}
                className="flex-shrink-0 w-8 h-8 rounded-full border border-white/70 bg-white/85 text-slate-700 hover:bg-[#2f6f99] hover:text-white transition-colors"
                aria-label="Scorri foto a destra"
              >
                ›
              </button>
            )}
          </div>

          {images.length > 4 && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Scorri per vedere tutte le foto</p>
          )}
        </div>
      )}
    </div>
  )
}
