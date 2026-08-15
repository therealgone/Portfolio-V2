'use client'
import { useEffect, type RefObject } from 'react'
import { useScramble } from './useScramble'

export function useScrambleOnHover<H extends HTMLElement, T extends HTMLElement>(
  hostRef: RefObject<H | null>,
  targetRef: RefObject<T | null>,
  text: string,
  duration = 420
) {
  const scramble = useScramble()

  useEffect(() => {
    const host = hostRef.current
    const target = targetRef.current
    if (!host || !target) return
    const handler = () => scramble(target, text, duration)
    host.addEventListener('mouseenter', handler)
    return () => host.removeEventListener('mouseenter', handler)
  }, [hostRef, targetRef, text, duration, scramble])
}
