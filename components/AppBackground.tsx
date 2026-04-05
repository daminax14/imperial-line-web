"use client";

import { Component as EtherealShadow } from "./etheral-shadow";

export default function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <EtherealShadow
        color="rgba(128, 128, 128, 0.22)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 0.28, scale: 1.2 }}
        sizing="fill"
      />
      <div className="absolute inset-0 bg-white/55 dark:bg-black/35" />
    </div>
  );
}