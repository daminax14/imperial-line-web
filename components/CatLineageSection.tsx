'use client'

import { useState } from 'react'

type Parent = {
  name?: string
  imageUrl?: string
  titles?: string
}

type LineageTexts = {
  title: string
  subtitle: string
  sire: string
  dam: string
  zoom?: string
  close?: string
  unknownParent?: string
  zoomAriaPrefix?: string
}

export default function CatLineageSection({
  father,
  mother,
  texts,
  className,
  compact = false,
}: {
  father?: Parent
  mother?: Parent
  texts: LineageTexts
  className?: string
  compact?: boolean
}) {
  const [zoomImage, setZoomImage] = useState<{ src: string; label: string } | null>(null)

  const hasLineage = Boolean(father || mother)
  if (!hasLineage) return null

  return (
    <>
      <section
        className={`${compact ? 'py-10 rounded-[2rem]' : 'py-20 rounded-[3rem]'} bg-white/85 shadow-sm border border-slate-100 relative overflow-hidden ${className || 'mt-20'}`}
      >
        <div className={`text-center relative z-10 ${compact ? 'mb-10' : 'mb-16'}`}>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-200 font-bold">{texts.subtitle}</p>
          <h3 className={`${compact ? 'text-2xl' : 'text-4xl'} font-serif mt-2 italic text-slate-900`}>{texts.title}</h3>
        </div>

        <div className="flex flex-col items-center gap-0 relative z-10 px-6">
          <div className={`flex items-start justify-center w-full ${compact ? 'gap-8 md:gap-14' : 'gap-10 md:gap-36'}`}>
            {father && (
              <ParentCard
                role={texts.sire}
                name={father.name}
                imageUrl={father.imageUrl}
                onZoom={(src) => setZoomImage({ src, label: father.name || texts.sire })}
                zoomAriaPrefix={texts.zoomAriaPrefix}
                compact={compact}
              />
            )}

            {mother && (
              <ParentCard
                role={texts.dam}
                name={mother.name}
                imageUrl={mother.imageUrl}
                onZoom={(src) => setZoomImage({ src, label: mother.name || texts.dam })}
                zoomAriaPrefix={texts.zoomAriaPrefix}
                compact={compact}
              />
            )}
          </div>
        </div>
      </section>

      {zoomImage && (
        <div
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setZoomImage(null)}
          role="button"
          tabIndex={0}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute -top-10 right-0 text-white text-sm uppercase tracking-widest"
            >
              {texts.close || 'Close'} ✕
            </button>
            <img
              src={zoomImage.src}
              alt={zoomImage.label}
              className="w-full max-h-[86vh] object-contain rounded-2xl bg-slate-900/50"
            />
          </div>
        </div>
      )}
    </>
  )
}

function ParentCard({
  role,
  name,
  imageUrl,
  onZoom,
  zoomAriaPrefix,
  compact,
}: {
  role: string
  name?: string
  imageUrl?: string
  onZoom: (src: string) => void
  zoomAriaPrefix?: string
  compact?: boolean
}) {
  const zoomAria = zoomAriaPrefix || 'Zoom photo of'

  return (
    <div className="text-center flex flex-col items-center gap-0 self-start">
      <div className={`relative rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 ${compact ? 'w-32 h-32 md:w-40 md:h-40' : 'w-36 h-36 md:w-48 md:h-48'}`}>
        {imageUrl ? (
          <>
            <button
              type="button"
              onClick={() => onZoom(imageUrl)}
              className="w-full h-full"
              aria-label={`${zoomAria} ${name || role}`}
            >
              <img src={imageUrl} className="w-full h-full object-cover" alt={name || role} />
            </button>
          </>
        ) : (
          <span className="flex items-center justify-center w-full h-full text-[10px] uppercase tracking-widest text-zinc-400">Img</span>
        )}
      </div>
    </div>
  )
}
