'use client'
import { useEffect, type RefObject } from 'react'
import { useScramble } from './useScramble'

export function useScrambleOnView<T extends HTMLElement>(ref: RefObject<T | null>, text: string) {
  const scramble = useScramble()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          scramble(el, text)
          io.unobserve(el)
        }
      })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, text, scramble])
}
