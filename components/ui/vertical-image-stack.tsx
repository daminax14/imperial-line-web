"use client"

import { HorizontalImageStack, type HorizontalImageItem } from "@/components/ui/horizontal-image-stack"

type VerticalImageStackProps = {
  images?: HorizontalImageItem[]
  className?: string
}

export function VerticalImageStack({ images, className }: VerticalImageStackProps) {
  return <HorizontalImageStack images={images} className={className} />
}
