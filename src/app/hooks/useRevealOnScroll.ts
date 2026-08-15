'use client'
import { useLayoutEffect, type RefObject } from 'react'

export function useRevealOnScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(38px)'
    el.style.transition = 'opacity .9s cubic-bezier(.52,.01,0,1), transform .9s cubic-bezier(.52,.01,0,1)'

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'none'
          io.unobserve(el)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })

    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}
