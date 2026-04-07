'use client'

import { useMemo, useState } from 'react'

type CatPhotoGalleryProps = {
  mainImage?: string
  extraImages?: string[]
  name: string
}

export default function CatPhotoGallery({ mainImage, extraImages, name }: CatPhotoGalleryProps) {
  const images = useMemo(() => {
    const list = [mainImage, ...(extraImages || [])].filter((item): item is string => Boolean(item))
    return Array.from(new Set(list))
  }, [mainImage, extraImages])

  const [activeImage, setActiveImage] = useState(images[0] || '')

  if (!activeImage) {
    return (
      <div className="relative rounded-[2.5rem] bg-slate-100 border border-slate-200 aspect-[4/5] flex items-center justify-center text-slate-400 text-sm">
        Foto non disponibile
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <img
        src={activeImage}
        className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/5] z-10"
        alt={name}
      />

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 5).map((imgSrc, index) => {
            const selected = imgSrc === activeImage
            return (
              <button
                key={`${imgSrc}-${index}`}
                type="button"
                onClick={() => setActiveImage(imgSrc)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                  selected ? 'border-gold-200 shadow-md' : 'border-white/70 hover:border-[#2f6f99]'
                }`}
                aria-label={`Apri foto ${index + 1} di ${name}`}
              >
                <img src={imgSrc} alt={`${name} anteprima ${index + 1}`} className="w-full aspect-square object-cover" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
