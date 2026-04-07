'use client'

import { useMemo } from 'react'
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
  const images = useMemo(() => {
    const list = [mainImage, ...(extraImages || [])].filter((item): item is string => Boolean(item))
    return Array.from(new Set(list)).map((src, index) => ({
      id: `${name}-${index + 1}`,
      src,
      alt: `${name} foto ${index + 1}`,
    }))
  }, [mainImage, extraImages])

  if (images.length === 0) {
    return (
      <div className="relative rounded-[1.7rem] bg-slate-100/80 aspect-[4/5] flex items-center justify-center text-slate-400 text-sm">
        {emptyText || 'Photo not available'}
      </div>
    )
  }

  return (
    <div className="relative rounded-[1.7rem] overflow-hidden">
      <HorizontalImageStack
        images={images}
        className="h-[540px] min-h-0 rounded-[1.7rem] bg-transparent"
        texts={galleryTexts}
      />
    </div>
  )
}
