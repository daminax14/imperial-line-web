'use client'

import { useMemo, useState } from 'react'
import { HorizontalImageStack } from '@/components/ui/horizontal-image-stack'

type LitterPhotoGalleryProps = {
  mainImage?: string
  extraImages?: string[]
  title: string
  texts?: {
    previousLabel?: string
    nextLabel?: string
    dotLabel?: string
    scrollLeft?: string
    scrollRight?: string
    openPhoto?: string
    scrollHint?: string
  }
}

export default function LitterPhotoGallery({ mainImage, extraImages, title, texts }: LitterPhotoGalleryProps) {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null)

  const images = useMemo(() => {
    const list = [mainImage, ...(extraImages || [])].filter((item): item is string => Boolean(item))
    return Array.from(new Set(list)).map((src, index) => ({
      id: `${title}-${index + 1}`,
      src,
      alt: `${title} ${index + 1}`,
    }))
  }, [mainImage, extraImages, title])

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-[1.7rem]">
        <span className="text-slate-300 text-4xl font-serif italic tracking-widest">◦ ◦ ◦</span>
      </div>
    )
  }

  return (
    <>
      <div className="relative rounded-[1.7rem] overflow-hidden">
        <HorizontalImageStack
          images={images}
          className="h-[540px] min-h-0 rounded-[1.7rem] bg-transparent"
          onImageClick={(image) => setZoomImage({ src: image.src, alt: image.alt })}
          imageClickLabel={texts?.openPhoto || 'Open photo'}
          texts={{
            previousLabel: texts?.previousLabel || texts?.scrollLeft,
            nextLabel: texts?.nextLabel || texts?.scrollRight,
            dotLabel: texts?.dotLabel || texts?.openPhoto,
          }}
        />
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setZoomImage(null)}
          role="button"
          tabIndex={0}
        >
          <div className="relative inline-block max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute -top-10 right-0 text-white text-sm uppercase tracking-widest"
            >
              Close ✕
            </button>
            <img
              src={zoomImage.src}
              alt={zoomImage.alt}
              className="max-w-full max-h-[86vh] object-contain rounded-2xl bg-slate-900/50"
            />
          </div>
        </div>
      )}
    </>
  )
}
