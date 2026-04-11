'use client'

import { useMemo, useState } from 'react'
import { HorizontalImageStack } from '@/components/ui/horizontal-image-stack'

type CatPhotoGalleryProps = {
  mainImage?: string
  extraImages?: string[]
  name: string
  emptyText?: string
  galleryTexts?: {
    previousLabel?: string
    nextLabel?: string
    dotLabel?: string
  }
}

export default function CatPhotoGallery({ mainImage, extraImages, name, emptyText, galleryTexts }: CatPhotoGalleryProps) {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null)

  const images = useMemo(() => {
    const list = [mainImage, ...(extraImages || [])].filter((item): item is string => Boolean(item))
    return Array.from(new Set(list)).map((src, index) => ({
      id: `${name}-${index + 1}`,
      src,
      alt: `${name} foto ${index + 1}`,
    }))
  }, [mainImage, extraImages, name])

  if (images.length === 0) {
    return (
      <div className="relative rounded-[1.7rem] bg-slate-100/80 aspect-[4/5] flex items-center justify-center text-slate-400 text-sm">
        {emptyText || 'Photo not available'}
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
          imageClickLabel={galleryTexts?.dotLabel || 'Open image'}
          texts={galleryTexts}
        />
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setZoomImage(null)}
          role="button"
          tabIndex={0}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomImage.src}
              alt={zoomImage.alt}
              className="w-full max-h-[86vh] object-contain rounded-2xl bg-slate-900/50"
            />
          </div>
        </div>
      )}
    </>
  )
}
