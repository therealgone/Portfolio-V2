'use client'
import { useEffect } from 'react'

type Listener = () => void

const listeners = new Set<Listener>()
let raf: number | null = null
let initialized = false

function tick() {
  raf = null
  listeners.forEach(fn => fn())
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(tick)
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

export function useScrollEngine() {
  useEffect(() => {
    ensureInit()
  }, [])

  return {
    subscribe(fn: Listener) {
      listeners.add(fn)
      schedule()
      return () => {
        listeners.delete(fn)
      }
    },
  }
}
