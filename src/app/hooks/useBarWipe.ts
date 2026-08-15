'use client'
import { useEffect, type RefObject } from 'react'

export function useBarWipe<H extends HTMLElement, B extends HTMLElement>(
  hostRef: RefObject<H | null>,
  barRef: RefObject<B | null>
) {
  useEffect(() => {
    const host = hostRef.current
    const bar = barRef.current
    if (!host || !bar) return
    const enter = () => {
      bar.style.transition = 'width .5s cubic-bezier(.52,.01,0,1)'
      bar.style.width = '100%'
    }
    const leave = () => {
      bar.style.transition = 'width .3s cubic-bezier(.52,.01,0,1)'
      bar.style.width = '0%'
    }
    host.addEventListener('mouseenter', enter)
    host.addEventListener('mouseleave', leave)
    return () => {
      host.removeEventListener('mouseenter', enter)
      host.removeEventListener('mouseleave', leave)
    }
  }, [hostRef, barRef])
}
