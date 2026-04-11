"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export type HorizontalImageItem = {
  id: number | string
  src: string
  alt: string
}

type HorizontalImageStackProps = {
  images?: HorizontalImageItem[]
  className?: string
  onImageClick?: (image: HorizontalImageItem) => void
  imageClickLabel?: string
  texts?: {
    previousLabel?: string
    nextLabel?: string
    dotLabel?: string
  }
}

const defaultImages: HorizontalImageItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1400&q=80",
    alt: "Siberian cat portrait",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1400&q=80",
    alt: "Siberian cat close-up",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1400&q=80",
    alt: "Cat in natural light",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1400&q=80",
    alt: "Elegant long-haired cat",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1400&q=80",
    alt: "Siberian cat resting",
  },
]

export function HorizontalImageStack({ images = defaultImages, className = "", onImageClick, imageClickLabel, texts }: HorizontalImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const lastNavigationTime = useRef(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const dotsRailRef = useRef<HTMLDivElement | null>(null)
  const dotButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const navigationCooldown = 360

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0)
      return
    }

    setCurrentIndex((prev) => (prev >= images.length ? images.length - 1 : prev))
    dotButtonRefs.current = dotButtonRefs.current.slice(0, images.length)
  }, [images.length])

  useEffect(() => {
    const rail = dotsRailRef.current
    const currentDot = dotButtonRefs.current[currentIndex]
    if (!rail || !currentDot) return

    // Keep dot navigation local to the rail and avoid horizontal page shifts.
    const targetLeft = currentDot.offsetLeft - rail.clientWidth / 2 + currentDot.clientWidth / 2
    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const nextLeft = Math.max(0, Math.min(targetLeft, maxScrollLeft))

    rail.scrollTo({
      left: nextLeft,
      behavior: 'smooth',
    })
  }, [currentIndex, images.length])

  const navigate = useCallback(
    (direction: number) => {
      if (images.length <= 1) return

      const now = Date.now()
      if (now - lastNavigationTime.current < navigationCooldown) return
      lastNavigationTime.current = now

      setCurrentIndex((prev) => {
        if (direction > 0) return prev === images.length - 1 ? 0 : prev + 1
        return prev === 0 ? images.length - 1 : prev - 1
      })
    },
    [images.length],
  )

  const getCardStyle = (index: number) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total

    if (diff === 0) return { x: 0, scale: 1, opacity: 1, zIndex: 5, rotateY: 0 }
    if (diff === -1) return { x: -220, scale: 0.84, opacity: 0.62, zIndex: 4, rotateY: 10 }
    if (diff === -2) return { x: -360, scale: 0.72, opacity: 0.3, zIndex: 3, rotateY: 18 }
    if (diff === 1) return { x: 220, scale: 0.84, opacity: 0.62, zIndex: 4, rotateY: -10 }
    if (diff === 2) return { x: 360, scale: 0.72, opacity: 0.3, zIndex: 3, rotateY: -18 }
    return { x: diff > 0 ? 520 : -520, scale: 0.64, opacity: 0, zIndex: 0, rotateY: diff > 0 ? -22 : 22 }
  }

  const isVisible = (index: number) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return Math.abs(diff) <= 2
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchStartX.current
    const dy = touch.clientY - touchStartY.current

    touchStartX.current = null
    touchStartY.current = null

    // Handle swipe only when horizontal movement is intentional.
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return

    if (dx < 0) {
      navigate(1)
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      className={`relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl" />
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-4 md:left-8 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-md backdrop-blur hover:bg-white"
        aria-label={texts?.previousLabel || "Previous image"}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className="relative flex h-[500px] w-full max-w-[1080px] items-center justify-center" style={{ perspective: "1400px" }}>
        {images.map((image, index) => {
          if (!isVisible(index)) return null
          const style = getCardStyle(index)
          const isCurrent = index === currentIndex

          return (
            <motion.div
              key={image.id}
              className="absolute"
              animate={{ x: style.x, scale: style.scale, opacity: style.opacity, rotateY: style.rotateY, zIndex: style.zIndex }}
              transition={{ type: "spring", stiffness: 280, damping: 30, mass: 1 }}
              style={{ transformStyle: "preserve-3d", zIndex: style.zIndex }}
            >
              <button
                type="button"
                onClick={() => onImageClick?.(image)}
                aria-label={`${imageClickLabel || 'Open image'}: ${image.alt}`}
                className="relative h-[420px] w-[300px] overflow-hidden rounded-3xl border border-white/80 bg-white/90"
                style={{
                  boxShadow: isCurrent
                    ? "0 28px 48px -20px rgba(30,58,90,0.35), 0 0 0 1px rgba(255,255,255,0.6)"
                    : "0 16px 34px -18px rgba(30,58,90,0.25)",
                  cursor: onImageClick ? 'zoom-in' : 'default',
                }}
              >
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" draggable={false} />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/22 to-transparent" />
              </button>
            </motion.div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate(1)}
        className="absolute right-4 md:right-8 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-md backdrop-blur hover:bg-white"
        aria-label={texts?.nextLabel || "Next image"}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center px-14">
        <div
          ref={dotsRailRef}
          className="pointer-events-auto max-w-full overflow-x-auto rounded-full border border-white/65 bg-white/70 px-2.5 py-1 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-center gap-2.5">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            ref={(el) => {
              dotButtonRefs.current[index] = el
            }}
            className={`rounded-full transition-all duration-300 ${index === currentIndex ? "h-2.5 w-7 bg-slate-700" : "h-2.5 w-2.5 bg-slate-500/35 hover:bg-slate-500/60"}`}
            aria-label={`${texts?.dotLabel || "Go to image"} ${index + 1}`}
          />
        ))}
          </div>
        </div>
      </div>
    </div>
  )
}
