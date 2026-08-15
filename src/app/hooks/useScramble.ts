'use client'
import { useCallback, useRef } from 'react'

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/*"

export function useScramble() {
  const framesRef = useRef<Map<HTMLElement, number>>(new Map())

  return useCallback((el: HTMLElement, finalText: string, duration?: number) => {
    const existing = framesRef.current.get(el)
    if (existing) cancelAnimationFrame(existing)

    const text = finalText
    const dur = duration || 520 + text.length * 22
    const t0 = performance.now()

    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (c === ' ') { out += ' '; continue }
        const settle = ((i + 1) / text.length) * 0.85
        out += p >= settle ? c : CHARS[(Math.random() * CHARS.length) | 0]
      }
      el.textContent = out
      if (p < 1) {
        framesRef.current.set(el, requestAnimationFrame(step))
      } else {
        el.textContent = text
        framesRef.current.delete(el)
      }
    }
    framesRef.current.set(el, requestAnimationFrame(step))
  }, [])
}
