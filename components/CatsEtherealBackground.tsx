'use client'

import { Component as EtheralShadow } from '@/components/etheral-shadow'

export default function CatsEtherealBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#eaf3ff]">
      <div className="absolute inset-0">
        <EtheralShadow
          color="#386787"
          animation={{ scale: 100, speed: 95 }}
          noise={{ opacity: 0.34, scale: 1.25 }}
          sizing="fill"
          className="h-full w-full"
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(244,250,255,0.92)_0%,rgba(231,242,254,0.4)_45%,rgba(219,234,250,0.5)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(45,114,170,0.27)_0%,rgba(255,255,255,0)_40%,rgba(167,214,245,0.32)_100%)] mix-blend-soft-light" />
      <div className="absolute inset-0 opacity-[0.23] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\'0 0 220 220\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.72\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')" }} />
    </div>
  )
}
