'use client'

import { PropsWithChildren } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function GoldBorderCard({
  children,
  className,
  contentClassName,
}: PropsWithChildren<{
  className?: string
  contentClassName?: string
}>) {
  const reduceMotion = useReducedMotion()
  const borderThickness = 3

  return (
    <motion.article
      initial={false}
      className={cn('relative overflow-hidden rounded-2xl', className)}
      style={{
        padding: `${borderThickness}px`,
        background: 'linear-gradient(135deg, rgba(91, 64, 13, 0.95), rgba(163, 118, 20, 0.92))',
        boxShadow: '0 12px 28px -18px rgba(104, 84, 26, 0.28)',
      }}
      whileHover={reduceMotion ? { y: -4 } : { y: -4, boxShadow: '0 24px 40px -22px rgba(104, 84, 26, 0.45)' }}
      transition={{ y: { duration: 0.22, ease: 'easeOut' }, boxShadow: { duration: 0.22, ease: 'easeOut' } }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, transparent 308deg, rgba(180, 120, 10, 0.18) 320deg, rgba(243, 185, 44, 0.9) 334deg, rgba(255, 226, 122, 1) 346deg, rgba(243, 185, 44, 0.88) 355deg, transparent 360deg)',
          filter: 'saturate(1.2) brightness(1.06)',
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: 'linear' }}
      />

      <div
        className={cn(
          'relative h-full rounded-[calc(1rem-3px)] overflow-hidden border border-white/70 bg-[rgba(244,248,252,0.94)] backdrop-blur-sm shadow-sm transition-shadow duration-300',
          contentClassName,
        )}
      >
        {children}
      </div>
    </motion.article>
  )
}