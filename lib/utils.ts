import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLitterDisplayTitle(title?: string, letter?: string, fallback: string = 'Litter'): string {
  const base = (title || fallback).trim() || fallback
  const normalizedLetter = (letter || '').trim().toUpperCase()
  if (!normalizedLetter) return base

  const escapedLetter = normalizedLetter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (new RegExp(`\\b${escapedLetter}\\b`, 'i').test(base)) {
    return base
  }

  return `${base} ${normalizedLetter}`
}
