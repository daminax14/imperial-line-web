'use client'

import Link from 'next/link'
import { useState } from 'react'

type Parent = {
  name?: string
  imageUrl?: string
  titles?: string
  slug?: string
  emsCode?: string
}

type LineageTexts = {
  title: string
  subtitle: string
  sire: string
  dam: string
  details?: string
  zoom?: string
  close?: string
  unknownParent?: string
  zoomAriaPrefix?: string
  locale?: string
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
        className={`relative overflow-hidden ${compact ? 'mt-6 p-7 rounded-[2rem]' : 'mt-20 p-7 rounded-[2rem]'} border border-[#2f6f99]/35 bg-white/25 backdrop-blur-md shadow-[0_20px_45px_-35px_rgba(32,72,112,0.45)] ${className || ''}`}
      >
        <div className="absolute -inset-[2px] -z-10 rounded-[2rem]" style={{ backgroundColor: 'rgba(47, 111, 153, 0.14)' }} />

        <div className={`relative z-10 ${compact ? 'mb-4' : 'mb-4'}`}>
          <p className="text-xs uppercase tracking-[0.32em] text-[#2f6f99]/70 font-semibold mb-2">
            {texts.subtitle}
          </p>
          {texts.title ? (
            <h3 className={`${compact ? 'text-xl md:text-2xl' : 'text-xl md:text-2xl'} font-serif italic text-[#1f3c57] mb-4`}>{texts.title}</h3>
          ) : null}
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 md:gap-5">
            {father && (
              <ParentCard
                role={texts.sire}
                name={father.name}
                imageUrl={father.imageUrl}
                slug={father.slug}
                emsCode={father.emsCode}
                detailsLabel={texts.details}
                locale={texts.locale}
                onZoom={(src) => setZoomImage({ src, label: father.name || texts.sire })}
                zoomAriaPrefix={texts.zoomAriaPrefix}
                unknownLabel={texts.unknownParent}
              />
            )}

            {father && mother && (
              <div className="flex items-center justify-center pt-10 md:pt-12">
                <span className="text-[#2f6f99] text-2xl md:text-3xl font-light">×</span>
              </div>
            )}

            {mother && (
              <ParentCard
                role={texts.dam}
                name={mother.name}
                imageUrl={mother.imageUrl}
                slug={mother.slug}
                emsCode={mother.emsCode}
                detailsLabel={texts.details}
                locale={texts.locale}
                onZoom={(src) => setZoomImage({ src, label: mother.name || texts.dam })}
                zoomAriaPrefix={texts.zoomAriaPrefix}
                unknownLabel={texts.unknownParent}
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
  slug,
  emsCode,
  detailsLabel,
  locale,
  onZoom,
  zoomAriaPrefix,
  unknownLabel,
}: {
  role: string
  name?: string
  imageUrl?: string
  slug?: string
  emsCode?: string
  detailsLabel?: string
  locale?: string
  onZoom: (src: string) => void
  zoomAriaPrefix?: string
  unknownLabel?: string
}) {
  const zoomAria = zoomAriaPrefix || 'Zoom photo of'
  const unknownText = unknownLabel || 'Unknown'
  const detailsHref = slug && locale ? `/${locale}/cat/${slug}` : null

  return (
    <div className="group/parent flex flex-col items-center text-center gap-2 min-w-0 rounded-xl border border-[#2f6f99]/18 bg-white/55 backdrop-blur-sm px-4 py-4">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover/parent:scale-105">
        {imageUrl ? (
          <button
            type="button"
            onClick={() => onZoom(imageUrl)}
            className="w-full h-full"
            aria-label={`${zoomAria} ${name || role}`}
          >
            <img src={imageUrl} className="w-full h-full object-cover" alt={name || role} />
          </button>
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-2xl">◦</div>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#2f6f99]/70">
          {role}
        </p>
        <p className="text-lg md:text-xl font-serif italic text-[#1f3c57] mt-0.5 leading-tight">{name || unknownText}</p>
        {emsCode ? <p className="text-xs font-mono text-[#6a85a0]">{emsCode}</p> : null}
        {detailsHref ? (
          <Link
            href={detailsHref}
            className="gold-hover-button inline-flex items-center justify-center gap-1 mt-3 rounded-full bg-[#2f6f99] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white shadow-md"
          >
            <span>{detailsLabel || 'Full profile'}</span>
            <span>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  )
}
